"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseCertificateFormData } from "@/lib/validations/certificate";

const volunteerIdSchema = z.string().uuid();

function redirectWithResult(
  volunteerId: string,
  type: "success" | "error",
  message: string
): never {
  const params = new URLSearchParams({
    type,
    message
  });

  redirect(`/admin/volunteers/${volunteerId}?${params.toString()}`);
}

export async function issueCertificate(volunteerId: string, formData: FormData) {
  const parsedId = volunteerIdSchema.safeParse(volunteerId);

  if (!parsedId.success) {
    redirect("/admin/volunteers");
  }

  const parsedForm = parseCertificateFormData(formData);

  if (!parsedForm.success) {
    redirectWithResult(
      parsedId.data,
      "error",
      parsedForm.error.issues[0]?.message ?? "Проверьте данные сертификата."
    );
  }

  const currentUser = await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data: volunteer, error: volunteerError } = await supabase
    .from("volunteers")
    .select("id")
    .eq("id", parsedId.data)
    .maybeSingle();

  if (volunteerError || !volunteer) {
    redirectWithResult(parsedId.data, "error", "Волонтёрская карточка не найдена.");
  }

  const { data, error } = await supabase
    .from("certificates")
    .insert({
      ...parsedForm.data,
      volunteer_id: parsedId.data,
      status: "issued",
      issued_by: currentUser.profile?.id ?? currentUser.user.id
    })
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectWithResult(parsedId.data, "error", "Не удалось выдать сертификат.");
  }

  revalidatePath("/admin/certificates");
  revalidatePath(`/admin/volunteers/${parsedId.data}`);
  revalidatePath("/app/certificates");
  redirectWithResult(parsedId.data, "success", "Сертификат выдан.");
}
