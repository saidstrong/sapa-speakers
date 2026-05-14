import Link from "next/link";
import { EventForm } from "@/components/events/event-form";
import { PageHeader } from "@/components/ui/page-header";
import { createEvent } from "../actions";

type NewEventPageProps = {
  searchParams?: Promise<{
    type?: string;
    message?: string;
  }>;
};

export default async function NewEventPage({ searchParams }: NewEventPageProps) {
  const result = await searchParams;

  return (
    <>
      <PageHeader
        title="Новое событие"
        description="Создайте внутреннюю активность: встречу, проект, обучение или организационное мероприятие."
        action={
          <Link
            className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford"
            href="/admin/events"
          >
            Назад к списку
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
        action={createEvent}
        cancelHref="/admin/events"
        submitLabel="Создать событие"
      />
    </>
  );
}
