import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

const fields = ["Имя", "Фамилия", "Email", "Телефон", "Пароль", "Повторите пароль"];

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-5 py-10">
      <PageHeader title={RU.pages.register.title} description={RU.pages.register.description} />
      <form className="grid gap-4 rounded-lg border border-oxford/10 bg-white p-6 shadow-sm md:grid-cols-2">
        {fields.map((field) => (
          <label key={field} className="block text-sm font-semibold text-oxford">
            {field}
            <input
              className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2"
              type={field.includes("Пароль") ? "password" : field === "Email" ? "email" : "text"}
              placeholder={field}
            />
          </label>
        ))}
        <button
          className="rounded-md bg-orange px-4 py-2 font-semibold text-oxford md:col-span-2"
          type="button"
        >
          {RU.buttons.register}
        </button>
        <Link className="text-sm font-medium text-oxford md:col-span-2" href="/login">
          Уже есть аккаунт? Войти
        </Link>
      </form>
    </main>
  );
}
