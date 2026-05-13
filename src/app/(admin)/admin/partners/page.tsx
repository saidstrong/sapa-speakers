import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminPartnersPage() {
  return (
    <>
      <PageHeader title="Партнёры" description="Простая зона для будущих партнёрских контактов и заметок." />
      <EmptyState title="Партнёры" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
