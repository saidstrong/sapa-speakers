import Link from "next/link";

type DashboardMetricCardProps = {
  description: string;
  href: string;
  title: string;
  value: string;
};

export function DashboardMetricCard({
  description,
  href,
  title,
  value
}: DashboardMetricCardProps) {
  return (
    <Link
      className="block rounded-lg border border-oxford/10 bg-white p-5 shadow-sm transition hover:border-orange/40 hover:shadow-md"
      href={href}
    >
      <div className="text-xs font-semibold uppercase text-muted">{title}</div>
      <div className="mt-3 text-3xl font-semibold leading-tight text-oxford">
        {value}
      </div>
      <div className="mt-2 text-sm leading-6 text-muted">{description}</div>
    </Link>
  );
}
