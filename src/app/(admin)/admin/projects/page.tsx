import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminProjectsPage() {
  return (
    <>
      <PageHeader title="Проекты" description="Создание, редактирование и публикация проектов." />
      <EmptyState title="Проекты" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
