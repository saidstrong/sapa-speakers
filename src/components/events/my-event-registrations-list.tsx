import Link from "next/link";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  EventRegistrationEvent,
  EventRegistrationStatus,
  MyEventRegistration
} from "@/lib/queries/event-registrations";

type MyEventRegistrationsListProps = {
  registrations: readonly MyEventRegistration[];
};

const registrationStatusLabels: Record<EventRegistrationStatus, string> = {
  registered: "Зарегистрирована",
  cancelled: "Отменена"
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

function formatEventDate(event: EventRegistrationEvent | null) {
  if (!event) {
    return "Не указано";
  }

  if (!event.ends_at) {
    return formatDate(event.starts_at);
  }

  return `${formatDate(event.starts_at)} - ${formatDate(event.ends_at)}`;
}

function EventStatusValue({ event }: { event: EventRegistrationEvent | null }) {
  if (!event) {
    return <StatusBadge>Недоступен</StatusBadge>;
  }

  return <EventStatusBadge status={event.status} />;
}

export function MyEventRegistrationsList({
  registrations
}: MyEventRegistrationsListProps) {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-oxford">История записей</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Здесь показаны ваши записи и отмены по опубликованным проектам. Посещаемость
          и сертификаты появятся в следующих этапах.
        </p>
      </section>

      {registrations.map((registration) => (
        <article
          className="rounded-lg border border-oxford/10 bg-white p-5 shadow-sm"
          key={registration.id}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-oxford">
                {registration.event?.title ?? "Проект недоступен"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Дата записи: {formatDate(registration.registered_at)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <EventStatusValue event={registration.event} />
              <StatusBadge
                tone={registration.status === "registered" ? "success" : "neutral"}
              >
                {registrationStatusLabels[registration.status]}
              </StatusBadge>
            </div>
          </div>

          <dl className="mt-5 grid gap-3 text-sm md:grid-cols-4">
            <div>
              <dt className="font-semibold text-oxford">Дата и время</dt>
              <dd className="mt-1 text-muted">{formatEventDate(registration.event)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-oxford">Локация</dt>
              <dd className="mt-1 text-muted">
                {registration.event?.location ?? "Не указана"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-oxford">Статус записи</dt>
              <dd className="mt-1 text-muted">
                {registrationStatusLabels[registration.status]}
              </dd>
            </div>
            {registration.cancelled_at ? (
              <div>
                <dt className="font-semibold text-oxford">Дата отмены</dt>
                <dd className="mt-1 text-muted">
                  {formatDate(registration.cancelled_at)}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-5">
            <Link
              className="font-semibold text-oxford underline decoration-orange/60 underline-offset-4 hover:text-orange"
              href={`/app/projects/${registration.event_id}`}
            >
              Открыть проект
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
