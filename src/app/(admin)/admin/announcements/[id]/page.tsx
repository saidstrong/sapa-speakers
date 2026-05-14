import Link from "next/link";
import { AnnouncementStatusBadge } from "@/components/announcements/announcement-status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { getAnnouncementForAdmin } from "@/lib/queries/announcements";

type AnnouncementDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    message?: string;
    type?: string;
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

function displayProfile(profile: Awaited<ReturnType<typeof getAnnouncementForAdmin>>["createdByProfile"]) {
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
  children,
  title
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-oxford">{title}</h2>
      {children}
    </section>
  );
}

export default async function AnnouncementDetailPage({
  params,
  searchParams
}: AnnouncementDetailPageProps) {
  const { id } = await params;
  const result = await searchParams;
  const announcement = await getAnnouncementForAdmin(id);

  return (
    <>
      <PageHeader
        title={announcement.title}
        description="Карточка внутреннего объявления. Здесь можно проверить статус, текст и перейти к редактированию."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford"
              href="/admin/announcements"
            >
              Назад к списку
            </Link>
            <Link
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
              href={`/admin/announcements/${announcement.id}/edit`}
            >
              Редактировать
            </Link>
          </div>
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
            <DetailItem label="Заголовок" value={announcement.title} />
            <DetailItem
              label="Статус"
              value={<AnnouncementStatusBadge status={announcement.status} />}
            />
            <DetailItem
              label="Дата публикации"
              value={formatDate(announcement.published_at)}
            />
            <DetailItem label="Создал" value={displayProfile(announcement.createdByProfile)} />
          </dl>
        </Section>

        <Section title="Текст объявления">
          <div className="whitespace-pre-line text-sm leading-7 text-oxford">
            {announcement.body}
          </div>
        </Section>

        <Section title="Системная информация">
          <dl className="grid gap-5 md:grid-cols-2">
            <DetailItem label="Создано" value={formatDate(announcement.created_at)} />
            <DetailItem label="Обновлено" value={formatDate(announcement.updated_at)} />
          </dl>
        </Section>

        <section className="rounded-lg border border-vista/40 bg-vista/15 p-4 text-sm leading-6 text-oxford">
          Уведомления, комментарии, реакции, вложения и отметки прочтения будут добавлены
          позже. Сейчас объявление работает как простая внутренняя публикация.
        </section>
      </div>
    </>
  );
}
