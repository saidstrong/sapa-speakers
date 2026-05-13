import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminRolesPage() {
  return (
    <>
      <PageHeader title="Роли и доступ" description="Назначение ролей с защитой Founder/CEO и CTO." />
      <EmptyState
        title="Защищённые роли"
        description={`Эта роль защищена и не может быть изменена через обычную панель. ${RU.messages.adminPermissionNotice}`}
      />
    </>
  );
}
