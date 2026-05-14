import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { RU } from "@/lib/constants/ru";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-lg bg-oxford p-8 text-white md:grid-cols-[1.3fr_0.7fr] md:p-12">
        <div>
          <p className="text-sm font-semibold text-amande">SapaSpeakers</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            {RU.pages.home.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
            {RU.pages.home.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-md bg-orange px-5 py-3 text-sm font-semibold text-oxford transition hover:bg-orange/90"
            >
              {RU.buttons.becomeVolunteer}
            </Link>
            <Link
              href="/projects"
              className="rounded-md border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {RU.buttons.viewProjects}
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-white/15 bg-white/8 p-5">
          <StatusBadge tone="warning">Контролируемое участие</StatusBadge>
          <p className="mt-4 text-sm leading-6 text-white/75">
            {RU.messages.controlledParticipation}
          </p>
        </div>
      </section>

      <PageHeader
        title="Как работает платформа"
        description="Путь волонтёра прозрачен: заявка, одобренный профиль, участие в проектах и подтверждённый вклад в личном кабинете."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <EmptyState
          title="Заявка и аккаунт"
          description="Заполните анкету, создайте аккаунт и дождитесь решения команды. После одобрения появится волонтёрский профиль."
        />
        <EmptyState
          title="Проекты и участие"
          description="Одобренные волонтёры видят опубликованные проекты, записываются на подходящие события и отслеживают свои регистрации."
        />
        <EmptyState
          title="Подтверждённый вклад"
          description="Команда отмечает посещаемость, подтверждает часы, выдаёт сертификаты и достижения без лишних ручных переписок."
        />
      </div>
    </div>
  );
}
