"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { awardAchievementForAdmin } from "@/lib/queries/achievements";
import { parseAchievementFormData } from "@/lib/validations/achievement";

const volunteerIdSchema = z.string().uuid();

function redirectWithResult(
  volunteerId: string,
  type: "success" | "error",
  message: string
): never {
  const params = new URLSearchParams({
    type,
    message
  });

  redirect(`/admin/volunteers/${volunteerId}?${params.toString()}`);
}

export async function awardAchievement(volunteerId: string, formData: FormData) {
  const parsedId = volunteerIdSchema.safeParse(volunteerId);

  if (!parsedId.success) {
    redirect("/admin/volunteers");
  }

  const parsedForm = parseAchievementFormData(formData);

  if (!parsedForm.success) {
    redirectWithResult(
      parsedId.data,
      "error",
      parsedForm.error.issues[0]?.message ?? "Проверьте данные достижения."
    );
  }

  await awardAchievementForAdmin({
    achievementType: parsedForm.data.achievement_type,
    description: parsedForm.data.description,
    title: parsedForm.data.title,
    volunteerId: parsedId.data
  });

  revalidatePath("/admin/badges");
  revalidatePath(`/admin/volunteers/${parsedId.data}`);
  revalidatePath("/app/achievements");
  redirectWithResult(parsedId.data, "success", "Достижение выдано.");
}
