import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RU } from "@/lib/constants/ru";

export default function TeamApplicationPage() {
  return (
    <>
      <PageHeader
        title={RU.pages.teamApplication.title}
        description={RU.pages.teamApplication.description}
        action={
          <Link
            href="/register"
            className="rounded-md bg-orange px-5 py-3 text-sm font-semibold text-oxford"
          >
            {RU.buttons.applyToTeam}
          </Link>
        }
      />
      <EmptyState
        title="Форма появится после подключения профилей и CV"
        description="В следующих фазах здесь будет заявка с желаемой должностью, мотивацией, опытом, навыками и загрузкой CV."
      />
    </>
  );
}
