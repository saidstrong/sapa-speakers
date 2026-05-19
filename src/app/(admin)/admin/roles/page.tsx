import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import {
  RoleChangeLogList,
  RoleManagementTable
} from "@/components/roles/role-management-table";
import { roleKeys } from "@/lib/auth/roles";
import { getRoleLabel } from "@/lib/auth/roles";
import { getRoleManagementData } from "@/lib/queries/role-management";
import { updateProfileRole } from "./actions";

type AdminRolesPageProps = {
  searchParams?: Promise<{
    message?: string;
    q?: string;
    role?: string;
    type?: string;
  }>;
};

export default async function AdminRolesPage({
  searchParams
}: AdminRolesPageProps) {
  const params = await searchParams;
  const data = await getRoleManagementData({
    q: params?.q,
    role: params?.role
  });
  const actorProfileId = data.currentUser.profile?.id ?? data.currentUser.user.id;

  return (
    <>
      <PageHeader
        title="Роли и доступ"
        description="Защищённое управление ролями пользователей. Изменения проходят через серверную проверку и записываются в историю."
      />

      {params?.message ? (
        <div
          className={
            params.type === "success"
              ? "mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800"
              : "mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
          }
        >
          {params.message}
        </div>
      ) : null}

      {!data.isRoleManager ? (
        <EmptyState
          title="Доступ только для Founder/CEO и CTO"
          description="Эта страница доступна администраторам для прозрачности, но изменять роли могут только доверенные верхнеуровневые роли. Обратитесь к Founder/CEO или CTO."
        />
      ) : (
        <div className="grid gap-8">
          <form
            action="/admin/roles"
            className="grid gap-4 rounded-lg border border-oxford/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_auto] md:items-end"
          >
            <label className="block text-sm font-semibold text-oxford">
              Поиск
              <input
                className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm"
                defaultValue={data.filters.q}
                maxLength={120}
                name="q"
                placeholder="Email или ФИО"
                type="search"
              />
            </label>
            <label className="block text-sm font-semibold text-oxford">
              Роль
              <select
                className="mt-2 w-full rounded-md border border-oxford/15 bg-white px-3 py-2 text-sm"
                defaultValue={data.filters.role}
                name="role"
              >
                <option value="all">Все роли</option>
                {roleKeys.map((role) => (
                  <option key={role} value={role}>
                    {getRoleLabel(role)}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
              type="submit"
            >
              Применить
            </button>
          </form>

          <section className="grid gap-4">
            <div>
              <h2 className="text-lg font-semibold text-oxford">Профили</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                Нельзя изменить собственную роль. CTO не может назначать Founder/CEO
                или изменять текущий Founder/CEO аккаунт.
              </p>
            </div>
            <RoleManagementTable
              action={updateProfileRole}
              actorProfileId={actorProfileId}
              actorRole={data.currentUser.role}
              profiles={data.profiles}
            />
          </section>

          <section className="grid gap-4">
            <div>
              <h2 className="text-lg font-semibold text-oxford">
                Последние изменения ролей
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                История показывает изменения, сделанные через защищённую форму.
              </p>
            </div>
            <RoleChangeLogList logs={data.recentLogs} />
          </section>
        </div>
      )}
    </>
  );
}
