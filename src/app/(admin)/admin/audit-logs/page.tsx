import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminAuditLogsPage() {
  return (
    <>
      <PageHeader title="Журнал действий" description="История важных действий: роли, проекты, заявки, посещаемость и сертификаты." />
      <EmptyState title="Журнал действий" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
