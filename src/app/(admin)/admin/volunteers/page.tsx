import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminVolunteersPage() {
  return (
    <>
      <PageHeader title="Волонтёры" description="Список волонтёров и профилей для HR и руководителей." />
      <EmptyState title="Волонтёры" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
