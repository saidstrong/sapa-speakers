import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";
import { submitVolunteerApplication } from "./actions";

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

const labelClassName = "block text-sm font-semibold text-oxford";

type JoinPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const params = await searchParams;
  const status = params?.status;
  const message = params?.message;

  return (
    <div className="space-y-8">
      <PageHeader
        title={RU.pages.join.title}
        description="Заполните короткую заявку, чтобы команда SapaSpeakers могла связаться с вами и пригласить к следующим шагам."
        action={
          <Link
            href="/projects"
            className="rounded-md border border-oxford/15 bg-white px-5 py-3 text-sm font-semibold text-oxford transition hover:border-orange"
          >
            {RU.buttons.viewProjects}
          </Link>
        }
      />

      <section className="rounded-lg border border-vista/30 bg-vista/15 p-5 text-sm leading-6 text-oxford">
        <p className="font-semibold">Как это работает</p>
        <p className="mt-2 text-muted">
          {RU.messages.controlledParticipation} После отправки заявки команда
          сможет связаться с вами и объяснить дальнейшие шаги.
        </p>
      </section>

      {status === "success" ? (
        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-900">
          <p className="font-semibold">Заявка отправлена.</p>
          <p className="mt-2">
            Спасибо. Команда SapaSpeakers рассмотрит заявку и свяжется с вами.
          </p>
        </section>
      ) : null}

      {status === "error" ? (
        <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-900">
          <p className="font-semibold">Заявка не отправлена.</p>
          <p className="mt-2">
            {message ?? "Проверьте данные формы и попробуйте ещё раз."}
          </p>
        </section>
      ) : null}

      <form
        action={submitVolunteerApplication}
        className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-oxford">
            Заявка волонтёра
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Поля, отмеченные *, обязательны для заполнения.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClassName}>
            ФИО *
            <input
              className={inputClassName}
              name="full_name"
              required
              maxLength={160}
              placeholder="Введите ваше полное имя"
            />
          </label>

          <label className={labelClassName}>
            Email *
            <input
              className={inputClassName}
              name="email"
              type="email"
              required
              maxLength={254}
              placeholder="name@example.com"
            />
          </label>

          <label className={labelClassName}>
            Телефон
            <input
              className={inputClassName}
              name="phone"
              maxLength={40}
              placeholder="+7..."
            />
          </label>

          <label className={labelClassName}>
            Telegram
            <input
              className={inputClassName}
              name="telegram"
              maxLength={64}
              placeholder="@username"
            />
          </label>

          <label className={labelClassName}>
            Город
            <input
              className={inputClassName}
              name="city"
              maxLength={100}
              placeholder="Например, Алматы"
            />
          </label>

          <label className={labelClassName}>
            Возраст
            <input
              className={inputClassName}
              name="age"
              type="number"
              min={12}
              max={100}
              placeholder="Например, 18"
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
                key={language}
                className="flex items-center gap-2 rounded-md border border-oxford/10 bg-page px-3 py-2 text-sm text-oxford"
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
                key={interest}
                className="flex items-center gap-2 rounded-md border border-oxford/10 bg-page px-3 py-2 text-sm text-oxford"
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
              name="experience"
              maxLength={2000}
              rows={4}
              placeholder="Кратко расскажите, был ли у вас волонтёрский или организационный опыт."
            />
          </label>

          <label className={labelClassName}>
            Почему вы хотите стать волонтёром SapaSpeakers? *
            <textarea
              className={inputClassName}
              name="motivation"
              required
              maxLength={3000}
              rows={5}
              placeholder="Расскажите о вашей мотивации и ожиданиях."
            />
          </label>

          <label className={labelClassName}>
            Доступность / удобное время
            <textarea
              className={inputClassName}
              name="availability"
              maxLength={1000}
              rows={3}
              placeholder="Например, будние вечера, выходные, определённые дни."
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-oxford/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-muted">
            Отправляя заявку, вы подтверждаете, что команда SapaSpeakers может
            связаться с вами по указанным контактам.
          </p>
          <button
            type="submit"
            className="rounded-md bg-orange px-5 py-3 text-sm font-semibold text-oxford transition hover:bg-orange/90"
          >
            Отправить заявку
          </button>
        </div>
      </form>
    </div>
  );
}
