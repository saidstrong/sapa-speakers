import { CertificatesTable } from "@/components/certificates/certificates-table";
import { PageHeader } from "@/components/ui/page-header";
import { listCertificatesForAdmin } from "@/lib/queries/certificates";

export default async function AdminCertificatesPage() {
  const certificates = await listCertificatesForAdmin();

  return (
    <>
      <PageHeader
        title="Сертификаты"
        description="Реестр выданных сертификатов. PDF-файлы, шаблоны и QR-проверка будут добавлены позже."
      />

      <CertificatesTable
        certificates={certificates}
        emptyDescription="Пока нет выданных сертификатов. Выдать сертификат можно со страницы волонтёра."
        showIssuer
        showVolunteer
      />
    </>
  );
}
