"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getWorkspacePathForRoles } from "@/lib/auth/current-user";
import { isRoleKey } from "@/lib/auth/roles";
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

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

async function resolvePostLoginRedirectPath(
  supabase: SupabaseServerClient,
  userId: string | undefined
) {
  if (!userId) {
    return "/app";
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Profile lookup after login failed", error);
      return "/app";
    }

    const role = isRoleKey(data?.role) ? data.role : "volunteer";

    return getWorkspacePathForRoles([role]);
  } catch (error) {
    console.error("Profile lookup after login failed", error);
    return "/app";
  }
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

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirectWithStatus("Не удалось войти. Проверьте email и пароль.");
  }

  const workspacePath = await resolvePostLoginRedirectPath(
    supabase,
    data.user?.id
  );

  redirect(workspacePath);
}
