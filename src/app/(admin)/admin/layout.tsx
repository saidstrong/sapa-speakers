import { LogoutButton } from "@/components/auth/logout-button";
import { AppShell } from "@/components/layout/app-shell";
import { requireAdminUser } from "@/lib/auth/current-user";
import { getRoleLabel } from "@/lib/auth/roles";
import { getSidebarItemsForRole } from "@/lib/auth/sidebar";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await requireAdminUser();
  const sidebarItems = getSidebarItemsForRole(currentUser.role, "admin");
  const userLabel =
    currentUser.profile?.full_name || currentUser.user.email || "Администратор";

  return (
    <AppShell
      action={<LogoutButton />}
      homeHref="/admin"
      roleLabel={getRoleLabel(currentUser.role)}
      sidebarItems={sidebarItems}
      sidebarTitle="Панель управления"
      userLabel={userLabel}
    >
      {children}
    </AppShell>
  );
}
