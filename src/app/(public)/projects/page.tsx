import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function PublicProjectsPage() {
  return (
    <>
      <PageHeader title={RU.pages.projects.title} description={RU.pages.projects.description} />
      <EmptyState
        title="Проекты доступны в личном кабинете"
        description="Опубликованные проекты и запись на участие открываются после входа. Если вы ещё не подавали заявку, начните с анкеты волонтёра."
        action={
          <>
            <Link
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
              href="/app/projects"
            >
              Открыть проекты
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
