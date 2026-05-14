import type { CurrentUserProfile } from "@/lib/auth/current-user";

type ProfileFormProps = {
  action: (formData: FormData) => Promise<void>;
  profile: Pick<CurrentUserProfile, "full_name" | "phone" | "telegram">;
};

export function ProfileForm({ action, profile }: ProfileFormProps) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <label className="block text-sm font-semibold text-oxford">
        ФИО
        <input
          className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2"
          defaultValue={profile.full_name ?? ""}
          maxLength={120}
          name="full_name"
          placeholder="Ваше имя"
        />
      </label>
      <label className="block text-sm font-semibold text-oxford">
        Телефон
        <input
          className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2"
          defaultValue={profile.phone ?? ""}
          maxLength={40}
          name="phone"
          placeholder="+7..."
        />
      </label>
      <label className="block text-sm font-semibold text-oxford md:col-span-2">
        Telegram
        <input
          className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2"
          defaultValue={profile.telegram ?? ""}
          maxLength={100}
          name="telegram"
          placeholder="@username"
        />
      </label>
      <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center">
        <button
          className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
          type="submit"
        >
          Сохранить профиль
        </button>
        <p className="text-sm leading-6 text-muted">
          Email, роль и волонтёрский статус здесь не редактируются.
        </p>
      </div>
    </form>
  );
}
