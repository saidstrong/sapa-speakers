import { notFound } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth/current-user";
import type { EventStatus } from "@/lib/validations/event";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PublishedEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  status: Extract<EventStatus, "published">;
  capacity: number | null;
};

type PublishedEventRow = Omit<PublishedEvent, "status"> & {
  status: string;
};

const publishedEventFields = `
  id,
  title,
  description,
  location,
  starts_at,
  ends_at,
  status,
  capacity
`;

function normalizePublishedEvent(row: PublishedEventRow): PublishedEvent {
  return {
    ...row,
    status: "published"
  };
}

export async function listPublishedEvents(): Promise<PublishedEvent[]> {
  await requireCurrentUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("events")
    .select(publishedEventFields)
    .eq("status", "published")
    .order("starts_at", { ascending: true });

  if (error) {
    throw new Error("Не удалось загрузить опубликованные проекты.");
  }

  return ((data ?? []) as PublishedEventRow[]).map(normalizePublishedEvent);
}

export async function getPublishedEvent(id: string): Promise<PublishedEvent> {
  await requireCurrentUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("events")
    .select(publishedEventFields)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error("Не удалось загрузить проект.");
  }

  if (!data) {
    notFound();
  }

  return normalizePublishedEvent(data as PublishedEventRow);
}
