import Link from "next/link";
import { ApplicationStatusBadge } from "@/components/applications/application-status-badge";
import type { VolunteerApplication } from "@/lib/queries/volunteer-applications";

type ApplicationsTableProps = {
  applications: readonly VolunteerApplication[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-oxford/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[820px] divide-y divide-oxford/10 text-sm">
          <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">ФИО</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Город</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Дата подачи</th>
              <th className="px-4 py-3 text-right">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oxford/10">
            {applications.map((application) => (
              <tr key={application.id} className="align-top">
                <td className="px-4 py-4 font-semibold text-oxford">
                  {application.full_name}
                </td>
                <td className="px-4 py-4 text-muted">{application.email}</td>
                <td className="px-4 py-4 text-muted">{application.city ?? "Не указан"}</td>
                <td className="px-4 py-4">
                  <ApplicationStatusBadge status={application.status} />
                </td>
                <td className="px-4 py-4 text-muted">
                  {formatDate(application.submitted_at)}
                </td>
                <td className="px-4 py-4 text-right">
                  <Link
                    className="font-semibold text-oxford underline decoration-orange/60 underline-offset-4 hover:text-orange"
                    href={`/admin/team-applications/${application.id}`}
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
