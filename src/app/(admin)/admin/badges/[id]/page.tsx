import Link from "next/link";
import { achievementTypeLabels } from "@/components/achievements/achievement-form";
import { AchievementStatusBadge } from "@/components/achievements/achievement-status-badge";
import { PageHeader } from "@/components/ui/page-header";
import type { AchievementListItem } from "@/lib/queries/achievements";
import { getAchievementForAdmin } from "@/lib/queries/achievements";
import { revokeAchievement } from "./actions";

type AchievementDetailPageProps = {
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

function displayProfile(profile: AchievementListItem["volunteerProfile"]) {
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

export default async function AchievementDetailPage({
  params,
  searchParams
}: AchievementDetailPageProps) {
  const { id } = await params;
  const result = await searchParams;
  const achievement = await getAchievementForAdmin(id);
  const revokeAction = revokeAchievement.bind(null, achievement.id);

  return (
    <>
      <PageHeader
        title="Достижение"
        description="Детали записи достижения и управление отзывом. Автоматические правила, уровни и рейтинги будут добавлены позже."
        action={
          <Link
            className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford"
            href="/admin/badges"
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
            <DetailItem label="Название" value={achievement.title} />
            <DetailItem
              label="Тип"
              value={achievementTypeLabels[achievement.achievement_type]}
            />
            <DetailItem
              label="Статус"
              value={<AchievementStatusBadge status={achievement.status} />}
            />
            <DetailItem label="Дата выдачи" value={formatDate(achievement.awarded_at)} />
            <DetailItem
              label="Выдал"
              value={
                achievement.awardedByProfile
                  ? achievement.awardedByProfile.full_name ??
                    achievement.awardedByProfile.email
                  : null
              }
            />
            <DetailItem label="Описание" value={achievement.description} />
          </dl>
        </Section>

        <Section title="Волонтёр">
          <dl className="grid gap-5 md:grid-cols-2">
            <DetailItem
              label="ФИО"
              value={displayProfile(achievement.volunteerProfile)}
            />
            <DetailItem label="Email" value={achievement.volunteerProfile?.email} />
            <DetailItem
              label="Карточка"
              value={
                achievement.volunteer ? (
                  <Link
                    className="font-semibold text-orange"
                    href={`/admin/volunteers/${achievement.volunteer.id}`}
                  >
                    Открыть карточку волонтёра
                  </Link>
                ) : null
              }
            />
          </dl>
        </Section>

        <Section title="Статус отзыва">
          {achievement.status === "revoked" ? (
            <dl className="grid gap-5 md:grid-cols-2">
              <DetailItem label="Дата отзыва" value={formatDate(achievement.revoked_at)} />
              <DetailItem
                label="Причина"
                value={achievement.revocation_reason ?? "Не указано"}
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
                  placeholder="Кратко укажите причину отзыва достижения"
                  required
                />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                  type="submit"
                >
                  Отозвать достижение
                </button>
                <p className="text-sm leading-6 text-muted">
                  Запись не удаляется, меняется только статус достижения.
                </p>
              </div>
            </form>
          )}
        </Section>

        <section className="rounded-lg border border-vista/40 bg-vista/15 p-4 text-sm leading-6 text-oxford">
          Автоматические правила, уровни и рейтинги будут добавлены позже.
        </section>
      </div>
    </>
  );
}
