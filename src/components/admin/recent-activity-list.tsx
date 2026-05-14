import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import type { AdminDashboardActivityItem } from "@/lib/queries/admin-dashboard";

type RecentActivityListProps = {
  items: readonly AdminDashboardActivityItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function RecentActivityList({ items }: RecentActivityListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Последняя активность"
        description="Пока нет операционных записей. Новые заявки, записи, посещаемость и награды появятся здесь после работы команды."
      />
    );
  }

  return (
    <section className="rounded-lg border border-oxford/10 bg-white shadow-sm">
      <div className="border-b border-oxford/10 px-5 py-4">
        <h2 className="text-lg font-semibold text-oxford">Последняя активность</h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Последние записи из существующих операционных таблиц.
        </p>
      </div>
      <ul className="divide-y divide-oxford/10">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              className="grid gap-2 px-5 py-4 transition hover:bg-oxford/5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
              href={item.href}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-oxford/10 bg-oxford/5 px-2 py-1 text-xs font-semibold text-muted">
                    {item.kind}
                  </span>
                  <span className="font-semibold text-oxford">{item.title}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
              </div>
              <time className="text-sm text-muted" dateTime={item.occurredAt}>
                {formatDate(item.occurredAt)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
