import Link from "next/link";

export type VolunteerNextAction = {
  description: string;
  href: string;
  title: string;
};

const defaultActions: VolunteerNextAction[] = [
  {
    description: "Найдите опубликованные события и выберите подходящее участие.",
    href: "/app/projects",
    title: "Открыть проекты"
  },
  {
    description: "Проверьте активные и отменённые записи на проекты.",
    href: "/app/applications",
    title: "Мои записи"
  },
  {
    description: "Посмотрите подтверждённые часы и достижения.",
    href: "/app/achievements",
    title: "Мой вклад"
  },
  {
    description: "Откройте выданные сертификаты и их текущий статус.",
    href: "/app/certificates",
    title: "Сертификаты"
  }
];

type VolunteerNextActionsProps = {
  actions?: readonly VolunteerNextAction[];
  title?: string;
};

export function VolunteerNextActions({
  actions = defaultActions,
  title = "Следующие действия"
}: VolunteerNextActionsProps) {
  return (
    <section className="grid gap-4">
      <h2 className="text-lg font-semibold text-oxford">{title}</h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Link
            className="rounded-lg border border-oxford/10 bg-white p-4 shadow-sm transition hover:border-orange/40 hover:shadow-md"
            href={action.href}
            key={action.href}
          >
            <span className="font-semibold text-oxford">{action.title}</span>
            <span className="mt-2 block text-sm leading-6 text-muted">
              {action.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
