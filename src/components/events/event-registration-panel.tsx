import type {
  CurrentEventRegistrationState,
  EventRegistrationStatus
} from "@/lib/queries/event-registrations";

type EventRegistrationPanelProps = {
  capacity: number | null;
  cancelAction: () => Promise<void>;
  registeredCount: number;
  registerAction: () => Promise<void>;
  registrationState: CurrentEventRegistrationState;
  result?: {
    type?: string;
    message?: string;
  };
};

const registrationStatusLabels: Record<EventRegistrationStatus, string> = {
  registered: "Вы записаны на этот проект.",
  cancelled: "Вы отменили запись. Можно записаться снова, если места ещё доступны."
};

function ResultMessage({
  message,
  type
}: {
  message: string;
  type?: string;
}) {
  return (
    <div
      className={
        type === "success"
          ? "rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800"
          : "rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
      }
    >
      {message}
    </div>
  );
}

export function EventRegistrationPanel({
  capacity,
  cancelAction,
  registeredCount,
  registerAction,
  registrationState,
  result
}: EventRegistrationPanelProps) {
  const { registration, volunteer } = registrationState;
  const isRegistered = registration?.status === "registered";
  const isCancelled = registration?.status === "cancelled";
  const isFull = capacity !== null && registeredCount >= capacity && !isRegistered;

  return (
    <section className="rounded-lg border border-oxford/10 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-oxford">Запись на проект</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Зарегистрированные участники: {registeredCount}
        {capacity !== null ? ` из ${capacity}` : ""}.
      </p>

      <div className="mt-5 grid gap-4">
        {result?.message ? (
          <ResultMessage message={result.message} type={result.type} />
        ) : null}

        {!volunteer ? (
          <p className="rounded-lg border border-vista/40 bg-vista/15 p-4 text-sm leading-6 text-oxford">
            Запись доступна только одобренным волонтёрам. Если вы уже подали заявку,
            дождитесь подтверждения.
          </p>
        ) : null}

        {volunteer && volunteer.status !== "active" ? (
          <p className="rounded-lg border border-orange/25 bg-orange/10 p-4 text-sm leading-6 text-oxford">
            Ваш волонтёрский статус не позволяет записаться на проект.
          </p>
        ) : null}

        {volunteer?.status === "active" && isRegistered ? (
          <div className="grid gap-4">
            <p className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">
              {registrationStatusLabels.registered}
            </p>
            <form action={cancelAction}>
              <button
                className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-800"
                type="submit"
              >
                Отменить запись
              </button>
            </form>
          </div>
        ) : null}

        {volunteer?.status === "active" && !isRegistered && isFull ? (
          <p className="rounded-lg border border-orange/25 bg-orange/10 p-4 text-sm font-medium text-oxford">
            Мест больше нет.
          </p>
        ) : null}

        {volunteer?.status === "active" && !isRegistered && !isFull ? (
          <div className="grid gap-4">
            {isCancelled ? (
              <p className="text-sm leading-6 text-muted">
                {registrationStatusLabels.cancelled}
              </p>
            ) : null}
            <form action={registerAction}>
              <button
                className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
                type="submit"
              >
                Записаться на проект
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </section>
  );
}
