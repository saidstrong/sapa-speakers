import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminStatsPage() {
  return (
    <>
      <PageHeader title="Статистика" description="Базовые операционные показатели без выдуманных чисел." />
      <EmptyState title="Статистика" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
