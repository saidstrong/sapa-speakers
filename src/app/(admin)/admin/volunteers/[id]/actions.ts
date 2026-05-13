"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/lib/auth/current-user";
import { volunteerStatuses } from "@/lib/queries/volunteers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const volunteerIdSchema = z.string().uuid();

const updateVolunteerSchema = z.object({
  status: z.enum(volunteerStatuses),
  notes: z
    .string()
    .trim()
    .max(5000, "Комментарий не должен быть длиннее 5000 символов.")
    .optional()
});

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

export async function updateVolunteer(volunteerId: string, formData: FormData) {
  const parsedId = volunteerIdSchema.safeParse(volunteerId);

  if (!parsedId.success) {
    redirect("/admin/volunteers");
  }

  const parsed = updateVolunteerSchema.safeParse({
    status: formData.get("status"),
    notes: formData.get("notes")
  });

  if (!parsed.success) {
    redirectWithResult(
      parsedId.data,
      "error",
      parsed.error.issues[0]?.message ?? "Проверьте данные карточки."
    );
  }

  await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const { status, notes } = parsed.data;

  const { data, error } = await supabase
    .from("volunteers")
    .update({
      status,
      notes: notes && notes.length > 0 ? notes : null
    })
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirectWithResult(
      parsedId.data,
      "error",
      "Не удалось обновить волонтёрскую карточку."
    );
  }

  revalidatePath("/admin/volunteers");
  revalidatePath(`/admin/volunteers/${parsedId.data}`);
  redirectWithResult(parsedId.data, "success", "Волонтёрская карточка обновлена.");
}
