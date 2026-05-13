import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { VolunteersTable } from "@/components/volunteers/volunteers-table";
import { listVolunteers } from "@/lib/queries/volunteers";

export default async function AdminVolunteersPage() {
  const volunteers = await listVolunteers();

  return (
    <>
      <PageHeader
        title="Волонтёры"
        description="Волонтёрские карточки, созданные после одобрения публичных заявок. Здесь можно просматривать профиль, связанную заявку и операционный статус."
      />
      {volunteers.length > 0 ? (
        <VolunteersTable volunteers={volunteers} />
      ) : (
        <EmptyState
          title="Волонтёрских карточек пока нет"
          description="Карточки появятся здесь после одобрения заявки, если кандидат уже зарегистрирован с тем же email."
        />
      )}
    </>
  );
}
