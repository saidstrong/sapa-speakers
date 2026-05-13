import type { SidebarItem } from "@/lib/auth/sidebar";
import { Sidebar } from "@/components/layout/sidebar";

type AppShellProps = {
  children: React.ReactNode;
  sidebarItems: readonly SidebarItem[];
  sidebarTitle: string;
  userLabel: string;
};

export function AppShell({
  children,
  sidebarItems,
  sidebarTitle,
  userLabel
}: AppShellProps) {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar items={sidebarItems} title={sidebarTitle} />
      <div className="min-w-0 flex-1">
        <div className="border-b border-oxford/10 bg-white px-5 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <p className="text-sm font-medium text-oxford">{userLabel}</p>
            <span className="rounded-full bg-amande px-3 py-1 text-xs font-semibold text-oxford">
              Phase 0
            </span>
          </div>
        </div>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      </div>
    </div>
  );
}
