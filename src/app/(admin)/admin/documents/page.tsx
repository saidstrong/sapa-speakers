import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminDocumentsPage() {
  return (
    <>
      <PageHeader title="Документы" description="Внутренние документы, инструкции, шаблоны и протоколы." />
      <EmptyState title="Документы" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
