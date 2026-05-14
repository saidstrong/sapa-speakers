import { requireAdminUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminDashboardMetric = {
  id: string;
  title: string;
  value: string;
  description: string;
  href: string;
};

export type AdminDashboardActivityItem = {
  id: string;
  href: string;
  kind: string;
  title: string;
  description: string;
  occurredAt: string;
};

export type AdminDashboardData = {
  metrics: AdminDashboardMetric[];
  recentActivity: AdminDashboardActivityItem[];
};

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

type CountTable =
  | "achievements"
  | "certificates"
  | "event_attendance"
  | "event_registrations"
  | "events"
  | "volunteer_applications"
  | "volunteers";

type VolunteerApplicationActivityRow = {
  id: string;
  email: string;
  full_name: string;
  status: string;
  submitted_at: string;
};

type RegistrationActivityRow = {
  id: string;
  event_id: string;
  status: string;
  registered_at: string;
};

type AttendanceActivityRow = {
  id: string;
  event_id: string;
  status: string;
  marked_at: string;
};

type ContributionActivityRow = {
  id: string;
  event_id: string | null;
  hours: number | string;
  awarded_at: string;
};

type CertificateActivityRow = {
  id: string;
  title: string;
  status: string;
  issued_at: string;
};

type AchievementActivityRow = {
  id: string;
  title: string;
  status: string;
  awarded_at: string;
};

type EventTitleRow = {
  id: string;
  title: string;
};

type CountResult = {
  count: number | null;
  error: { message: string } | null;
};

type CountFilterQuery = PromiseLike<CountResult> & {
  eq: (column: string, value: unknown) => CountFilterQuery;
  gte: (column: string, value: unknown) => CountFilterQuery;
};

const numberFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0
});

const hoursFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0
});

function formatCount(value: number) {
  return numberFormatter.format(value);
}

function formatHours(value: number) {
  return `${hoursFormatter.format(value)} ч.`;
}

function asCount(value: number | null) {
  return value ?? 0;
}

function normalizeHours(value: number | string) {
  return typeof value === "number" ? value : Number(value);
}

function uniqueValues(values: Array<string | null>) {
  return Array.from(new Set(values.filter(Boolean))) as string[];
}

async function countRows(
  supabase: SupabaseServerClient,
  table: CountTable,
  filters: (query: CountFilterQuery) => CountFilterQuery
) {
  const query = supabase.from(table).select("id", {
    count: "exact",
    head: true
  });

  const result = await filters(query as unknown as CountFilterQuery);

  if (result.error) {
    throw new Error("Не удалось загрузить показатели панели управления.");
  }

  return asCount(result.count);
}

async function countAllRows(supabase: SupabaseServerClient, table: CountTable) {
  return countRows(supabase, table, (query) => query);
}

async function sumContributionHours(supabase: SupabaseServerClient) {
  const { data, error } = await supabase
    .from("volunteer_contributions")
    .select("hours");

  if (error) {
    throw new Error("Не удалось загрузить сумму подтверждённых часов.");
  }

  return ((data ?? []) as Array<{ hours: number | string }>).reduce(
    (total, row) => total + normalizeHours(row.hours),
    0
  );
}

async function loadEventTitles(
  supabase: SupabaseServerClient,
  eventIds: readonly string[]
) {
  if (eventIds.length === 0) {
    return new Map<string, string>();
  }

  const { data, error } = await supabase
    .from("events")
    .select("id, title")
    .in("id", [...eventIds]);

  if (error) {
    throw new Error("Не удалось загрузить названия событий для панели управления.");
  }

  return new Map(
    ((data ?? []) as EventTitleRow[]).map((event) => [event.id, event.title])
  );
}

function sortRecentActivity(items: AdminDashboardActivityItem[]) {
  return items
    .sort(
      (left, right) =>
        new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime()
    )
    .slice(0, 12);
}

async function loadRecentActivity(
  supabase: SupabaseServerClient
): Promise<AdminDashboardActivityItem[]> {
  const [
    applicationsResult,
    registrationsResult,
    attendanceResult,
    contributionsResult,
    certificatesResult,
    achievementsResult
  ] = await Promise.all([
    supabase
      .from("volunteer_applications")
      .select("id, email, full_name, status, submitted_at")
      .order("submitted_at", { ascending: false })
      .limit(4),
    supabase
      .from("event_registrations")
      .select("id, event_id, status, registered_at")
      .order("registered_at", { ascending: false })
      .limit(4),
    supabase
      .from("event_attendance")
      .select("id, event_id, status, marked_at")
      .order("marked_at", { ascending: false })
      .limit(4),
    supabase
      .from("volunteer_contributions")
      .select("id, event_id, hours, awarded_at")
      .order("awarded_at", { ascending: false })
      .limit(4),
    supabase
      .from("certificates")
      .select("id, title, status, issued_at")
      .order("issued_at", { ascending: false })
      .limit(4),
    supabase
      .from("achievements")
      .select("id, title, status, awarded_at")
      .order("awarded_at", { ascending: false })
      .limit(4)
  ]);

  const results = [
    applicationsResult,
    registrationsResult,
    attendanceResult,
    contributionsResult,
    certificatesResult,
    achievementsResult
  ];

  if (results.some((result) => result.error)) {
    throw new Error("Не удалось загрузить последнюю активность.");
  }

  const registrations = (registrationsResult.data ?? []) as RegistrationActivityRow[];
  const attendance = (attendanceResult.data ?? []) as AttendanceActivityRow[];
  const contributions = (contributionsResult.data ?? []) as ContributionActivityRow[];
  const eventTitles = await loadEventTitles(
    supabase,
    uniqueValues([
      ...registrations.map((registration) => registration.event_id),
      ...attendance.map((record) => record.event_id),
      ...contributions.map((contribution) => contribution.event_id)
    ])
  );

  const activity: AdminDashboardActivityItem[] = [
    ...((applicationsResult.data ?? []) as VolunteerApplicationActivityRow[]).map(
      (application) => ({
        id: `application-${application.id}`,
        href: `/admin/team-applications/${application.id}`,
        kind: "Заявка",
        title: application.full_name,
        description: `${application.email} · статус: ${application.status}`,
        occurredAt: application.submitted_at
      })
    ),
    ...registrations.map((registration) => ({
      id: `registration-${registration.id}`,
      href: `/admin/events/${registration.event_id}`,
      kind: "Запись",
      title: eventTitles.get(registration.event_id) ?? "Событие",
      description: `Статус регистрации: ${registration.status}`,
      occurredAt: registration.registered_at
    })),
    ...attendance.map((record) => ({
      id: `attendance-${record.id}`,
      href: "/admin/attendance",
      kind: "Посещаемость",
      title: eventTitles.get(record.event_id) ?? "Событие",
      description: `Статус посещаемости: ${record.status}`,
      occurredAt: record.marked_at
    })),
    ...contributions.map((contribution) => ({
      id: `contribution-${contribution.id}`,
      href: "/admin/attendance",
      kind: "Вклад",
      title: contribution.event_id
        ? eventTitles.get(contribution.event_id) ?? "Событие"
        : "Ручная запись",
      description: `Подтверждено ${formatHours(normalizeHours(contribution.hours))}`,
      occurredAt: contribution.awarded_at
    })),
    ...((certificatesResult.data ?? []) as CertificateActivityRow[]).map(
      (certificate) => ({
        id: `certificate-${certificate.id}`,
        href: `/admin/certificates/${certificate.id}`,
        kind: "Сертификат",
        title: certificate.title,
        description: `Статус: ${certificate.status}`,
        occurredAt: certificate.issued_at
      })
    ),
    ...((achievementsResult.data ?? []) as AchievementActivityRow[]).map(
      (achievement) => ({
        id: `achievement-${achievement.id}`,
        href: `/admin/badges/${achievement.id}`,
        kind: "Достижение",
        title: achievement.title,
        description: `Статус: ${achievement.status}`,
        occurredAt: achievement.awarded_at
      })
    )
  ];

  return sortRecentActivity(activity);
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  await requireAdminUser();
  const supabase = await createSupabaseServerClient();
  const nowIso = new Date().toISOString();

  const [
    pendingApplications,
    activeVolunteers,
    publishedEvents,
    upcomingPublishedEvents,
    activeRegistrations,
    markedAttendance,
    totalContributionHours,
    issuedCertificates,
    awardedAchievements,
    recentActivity
  ] = await Promise.all([
    countRows(supabase, "volunteer_applications", (query) =>
      query.eq("status", "pending")
    ),
    countRows(supabase, "volunteers", (query) => query.eq("status", "active")),
    countRows(supabase, "events", (query) => query.eq("status", "published")),
    countRows(supabase, "events", (query) =>
      query.eq("status", "published").gte("starts_at", nowIso)
    ),
    countRows(supabase, "event_registrations", (query) =>
      query.eq("status", "registered")
    ),
    countAllRows(supabase, "event_attendance"),
    sumContributionHours(supabase),
    countRows(supabase, "certificates", (query) => query.eq("status", "issued")),
    countRows(supabase, "achievements", (query) => query.eq("status", "awarded")),
    loadRecentActivity(supabase)
  ]);

  return {
    metrics: [
      {
        id: "pending-applications",
        title: "Заявки на рассмотрении",
        value: formatCount(pendingApplications),
        description: "Новые заявки в команду",
        href: "/admin/team-applications"
      },
      {
        id: "active-volunteers",
        title: "Активные волонтёры",
        value: formatCount(activeVolunteers),
        description: "Одобренные активные карточки",
        href: "/admin/volunteers"
      },
      {
        id: "published-events",
        title: "Опубликованные события",
        value: formatCount(publishedEvents),
        description: "Видимы волонтёрам",
        href: "/admin/events"
      },
      {
        id: "upcoming-events",
        title: "Предстоящие события",
        value: formatCount(upcomingPublishedEvents),
        description: "Опубликованы и ещё не начались",
        href: "/admin/events"
      },
      {
        id: "active-registrations",
        title: "Активные записи",
        value: formatCount(activeRegistrations),
        description: "Регистрации без отмены",
        href: "/admin/events"
      },
      {
        id: "marked-attendance",
        title: "Отметки посещаемости",
        value: formatCount(markedAttendance),
        description: "Все отмеченные записи",
        href: "/admin/attendance"
      },
      {
        id: "contribution-hours",
        title: "Подтверждённые часы",
        value: formatHours(totalContributionHours),
        description: "Сумма записанного вклада",
        href: "/admin/attendance"
      },
      {
        id: "issued-certificates",
        title: "Выданные сертификаты",
        value: formatCount(issuedCertificates),
        description: "Текущий статус: выдан",
        href: "/admin/certificates"
      },
      {
        id: "awarded-achievements",
        title: "Выданные достижения",
        value: formatCount(awardedAchievements),
        description: "Текущий статус: выдано",
        href: "/admin/badges"
      }
    ],
    recentActivity
  };
}
