import type { AdminEventRegistration } from "@/lib/queries/event-registrations";

type EventRegistrationListProps = {
  registrations: readonly AdminEventRegistration[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function EventRegistrationList({ registrations }: EventRegistrationListProps) {
  if (registrations.length === 0) {
    return (
      <p className="text-sm leading-6 text-muted">
        Пока нет участников. Когда активные волонтёры запишутся на проект, они появятся
        здесь.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-oxford/10 text-sm">
        <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
          <tr>
            <th className="px-4 py-3">ФИО</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Статус записи</th>
            <th className="px-4 py-3">Дата записи</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-oxford/10">
          {registrations.map((registration) => (
            <tr key={registration.id} className="align-top">
              <td className="px-4 py-4 font-semibold text-oxford">
                {registration.profile?.full_name ?? "Без имени"}
              </td>
              <td className="px-4 py-4 text-muted">
                {registration.profile?.email ?? "Не указан"}
              </td>
              <td className="px-4 py-4 text-muted">Записан</td>
              <td className="px-4 py-4 text-muted">
                {formatDate(registration.registered_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
