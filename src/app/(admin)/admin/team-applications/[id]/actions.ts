"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const applicationIdSchema = z.string().uuid();

function readReviewerNotes(formData: FormData) {
  const value = formData.get("reviewer_notes");

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 2000) : null;
}

function redirectWithResult(
  applicationId: string,
  type: "success" | "error",
  message: string
): never {
  const params = new URLSearchParams({
    type,
    message
  });

  redirect(`/admin/team-applications/${applicationId}?${params.toString()}`);
}

async function loadApplication(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  applicationId: string
) {
  const { data, error } = await supabase
    .from("volunteer_applications")
    .select("id, email, status")
    .eq("id", applicationId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as {
    id: string;
    email: string;
    status: "pending" | "approved" | "declined";
  };
}

async function linkVolunteerRecord(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  applicationId: string,
  email: string
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (!profile) {
    return {
      linked: false,
      message:
        "Заявка одобрена, но профиль пользователя ещё не создан. Попросите кандидата зарегистрироваться с тем же email."
    };
  }

  const { error } = await supabase.from("volunteers").upsert(
    {
      profile_id: profile.id,
      application_id: applicationId,
      status: "active"
    },
    {
      onConflict: "profile_id"
    }
  );

  if (error) {
    return {
      linked: false,
      message:
        "Заявка одобрена, но волонтёрскую карточку не удалось создать. Проверьте права доступа и повторите действие."
    };
  }

  return {
    linked: true,
    message: "Волонтёрская карточка создана или уже существует."
  };
}

export async function approveVolunteerApplication(
  applicationId: string,
  formData: FormData
) {
  const parsedId = applicationIdSchema.safeParse(applicationId);

  if (!parsedId.success) {
    redirect("/admin/team-applications");
  }

  const currentUser = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const application = await loadApplication(supabase, parsedId.data);

  if (!application) {
    redirectWithResult(
      parsedId.data,
      "error",
      "Заявка не найдена или недоступна для просмотра."
    );
  }

  if (application.status === "declined") {
    redirectWithResult(
      parsedId.data,
      "error",
      "Заявка уже отклонена. Повторное одобрение в этой фазе не выполняется."
    );
  }

  if (application.status === "pending") {
    const { error } = await supabase
      .from("volunteer_applications")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewer_notes: readReviewerNotes(formData),
        reviewed_by: currentUser.profile?.id ?? currentUser.user.id
      })
      .eq("id", parsedId.data);

    if (error) {
      redirectWithResult(
        parsedId.data,
        "error",
        "Не удалось одобрить заявку. Попробуйте ещё раз."
      );
    }
  }

  const result = await linkVolunteerRecord(supabase, parsedId.data, application.email);

  revalidatePath("/admin/team-applications");
  revalidatePath(`/admin/team-applications/${parsedId.data}`);
  redirectWithResult(parsedId.data, result.linked ? "success" : "error", result.message);
}

export async function declineVolunteerApplication(
  applicationId: string,
  formData: FormData
) {
  const parsedId = applicationIdSchema.safeParse(applicationId);

  if (!parsedId.success) {
    redirect("/admin/team-applications");
  }

  const currentUser = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const application = await loadApplication(supabase, parsedId.data);

  if (!application) {
    redirectWithResult(
      parsedId.data,
      "error",
      "Заявка не найдена или недоступна для просмотра."
    );
  }

  if (application.status === "approved") {
    redirectWithResult(
      parsedId.data,
      "error",
      "Заявка уже одобрена. Отклонение одобренной заявки в этой фазе не выполняется."
    );
  }

  if (application.status === "declined") {
    redirectWithResult(parsedId.data, "success", "Заявка уже отклонена.");
  }

  const { error } = await supabase
    .from("volunteer_applications")
    .update({
      status: "declined",
      reviewed_at: new Date().toISOString(),
      reviewer_notes: readReviewerNotes(formData),
      reviewed_by: currentUser.profile?.id ?? currentUser.user.id
    })
    .eq("id", parsedId.data);

  if (error) {
    redirectWithResult(
      parsedId.data,
      "error",
      "Не удалось отклонить заявку. Попробуйте ещё раз."
    );
  }

  revalidatePath("/admin/team-applications");
  revalidatePath(`/admin/team-applications/${parsedId.data}`);
  redirectWithResult(parsedId.data, "success", "Заявка отклонена.");
}
