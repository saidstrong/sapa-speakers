const missingSupabaseEnvMessage =
  "Не настроены переменные окружения Supabase. Заполните NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY.";

export type SupabasePublicEnv = {
  url: string;
  anonKey: string;
};

function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

export function hasSupabasePublicEnv() {
  return Boolean(
    readEnv("NEXT_PUBLIC_SUPABASE_URL") &&
      readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    throw new Error(missingSupabaseEnvMessage);
  }

  return { url, anonKey };
}

export function getSupabaseServiceRoleKey() {
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!serviceRoleKey) {
    throw new Error(
      "Не настроена переменная SUPABASE_SERVICE_ROLE_KEY. Используйте её только на сервере."
    );
  }

  return serviceRoleKey;
}

export { missingSupabaseEnvMessage };
