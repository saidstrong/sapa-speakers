import Link from "next/link";
import { ContributionForm } from "@/components/contributions/contribution-form";
import { AttendanceStatusBadge } from "@/components/events/attendance-status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { VolunteerContribution } from "@/lib/queries/contributions";
import {
  eventAttendanceStatuses,
  type AttendanceRegisterRecord,
  type EventAttendanceStatus
} from "@/lib/queries/event-attendance";

type AttendanceTableProps = {
  contributionAction: (formData: FormData) => Promise<void>;
  contributions: readonly VolunteerContribution[];
  records: readonly AttendanceRegisterRecord[];
  search?: string;
  status?: EventAttendanceStatus | "all";
};

const statusFilterLabels: Record<EventAttendanceStatus | "all", string> = {
  all: "Все",
  attended: "Был",
  absent: "Не был",
  excused: "Уважительная причина"
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

function formatEventDate(record: AttendanceRegisterRecord) {
  if (!record.event) {
    return "Не указано";
  }

  if (!record.event.ends_at) {
    return formatDate(record.event.starts_at);
  }

  return `${formatDate(record.event.starts_at)} - ${formatDate(record.event.ends_at)}`;
}

function displayProfile(profile: AttendanceRegisterRecord["volunteerProfile"]) {
  if (!profile) {
    return "Не указан";
  }

  return profile.full_name ?? profile.email;
}

function Filters({
  search,
  status
}: {
  search?: string;
  status: EventAttendanceStatus | "all";
}) {
  return (
    <form className="grid gap-3 rounded-lg border border-oxford/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_auto_auto] md:items-end">
      <label className="block text-sm font-semibold text-oxford">
        Поиск
        <input
          className="mt-2 w-full rounded-md border border-oxford/15 bg-white px-3 py-2 text-sm font-normal text-oxford"
          defaultValue={search ?? ""}
          name="search"
          placeholder="Событие, имя или email"
          type="search"
        />
      </label>
      <label className="block text-sm font-semibold text-oxford">
        Статус
        <select
          className="mt-2 w-full rounded-md border border-oxford/15 bg-white px-3 py-2 text-sm font-normal text-oxford"
          defaultValue={status}
          name="status"
        >
          <option value="all">{statusFilterLabels.all}</option>
          {eventAttendanceStatuses.map((value) => (
            <option key={value} value={value}>
              {statusFilterLabels[value]}
            </option>
          ))}
        </select>
      </label>
      <button
        className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
        type="submit"
      >
        Применить
      </button>
      <Link
        className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-center text-sm font-semibold text-oxford"
        href="/admin/attendance"
      >
        Сбросить
      </Link>
    </form>
  );
}

export function AttendanceTable({
  contributionAction,
  contributions,
  records,
  search,
  status = "all"
}: AttendanceTableProps) {
  const contributionsByAttendanceId = new Map(
    contributions
      .filter((contribution) => contribution.attendance_id)
      .map((contribution) => [contribution.attendance_id, contribution])
  );

  return (
    <div className="grid gap-4">
      <Filters search={search} status={status} />

      {records.length === 0 ? (
        <EmptyState
          title="Реестр посещаемости"
          description="Пока нет отмеченной посещаемости. Отметьте участников на странице события."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-oxford/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1180px] divide-y divide-oxford/10 text-sm">
              <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Событие</th>
                  <th className="px-4 py-3">Дата события</th>
                  <th className="px-4 py-3">Волонтёр</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Часы</th>
                  <th className="px-4 py-3">Отмечено</th>
                  <th className="px-4 py-3">Отметил</th>
                  <th className="px-4 py-3">Комментарий</th>
                  <th className="px-4 py-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oxford/10">
                {records.map((record) => (
                  <tr key={record.id} className="align-top">
                    <td className="px-4 py-4 font-semibold text-oxford">
                      {record.event?.title ?? "Событие недоступно"}
                    </td>
                    <td className="px-4 py-4 text-muted">{formatEventDate(record)}</td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-oxford">
                        {displayProfile(record.volunteerProfile)}
                      </div>
                      <div className="mt-1 text-muted">
                        {record.volunteerProfile?.email ?? "Email не указан"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <AttendanceStatusBadge status={record.status} />
                    </td>
                    <td className="px-4 py-4">
                      {record.status === "attended" ? (
                        <ContributionForm
                          action={contributionAction}
                          attendanceId={record.id}
                          contribution={
                            contributionsByAttendanceId.get(record.id) ?? null
                          }
                        />
                      ) : (
                        <p className="max-w-48 text-sm leading-6 text-muted">
                          Часы начисляются только для статуса «Был».
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {formatDate(record.marked_at)}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {record.markedByProfile
                        ? record.markedByProfile.full_name ?? record.markedByProfile.email
                        : "Не указан"}
                    </td>
                    <td className="max-w-xs px-4 py-4 text-muted">
                      {record.notes ?? "Нет"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex flex-col gap-2">
                        <Link
                          className="font-semibold text-oxford underline decoration-orange/60 underline-offset-4 hover:text-orange"
                          href={`/admin/events/${record.event_id}`}
                        >
                          Открыть событие
                        </Link>
                        {record.volunteer ? (
                          <Link
                            className="font-semibold text-oxford underline decoration-orange/60 underline-offset-4 hover:text-orange"
                            href={`/admin/volunteers/${record.volunteer.id}`}
                          >
                            Карточка волонтёра
                          </Link>
                        ) : null}
                      </div>
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
