import { ContributionHistoryTable } from "@/components/contributions/contribution-history-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentVolunteerContributionHistory } from "@/lib/queries/contributions";

export default async function AchievementsPage() {
  const { contributions, totalHours, volunteer } =
    await getCurrentVolunteerContributionHistory();

  return (
    <>
      <PageHeader
        title="Мой вклад"
        description="Здесь отображаются подтверждённые часы волонтёрства. Достижения и бейджи будут добавлены позже."
      />

      {!volunteer ? (
        <EmptyState
          title="История вклада"
          description="История вклада доступна только одобренным волонтёрам."
        />
      ) : (
        <ContributionHistoryTable
          contributions={contributions}
          totalHours={totalHours}
        />
      )}
    </>
  );
}
