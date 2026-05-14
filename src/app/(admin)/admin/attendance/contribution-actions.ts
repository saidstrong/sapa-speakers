"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const contributionFormSchema = z.object({
  attendance_id: z.string().uuid(),
  hours: z
    .string()
    .trim()
    .transform((value) => Number(value.replace(",", ".")))
    .refine((value) => Number.isFinite(value), {
      message: "Укажите количество часов."
    })
    .refine((value) => value > 0, {
      message: "Часы должны быть больше нуля."
    })
    .refine((value) => value <= 24, {
      message: "Часы не могут быть больше 24."
    })
    .transform((value) => Math.round(value * 100) / 100),
  description: z
    .string()
    .trim()
    .max(1000, "Описание не должно быть длиннее 1000 символов.")
    .transform((value) => (value.length > 0 ? value : null))
});

function readString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function redirectWithResult(type: "success" | "error", message: string): never {
  const params = new URLSearchParams({
    type,
    message
  });

  redirect(`/admin/attendance?${params.toString()}`);
}

export async function saveAttendanceContribution(formData: FormData) {
  const parsed = contributionFormSchema.safeParse({
    attendance_id: readString(formData.get("attendance_id")),
    hours: readString(formData.get("hours")),
    description: readString(formData.get("description"))
  });

  if (!parsed.success) {
    redirectWithResult(
      "error",
      parsed.error.issues[0]?.message ?? "Проверьте данные вклада."
    );
  }

  const currentUser = await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const { attendance_id, description, hours } = parsed.data;

  const { data: attendance, error: attendanceError } = await supabase
    .from("event_attendance")
    .select("id, event_id, volunteer_id, status")
    .eq("id", attendance_id)
    .maybeSingle();

  if (attendanceError || !attendance) {
    redirectWithResult("error", "Запись посещаемости не найдена.");
  }

  const attendanceRecord = attendance as {
    id: string;
    event_id: string;
    volunteer_id: string;
    status: string;
  };

  if (attendanceRecord.status !== "attended") {
    redirectWithResult(
      "error",
      "Часы можно подтвердить только для записей со статусом «Был»."
    );
  }

  const awardedBy = currentUser.profile?.id ?? currentUser.user.id;
  const awardedAt = new Date().toISOString();

  const { data: existingContribution, error: existingError } = await supabase
    .from("volunteer_contributions")
    .select("id")
    .eq("attendance_id", attendanceRecord.id)
    .eq("contribution_type", "event_attendance")
    .maybeSingle();

  if (existingError) {
    redirectWithResult("error", "Не удалось проверить существующие часы.");
  }

  const payload = {
    volunteer_id: attendanceRecord.volunteer_id,
    event_id: attendanceRecord.event_id,
    attendance_id: attendanceRecord.id,
    contribution_type: "event_attendance",
    hours,
    description,
    awarded_by: awardedBy,
    awarded_at: awardedAt
  };

  const result = existingContribution
    ? await supabase
        .from("volunteer_contributions")
        .update(payload)
        .eq("id", existingContribution.id)
        .select("id")
        .maybeSingle()
    : await supabase
        .from("volunteer_contributions")
        .insert(payload)
        .select("id")
        .maybeSingle();

  if (result.error || !result.data) {
    redirectWithResult("error", "Не удалось сохранить подтверждённые часы.");
  }

  revalidatePath("/admin/attendance");
  revalidatePath("/app/achievements");
  redirectWithResult("success", "Подтверждённые часы сохранены.");
}
