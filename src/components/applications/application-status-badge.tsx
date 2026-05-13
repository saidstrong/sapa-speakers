import { StatusBadge } from "@/components/ui/status-badge";
import type { VolunteerApplicationStatus } from "@/lib/queries/volunteer-applications";

const statusLabels: Record<VolunteerApplicationStatus, string> = {
  pending: "На рассмотрении",
  approved: "Одобрена",
  declined: "Отклонена"
};

const statusTones: Record<
  VolunteerApplicationStatus,
  "neutral" | "success" | "warning" | "danger" | "info"
> = {
  pending: "warning",
  approved: "success",
  declined: "danger"
};

type ApplicationStatusBadgeProps = {
  status: VolunteerApplicationStatus;
};

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  return <StatusBadge tone={statusTones[status]}>{statusLabels[status]}</StatusBadge>;
}
