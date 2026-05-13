import type { SidebarItem } from "@/lib/auth/sidebar";
import { Sidebar } from "@/components/layout/sidebar";

type AppShellProps = {
  children: React.ReactNode;
  sidebarItems: readonly SidebarItem[];
  sidebarTitle: string;
  userLabel: string;
  homeHref?: string;
  roleLabel?: string;
  action?: React.ReactNode;
};

export function AppShell({
  children,
  sidebarItems,
  sidebarTitle,
  userLabel,
  homeHref,
  roleLabel,
  action
}: AppShellProps) {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar items={sidebarItems} title={sidebarTitle} homeHref={homeHref} />
      <div className="min-w-0 flex-1">
        <div className="border-b border-oxford/10 bg-white px-5 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-oxford">{userLabel}</p>
              {roleLabel ? (
                <p className="mt-1 text-xs font-medium text-muted">{roleLabel}</p>
              ) : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>
        </div>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      </div>
    </div>
  );
}
