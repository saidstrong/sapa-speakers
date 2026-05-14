import { requireAdminUser, requireCurrentUser } from "@/lib/auth/current-user";
import type { EventAttendanceStatus } from "@/lib/queries/event-attendance";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const contributionTypes = ["event_attendance", "manual_adjustment"] as const;

export type ContributionType = (typeof contributionTypes)[number];

export type VolunteerContribution = {
  id: string;
  volunteer_id: string;
  event_id: string | null;
  attendance_id: string | null;
  hours: number;
  contribution_type: ContributionType;
  description: string | null;
  awarded_by: string | null;
  awarded_at: string;
  created_at: string;
  updated_at: string;
};

export type ContributionEvent = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
};

export type ContributionAttendance = {
  id: string;
  status: EventAttendanceStatus;
  marked_at: string;
};

export type ContributionProfile = {
  id: string;
  email: string;
  full_name: string | null;
};

export type VolunteerContributionHistoryItem = VolunteerContribution & {
  attendance: ContributionAttendance | null;
  awardedByProfile: ContributionProfile | null;
  event: ContributionEvent | null;
};

export type VolunteerContributionSummary = {
  latestContributionAt: string | null;
  recordCount: number;
  totalHours: number;
};

export type CurrentVolunteerContributionHistory = {
  volunteer: {
    id: string;
    profile_id: string;
    status: string;
  } | null;
  contributions: VolunteerContributionHistoryItem[];
  summary: VolunteerContributionSummary;
  totalHours: number;
};

type VolunteerContributionRow = Omit<
  VolunteerContribution,
  "contribution_type" | "hours"
> & {
  contribution_type: string;
  hours: number | string;
};

type ContributionEventRow = ContributionEvent;

type ContributionAttendanceRow = Omit<ContributionAttendance, "status"> & {
  status: string;
};

type ContributionProfileRow = ContributionProfile;

function isContributionType(value: string): value is ContributionType {
  return contributionTypes.includes(value as ContributionType);
}

function isEventAttendanceStatus(value: string): value is EventAttendanceStatus {
  return value === "attended" || value === "absent" || value === "excused";
}

function normalizeHours(value: number | string) {
  return typeof value === "number" ? value : Number(value);
}

function normalizeContribution(row: VolunteerContributionRow): VolunteerContribution {
  return {
    ...row,
    contribution_type: isContributionType(row.contribution_type)
      ? row.contribution_type
      : "event_attendance",
    hours: normalizeHours(row.hours)
  };
}

function uniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter(Boolean))) as string[];
}

function sumHours(contributions: readonly VolunteerContribution[]) {
  return contributions.reduce((total, contribution) => total + contribution.hours, 0);
}

function buildSummary(
  contributions: readonly VolunteerContribution[]
): VolunteerContributionSummary {
  return {
    latestContributionAt: contributions[0]?.awarded_at ?? null,
    recordCount: contributions.length,
    totalHours: sumHours(contributions)
  };
}

async function hydrateContributionHistory(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  contributions: readonly VolunteerContribution[],
  options: {
    includeAdminContext?: boolean;
  } = {}
): Promise<VolunteerContributionHistoryItem[]> {
  if (contributions.length === 0) {
    return [];
  }

  const eventIds = uniqueValues(contributions.map((contribution) => contribution.event_id));
  const attendanceIds = uniqueValues(
    contributions.map((contribution) => contribution.attendance_id)
  );
  const awardedByIds = uniqueValues(
    contributions.map((contribution) => contribution.awarded_by)
  );

  const [eventsResult, attendanceResult, profilesResult] = await Promise.all([
    eventIds.length > 0
      ? supabase
          .from("events")
          .select("id, title, starts_at, ends_at")
          .in("id", eventIds)
      : Promise.resolve({ data: [], error: null }),
    options.includeAdminContext && attendanceIds.length > 0
      ? supabase
          .from("event_attendance")
          .select("id, status, marked_at")
          .in("id", attendanceIds)
      : Promise.resolve({ data: [], error: null }),
    options.includeAdminContext && awardedByIds.length > 0
      ? supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", awardedByIds)
      : Promise.resolve({ data: [], error: null })
  ]);

  if (eventsResult.error || attendanceResult.error || profilesResult.error) {
    throw new Error("Не удалось загрузить связанные данные истории вклада.");
  }

  const eventsById = new Map(
    ((eventsResult.data ?? []) as ContributionEventRow[]).map((event) => [
      event.id,
      event
    ])
  );
  const attendanceById = new Map(
    ((attendanceResult.data ?? []) as ContributionAttendanceRow[]).map((attendance) => [
      attendance.id,
      {
        ...attendance,
        status: isEventAttendanceStatus(attendance.status)
          ? attendance.status
          : "attended"
      }
    ])
  );
  const profilesById = new Map(
    ((profilesResult.data ?? []) as ContributionProfileRow[]).map((profile) => [
      profile.id,
      profile
    ])
  );

  return contributions.map((contribution) => ({
    ...contribution,
    attendance: contribution.attendance_id
      ? attendanceById.get(contribution.attendance_id) ?? null
      : null,
    awardedByProfile: contribution.awarded_by
      ? profilesById.get(contribution.awarded_by) ?? null
      : null,
    event: contribution.event_id
      ? eventsById.get(contribution.event_id) ?? null
      : null
  }));
}

export async function listContributionsByAttendanceIdsForAdmin(
  attendanceIds: readonly string[]
): Promise<VolunteerContribution[]> {
  await requireAdminUser();

  if (attendanceIds.length === 0) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("volunteer_contributions")
    .select(
      "id, volunteer_id, event_id, attendance_id, hours, contribution_type, description, awarded_by, awarded_at, created_at, updated_at"
    )
    .eq("contribution_type", "event_attendance")
    .in("attendance_id", [...attendanceIds]);

  if (error) {
    throw new Error("Не удалось загрузить подтверждённые часы.");
  }

  return ((data ?? []) as VolunteerContributionRow[]).map(normalizeContribution);
}

export async function getCurrentVolunteerContributionHistory(): Promise<CurrentVolunteerContributionHistory> {
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

  const volunteer =
    (volunteerRow as { id: string; profile_id: string; status: string } | null) ?? null;

  if (!volunteer) {
    return {
      volunteer: null,
      contributions: [],
      summary: buildSummary([]),
      totalHours: 0
    };
  }

  const { data, error } = await supabase
    .from("volunteer_contributions")
    .select(
      "id, volunteer_id, event_id, attendance_id, hours, contribution_type, description, awarded_by, awarded_at, created_at, updated_at"
    )
    .eq("volunteer_id", volunteer.id)
    .order("awarded_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить историю вклада.");
  }

  const contributions = ((data ?? []) as VolunteerContributionRow[]).map(
    normalizeContribution
  );

  if (contributions.length === 0) {
    return {
      volunteer,
      contributions: [],
      summary: buildSummary([]),
      totalHours: 0
    };
  }

  const hydratedContributions = await hydrateContributionHistory(supabase, contributions);
  const summary = buildSummary(contributions);

  return {
    volunteer,
    contributions: hydratedContributions,
    summary,
    totalHours: summary.totalHours
  };
}

export async function getVolunteerContributionHistoryForAdmin(
  volunteerId: string
): Promise<{
  contributions: VolunteerContributionHistoryItem[];
  summary: VolunteerContributionSummary;
}> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("volunteer_contributions")
    .select(
      "id, volunteer_id, event_id, attendance_id, hours, contribution_type, description, awarded_by, awarded_at, created_at, updated_at"
    )
    .eq("volunteer_id", volunteerId)
    .order("awarded_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить историю вклада волонтёра.");
  }

  const contributions = ((data ?? []) as VolunteerContributionRow[]).map(
    normalizeContribution
  );

  return {
    contributions: await hydrateContributionHistory(supabase, contributions, {
      includeAdminContext: true
    }),
    summary: buildSummary(contributions)
  };
}
