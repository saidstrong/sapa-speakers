import Link from "next/link";
import { VolunteerDashboardCard } from "@/components/app/volunteer-dashboard-card";
import {
  VolunteerNextActions,
  type VolunteerNextAction
} from "@/components/app/volunteer-next-actions";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { getRoleLabel } from "@/lib/auth/roles";
import {
  getVolunteerDashboardData,
  type VolunteerDashboardData,
  type VolunteerDashboardRegistration,
  type VolunteerDashboardVolunteer
} from "@/lib/queries/volunteer-dashboard";

const volunteerStatusLabels: Record<string, string> = {
  active: "Активный",
  alumni: "Выпускник",
  inactive: "Неактивный",
  suspended: "Приостановлен"
};

const noVolunteerActions: VolunteerNextAction[] = [
  {
    description: "Подайте заявку или проверьте требования для вступления в команду.",
    href: "/join",
    title: "Подать заявку"
  },
  {
    description: "Посмотрите опубликованные проекты, доступные в кабинете.",
    href: "/app/projects",
    title: "Открыть проекты"
  },
  {
    description: "Проверьте имя, email и контактные данные аккаунта.",
    href: "/app/profile",
    title: "Мой профиль"
  }
];

const countFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0
});

const hoursFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0
});

function formatCount(value: number) {
  return countFormatter.format(value);
}

function formatHours(value: number) {
  return `${hoursFormatter.format(value)} ч.`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "Не указано";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatEventDate(registration: VolunteerDashboardRegistration) {
  if (!registration.event.ends_at) {
    return formatDate(registration.event.starts_at);
  }

  return `${formatDate(registration.event.starts_at)} - ${formatDate(registration.event.ends_at)}`;
}

function getVolunteerStatusLabel(status: string) {
  return volunteerStatusLabels[status] ?? status;
}

function getVolunteerStatusTone(
  status: string
): "danger" | "info" | "neutral" | "success" | "warning" {
  if (status === "active") {
    return "success";
  }

  if (status === "suspended") {
    return "danger";
  }

  if (status === "inactive") {
    return "warning";
  }

  if (status === "alumni") {
    return "info";
  }

  return "neutral";
}

function displayName(dashboard: VolunteerDashboardData) {
  return dashboard.profile.full_name ?? dashboard.profile.email;
}

function latestContributionText(value: string | null) {
  return value ? `Последний вклад: ${formatDate(value)}` : "Подтверждений пока нет";
}

function VolunteerStatusSection({
  dashboard,
  volunteer
}: {
  dashboard: VolunteerDashboardData;
  volunteer: VolunteerDashboardVolunteer;
}) {
  return (
    <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-oxford">Профиль волонтёра</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {displayName(dashboard)} · {dashboard.profile.email}
          </p>
        </div>
        <StatusBadge tone={getVolunteerStatusTone(volunteer.status)}>
          {getVolunteerStatusLabel(volunteer.status)}
        </StatusBadge>
      </div>

      <dl className="mt-6 grid gap-4 text-sm md:grid-cols-3">
        <div>
          <dt className="font-semibold text-oxford">Роль</dt>
          <dd className="mt-1 text-muted">{getRoleLabel(dashboard.profile.role)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-oxford">Дата вступления</dt>
          <dd className="mt-1 text-muted">{formatDate(volunteer.joined_at)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-oxford">Статус карточки</dt>
          <dd className="mt-1 text-muted">{getVolunteerStatusLabel(volunteer.status)}</dd>
        </div>
      </dl>
    </section>
  );
}

function UpcomingRegistrationsSection({
  registrations
}: {
  registrations: readonly VolunteerDashboardRegistration[];
}) {
  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-oxford">
            Предстоящие записи на проекты
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Здесь показаны активные регистрации на опубликованные будущие события.
          </p>
        </div>
        <Link
          className="text-sm font-semibold text-oxford underline decoration-orange/60 underline-offset-4 hover:text-orange"
          href="/app/applications"
        >
          Все мои записи
        </Link>
      </div>

      {registrations.length === 0 ? (
        <EmptyState
          title="Нет предстоящих записей"
          description="У вас пока нет активных регистраций на будущие опубликованные проекты."
        />
      ) : (
        <div className="grid gap-3">
          {registrations.map((registration) => (
            <article
              className="rounded-lg border border-oxford/10 bg-white p-5 shadow-sm"
              key={registration.id}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-oxford">
                    {registration.event.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {formatEventDate(registration)}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {registration.event.location ?? "Локация не указана"}
                  </p>
                </div>
                <Link
                  className="shrink-0 rounded-md border border-oxford/15 px-3 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
                  href={`/app/projects/${registration.event_id}`}
                >
                  Открыть проект
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function AppDashboardPage() {
  const dashboard = await getVolunteerDashboardData();
  const { volunteer } = dashboard;

  return (
    <>
      <PageHeader
        title="Личный кабинет"
        description="Краткая сводка профиля, участия, подтверждённого вклада, сертификатов и достижений."
      />

      {!volunteer ? (
        <div className="grid gap-6">
          <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-oxford">Аккаунт</h2>
            <dl className="mt-5 grid gap-4 text-sm md:grid-cols-3">
              <div>
                <dt className="font-semibold text-oxford">Имя</dt>
                <dd className="mt-1 text-muted">{displayName(dashboard)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-oxford">Email</dt>
                <dd className="mt-1 text-muted">{dashboard.profile.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-oxford">Роль</dt>
                <dd className="mt-1 text-muted">{getRoleLabel(dashboard.profile.role)}</dd>
              </div>
            </dl>
          </section>

          <EmptyState
            title="Профиль волонтёра ожидает подтверждения"
            description="Ваш волонтёрский профиль ещё не подтверждён. Если вы уже подали заявку, дождитесь решения команды."
          />

          <VolunteerNextActions actions={noVolunteerActions} title="Что можно сделать" />
        </div>
      ) : (
        <div className="grid gap-8">
          <VolunteerStatusSection dashboard={dashboard} volunteer={volunteer} />

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <VolunteerDashboardCard
              description={`${formatCount(
                dashboard.contributionSummary.recordCount
              )} записей вклада`}
              href="/app/achievements"
              meta={latestContributionText(
                dashboard.contributionSummary.latestContributionAt
              )}
              title="Подтверждённые часы"
              value={formatHours(dashboard.contributionSummary.totalHours)}
            />
            <VolunteerDashboardCard
              description="Активные регистрации на будущие опубликованные события"
              href="/app/applications"
              title="Предстоящие проекты"
              value={formatCount(dashboard.upcomingRegistrations.length)}
            />
            <VolunteerDashboardCard
              description={`${formatCount(
                dashboard.certificateSummary.revokedCount
              )} отозвано`}
              href="/app/certificates"
              title="Сертификаты"
              value={`${formatCount(dashboard.certificateSummary.activeCount)} выдано`}
            />
            <VolunteerDashboardCard
              description={`${formatCount(
                dashboard.achievementSummary.revokedCount
              )} отозвано`}
              href="/app/achievements"
              title="Достижения"
              value={`${formatCount(dashboard.achievementSummary.activeCount)} выдано`}
            />
          </section>

          <UpcomingRegistrationsSection registrations={dashboard.upcomingRegistrations} />
          <VolunteerNextActions />
        </div>
      )}
    </>
  );
}
