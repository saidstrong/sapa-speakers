"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseEventFormData } from "@/lib/validations/event";

const eventIdSchema = z.string().uuid();

function redirectWithResult(
  href: string,
  type: "success" | "error",
  message: string
): never {
  const params = new URLSearchParams({
    type,
    message
  });

  redirect(`${href}?${params.toString()}`);
}

export async function createEvent(formData: FormData) {
  const parsed = parseEventFormData(formData);

  if (!parsed.success) {
    redirectWithResult(
      "/admin/events/new",
      "error",
      parsed.error.issues[0]?.message ?? "Проверьте данные события."
    );
  }

  const currentUser = await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("events")
    .insert({
      ...parsed.data,
      created_by: currentUser.profile?.id ?? currentUser.user.id
    })
    .select("id")
    .single();

  if (error || !data) {
    redirectWithResult(
      "/admin/events/new",
      "error",
      "Не удалось создать событие. Проверьте данные и права доступа."
    );
  }

  revalidatePath("/admin/events");
  redirectWithResult(
    `/admin/events/${data.id}`,
    "success",
    "Событие создано."
  );
}

export async function updateEvent(eventId: string, formData: FormData) {
  const parsedId = eventIdSchema.safeParse(eventId);

  if (!parsedId.success) {
    redirect("/admin/events");
  }

  const parsed = parseEventFormData(formData);

  if (!parsed.success) {
    redirectWithResult(
      `/admin/events/${parsedId.data}/edit`,
      "error",
      parsed.error.issues[0]?.message ?? "Проверьте данные события."
    );
  }

  await requireAdminUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("events")
    .update(parsed.data)
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectWithResult(
      `/admin/events/${parsedId.data}/edit`,
      "error",
      "Не удалось обновить событие. Проверьте данные и права доступа."
    );
  }

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${parsedId.data}`);
  revalidatePath(`/admin/events/${parsedId.data}/edit`);
  redirectWithResult(
    `/admin/events/${parsedId.data}`,
    "success",
    "Событие обновлено."
  );
}
