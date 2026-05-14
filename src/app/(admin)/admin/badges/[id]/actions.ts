"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { revokeAchievementForAdmin } from "@/lib/queries/achievements";
import {
  achievementIdSchema,
  parseAchievementRevocationFormData
} from "@/lib/validations/achievement";

function redirectWithResult(
  achievementId: string,
  type: "success" | "error",
  message: string
): never {
  const params = new URLSearchParams({
    type,
    message
  });

  redirect(`/admin/badges/${achievementId}?${params.toString()}`);
}

export async function revokeAchievement(achievementId: string, formData: FormData) {
  const parsedId = achievementIdSchema.safeParse(achievementId);

  if (!parsedId.success) {
    redirect("/admin/badges");
  }

  const parsedForm = parseAchievementRevocationFormData(formData);

  if (!parsedForm.success) {
    redirectWithResult(
      parsedId.data,
      "error",
      parsedForm.error.issues[0]?.message ?? "Укажите причину отзыва достижения."
    );
  }

  const result = await revokeAchievementForAdmin({
    achievementId: parsedId.data,
    revocationReason: parsedForm.data.revocation_reason
  });

  if (result.status === "not_found") {
    redirect("/admin/badges");
  }

  if (result.status === "invalid_reason") {
    redirectWithResult(parsedId.data, "error", "Укажите причину отзыва достижения.");
  }

  revalidatePath("/admin/badges");
  revalidatePath(`/admin/badges/${parsedId.data}`);
  revalidatePath("/app/achievements");

  if (result.volunteerId) {
    revalidatePath(`/admin/volunteers/${result.volunteerId}`);
  }

  if (result.status === "already_revoked") {
    redirectWithResult(parsedId.data, "error", "Достижение уже отозвано.");
  }

  redirectWithResult(parsedId.data, "success", "Достижение отозвано.");
}
