import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminProjectApplicationsPage() {
  return (
    <>
      <PageHeader title="Заявки на проекты" description="Рассмотрение заявок волонтёров на опубликованные проекты." />
      <EmptyState title="Заявки на проекты" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
