import { EmptyState } from "@/components/ui/empty-state";
import type {
  ContributionType,
  VolunteerContributionHistoryItem
} from "@/lib/queries/contributions";

type ContributionHistoryTableProps = {
  contributions: readonly VolunteerContributionHistoryItem[];
  totalHours: number;
};

const contributionTypeLabels: Record<ContributionType, string> = {
  event_attendance: "Участие в событии",
  manual_adjustment: "Ручная корректировка"
};

function formatDate(value: string | null) {
  if (!value) {
    return "Не указано";
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

export function ContributionHistoryTable({
  contributions,
  totalHours
}: ContributionHistoryTableProps) {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-muted">Всего подтверждено</p>
        <p className="mt-2 text-3xl font-semibold text-oxford">
          {formatHours(totalHours)} ч.
        </p>
      </section>

      {contributions.length === 0 ? (
        <EmptyState
          title="Мой вклад"
          description="Пока нет подтверждённых часов. Они появятся после участия и отметки посещаемости."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-oxford/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-oxford/10 text-sm">
              <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Событие</th>
                  <th className="px-4 py-3">Часы</th>
                  <th className="px-4 py-3">Тип</th>
                  <th className="px-4 py-3">Описание</th>
                  <th className="px-4 py-3">Подтверждено</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oxford/10">
                {contributions.map((contribution) => (
                  <tr key={contribution.id} className="align-top">
                    <td className="px-4 py-4 font-semibold text-oxford">
                      {contribution.event?.title ?? "Событие не указано"}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {formatHours(contribution.hours)} ч.
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {contributionTypeLabels[contribution.contribution_type]}
                    </td>
                    <td className="max-w-md px-4 py-4 text-muted">
                      {contribution.description ?? "Нет"}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {formatDate(contribution.awarded_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
