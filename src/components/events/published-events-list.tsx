import Link from "next/link";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import type { PublishedEvent } from "@/lib/queries/published-events";

type PublishedEventsListProps = {
  events: readonly PublishedEvent[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatCapacity(value: number | null) {
  return value ? `${value} мест` : "Не указана";
}

export function PublishedEventsList({ events }: PublishedEventsListProps) {
  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <article
          className="rounded-lg border border-oxford/10 bg-white p-5 shadow-sm"
          key={event.id}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-oxford">{event.title}</h2>
              {event.description ? (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                  {event.description}
                </p>
              ) : null}
            </div>
            <EventStatusBadge status={event.status} />
          </div>

          <dl className="mt-5 grid gap-3 text-sm md:grid-cols-3">
            <div>
              <dt className="font-semibold text-oxford">Дата и время</dt>
              <dd className="mt-1 text-muted">{formatDate(event.starts_at)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-oxford">Локация</dt>
              <dd className="mt-1 text-muted">{event.location ?? "Не указана"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-oxford">Вместимость</dt>
              <dd className="mt-1 text-muted">{formatCapacity(event.capacity)}</dd>
            </div>
          </dl>

          <div className="mt-5">
            <Link
              className="font-semibold text-oxford underline decoration-orange/60 underline-offset-4 hover:text-orange"
              href={`/app/projects/${event.id}`}
            >
              Открыть проект
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
