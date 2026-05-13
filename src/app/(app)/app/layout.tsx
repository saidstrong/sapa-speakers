import { LogoutButton } from "@/components/auth/logout-button";
import { AppShell } from "@/components/layout/app-shell";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { getRoleLabel } from "@/lib/auth/roles";
import { getSidebarItemsForRole } from "@/lib/auth/sidebar";

export default async function VolunteerAppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await requireCurrentUser();
  const sidebarItems = getSidebarItemsForRole(currentUser.role, "app");
  const userLabel =
    currentUser.profile?.full_name || currentUser.user.email || "Пользователь";

  return (
    <AppShell
      action={<LogoutButton />}
      roleLabel={getRoleLabel(currentUser.role)}
      sidebarItems={sidebarItems}
      sidebarTitle="Личный кабинет"
      userLabel={userLabel}
    >
      {children}
    </AppShell>
  );
}
