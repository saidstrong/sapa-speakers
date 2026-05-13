import { cn } from "@/lib/utils";

type StatusBadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClassNames: Record<StatusBadgeTone, string> = {
  neutral: "border-oxford/15 bg-oxford/5 text-oxford",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-orange/25 bg-orange/10 text-oxford",
  danger: "border-red-200 bg-red-50 text-red-800",
  info: "border-vista/40 bg-vista/15 text-oxford"
};

type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: StatusBadgeTone;
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        toneClassNames[tone]
      )}
    >
      {children}
    </span>
  );
}
