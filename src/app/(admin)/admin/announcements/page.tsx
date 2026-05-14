import Link from "next/link";
import { AnnouncementsTable } from "@/components/announcements/announcements-table";
import { PageHeader } from "@/components/ui/page-header";
import { listAnnouncementsForAdmin } from "@/lib/queries/announcements";

export default async function AdminAnnouncementsPage() {
  const announcements = await listAnnouncementsForAdmin();

  return (
    <>
      <PageHeader
        title="Объявления"
        description="Внутренние сообщения для волонтёров. Здесь создаются черновики и публикуются объявления для личного кабинета."
        action={
          <Link
            className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
            href="/admin/announcements/new"
          >
            Создать объявление
          </Link>
        }
      />

      <AnnouncementsTable announcements={announcements} />
    </>
  );
}
