import { AchievementsTable } from "@/components/achievements/achievements-table";
import { PageHeader } from "@/components/ui/page-header";
import { listAchievementsForAdmin } from "@/lib/queries/achievements";

export default async function AdminBadgesPage() {
  const achievements = await listAchievementsForAdmin();

  return (
    <>
      <PageHeader
        title="Достижения"
        description="Реестр вручную выданных достижений и бейджей волонтёров."
      />

      <section className="mb-6 rounded-lg border border-vista/40 bg-vista/15 p-4 text-sm leading-6 text-oxford">
        Достижения выдаются со страницы волонтёра. Автоматические правила,
        баллы, уровни и рейтинги будут добавлены позже.
      </section>

      <AchievementsTable
        achievements={achievements}
        emptyDescription="Пока нет выданных достижений. Выдать достижение можно со страницы волонтёра."
        showAwarder
        showVolunteer
      />
    </>
  );
}
