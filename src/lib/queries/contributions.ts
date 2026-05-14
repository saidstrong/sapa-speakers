import { requireAdminUser, requireCurrentUser } from "@/lib/auth/current-user";
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

export type VolunteerContributionHistoryItem = VolunteerContribution & {
  event: ContributionEvent | null;
};

export type CurrentVolunteerContributionHistory = {
  volunteer: {
    id: string;
    profile_id: string;
    status: string;
  } | null;
  contributions: VolunteerContributionHistoryItem[];
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

function isContributionType(value: string): value is ContributionType {
  return contributionTypes.includes(value as ContributionType);
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
      totalHours: 0
    };
  }

  const eventIds = uniqueValues(contributions.map((contribution) => contribution.event_id));
  const { data: eventRows, error: eventsError } =
    eventIds.length > 0
      ? await supabase
          .from("events")
          .select("id, title, starts_at, ends_at")
          .in("id", eventIds)
      : { data: [], error: null };

  if (eventsError) {
    throw new Error("Не удалось загрузить события для истории вклада.");
  }

  const eventsById = new Map(
    ((eventRows ?? []) as ContributionEventRow[]).map((event) => [event.id, event])
  );

  return {
    volunteer,
    contributions: contributions.map((contribution) => ({
      ...contribution,
      event: contribution.event_id
        ? eventsById.get(contribution.event_id) ?? null
        : null
    })),
    totalHours: sumHours(contributions)
  };
}
