import { formatCertificatePdfMaxSize } from "@/lib/storage/certificates";

type CertificatePdfUploadFormProps = {
  action: (formData: FormData) => Promise<void>;
  hasFile: boolean;
};

export function CertificatePdfUploadForm({
  action,
  hasFile
}: CertificatePdfUploadFormProps) {
  return (
    <form action={action} className="grid gap-4">
      <label className="block text-sm font-semibold text-oxford">
        PDF-файл сертификата
        <input
          accept="application/pdf,.pdf"
          className="mt-2 w-full rounded-md border border-oxford/15 bg-white px-3 py-2 text-sm font-normal text-oxford"
          name="certificate_pdf"
          required
          type="file"
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-muted">
          Только PDF, размер до {formatCertificatePdfMaxSize()}. Новый файл
          заменит текущий официальный PDF сертификата.
        </p>
        <button
          className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
          type="submit"
        >
          {hasFile ? "Заменить PDF" : "Загрузить PDF"}
        </button>
      </div>
    </form>
  );
}
