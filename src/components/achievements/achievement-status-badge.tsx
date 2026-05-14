import { StatusBadge } from "@/components/ui/status-badge";
import type { AchievementStatus } from "@/lib/validations/achievement";

type AchievementStatusBadgeProps = {
  status: AchievementStatus;
};

const achievementStatusLabels: Record<AchievementStatus, string> = {
  awarded: "Выдано",
  revoked: "Отозвано"
};

const achievementStatusTones: Record<
  AchievementStatus,
  "neutral" | "success" | "warning" | "danger" | "info"
> = {
  awarded: "success",
  revoked: "danger"
};

export function AchievementStatusBadge({ status }: AchievementStatusBadgeProps) {
  return (
    <StatusBadge tone={achievementStatusTones[status]}>
      {achievementStatusLabels[status]}
    </StatusBadge>
  );
}
