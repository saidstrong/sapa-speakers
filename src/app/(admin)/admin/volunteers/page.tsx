import Link from "next/link";
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
        <div className="grid gap-4">
          <EmptyState
            title="Волонтёрских карточек пока нет"
            description="Карточки появятся здесь после одобрения заявки, если кандидат уже зарегистрирован с тем же email."
          />
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
              href="/admin/team-applications"
            >
              Перейти к заявкам
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
