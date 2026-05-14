import { AttendanceTable } from "@/components/attendance/attendance-table";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdminUser } from "@/lib/auth/current-user";
import { listContributionsByAttendanceIdsForAdmin } from "@/lib/queries/contributions";
import {
  eventAttendanceStatuses,
  listAttendanceRegisterForAdmin,
  type EventAttendanceStatus
} from "@/lib/queries/event-attendance";
import { saveAttendanceContribution } from "./contribution-actions";

type AdminAttendancePageProps = {
  searchParams?: Promise<{
    message?: string;
    search?: string;
    status?: string;
    type?: string;
  }>;
};

function parseStatus(value: string | undefined): EventAttendanceStatus | "all" {
  if (eventAttendanceStatuses.includes(value as EventAttendanceStatus)) {
    return value as EventAttendanceStatus;
  }

  return "all";
}

export default async function AdminAttendancePage({
  searchParams
}: AdminAttendancePageProps) {
  await requireAdminUser();

  const params = await searchParams;
  const status = parseStatus(params?.status);
  const search = params?.search?.trim() ?? "";
  const records = await listAttendanceRegisterForAdmin({
    search,
    status
  });
  const contributions = await listContributionsByAttendanceIdsForAdmin(
    records.map((record) => record.id)
  );

  return (
    <>
      <PageHeader
        title="Посещаемость"
        description="Центральный реестр уже отмеченной посещаемости по событиям и проектам."
      />

      <section className="mb-6 rounded-lg border border-vista/40 bg-vista/15 p-4 text-sm leading-6 text-oxford">
        Этот раздел показывает уже отмеченную посещаемость. Часы, сертификаты и
        достижения будут добавлены позже.
      </section>

      {params?.message ? (
        <div
          className={
            params.type === "success"
              ? "mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800"
              : "mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
          }
        >
          {params.message}
        </div>
      ) : null}

      <AttendanceTable
        contributionAction={saveAttendanceContribution}
        contributions={contributions}
        records={records}
        search={search}
        status={status}
      />
    </>
  );
}
