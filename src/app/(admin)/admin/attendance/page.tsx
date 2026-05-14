import { AttendanceTable } from "@/components/attendance/attendance-table";
import { PageHeader } from "@/components/ui/page-header";
import { requireAdminUser } from "@/lib/auth/current-user";
import {
  eventAttendanceStatuses,
  listAttendanceRegisterForAdmin,
  type EventAttendanceStatus
} from "@/lib/queries/event-attendance";

type AdminAttendancePageProps = {
  searchParams?: Promise<{
    search?: string;
    status?: string;
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

      <AttendanceTable records={records} search={search} status={status} />
    </>
  );
}
