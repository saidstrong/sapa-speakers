import { DashboardMetricCard } from "@/components/admin/dashboard-metric-card";
import { RecentActivityList } from "@/components/admin/recent-activity-list";
import { PageHeader } from "@/components/ui/page-header";
import { getAdminDashboardData } from "@/lib/queries/admin-dashboard";

export default async function AdminIndexPage() {
  const dashboard = await getAdminDashboardData();

  return (
    <>
      <PageHeader
        title="Панель управления"
        description="Операционная сводка по заявкам, волонтёрам, событиям, посещаемости, вкладу, сертификатам и достижениям."
      />

      <section className="mb-6 rounded-lg border border-vista/40 bg-vista/15 p-4 text-sm leading-6 text-oxford">
        Панель показывает реальные данные из текущих таблиц и работает только на
        чтение. Аналитический движок, экспорт и графики будут добавлены позже.
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboard.metrics.map((metric) => (
          <DashboardMetricCard
            key={metric.id}
            description={metric.description}
            href={metric.href}
            title={metric.title}
            value={metric.value}
          />
        ))}
      </section>

      <RecentActivityList items={dashboard.recentActivity} />
    </>
  );
}
