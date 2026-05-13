import { z } from "zod";

const optionalText = (maxLength: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return undefined;
      }

      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(maxLength, "Слишком длинное значение.").optional()
  );

const textArray = z.preprocess(
  (value) => {
    const values = Array.isArray(value)
      ? value
      : typeof value === "string"
        ? value.split(",")
        : [];

    return Array.from(
      new Set(
        values
          .map((item) => String(item).trim())
          .filter((item) => item.length > 0)
      )
    );
  },
  z
    .array(z.string().max(80, "Слишком длинное значение."))
    .max(12, "Выберите не больше 12 вариантов.")
    .default([])
);

const optionalAge = z.preprocess(
  (value) => {
    if (typeof value !== "string" || value.trim().length === 0) {
      return undefined;
    }

    return Number(value);
  },
  z
    .number({
      error: "Укажите возраст числом."
    })
    .int("Укажите возраст целым числом.")
    .min(12, "Возраст должен быть не меньше 12 лет.")
    .max(100, "Возраст должен быть не больше 100 лет.")
    .optional()
);

export const volunteerApplicationSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Введите ФИО.")
    .max(160, "ФИО слишком длинное."),
  email: z
    .string()
    .trim()
    .email("Введите корректный email.")
    .max(254, "Email слишком длинный."),
  phone: optionalText(40),
  telegram: optionalText(64),
  city: optionalText(100),
  age: optionalAge,
  languages: textArray,
  interests: textArray,
  experience: optionalText(2000),
  motivation: z
    .string()
    .trim()
    .min(10, "Напишите, почему вы хотите стать волонтёром.")
    .max(3000, "Мотивация слишком длинная."),
  availability: optionalText(1000)
});

export type VolunteerApplicationInput = z.infer<
  typeof volunteerApplicationSchema
>;

export function getVolunteerApplicationValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Проверьте данные формы.";
}
