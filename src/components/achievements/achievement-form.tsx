import { achievementTypes, type AchievementType } from "@/lib/validations/achievement";

type AchievementFormProps = {
  action: (formData: FormData) => Promise<void>;
};

export const achievementTypeLabels: Record<AchievementType, string> = {
  general: "Общее",
  attendance: "Посещаемость",
  contribution: "Вклад",
  leadership: "Лидерство",
  special: "Особое достижение"
};

export function AchievementForm({ action }: AchievementFormProps) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <label className="block text-sm font-semibold text-oxford">
        Название
        <input
          className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm font-normal text-oxford"
          maxLength={180}
          name="title"
          placeholder="Например, Активный участник"
          required
        />
      </label>
      <label className="block text-sm font-semibold text-oxford">
        Тип
        <select
          className="mt-2 w-full rounded-md border border-oxford/15 bg-white px-3 py-2 text-sm font-normal text-oxford"
          defaultValue="general"
          name="achievement_type"
        >
          {achievementTypes.map((type) => (
            <option key={type} value={type}>
              {achievementTypeLabels[type]}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold text-oxford md:col-span-2">
        Описание
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm font-normal text-oxford"
          maxLength={2000}
          name="description"
          placeholder="Кратко опишите основание для достижения"
        />
      </label>
      <button
        className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
        type="submit"
      >
        Выдать достижение
      </button>
      <p className="text-sm leading-6 text-muted md:col-span-2">
        Достижения выдаются вручную. Автоматические правила, баллы, уровни и
        рейтинги будут добавлены позже.
      </p>
    </form>
  );
}
