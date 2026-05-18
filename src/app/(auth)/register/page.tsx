import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import {
  getCurrentUser,
  getWorkspacePathForCurrentUser
} from "@/lib/auth/current-user";
import { RU } from "@/lib/constants/ru";
import { register } from "./actions";

const inputClassName =
  "mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/20";

type RegisterPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const currentUser = await getCurrentUser();

  if (currentUser.user) {
    redirect(getWorkspacePathForCurrentUser(currentUser));
  }

  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-5 py-10">
      <PageHeader title={RU.pages.register.title} description={RU.pages.register.description} />
      <section className="mb-4 rounded-lg border border-vista/40 bg-vista/15 p-4 text-sm leading-6 text-oxford">
        Аккаунт — первый шаг. После входа откройте личный кабинет и отправьте
        заявку волонтёра.{" "}
        <Link
          className="font-semibold underline decoration-orange/60 underline-offset-4 hover:text-orange"
          href="/join"
        >
          Подробнее о вступлении
        </Link>
        .
      </section>
      {params?.status ? (
        <div
          className={
            params.status === "success"
              ? "mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
              : "mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
          }
        >
          {params.message ??
            (params.status === "success"
              ? "Регистрация принята."
              : "Не удалось создать аккаунт.")}
        </div>
      ) : null}
      <form action={register} className="grid gap-4 rounded-lg border border-oxford/10 bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="block text-sm font-semibold text-oxford md:col-span-2">
          ФИО
          <input
            className={inputClassName}
            name="full_name"
            placeholder="Имя и фамилия"
            required
            type="text"
          />
        </label>
        <label className="block text-sm font-semibold text-oxford">
          Email
          <input
            className={inputClassName}
            name="email"
            placeholder="name@example.com"
            required
            type="email"
          />
        </label>
        <label className="block text-sm font-semibold text-oxford">
          Телефон
          <input
            className={inputClassName}
            name="phone"
            placeholder="+7..."
            type="tel"
          />
        </label>
        <label className="block text-sm font-semibold text-oxford">
          Пароль
          <input
            className={inputClassName}
            minLength={8}
            name="password"
            placeholder="Минимум 8 символов"
            required
            type="password"
          />
        </label>
        <label className="block text-sm font-semibold text-oxford">
          Повторите пароль
          <input
            className={inputClassName}
            minLength={8}
            name="password_confirm"
            placeholder="Повторите пароль"
            required
            type="password"
          />
        </label>
        <button
          className="rounded-md bg-orange px-4 py-2 font-semibold text-oxford transition hover:bg-orange/90 md:col-span-2"
          type="submit"
        >
          {RU.buttons.register}
        </button>
        <Link
          className="text-sm font-medium text-oxford underline-offset-4 hover:underline md:col-span-2"
          href="/login"
        >
          Уже есть аккаунт? Войти
        </Link>
      </form>
    </main>
  );
}
