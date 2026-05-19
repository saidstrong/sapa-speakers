import { CertificatesTable } from "@/components/certificates/certificates-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { listCurrentVolunteerCertificates } from "@/lib/queries/certificates";
import { downloadCurrentVolunteerCertificatePdf } from "./download-actions";

type CertificatesPageProps = {
  searchParams?: Promise<{
    message?: string;
    type?: string;
  }>;
};

export default async function CertificatesPage({
  searchParams
}: CertificatesPageProps) {
  const result = await searchParams;
  const { certificates, volunteer } = await listCurrentVolunteerCertificates();

  return (
    <>
      <PageHeader
        title="Сертификаты"
        description="Ваши выданные сертификаты SapaSpeakers. Отозванные сертификаты отмечаются отдельно."
      />

      {result?.message ? (
        <div
          className={
            result.type === "success"
              ? "mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800"
              : "mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
          }
        >
          {result.message}
        </div>
      ) : null}

      {!volunteer ? (
        <EmptyState
          title="Сертификаты"
          description="Сертификаты доступны только одобренным волонтёрам."
        />
      ) : (
        <CertificatesTable
          certificates={certificates}
          downloadAction={downloadCurrentVolunteerCertificatePdf}
          emptyDescription="У вас пока нет сертификатов. Они появятся здесь после подтверждённого участия."
        />
      )}
    </>
  );
}
