import Link from "next/link";
import { redirect } from "next/navigation";
import { PasswordResetForm } from "@/components/auth/password-reset-form";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requestPasswordReset } from "./actions";

type ForgotPasswordPageProps = {
  searchParams?: Promise<{
    message?: string;
    status?: string;
  }>;
};

export default async function ForgotPasswordPage({
  searchParams
}: ForgotPasswordPageProps) {
  const currentUser = await getCurrentUser();

  if (currentUser.user) {
    redirect("/app/profile");
  }

  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <PageHeader
        title="Восстановление пароля"
        description="Укажите email аккаунта, и мы отправим ссылку для смены пароля."
      />

      {params?.message ? (
        <div
          className={
            params.status === "success"
              ? "mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
              : "mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
          }
        >
          {params.message}
        </div>
      ) : null}

      <PasswordResetForm action={requestPasswordReset} />

      <Link
        className="mt-5 text-center text-sm font-medium text-oxford underline-offset-4 hover:underline"
        href="/login"
      >
        Вернуться ко входу
      </Link>
    </main>
  );
}
