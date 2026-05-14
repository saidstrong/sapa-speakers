import Link from "next/link";
import {
  announcementStatusLabels
} from "@/components/announcements/announcement-status-badge";
import type { AnnouncementRecord } from "@/lib/queries/announcements";
import {
  announcementStatuses,
  type AnnouncementStatus
} from "@/lib/validations/announcement";

type AnnouncementFormAction = (formData: FormData) => void | Promise<void>;

type AnnouncementFormProps = {
  action: AnnouncementFormAction;
  allowArchived?: boolean;
  announcement?: AnnouncementRecord;
  cancelHref: string;
  submitLabel: string;
};

export function AnnouncementForm({
  action,
  allowArchived = false,
  announcement,
  cancelHref,
  submitLabel
}: AnnouncementFormProps) {
  const statuses = announcementStatuses.filter(
    (status): status is AnnouncementStatus => allowArchived || status !== "archived"
  );

  return (
    <form
      action={action}
      className="grid gap-5 rounded-lg border border-oxford/10 bg-white p-6 shadow-sm"
    >
      <label className="block text-sm font-semibold text-oxford">
        Заголовок
        <input
          className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm"
          defaultValue={announcement?.title ?? ""}
          maxLength={180}
          name="title"
          required
          type="text"
        />
      </label>

      <label className="block text-sm font-semibold text-oxford">
        Текст объявления
        <textarea
          className="mt-2 min-h-56 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm"
          defaultValue={announcement?.body ?? ""}
          maxLength={10000}
          name="body"
          placeholder="Сообщение для волонтёров"
          required
        />
      </label>

      <label className="block text-sm font-semibold text-oxford">
        Статус
        <select
          className="mt-2 w-full rounded-md border border-oxford/15 bg-white px-3 py-2 text-sm md:max-w-sm"
          defaultValue={announcement?.status ?? "draft"}
          name="status"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {announcementStatusLabels[status]}
            </option>
          ))}
        </select>
      </label>

      <p className="text-sm leading-6 text-muted">
        При публикации дата публикации устанавливается автоматически. При переводе в
        черновик или архив дата публикации очищается.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
          type="submit"
        >
          {submitLabel}
        </button>
        <Link
          className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
          href={cancelHref}
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
