import Link from "next/link";
import { AnnouncementStatusBadge } from "@/components/announcements/announcement-status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { AnnouncementListItem } from "@/lib/queries/announcements";

type AnnouncementsTableProps = {
  announcements: readonly AnnouncementListItem[];
};

function formatDate(value: string | null) {
  if (!value) {
    return "Не указано";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function displayProfile(profile: AnnouncementListItem["createdByProfile"]) {
  if (!profile) {
    return "Не указан";
  }

  return profile.full_name ?? profile.email;
}

export function AnnouncementsTable({ announcements }: AnnouncementsTableProps) {
  if (announcements.length === 0) {
    return (
      <EmptyState
        title="Объявления"
        description="Пока нет объявлений. Создайте первое объявление для волонтёров."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-oxford/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-oxford/10 text-sm">
          <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Заголовок</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Публикация</th>
              <th className="px-4 py-3">Создано</th>
              <th className="px-4 py-3">Автор</th>
              <th className="px-4 py-3 text-right">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oxford/10">
            {announcements.map((announcement) => (
              <tr key={announcement.id} className="align-top">
                <td className="px-4 py-4 font-semibold text-oxford">
                  <Link
                    className="transition hover:text-orange"
                    href={`/admin/announcements/${announcement.id}`}
                  >
                    {announcement.title}
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <AnnouncementStatusBadge status={announcement.status} />
                </td>
                <td className="px-4 py-4 text-muted">
                  {formatDate(announcement.published_at)}
                </td>
                <td className="px-4 py-4 text-muted">
                  {formatDate(announcement.created_at)}
                </td>
                <td className="px-4 py-4 text-muted">
                  {displayProfile(announcement.createdByProfile)}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      className="font-semibold text-oxford underline decoration-orange/60 underline-offset-4 hover:text-orange"
                      href={`/admin/announcements/${announcement.id}`}
                    >
                      Открыть
                    </Link>
                    <Link
                      className="font-semibold text-oxford underline decoration-orange/60 underline-offset-4 hover:text-orange"
                      href={`/admin/announcements/${announcement.id}/edit`}
                    >
                      Править
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
