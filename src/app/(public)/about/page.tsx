import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function AboutPage() {
  return (
    <>
      <PageHeader title={RU.pages.about.title} description={RU.pages.about.description} />
      <div className="grid gap-4 md:grid-cols-2">
        <EmptyState
          title="Наша миссия"
          description="Создать профессиональную и прозрачную систему волонтёрства, где вклад каждого участника подтверждается реальными действиями."
        />
        <EmptyState
          title="Как мы работаем"
          description="Проекты публикуются, заявки рассматриваются ответственными менеджерами, участие подтверждается посещаемостью и сертификатами."
        />
      </div>
    </>
  );
}
