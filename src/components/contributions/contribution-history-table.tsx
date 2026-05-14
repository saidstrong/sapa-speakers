import { AttendanceStatusBadge } from "@/components/events/attendance-status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import type {
  ContributionType,
  VolunteerContributionHistoryItem
} from "@/lib/queries/contributions";

type ContributionHistoryTableProps = {
  contributions: readonly VolunteerContributionHistoryItem[];
  emptyDescription?: string;
  emptyTitle?: string;
  showAdminColumns?: boolean;
  showSummary?: boolean;
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
  emptyDescription = "Пока нет подтверждённых часов. Они появятся после участия и отметки посещаемости.",
  emptyTitle = "Мой вклад",
  showAdminColumns = false,
  showSummary = true,
  totalHours
}: ContributionHistoryTableProps) {
  return (
    <div className="grid gap-4">
      {showSummary ? (
        <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-muted">Всего подтверждено</p>
          <p className="mt-2 text-3xl font-semibold text-oxford">
            {formatHours(totalHours)} ч.
          </p>
        </section>
      ) : null}

      {contributions.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-hidden rounded-lg border border-oxford/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-oxford/10 text-sm">
              <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Событие</th>
                  <th className="px-4 py-3">Часы</th>
                  <th className="px-4 py-3">Тип</th>
                  {showAdminColumns ? (
                    <th className="px-4 py-3">Посещаемость</th>
                  ) : null}
                  <th className="px-4 py-3">Описание</th>
                  <th className="px-4 py-3">Подтверждено</th>
                  {showAdminColumns ? (
                    <>
                      <th className="px-4 py-3">Создано</th>
                      <th className="px-4 py-3">Подтвердил</th>
                    </>
                  ) : null}
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
                    {showAdminColumns ? (
                      <td className="px-4 py-4">
                        <AttendanceStatusBadge
                          status={contribution.attendance?.status ?? null}
                        />
                      </td>
                    ) : null}
                    <td className="max-w-md px-4 py-4 text-muted">
                      {contribution.description ?? "Нет"}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {formatDate(contribution.awarded_at)}
                    </td>
                    {showAdminColumns ? (
                      <>
                        <td className="px-4 py-4 text-muted">
                          {formatDate(contribution.created_at)}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {contribution.awardedByProfile
                            ? contribution.awardedByProfile.full_name ??
                              contribution.awardedByProfile.email
                            : "Не указан"}
                        </td>
                      </>
                    ) : null}
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
