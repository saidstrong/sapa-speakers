"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { profileUpdateSchema } from "@/lib/validations/profile";

function readString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function redirectWithResult(type: "success" | "error", message: string): never {
  const params = new URLSearchParams({
    message,
    type
  });

  redirect(`/app/profile?${params.toString()}`);
}

export async function updateProfile(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const parsed = profileUpdateSchema.safeParse({
    full_name: readString(formData.get("full_name")),
    phone: readString(formData.get("phone")),
    telegram: readString(formData.get("telegram"))
  });

  if (!parsed.success) {
    redirectWithResult(
      "error",
      parsed.error.issues[0]?.message ?? "Проверьте данные профиля."
    );
  }

  const supabase = await createSupabaseServerClient();
  const profileId = currentUser.profile?.id ?? currentUser.user.id;
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      telegram: parsed.data.telegram
    })
    .eq("id", profileId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectWithResult(
      "error",
      "Не удалось обновить профиль. Проверьте права доступа и попробуйте ещё раз."
    );
  }

  revalidatePath("/app");
  revalidatePath("/app/profile");
  redirectWithResult("success", "Профиль обновлён.");
}
