"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  buildAvatarPath,
  PROFILE_AVATARS_BUCKET,
  validateAvatarFile
} from "@/lib/storage/avatars";
import { profileUpdateSchema } from "@/lib/validations/profile";

const passwordUpdateSchema = z
  .object({
    new_password: z.string().min(8, "Пароль должен быть не короче 8 символов."),
    password_confirm: z.string().min(1, "Повторите пароль.")
  })
  .refine((data) => data.new_password === data.password_confirm, {
    message: "Пароли не совпадают.",
    path: ["password_confirm"]
  });

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

export async function updatePassword(formData: FormData) {
  await requireCurrentUser();
  const parsed = passwordUpdateSchema.safeParse({
    new_password: readString(formData.get("new_password")),
    password_confirm: readString(formData.get("password_confirm"))
  });

  if (!parsed.success) {
    redirectWithResult(
      "error",
      parsed.error.issues[0]?.message ?? "Проверьте новый пароль."
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.new_password
  });

  if (error) {
    redirectWithResult(
      "error",
      "Не удалось обновить пароль. Попробуйте ещё раз или выйдите и используйте восстановление пароля."
    );
  }

  redirectWithResult("success", "Пароль обновлён.");
}

export async function uploadAvatar(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const file = formData.get("avatar");
  const avatarFile = file instanceof File ? file : null;
  const validationMessage = validateAvatarFile(avatarFile);

  if (validationMessage || !avatarFile) {
    redirectWithResult(
      "error",
      validationMessage ?? "Выберите файл фото профиля."
    );
  }

  const supabase = await createSupabaseServerClient();
  const profileId = currentUser.profile?.id ?? currentUser.user.id;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, avatar_path")
    .eq("id", profileId)
    .maybeSingle();

  if (profileError || !profile) {
    redirectWithResult(
      "error",
      "Не удалось проверить профиль перед загрузкой фото."
    );
  }

  const profileRow = profile as {
    avatar_path: string | null;
    id: string;
  };
  const filePath = buildAvatarPath(profileId, avatarFile);
  const fileBuffer = Buffer.from(await avatarFile.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(PROFILE_AVATARS_BUCKET)
    .upload(filePath, fileBuffer, {
      contentType: avatarFile.type,
      upsert: false
    });

  if (uploadError) {
    console.error("Profile avatar upload failed", uploadError);
    redirectWithResult("error", "Не удалось загрузить фото профиля.");
  }

  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update({
      avatar_path: filePath,
      avatar_file_name: avatarFile.name,
      avatar_file_size_bytes: avatarFile.size,
      avatar_mime_type: avatarFile.type,
      avatar_uploaded_at: new Date().toISOString()
    })
    .eq("id", profileId)
    .select("id")
    .maybeSingle();

  if (updateError || !updatedProfile) {
    console.error("Profile avatar metadata update failed", updateError);
    await supabase.storage.from(PROFILE_AVATARS_BUCKET).remove([filePath]);
    redirectWithResult(
      "error",
      "Фото загружено, но не удалось сохранить данные профиля."
    );
  }

  if (profileRow.avatar_path && profileRow.avatar_path !== filePath) {
    await supabase.storage.from(PROFILE_AVATARS_BUCKET).remove([profileRow.avatar_path]);
  }

  revalidatePath("/app");
  revalidatePath("/app/profile");
  revalidatePath("/admin/volunteers");
  redirectWithResult("success", "Фото профиля обновлено.");
}
