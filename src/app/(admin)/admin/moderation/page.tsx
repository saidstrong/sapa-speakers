import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminModerationPage() {
  return (
    <>
      <PageHeader title="Проекты на модерации" description="Одобрение, возврат на доработку или отклонение проектов." />
      <EmptyState title="Проекты на модерации" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
