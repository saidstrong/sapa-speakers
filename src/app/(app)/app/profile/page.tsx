import { ProfileForm } from "@/components/profile/profile-form";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { VolunteerStatusBadge } from "@/components/volunteers/volunteer-status-badge";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { getRoleLabel } from "@/lib/auth/roles";
import {
  volunteerStatuses,
  type VolunteerStatus
} from "@/lib/queries/volunteers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateProfile } from "./actions";

type ProfilePageProps = {
  searchParams?: Promise<{
    message?: string;
    type?: string;
  }>;
};

type CurrentVolunteerRow = {
  id: string;
  joined_at: string;
  status: string;
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

function displayValue(value: React.ReactNode) {
  return value || "Не указано";
}

function isVolunteerStatus(value: string): value is VolunteerStatus {
  return volunteerStatuses.includes(value as VolunteerStatus);
}

function normalizeVolunteerStatus(value: string): VolunteerStatus {
  return isVolunteerStatus(value) ? value : "active";
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
      <dd className="mt-1 text-sm leading-6 text-oxford">{displayValue(value)}</dd>
    </div>
  );
}

function Section({
  children,
  description,
  title
}: {
  children: React.ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-oxford">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

async function loadCurrentVolunteer(profileId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("volunteers")
    .select("id, status, joined_at")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    throw new Error("Не удалось загрузить волонтёрский профиль.");
  }

  return (data as CurrentVolunteerRow | null) ?? null;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const currentUser = await requireCurrentUser();
  const result = await searchParams;
  const profileId = currentUser.profile?.id ?? currentUser.user.id;
  const volunteer = await loadCurrentVolunteer(profileId);
  const profile = {
    created_at: currentUser.profile?.created_at ?? currentUser.user.created_at ?? null,
    email: currentUser.profile?.email ?? currentUser.user.email ?? "Email не указан",
    full_name: currentUser.profile?.full_name ?? null,
    phone: currentUser.profile?.phone ?? null,
    role: currentUser.role,
    telegram: currentUser.profile?.telegram ?? null
  };

  return (
    <>
      <PageHeader
        title="Профиль"
        description="Аккаунт, контактные данные и текущий волонтёрский статус."
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
        <Section
          title="Аккаунт"
          description="Основные данные профиля. Email и роль показаны только для просмотра."
        >
          <dl className="grid gap-5 md:grid-cols-2">
            <DetailItem label="Email" value={profile.email} />
            <DetailItem label="ФИО" value={profile.full_name} />
            <DetailItem label="Телефон" value={profile.phone} />
            <DetailItem label="Telegram" value={profile.telegram} />
            <DetailItem
              label="Роль"
              value={<StatusBadge tone="info">{getRoleLabel(profile.role)}</StatusBadge>}
            />
            <DetailItem label="Дата регистрации" value={formatDate(profile.created_at)} />
          </dl>
        </Section>

        <Section
          title="Контактные данные"
          description="Можно обновить только ФИО, телефон и Telegram. Остальные поля управляются отдельными процессами."
        >
          <ProfileForm action={updateProfile} profile={profile} />
        </Section>

        <Section
          title="Волонтёрская карточка"
          description="Статус волонтёра редактируется только командой администраторов."
        >
          {volunteer ? (
            <dl className="grid gap-5 md:grid-cols-2">
              <DetailItem
                label="Статус"
                value={
                  <VolunteerStatusBadge
                    status={normalizeVolunteerStatus(volunteer.status)}
                  />
                }
              />
              <DetailItem
                label="Дата вступления"
                value={formatDate(volunteer.joined_at)}
              />
            </dl>
          ) : (
            <p className="text-sm leading-6 text-muted">
              Волонтёрский профиль ещё не подтверждён. Если вы уже подали заявку,
              дождитесь решения команды.
            </p>
          )}
        </Section>
      </div>
    </>
  );
}
