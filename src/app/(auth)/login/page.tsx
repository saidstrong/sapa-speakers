import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <PageHeader title={RU.pages.login.title} description={RU.pages.login.description} />
      <form className="space-y-4 rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
        <label className="block text-sm font-semibold text-oxford">
          Email
          <input
            className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2"
            type="email"
            placeholder="name@example.com"
          />
        </label>
        <label className="block text-sm font-semibold text-oxford">
          Пароль
          <input
            className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2"
            type="password"
            placeholder="Введите пароль"
          />
        </label>
        <button
          className="w-full rounded-md bg-orange px-4 py-2 font-semibold text-oxford"
          type="button"
        >
          {RU.buttons.login}
        </button>
        <Link className="block text-center text-sm font-medium text-oxford" href="/register">
          {RU.buttons.register}
        </Link>
      </form>
    </main>
  );
}
