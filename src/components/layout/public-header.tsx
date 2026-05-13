import Link from "next/link";
import { RU } from "@/lib/constants/ru";

const publicNavItems = [
  { href: "/", label: RU.navigation.home },
  { href: "/about", label: RU.navigation.about },
  { href: "/projects", label: RU.navigation.projects },
  { href: "/join", label: RU.navigation.join },
  { href: "/team-application", label: RU.navigation.teamApplication },
  { href: "/contacts", label: RU.navigation.contacts }
];

export function PublicHeader() {
  return (
    <header className="border-b border-oxford/10 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-xl font-bold text-oxford">
          SapaSpeakers
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-oxford/75">
          {publicNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-oxford">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/register"
          className="inline-flex w-fit items-center justify-center rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
        >
          {RU.buttons.becomeVolunteer}
        </Link>
      </div>
    </header>
  );
}
