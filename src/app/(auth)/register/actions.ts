"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const registerSchema = z
  .object({
    full_name: z.string().trim().min(2, "Укажите имя и фамилию."),
    email: z.string().trim().email("Введите корректный email."),
    phone: z.string().trim().optional(),
    password: z.string().min(8, "Пароль должен быть не короче 8 символов."),
    password_confirm: z.string().min(1, "Повторите пароль.")
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Пароли не совпадают.",
    path: ["password_confirm"]
  });

function redirectWithStatus(status: "success" | "error", message?: string): never {
  const params = new URLSearchParams({ status });

  if (message) {
    params.set("message", message);
  }

  redirect(`/register?${params.toString()}`);
}

export async function register(formData: FormData) {
  const parsed = registerSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    password_confirm: formData.get("password_confirm")
  });

  if (!parsed.success) {
    redirectWithStatus(
      "error",
      parsed.error.issues[0]?.message ?? "Проверьте данные для регистрации."
    );
  }

  let supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;

  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    console.error("Supabase environment is not configured", error);
    redirectWithStatus("error", "Регистрация временно недоступна: не настроено подключение к Supabase.");
  }

  const { full_name, email, phone, password } = parsed.data;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        phone: phone || null
      }
    }
  });

  if (error) {
    redirectWithStatus(
      "error",
      "Не удалось создать аккаунт. Проверьте данные или попробуйте позже."
    );
  }

  if (data.session) {
    redirect("/app");
  }

  redirectWithStatus(
    "success",
    "Аккаунт создан. Проверьте почту, если Supabase требует подтверждение email."
  );
}
