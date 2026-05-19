import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/current-user";
import { isRoleKey, type RoleKey } from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  VolunteerApplication,
  VolunteerApplicationStatus
} from "@/lib/queries/volunteer-applications";

export const volunteerStatuses = ["active", "inactive", "suspended", "alumni"] as const;

export type VolunteerStatus = (typeof volunteerStatuses)[number];

export type VolunteerProfile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  telegram: string | null;
  avatar_path: string | null;
  avatar_file_name: string | null;
  avatar_file_size_bytes: number | null;
  avatar_mime_type: string | null;
  avatar_uploaded_at: string | null;
  role: RoleKey;
};

export type VolunteerApplicationContext = Pick<
  VolunteerApplication,
  | "id"
  | "full_name"
  | "motivation"
  | "experience"
  | "availability"
  | "status"
  | "reviewed_at"
  | "reviewer_notes"
>;

export type VolunteerListItem = {
  id: string;
  profile_id: string;
  application_id: string | null;
  status: VolunteerStatus;
  joined_at: string;
  notes: string | null;
  profile: VolunteerProfile | null;
  application: {
    id: string;
    status: VolunteerApplicationStatus;
  } | null;
};

export type VolunteerDetail = Omit<VolunteerListItem, "application"> & {
  application: VolunteerApplicationContext | null;
};

type VolunteerRow = {
  id: string;
  profile_id: string;
  application_id: string | null;
  status: string;
  joined_at: string;
  notes: string | null;
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  telegram: string | null;
  avatar_path: string | null;
  avatar_file_name: string | null;
  avatar_file_size_bytes: number | null;
  avatar_mime_type: string | null;
  avatar_uploaded_at: string | null;
  role: string;
};

const volunteerProfileFields =
  "id, email, full_name, phone, telegram, avatar_path, avatar_file_name, avatar_file_size_bytes, avatar_mime_type, avatar_uploaded_at, role";

function isVolunteerStatus(value: string): value is VolunteerStatus {
  return volunteerStatuses.includes(value as VolunteerStatus);
}

function normalizeVolunteerStatus(value: string): VolunteerStatus {
  return isVolunteerStatus(value) ? value : "active";
}

function normalizeProfile(profile: ProfileRow | null | undefined): VolunteerProfile | null {
  if (!profile) {
    return null;
  }

  return {
    ...profile,
    role: isRoleKey(profile.role) ? profile.role : "volunteer"
  };
}

function uniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter(Boolean))) as string[];
}

export async function listVolunteers(): Promise<VolunteerListItem[]> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data: volunteerRows, error } = await supabase
    .from("volunteers")
    .select("id, profile_id, application_id, status, joined_at, notes")
    .order("joined_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить список волонтёров.");
  }

  const volunteers = (volunteerRows ?? []) as VolunteerRow[];

  if (volunteers.length === 0) {
    return [];
  }

  const profileIds = uniqueValues(volunteers.map((volunteer) => volunteer.profile_id));
  const applicationIds = uniqueValues(
    volunteers.map((volunteer) => volunteer.application_id)
  );

  const [profilesResult, applicationsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(volunteerProfileFields)
      .in("id", profileIds),
    applicationIds.length > 0
      ? supabase
          .from("volunteer_applications")
          .select("id, status")
          .in("id", applicationIds)
      : Promise.resolve({ data: [], error: null })
  ]);

  if (profilesResult.error || applicationsResult.error) {
    throw new Error("Не удалось загрузить связанные данные волонтёров.");
  }

  const profilesById = new Map(
    ((profilesResult.data ?? []) as ProfileRow[]).map((profile) => [
      profile.id,
      normalizeProfile(profile)
    ])
  );
  const applicationsById = new Map(
    (
      (applicationsResult.data ?? []) as Array<{
        id: string;
        status: VolunteerApplicationStatus;
      }>
    ).map((application) => [application.id, application])
  );

  return volunteers.map((volunteer) => ({
    ...volunteer,
    status: normalizeVolunteerStatus(volunteer.status),
    profile: profilesById.get(volunteer.profile_id) ?? null,
    application: volunteer.application_id
      ? applicationsById.get(volunteer.application_id) ?? null
      : null
  }));
}

export async function getVolunteerDetail(id: string): Promise<VolunteerDetail> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data: volunteerRow, error } = await supabase
    .from("volunteers")
    .select("id, profile_id, application_id, status, joined_at, notes")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Не удалось загрузить волонтёрскую карточку.");
  }

  if (!volunteerRow) {
    notFound();
  }

  const volunteer = volunteerRow as VolunteerRow;

  const [profileResult, applicationResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(volunteerProfileFields)
      .eq("id", volunteer.profile_id)
      .maybeSingle(),
    volunteer.application_id
      ? supabase
          .from("volunteer_applications")
          .select(
            "id, full_name, motivation, experience, availability, status, reviewed_at, reviewer_notes"
          )
          .eq("id", volunteer.application_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null })
  ]);

  if (profileResult.error || applicationResult.error) {
    throw new Error("Не удалось загрузить связанные данные волонтёра.");
  }

  return {
    ...volunteer,
    status: normalizeVolunteerStatus(volunteer.status),
    profile: normalizeProfile(profileResult.data as ProfileRow | null),
    application: (applicationResult.data as VolunteerApplicationContext | null) ?? null
  };
}
