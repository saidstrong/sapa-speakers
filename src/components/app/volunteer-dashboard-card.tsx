import Link from "next/link";

type VolunteerDashboardCardProps = {
  description?: string;
  href?: string;
  meta?: string;
  title: string;
  value: string;
};

export function VolunteerDashboardCard({
  description,
  href,
  meta,
  title,
  value
}: VolunteerDashboardCardProps) {
  const content = (
    <>
      <p className="text-sm font-semibold text-muted">{title}</p>
      <p className="mt-3 text-3xl font-semibold tracking-normal text-oxford">
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      ) : null}
      {meta ? <p className="mt-4 text-xs font-semibold uppercase text-muted">{meta}</p> : null}
    </>
  );

  if (href) {
    return (
      <Link
        className="rounded-lg border border-oxford/10 bg-white p-5 shadow-sm transition hover:border-orange/40 hover:shadow-md"
        href={href}
      >
        {content}
      </Link>
    );
  }

  return (
    <section className="rounded-lg border border-oxford/10 bg-white p-5 shadow-sm">
      {content}
    </section>
  );
}
