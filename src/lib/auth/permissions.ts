import type { RoleKey } from "@/lib/auth/roles";

export const permissionKeys = [
  "view_app",
  "view_admin",
  "manage_roles",
  "view_audit_logs",
  "manage_system_settings",
  "view_all_volunteers",
  "view_basic_volunteers",
  "manage_volunteers",
  "create_project",
  "publish_project",
  "submit_project_for_moderation",
  "moderate_projects",
  "manage_all_projects",
  "manage_own_projects",
  "view_project_applications",
  "review_project_applications",
  "mark_attendance",
  "upload_certificates",
  "confirm_certificates",
  "manage_achievements",
  "view_team_applications",
  "review_team_applications_hr",
  "decide_team_applications",
  "create_announcements",
  "publish_announcements",
  "create_announcement_drafts",
  "manage_media",
  "manage_partners",
  "manage_documents",
  "view_stats",
  "manage_logistics",
  "apply_to_projects",
  "apply_to_team",
  "view_own_certificates",
  "view_own_achievements",
  "edit_own_profile"
] as const;

export type PermissionKey = (typeof permissionKeys)[number];

const volunteerPermissions = [
  "view_app",
  "apply_to_projects",
  "apply_to_team",
  "view_own_certificates",
  "view_own_achievements",
  "edit_own_profile"
] as const satisfies readonly PermissionKey[];

const coordinatorPermissions = [
  ...volunteerPermissions,
  "view_admin",
  "create_project",
  "submit_project_for_moderation",
  "manage_own_projects",
  "view_project_applications",
  "review_project_applications",
  "mark_attendance",
  "upload_certificates",
  "manage_achievements",
  "create_announcement_drafts"
] as const satisfies readonly PermissionKey[];

const leadershipPermissions = [
  ...coordinatorPermissions,
  "manage_roles",
  "view_audit_logs",
  "manage_system_settings",
  "view_all_volunteers",
  "manage_volunteers",
  "publish_project",
  "moderate_projects",
  "manage_all_projects",
  "confirm_certificates",
  "view_team_applications",
  "review_team_applications_hr",
  "decide_team_applications",
  "create_announcements",
  "publish_announcements",
  "manage_media",
  "manage_partners",
  "manage_documents",
  "view_stats",
  "manage_logistics"
] as const satisfies readonly PermissionKey[];

export const rolePermissions: Record<RoleKey, readonly PermissionKey[]> = {
  founder_ceo: leadershipPermissions,
  cto: leadershipPermissions,
  operations_manager: [
    ...coordinatorPermissions,
    "view_all_volunteers",
    "manage_volunteers",
    "publish_project",
    "moderate_projects",
    "manage_all_projects",
    "confirm_certificates",
    "create_announcements",
    "publish_announcements",
    "manage_documents",
    "view_stats"
  ],
  hr_manager: [
    ...volunteerPermissions,
    "view_admin",
    "view_all_volunteers",
    "view_team_applications",
    "review_team_applications_hr",
    "create_announcement_drafts"
  ],
  volunteer_teamlead: coordinatorPermissions,
  training_manager: coordinatorPermissions,
  language_coordinator: coordinatorPermissions,
  eco_coordinator: coordinatorPermissions,
  logistics_manager: [
    ...volunteerPermissions,
    "view_admin",
    "manage_own_projects",
    "manage_logistics",
    "manage_documents"
  ],
  pr_smm_manager: [
    ...volunteerPermissions,
    "view_admin",
    "create_announcements",
    "publish_announcements",
    "manage_media"
  ],
  partnership_manager: [
    ...volunteerPermissions,
    "view_admin",
    "manage_partners",
    "view_stats"
  ],
  mun_coordinator: coordinatorPermissions,
  secretary: [
    ...volunteerPermissions,
    "view_admin",
    "create_announcement_drafts",
    "manage_documents"
  ],
  volunteer: volunteerPermissions
};

export function getPermissionsForRoles(roles: readonly RoleKey[]) {
  return new Set(roles.flatMap((role) => rolePermissions[role]));
}

export function hasPermission(roles: readonly RoleKey[], permission: PermissionKey) {
  return getPermissionsForRoles(roles).has(permission);
}

export function hasAdminAccess(roles: readonly RoleKey[]) {
  return hasPermission(roles, "view_admin");
}
