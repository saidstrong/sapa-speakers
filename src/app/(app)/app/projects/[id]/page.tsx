import Link from "next/link";
import { EventRegistrationPanel } from "@/components/events/event-registration-panel";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentEventRegistrationState } from "@/lib/queries/event-registrations";
import { getPublishedEvent } from "@/lib/queries/published-events";
import { cancelEventRegistration, registerForEvent } from "./actions";

type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    type?: string;
    message?: string;
  }>;
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

function formatCapacity(value: number | null) {
  return value ? `${value} мест` : "Не указана";
}

function DetailItem({
  label,
  value
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-muted">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-oxford">{value || "Не указано"}</dd>
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
  searchParams
}: ProjectDetailPageProps) {
  const { id } = await params;
  const result = await searchParams;
  const [event, registrationState] = await Promise.all([
    getPublishedEvent(id),
    getCurrentEventRegistrationState(id)
  ]);
  const registerAction = registerForEvent.bind(null, event.id);
  const cancelAction = cancelEventRegistration.bind(null, event.id);

  return (
    <>
      <PageHeader
        title={event.title}
        description="Опубликованный проект или событие SapaSpeakers. Здесь можно изучить детали и управлять своей записью на участие."
        action={
          <Link
            className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford"
            href="/app/projects"
          >
            Назад к проектам
          </Link>
        }
      />

      <div className="grid gap-6">
        <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 border-b border-oxford/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-oxford">{event.title}</h2>
              <p className="mt-1 text-sm text-muted">
                {event.location ?? "Локация будет уточнена"}
              </p>
            </div>
            <EventStatusBadge status={event.status} />
          </div>

          <dl className="grid gap-5 md:grid-cols-2">
            <DetailItem label="Описание" value={event.description} />
            <DetailItem label="Локация" value={event.location} />
            <DetailItem label="Начало" value={formatDate(event.starts_at)} />
            <DetailItem label="Окончание" value={formatDate(event.ends_at)} />
            <DetailItem label="Вместимость" value={formatCapacity(event.capacity)} />
            <DetailItem
              label="Статус"
              value={<EventStatusBadge status={event.status} />}
            />
          </dl>
        </section>

        <EventRegistrationPanel
          cancelAction={cancelAction}
          capacity={event.capacity}
          registeredCount={registrationState.registeredCount}
          registrationState={registrationState}
          registerAction={registerAction}
          result={result}
        />
      </div>
    </>
  );
}
