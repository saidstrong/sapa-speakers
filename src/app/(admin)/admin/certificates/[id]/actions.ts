"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { revokeCertificateForAdmin } from "@/lib/queries/certificates";
import {
  certificateIdSchema,
  parseCertificateRevocationFormData
} from "@/lib/validations/certificate";

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

export async function revokeCertificate(certificateId: string, formData: FormData) {
  const parsedId = certificateIdSchema.safeParse(certificateId);

  if (!parsedId.success) {
    redirect("/admin/certificates");
  }

  const parsedForm = parseCertificateRevocationFormData(formData);

  if (!parsedForm.success) {
    redirectWithResult(
      parsedId.data,
      "error",
      parsedForm.error.issues[0]?.message ?? "Укажите причину отзыва сертификата."
    );
  }

  const result = await revokeCertificateForAdmin({
    certificateId: parsedId.data,
    revocationReason: parsedForm.data.revocation_reason
  });

  if (result.status === "not_found") {
    redirect("/admin/certificates");
  }

  if (result.status === "invalid_reason") {
    redirectWithResult(parsedId.data, "error", "Укажите причину отзыва сертификата.");
  }

  revalidatePath("/admin/certificates");
  revalidatePath(`/admin/certificates/${parsedId.data}`);
  revalidatePath("/app/certificates");

  if (result.volunteerId) {
    revalidatePath(`/admin/volunteers/${result.volunteerId}`);
  }

  if (result.status === "already_revoked") {
    redirectWithResult(parsedId.data, "error", "Сертификат уже отозван.");
  }

  redirectWithResult(parsedId.data, "success", "Сертификат отозван.");
}
