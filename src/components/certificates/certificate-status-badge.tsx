import { StatusBadge } from "@/components/ui/status-badge";
import type { CertificateStatus } from "@/lib/validations/certificate";

type CertificateStatusBadgeProps = {
  status: CertificateStatus;
};

const certificateStatusLabels: Record<CertificateStatus, string> = {
  issued: "Выдан",
  revoked: "Отозван"
};

const certificateStatusTones: Record<
  CertificateStatus,
  "neutral" | "success" | "warning" | "danger" | "info"
> = {
  issued: "success",
  revoked: "danger"
};

export function CertificateStatusBadge({ status }: CertificateStatusBadgeProps) {
  return (
    <StatusBadge tone={certificateStatusTones[status]}>
      {certificateStatusLabels[status]}
    </StatusBadge>
  );
}
