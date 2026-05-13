import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminTeamApplicationsPage() {
  return (
    <>
      <PageHeader title="Заявки в команду" description="HR review и финальные решения CEO/CTO." />
      <EmptyState title="Заявки в команду" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
