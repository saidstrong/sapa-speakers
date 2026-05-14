import { StatusBadge } from "@/components/ui/status-badge";
import type { AnnouncementStatus } from "@/lib/validations/announcement";

export const announcementStatusLabels: Record<AnnouncementStatus, string> = {
  archived: "В архиве",
  draft: "Черновик",
  published: "Опубликовано"
};

const announcementStatusTones: Record<
  AnnouncementStatus,
  "danger" | "info" | "neutral" | "success" | "warning"
> = {
  archived: "neutral",
  draft: "warning",
  published: "success"
};

type AnnouncementStatusBadgeProps = {
  status: AnnouncementStatus;
};

export function AnnouncementStatusBadge({ status }: AnnouncementStatusBadgeProps) {
  return (
    <StatusBadge tone={announcementStatusTones[status]}>
      {announcementStatusLabels[status]}
    </StatusBadge>
  );
}
