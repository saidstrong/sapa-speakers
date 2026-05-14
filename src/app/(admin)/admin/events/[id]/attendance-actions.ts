"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/lib/auth/current-user";
import {
  eventAttendanceStatuses,
  type EventAttendanceStatus
} from "@/lib/queries/event-attendance";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const eventIdSchema = z.string().uuid();

const attendanceFormSchema = z.object({
  volunteer_id: z.string().uuid(),
  registration_id: z.string().uuid(),
  status: z.enum(eventAttendanceStatuses, {
    error: "Выберите корректный статус посещаемости."
  }),
  notes: z
    .string()
    .trim()
    .max(1000, "Комментарий не должен быть длиннее 1000 символов.")
    .transform((value) => (value.length > 0 ? value : null))
});

function readString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function redirectWithResult(
  eventId: string,
  type: "success" | "error",
  message: string
): never {
  const params = new URLSearchParams({
    type,
    message
  });

  redirect(`/admin/events/${eventId}?${params.toString()}`);
}

function statusSuccessMessage(status: EventAttendanceStatus) {
  if (status === "attended") {
    return "Участник отмечен как присутствовавший.";
  }

  if (status === "absent") {
    return "Участник отмечен как отсутствовавший.";
  }

  return "Участник отмечен с уважительной причиной.";
}

export async function markEventAttendance(eventId: string, formData: FormData) {
  const parsedId = eventIdSchema.safeParse(eventId);

  if (!parsedId.success) {
    redirect("/admin/events");
  }

  const parsedForm = attendanceFormSchema.safeParse({
    volunteer_id: readString(formData.get("volunteer_id")),
    registration_id: readString(formData.get("registration_id")),
    status: readString(formData.get("status")),
    notes: readString(formData.get("notes"))
  });

  if (!parsedForm.success) {
    redirectWithResult(
      parsedId.data,
      "error",
      parsedForm.error.issues[0]?.message ?? "Проверьте данные посещаемости."
    );
  }

  const currentUser = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const { registration_id, status, volunteer_id, notes } = parsedForm.data;

  const { data: registration, error: registrationError } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("id", registration_id)
    .eq("event_id", parsedId.data)
    .eq("volunteer_id", volunteer_id)
    .eq("status", "registered")
    .maybeSingle();

  if (registrationError || !registration) {
    redirectWithResult(
      parsedId.data,
      "error",
      "Посещаемость можно отмечать только для активных записей на это событие."
    );
  }

  const markedBy = currentUser.profile?.id ?? currentUser.user.id;
  const markedAt = new Date().toISOString();

  const { data, error } = await supabase
    .from("event_attendance")
    .upsert(
      {
        event_id: parsedId.data,
        volunteer_id,
        registration_id,
        status,
        notes,
        marked_by: markedBy,
        marked_at: markedAt
      },
      {
        onConflict: "event_id,volunteer_id"
      }
    )
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectWithResult(
      parsedId.data,
      "error",
      "Не удалось обновить посещаемость. Проверьте данные и права доступа."
    );
  }

  revalidatePath(`/admin/events/${parsedId.data}`);
  redirectWithResult(parsedId.data, "success", statusSuccessMessage(status));
}
