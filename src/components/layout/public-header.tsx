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
        <Link
          href="/"
          className="text-xl font-bold text-oxford outline-none focus-visible:ring-2 focus-visible:ring-orange/60 focus-visible:ring-offset-2"
        >
          SapaSpeakers
        </Link>
        <nav className="flex max-w-full items-center gap-x-5 gap-y-2 overflow-x-auto text-sm font-medium text-oxford/75 md:flex-wrap md:overflow-visible">
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap outline-none transition hover:text-oxford focus-visible:ring-2 focus-visible:ring-orange/60 focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/register"
          className="inline-flex w-fit items-center justify-center rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford outline-none transition hover:bg-orange/90 focus-visible:ring-2 focus-visible:ring-orange/60 focus-visible:ring-offset-2"
        >
          {RU.buttons.becomeVolunteer}
        </Link>
      </div>
    </header>
  );
}
