import { AppShell } from "@/components/layout/app-shell";
import { getSidebarItemsForRoles } from "@/lib/auth/sidebar";

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarItems = getSidebarItemsForRoles(["founder_ceo"], "admin");

  return (
    <AppShell
      sidebarItems={sidebarItems}
      sidebarTitle="Панель управления"
      userLabel="Демо-пользователь: Founder/CEO"
    >
      {children}
    </AppShell>
  );
}
