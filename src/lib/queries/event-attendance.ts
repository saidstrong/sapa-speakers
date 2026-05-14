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

type EventAttendanceRow = Omit<EventAttendance, "status"> & {
  status: string;
};

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
