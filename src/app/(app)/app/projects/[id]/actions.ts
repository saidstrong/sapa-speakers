"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const eventIdSchema = z.string().uuid();

function redirectWithResult(
  eventId: string,
  type: "success" | "error",
  message: string
): never {
  const params = new URLSearchParams({
    type,
    message
  });

  redirect(`/app/projects/${eventId}?${params.toString()}`);
}

async function getRegisteredCount(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  eventId: string
) {
  const { data, error } = await supabase.rpc("event_registered_count", {
    event_id_input: eventId
  });

  if (error) {
    return null;
  }

  return typeof data === "number" ? data : Number(data ?? 0);
}

async function loadPublishedEvent(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  eventId: string
) {
  const { data, error } = await supabase
    .from("events")
    .select("id, status, capacity")
    .eq("id", eventId)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as {
    id: string;
    status: "published";
    capacity: number | null;
  };
}

async function loadCurrentVolunteer(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  profileId: string
) {
  const { data, error } = await supabase
    .from("volunteers")
    .select("id, status")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as {
    id: string;
    status: string;
  };
}

async function loadRegistration(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  eventId: string,
  volunteerId: string
) {
  const { data, error } = await supabase
    .from("event_registrations")
    .select("id, status")
    .eq("event_id", eventId)
    .eq("volunteer_id", volunteerId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as {
    id: string;
    status: "registered" | "cancelled";
  };
}

export async function registerForEvent(eventId: string) {
  const parsedId = eventIdSchema.safeParse(eventId);

  if (!parsedId.success) {
    redirect("/app/projects");
  }

  const currentUser = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const profileId = currentUser.profile?.id ?? currentUser.user.id;
  const event = await loadPublishedEvent(supabase, parsedId.data);

  if (!event) {
    redirectWithResult(
      parsedId.data,
      "error",
      "Проект не найден или больше не опубликован."
    );
  }

  const volunteer = await loadCurrentVolunteer(supabase, profileId);

  if (!volunteer) {
    redirectWithResult(
      parsedId.data,
      "error",
      "Запись доступна только одобренным волонтёрам. Если вы уже подали заявку, дождитесь подтверждения."
    );
  }

  if (volunteer.status !== "active") {
    redirectWithResult(
      parsedId.data,
      "error",
      "Ваш волонтёрский статус не позволяет записаться на проект."
    );
  }

  const registration = await loadRegistration(supabase, parsedId.data, volunteer.id);

  if (registration?.status === "registered") {
    redirectWithResult(parsedId.data, "success", "Вы уже записаны на этот проект.");
  }

  const registeredCount = await getRegisteredCount(supabase, parsedId.data);

  if (registeredCount === null) {
    redirectWithResult(
      parsedId.data,
      "error",
      "Не удалось проверить количество свободных мест."
    );
  }

  if (event.capacity !== null && registeredCount >= event.capacity) {
    redirectWithResult(parsedId.data, "error", "Мест больше нет.");
  }

  const result = registration
    ? await supabase
        .from("event_registrations")
        .update({
          status: "registered",
          cancelled_at: null
        })
        .eq("id", registration.id)
        .select("id")
        .maybeSingle()
    : await supabase
        .from("event_registrations")
        .insert({
          event_id: parsedId.data,
          volunteer_id: volunteer.id,
          status: "registered"
        })
        .select("id")
        .maybeSingle();

  if (result.error || !result.data) {
    redirectWithResult(
      parsedId.data,
      "error",
      "Не удалось записаться на проект. Попробуйте ещё раз."
    );
  }

  revalidatePath("/app/projects");
  revalidatePath(`/app/projects/${parsedId.data}`);
  redirectWithResult(parsedId.data, "success", "Вы записаны на этот проект.");
}

export async function cancelEventRegistration(eventId: string) {
  const parsedId = eventIdSchema.safeParse(eventId);

  if (!parsedId.success) {
    redirect("/app/projects");
  }

  const currentUser = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const profileId = currentUser.profile?.id ?? currentUser.user.id;
  const volunteer = await loadCurrentVolunteer(supabase, profileId);

  if (!volunteer) {
    redirectWithResult(
      parsedId.data,
      "error",
      "Запись доступна только одобренным волонтёрам. Если вы уже подали заявку, дождитесь подтверждения."
    );
  }

  if (volunteer.status !== "active") {
    redirectWithResult(
      parsedId.data,
      "error",
      "Ваш волонтёрский статус не позволяет изменить запись на проект."
    );
  }

  const registration = await loadRegistration(supabase, parsedId.data, volunteer.id);

  if (!registration || registration.status === "cancelled") {
    redirectWithResult(parsedId.data, "success", "Запись уже отменена.");
  }

  const { data, error } = await supabase
    .from("event_registrations")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString()
    })
    .eq("id", registration.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectWithResult(
      parsedId.data,
      "error",
      "Не удалось отменить запись. Попробуйте ещё раз."
    );
  }

  revalidatePath("/app/projects");
  revalidatePath(`/app/projects/${parsedId.data}`);
  redirectWithResult(parsedId.data, "success", "Запись отменена.");
}
