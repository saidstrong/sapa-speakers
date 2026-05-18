import Link from "next/link";
import { VolunteerApplicationForm } from "@/components/app/volunteer-application-form";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { submitAuthenticatedVolunteerApplication } from "./actions";

type AppJoinPageProps = {
  searchParams?: Promise<{
    message?: string;
    status?: string;
  }>;
};

async function hasActiveVolunteerRow(profileId: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("volunteers")
      .select("id")
      .eq("profile_id", profileId)
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      console.error("Active volunteer lookup failed", error);
      return false;
    }

    return Boolean(data);
  } catch (error) {
    console.error("Active volunteer lookup failed", error);
    return false;
  }
}

export default async function AppJoinPage({ searchParams }: AppJoinPageProps) {
  const currentUser = await requireCurrentUser();
  const params = await searchParams;
  const profileId = currentUser.profile?.id ?? currentUser.user.id;
  const isActiveVolunteer = currentUser.isAdmin
    ? false
    : await hasActiveVolunteerRow(profileId);
  const fullNameFromMetadata =
    typeof currentUser.user.user_metadata.full_name === "string"
      ? currentUser.user.user_metadata.full_name
      : undefined;

  if (currentUser.isAdmin) {
    return (
      <>
        <PageHeader
          title="Заявка волонтёра"
          description="Подача волонтёрской заявки доступна участникам без активного волонтёрского профиля."
        />
        <EmptyState
          title="Заявки волонтёров"
          description="Вы вошли как администратор. Управление заявками доступно в админ-панели."
          action={
            <>
              <Link
                className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
                href="/admin"
              >
                Открыть админ-панель
              </Link>
              <Link
                className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
                href="/app"
              >
                Личный кабинет
              </Link>
            </>
          }
        />
      </>
    );
  }

  if (isActiveVolunteer) {
    return (
      <>
        <PageHeader
          title="Заявка волонтёра"
          description="Ваш волонтёрский профиль уже активен."
        />
        <EmptyState
          title="Заявка не требуется"
          description="Вы уже являетесь волонтёром SapaSpeakers."
          action={
            <Link
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
              href="/app"
            >
              Перейти в личный кабинет
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Заявка волонтёра"
        description="Заполните анкету из личного кабинета. После рассмотрения команда подтвердит волонтёрский профиль или свяжется с вами по указанным контактам."
      />
      <VolunteerApplicationForm
        action={submitAuthenticatedVolunteerApplication}
        defaultValues={{
          email: currentUser.profile?.email ?? currentUser.user.email ?? "",
          full_name: currentUser.profile?.full_name ?? fullNameFromMetadata,
          phone: currentUser.profile?.phone ?? undefined,
          telegram: currentUser.profile?.telegram ?? undefined
        }}
        result={params}
      />
    </>
  );
}
