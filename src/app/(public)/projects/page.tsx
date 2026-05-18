import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentUser } from "@/lib/auth/current-user";
import { RU } from "@/lib/constants/ru";

export default async function PublicProjectsPage() {
  const currentUser = await getCurrentUser();
  const projectsHref = currentUser.user ? "/app/projects" : "/login";
  const projectsLabel = currentUser.user
    ? "Открыть проекты в кабинете"
    : "Войти и открыть проекты";

  return (
    <>
      <PageHeader
        title={RU.pages.projects.title}
        description="Это публичная информационная страница. Закрытый список проектов, запись на участие и рабочие данные доступны только в личном кабинете после входа."
      />
      <EmptyState
        title="Публичная навигация по проектам"
        description="Здесь нет закрытых данных участников или внутренних заявок. Чтобы просматривать опубликованные проекты и работать с участием, перейдите в кабинет."
        action={
          <>
            <Link
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
              href={projectsHref}
            >
              {projectsLabel}
            </Link>
            <Link
              className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
              href="/join"
            >
              Подать заявку
            </Link>
          </>
        }
      />
    </>
  );
}
