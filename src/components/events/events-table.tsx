import Link from "next/link";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import type { EventRecord } from "@/lib/queries/events";

type EventsTableProps = {
  events: readonly EventRecord[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatCapacity(value: number | null) {
  return value ? value.toString() : "Не указана";
}

export function EventsTable({ events }: EventsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-oxford/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[780px] divide-y divide-oxford/10 text-sm">
          <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Начало</th>
              <th className="px-4 py-3">Локация</th>
              <th className="px-4 py-3">Вместимость</th>
              <th className="px-4 py-3 text-right">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oxford/10">
            {events.map((event) => (
              <tr key={event.id} className="align-top">
                <td className="px-4 py-4 font-semibold text-oxford">{event.title}</td>
                <td className="px-4 py-4">
                  <EventStatusBadge status={event.status} />
                </td>
                <td className="px-4 py-4 text-muted">{formatDate(event.starts_at)}</td>
                <td className="px-4 py-4 text-muted">{event.location ?? "Не указана"}</td>
                <td className="px-4 py-4 text-muted">{formatCapacity(event.capacity)}</td>
                <td className="px-4 py-4 text-right">
                  <Link
                    className="font-semibold text-oxford underline decoration-orange/60 underline-offset-4 hover:text-orange"
                    href={`/admin/events/${event.id}`}
                  >
                    Открыть
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
