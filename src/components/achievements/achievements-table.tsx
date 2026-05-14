import Link from "next/link";
import { AchievementStatusBadge } from "@/components/achievements/achievement-status-badge";
import { achievementTypeLabels } from "@/components/achievements/achievement-form";
import { EmptyState } from "@/components/ui/empty-state";
import type { AchievementListItem } from "@/lib/queries/achievements";

type AchievementsTableProps = {
  achievements: readonly AchievementListItem[];
  emptyDescription: string;
  emptyTitle?: string;
  detailBasePath?: string;
  showDetailAction?: boolean;
  showAwarder?: boolean;
  showRevocationDetails?: boolean;
  showVolunteer?: boolean;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Не указано";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function displayProfile(profile: AchievementListItem["volunteerProfile"]) {
  if (!profile) {
    return "Не указан";
  }

  return profile.full_name ?? profile.email;
}

export function AchievementsTable({
  achievements,
  detailBasePath,
  emptyDescription,
  emptyTitle = "Достижения",
  showDetailAction = false,
  showAwarder = false,
  showRevocationDetails = true,
  showVolunteer = false
}: AchievementsTableProps) {
  if (achievements.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const hasRevokedAchievements = achievements.some(
    (achievement) => achievement.status === "revoked"
  );
  const shouldShowRevocationDetails =
    showRevocationDetails && hasRevokedAchievements;

  return (
    <div className="overflow-hidden rounded-lg border border-oxford/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[860px] divide-y divide-oxford/10 text-sm">
          <thead className="bg-oxford/5 text-left text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Название</th>
              {showVolunteer ? <th className="px-4 py-3">Волонтёр</th> : null}
              <th className="px-4 py-3">Тип</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Дата выдачи</th>
              {shouldShowRevocationDetails ? (
                <th className="px-4 py-3">Отзыв</th>
              ) : null}
              {showAwarder ? <th className="px-4 py-3">Выдал</th> : null}
              <th className="px-4 py-3">Описание</th>
              {showDetailAction && detailBasePath ? (
                <th className="px-4 py-3">Действие</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-oxford/10">
            {achievements.map((achievement) => (
              <tr
                key={achievement.id}
                className={
                  achievement.status === "revoked"
                    ? "bg-red-50/60 align-top"
                    : "align-top"
                }
              >
                <td className="px-4 py-4 font-semibold text-oxford">
                  {detailBasePath ? (
                    <Link
                      className="transition hover:text-orange"
                      href={`${detailBasePath}/${achievement.id}`}
                    >
                      {achievement.title}
                    </Link>
                  ) : (
                    achievement.title
                  )}
                </td>
                {showVolunteer ? (
                  <td className="px-4 py-4">
                    <div className="font-semibold text-oxford">
                      {achievement.volunteer ? (
                        <Link
                          className="transition hover:text-orange"
                          href={`/admin/volunteers/${achievement.volunteer.id}`}
                        >
                          {displayProfile(achievement.volunteerProfile)}
                        </Link>
                      ) : (
                        displayProfile(achievement.volunteerProfile)
                      )}
                    </div>
                    <div className="mt-1 text-muted">
                      {achievement.volunteerProfile?.email ?? "Email не указан"}
                    </div>
                  </td>
                ) : null}
                <td className="px-4 py-4 text-muted">
                  {achievementTypeLabels[achievement.achievement_type]}
                </td>
                <td className="px-4 py-4">
                  <AchievementStatusBadge status={achievement.status} />
                </td>
                <td className="px-4 py-4 text-muted">
                  {formatDate(achievement.awarded_at)}
                </td>
                {shouldShowRevocationDetails ? (
                  <td className="max-w-sm px-4 py-4 text-muted">
                    {achievement.status === "revoked" ? (
                      <div className="space-y-1">
                        <div>{formatDate(achievement.revoked_at)}</div>
                        {achievement.revocation_reason ? (
                          <div>{achievement.revocation_reason}</div>
                        ) : null}
                      </div>
                    ) : (
                      "Не отозвано"
                    )}
                  </td>
                ) : null}
                {showAwarder ? (
                  <td className="px-4 py-4 text-muted">
                    {achievement.awardedByProfile
                      ? achievement.awardedByProfile.full_name ??
                        achievement.awardedByProfile.email
                      : "Не указан"}
                  </td>
                ) : null}
                <td className="max-w-md px-4 py-4 text-muted">
                  {achievement.description ?? "Нет"}
                </td>
                {showDetailAction && detailBasePath ? (
                  <td className="px-4 py-4">
                    <Link
                      className="rounded-md border border-oxford/15 px-3 py-2 text-sm font-semibold text-oxford transition hover:border-orange/40 hover:text-orange"
                      href={`${detailBasePath}/${achievement.id}`}
                    >
                      Открыть
                    </Link>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
