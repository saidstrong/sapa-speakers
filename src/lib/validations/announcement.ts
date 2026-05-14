import { z } from "zod";

export const announcementStatuses = ["draft", "published", "archived"] as const;

export type AnnouncementStatus = (typeof announcementStatuses)[number];

function readString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export const announcementFormSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Укажите текст объявления.")
    .max(10000, "Текст объявления не должен быть длиннее 10000 символов."),
  status: z.enum(announcementStatuses, {
    error: "Выберите корректный статус объявления."
  }),
  title: z
    .string()
    .trim()
    .min(1, "Укажите заголовок объявления.")
    .max(180, "Заголовок не должен быть длиннее 180 символов.")
});

export type AnnouncementFormInput = z.infer<typeof announcementFormSchema>;

export function parseAnnouncementFormData(formData: FormData) {
  return announcementFormSchema.safeParse({
    body: readString(formData.get("body")),
    status: readString(formData.get("status")),
    title: readString(formData.get("title"))
  });
}
