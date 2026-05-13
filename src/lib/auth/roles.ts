import { RU } from "@/lib/constants/ru";

export const roleKeys = [
  "founder_ceo",
  "cto",
  "operations_manager",
  "hr_manager",
  "volunteer_teamlead",
  "training_manager",
  "language_coordinator",
  "eco_coordinator",
  "logistics_manager",
  "pr_smm_manager",
  "partnership_manager",
  "mun_coordinator",
  "secretary",
  "volunteer"
] as const;

export type RoleKey = (typeof roleKeys)[number];

export type RoleDefinition = {
  key: RoleKey;
  label: string;
  protected: boolean;
};

export const protectedRoleKeys = ["founder_ceo", "cto"] as const satisfies readonly RoleKey[];

export const roles: Record<RoleKey, RoleDefinition> = {
  founder_ceo: {
    key: "founder_ceo",
    label: RU.roles.founder_ceo,
    protected: true
  },
  cto: {
    key: "cto",
    label: RU.roles.cto,
    protected: true
  },
  operations_manager: {
    key: "operations_manager",
    label: RU.roles.operations_manager,
    protected: false
  },
  hr_manager: {
    key: "hr_manager",
    label: RU.roles.hr_manager,
    protected: false
  },
  volunteer_teamlead: {
    key: "volunteer_teamlead",
    label: RU.roles.volunteer_teamlead,
    protected: false
  },
  training_manager: {
    key: "training_manager",
    label: RU.roles.training_manager,
    protected: false
  },
  language_coordinator: {
    key: "language_coordinator",
    label: RU.roles.language_coordinator,
    protected: false
  },
  eco_coordinator: {
    key: "eco_coordinator",
    label: RU.roles.eco_coordinator,
    protected: false
  },
  logistics_manager: {
    key: "logistics_manager",
    label: RU.roles.logistics_manager,
    protected: false
  },
  pr_smm_manager: {
    key: "pr_smm_manager",
    label: RU.roles.pr_smm_manager,
    protected: false
  },
  partnership_manager: {
    key: "partnership_manager",
    label: RU.roles.partnership_manager,
    protected: false
  },
  mun_coordinator: {
    key: "mun_coordinator",
    label: RU.roles.mun_coordinator,
    protected: false
  },
  secretary: {
    key: "secretary",
    label: RU.roles.secretary,
    protected: false
  },
  volunteer: {
    key: "volunteer",
    label: RU.roles.volunteer,
    protected: false
  }
};

export function getRoleLabel(role: RoleKey) {
  return roles[role].label;
}

export function isProtectedRole(role: RoleKey) {
  return roles[role].protected;
}
