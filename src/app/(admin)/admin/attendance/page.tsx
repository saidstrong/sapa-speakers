import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminAttendancePage() {
  return (
    <>
      <PageHeader title="Посещаемость" description="Отметка присутствия только для одобренных участников проекта." />
      <EmptyState title="Посещаемость" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
