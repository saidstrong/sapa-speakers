import Link from "next/link";
import { EventForm } from "@/components/events/event-form";
import { PageHeader } from "@/components/ui/page-header";
import { getEventDetail } from "@/lib/queries/events";
import { updateEvent } from "../../actions";

type EditEventPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    type?: string;
    message?: string;
  }>;
};

export default async function EditEventPage({
  params,
  searchParams
}: EditEventPageProps) {
  const { id } = await params;
  const result = await searchParams;
  const event = await getEventDetail(id);
  const updateAction = updateEvent.bind(null, event.id);

  return (
    <>
      <PageHeader
        title="Редактирование события"
        description="Обновите основные поля события. Регистрации и посещаемость управляются на странице события."
        action={
          <Link
            className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford"
            href={`/admin/events/${event.id}`}
          >
            Назад к событию
          </Link>
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

      <EventForm
        action={updateAction}
        cancelHref={`/admin/events/${event.id}`}
        event={event}
        submitLabel="Сохранить изменения"
      />
    </>
  );
}
