import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function ContactsPage() {
  return (
    <>
      <PageHeader title={RU.pages.contacts.title} description={RU.pages.contacts.description} />
      <div className="grid gap-4 md:grid-cols-3">
        <EmptyState title="Instagram" description="Ссылка будет добавлена после уточнения официального аккаунта." />
        <EmptyState title="Telegram" description="Ссылка будет добавлена после уточнения официального канала." />
        <EmptyState title="WhatsApp" description="Контакт будет добавлен после уточнения рабочего номера." />
      </div>
    </>
  );
}
