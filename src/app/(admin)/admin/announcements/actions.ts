"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createAnnouncementForAdmin,
  updateAnnouncementForAdmin
} from "@/lib/queries/announcements";
import { parseAnnouncementFormData } from "@/lib/validations/announcement";

const announcementIdSchema = z.string().uuid();

function redirectWithResult(
  href: string,
  type: "success" | "error",
  message: string
): never {
  const params = new URLSearchParams({
    message,
    type
  });

  redirect(`${href}?${params.toString()}`);
}

export async function createAnnouncement(formData: FormData) {
  const parsed = parseAnnouncementFormData(formData);

  if (!parsed.success) {
    redirectWithResult(
      "/admin/announcements/new",
      "error",
      parsed.error.issues[0]?.message ?? "Проверьте данные объявления."
    );
  }

  let id: string;

  try {
    id = await createAnnouncementForAdmin(parsed.data);
  } catch {
    redirectWithResult(
      "/admin/announcements/new",
      "error",
      "Не удалось создать объявление. Проверьте данные и права доступа."
    );
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/app/announcements");
  redirectWithResult(`/admin/announcements/${id}`, "success", "Объявление создано.");
}

export async function updateAnnouncement(announcementId: string, formData: FormData) {
  const parsedId = announcementIdSchema.safeParse(announcementId);

  if (!parsedId.success) {
    redirect("/admin/announcements");
  }

  const parsed = parseAnnouncementFormData(formData);

  if (!parsed.success) {
    redirectWithResult(
      `/admin/announcements/${parsedId.data}/edit`,
      "error",
      parsed.error.issues[0]?.message ?? "Проверьте данные объявления."
    );
  }

  let id: string;

  try {
    id = await updateAnnouncementForAdmin(parsedId.data, parsed.data);
  } catch {
    redirectWithResult(
      `/admin/announcements/${parsedId.data}/edit`,
      "error",
      "Не удалось обновить объявление. Проверьте данные и права доступа."
    );
  }

  revalidatePath("/admin/announcements");
  revalidatePath(`/admin/announcements/${id}`);
  revalidatePath(`/admin/announcements/${id}/edit`);
  revalidatePath("/app/announcements");
  redirectWithResult(`/admin/announcements/${id}`, "success", "Объявление обновлено.");
}
