import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type VolunteerApplicationStatus = "pending" | "approved" | "declined";

export type VolunteerApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  telegram: string | null;
  city: string | null;
  age: number | null;
  languages: string[];
  interests: string[];
  experience: string | null;
  motivation: string;
  availability: string | null;
  status: VolunteerApplicationStatus;
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  reviewed_by: string | null;
};

export type MatchingProfile = {
  id: string;
  email: string;
  full_name: string | null;
};

export type VolunteerRecord = {
  id: string;
  profile_id: string;
  application_id: string | null;
  status: string;
};

export type VolunteerApplicationDetail = {
  application: VolunteerApplication;
  matchingProfile: MatchingProfile | null;
  volunteer: VolunteerRecord | null;
};

const applicationFields = `
  id,
  full_name,
  email,
  phone,
  telegram,
  city,
  age,
  languages,
  interests,
  experience,
  motivation,
  availability,
  status,
  submitted_at,
  reviewed_at,
  reviewer_notes,
  reviewed_by
`;

function normalizeApplication(row: VolunteerApplication): VolunteerApplication {
  return {
    ...row,
    languages: row.languages ?? [],
    interests: row.interests ?? []
  };
}

export async function listVolunteerApplications() {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("volunteer_applications")
    .select(applicationFields)
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить заявки волонтёров.");
  }

  return (data ?? []).map((row) => normalizeApplication(row as VolunteerApplication));
}

export async function getVolunteerApplicationDetail(
  id: string
): Promise<VolunteerApplicationDetail> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data: application, error } = await supabase
    .from("volunteer_applications")
    .select(applicationFields)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Не удалось загрузить заявку волонтёра.");
  }

  if (!application) {
    notFound();
  }

  const normalizedApplication = normalizeApplication(application as VolunteerApplication);

  const { data: matchingProfile } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .ilike("email", normalizedApplication.email)
    .maybeSingle();

  let volunteer: VolunteerRecord | null = null;

  if (matchingProfile) {
    const { data: volunteerRow } = await supabase
      .from("volunteers")
      .select("id, profile_id, application_id, status")
      .eq("profile_id", matchingProfile.id)
      .maybeSingle();

    volunteer = (volunteerRow as VolunteerRecord | null) ?? null;
  }

  return {
    application: normalizedApplication,
    matchingProfile: (matchingProfile as MatchingProfile | null) ?? null,
    volunteer
  };
}
