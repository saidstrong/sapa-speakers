import { z } from "zod";

export const achievementTypes = [
  "general",
  "attendance",
  "contribution",
  "leadership",
  "special"
] as const;

export const achievementStatuses = ["awarded", "revoked"] as const;

export type AchievementType = (typeof achievementTypes)[number];

export type AchievementStatus = (typeof achievementStatuses)[number];

function readString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

const optionalText = z
  .string()
  .trim()
  .max(2000, "Описание не должно быть длиннее 2000 символов.")
  .transform((value) => (value.length > 0 ? value : null));

export const achievementFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Укажите название достижения.")
    .max(180, "Название не должно быть длиннее 180 символов."),
  achievement_type: z.enum(achievementTypes, {
    error: "Выберите корректный тип достижения."
  }),
  description: optionalText
});

export type AchievementFormInput = z.infer<typeof achievementFormSchema>;

export function parseAchievementFormData(formData: FormData) {
  return achievementFormSchema.safeParse({
    title: readString(formData.get("title")),
    achievement_type: readString(formData.get("achievement_type")),
    description: readString(formData.get("description"))
  });
}
