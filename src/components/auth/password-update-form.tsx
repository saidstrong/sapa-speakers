type PasswordUpdateFormProps = {
  action: (formData: FormData) => Promise<void>;
  helperText?: string;
  submitLabel: string;
};

const inputClassName =
  "mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/20";

export function PasswordUpdateForm({
  action,
  helperText,
  submitLabel
}: PasswordUpdateFormProps) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <label className="block text-sm font-semibold text-oxford">
        Новый пароль
        <input
          autoComplete="new-password"
          className={inputClassName}
          minLength={8}
          name="new_password"
          placeholder="Минимум 8 символов"
          required
          type="password"
        />
      </label>
      <label className="block text-sm font-semibold text-oxford">
        Повторите пароль
        <input
          autoComplete="new-password"
          className={inputClassName}
          minLength={8}
          name="password_confirm"
          placeholder="Повторите пароль"
          required
          type="password"
        />
      </label>
      <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center">
        <button
          className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
          type="submit"
        >
          {submitLabel}
        </button>
        {helperText ? <p className="text-sm leading-6 text-muted">{helperText}</p> : null}
      </div>
    </form>
  );
}
