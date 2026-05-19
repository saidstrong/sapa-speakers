type PasswordResetFormProps = {
  action: (formData: FormData) => Promise<void>;
};

const inputClassName =
  "mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/20";

export function PasswordResetForm({ action }: PasswordResetFormProps) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-lg border border-oxford/10 bg-white p-6 shadow-sm"
    >
      <label className="block text-sm font-semibold text-oxford">
        Email
        <input
          autoComplete="email"
          className={inputClassName}
          name="email"
          placeholder="name@example.com"
          required
          type="email"
        />
      </label>
      <button
        className="w-full rounded-md bg-orange px-4 py-2 font-semibold text-oxford transition hover:bg-orange/90"
        type="submit"
      >
        Отправить ссылку
      </button>
    </form>
  );
}
