import Link from "next/link";
import { AnnouncementForm } from "@/components/announcements/announcement-form";
import { PageHeader } from "@/components/ui/page-header";
import { createAnnouncement } from "../actions";

type NewAnnouncementPageProps = {
  searchParams?: Promise<{
    message?: string;
    type?: string;
  }>;
};

export default async function NewAnnouncementPage({
  searchParams
}: NewAnnouncementPageProps) {
  const result = await searchParams;

  return (
    <>
      <PageHeader
        title="Новое объявление"
        description="Создайте внутреннее объявление. Опубликованные объявления сразу появятся в личном кабинете волонтёров."
        action={
          <Link
            className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford"
            href="/admin/announcements"
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

      <AnnouncementForm
        action={createAnnouncement}
        cancelHref="/admin/announcements"
        submitLabel="Создать объявление"
      />
    </>
  );
}
