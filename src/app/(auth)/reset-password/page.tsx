import Link from "next/link";
import { redirect } from "next/navigation";
import { PasswordUpdateForm } from "@/components/auth/password-update-form";
import { PageHeader } from "@/components/ui/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resetPassword } from "./actions";

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    code?: string;
    error?: string;
    error_description?: string;
    message?: string;
    type?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams
}: ResetPasswordPageProps) {
  const params = await searchParams;

  if (params?.code) {
    const callbackParams = new URLSearchParams({
      code: params.code,
      next: "/reset-password"
    });

    redirect(`/auth/callback?${callbackParams.toString()}`);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const errorMessage = params?.error
    ? "Ссылка восстановления недействительна или устарела. Запросите новую ссылку."
    : null;
  const resultMessage = params?.message ?? errorMessage;
  const resultType = params?.type ?? (errorMessage ? "error" : undefined);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <PageHeader
        title="Новый пароль"
        description="Задайте новый пароль для аккаунта SapaSpeakers."
      />

      {resultMessage ? (
        <div
          className={
            resultType === "success"
              ? "mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
              : "mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
          }
        >
          {resultMessage}
        </div>
      ) : null}

      {user ? (
        <PasswordUpdateForm
          action={resetPassword}
          helperText="После обновления пароля нужно будет войти заново."
          submitLabel="Обновить пароль"
        />
      ) : (
        <section className="rounded-lg border border-oxford/10 bg-white p-6 text-sm leading-6 text-muted shadow-sm">
          Откройте ссылку восстановления из письма. Если ссылка устарела, запросите
          новую.
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
              href="/forgot-password"
            >
              Запросить ссылку
            </Link>
            <Link
              className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford transition hover:border-orange hover:text-orange"
              href="/login"
            >
              Войти
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
