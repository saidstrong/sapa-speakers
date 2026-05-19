"use server";

import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CERTIFICATE_FILES_BUCKET } from "@/lib/storage/certificates";
import { certificateIdSchema } from "@/lib/validations/certificate";

function redirectWithResult(type: "success" | "error", message: string): never {
  const params = new URLSearchParams({
    type,
    message
  });

  redirect(`/app/certificates?${params.toString()}`);
}

export async function downloadCurrentVolunteerCertificatePdf(certificateId: string) {
  const parsedId = certificateIdSchema.safeParse(certificateId);

  if (!parsedId.success) {
    redirectWithResult("error", "Сертификат не найден.");
  }

  const currentUser = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const profileId = currentUser.profile?.id ?? currentUser.user.id;
  const { data: volunteer, error: volunteerError } = await supabase
    .from("volunteers")
    .select("id")
    .eq("profile_id", profileId)
    .eq("status", "active")
    .maybeSingle();

  if (volunteerError) {
    throw new Error("Не удалось проверить волонтёрский профиль.");
  }

  if (!volunteer) {
    redirectWithResult("error", "Сертификаты доступны только одобренным волонтёрам.");
  }

  const { data: certificate, error } = await supabase
    .from("certificates")
    .select("id, file_path, file_name, status")
    .eq("id", parsedId.data)
    .eq("volunteer_id", volunteer.id)
    .eq("status", "issued")
    .maybeSingle();

  if (error) {
    throw new Error("Не удалось проверить PDF сертификата.");
  }

  const certificateRecord = certificate as {
    file_name: string | null;
    file_path: string | null;
    status: string;
  } | null;

  if (!certificateRecord?.file_path) {
    redirectWithResult("error", "PDF ещё не прикреплён.");
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(CERTIFICATE_FILES_BUCKET)
    .createSignedUrl(certificateRecord.file_path, 60, {
      download: certificateRecord.file_name ?? "certificate.pdf"
    });

  if (signedUrlError || !data?.signedUrl) {
    console.error("Certificate PDF signed URL failed", signedUrlError);
    redirectWithResult("error", "Не удалось подготовить PDF к скачиванию.");
  }

  redirect(data.signedUrl);
}
