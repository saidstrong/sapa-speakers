"use server";

import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getVolunteerApplicationValidationMessage,
  volunteerApplicationSchema
} from "@/lib/validations/volunteer-application";

function redirectWithStatus(
  status: "success" | "error",
  message?: string
): never {
  const params = new URLSearchParams({ status });

  if (message) {
    params.set("message", message);
  }

  redirect(`/app/join?${params.toString()}`);
}

async function hasActiveVolunteerRow(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  profileId: string
) {
  const { data, error } = await supabase
    .from("volunteers")
    .select("id")
    .eq("profile_id", profileId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    throw new Error("Не удалось проверить волонтёрский профиль.");
  }

  return Boolean(data);
}

export async function submitAuthenticatedVolunteerApplication(
  formData: FormData
): Promise<void> {
  const currentUser = await requireCurrentUser();

  if (currentUser.isAdmin) {
    redirect("/app/join");
  }

  const supabase = await createSupabaseServerClient();
  const profileId = currentUser.profile?.id ?? currentUser.user.id;
  let isActiveVolunteer = false;

  try {
    isActiveVolunteer = await hasActiveVolunteerRow(supabase, profileId);
  } catch (error) {
    console.error("Active volunteer lookup failed", error);
    redirectWithStatus(
      "error",
      "Не удалось проверить волонтёрский профиль. Попробуйте ещё раз."
    );
  }

  if (isActiveVolunteer) {
    redirect("/app/join");
  }

  const trustedEmail =
    currentUser.profile?.email ??
    currentUser.user.email ??
    String(formData.get("email") ?? "");

  const parsed = volunteerApplicationSchema.safeParse({
    full_name: formData.get("full_name"),
    email: trustedEmail,
    phone: formData.get("phone"),
    telegram: formData.get("telegram"),
    city: formData.get("city"),
    age: formData.get("age"),
    languages: formData.getAll("languages"),
    interests: formData.getAll("interests"),
    experience: formData.get("experience"),
    motivation: formData.get("motivation"),
    availability: formData.get("availability")
  });

  if (!parsed.success) {
    redirectWithStatus(
      "error",
      getVolunteerApplicationValidationMessage(parsed.error)
    );
  }

  let insertFailed = false;

  try {
    const { error } = await supabase.from("volunteer_applications").insert({
      ...parsed.data,
      status: "pending"
    });

    if (error) {
      console.error("Volunteer application insert failed", error);
      insertFailed = true;
    }
  } catch (error) {
    console.error("Volunteer application submit failed", error);
    redirectWithStatus(
      "error",
      "Произошла ошибка при отправке заявки. Попробуйте ещё раз."
    );
  }

  if (insertFailed) {
    redirectWithStatus(
      "error",
      "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с командой SapaSpeakers."
    );
  }

  redirectWithStatus("success");
}
