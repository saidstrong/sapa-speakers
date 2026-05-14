import { AchievementsTable } from "@/components/achievements/achievements-table";
import { ContributionHistoryTable } from "@/components/contributions/contribution-history-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentVolunteerAchievements } from "@/lib/queries/achievements";
import { getCurrentVolunteerContributionHistory } from "@/lib/queries/contributions";

export default async function AchievementsPage() {
  const [contributionHistory, achievementHistory] = await Promise.all([
    getCurrentVolunteerContributionHistory(),
    getCurrentVolunteerAchievements()
  ]);
  const hasVolunteer = Boolean(
    contributionHistory.volunteer ?? achievementHistory.volunteer
  );

  return (
    <>
      <PageHeader
        title="Мой вклад и достижения"
        description="Подтверждённые часы волонтёрства и вручную выданные достижения SapaSpeakers."
      />

      {!hasVolunteer ? (
        <EmptyState
          title="Достижения"
          description="Достижения доступны только одобренным волонтёрам."
        />
      ) : (
        <div className="grid gap-8">
          <section className="grid gap-4">
            <div>
              <h2 className="text-lg font-semibold text-oxford">Мои достижения</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Здесь отображаются достижения и бейджи, вручную подтверждённые
                командой. Отозванные достижения отмечаются отдельным статусом.
              </p>
            </div>
            <AchievementsTable
              achievements={achievementHistory.achievements}
              emptyDescription="У вас пока нет достижений. Они появятся здесь после активного участия."
            />
          </section>

          <section className="grid gap-4">
            <div>
              <h2 className="text-lg font-semibold text-oxford">История вклада</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Здесь отображаются подтверждённые часы волонтёрства. Баллы,
                уровни и рейтинги будут добавлены позже.
              </p>
            </div>
            <ContributionHistoryTable
              contributions={contributionHistory.contributions}
              totalHours={contributionHistory.totalHours}
            />
          </section>
        </div>
      )}
    </>
  );
}
