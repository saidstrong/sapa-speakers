import { z } from "zod";

export const certificateTypes = [
  "participation",
  "contribution",
  "leadership",
  "special"
] as const;

export const certificateStatuses = ["issued", "revoked"] as const;

export type CertificateType = (typeof certificateTypes)[number];

export type CertificateStatus = (typeof certificateStatuses)[number];

function readString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

const optionalText = z
  .string()
  .trim()
  .max(2000, "Описание не должно быть длиннее 2000 символов.")
  .transform((value) => (value.length > 0 ? value : null));

export const certificateFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Укажите название сертификата.")
    .max(180, "Название не должно быть длиннее 180 символов."),
  certificate_type: z.enum(certificateTypes, {
    error: "Выберите корректный тип сертификата."
  }),
  description: optionalText
});

export type CertificateFormInput = z.infer<typeof certificateFormSchema>;

export function parseCertificateFormData(formData: FormData) {
  return certificateFormSchema.safeParse({
    title: readString(formData.get("title")),
    certificate_type: readString(formData.get("certificate_type")),
    description: readString(formData.get("description"))
  });
}
