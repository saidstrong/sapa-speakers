import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

const instagramUrl =
  "https://www.instagram.com/sapa.speakers.officials";
const telegramUrl = "https://t.me/adyb_0";
const whatsappUrl = "https://wa.me/77053521791";

export default function ContactsPage() {
  return (
    <>
      <PageHeader title={RU.pages.contacts.title} description={RU.pages.contacts.description} />
      <div className="grid gap-4 lg:grid-cols-3">
        <EmptyState
          title="Instagram"
          description="Официальные новости, проекты и объявления SapaSpeakers публикуются в Instagram."
          action={
            <Link
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
              href={instagramUrl}
              rel="noreferrer"
              target="_blank"
            >
              @sapa.speakers.officials
            </Link>
          }
        />
        <EmptyState
          title="Telegram"
          description="Для организационных вопросов и связи с командой используйте официальный Telegram-контакт."
          action={
            <Link
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
              href={telegramUrl}
              rel="noreferrer"
              target="_blank"
            >
              @adyb_0
            </Link>
          }
        />
        <EmptyState
          title="WhatsApp"
          description="Для быстрых уточнений по участию и заявкам доступен официальный WhatsApp-контакт."
          action={
            <Link
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
              href={whatsappUrl}
              rel="noreferrer"
              target="_blank"
            >
              +7 705 352 17 91
            </Link>
          }
        />
      </div>
    </>
  );
}
