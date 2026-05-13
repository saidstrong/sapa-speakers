import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AnnouncementsPage() {
  return (
    <>
      <PageHeader title="Объявления" description="Сообщения организации и проектные объявления." />
      <EmptyState title="Объявления" description={RU.emptyStates.announcements} />
    </>
  );
}
