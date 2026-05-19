import { z } from "zod";
import { roleKeys } from "@/lib/auth/roles";

export const roleChangeReasonMaxLength = 1000;

export const roleChangeSchema = z.object({
  new_role: z.enum(roleKeys, {
    message: "Выберите допустимую роль."
  }),
  reason: z
    .string()
    .trim()
    .max(
      roleChangeReasonMaxLength,
      `Причина не должна быть длиннее ${roleChangeReasonMaxLength} символов.`
    )
    .transform((value) => (value.length > 0 ? value : null)),
  target_profile_id: z.uuid("Профиль не найден.")
});

export const roleManagementFiltersSchema = z.object({
  q: z.string().trim().max(120).optional().catch(undefined),
  role: z
    .union([z.enum(roleKeys), z.literal("all")])
    .optional()
    .catch("all")
});

export type RoleChangeInput = z.infer<typeof roleChangeSchema>;
export type RoleManagementFilters = z.infer<typeof roleManagementFiltersSchema>;
