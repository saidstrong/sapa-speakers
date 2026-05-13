import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/env";

export function createSupabaseServerClient() {
  const { url, anonKey } = getSupabasePublicEnv();

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  });
}
