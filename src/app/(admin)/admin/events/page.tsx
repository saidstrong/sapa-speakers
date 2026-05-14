import Link from "next/link";
import { EventsTable } from "@/components/events/events-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { listEvents } from "@/lib/queries/events";

export default async function AdminEventsPage() {
  const events = await listEvents();

  return (
    <>
      <PageHeader
        title="События и проекты"
        description="Внутренние активности SapaSpeakers: встречи, проекты, обучения и организационные мероприятия. Здесь команда создаёт события, публикует их и открывает детали участников."
        action={
          <Link
            className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
            href="/admin/events/new"
          >
            Создать событие
          </Link>
        }
      />

      {events.length > 0 ? (
        <EventsTable events={events} />
      ) : (
        <div className="grid gap-4">
          <EmptyState
            title="Событий пока нет"
            description="Создайте первое событие или проект, чтобы команда могла видеть внутренний план активностей."
          />
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
              href="/admin/events/new"
            >
              Создать событие
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
