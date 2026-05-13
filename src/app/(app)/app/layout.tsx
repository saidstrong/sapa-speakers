import { AppShell } from "@/components/layout/app-shell";
import { getSidebarItemsForRoles } from "@/lib/auth/sidebar";

export default function VolunteerAppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarItems = getSidebarItemsForRoles(["volunteer"], "app");

  return (
    <AppShell
      sidebarItems={sidebarItems}
      sidebarTitle="Личный кабинет"
      userLabel="Демо-пользователь: Волонтёр"
    >
      {children}
    </AppShell>
  );
}
