import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { eventStatuses, type EventStatus } from "@/lib/validations/event";

export type EventRecord = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  status: EventStatus;
  capacity: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type EventCreator = {
  id: string;
  email: string;
  full_name: string | null;
};

export type EventDetail = EventRecord & {
  creator: EventCreator | null;
};

type EventRow = Omit<EventRecord, "status"> & {
  status: string;
};

type ProfileRow = EventCreator;

const eventFields = `
  id,
  title,
  description,
  location,
  starts_at,
  ends_at,
  status,
  capacity,
  created_by,
  created_at,
  updated_at
`;

function isEventStatus(value: string): value is EventStatus {
  return eventStatuses.includes(value as EventStatus);
}

function normalizeEvent(row: EventRow): EventRecord {
  return {
    ...row,
    status: isEventStatus(row.status) ? row.status : "draft"
  };
}

export async function listEvents(): Promise<EventRecord[]> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("events")
    .select(eventFields)
    .order("starts_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить список событий.");
  }

  return ((data ?? []) as EventRow[]).map(normalizeEvent);
}

export async function getEventDetail(id: string): Promise<EventDetail> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("events")
    .select(eventFields)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Не удалось загрузить событие.");
  }

  if (!data) {
    notFound();
  }

  const event = normalizeEvent(data as EventRow);
  let creator: EventCreator | null = null;

  if (event.created_by) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", event.created_by)
      .maybeSingle();

    creator = (profile as ProfileRow | null) ?? null;
  }

  return {
    ...event,
    creator
  };
}
