import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdminUser, requireCurrentUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  announcementStatuses,
  type AnnouncementFormInput,
  type AnnouncementStatus
} from "@/lib/validations/announcement";

export type AnnouncementRecord = {
  id: string;
  title: string;
  body: string;
  status: AnnouncementStatus;
  created_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AnnouncementProfile = {
  id: string;
  email: string;
  full_name: string | null;
};

export type AnnouncementListItem = AnnouncementRecord & {
  createdByProfile: AnnouncementProfile | null;
};

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

type AnnouncementRow = Omit<AnnouncementRecord, "status"> & {
  status: string;
};

type AnnouncementProfileRow = AnnouncementProfile;

const announcementIdSchema = z.string().uuid();

const announcementFields =
  "id, title, body, status, created_by, published_at, created_at, updated_at";

function isAnnouncementStatus(value: string): value is AnnouncementStatus {
  return announcementStatuses.includes(value as AnnouncementStatus);
}

function normalizeAnnouncement(row: AnnouncementRow): AnnouncementRecord {
  return {
    ...row,
    status: isAnnouncementStatus(row.status) ? row.status : "draft"
  };
}

function uniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter(Boolean))) as string[];
}

async function hydrateAnnouncements(
  supabase: SupabaseServerClient,
  announcements: readonly AnnouncementRecord[]
): Promise<AnnouncementListItem[]> {
  if (announcements.length === 0) {
    return [];
  }

  const profileIds = uniqueValues(
    announcements.map((announcement) => announcement.created_by)
  );

  const { data, error } =
    profileIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", profileIds)
      : { data: [], error: null };

  if (error) {
    throw new Error("Не удалось загрузить авторов объявлений.");
  }

  const profilesById = new Map(
    ((data ?? []) as AnnouncementProfileRow[]).map((profile) => [
      profile.id,
      profile
    ])
  );

  return announcements.map((announcement) => ({
    ...announcement,
    createdByProfile: announcement.created_by
      ? profilesById.get(announcement.created_by) ?? null
      : null
  }));
}

function getPublishedAtForStatus(
  status: AnnouncementStatus,
  currentPublishedAt: string | null = null
) {
  if (status !== "published") {
    return null;
  }

  return currentPublishedAt ?? new Date().toISOString();
}

export async function listAnnouncementsForAdmin(): Promise<AnnouncementListItem[]> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("announcements")
    .select(announcementFields)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить объявления.");
  }

  return hydrateAnnouncements(
    supabase,
    ((data ?? []) as AnnouncementRow[]).map(normalizeAnnouncement)
  );
}

export async function getAnnouncementForAdmin(id: string): Promise<AnnouncementListItem> {
  await requireAdminUser();

  const parsedId = announcementIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("announcements")
    .select(announcementFields)
    .eq("id", parsedId.data)
    .maybeSingle();

  if (error) {
    throw new Error("Не удалось загрузить объявление.");
  }

  if (!data) {
    notFound();
  }

  const [announcement] = await hydrateAnnouncements(supabase, [
    normalizeAnnouncement(data as AnnouncementRow)
  ]);

  if (!announcement) {
    notFound();
  }

  return announcement;
}

export async function listPublishedAnnouncements(): Promise<AnnouncementRecord[]> {
  await requireCurrentUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("announcements")
    .select(announcementFields)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить опубликованные объявления.");
  }

  return ((data ?? []) as AnnouncementRow[]).map(normalizeAnnouncement);
}

export async function createAnnouncementForAdmin(
  input: AnnouncementFormInput
): Promise<string> {
  const currentUser = await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      body: input.body,
      created_by: currentUser.profile?.id ?? currentUser.user.id,
      published_at: getPublishedAtForStatus(input.status),
      status: input.status,
      title: input.title
    })
    .select("id")
    .maybeSingle();

  if (error || !data) {
    throw new Error("Не удалось создать объявление.");
  }

  return data.id as string;
}

export async function updateAnnouncementForAdmin(
  id: string,
  input: AnnouncementFormInput
): Promise<string> {
  await requireAdminUser();

  const parsedId = announcementIdSchema.safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  const { data: currentAnnouncement, error: currentError } = await supabase
    .from("announcements")
    .select("id, published_at")
    .eq("id", parsedId.data)
    .maybeSingle();

  if (currentError) {
    throw new Error("Не удалось проверить объявление перед обновлением.");
  }

  if (!currentAnnouncement) {
    notFound();
  }

  const { data, error } = await supabase
    .from("announcements")
    .update({
      body: input.body,
      published_at: getPublishedAtForStatus(
        input.status,
        (currentAnnouncement as { published_at: string | null }).published_at
      ),
      status: input.status,
      title: input.title
    })
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    throw new Error("Не удалось обновить объявление.");
  }

  return data.id as string;
}
