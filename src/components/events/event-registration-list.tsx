import { EventAttendanceControls } from "@/components/events/event-attendance-controls";
import type { EventAttendance } from "@/lib/queries/event-attendance";
import type { AdminEventRegistration } from "@/lib/queries/event-registrations";

type EventRegistrationListProps = {
  attendanceAction: (formData: FormData) => Promise<void>;
  attendanceRecords: readonly EventAttendance[];
  registrations: readonly AdminEventRegistration[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function EventRegistrationList({
  attendanceAction,
  attendanceRecords,
  registrations
}: EventRegistrationListProps) {
  if (registrations.length === 0) {
    return (
      <p className="text-sm leading-6 text-muted">
        Пока нет участников. Когда активные волонтёры запишутся на проект, они появятся
        здесь. Посещаемость можно отмечать только для активных записей.
      </p>
    );
  }

  const attendanceByVolunteerId = new Map(
    attendanceRecords.map((attendance) => [attendance.volunteer_id, attendance])
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[860px] divide-y divide-oxford/10 text-sm">
        <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
          <tr>
            <th className="px-4 py-3">ФИО</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Статус записи</th>
            <th className="px-4 py-3">Дата записи</th>
            <th className="px-4 py-3">Посещаемость</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-oxford/10">
          {registrations.map((registration) => {
            const attendance = attendanceByVolunteerId.get(registration.volunteer_id) ?? null;

            return (
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
                <td className="px-4 py-4">
                  <EventAttendanceControls
                    action={attendanceAction}
                    attendance={attendance}
                    registrationId={registration.id}
                    volunteerId={registration.volunteer_id}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
