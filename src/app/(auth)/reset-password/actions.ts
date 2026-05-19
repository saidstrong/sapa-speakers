"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  redirect(`/reset-password?${params.toString()}`);
}

export async function resetPassword(formData: FormData) {
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
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirectWithResult(
      "error",
      "Сессия восстановления недействительна или устарела. Запросите новую ссылку."
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.new_password
  });

  if (error) {
    redirectWithResult(
      "error",
      "Не удалось обновить пароль. Проверьте ссылку восстановления и попробуйте ещё раз."
    );
  }

  await supabase.auth.signOut();

  const params = new URLSearchParams({
    message: "Пароль обновлён. Войдите с новым паролем.",
    status: "success"
  });

  redirect(`/login?${params.toString()}`);
}
