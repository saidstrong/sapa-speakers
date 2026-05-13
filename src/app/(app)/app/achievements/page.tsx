import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AchievementsPage() {
  return (
    <>
      <PageHeader title="Мои достижения" description="Подтверждённые достижения волонтёра." />
      <EmptyState title="Мои достижения" description={RU.emptyStates.achievements} />
    </>
  );
}
