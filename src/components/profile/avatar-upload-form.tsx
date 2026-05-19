import { cn } from "@/lib/utils";
import { formatAvatarMaxSize } from "@/lib/storage/avatars";

type ProfileAvatarPreviewProps = {
  avatarUrl: string | null;
  className?: string;
  displayName?: string | null;
  email?: string | null;
  size?: "sm" | "md" | "lg";
};

type AvatarUploadFormProps = {
  action: (formData: FormData) => Promise<void>;
  avatarUrl: string | null;
  displayName: string | null;
  email: string;
  fileName: string | null;
  uploadedAt: string | null;
};

const avatarSizeClassNames = {
  sm: "h-12 w-12 text-base",
  md: "h-16 w-16 text-lg",
  lg: "h-24 w-24 text-2xl"
};

function getInitials(displayName?: string | null, email?: string | null) {
  const source = (displayName || email || "Пользователь").trim();
  const words = source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (words.length > 1) {
    return words.map((word) => word[0]).join("").toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function formatDate(value: string | null) {
  if (!value) {
    return "Не загружено";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function buildAvatarStyle(avatarUrl: string | null) {
  if (!avatarUrl) {
    return undefined;
  }

  return {
    backgroundImage: `url("${avatarUrl.replace(/"/g, "%22")}")`
  };
}

export function ProfileAvatarPreview({
  avatarUrl,
  className,
  displayName,
  email,
  size = "md"
}: ProfileAvatarPreviewProps) {
  const label = displayName || email || "пользователя";

  return (
    <div
      aria-label={avatarUrl ? `Фото профиля ${label}` : `Инициалы ${label}`}
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-oxford/10 bg-vista/20 bg-cover bg-center font-semibold text-oxford shadow-sm",
        avatarSizeClassNames[size],
        className
      )}
      role="img"
      style={buildAvatarStyle(avatarUrl)}
    >
      {avatarUrl ? null : <span>{getInitials(displayName, email)}</span>}
    </div>
  );
}

export function AvatarUploadForm({
  action,
  avatarUrl,
  displayName,
  email,
  fileName,
  uploadedAt
}: AvatarUploadFormProps) {
  return (
    <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-start">
      <ProfileAvatarPreview
        avatarUrl={avatarUrl}
        displayName={displayName}
        email={email}
        size="lg"
      />
      <div className="grid gap-4">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-oxford">Текущий файл</dt>
            <dd className="mt-1 text-muted">{fileName ?? "Фото не загружено"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-oxford">Дата загрузки</dt>
            <dd className="mt-1 text-muted">{formatDate(uploadedAt)}</dd>
          </div>
        </dl>
        <form action={action} className="grid gap-4">
          <label className="block text-sm font-semibold text-oxford">
            Новое фото профиля
            <input
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              className="mt-2 w-full rounded-md border border-oxford/15 bg-white px-3 py-2 text-sm font-normal text-oxford"
              name="avatar"
              required
              type="file"
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-muted">
              JPG, PNG или WebP до {formatAvatarMaxSize()}. Фото видно только вам
              и администраторам.
            </p>
            <button
              className="rounded-md bg-orange px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-orange/90"
              type="submit"
            >
              Загрузить фото
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
