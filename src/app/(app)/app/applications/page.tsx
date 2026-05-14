import Link from "next/link";
import { MyEventRegistrationsList } from "@/components/events/my-event-registrations-list";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { listCurrentVolunteerEventRegistrations } from "@/lib/queries/event-registrations";

export default async function ApplicationsPage() {
  const { registrations, volunteer } = await listCurrentVolunteerEventRegistrations();

  return (
    <>
      <PageHeader
        title="Мои записи на проекты"
        description="Здесь отображаются ваши регистрации и отмены по проектам. Посещаемость и сертификаты появятся в будущих этапах."
        action={
          <Link
            className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford"
            href="/app/projects"
          >
            Открыть проекты
          </Link>
        }
      />

      {!volunteer ? (
        <EmptyState
          title="Записи на проекты"
          description="Записи на проекты доступны только одобренным волонтёрам. Если вы уже подали заявку, дождитесь подтверждения."
        />
      ) : registrations.length > 0 ? (
        <MyEventRegistrationsList registrations={registrations} />
      ) : (
        <EmptyState
          title="Пока нет записей на проекты"
          description="У вас пока нет записей на проекты. Откройте раздел проектов и выберите подходящее событие."
        />
      )}
    </>
  );
}
