import Link from "next/link";
import { ApplicationStatusBadge } from "@/components/applications/application-status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { getVolunteerApplicationDetail } from "@/lib/queries/volunteer-applications";
import {
  approveVolunteerApplication,
  declineVolunteerApplication
} from "./actions";

type VolunteerApplicationDetailPageProps = {
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

function formatList(values: readonly string[]) {
  return values.length > 0 ? values.join(", ") : "Не указано";
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

function ReviewForm({
  applicationId,
  action,
  buttonLabel,
  tone
}: {
  applicationId: string;
  action: (applicationId: string, formData: FormData) => Promise<void>;
  buttonLabel: string;
  tone: "approve" | "decline";
}) {
  const boundAction = action.bind(null, applicationId);

  return (
    <form action={boundAction} className="space-y-3">
      <label className="block text-sm font-semibold text-oxford">
        Комментарий ревьюера
        <textarea
          className="mt-2 min-h-28 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm"
          maxLength={2000}
          name="reviewer_notes"
          placeholder="Короткий комментарий для внутреннего рассмотрения"
        />
      </label>
      <button
        className={
          tone === "approve"
            ? "rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
            : "rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800"
        }
        type="submit"
      >
        {buttonLabel}
      </button>
    </form>
  );
}

export default async function VolunteerApplicationDetailPage({
  params,
  searchParams
}: VolunteerApplicationDetailPageProps) {
  const { id } = await params;
  const result = await searchParams;
  const { application, matchingProfile, volunteer } =
    await getVolunteerApplicationDetail(id);
  const isPending = application.status === "pending";

  return (
    <>
      <PageHeader
        title="Заявка волонтёра"
        description="Проверьте публичную заявку, затем одобрите кандидата или отклоните заявку."
        action={
          <Link
            className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford"
            href="/admin/team-applications"
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

      {application.status === "approved" && !volunteer ? (
        <div className="mb-6 rounded-lg border border-vista/40 bg-vista/15 p-4 text-sm font-medium text-oxford">
          {matchingProfile
            ? "Профиль найден, но волонтёрская карточка ещё не создана. Повторите одобрение или проверьте права доступа."
            : "Заявка одобрена, но профиль пользователя ещё не создан. Попросите кандидата зарегистрироваться с тем же email."}
        </div>
      ) : null}

      {application.status === "approved" && volunteer ? (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">
          Волонтёрская карточка создана или уже существует.
        </div>
      ) : null}

      <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 border-b border-oxford/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-oxford">{application.full_name}</h2>
            <p className="mt-1 text-sm text-muted">{application.email}</p>
          </div>
          <ApplicationStatusBadge status={application.status} />
        </div>

        <dl className="grid gap-5 md:grid-cols-2">
          <DetailItem label="ФИО" value={application.full_name} />
          <DetailItem label="Email" value={application.email} />
          <DetailItem label="Телефон" value={application.phone} />
          <DetailItem label="Telegram" value={application.telegram} />
          <DetailItem label="Город" value={application.city} />
          <DetailItem label="Возраст" value={application.age?.toString()} />
          <DetailItem label="Языки" value={formatList(application.languages)} />
          <DetailItem label="Интересы" value={formatList(application.interests)} />
          <DetailItem label="Опыт волонтёрства" value={application.experience} />
          <DetailItem label="Доступность" value={application.availability} />
          <DetailItem label="Дата подачи" value={formatDate(application.submitted_at)} />
          <DetailItem label="Дата решения" value={formatDate(application.reviewed_at)} />
          <DetailItem label="Мотивация" value={application.motivation} />
          <DetailItem label="Комментарий ревьюера" value={application.reviewer_notes} />
        </dl>
      </section>

      <section className="mt-6 rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-oxford">Решение по заявке</h2>
        {isPending ? (
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <ReviewForm
              action={approveVolunteerApplication}
              applicationId={application.id}
              buttonLabel="Одобрить заявку"
              tone="approve"
            />
            <ReviewForm
              action={declineVolunteerApplication}
              applicationId={application.id}
              buttonLabel="Отклонить заявку"
              tone="decline"
            />
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-muted">
            Решение уже принято. Повторное изменение статуса через интерфейс не
            предусмотрено.
          </p>
        )}
      </section>
    </>
  );
}
