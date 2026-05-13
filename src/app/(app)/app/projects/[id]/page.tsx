import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

type ProjectDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;

  return (
    <>
      <PageHeader
        title="Детали проекта"
        description={`Placeholder страницы проекта ${id}. Реальные данные будут загружаться из Supabase в следующей фазе.`}
      />
      <EmptyState title="Подача заявки" description={RU.messages.profileRequired} />
    </>
  );
}
