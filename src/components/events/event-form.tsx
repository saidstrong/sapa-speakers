import Link from "next/link";
import { eventStatusLabels } from "@/components/events/event-status-badge";
import type { EventRecord } from "@/lib/queries/events";
import { eventStatuses } from "@/lib/validations/event";

type EventFormAction = (formData: FormData) => void | Promise<void>;

type EventFormProps = {
  action: EventFormAction;
  cancelHref: string;
  event?: EventRecord;
  submitLabel: string;
};

function formatDateTimeLocal(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

export function EventForm({ action, cancelHref, event, submitLabel }: EventFormProps) {
  return (
    <form action={action} className="grid gap-5 rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
      <label className="block text-sm font-semibold text-oxford">
        Название
        <input
          className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm"
          defaultValue={event?.title ?? ""}
          maxLength={160}
          name="title"
          required
          type="text"
        />
      </label>

      <label className="block text-sm font-semibold text-oxford">
        Описание
        <textarea
          className="mt-2 min-h-32 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm"
          defaultValue={event?.description ?? ""}
          maxLength={5000}
          name="description"
          placeholder="Цель, формат, задачи команды"
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-semibold text-oxford">
          Локация
          <input
            className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm"
            defaultValue={event?.location ?? ""}
            maxLength={240}
            name="location"
            placeholder="Город, площадка или онлайн"
            type="text"
          />
        </label>

        <label className="block text-sm font-semibold text-oxford">
          Статус
          <select
            className="mt-2 w-full rounded-md border border-oxford/15 bg-white px-3 py-2 text-sm"
            defaultValue={event?.status ?? "draft"}
            name="status"
          >
            {eventStatuses.map((status) => (
              <option key={status} value={status}>
                {eventStatusLabels[status]}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-oxford">
          Начало
          <input
            className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm"
            defaultValue={formatDateTimeLocal(event?.starts_at)}
            name="starts_at"
            required
            type="datetime-local"
          />
        </label>

        <label className="block text-sm font-semibold text-oxford">
          Окончание
          <input
            className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm"
            defaultValue={formatDateTimeLocal(event?.ends_at)}
            name="ends_at"
            type="datetime-local"
          />
        </label>

        <label className="block text-sm font-semibold text-oxford">
          Вместимость
          <input
            className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm"
            defaultValue={event?.capacity?.toString() ?? ""}
            min={1}
            name="capacity"
            placeholder="Например, 30"
            type="number"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
          type="submit"
        >
          {submitLabel}
        </button>
        <Link
          className="rounded-md border border-oxford/15 bg-white px-4 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
          href={cancelHref}
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
