"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/current-user";
import { canManageRoles } from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { roleChangeSchema } from "@/lib/validations/role-management";

function readString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function redirectWithResult(type: "success" | "error", message: string): never {
  const params = new URLSearchParams({
    message,
    type
  });

  redirect(`/admin/roles?${params.toString()}`);
}

export async function updateProfileRole(formData: FormData) {
  const currentUser = await requireAdminUser();

  if (!canManageRoles(currentUser.role)) {
    redirectWithResult(
      "error",
      "У вашей роли нет доступа к изменению ролей пользователей."
    );
  }

  const parsed = roleChangeSchema.safeParse({
    new_role: readString(formData.get("new_role")),
    reason: readString(formData.get("reason")),
    target_profile_id: readString(formData.get("target_profile_id"))
  });

  if (!parsed.success) {
    redirectWithResult(
      "error",
      parsed.error.issues[0]?.message ?? "Проверьте данные изменения роли."
    );
  }

  const actorProfileId = currentUser.profile?.id ?? currentUser.user.id;

  if (parsed.data.target_profile_id === actorProfileId) {
    redirectWithResult("error", "Нельзя изменить собственную роль.");
  }

  if (currentUser.role === "cto" && parsed.data.new_role === "founder_ceo") {
    redirectWithResult(
      "error",
      "Только Founder/CEO может назначать роль Founder/CEO."
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("update_profile_role", {
    new_role: parsed.data.new_role,
    reason: parsed.data.reason,
    target_profile_id: parsed.data.target_profile_id
  });

  if (error) {
    console.error("Role update failed", error);
    redirectWithResult(
      "error",
      "Не удалось изменить роль. Проверьте ограничения безопасности и попробуйте ещё раз."
    );
  }

  revalidatePath("/admin/roles");
  redirectWithResult("success", "Роль пользователя обновлена.");
}
