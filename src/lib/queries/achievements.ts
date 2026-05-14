import { requireAdminUser, requireCurrentUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  achievementStatuses,
  achievementTypes,
  type AchievementStatus,
  type AchievementType
} from "@/lib/validations/achievement";

export type AchievementRecord = {
  id: string;
  volunteer_id: string;
  title: string;
  description: string | null;
  achievement_type: AchievementType;
  status: AchievementStatus;
  awarded_by: string | null;
  awarded_at: string;
  revoked_at: string | null;
  revocation_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type AchievementVolunteer = {
  id: string;
  profile_id: string;
  status: string;
};

export type AchievementProfile = {
  id: string;
  email: string;
  full_name: string | null;
};

export type AchievementListItem = AchievementRecord & {
  awardedByProfile: AchievementProfile | null;
  volunteer: AchievementVolunteer | null;
  volunteerProfile: AchievementProfile | null;
};

export type CurrentVolunteerAchievements = {
  achievements: AchievementListItem[];
  volunteer: AchievementVolunteer | null;
};

type AchievementRow = Omit<
  AchievementRecord,
  "achievement_type" | "status"
> & {
  achievement_type: string;
  status: string;
};

type AchievementVolunteerRow = AchievementVolunteer;

type AchievementProfileRow = AchievementProfile;

const achievementFields =
  "id, volunteer_id, title, description, achievement_type, status, awarded_by, awarded_at, revoked_at, revocation_reason, created_at, updated_at";

function isAchievementType(value: string): value is AchievementType {
  return achievementTypes.includes(value as AchievementType);
}

function isAchievementStatus(value: string): value is AchievementStatus {
  return achievementStatuses.includes(value as AchievementStatus);
}

function normalizeAchievement(row: AchievementRow): AchievementRecord {
  return {
    ...row,
    achievement_type: isAchievementType(row.achievement_type)
      ? row.achievement_type
      : "general",
    status: isAchievementStatus(row.status) ? row.status : "awarded"
  };
}

function uniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter(Boolean))) as string[];
}

async function hydrateAchievements(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  achievements: readonly AchievementRecord[]
): Promise<AchievementListItem[]> {
  if (achievements.length === 0) {
    return [];
  }

  const volunteerIds = uniqueValues(
    achievements.map((achievement) => achievement.volunteer_id)
  );
  const awardedByIds = uniqueValues(
    achievements.map((achievement) => achievement.awarded_by)
  );

  const { data: volunteerRows, error: volunteersError } = await supabase
    .from("volunteers")
    .select("id, profile_id, status")
    .in("id", volunteerIds);

  if (volunteersError) {
    throw new Error("Не удалось загрузить волонтёрские карточки достижений.");
  }

  const volunteers = (volunteerRows ?? []) as AchievementVolunteerRow[];
  const volunteersById = new Map(volunteers.map((volunteer) => [volunteer.id, volunteer]));
  const profileIds = uniqueValues([
    ...volunteers.map((volunteer) => volunteer.profile_id),
    ...awardedByIds
  ]);

  const { data: profileRows, error: profilesError } =
    profileIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", profileIds)
      : { data: [], error: null };

  if (profilesError) {
    throw new Error("Не удалось загрузить профили достижений.");
  }

  const profilesById = new Map(
    ((profileRows ?? []) as AchievementProfileRow[]).map((profile) => [
      profile.id,
      profile
    ])
  );

  return achievements.map((achievement) => {
    const volunteer = volunteersById.get(achievement.volunteer_id) ?? null;

    return {
      ...achievement,
      awardedByProfile: achievement.awarded_by
        ? profilesById.get(achievement.awarded_by) ?? null
        : null,
      volunteer,
      volunteerProfile: volunteer
        ? profilesById.get(volunteer.profile_id) ?? null
        : null
    };
  });
}

export async function listAchievementsForAdmin(): Promise<AchievementListItem[]> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("achievements")
    .select(achievementFields)
    .order("awarded_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить достижения.");
  }

  return hydrateAchievements(
    supabase,
    ((data ?? []) as AchievementRow[]).map(normalizeAchievement)
  );
}

export async function listVolunteerAchievementsForAdmin(
  volunteerId: string
): Promise<AchievementListItem[]> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("achievements")
    .select(achievementFields)
    .eq("volunteer_id", volunteerId)
    .order("awarded_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить достижения волонтёра.");
  }

  return hydrateAchievements(
    supabase,
    ((data ?? []) as AchievementRow[]).map(normalizeAchievement)
  );
}

export async function getCurrentVolunteerAchievements(): Promise<CurrentVolunteerAchievements> {
  const currentUser = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const profileId = currentUser.profile?.id ?? currentUser.user.id;

  const { data: volunteerRow, error: volunteerError } = await supabase
    .from("volunteers")
    .select("id, profile_id, status")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (volunteerError) {
    throw new Error("Не удалось загрузить волонтёрскую карточку.");
  }

  const volunteer = (volunteerRow as AchievementVolunteerRow | null) ?? null;

  if (!volunteer) {
    return {
      achievements: [],
      volunteer: null
    };
  }

  const { data, error } = await supabase
    .from("achievements")
    .select(achievementFields)
    .eq("volunteer_id", volunteer.id)
    .order("awarded_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить ваши достижения.");
  }

  return {
    achievements: await hydrateAchievements(
      supabase,
      ((data ?? []) as AchievementRow[]).map(normalizeAchievement)
    ),
    volunteer
  };
}

export async function awardAchievementForAdmin({
  achievementType,
  description,
  title,
  volunteerId
}: {
  achievementType: AchievementType;
  description: string | null;
  title: string;
  volunteerId: string;
}) {
  const currentUser = await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data: volunteer, error: volunteerError } = await supabase
    .from("volunteers")
    .select("id")
    .eq("id", volunteerId)
    .maybeSingle();

  if (volunteerError || !volunteer) {
    throw new Error("Волонтёрская карточка не найдена.");
  }

  const { data, error } = await supabase
    .from("achievements")
    .insert({
      achievement_type: achievementType,
      awarded_by: currentUser.profile?.id ?? currentUser.user.id,
      description,
      status: "awarded",
      title,
      volunteer_id: volunteerId
    })
    .select("id")
    .maybeSingle();

  if (error || !data) {
    throw new Error("Не удалось выдать достижение.");
  }

  return data.id as string;
}
