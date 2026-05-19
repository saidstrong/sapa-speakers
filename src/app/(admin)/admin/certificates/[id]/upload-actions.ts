"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  buildCertificatePdfPath,
  canUploadCertificatePdf,
  CERTIFICATE_FILES_BUCKET,
  CERTIFICATE_PDF_MIME_TYPE,
  validateCertificatePdfFile
} from "@/lib/storage/certificates";
import { certificateIdSchema } from "@/lib/validations/certificate";

function redirectWithResult(
  certificateId: string,
  type: "success" | "error",
  message: string
): never {
  const params = new URLSearchParams({
    type,
    message
  });

  redirect(`/admin/certificates/${certificateId}?${params.toString()}`);
}

export async function uploadCertificatePdf(certificateId: string, formData: FormData) {
  const parsedId = certificateIdSchema.safeParse(certificateId);

  if (!parsedId.success) {
    redirect("/admin/certificates");
  }

  const currentUser = await requireAdminUser();

  if (!canUploadCertificatePdf(currentUser.role)) {
    redirectWithResult(
      parsedId.data,
      "error",
      "У вашей роли нет доступа к загрузке официальных PDF сертификатов."
    );
  }

  const file = formData.get("certificate_pdf");
  const pdfFile = file instanceof File ? file : null;
  const validationMessage = validateCertificatePdfFile(pdfFile);

  if (validationMessage || !pdfFile) {
    redirectWithResult(
      parsedId.data,
      "error",
      validationMessage ?? "Выберите PDF-файл сертификата."
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: certificate, error: certificateError } = await supabase
    .from("certificates")
    .select("id, volunteer_id, status, file_path")
    .eq("id", parsedId.data)
    .maybeSingle();

  if (certificateError) {
    throw new Error("Не удалось проверить сертификат перед загрузкой PDF.");
  }

  if (!certificate) {
    redirect("/admin/certificates");
  }

  const certificateRecord = certificate as {
    file_path: string | null;
    id: string;
    status: string;
    volunteer_id: string;
  };

  if (certificateRecord.status !== "issued") {
    redirectWithResult(
      parsedId.data,
      "error",
      "PDF можно загрузить или заменить только для выданного сертификата."
    );
  }

  const previousPath = certificateRecord.file_path;
  const filePath = buildCertificatePdfPath(parsedId.data, pdfFile.name);
  const fileBuffer = Buffer.from(await pdfFile.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(CERTIFICATE_FILES_BUCKET)
    .upload(filePath, fileBuffer, {
      contentType: CERTIFICATE_PDF_MIME_TYPE,
      upsert: false
    });

  if (uploadError) {
    console.error("Certificate PDF upload failed", uploadError);
    redirectWithResult(
      parsedId.data,
      "error",
      "Не удалось загрузить PDF сертификата."
    );
  }

  const { error: updateError } = await supabase
    .from("certificates")
    .update({
      file_path: filePath,
      file_name: pdfFile.name,
      file_size_bytes: pdfFile.size,
      file_mime_type: CERTIFICATE_PDF_MIME_TYPE,
      file_uploaded_by: currentUser.profile?.id ?? currentUser.user.id,
      file_uploaded_at: new Date().toISOString()
    })
    .eq("id", parsedId.data)
    .eq("status", "issued");

  if (updateError) {
    console.error("Certificate PDF metadata update failed", updateError);
    await supabase.storage.from(CERTIFICATE_FILES_BUCKET).remove([filePath]);
    redirectWithResult(
      parsedId.data,
      "error",
      "PDF загружен, но не удалось сохранить данные файла."
    );
  }

  if (previousPath && previousPath !== filePath) {
    await supabase.storage.from(CERTIFICATE_FILES_BUCKET).remove([previousPath]);
  }

  revalidatePath("/admin/certificates");
  revalidatePath(`/admin/certificates/${parsedId.data}`);
  revalidatePath(`/admin/volunteers/${certificateRecord.volunteer_id}`);
  revalidatePath("/app/certificates");
  redirectWithResult(parsedId.data, "success", "PDF сертификата сохранён.");
}

export async function downloadCertificatePdfForAdmin(certificateId: string) {
  const parsedId = certificateIdSchema.safeParse(certificateId);

  if (!parsedId.success) {
    redirect("/admin/certificates");
  }

  await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const { data: certificate, error } = await supabase
    .from("certificates")
    .select("file_path, file_name")
    .eq("id", parsedId.data)
    .maybeSingle();

  if (error) {
    throw new Error("Не удалось проверить PDF сертификата.");
  }

  const certificateRecord = certificate as {
    file_name: string | null;
    file_path: string | null;
  } | null;

  if (!certificateRecord?.file_path) {
    redirectWithResult(parsedId.data, "error", "PDF ещё не прикреплён.");
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(CERTIFICATE_FILES_BUCKET)
    .createSignedUrl(certificateRecord.file_path, 60, {
      download: certificateRecord.file_name ?? "certificate.pdf"
    });

  if (signedUrlError || !data?.signedUrl) {
    console.error("Certificate PDF signed URL failed", signedUrlError);
    redirectWithResult(parsedId.data, "error", "Не удалось подготовить PDF к скачиванию.");
  }

  redirect(data.signedUrl);
}
