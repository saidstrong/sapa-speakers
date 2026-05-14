import { EmptyState } from "@/components/ui/empty-state";
import type { AnnouncementRecord } from "@/lib/queries/announcements";

type AnnouncementsListProps = {
  announcements: readonly AnnouncementRecord[];
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

export function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  if (announcements.length === 0) {
    return (
      <EmptyState
        title="Объявления"
        description="Пока нет опубликованных объявлений."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {announcements.map((announcement) => (
        <article
          className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm"
          key={announcement.id}
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <h2 className="text-xl font-semibold text-oxford">{announcement.title}</h2>
            <p className="shrink-0 text-sm text-muted">
              {formatDate(announcement.published_at)}
            </p>
          </div>
          <div className="mt-4 whitespace-pre-line text-sm leading-7 text-oxford">
            {announcement.body}
          </div>
        </article>
      ))}
    </div>
  );
}
