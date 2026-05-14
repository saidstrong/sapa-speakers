import { requireAdminUser, requireCurrentUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { eventStatuses, type EventStatus } from "@/lib/validations/event";

export type EventRegistrationStatus = "registered" | "cancelled";

export type EventRegistration = {
  id: string;
  event_id: string;
  volunteer_id: string;
  status: EventRegistrationStatus;
  registered_at: string;
  cancelled_at: string | null;
  notes: string | null;
};

export type VolunteerRegistrationProfile = {
  id: string;
  email: string;
  full_name: string | null;
};

export type CurrentVolunteerRecord = {
  id: string;
  profile_id: string;
  status: string;
};

export type CurrentEventRegistrationState = {
  volunteer: CurrentVolunteerRecord | null;
  registration: EventRegistration | null;
  registeredCount: number;
};

export type AdminEventRegistration = EventRegistration & {
  volunteer: CurrentVolunteerRecord | null;
  profile: VolunteerRegistrationProfile | null;
};

export type EventRegistrationEvent = {
  id: string;
  title: string;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  status: EventStatus;
};

export type MyEventRegistration = EventRegistration & {
  event: EventRegistrationEvent | null;
};

export type CurrentVolunteerEventRegistrations = {
  volunteer: CurrentVolunteerRecord | null;
  registrations: MyEventRegistration[];
};

type RegistrationRow = EventRegistration;

type VolunteerRow = CurrentVolunteerRecord;

type ProfileRow = VolunteerRegistrationProfile;

type EventRegistrationEventRow = Omit<EventRegistrationEvent, "status"> & {
  status: string;
};

type MyEventRegistrationRow = RegistrationRow & {
  event: EventRegistrationEventRow | EventRegistrationEventRow[] | null;
};

const myEventRegistrationFields = `
  id,
  event_id,
  volunteer_id,
  status,
  registered_at,
  cancelled_at,
  notes,
  event:events (
    id,
    title,
    location,
    starts_at,
    ends_at,
    status
  )
`;

function isEventStatus(value: string): value is EventStatus {
  return eventStatuses.includes(value as EventStatus);
}

function normalizeRegistration(row: RegistrationRow): EventRegistration {
  return {
    ...row,
    status: row.status === "cancelled" ? "cancelled" : "registered"
  };
}

function normalizeRegistrationEvent(
  value: EventRegistrationEventRow | EventRegistrationEventRow[] | null
): EventRegistrationEvent | null {
  const row = Array.isArray(value) ? value[0] ?? null : value;

  if (!row) {
    return null;
  }

  return {
    ...row,
    status: isEventStatus(row.status) ? row.status : "draft"
  };
}

function normalizeMyEventRegistration(row: MyEventRegistrationRow): MyEventRegistration {
  return {
    ...normalizeRegistration(row),
    event: normalizeRegistrationEvent(row.event)
  };
}

async function getRegisteredCount(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  eventId: string
) {
  const { data, error } = await supabase.rpc("event_registered_count", {
    event_id_input: eventId
  });

  if (error) {
    throw new Error("Не удалось загрузить количество записей на проект.");
  }

  return typeof data === "number" ? data : Number(data ?? 0);
}

export async function getCurrentEventRegistrationState(
  eventId: string
): Promise<CurrentEventRegistrationState> {
  const currentUser = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const profileId = currentUser.profile?.id ?? currentUser.user.id;

  const [{ data: volunteerRow }, registeredCount] = await Promise.all([
    supabase
      .from("volunteers")
      .select("id, profile_id, status")
      .eq("profile_id", profileId)
      .maybeSingle(),
    getRegisteredCount(supabase, eventId)
  ]);

  const volunteer = (volunteerRow as VolunteerRow | null) ?? null;

  if (!volunteer) {
    return {
      volunteer: null,
      registration: null,
      registeredCount
    };
  }

  const { data: registrationRow } = await supabase
    .from("event_registrations")
    .select("id, event_id, volunteer_id, status, registered_at, cancelled_at, notes")
    .eq("event_id", eventId)
    .eq("volunteer_id", volunteer.id)
    .maybeSingle();

  return {
    volunteer,
    registration: registrationRow
      ? normalizeRegistration(registrationRow as RegistrationRow)
      : null,
    registeredCount
  };
}

export async function listCurrentVolunteerEventRegistrations(): Promise<CurrentVolunteerEventRegistrations> {
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

  const volunteer = (volunteerRow as VolunteerRow | null) ?? null;

  if (!volunteer) {
    return {
      volunteer: null,
      registrations: []
    };
  }

  const { data, error } = await supabase
    .from("event_registrations")
    .select(myEventRegistrationFields)
    .eq("volunteer_id", volunteer.id)
    .order("registered_at", { ascending: false });

  if (error) {
    throw new Error("Не удалось загрузить ваши записи на проекты.");
  }

  return {
    volunteer,
    registrations: ((data ?? []) as MyEventRegistrationRow[]).map(
      normalizeMyEventRegistration
    )
  };
}

export async function listEventRegistrationsForAdmin(
  eventId: string
): Promise<AdminEventRegistration[]> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data: registrationRows, error } = await supabase
    .from("event_registrations")
    .select("id, event_id, volunteer_id, status, registered_at, cancelled_at, notes")
    .eq("event_id", eventId)
    .eq("status", "registered")
    .order("registered_at", { ascending: true });

  if (error) {
    throw new Error("Не удалось загрузить участников события.");
  }

  const registrations = ((registrationRows ?? []) as RegistrationRow[]).map(
    normalizeRegistration
  );

  if (registrations.length === 0) {
    return [];
  }

  const volunteerIds = registrations.map((registration) => registration.volunteer_id);

  const { data: volunteerRows, error: volunteersError } = await supabase
    .from("volunteers")
    .select("id, profile_id, status")
    .in("id", volunteerIds);

  if (volunteersError) {
    throw new Error("Не удалось загрузить волонтёрские карточки участников.");
  }

  const volunteers = (volunteerRows ?? []) as VolunteerRow[];
  const volunteersById = new Map(volunteers.map((volunteer) => [volunteer.id, volunteer]));
  const profileIds = volunteers.map((volunteer) => volunteer.profile_id);

  const { data: profileRows, error: profilesError } =
    profileIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", profileIds)
      : { data: [], error: null };

  if (profilesError) {
    throw new Error("Не удалось загрузить профили участников.");
  }

  const profilesById = new Map(
    ((profileRows ?? []) as ProfileRow[]).map((profile) => [profile.id, profile])
  );

  return registrations.map((registration) => {
    const volunteer = volunteersById.get(registration.volunteer_id) ?? null;

    return {
      ...registration,
      volunteer,
      profile: volunteer ? profilesById.get(volunteer.profile_id) ?? null : null
    };
  });
}
