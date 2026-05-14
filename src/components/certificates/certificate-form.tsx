import { certificateTypes, type CertificateType } from "@/lib/validations/certificate";

type CertificateFormProps = {
  action: (formData: FormData) => Promise<void>;
};

export const certificateTypeLabels: Record<CertificateType, string> = {
  participation: "Участие",
  contribution: "Вклад",
  leadership: "Лидерство",
  special: "Особый сертификат"
};

export function CertificateForm({ action }: CertificateFormProps) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <label className="block text-sm font-semibold text-oxford">
        Название
        <input
          className="mt-2 w-full rounded-md border border-oxford/15 px-3 py-2 text-sm font-normal text-oxford"
          maxLength={180}
          name="title"
          placeholder="Например, Сертификат участника"
          required
        />
      </label>
      <label className="block text-sm font-semibold text-oxford">
        Тип
        <select
          className="mt-2 w-full rounded-md border border-oxford/15 bg-white px-3 py-2 text-sm font-normal text-oxford"
          defaultValue="participation"
          name="certificate_type"
        >
          {certificateTypes.map((type) => (
            <option key={type} value={type}>
              {certificateTypeLabels[type]}
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
          placeholder="Краткое описание участия или вклада"
        />
      </label>
      <button
        className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford"
        type="submit"
      >
        Выдать сертификат
      </button>
      <p className="text-sm leading-6 text-muted md:col-span-2">
        Сейчас создаётся только запись сертификата. PDF, шаблоны, QR-коды и
        загрузка файлов будут добавлены позже.
      </p>
    </form>
  );
}
