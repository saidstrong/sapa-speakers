import type { PermissionKey } from "@/lib/auth/permissions";
import { getPermissionsForRoles } from "@/lib/auth/permissions";
import type { RoleKey } from "@/lib/auth/roles";

export type SidebarZone = "app" | "admin";

export type SidebarItem = {
  title: string;
  href: string;
  zone: SidebarZone;
  permissions: readonly PermissionKey[];
};

export const sidebarItems = [
  {
    title: "Личный кабинет",
    href: "/app",
    zone: "app",
    permissions: ["view_app"]
  },
  {
    title: "Объявления",
    href: "/app/announcements",
    zone: "app",
    permissions: ["view_app"]
  },
  {
    title: "Проекты",
    href: "/app/projects",
    zone: "app",
    permissions: ["view_app"]
  },
  {
    title: "Мои заявки",
    href: "/app/applications",
    zone: "app",
    permissions: ["view_app"]
  },
  {
    title: "Мои достижения",
    href: "/app/achievements",
    zone: "app",
    permissions: ["view_own_achievements"]
  },
  {
    title: "Сертификаты",
    href: "/app/certificates",
    zone: "app",
    permissions: ["view_own_certificates"]
  },
  {
    title: "Профиль",
    href: "/app/profile",
    zone: "app",
    permissions: ["edit_own_profile"]
  },
  {
    title: "Волонтёры",
    href: "/admin/volunteers",
    zone: "admin",
    permissions: ["view_all_volunteers", "view_basic_volunteers"]
  },
  {
    title: "Заявки в команду",
    href: "/admin/team-applications",
    zone: "admin",
    permissions: ["view_team_applications"]
  },
  {
    title: "Заявки на проекты",
    href: "/admin/project-applications",
    zone: "admin",
    permissions: ["view_project_applications"]
  },
  {
    title: "События и проекты",
    href: "/admin/events",
    zone: "admin",
    permissions: ["view_admin"]
  },
  {
    title: "Объявления",
    href: "/admin/announcements",
    zone: "admin",
    permissions: ["view_admin"]
  },
  {
    title: "Проекты",
    href: "/admin/projects",
    zone: "admin",
    permissions: ["create_project", "manage_all_projects", "manage_own_projects"]
  },
  {
    title: "Проекты на модерации",
    href: "/admin/moderation",
    zone: "admin",
    permissions: ["moderate_projects"]
  },
  {
    title: "Посещаемость",
    href: "/admin/attendance",
    zone: "admin",
    permissions: ["mark_attendance"]
  },
  {
    title: "Сертификаты",
    href: "/admin/certificates",
    zone: "admin",
    permissions: ["upload_certificates", "confirm_certificates"]
  },
  {
    title: "Достижения",
    href: "/admin/badges",
    zone: "admin",
    permissions: ["manage_achievements"]
  },
  {
    title: "Роли и доступ",
    href: "/admin/roles",
    zone: "admin",
    permissions: ["manage_roles"]
  },
  {
    title: "Статистика",
    href: "/admin/stats",
    zone: "admin",
    permissions: ["view_stats"]
  },
  {
    title: "Документы",
    href: "/admin/documents",
    zone: "admin",
    permissions: ["manage_documents"]
  },
  {
    title: "Партнёры",
    href: "/admin/partners",
    zone: "admin",
    permissions: ["manage_partners"]
  },
  {
    title: "Настройки",
    href: "/admin/settings",
    zone: "admin",
    permissions: ["manage_system_settings"]
  },
  {
    title: "Журнал действий",
    href: "/admin/audit-logs",
    zone: "admin",
    permissions: ["view_audit_logs"]
  }
] as const satisfies readonly SidebarItem[];

export function canAccessSidebarItem(
  roleKeys: readonly RoleKey[],
  item: SidebarItem
) {
  const permissions = getPermissionsForRoles(roleKeys);
  return item.permissions.some((permission) => permissions.has(permission));
}

export function getSidebarItemsForRoles(
  roleKeys: readonly RoleKey[],
  zone: SidebarZone
) {
  return sidebarItems.filter(
    (item) => item.zone === zone && canAccessSidebarItem(roleKeys, item)
  );
}

export function getSidebarItemsForRole(role: RoleKey, zone: SidebarZone) {
  return getSidebarItemsForRoles([role], zone);
}
