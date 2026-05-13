import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function ApplicationsPage() {
  return (
    <>
      <PageHeader title="Мои заявки" description="История заявок на проекты и текущие статусы." />
      <EmptyState title="Мои заявки" description={RU.emptyStates.applications} />
    </>
  );
}
