import Link from "next/link";
import { EventRegistrationList } from "@/components/events/event-registration-list";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { listEventRegistrationsForAdmin } from "@/lib/queries/event-registrations";
import { getEventDetail } from "@/lib/queries/events";

type EventDetailPageProps = {
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
  return value ? value.toString() : "Не указана";
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

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-oxford">{title}</h2>
      {children}
    </section>
  );
}

export default async function EventDetailPage({
  params,
  searchParams
}: EventDetailPageProps) {
  const { id } = await params;
  const result = await searchParams;
  const [event, registrations] = await Promise.all([
    getEventDetail(id),
    listEventRegistrationsForAdmin(id)
  ]);

  return (
    <>
      <PageHeader
        title={event.title}
        description="Карточка внутреннего события или проекта. В этой фазе доступны только просмотр и редактирование основных полей."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford"
              href="/admin/events"
            >
              Назад к списку
            </Link>
            <Link
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
              href={`/admin/events/${event.id}/edit`}
            >
              Редактировать
            </Link>
          </div>
        }
      />

      {result?.message ? (
        <div
          className={
            result.type === "success"
              ? "mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800"
              : "mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
          }
        >
          {result.message}
        </div>
      ) : null}

      <div className="grid gap-6">
        <Section title="Основная информация">
          <dl className="grid gap-5 md:grid-cols-2">
            <DetailItem label="Название" value={event.title} />
            <DetailItem label="Статус" value={<EventStatusBadge status={event.status} />} />
            <DetailItem label="Описание" value={event.description} />
            <DetailItem label="Локация" value={event.location} />
          </dl>
        </Section>

        <Section title="Планирование">
          <dl className="grid gap-5 md:grid-cols-2">
            <DetailItem label="Начало" value={formatDate(event.starts_at)} />
            <DetailItem label="Окончание" value={formatDate(event.ends_at)} />
            <DetailItem label="Вместимость" value={formatCapacity(event.capacity)} />
          </dl>
        </Section>

        <Section title="Системная информация">
          <dl className="grid gap-5 md:grid-cols-2">
            <DetailItem
              label="Создал"
              value={
                event.creator
                  ? event.creator.full_name ?? event.creator.email
                  : event.created_by
              }
            />
            <DetailItem label="Дата создания" value={formatDate(event.created_at)} />
            <DetailItem label="Дата обновления" value={formatDate(event.updated_at)} />
          </dl>
        </Section>

        <Section title="Участники">
          <EventRegistrationList registrations={registrations} />
        </Section>

        <section className="rounded-lg border border-vista/40 bg-vista/15 p-4 text-sm leading-6 text-oxford">
          Посещаемость, волонтёрские часы, сертификаты и достижения не входят в Phase
          3C.
        </section>
      </div>
    </>
  );
}
