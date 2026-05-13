import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AppProjectsPage() {
  return (
    <>
      <PageHeader title="Проекты" description="Опубликованные проекты, доступные для подачи заявки." />
      <EmptyState title="Проекты" description={RU.emptyStates.projects} />
    </>
  );
}
