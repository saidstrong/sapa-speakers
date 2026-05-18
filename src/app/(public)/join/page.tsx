import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentUser } from "@/lib/auth/current-user";
import { RU } from "@/lib/constants/ru";

export default async function JoinPage() {
  const currentUser = await getCurrentUser();

  if (currentUser.user) {
    redirect("/app/join");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={RU.pages.join.title}
        description="Чтобы стать волонтёром SapaSpeakers, сначала создайте аккаунт или войдите. После входа заявка заполняется из личного кабинета."
        action={
          <Link
            className="rounded-md border border-oxford/15 bg-white px-5 py-3 text-sm font-semibold text-oxford transition hover:border-orange"
            href="/projects"
          >
            {RU.buttons.viewProjects}
          </Link>
        }
      />

      <EmptyState
        title="Заявка подаётся после входа"
        description="Мы больше не принимаем волонтёрские заявки без аккаунта. Создайте аккаунт или войдите, затем откройте личный кабинет и заполните анкету волонтёра."
        action={
          <>
            <Link
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
              href="/register"
            >
              Создать аккаунт
            </Link>
            <Link
              className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
              href="/login"
            >
              Войти
            </Link>
          </>
        }
      />

      <section className="rounded-lg border border-vista/30 bg-vista/15 p-5 text-sm leading-6 text-oxford">
        <p className="font-semibold">Что будет дальше</p>
        <p className="mt-2 text-muted">
          После регистрации вы попадёте в личный кабинет. Там можно отправить
          заявку, дождаться решения команды и затем участвовать в проектах после
          подтверждения волонтёрского профиля.
        </p>
      </section>
    </div>
  );
}
