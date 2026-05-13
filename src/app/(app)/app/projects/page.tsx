import { PublishedEventsList } from "@/components/events/published-events-list";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { listPublishedEvents } from "@/lib/queries/published-events";

export default async function AppProjectsPage() {
  const events = await listPublishedEvents();

  return (
    <>
      <PageHeader
        title="Проекты и события"
        description="Опубликованные активности SapaSpeakers, доступные для просмотра волонтёрам."
      />
      {events.length > 0 ? (
        <PublishedEventsList events={events} />
      ) : (
        <EmptyState
          title="Пока нет опубликованных проектов или событий"
          description="Пока нет опубликованных проектов или событий. Следите за обновлениями."
        />
      )}
    </>
  );
}
