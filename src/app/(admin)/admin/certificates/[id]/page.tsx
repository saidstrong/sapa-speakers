import Link from "next/link";
import { CertificatePdfUploadForm } from "@/components/certificates/certificate-pdf-upload-form";
import { CertificateStatusBadge } from "@/components/certificates/certificate-status-badge";
import { certificateTypeLabels } from "@/components/certificates/certificate-form";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdminUser } from "@/lib/auth/current-user";
import type { CertificateListItem } from "@/lib/queries/certificates";
import { getCertificateForAdmin } from "@/lib/queries/certificates";
import { canUploadCertificatePdf } from "@/lib/storage/certificates";
import { revokeCertificate } from "./actions";
import {
  downloadCertificatePdfForAdmin,
  uploadCertificatePdf
} from "./upload-actions";

type CertificateDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    type?: string;
    message?: string;
  }>;
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

function displayUploadProfile(profile: CertificateListItem["fileUploadedByProfile"]) {
  if (!profile) {
    return "Не указан";
  }

  return profile.full_name ?? profile.email;
}

function DetailItem({
  label,
  value
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-muted">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-oxford">{value || "Не указано"}</dd>
    </div>
  );
}

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-oxford">{title}</h2>
      {children}
    </section>
  );
}

export default async function CertificateDetailPage({
  params,
  searchParams
}: CertificateDetailPageProps) {
  const { id } = await params;
  const result = await searchParams;
  const [currentUser, certificate] = await Promise.all([
    requireAdminUser(),
    getCertificateForAdmin(id)
  ]);
  const revokeAction = revokeCertificate.bind(null, certificate.id);
  const uploadAction = uploadCertificatePdf.bind(null, certificate.id);
  const downloadAction = downloadCertificatePdfForAdmin.bind(null, certificate.id);
  const canUploadPdf =
    certificate.status === "issued" && canUploadCertificatePdf(currentUser.role);

  return (
    <>
      <PageHeader
        title="Сертификат"
        description="Детали записи сертификата, официальный PDF-файл и управление отзывом. Публичная проверка сертификата будет добавлена позже."
        action={
          <Link
            className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford"
            href="/admin/certificates"
          >
            Назад к реестру
          </Link>
        }
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

      <div className="grid gap-6">
        <Section title="Основная информация">
          <dl className="grid gap-5 md:grid-cols-2">
            <DetailItem label="Название" value={certificate.title} />
            <DetailItem
              label="Тип"
              value={certificateTypeLabels[certificate.certificate_type]}
            />
            <DetailItem
              label="Статус"
              value={<CertificateStatusBadge status={certificate.status} />}
            />
            <DetailItem label="Дата выдачи" value={formatDate(certificate.issued_at)} />
            <DetailItem
              label="Выдал"
              value={
                certificate.issuedByProfile
                  ? certificate.issuedByProfile.full_name ??
                    certificate.issuedByProfile.email
                  : null
              }
            />
            <DetailItem label="Описание" value={certificate.description} />
          </dl>
        </Section>

        <Section title="Волонтёр">
          <dl className="grid gap-5 md:grid-cols-2">
            <DetailItem
              label="ФИО"
              value={displayProfile(certificate.volunteerProfile)}
            />
            <DetailItem label="Email" value={certificate.volunteerProfile?.email} />
            <DetailItem
              label="Карточка"
              value={
                certificate.volunteer ? (
                  <Link
                    className="font-semibold text-orange"
                    href={`/admin/volunteers/${certificate.volunteer.id}`}
                  >
                    Открыть карточку волонтёра
                  </Link>
                ) : null
              }
            />
          </dl>
        </Section>

        <Section title="Официальный PDF">
          <div className="grid gap-5">
            {certificate.file_path ? (
              <dl className="grid gap-5 md:grid-cols-2">
                <DetailItem label="Файл" value={certificate.file_name} />
                <DetailItem
                  label="Размер"
                  value={
                    certificate.file_size_bytes
                      ? `${Math.ceil(certificate.file_size_bytes / 1024)} КБ`
                      : null
                  }
                />
                <DetailItem
                  label="Загрузил"
                  value={displayUploadProfile(certificate.fileUploadedByProfile)}
                />
                <DetailItem
                  label="Дата загрузки"
                  value={formatDate(certificate.file_uploaded_at)}
                />
              </dl>
            ) : (
              <p className="text-sm leading-6 text-muted">
                PDF-файл ещё не прикреплён.
              </p>
            )}

            {certificate.file_path ? (
              <form action={downloadAction}>
                <button
                  className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
                  type="submit"
                >
                  Скачать PDF
                </button>
              </form>
            ) : null}

            {canUploadPdf ? (
              <div className="border-t border-oxford/10 pt-5">
                <CertificatePdfUploadForm
                  action={uploadAction}
                  hasFile={Boolean(certificate.file_path)}
                />
              </div>
            ) : (
              <p className="text-sm leading-6 text-muted">
                {certificate.status === "revoked"
                  ? "Для отозванного сертификата загрузка и замена PDF заблокированы."
                  : "У вашей роли нет доступа к загрузке официальных PDF сертификатов."}
              </p>
            )}
          </div>
        </Section>

        <Section title="Статус отзыва">
          {certificate.status === "revoked" ? (
            <dl className="grid gap-5 md:grid-cols-2">
              <DetailItem label="Дата отзыва" value={formatDate(certificate.revoked_at)} />
              <DetailItem
                label="Причина"
                value={certificate.revocation_reason ?? "Не указано"}
              />
            </dl>
          ) : (
            <form action={revokeAction} className="grid gap-4">
              <label className="block text-sm font-semibold text-oxford">
                Причина отзыва
                <textarea
                  className="mt-2 min-h-28 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm font-normal text-oxford"
                  maxLength={2000}
                  name="revocation_reason"
                  placeholder="Кратко укажите причину отзыва сертификата"
                  required
                />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                  type="submit"
                >
                  Отозвать сертификат
                </button>
                <p className="text-sm leading-6 text-muted">
                  Запись не удаляется, меняется только статус сертификата.
                </p>
              </div>
            </form>
          )}
        </Section>

        <section className="rounded-lg border border-vista/40 bg-vista/15 p-4 text-sm leading-6 text-oxford">
          PDF хранится в приватном хранилище. Публичная проверка сертификата,
          QR-коды и генерация PDF будут добавлены позже.
        </section>
      </div>
    </>
  );
}
