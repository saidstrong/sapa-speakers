import { z } from "zod";

const fullNameMaxLength = 120;
const phoneMaxLength = 40;
const telegramMaxInputLength = 100;
const telegramMaxStoredLength = 64;

function normalizeTelegram(value: string) {
  const trimmed = value
    .trim()
    .replace(/^https?:\/\/(www\.)?t\.me\//i, "")
    .replace(/^t\.me\//i, "")
    .replace(/^telegram\.me\//i, "");

  if (trimmed.length === 0) {
    return null;
  }

  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .trim()
    .max(
      fullNameMaxLength,
      `ФИО не должно быть длиннее ${fullNameMaxLength} символов.`
    )
    .refine(
      (value) => value.length === 0 || value.length >= 2,
      "ФИО должно содержать минимум 2 символа."
    )
    .transform((value) => (value.length > 0 ? value : null)),
  phone: z
    .string()
    .trim()
    .max(phoneMaxLength, `Телефон не должен быть длиннее ${phoneMaxLength} символов.`)
    .transform((value) => (value.length > 0 ? value : null)),
  telegram: z
    .string()
    .trim()
    .max(
      telegramMaxInputLength,
      `Telegram не должен быть длиннее ${telegramMaxInputLength} символов.`
    )
    .transform(normalizeTelegram)
    .refine(
      (value) => value === null || value.length <= telegramMaxStoredLength,
      `Telegram не должен быть длиннее ${telegramMaxStoredLength} символов.`
    )
    .refine(
      (value) => value === null || !/\s/.test(value),
      "Telegram не должен содержать пробелы."
    )
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
