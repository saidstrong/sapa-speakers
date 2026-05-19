import type { RoleKey } from "@/lib/auth/roles";
import {
  certificatePdfMaxSizeBytes,
  certificatePdfMimeType
} from "@/lib/validations/certificate";

export const CERTIFICATE_FILES_BUCKET = "certificate-files";
export const CERTIFICATE_PDF_MAX_SIZE_BYTES = certificatePdfMaxSizeBytes;
export const CERTIFICATE_PDF_MIME_TYPE = certificatePdfMimeType;

export const certificatePdfUploaderRoles = [
  "founder_ceo",
  "cto",
  "operations_manager",
  "hr_manager",
  "volunteer_teamlead"
] as const satisfies readonly RoleKey[];

export function canUploadCertificatePdf(role: RoleKey) {
  return certificatePdfUploaderRoles.includes(
    role as (typeof certificatePdfUploaderRoles)[number]
  );
}

export function formatCertificatePdfMaxSize() {
  return `${CERTIFICATE_PDF_MAX_SIZE_BYTES / 1024 / 1024} МБ`;
}

export function validateCertificatePdfFile(file: File | null) {
  if (!file || file.size === 0) {
    return "Выберите PDF-файл сертификата.";
  }

  if (file.type !== CERTIFICATE_PDF_MIME_TYPE) {
    return "Можно загрузить только PDF-файл.";
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return "Файл сертификата должен иметь расширение .pdf.";
  }

  if (file.size > CERTIFICATE_PDF_MAX_SIZE_BYTES) {
    return `PDF-файл не должен быть больше ${formatCertificatePdfMaxSize()}.`;
  }

  return null;
}

function sanitizeFileName(fileName: string) {
  const normalized = fileName
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized && normalized.length > 0 ? normalized : "certificate.pdf";
}

export function buildCertificatePdfPath(certificateId: string, fileName: string) {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");

  return `certificates/${certificateId}/${timestamp}-${sanitizeFileName(fileName)}`;
}
