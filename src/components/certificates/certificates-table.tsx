import Link from "next/link";
import { CertificateStatusBadge } from "@/components/certificates/certificate-status-badge";
import { certificateTypeLabels } from "@/components/certificates/certificate-form";
import { EmptyState } from "@/components/ui/empty-state";
import type { CertificateListItem } from "@/lib/queries/certificates";

type CertificatesTableProps = {
  certificates: readonly CertificateListItem[];
  emptyDescription: string;
  emptyTitle?: string;
  detailBasePath?: string;
  showDetailAction?: boolean;
  showIssuer?: boolean;
  showRevocationDetails?: boolean;
  showVolunteer?: boolean;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Не указано";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function displayProfile(profile: CertificateListItem["volunteerProfile"]) {
  if (!profile) {
    return "Не указан";
  }

  return profile.full_name ?? profile.email;
}

export function CertificatesTable({
  certificates,
  detailBasePath,
  emptyDescription,
  emptyTitle = "Сертификаты",
  showDetailAction = false,
  showIssuer = false,
  showRevocationDetails = true,
  showVolunteer = false
}: CertificatesTableProps) {
  if (certificates.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const hasRevokedCertificates = certificates.some(
    (certificate) => certificate.status === "revoked"
  );
  const shouldShowRevocationDetails = showRevocationDetails && hasRevokedCertificates;

  return (
    <div className="overflow-hidden rounded-lg border border-oxford/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[860px] divide-y divide-oxford/10 text-sm">
          <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Название</th>
              {showVolunteer ? <th className="px-4 py-3">Волонтёр</th> : null}
              <th className="px-4 py-3">Тип</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Дата выдачи</th>
              {shouldShowRevocationDetails ? (
                <th className="px-4 py-3">Отзыв</th>
              ) : null}
              {showIssuer ? <th className="px-4 py-3">Выдал</th> : null}
              <th className="px-4 py-3">Описание</th>
              {showDetailAction && detailBasePath ? (
                <th className="px-4 py-3">Действие</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-oxford/10">
            {certificates.map((certificate) => (
              <tr
                key={certificate.id}
                className={
                  certificate.status === "revoked"
                    ? "bg-red-50/60 align-top"
                    : "align-top"
                }
              >
                <td className="px-4 py-4 font-semibold text-oxford">
                  {detailBasePath ? (
                    <Link
                      className="transition hover:text-orange"
                      href={`${detailBasePath}/${certificate.id}`}
                    >
                      {certificate.title}
                    </Link>
                  ) : (
                    certificate.title
                  )}
                </td>
                {showVolunteer ? (
                  <td className="px-4 py-4">
                    <div className="font-semibold text-oxford">
                      {displayProfile(certificate.volunteerProfile)}
                    </div>
                    <div className="mt-1 text-muted">
                      {certificate.volunteerProfile?.email ?? "Email не указан"}
                    </div>
                  </td>
                ) : null}
                <td className="px-4 py-4 text-muted">
                  {certificateTypeLabels[certificate.certificate_type]}
                </td>
                <td className="px-4 py-4">
                  <CertificateStatusBadge status={certificate.status} />
                </td>
                <td className="px-4 py-4 text-muted">
                  {formatDate(certificate.issued_at)}
                </td>
                {shouldShowRevocationDetails ? (
                  <td className="max-w-sm px-4 py-4 text-muted">
                    {certificate.status === "revoked" ? (
                      <div className="space-y-1">
                        <div>{formatDate(certificate.revoked_at)}</div>
                        {certificate.revocation_reason ? (
                          <div>{certificate.revocation_reason}</div>
                        ) : null}
                      </div>
                    ) : (
                      "Не отозван"
                    )}
                  </td>
                ) : null}
                {showIssuer ? (
                  <td className="px-4 py-4 text-muted">
                    {certificate.issuedByProfile
                      ? certificate.issuedByProfile.full_name ??
                        certificate.issuedByProfile.email
                      : "Не указан"}
                  </td>
                ) : null}
                <td className="max-w-md px-4 py-4 text-muted">
                  {certificate.description ?? "Нет"}
                </td>
                {showDetailAction && detailBasePath ? (
                  <td className="px-4 py-4">
                    <Link
                      className="rounded-md border border-oxford/15 px-3 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
                      href={`${detailBasePath}/${certificate.id}`}
                    >
                      Открыть
                    </Link>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
