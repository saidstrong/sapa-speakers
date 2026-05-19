import { requireCurrentUser } from "@/lib/auth/current-user";
import type { RoleKey } from "@/lib/auth/roles";
import { createAvatarSignedUrl } from "@/lib/storage/avatars";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type VolunteerDashboardProfile = {
  id: string;
  avatarUrl: string | null;
  email: string;
  full_name: string | null;
  role: RoleKey;
};

export type VolunteerDashboardVolunteer = {
  id: string;
  profile_id: string;
  status: string;
  joined_at: string;
};

export type VolunteerDashboardContributionSummary = {
  latestContributionAt: string | null;
  recordCount: number;
  totalHours: number;
};

export type VolunteerDashboardRegistrationEvent = {
  id: string;
  title: string;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  status: string;
};

export type VolunteerDashboardRegistration = {
  id: string;
  event_id: string;
  registered_at: string;
  event: VolunteerDashboardRegistrationEvent;
};

export type VolunteerDashboardStatusSummary = {
  activeCount: number;
  revokedCount: number;
};

export type VolunteerDashboardData = {
  achievementSummary: VolunteerDashboardStatusSummary;
  certificateSummary: VolunteerDashboardStatusSummary;
  contributionSummary: VolunteerDashboardContributionSummary;
  profile: VolunteerDashboardProfile;
  upcomingRegistrations: VolunteerDashboardRegistration[];
  volunteer: VolunteerDashboardVolunteer | null;
};

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

type VolunteerRow = VolunteerDashboardVolunteer;

type ContributionRow = {
  awarded_at: string;
  hours: number | string;
};

type StatusRow = {
  status: string;
};

type RegistrationEventRow = VolunteerDashboardRegistrationEvent;

type RegistrationRow = {
  id: string;
  event_id: string;
  registered_at: string;
  event: RegistrationEventRow | RegistrationEventRow[] | null;
};

type NormalizedRegistrationRow = Omit<RegistrationRow, "event"> & {
  event: RegistrationEventRow | null;
};

type RegistrationWithEvent = Omit<RegistrationRow, "event"> & {
  event: RegistrationEventRow;
};

const upcomingRegistrationFields = `
  id,
  event_id,
  registered_at,
  event:events (
    id,
    title,
    location,
    starts_at,
    ends_at,
    status
  )
`;

function normalizeHours(value: number | string) {
  return typeof value === "number" ? value : Number(value);
}

function summarizeContributions(
  contributions: readonly ContributionRow[]
): VolunteerDashboardContributionSummary {
  return {
    latestContributionAt: contributions[0]?.awarded_at ?? null,
    recordCount: contributions.length,
    totalHours: contributions.reduce(
      (total, contribution) => total + normalizeHours(contribution.hours),
      0
    )
  };
}

function summarizeStatuses(
  rows: readonly StatusRow[],
  activeStatus: "awarded" | "issued"
): VolunteerDashboardStatusSummary {
  return rows.reduce(
    (summary, row) => {
      if (row.status === "revoked") {
        summary.revokedCount += 1;
      } else if (row.status === activeStatus) {
        summary.activeCount += 1;
      }

      return summary;
    },
    {
      activeCount: 0,
      revokedCount: 0
    }
  );
}

function normalizeRegistrationEvent(
  value: RegistrationEventRow | RegistrationEventRow[] | null
) {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function normalizeUpcomingRegistrations(
  rows: readonly RegistrationRow[]
): VolunteerDashboardRegistration[] {
  const now = Date.now();

  return rows
    .map(
      (row): NormalizedRegistrationRow => ({
        id: row.id,
        event_id: row.event_id,
        registered_at: row.registered_at,
        event: normalizeRegistrationEvent(row.event)
      })
    )
    .filter((row): row is RegistrationWithEvent => {
      const event = row.event;

      return (
        event !== null &&
        event.status === "published" &&
        new Date(event.starts_at).getTime() >= now
      );
    })
    .sort(
      (left, right) =>
        new Date(left.event.starts_at).getTime() -
        new Date(right.event.starts_at).getTime()
    )
    .slice(0, 5)
    .map((row) => ({
      ...row,
      event: row.event
    }));
}

async function loadVolunteer(
  supabase: SupabaseServerClient,
  profileId: string
): Promise<VolunteerDashboardVolunteer | null> {
  const { data, error } = await supabase
    .from("volunteers")
    .select("id, profile_id, status, joined_at")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    throw new Error("Не удалось загрузить волонтёрский профиль.");
  }

  return (data as VolunteerRow | null) ?? null;
}

async function loadContributionSummary(
  supabase: SupabaseServerClient,
  volunteerId: string
) {
  const { data, error } = await supabase
    .from("volunteer_contributions")
    .select("hours, awarded_at")
    .eq("volunteer_id", volunteerId)
    .order("awarded_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить сводку вклада.");
  }

  return summarizeContributions((data ?? []) as ContributionRow[]);
}

async function loadUpcomingRegistrations(
  supabase: SupabaseServerClient,
  volunteerId: string
) {
  const { data, error } = await supabase
    .from("event_registrations")
    .select(upcomingRegistrationFields)
    .eq("volunteer_id", volunteerId)
    .eq("status", "registered");

  if (error) {
    throw new Error("Не удалось загрузить предстоящие записи на проекты.");
  }

  return normalizeUpcomingRegistrations((data ?? []) as RegistrationRow[]);
}

async function loadCertificateSummary(
  supabase: SupabaseServerClient,
  volunteerId: string
) {
  const { data, error } = await supabase
    .from("certificates")
    .select("status")
    .eq("volunteer_id", volunteerId);

  if (error) {
    throw new Error("Не удалось загрузить сводку сертификатов.");
  }

  return summarizeStatuses((data ?? []) as StatusRow[], "issued");
}

async function loadAchievementSummary(
  supabase: SupabaseServerClient,
  volunteerId: string
) {
  const { data, error } = await supabase
    .from("achievements")
    .select("status")
    .eq("volunteer_id", volunteerId);

  if (error) {
    throw new Error("Не удалось загрузить сводку достижений.");
  }

  return summarizeStatuses((data ?? []) as StatusRow[], "awarded");
}

export async function getVolunteerDashboardData(): Promise<VolunteerDashboardData> {
  const currentUser = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const profileId = currentUser.profile?.id ?? currentUser.user.id;
  const avatarUrl = await createAvatarSignedUrl(
    supabase,
    currentUser.profile?.avatar_path
  );
  const profile: VolunteerDashboardProfile = {
    id: profileId,
    avatarUrl,
    email: currentUser.profile?.email ?? currentUser.user.email ?? "Email не указан",
    full_name: currentUser.profile?.full_name ?? null,
    role: currentUser.role
  };
  const emptyContributionSummary = summarizeContributions([]);
  const emptyStatusSummary = {
    activeCount: 0,
    revokedCount: 0
  };
  const volunteer = await loadVolunteer(supabase, profileId);

  if (!volunteer) {
    return {
      achievementSummary: emptyStatusSummary,
      certificateSummary: emptyStatusSummary,
      contributionSummary: emptyContributionSummary,
      profile,
      upcomingRegistrations: [],
      volunteer: null
    };
  }

  const [
    contributionSummary,
    upcomingRegistrations,
    certificateSummary,
    achievementSummary
  ] = await Promise.all([
    loadContributionSummary(supabase, volunteer.id),
    loadUpcomingRegistrations(supabase, volunteer.id),
    loadCertificateSummary(supabase, volunteer.id),
    loadAchievementSummary(supabase, volunteer.id)
  ]);

  return {
    achievementSummary,
    certificateSummary,
    contributionSummary,
    profile,
    upcomingRegistrations,
    volunteer
  };
}
