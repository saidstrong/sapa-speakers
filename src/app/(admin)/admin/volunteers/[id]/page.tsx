import Link from "next/link";
import { ApplicationStatusBadge } from "@/components/applications/application-status-badge";
import { AchievementForm } from "@/components/achievements/achievement-form";
import { AchievementsTable } from "@/components/achievements/achievements-table";
import { CertificateForm } from "@/components/certificates/certificate-form";
import { CertificatesTable } from "@/components/certificates/certificates-table";
import { ContributionHistoryTable } from "@/components/contributions/contribution-history-table";
import { ContributionSummaryCard } from "@/components/contributions/contribution-summary-card";
import { ProfileAvatarPreview } from "@/components/profile/avatar-upload-form";
import { PageHeader } from "@/components/ui/page-header";
import {
  VolunteerStatusBadge,
  volunteerStatusLabels
} from "@/components/volunteers/volunteer-status-badge";
import { getRoleLabel } from "@/lib/auth/roles";
import { listVolunteerAchievementsForAdmin } from "@/lib/queries/achievements";
import { listVolunteerCertificatesForAdmin } from "@/lib/queries/certificates";
import { getVolunteerContributionHistoryForAdmin } from "@/lib/queries/contributions";
import { getVolunteerDetail, volunteerStatuses } from "@/lib/queries/volunteers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createAvatarSignedUrl } from "@/lib/storage/avatars";
import { awardAchievement } from "./achievement-actions";
import { issueCertificate } from "./certificate-actions";
import { updateVolunteer } from "./actions";

type VolunteerDetailPageProps = {
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

export default async function VolunteerDetailPage({
  params,
  searchParams
}: VolunteerDetailPageProps) {
  const { id } = await params;
  const result = await searchParams;
  const [volunteer, contributionHistory, certificates, achievements] = await Promise.all([
    getVolunteerDetail(id),
    getVolunteerContributionHistoryForAdmin(id),
    listVolunteerCertificatesForAdmin(id),
    listVolunteerAchievementsForAdmin(id)
  ]);
  const achievementAction = awardAchievement.bind(null, volunteer.id);
  const certificateAction = issueCertificate.bind(null, volunteer.id);
  const updateAction = updateVolunteer.bind(null, volunteer.id);
  const avatarUrl = volunteer.profile?.avatar_path
    ? await createAvatarSignedUrl(
        await createSupabaseServerClient(),
        volunteer.profile.avatar_path
      )
    : null;

  return (
    <>
      <PageHeader
        title="Карточка волонтёра"
        description="Профиль, операционный статус и связанная публичная заявка."
        action={
          <Link
            className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford"
            href="/admin/volunteers"
          >
            Назад к списку
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
        <Section title="Профиль">
          <div className="flex flex-col gap-5 md:flex-row md:items-start">
            <ProfileAvatarPreview
              avatarUrl={avatarUrl}
              displayName={volunteer.profile?.full_name}
              email={volunteer.profile?.email}
              size="lg"
            />
            <dl className="grid flex-1 gap-5 md:grid-cols-2">
              <DetailItem label="ФИО" value={volunteer.profile?.full_name} />
              <DetailItem label="Email" value={volunteer.profile?.email} />
              <DetailItem label="Телефон" value={volunteer.profile?.phone} />
              <DetailItem label="Telegram" value={volunteer.profile?.telegram} />
              <DetailItem
                label="Роль профиля"
                value={volunteer.profile ? getRoleLabel(volunteer.profile.role) : null}
              />
            </dl>
          </div>
        </Section>

        <Section title="Волонтёрская карточка">
          <dl className="grid gap-5 md:grid-cols-2">
            <DetailItem
              label="Статус"
              value={<VolunteerStatusBadge status={volunteer.status} />}
            />
            <DetailItem label="Дата вступления" value={formatDate(volunteer.joined_at)} />
            <DetailItem label="Заметки" value={volunteer.notes} />
          </dl>
        </Section>

        <section className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold text-oxford">Вклад волонтёра</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Подтверждённые часы и история вклада. Добавление и обновление часов
              выполняется из реестра посещаемости.
            </p>
          </div>
          <ContributionSummaryCard summary={contributionHistory.summary} />
          <ContributionHistoryTable
            contributions={contributionHistory.contributions}
            emptyDescription="У этого волонтёра пока нет записанного вклада."
            emptyTitle="История вклада"
            showAdminColumns
            showSummary={false}
            totalHours={contributionHistory.summary.totalHours}
          />
        </section>

        <Section title="Достижения">
          <div className="grid gap-6">
            <div>
              <h3 className="text-base font-semibold text-oxford">
                Выдать достижение
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Создаётся ручная запись достижения или бейджа. Автоматические
                правила, баллы, уровни и рейтинги будут добавлены позже.
              </p>
            </div>
            <AchievementForm action={achievementAction} />
            <div>
              <h3 className="mb-4 text-base font-semibold text-oxford">
                Выданные достижения
              </h3>
              <AchievementsTable
                achievements={achievements}
                emptyDescription="У этого волонтёра пока нет достижений."
                showAwarder
              />
            </div>
          </div>
        </Section>

        <Section title="Сертификаты">
          <div className="grid gap-6">
            <div>
              <h3 className="text-base font-semibold text-oxford">
                Выдать сертификат
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Создаётся только запись сертификата. PDF, шаблоны и QR-проверка
                будут добавлены позже.
              </p>
            </div>
            <CertificateForm action={certificateAction} />
            <div>
              <h3 className="mb-4 text-base font-semibold text-oxford">
                Выданные сертификаты
              </h3>
              <CertificatesTable
                certificates={certificates}
                emptyDescription="У этого волонтёра пока нет сертификатов."
                showIssuer
              />
            </div>
          </div>
        </Section>

        <Section title="Связанная заявка">
          {volunteer.application ? (
            <div className="grid gap-5">
              <div className="flex flex-wrap gap-3">
                <Link
                  className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
                  href={`/admin/team-applications/${volunteer.application.id}`}
                >
                  Открыть заявку
                </Link>
              </div>
              <dl className="grid gap-5 md:grid-cols-2">
                <DetailItem label="ФИО в заявке" value={volunteer.application.full_name} />
                <DetailItem
                  label="Статус заявки"
                  value={<ApplicationStatusBadge status={volunteer.application.status} />}
                />
                <DetailItem label="Мотивация" value={volunteer.application.motivation} />
                <DetailItem label="Опыт" value={volunteer.application.experience} />
                <DetailItem label="Доступность" value={volunteer.application.availability} />
                <DetailItem
                  label="Дата решения"
                  value={formatDate(volunteer.application.reviewed_at)}
                />
                <DetailItem
                  label="Комментарий ревьюера"
                  value={volunteer.application.reviewer_notes}
                />
              </dl>
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted">
              Связанная заявка не указана. Карточка может быть создана вручную или
              связь будет добавлена позже.
            </p>
          )}
        </Section>

        <Section title="Управление статусом">
          <form action={updateAction} className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-semibold text-oxford">
              Статус волонтёра
              <select
                className="mt-2 w-full rounded-md border border-oxford/15 bg-white px-3 py-2"
                defaultValue={volunteer.status}
                name="status"
              >
                {volunteerStatuses.map((status) => (
                  <option key={status} value={status}>
                    {volunteerStatusLabels[status]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold text-oxford md:col-span-2">
              Операционные заметки
              <textarea
                className="mt-2 min-h-32 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm"
                defaultValue={volunteer.notes ?? ""}
                maxLength={5000}
                name="notes"
                placeholder="Внутренние заметки для команды"
              />
            </label>
            <button
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
              type="submit"
            >
              Сохранить карточку
            </button>
            <p className="text-sm leading-6 text-muted md:col-span-2">
              Здесь можно изменить только операционный статус и внутренние заметки.
              Роль профиля и данные заявки остаются без изменений.
            </p>
          </form>
        </Section>
      </div>
    </>
  );
}
