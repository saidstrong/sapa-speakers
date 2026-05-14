import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentUser } from "@/lib/auth/current-user";
import { RU } from "@/lib/constants/ru";
import { login } from "./actions";

const inputClassName =
  "mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/20";

type LoginPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const currentUser = await getCurrentUser();

  if (currentUser.user) {
    redirect("/app");
  }

  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <PageHeader title={RU.pages.login.title} description={RU.pages.login.description} />
      {params?.status === "error" ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {params.message ?? "Не удалось войти. Попробуйте ещё раз."}
        </div>
      ) : null}
      <form action={login} className="space-y-5 rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
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
          Пароль
          <input
            className={inputClassName}
            name="password"
            placeholder="Введите пароль"
            required
            type="password"
          />
        </label>
        <button
          className="w-full rounded-md bg-orange px-4 py-2 font-semibold text-oxford transition hover:bg-orange/90"
          type="submit"
        >
          {RU.buttons.login}
        </button>
        <Link
          className="block text-center text-sm font-medium text-oxford underline-offset-4 hover:underline"
          href="/register"
        >
          {RU.buttons.register}
        </Link>
      </form>
    </main>
  );
}
