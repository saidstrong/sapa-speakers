import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function CertificatesPage() {
  return (
    <>
      <PageHeader title="Сертификаты" description="Сертификаты появятся после подтверждённого участия в проектах." />
      <EmptyState title="Сертификаты" description={RU.emptyStates.certificates} />
    </>
  );
}
