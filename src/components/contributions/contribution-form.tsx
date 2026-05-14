import type { VolunteerContribution } from "@/lib/queries/contributions";

type ContributionFormProps = {
  action: (formData: FormData) => Promise<void>;
  attendanceId: string;
  contribution: VolunteerContribution | null;
};

function formatHours(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(value);
}

export function ContributionForm({
  action,
  attendanceId,
  contribution
}: ContributionFormProps) {
  return (
    <form action={action} className="grid min-w-56 gap-2">
      <input name="attendance_id" type="hidden" value={attendanceId} />

      {contribution ? (
        <p className="text-xs font-semibold text-oxford">
          Сейчас: {formatHours(contribution.hours)} ч.
        </p>
      ) : (
        <p className="text-xs text-muted">Часы ещё не подтверждены.</p>
      )}

      <label className="text-xs font-semibold text-oxford">
        Часы
        <input
          className="mt-1 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm font-normal text-oxford"
          defaultValue={contribution?.hours ?? ""}
          max={24}
          min={0.25}
          name="hours"
          placeholder="Например, 2"
          step={0.25}
          type="number"
        />
      </label>

      <label className="text-xs font-semibold text-oxford">
        Описание
        <textarea
          className="mt-1 min-h-14 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm font-normal text-oxford"
          defaultValue={contribution?.description ?? ""}
          maxLength={1000}
          name="description"
          placeholder="Комментарий, если нужен"
        />
      </label>

      <button
        className="rounded-md bg-orange px-3 py-2 text-xs font-semibold text-oxford"
        type="submit"
      >
        Сохранить часы
      </button>
    </form>
  );
}
