import { z } from "zod";

export const eventStatuses = ["draft", "published", "completed", "cancelled"] as const;

export type EventStatus = (typeof eventStatuses)[number];

function readString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function optionalText(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => (value.length > 0 ? value : null));
}

const dateTimeValue = z
  .string()
  .trim()
  .min(1, "Укажите дату и время начала.")
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Укажите корректную дату и время."
  })
  .transform((value) => new Date(value).toISOString());

const optionalDateTimeValue = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .refine((value) => value === null || !Number.isNaN(new Date(value).getTime()), {
    message: "Укажите корректную дату и время окончания."
  })
  .transform((value) => (value ? new Date(value).toISOString() : null));

export const eventFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Укажите название события.")
      .max(160, "Название не должно быть длиннее 160 символов."),
    description: optionalText(5000),
    location: optionalText(240),
    starts_at: dateTimeValue,
    ends_at: optionalDateTimeValue,
    status: z.enum(eventStatuses, {
      error: "Выберите корректный статус."
    }),
    capacity: z
      .string()
      .trim()
      .transform((value) => (value.length > 0 ? Number(value) : null))
      .refine((value) => value === null || Number.isInteger(value), {
        message: "Вместимость должна быть целым числом."
      })
      .refine((value) => value === null || value > 0, {
        message: "Вместимость должна быть больше нуля."
      })
  })
  .superRefine((value, ctx) => {
    if (!value.ends_at) {
      return;
    }

    if (new Date(value.ends_at) < new Date(value.starts_at)) {
      ctx.addIssue({
        code: "custom",
        path: ["ends_at"],
        message: "Дата окончания не может быть раньше даты начала."
      });
    }
  });

export type EventFormInput = z.infer<typeof eventFormSchema>;

export function parseEventFormData(formData: FormData) {
  return eventFormSchema.safeParse({
    title: readString(formData.get("title")),
    description: readString(formData.get("description")),
    location: readString(formData.get("location")),
    starts_at: readString(formData.get("starts_at")),
    ends_at: readString(formData.get("ends_at")),
    status: readString(formData.get("status")),
    capacity: readString(formData.get("capacity"))
  });
}
