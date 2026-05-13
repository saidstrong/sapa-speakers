import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cache } from "react";
import { hasAdminAccess } from "@/lib/auth/permissions";
import { isRoleKey, type RoleKey } from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentUserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  telegram: string | null;
  role: RoleKey;
  created_at: string | null;
  updated_at: string | null;
};

export type CurrentUser = {
  user: User | null;
  profile: CurrentUserProfile | null;
  role: RoleKey;
  roles: readonly RoleKey[];
  isAdmin: boolean;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      role: "volunteer",
      roles: [],
      isAdmin: false
    };
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, telegram, role, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  const role = isRoleKey(data?.role) ? data.role : "volunteer";
  const roles = [role] as const;

  return {
    user,
    profile: data
      ? {
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          telegram: data.telegram,
          role,
          created_at: data.created_at,
          updated_at: data.updated_at
        }
      : null,
    role,
    roles,
    isAdmin: hasAdminAccess(roles)
  };
});

export async function requireCurrentUser() {
  const currentUser = await getCurrentUser();

  if (!currentUser.user) {
    redirect("/login");
  }

  return currentUser as CurrentUser & { user: User };
}

export async function requireAdminUser() {
  const currentUser = await requireCurrentUser();

  if (!currentUser.isAdmin) {
    redirect("/app");
  }

  return currentUser;
}
