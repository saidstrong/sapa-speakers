import { RoleChangeForm } from "@/components/roles/role-change-form";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { VolunteerStatusBadge } from "@/components/volunteers/volunteer-status-badge";
import { getRoleLabel, type RoleKey } from "@/lib/auth/roles";
import type {
  RoleChangeLog,
  RoleManagementProfile
} from "@/lib/queries/role-management";
import {
  volunteerStatuses,
  type VolunteerStatus
} from "@/lib/queries/volunteers";

type RoleManagementTableProps = {
  action: (formData: FormData) => Promise<void>;
  actorProfileId: string;
  actorRole: RoleKey;
  profiles: readonly RoleManagementProfile[];
};

type RoleChangeLogListProps = {
  logs: readonly RoleChangeLog[];
};

function formatDate(value: string | null) {
  if (!value) {
    return "Не указано";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function isVolunteerStatus(value: string | null): value is VolunteerStatus {
  return Boolean(value && volunteerStatuses.includes(value as VolunteerStatus));
}

function displayProfile(name: string | null, email: string | null) {
  return name || email || "Профиль удалён";
}

export function RoleManagementTable({
  action,
  actorProfileId,
  actorRole,
  profiles
}: RoleManagementTableProps) {
  if (profiles.length === 0) {
    return (
      <EmptyState
        title="Профили не найдены"
        description="Измените поиск или фильтр роли, чтобы увидеть профили."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-oxford/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1080px] divide-y divide-oxford/10 text-sm">
          <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Пользователь</th>
              <th className="px-4 py-3">Текущая роль</th>
              <th className="px-4 py-3">Волонтёрский статус</th>
              <th className="px-4 py-3">Дата регистрации</th>
              <th className="px-4 py-3">Изменение роли</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oxford/10">
            {profiles.map((profile) => (
              <tr key={profile.id} className="align-top">
                <td className="px-4 py-4">
                  <div className="font-semibold text-oxford">
                    {profile.full_name ?? "Имя не указано"}
                  </div>
                  <div className="mt-1 text-muted">{profile.email}</div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge tone={profile.role === "volunteer" ? "neutral" : "info"}>
                    {getRoleLabel(profile.role)}
                  </StatusBadge>
                </td>
                <td className="px-4 py-4">
                  {isVolunteerStatus(profile.volunteerStatus) ? (
                    <VolunteerStatusBadge status={profile.volunteerStatus} />
                  ) : (
                    <span className="text-muted">Нет карточки</span>
                  )}
                </td>
                <td className="px-4 py-4 text-muted">
                  {formatDate(profile.created_at)}
                </td>
                <td className="px-4 py-4">
                  <RoleChangeForm
                    action={action}
                    actorProfileId={actorProfileId}
                    actorRole={actorRole}
                    targetProfileId={profile.id}
                    targetRole={profile.role}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RoleChangeLogList({ logs }: RoleChangeLogListProps) {
  if (logs.length === 0) {
    return (
      <EmptyState
        title="История изменений пуста"
        description="Записи появятся после первого изменения роли через защищённую форму."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-oxford/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] divide-y divide-oxford/10 text-sm">
          <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Дата</th>
              <th className="px-4 py-3">Кто изменил</th>
              <th className="px-4 py-3">Профиль</th>
              <th className="px-4 py-3">Роль</th>
              <th className="px-4 py-3">Причина</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oxford/10">
            {logs.map((log) => (
              <tr key={log.id} className="align-top">
                <td className="px-4 py-4 text-muted">{formatDate(log.created_at)}</td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-oxford">
                    {displayProfile(log.actorName, log.actorEmail)}
                  </div>
                  {log.actorEmail ? (
                    <div className="mt-1 text-muted">{log.actorEmail}</div>
                  ) : null}
                </td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-oxford">
                    {displayProfile(log.targetName, log.targetEmail)}
                  </div>
                  {log.targetEmail ? (
                    <div className="mt-1 text-muted">{log.targetEmail}</div>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-muted">
                  {getRoleLabel(log.old_role)} → {getRoleLabel(log.new_role)}
                </td>
                <td className="max-w-md px-4 py-4 text-muted">
                  {log.reason ?? "Не указана"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
