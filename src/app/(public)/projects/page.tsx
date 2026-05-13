import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function PublicProjectsPage() {
  return (
    <>
      <PageHeader title={RU.pages.projects.title} description={RU.pages.projects.description} />
      <EmptyState title="Проекты" description={RU.emptyStates.projects} />
    </>
  );
}
