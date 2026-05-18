import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

const instagramUrl =
  "https://www.instagram.com/sapa.speakers.officials?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

export default function ContactsPage() {
  return (
    <>
      <PageHeader title={RU.pages.contacts.title} description={RU.pages.contacts.description} />
      <div className="grid gap-4 md:grid-cols-2">
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
              Открыть Instagram
            </Link>
          }
        />
        <EmptyState
          title="WhatsApp и Telegram"
          description="WhatsApp и Telegram будут добавлены после согласования команды."
        />
      </div>
    </>
  );
}
