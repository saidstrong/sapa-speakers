import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { RU } from "@/lib/constants/ru";

export default function AppDashboardPage() {
  return (
    <>
      <PageHeader title={RU.pages.app.title} description={RU.pages.app.description} />
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-vista/35 bg-vista/15 p-6">
          <StatusBadge tone="info">Цитата дня</StatusBadge>
          <p className="mt-4 text-lg font-semibold text-oxford">
            Большие изменения начинаются с маленького доброго действия.
          </p>
        </section>
        <EmptyState title="Профиль" description={RU.messages.profileRequired} />
        <EmptyState title="Мои заявки" description={RU.emptyStates.applications} />
        <EmptyState title="Сертификаты" description={RU.emptyStates.certificates} />
      </div>
    </>
  );
}
