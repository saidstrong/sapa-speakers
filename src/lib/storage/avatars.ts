import type { SupabaseClient } from "@supabase/supabase-js";

export const PROFILE_AVATARS_BUCKET = "profile-avatars";
export const PROFILE_AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const PROFILE_AVATAR_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
] as const;

const allowedExtensionsByMimeType: Record<
  (typeof PROFILE_AVATAR_ALLOWED_MIME_TYPES)[number],
  readonly string[]
> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"]
};

export function formatAvatarMaxSize() {
  return `${PROFILE_AVATAR_MAX_SIZE_BYTES / 1024 / 1024} МБ`;
}

function isAllowedAvatarMimeType(
  value: string
): value is (typeof PROFILE_AVATAR_ALLOWED_MIME_TYPES)[number] {
  return PROFILE_AVATAR_ALLOWED_MIME_TYPES.includes(
    value as (typeof PROFILE_AVATAR_ALLOWED_MIME_TYPES)[number]
  );
}

function hasAllowedExtension(fileName: string, mimeType: string) {
  if (!isAllowedAvatarMimeType(mimeType)) {
    return false;
  }

  const normalizedName = fileName.toLowerCase();

  return allowedExtensionsByMimeType[mimeType].some((extension) =>
    normalizedName.endsWith(extension)
  );
}

function sanitizeFileName(fileName: string) {
  const fallback = "avatar";
  const normalized = fileName
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized && normalized.length > 0 ? normalized : fallback;
}

export function validateAvatarFile(file: File | null) {
  if (!file || file.size === 0) {
    return "Выберите файл фото профиля.";
  }

  if (!isAllowedAvatarMimeType(file.type)) {
    return "Можно загрузить только JPG, PNG или WebP.";
  }

  if (!hasAllowedExtension(file.name, file.type)) {
    return "Файл фото должен иметь расширение .jpg, .jpeg, .png или .webp.";
  }

  if (file.size > PROFILE_AVATAR_MAX_SIZE_BYTES) {
    return `Фото профиля не должно быть больше ${formatAvatarMaxSize()}.`;
  }

  return null;
}

export function buildAvatarPath(profileId: string, file: File) {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");

  return `profiles/${profileId}/${timestamp}-${sanitizeFileName(file.name)}`;
}

export async function createAvatarSignedUrl(
  supabase: SupabaseClient,
  path: string | null | undefined,
  expiresInSeconds = 60 * 60
) {
  if (!path) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(PROFILE_AVATARS_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}
