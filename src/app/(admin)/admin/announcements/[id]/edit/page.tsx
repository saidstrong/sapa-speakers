import Link from "next/link";
import { AnnouncementForm } from "@/components/announcements/announcement-form";
import { PageHeader } from "@/components/ui/page-header";
import { getAnnouncementForAdmin } from "@/lib/queries/announcements";
import { updateAnnouncement } from "../../actions";

type EditAnnouncementPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    message?: string;
    type?: string;
  }>;
};

export default async function EditAnnouncementPage({
  params,
  searchParams
}: EditAnnouncementPageProps) {
  const { id } = await params;
  const result = await searchParams;
  const announcement = await getAnnouncementForAdmin(id);
  const updateAction = updateAnnouncement.bind(null, announcement.id);

  return (
    <>
      <PageHeader
        title="Редактирование объявления"
        description="Обновите заголовок, текст и статус объявления. Удаление не входит в эту фазу."
        action={
          <Link
            className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford"
            href={`/admin/announcements/${announcement.id}`}
          >
            Назад к объявлению
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

      <AnnouncementForm
        action={updateAction}
        allowArchived
        announcement={announcement}
        cancelHref={`/admin/announcements/${announcement.id}`}
        submitLabel="Сохранить объявление"
      />
    </>
  );
}
