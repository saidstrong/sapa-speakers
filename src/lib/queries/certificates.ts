import { requireAdminUser, requireCurrentUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  certificateStatuses,
  certificateTypes,
  type CertificateStatus,
  type CertificateType
} from "@/lib/validations/certificate";

export type CertificateRecord = {
  id: string;
  volunteer_id: string;
  title: string;
  description: string | null;
  certificate_type: CertificateType;
  status: CertificateStatus;
  issued_by: string | null;
  issued_at: string;
  revoked_at: string | null;
  revocation_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type CertificateVolunteer = {
  id: string;
  profile_id: string;
  status: string;
};

export type CertificateProfile = {
  id: string;
  email: string;
  full_name: string | null;
};

export type CertificateListItem = CertificateRecord & {
  issuedByProfile: CertificateProfile | null;
  volunteer: CertificateVolunteer | null;
  volunteerProfile: CertificateProfile | null;
};

export type CurrentVolunteerCertificates = {
  certificates: CertificateListItem[];
  volunteer: CertificateVolunteer | null;
};

type CertificateRow = Omit<
  CertificateRecord,
  "certificate_type" | "status"
> & {
  certificate_type: string;
  status: string;
};

type CertificateVolunteerRow = CertificateVolunteer;

type CertificateProfileRow = CertificateProfile;

const certificateFields =
  "id, volunteer_id, title, description, certificate_type, status, issued_by, issued_at, revoked_at, revocation_reason, created_at, updated_at";

function isCertificateType(value: string): value is CertificateType {
  return certificateTypes.includes(value as CertificateType);
}

function isCertificateStatus(value: string): value is CertificateStatus {
  return certificateStatuses.includes(value as CertificateStatus);
}

function normalizeCertificate(row: CertificateRow): CertificateRecord {
  return {
    ...row,
    certificate_type: isCertificateType(row.certificate_type)
      ? row.certificate_type
      : "participation",
    status: isCertificateStatus(row.status) ? row.status : "issued"
  };
}

function uniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter(Boolean))) as string[];
}

async function hydrateCertificates(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  certificates: readonly CertificateRecord[]
): Promise<CertificateListItem[]> {
  if (certificates.length === 0) {
    return [];
  }

  const volunteerIds = uniqueValues(certificates.map((certificate) => certificate.volunteer_id));
  const issuerIds = uniqueValues(certificates.map((certificate) => certificate.issued_by));

  const { data: volunteerRows, error: volunteersError } = await supabase
    .from("volunteers")
    .select("id, profile_id, status")
    .in("id", volunteerIds);

  if (volunteersError) {
    throw new Error("Не удалось загрузить волонтёрские карточки сертификатов.");
  }

  const volunteers = (volunteerRows ?? []) as CertificateVolunteerRow[];
  const volunteersById = new Map(volunteers.map((volunteer) => [volunteer.id, volunteer]));
  const profileIds = uniqueValues([
    ...volunteers.map((volunteer) => volunteer.profile_id),
    ...issuerIds
  ]);

  const { data: profileRows, error: profilesError } =
    profileIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", profileIds)
      : { data: [], error: null };

  if (profilesError) {
    throw new Error("Не удалось загрузить профили сертификатов.");
  }

  const profilesById = new Map(
    ((profileRows ?? []) as CertificateProfileRow[]).map((profile) => [
      profile.id,
      profile
    ])
  );

  return certificates.map((certificate) => {
    const volunteer = volunteersById.get(certificate.volunteer_id) ?? null;

    return {
      ...certificate,
      issuedByProfile: certificate.issued_by
        ? profilesById.get(certificate.issued_by) ?? null
        : null,
      volunteer,
      volunteerProfile: volunteer
        ? profilesById.get(volunteer.profile_id) ?? null
        : null
    };
  });
}

export async function listCertificatesForAdmin(): Promise<CertificateListItem[]> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("certificates")
    .select(certificateFields)
    .order("issued_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить сертификаты.");
  }

  return hydrateCertificates(
    supabase,
    ((data ?? []) as CertificateRow[]).map(normalizeCertificate)
  );
}

export async function listVolunteerCertificatesForAdmin(
  volunteerId: string
): Promise<CertificateListItem[]> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("certificates")
    .select(certificateFields)
    .eq("volunteer_id", volunteerId)
    .order("issued_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить сертификаты волонтёра.");
  }

  return hydrateCertificates(
    supabase,
    ((data ?? []) as CertificateRow[]).map(normalizeCertificate)
  );
}

export async function listCurrentVolunteerCertificates(): Promise<CurrentVolunteerCertificates> {
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

  const volunteer = (volunteerRow as CertificateVolunteerRow | null) ?? null;

  if (!volunteer) {
    return {
      certificates: [],
      volunteer: null
    };
  }

  const { data, error } = await supabase
    .from("certificates")
    .select(certificateFields)
    .eq("volunteer_id", volunteer.id)
    .order("issued_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить ваши сертификаты.");
  }

  return {
    certificates: await hydrateCertificates(
      supabase,
      ((data ?? []) as CertificateRow[]).map(normalizeCertificate)
    ),
    volunteer
  };
}
