"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarItem } from "@/lib/auth/sidebar";
import { cn } from "@/lib/utils";

type SidebarProps = {
  items: readonly SidebarItem[];
  title: string;
  homeHref?: string;
};

export function Sidebar({ items, title, homeHref = "/app" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-white/10 bg-oxford text-white md:min-h-screen md:w-72 md:border-b-0 md:border-r">
      <div className="p-5">
        <Link href={homeHref} className="block text-xl font-bold">
          SapaSpeakers
        </Link>
        <p className="mt-1 text-xs text-white/60">{title}</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:block md:space-y-1 md:overflow-visible">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/app" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition md:whitespace-normal",
                active
                  ? "bg-orange text-oxford"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
