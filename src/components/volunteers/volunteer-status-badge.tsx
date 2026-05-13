import { StatusBadge } from "@/components/ui/status-badge";
import type { VolunteerStatus } from "@/lib/queries/volunteers";

export const volunteerStatusLabels: Record<VolunteerStatus, string> = {
  active: "Активный",
  inactive: "Неактивный",
  suspended: "Приостановлен",
  alumni: "Выпускник"
};

const volunteerStatusTones: Record<
  VolunteerStatus,
  "neutral" | "success" | "warning" | "danger" | "info"
> = {
  active: "success",
  inactive: "neutral",
  suspended: "danger",
  alumni: "info"
};

type VolunteerStatusBadgeProps = {
  status: VolunteerStatus;
};

export function VolunteerStatusBadge({ status }: VolunteerStatusBadgeProps) {
  return (
    <StatusBadge tone={volunteerStatusTones[status]}>
      {volunteerStatusLabels[status]}
    </StatusBadge>
  );
}
