import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function TeamApplicationPage() {
  return (
    <>
      <PageHeader
        title={RU.pages.teamApplication.title}
        description={RU.pages.teamApplication.description}
        action={
          <Link
            href="/register"
            className="rounded-md bg-orange px-5 py-3 text-sm font-semibold text-oxford"
          >
            {RU.buttons.applyToTeam}
          </Link>
        }
      />
      <EmptyState
        title="Командные роли рассматриваются через волонтёрский профиль"
        description="Сейчас безопасный путь такой: подайте волонтёрскую заявку, создайте аккаунт и дождитесь решения команды. Расширенные командные анкеты и загрузка CV будут добавлены отдельно."
        action={
          <Link
            className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
            href="/join"
          >
            Открыть анкету волонтёра
          </Link>
        }
      />
    </>
  );
}
