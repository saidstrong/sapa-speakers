import { requireAdminUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const eventAttendanceStatuses = ["attended", "absent", "excused"] as const;

export type EventAttendanceStatus = (typeof eventAttendanceStatuses)[number];

export type EventAttendance = {
  id: string;
  event_id: string;
  volunteer_id: string;
  registration_id: string | null;
  status: EventAttendanceStatus;
  marked_by: string | null;
  marked_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type AttendanceRegisterFilters = {
  search?: string;
  status?: EventAttendanceStatus | "all";
};

export type AttendanceRegisterEvent = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
};

export type AttendanceRegisterVolunteer = {
  id: string;
  profile_id: string;
  status: string;
};

export type AttendanceRegisterProfile = {
  id: string;
  email: string;
  full_name: string | null;
};

export type AttendanceRegisterRecord = EventAttendance & {
  event: AttendanceRegisterEvent | null;
  markedByProfile: AttendanceRegisterProfile | null;
  volunteer: AttendanceRegisterVolunteer | null;
  volunteerProfile: AttendanceRegisterProfile | null;
};

type EventAttendanceRow = Omit<EventAttendance, "status"> & {
  status: string;
};

type AttendanceEventRow = AttendanceRegisterEvent;

type AttendanceVolunteerRow = AttendanceRegisterVolunteer;

type AttendanceProfileRow = AttendanceRegisterProfile;

function isEventAttendanceStatus(value: string): value is EventAttendanceStatus {
  return eventAttendanceStatuses.includes(value as EventAttendanceStatus);
}

function normalizeEventAttendance(row: EventAttendanceRow): EventAttendance {
  return {
    ...row,
    status: isEventAttendanceStatus(row.status) ? row.status : "attended"
  };
}

export async function listEventAttendanceForAdmin(
  eventId: string
): Promise<EventAttendance[]> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("event_attendance")
    .select(
      "id, event_id, volunteer_id, registration_id, status, marked_by, marked_at, notes, created_at, updated_at"
    )
    .eq("event_id", eventId)
    .order("marked_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить посещаемость события.");
  }

  return ((data ?? []) as EventAttendanceRow[]).map(normalizeEventAttendance);
}

function uniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter(Boolean))) as string[];
}

function normalizeSearch(value: string | undefined) {
  const trimmed = value?.trim() ?? "";

  return trimmed.length > 0 ? trimmed.toLocaleLowerCase("ru-RU") : "";
}

function matchesSearch(record: AttendanceRegisterRecord, search: string) {
  if (!search) {
    return true;
  }

  return [
    record.event?.title,
    record.volunteerProfile?.full_name,
    record.volunteerProfile?.email
  ].some((value) => value?.toLocaleLowerCase("ru-RU").includes(search));
}

export async function listAttendanceRegisterForAdmin(
  filters: AttendanceRegisterFilters = {}
): Promise<AttendanceRegisterRecord[]> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const statusFilter =
    filters.status && filters.status !== "all" && isEventAttendanceStatus(filters.status)
      ? filters.status
      : null;

  let attendanceQuery = supabase
    .from("event_attendance")
    .select(
      "id, event_id, volunteer_id, registration_id, status, marked_by, marked_at, notes, created_at, updated_at"
    )
    .order("marked_at", { ascending: false });

  if (statusFilter) {
    attendanceQuery = attendanceQuery.eq("status", statusFilter);
  }

  const { data: attendanceRows, error } = await attendanceQuery;

  if (error) {
    throw new Error("Не удалось загрузить реестр посещаемости.");
  }

  const attendance = ((attendanceRows ?? []) as EventAttendanceRow[]).map(
    normalizeEventAttendance
  );

  if (attendance.length === 0) {
    return [];
  }

  const eventIds = uniqueValues(attendance.map((record) => record.event_id));
  const volunteerIds = uniqueValues(attendance.map((record) => record.volunteer_id));
  const markerProfileIds = uniqueValues(attendance.map((record) => record.marked_by));

  const [eventsResult, volunteersResult] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, starts_at, ends_at")
      .in("id", eventIds),
    supabase
      .from("volunteers")
      .select("id, profile_id, status")
      .in("id", volunteerIds)
  ]);

  if (eventsResult.error || volunteersResult.error) {
    throw new Error("Не удалось загрузить связанные данные посещаемости.");
  }

  const eventsById = new Map(
    ((eventsResult.data ?? []) as AttendanceEventRow[]).map((event) => [
      event.id,
      event
    ])
  );
  const volunteers = (volunteersResult.data ?? []) as AttendanceVolunteerRow[];
  const volunteersById = new Map(
    volunteers.map((volunteer) => [volunteer.id, volunteer])
  );
  const volunteerProfileIds = uniqueValues(
    volunteers.map((volunteer) => volunteer.profile_id)
  );
  const profileIds = uniqueValues([...volunteerProfileIds, ...markerProfileIds]);

  const { data: profileRows, error: profilesError } =
    profileIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", profileIds)
      : { data: [], error: null };

  if (profilesError) {
    throw new Error("Не удалось загрузить профили для реестра посещаемости.");
  }

  const profilesById = new Map(
    ((profileRows ?? []) as AttendanceProfileRow[]).map((profile) => [
      profile.id,
      profile
    ])
  );
  const search = normalizeSearch(filters.search);

  return attendance
    .map((record) => {
      const volunteer = volunteersById.get(record.volunteer_id) ?? null;

      return {
        ...record,
        event: eventsById.get(record.event_id) ?? null,
        markedByProfile: record.marked_by
          ? profilesById.get(record.marked_by) ?? null
          : null,
        volunteer,
        volunteerProfile: volunteer
          ? profilesById.get(volunteer.profile_id) ?? null
          : null
      };
    })
    .filter((record) => matchesSearch(record, search));
}
