import Link from "next/link";
import { ApplicationStatusBadge } from "@/components/applications/application-status-badge";
import { VolunteerStatusBadge } from "@/components/volunteers/volunteer-status-badge";
import { getRoleLabel } from "@/lib/auth/roles";
import type { VolunteerListItem } from "@/lib/queries/volunteers";

type VolunteersTableProps = {
  volunteers: readonly VolunteerListItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function VolunteersTable({ volunteers }: VolunteersTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-oxford/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] divide-y divide-oxford/10 text-sm">
          <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">ФИО</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Роль профиля</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Дата вступления</th>
              <th className="px-4 py-3">Связанная заявка</th>
              <th className="px-4 py-3 text-right">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oxford/10">
            {volunteers.map((volunteer) => (
              <tr key={volunteer.id} className="align-top">
                <td className="px-4 py-4 font-semibold text-oxford">
                  {volunteer.profile?.full_name ?? "Без имени"}
                </td>
                <td className="px-4 py-4 text-muted">
                  {volunteer.profile?.email ?? "Не указан"}
                </td>
                <td className="px-4 py-4 text-muted">
                  {volunteer.profile ? getRoleLabel(volunteer.profile.role) : "Не указана"}
                </td>
                <td className="px-4 py-4">
                  <VolunteerStatusBadge status={volunteer.status} />
                </td>
                <td className="px-4 py-4 text-muted">{formatDate(volunteer.joined_at)}</td>
                <td className="px-4 py-4">
                  {volunteer.application ? (
                    <ApplicationStatusBadge status={volunteer.application.status} />
                  ) : (
                    <span className="text-muted">Нет</span>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <Link
                    className="font-semibold text-oxford underline decoration-orange/60 underline-offset-4 hover:text-orange"
                    href={`/admin/volunteers/${volunteer.id}`}
                  >
                    Открыть
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
