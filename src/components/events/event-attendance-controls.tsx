import { AttendanceStatusBadge } from "@/components/events/attendance-status-badge";
import type { EventAttendance } from "@/lib/queries/event-attendance";

type EventAttendanceControlsProps = {
  action: (formData: FormData) => Promise<void>;
  attendance: EventAttendance | null;
  registrationId: string;
  volunteerId: string;
};

export function EventAttendanceControls({
  action,
  attendance,
  registrationId,
  volunteerId
}: EventAttendanceControlsProps) {
  return (
    <form action={action} className="grid min-w-72 gap-3">
      <input name="volunteer_id" type="hidden" value={volunteerId} />
      <input name="registration_id" type="hidden" value={registrationId} />

      <div className="flex flex-wrap items-center gap-2">
        <AttendanceStatusBadge status={attendance?.status ?? null} />
        {attendance?.marked_at ? (
          <span className="text-xs text-muted">
            Обновлено:{" "}
            {new Intl.DateTimeFormat("ru-RU", {
              dateStyle: "medium",
              timeStyle: "short"
            }).format(new Date(attendance.marked_at))}
          </span>
        ) : null}
      </div>

      <textarea
        className="min-h-16 rounded-md border border-oxford/15 px-3 py-2 text-sm text-oxford outline-none focus:border-orange"
        defaultValue={attendance?.notes ?? ""}
        maxLength={1000}
        name="notes"
        placeholder="Комментарий, если нужен"
      />

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-md bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200"
          name="status"
          type="submit"
          value="attended"
        >
          Был
        </button>
        <button
          className="rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-800 ring-1 ring-red-200"
          name="status"
          type="submit"
          value="absent"
        >
          Не был
        </button>
        <button
          className="rounded-md bg-orange/10 px-3 py-2 text-xs font-semibold text-oxford ring-1 ring-orange/25"
          name="status"
          type="submit"
          value="excused"
        >
          Уважительная причина
        </button>
      </div>
    </form>
  );
}
