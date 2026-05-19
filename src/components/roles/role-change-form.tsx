import {
  canManageTargetRole,
  getAssignableRoleKeys,
  getRoleLabel,
  type RoleKey
} from "@/lib/auth/roles";

type RoleChangeFormProps = {
  action: (formData: FormData) => Promise<void>;
  actorProfileId: string;
  actorRole: RoleKey;
  targetProfileId: string;
  targetRole: RoleKey;
};

export function RoleChangeForm({
  action,
  actorProfileId,
  actorRole,
  targetProfileId,
  targetRole
}: RoleChangeFormProps) {
  const canManageTarget = canManageTargetRole({
    actorProfileId,
    actorRole,
    targetProfileId,
    targetRole
  });
  const assignableRoles = getAssignableRoleKeys(actorRole);

  if (!canManageTarget) {
    return (
      <p className="max-w-xs text-sm leading-6 text-muted">
        {actorProfileId === targetProfileId
          ? "Нельзя изменить собственную роль."
          : "Эта роль защищена для вашего уровня доступа."}
      </p>
    );
  }

  return (
    <form action={action} className="grid min-w-72 gap-3">
      <input name="target_profile_id" type="hidden" value={targetProfileId} />
      <label className="block text-xs font-semibold uppercase text-muted">
        Новая роль
        <select
          className="mt-2 w-full rounded-md border border-oxford/15 bg-white px-3 py-2 text-sm font-normal text-oxford"
          defaultValue={targetRole}
          name="new_role"
          required
        >
          {assignableRoles.map((role) => (
            <option key={role} value={role}>
              {getRoleLabel(role)}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs font-semibold uppercase text-muted">
        Причина
        <textarea
          className="mt-2 min-h-20 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm font-normal text-oxford"
          maxLength={1000}
          name="reason"
          placeholder="Кратко укажите основание изменения"
        />
      </label>
      <button
        className="rounded-md bg-orange px-3 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
        type="submit"
      >
        Сохранить роль
      </button>
    </form>
  );
}
