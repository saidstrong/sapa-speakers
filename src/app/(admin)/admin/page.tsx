import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminIndexPage() {
  return (
    <>
      <PageHeader title={RU.pages.admin.title} description={RU.pages.admin.description} />
      <EmptyState title="Phase 0" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
