import { AnnouncementsList } from "@/components/announcements/announcements-list";
import { PageHeader } from "@/components/ui/page-header";
import { listPublishedAnnouncements } from "@/lib/queries/announcements";

export default async function AnnouncementsPage() {
  const announcements = await listPublishedAnnouncements();

  return (
    <>
      <PageHeader
        title="Объявления"
        description="Внутренние опубликованные сообщения SapaSpeakers для волонтёров."
      />

      <AnnouncementsList announcements={announcements} />
    </>
  );
}
