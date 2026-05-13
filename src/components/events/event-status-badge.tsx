import { StatusBadge } from "@/components/ui/status-badge";
import type { EventStatus } from "@/lib/validations/event";

export const eventStatusLabels: Record<EventStatus, string> = {
  draft: "Черновик",
  published: "Опубликовано",
  completed: "Завершено",
  cancelled: "Отменено"
};

const eventStatusTones: Record<
  EventStatus,
  "neutral" | "success" | "warning" | "danger" | "info"
> = {
  draft: "neutral",
  published: "success",
  completed: "info",
  cancelled: "danger"
};

type EventStatusBadgeProps = {
  status: EventStatus;
};

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  return <StatusBadge tone={eventStatusTones[status]}>{eventStatusLabels[status]}</StatusBadge>;
}
