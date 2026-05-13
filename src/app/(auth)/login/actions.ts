"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().email("Введите корректный email."),
  password: z.string().min(1, "Введите пароль.")
});

function redirectWithStatus(message: string): never {
  const params = new URLSearchParams({
    status: "error",
    message
  });

  redirect(`/login?${params.toString()}`);
}

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    redirectWithStatus(parsed.error.issues[0]?.message ?? "Проверьте данные для входа.");
  }

  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;

  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    console.error("Supabase environment is not configured", error);
    redirectWithStatus("Вход временно недоступен: не настроено подключение к Supabase.");
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirectWithStatus("Не удалось войти. Проверьте email и пароль.");
  }

  redirect("/app");
}
