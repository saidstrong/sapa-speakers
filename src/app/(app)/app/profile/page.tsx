import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Профиль" description="Данные волонтёра для участия в проектах." />
      <EmptyState
        title="Форма профиля"
        description={`${RU.messages.phaseZero} Поля профиля будут подключены после реализации auth/profile.`}
      />
    </>
  );
}
