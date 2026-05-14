import { CertificatesTable } from "@/components/certificates/certificates-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { listCurrentVolunteerCertificates } from "@/lib/queries/certificates";

export default async function CertificatesPage() {
  const { certificates, volunteer } = await listCurrentVolunteerCertificates();

  return (
    <>
      <PageHeader
        title="Сертификаты"
        description="Ваши выданные сертификаты SapaSpeakers. PDF-версия сертификатов будет добавлена позже."
      />

      <section className="mb-6 rounded-lg border border-vista/40 bg-vista/15 p-4 text-sm leading-6 text-oxford">
        PDF-версия сертификатов будет добавлена позже.
      </section>

      {!volunteer ? (
        <EmptyState
          title="Сертификаты"
          description="Сертификаты доступны только одобренным волонтёрам."
        />
      ) : (
        <CertificatesTable
          certificates={certificates}
          emptyDescription="У вас пока нет сертификатов. Они появятся здесь после подтверждённого участия."
        />
      )}
    </>
  );
}
