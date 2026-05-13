"use server";

import { redirect } from "next/navigation";
import { createSupabaseAnonymousServerClient } from "@/lib/supabase/server";
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

  redirect(`/join?${params.toString()}`);
}

export async function submitVolunteerApplication(formData: FormData) {
  const parsed = volunteerApplicationSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
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

  let supabase: ReturnType<typeof createSupabaseAnonymousServerClient> | null = null;

  try {
    supabase = createSupabaseAnonymousServerClient();
  } catch (error) {
    console.error("Supabase environment is not configured", error);
    redirectWithStatus(
      "error",
      "Форма временно недоступна: не настроено подключение к Supabase."
    );
  }

  if (!supabase) {
    redirectWithStatus(
      "error",
      "Форма временно недоступна: не настроено подключение к Supabase."
    );
  }

  try {
    const { error } = await supabase.from("volunteer_applications").insert({
      ...parsed.data,
      status: "pending"
    });

    if (error) {
      console.error("Volunteer application insert failed", error);
      redirectWithStatus(
        "error",
        "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с командой SapaSpeakers."
      );
    }
  } catch (error) {
    console.error("Volunteer application submit failed", error);
    redirectWithStatus(
      "error",
      "Произошла ошибка при отправке заявки. Попробуйте ещё раз."
    );
  }

  redirectWithStatus("success");
}
