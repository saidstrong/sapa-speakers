import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader title="Настройки" description="Организационные настройки и будущие системные параметры." />
      <EmptyState title="Настройки" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
