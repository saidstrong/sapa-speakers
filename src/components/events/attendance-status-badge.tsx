import { StatusBadge } from "@/components/ui/status-badge";
import type { EventAttendanceStatus } from "@/lib/queries/event-attendance";

type AttendanceStatusBadgeProps = {
  status: EventAttendanceStatus | null;
};

const attendanceStatusLabels: Record<EventAttendanceStatus, string> = {
  attended: "Был",
  absent: "Не был",
  excused: "Уважительная причина"
};

const attendanceStatusTones: Record<
  EventAttendanceStatus,
  "neutral" | "success" | "warning" | "danger" | "info"
> = {
  attended: "success",
  absent: "danger",
  excused: "warning"
};

export function AttendanceStatusBadge({ status }: AttendanceStatusBadgeProps) {
  if (!status) {
    return <StatusBadge tone="neutral">Не отмечено</StatusBadge>;
  }

  return (
    <StatusBadge tone={attendanceStatusTones[status]}>
      {attendanceStatusLabels[status]}
    </StatusBadge>
  );
}
