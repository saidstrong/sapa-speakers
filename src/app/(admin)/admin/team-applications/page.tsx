import { ApplicationsTable } from "@/components/applications/applications-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { listVolunteerApplications } from "@/lib/queries/volunteer-applications";

export default async function AdminTeamApplicationsPage() {
  const applications = await listVolunteerApplications();

  return (
    <>
      <PageHeader
        title="Заявки волонтёров"
        description="Публичные заявки, отправленные через форму «Стать волонтёром». Администратор может одобрить кандидата или отклонить заявку."
      />
      {applications.length > 0 ? (
        <ApplicationsTable applications={applications} />
      ) : (
        <EmptyState
          title="Заявок пока нет"
          description="Когда кандидаты отправят форму на странице «Стать волонтёром», заявки появятся здесь."
        />
      )}
    </>
  );
}
