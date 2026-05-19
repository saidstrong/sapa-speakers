import { requireAdminUser, type CurrentUser } from "@/lib/auth/current-user";
import {
  canManageRoles,
  isRoleKey,
  type RoleKey
} from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { roleManagementFiltersSchema } from "@/lib/validations/role-management";

export type RoleManagementProfile = {
  created_at: string | null;
  email: string;
  full_name: string | null;
  id: string;
  role: RoleKey;
  volunteerStatus: string | null;
};

export type RoleChangeLog = {
  actorEmail: string | null;
  actorName: string | null;
  created_at: string;
  id: string;
  new_role: RoleKey;
  old_role: RoleKey;
  reason: string | null;
  targetEmail: string | null;
  targetName: string | null;
};

export type RoleManagementData = {
  currentUser: CurrentUser & { user: NonNullable<CurrentUser["user"]> };
  filters: {
    q: string;
    role: RoleKey | "all";
  };
  isRoleManager: boolean;
  profiles: RoleManagementProfile[];
  recentLogs: RoleChangeLog[];
};

type ProfileRow = {
  created_at: string | null;
  email: string;
  full_name: string | null;
  id: string;
  role: string;
};

type VolunteerRow = {
  profile_id: string;
  status: string;
};

type RoleChangeLogRow = {
  actor_profile_id: string | null;
  created_at: string;
  id: string;
  new_role: string;
  old_role: string;
  reason: string | null;
  target_profile_id: string | null;
};

function normalizeRole(role: string): RoleKey {
  return isRoleKey(role) ? role : "volunteer";
}

function normalizeFilters(searchParams: {
  q?: string;
  role?: string;
}) {
  const parsed = roleManagementFiltersSchema.parse(searchParams);

  return {
    q: parsed.q ?? "",
    role: parsed.role ?? "all"
  };
}

function profileMatchesQuery(profile: RoleManagementProfile, query: string) {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.toLowerCase();

  return [
    profile.email,
    profile.full_name ?? ""
  ].some((value) => value.toLowerCase().includes(normalizedQuery));
}

export async function getRoleManagementData(searchParams: {
  q?: string;
  role?: string;
}): Promise<RoleManagementData> {
  const currentUser = await requireAdminUser();
  const filters = normalizeFilters(searchParams);
  const isRoleManager = canManageRoles(currentUser.role);

  if (!isRoleManager) {
    return {
      currentUser,
      filters,
      isRoleManager,
      profiles: [],
      recentLogs: []
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: profileRows, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (profilesError) {
    throw new Error("Не удалось загрузить профили для управления ролями.");
  }

  const profiles = ((profileRows ?? []) as ProfileRow[]).map((profile) => ({
    created_at: profile.created_at,
    email: profile.email,
    full_name: profile.full_name,
    id: profile.id,
    role: normalizeRole(profile.role),
    volunteerStatus: null
  }));

  const profileIds = profiles.map((profile) => profile.id);
  const { data: volunteerRows, error: volunteersError } =
    profileIds.length > 0
      ? await supabase
          .from("volunteers")
          .select("profile_id, status")
          .in("profile_id", profileIds)
      : { data: [], error: null };

  if (volunteersError) {
    throw new Error("Не удалось загрузить волонтёрские статусы.");
  }

  const volunteerStatusByProfileId = new Map(
    ((volunteerRows ?? []) as VolunteerRow[]).map((volunteer) => [
      volunteer.profile_id,
      volunteer.status
    ])
  );

  const profilesWithVolunteerStatus = profiles
    .map((profile) => ({
      ...profile,
      volunteerStatus: volunteerStatusByProfileId.get(profile.id) ?? null
    }))
    .filter((profile) => filters.role === "all" || profile.role === filters.role)
    .filter((profile) => profileMatchesQuery(profile, filters.q));

  const { data: logRows, error: logsError } = await supabase
    .from("role_change_logs")
    .select("id, actor_profile_id, target_profile_id, old_role, new_role, reason, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (logsError) {
    throw new Error("Не удалось загрузить историю изменений ролей.");
  }

  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const recentLogs = ((logRows ?? []) as RoleChangeLogRow[]).map((log) => {
    const actor = log.actor_profile_id
      ? profileById.get(log.actor_profile_id) ?? null
      : null;
    const target = log.target_profile_id
      ? profileById.get(log.target_profile_id) ?? null
      : null;

    return {
      actorEmail: actor?.email ?? null,
      actorName: actor?.full_name ?? null,
      created_at: log.created_at,
      id: log.id,
      new_role: normalizeRole(log.new_role),
      old_role: normalizeRole(log.old_role),
      reason: log.reason,
      targetEmail: target?.email ?? null,
      targetName: target?.full_name ?? null
    };
  });

  return {
    currentUser,
    filters,
    isRoleManager,
    profiles: profilesWithVolunteerStatus,
    recentLogs
  };
}
