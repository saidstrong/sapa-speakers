import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function ContactsPage() {
  return (
    <>
      <PageHeader title={RU.pages.contacts.title} description={RU.pages.contacts.description} />
      <div className="grid gap-4 md:grid-cols-3">
        <EmptyState
          title="Instagram"
          description="Официальный аккаунт будет указан здесь после подтверждения канала коммуникации."
        />
        <EmptyState
          title="Telegram"
          description="Для быстрых объявлений и связи команда добавит официальный канал после запуска."
        />
        <EmptyState
          title="WhatsApp"
          description="Рабочий номер появится после утверждения ответственного контакта команды."
        />
      </div>
    </>
  );
}
