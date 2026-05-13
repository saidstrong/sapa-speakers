import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AdminCertificatesPage() {
  return (
    <>
      <PageHeader title="Сертификаты" description="Загрузка сертификатов только для одобренных и присутствовавших участников." />
      <EmptyState title="Сертификаты" description={RU.messages.adminPermissionNotice} />
    </>
  );
}
