"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const genericResetMessage =
  "Если аккаунт с такой почтой существует, мы отправили ссылку для восстановления пароля.";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Введите корректный email.")
});

function redirectWithStatus(status: "success" | "error", message: string): never {
  const params = new URLSearchParams({
    message,
    status
  });

  redirect(`/forgot-password?${params.toString()}`);
}

function getPasswordResetRedirectUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

  return new URL("/reset-password", appUrl).toString();
}

export async function requestPasswordReset(formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email")
  });

  if (!parsed.success) {
    redirectWithStatus(
      "error",
      parsed.error.issues[0]?.message ?? "Введите корректный email."
    );
  }

  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;

  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    console.error("Supabase environment is not configured", error);
    redirectWithStatus(
      "error",
      "Восстановление пароля временно недоступно: не настроено подключение к Supabase."
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: getPasswordResetRedirectUrl()
  });

  if (error) {
    console.error("Password reset request failed", error);
  }

  redirectWithStatus("success", genericResetMessage);
}
