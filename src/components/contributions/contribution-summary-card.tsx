import type { VolunteerContributionSummary } from "@/lib/queries/contributions";

type ContributionSummaryCardProps = {
  summary: VolunteerContributionSummary;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Нет записей";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatHours(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(value);
}

export function ContributionSummaryCard({ summary }: ContributionSummaryCardProps) {
  return (
    <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-oxford">Сводка вклада</h2>
      <dl className="mt-5 grid gap-5 md:grid-cols-3">
        <div>
          <dt className="text-xs font-semibold uppercase text-muted">Всего часов</dt>
          <dd className="mt-1 text-2xl font-semibold text-oxford">
            {formatHours(summary.totalHours)} ч.
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-muted">Записей</dt>
          <dd className="mt-1 text-2xl font-semibold text-oxford">
            {summary.recordCount}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-muted">Последний вклад</dt>
          <dd className="mt-1 text-sm leading-6 text-oxford">
            {formatDate(summary.latestContributionAt)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
