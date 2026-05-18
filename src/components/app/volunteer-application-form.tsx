import Link from "next/link";

const languageOptions = [
  "Русский",
  "Казахский",
  "Английский",
  "Турецкий",
  "Китайский",
  "Французский",
  "Немецкий",
  "Другое"
];

const interestOptions = [
  "Образовательные проекты",
  "Дипломатические проекты",
  "Экологические проекты",
  "Спортивные проекты",
  "Культурные проекты",
  "Выставки",
  "MUN",
  "Обучение",
  "Логистика",
  "PR/SMM"
];

const inputClassName =
  "mt-2 w-full rounded-md border border-oxford/15 bg-white px-3 py-2 text-sm text-oxford outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/20";

const readOnlyInputClassName =
  "mt-2 w-full rounded-md border border-oxford/15 bg-page px-3 py-2 text-sm text-oxford outline-none";

const labelClassName = "block text-sm font-semibold text-oxford";

type VolunteerApplicationFormValues = {
  email?: string;
  full_name?: string;
  phone?: string;
  telegram?: string;
};

type VolunteerApplicationFormProps = {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: VolunteerApplicationFormValues;
  result?: {
    message?: string;
    status?: string;
  };
};

export function VolunteerApplicationForm({
  action,
  defaultValues,
  result
}: VolunteerApplicationFormProps) {
  const emailIsLocked = Boolean(defaultValues?.email);

  return (
    <div className="grid gap-8">
      <section className="rounded-lg border border-vista/30 bg-vista/15 p-5 text-sm leading-6 text-oxford">
        <p className="font-semibold">Как это работает</p>
        <p className="mt-2 text-muted">
          После отправки заявки команда SapaSpeakers рассмотрит анкету и
          подтвердит волонтёрский профиль, если заявка будет одобрена.
        </p>
      </section>

      {result?.status === "success" ? (
        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-900">
          <p className="font-semibold">Заявка отправлена.</p>
          <p className="mt-2">
            Спасибо. Команда SapaSpeakers рассмотрит заявку и свяжется с вами.
          </p>
        </section>
      ) : null}

      {result?.status === "error" ? (
        <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-900">
          <p className="font-semibold">Заявка не отправлена.</p>
          <p className="mt-2">
            {result.message ?? "Проверьте данные формы и попробуйте ещё раз."}
          </p>
        </section>
      ) : null}

      <form
        action={action}
        className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-oxford">
            Заявка волонтёра
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Поля, отмеченные *, обязательны для заполнения. Email берётся из
            вашего аккаунта, если он уже указан в профиле.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClassName}>
            ФИО *
            <input
              className={inputClassName}
              defaultValue={defaultValues?.full_name}
              maxLength={160}
              name="full_name"
              placeholder="Введите ваше полное имя"
              required
            />
          </label>

          <label className={labelClassName}>
            Email *
            <input
              className={emailIsLocked ? readOnlyInputClassName : inputClassName}
              defaultValue={defaultValues?.email}
              maxLength={254}
              name="email"
              placeholder="name@example.com"
              readOnly={emailIsLocked}
              required
              type="email"
            />
          </label>

          <label className={labelClassName}>
            Телефон
            <input
              className={inputClassName}
              defaultValue={defaultValues?.phone}
              maxLength={40}
              name="phone"
              placeholder="+7..."
            />
          </label>

          <label className={labelClassName}>
            Telegram
            <input
              className={inputClassName}
              defaultValue={defaultValues?.telegram}
              maxLength={64}
              name="telegram"
              placeholder="@username"
            />
          </label>

          <label className={labelClassName}>
            Город
            <input
              className={inputClassName}
              maxLength={100}
              name="city"
              placeholder="Например, Алматы"
            />
          </label>

          <label className={labelClassName}>
            Возраст
            <input
              className={inputClassName}
              max={100}
              min={12}
              name="age"
              placeholder="Например, 18"
              type="number"
            />
          </label>
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold text-oxford">Языки</legend>
          <p className="mt-1 text-sm text-muted">
            Выберите языки, которыми вы готовы пользоваться в волонтёрских
            проектах.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            {languageOptions.map((language) => (
              <label
                className="flex items-center gap-2 rounded-md border border-oxford/10 bg-page px-3 py-2 text-sm text-oxford"
                key={language}
              >
                <input name="languages" type="checkbox" value={language} />
                {language}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold text-oxford">
            Интересы
          </legend>
          <p className="mt-1 text-sm text-muted">
            Отметьте направления, которые вам ближе.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {interestOptions.map((interest) => (
              <label
                className="flex items-center gap-2 rounded-md border border-oxford/10 bg-page px-3 py-2 text-sm text-oxford"
                key={interest}
              >
                <input name="interests" type="checkbox" value={interest} />
                {interest}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-5">
          <label className={labelClassName}>
            Опыт волонтёрства
            <textarea
              className={inputClassName}
              maxLength={2000}
              name="experience"
              placeholder="Кратко расскажите, был ли у вас волонтёрский или организационный опыт."
              rows={4}
            />
          </label>

          <label className={labelClassName}>
            Почему вы хотите стать волонтёром SapaSpeakers? *
            <textarea
              className={inputClassName}
              maxLength={3000}
              name="motivation"
              placeholder="Расскажите о вашей мотивации и ожиданиях."
              required
              rows={5}
            />
          </label>

          <label className={labelClassName}>
            Доступность / удобное время
            <textarea
              className={inputClassName}
              maxLength={1000}
              name="availability"
              placeholder="Например, будние вечера, выходные, определённые дни."
              rows={3}
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-oxford/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-muted">
            Отправляя заявку, вы подтверждаете, что команда SapaSpeakers может
            связаться с вами по контактам из анкеты.
          </p>
          <button
            className="rounded-md bg-orange px-5 py-3 text-sm font-semibold text-oxford transition hover:bg-orange/90"
            type="submit"
          >
            Отправить заявку
          </button>
        </div>
      </form>

      <p className="text-sm leading-6 text-muted">
        Хотите проверить данные аккаунта перед отправкой?{" "}
        <Link
          className="font-semibold text-oxford underline decoration-orange/60 underline-offset-4 hover:text-orange"
          href="/app/profile"
        >
          Откройте профиль
        </Link>
        .
      </p>
    </div>
  );
}
