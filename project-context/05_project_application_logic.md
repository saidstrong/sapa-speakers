# SapaSpeakers Volunteer Platform — Project & Application Logic

## 1. Purpose

This document defines the project lifecycle, project moderation logic, volunteer application logic, questionnaire logic, review flow, participant approval rules, and attendance prerequisites for the SapaSpeakers Volunteer Platform.

The most important principle:

```text
Registration is open.
Project participation is controlled.
```

A registered volunteer is not automatically a project participant.

A volunteer becomes an official project participant only after:

1. profile completion
2. project application submission
3. manager review
4. approval

---

## 2. Core Project Principle

A project is the main operational unit of the organization.

Projects represent real volunteering opportunities, events, trainings, MUN activities, ecological actions, cultural work, exhibitions, sports events, diplomatic projects, and similar activities.

Every project should have:

- clear title
- clear description
- category
- date and time
- location
- responsible person
- application mode
- application deadline
- participant capacity
- status
- audit trail

Only published projects are visible to volunteers.

---

## 3. Project Categories

Internal values:

```text
educational
diplomatic
ecological
sports
cultural
exhibition
mun
training
other
```

Russian UI labels:

| Internal Value | Russian UI |
|---|---|
| `educational` | Образовательный |
| `diplomatic` | Дипломатический |
| `ecological` | Экологический |
| `sports` | Спортивный |
| `cultural` | Культурный |
| `exhibition` | Выставка |
| `mun` | MUN |
| `training` | Обучение |
| `other` | Другое |

---

## 4. Project Statuses

Internal values:

```text
draft
pending_moderation
needs_revision
published
recruitment_closed
completed
cancelled
rejected
```

Russian UI labels:

| Internal Value | Russian UI | Meaning |
|---|---|---|
| `draft` | Черновик | Project is being prepared |
| `pending_moderation` | На модерации | Project is waiting for approval |
| `needs_revision` | На доработке | Project was returned for correction |
| `published` | Опубликован | Project is visible to volunteers |
| `recruitment_closed` | Набор закрыт | Project exists, but applications are closed |
| `completed` | Завершён | Project has finished |
| `cancelled` | Отменён | Project was cancelled |
| `rejected` | Отклонён | Project was rejected during moderation |

---

## 5. Project Visibility Rules

Public users and registered volunteers can see only `projects.status = published`.

Registered volunteers can apply only if:

```text
profile_completed = true
AND application deadline has not passed
AND user has not already applied
```

Managers can see projects according to permissions:

- CEO / CTO / Operations Manager: all projects
- Team leads/coordinators: projects they created or are assigned to

---

## 6. Project Creation Authority

Can create and publish immediately:

- Founder/CEO
- CTO
- Операционный менеджер

Flow:

```text
Create project
→ Fill project details
→ Choose application mode
→ Add questions if needed
→ Publish immediately
→ Project visible to volunteers
```

Can create but must use moderation:

- Тимлид волонтёров
- Менеджер по обучению
- Координатор лингвистического сопровождения
- Эко-координатор
- Координатор MUN

Flow:

```text
Create project
→ Fill project details
→ Choose application mode
→ Add questions if needed
→ Send to moderation
→ CEO/CTO/Ops reviews
→ Project is approved, returned, or rejected
```

Cannot create projects by default:

- Волонтёр
- HR-менеджер
- Logistics Manager
- PR/SMM-менеджер
- Секретарь

Exception: if the user has another role with project creation permission, they can create projects.

---

## 7. Project Creation Fields

Required MVP fields:

```text
title
description
category
application_mode
location
meeting_point
start_datetime
end_datetime
application_deadline
needed_volunteers_count
responsible_user_id
logistics_manager_id
pr_manager_id
```

Recommended Russian form labels:

| Field | Russian UI Label |
|---|---|
| `title` | Название проекта |
| `description` | Описание проекта |
| `category` | Категория |
| `application_mode` | Тип заявки |
| `location` | Локация |
| `meeting_point` | Место встречи |
| `start_datetime` | Дата и время начала |
| `end_datetime` | Дата и время окончания |
| `application_deadline` | Дедлайн подачи заявки |
| `needed_volunteers_count` | Необходимое количество волонтёров |
| `responsible_user_id` | Ответственный |
| `logistics_manager_id` | Ответственный за логистику |
| `pr_manager_id` | Ответственный за PR/SMM |

---

## 8. Project Moderation Logic

Moderators:

- Founder/CEO
- CTO
- Операционный менеджер

Moderation actions:

| Action | Russian UI |
|---|---|
| `approve` | Одобрить |
| `return_for_revision` | Вернуть на доработку |
| `reject` | Отклонить |

Moderation flow:

```text
Coordinator creates project
→ status = draft
→ coordinator sends to moderation
→ status = pending_moderation
→ moderator reviews project
→ moderator approves / returns / rejects
```

If approved:

```text
status = published
published_at = now()
moderated_by = current user
moderated_at = now()
```

If returned:

```text
status = needs_revision
moderation_comment = required explanation
moderated_by = current user
moderated_at = now()
```

If rejected:

```text
status = rejected
moderation_comment = required explanation
moderated_by = current user
moderated_at = now()
```

For return/rejection, comment is required:

```text
Укажите причину решения.
```

Required audit events:

```text
project.sent_to_moderation
project.approved
project.returned_for_revision
project.rejected
project.published
```

---

## 9. Application Modes

Every project must have one application mode.

### Quick Application

Internal value: `quick`.

Russian UI: `Быстрая заявка`.

Behavior:

```text
Volunteer clicks “Подать заявку”
→ application is created immediately
→ status = pending
→ manager reviews later
```

Best for:

- simple events
- mass volunteering
- sports projects
- cultural projects
- low-risk projects
- projects with no special skill requirements

Success message:

```text
Заявка отправлена. Ответственный менеджер рассмотрит её.
```

### Questionnaire Application

Internal value: `questionnaire`.

Russian UI: `Заявка с анкетой`.

Behavior:

```text
Volunteer opens project
→ clicks “Заполнить анкету”
→ answers project-specific questions
→ submits application
→ status = pending
→ manager reviews answers later
```

Best for:

- MUN
- diplomatic projects
- linguistic support
- training
- educational projects
- projects requiring experience, language level, confidence, responsibility

Success message:

```text
Анкета отправлена. Ответственный менеджер рассмотрит вашу заявку.
```

---

## 10. Project Questions

Question types:

| Internal Value | Russian UI |
|---|---|
| `short_text` | Короткий ответ |
| `long_text` | Развёрнутый ответ |
| `single_choice` | Один вариант |
| `multiple_choice` | Несколько вариантов |
| `yes_no` | Да / Нет |

Each question should store:

```text
project_id
question_text
question_type
is_required
options
sort_order
```

Required question behavior:

If `is_required = true`, user cannot submit questionnaire without answer.

Russian validation message:

```text
Ответьте на обязательный вопрос.
```

For `single_choice` and `multiple_choice`, manager should provide options.

Validation if options are missing:

```text
Добавьте варианты ответа для этого вопроса.
```

---

## 11. Recommended Questionnaire Examples

### MUN Project

Recommended questions:

```text
Есть ли у вас опыт участия в MUN?
На каком языке вы готовы выступать?
Готовы ли вы подготовить position paper?
Почему вы хотите участвовать в этом проекте?
Какие страны/комитеты вам интересны?
```

Recommended mode: `Заявка с анкетой`.

### Linguistic Support Project

Recommended questions:

```text
Какими языками вы владеете?
Укажите уровень каждого языка.
Есть ли у вас опыт устного перевода?
Есть ли опыт сопровождения гостей?
Готовы ли вы общаться с иностранными участниками?
```

Recommended mode: `Заявка с анкетой`.

### Eco Project

Recommended questions:

```text
Участвовали ли вы раньше в экологических проектах?
Есть ли ограничения по физической активности?
Готовы ли вы соблюдать правила безопасности?
Почему вы хотите участвовать?
```

Use questionnaire if safety/experience matters.

### Training Project

Recommended questions:

```text
Почему вы хотите пройти это обучение?
Какие навыки хотите развить?
Сколько времени готовы уделить подготовке?
Есть ли у вас похожий опыт?
```

Recommended mode: `Заявка с анкетой`.

---

## 12. Project Application Rules

Who can apply:

```text
profile_completed = true
project.status = published
application_deadline has not passed
user has not already applied to this project
```

Application should be blocked if:

```text
user is not authenticated
profile is incomplete
project is not published
application deadline passed
user already applied
project recruitment closed
project completed/cancelled
```

Russian blocking messages:

```text
Войдите или зарегистрируйтесь, чтобы подать заявку.
Заполните профиль перед подачей заявки.
Дедлайн подачи заявок уже прошёл.
Вы уже подали заявку на этот проект.
Этот проект сейчас недоступен для подачи заявки.
Набор на этот проект закрыт.
```

---

## 13. Application Statuses

| Internal Value | Russian UI |
|---|---|
| `pending` | На рассмотрении |
| `approved` | Одобрено |
| `waitlisted` | В резерве |
| `rejected` | Отклонено |
| `cancelled_by_user` | Отменено пользователем |
| `attended` | Участвовал |
| `no_show` | Не пришёл |

---

## 14. Application Review Logic

Can review all/broad applications:

- Founder/CEO
- CTO
- Операционный менеджер

Can review applications only for own/assigned projects:

- Тимлид волонтёров
- Менеджер по обучению
- Координатор лингвистического сопровождения
- Эко-координатор
- Координатор MUN

Cannot review applications by default:

- Волонтёр
- HR-менеджер
- Logistics Manager
- PR/SMM-менеджер
- Секретарь

Review actions:

| Action | Russian UI |
|---|---|
| `approve` | Одобрить |
| `waitlist` | В резерв |
| `reject` | Отклонить |

Review fields:

```text
reviewed_by
reviewed_at
review_comment
status
```

---

## 15. Approved Participant Logic

A volunteer becomes an official participant only when:

```text
project_applications.status = approved
```

Approved participants can be used for:

- participant list
- attendance marking
- logistics instructions
- project announcements
- certificate eligibility after attendance
- achievement logic

---

## 16. Waitlist and Rejection Logic

Waitlisted volunteer:

- does not count as confirmed participant
- cannot receive certificate
- should not be marked as attended unless later approved
- can later be moved to approved

Rejected volunteer:

- is not participant
- cannot be marked for attendance
- cannot receive certificate
- should see status in “Мои заявки”

MVP cancellation rule:

```text
Volunteer can cancel only pending applications.
```

---

## 17. Attendance Relationship

Attendance should be marked only for approved participants.

Allowed attendance statuses:

| Internal Value | Russian UI |
|---|---|
| `present` | Присутствовал |
| `absent` | Не пришёл |
| `late` | Опоздал |
| `excused` | По уважительной причине |

Recommended source of truth:

```text
project_applications.status = approval/review state
attendance.status = actual attendance state
```

Certificate can be uploaded only if:

```text
project_applications.status = approved
AND attendance.status = present
```

Russian error:

```text
Сертификат можно загрузить только для одобренного участника, который присутствовал на проекте.
```

---

## 18. Volunteer-Facing Application States

No application yet:

```text
Подать заявку
Заполнить анкету
```

Pending:

```text
Ваша заявка находится на рассмотрении.
Заявка отправлена
```

Approved:

```text
Вы одобрены для участия в этом проекте.
Следите за объявлениями и инструкциями по проекту.
```

Waitlisted:

```text
Вы добавлены в резерв. Ответственный менеджер свяжется с вами, если появится место.
```

Rejected:

```text
Ваша заявка была отклонена.
Вы можете подать заявку на другие проекты.
```

Cancelled:

```text
Вы отменили заявку на этот проект.
```

---

## 19. Manager-Facing Application Review Page

Page name: `Заявки на проекты`.

Required fields:

- volunteer name
- project title
- project category
- submitted date
- current status
- profile completion
- contact info
- languages
- skills
- questionnaire answers
- review comment
- actions

Manager actions:

```text
Одобрить
В резерв
Отклонить
Открыть профиль
```

---

## 20. Project Participant List

A participant list should show only approved users.

Fields:

- volunteer name
- contact
- application status
- attendance status
- certificate status
- achievement status

Used by:

- team leads
- coordinators
- operations manager
- logistics manager with limited view

---

## 21. Logistics and PR/SMM Relationship

Logistics Manager can view approved participant list and publish instructions to approved participants for assigned projects, but cannot approve/reject applicants, mark attendance, or upload certificates unless they also hold a relevant project lead/coordinator role.

PR/SMM Manager can view published projects for content preparation and create project announcements/media plans/photo reports, but cannot approve participants, mark attendance, upload certificates, or change project status unless they hold another role.

---

## 22. Important Audit Events

Project and application actions must create audit logs:

```text
project.created
project.updated
project.sent_to_moderation
project.approved
project.returned_for_revision
project.rejected
project.published
project.recruitment_closed
project.completed
project.cancelled
project_application.submitted
project_application.approved
project_application.waitlisted
project_application.rejected
project_application.cancelled_by_user
attendance.marked
```

---

## 23. Server-Side Rules

Create project if user has `create_project` permission.

Publish project if user has `publish_project` permission.

Submit project for moderation if user has `submit_project_for_moderation` permission and owns/is responsible for the project.

Moderate project if user has `moderate_projects` permission.

Apply to project if user is authenticated, profile is completed, project is published, deadline not passed, and no existing application exists.

Review application if user has broad review permission or is responsible for this project.

Mark attendance if user has broad attendance permission or is responsible for project, and target volunteer has approved application.

---

## 24. Russian UI Copy Map

Project statuses:

```text
Черновик
На модерации
На доработке
Опубликован
Набор закрыт
Завершён
Отменён
Отклонён
```

Application modes:

```text
Быстрая заявка
Заявка с анкетой
```

Application statuses:

```text
На рассмотрении
Одобрено
В резерве
Отклонено
Отменено пользователем
Участвовал
Не пришёл
```

Review actions:

```text
Одобрить
В резерв
Отклонить
```

Moderation actions:

```text
Одобрить
Вернуть на доработку
Отклонить
```

Common messages:

```text
Заявка отправлена.
Анкета отправлена.
Проект отправлен на модерацию.
Проект опубликован.
Проект возвращён на доработку.
Проект отклонён.
Заявка одобрена.
Заявка добавлена в резерв.
Заявка отклонена.
Посещаемость сохранена.
```

---

## 25. MVP Build Priority

Recommended implementation order:

1. Project table and statuses
2. Project category constants
3. Project application mode constants
4. Project list and detail pages
5. Project creation form
6. Moderation status flow
7. Quick application flow
8. Questionnaire question creation
9. Questionnaire answer submission
10. Application review page
11. Approved participant list
12. Attendance marking
13. Audit logs for project/application actions

---

## 26. Acceptance Criteria

Project and application logic is correct when:

1. Only published projects are visible to volunteers.
2. Volunteers cannot apply with incomplete profile.
3. Volunteers cannot apply after application deadline.
4. Volunteers cannot apply twice to the same project.
5. Quick application creates pending application immediately.
6. Questionnaire application requires required answers.
7. Questionnaire answers are visible to responsible managers.
8. CEO/CTO/Ops can publish projects immediately.
9. Coordinators/team leads must send projects to moderation.
10. CEO/CTO/Ops can approve, return, or reject moderated projects.
11. Returned/rejected projects require moderation comment.
12. Team leads/coordinators can manage only own/assigned projects.
13. Approved applications become official participants.
14. Waitlisted users are not official participants.
15. Rejected users cannot be marked for attendance.
16. Attendance can be marked only for approved participants.
17. Certificate eligibility can be derived from approved application + present attendance.
18. Project/application actions create audit logs.
19. All UI labels and messages are Russian.
20. Server-side checks enforce all important rules.

---

## 27. Implementation Notes for Codex

Recommended files:

```text
src/lib/constants/project-categories.ts
src/lib/constants/project-statuses.ts
src/lib/constants/application-statuses.ts
src/lib/constants/ru.ts
src/lib/projects/queries.ts
src/lib/projects/actions.ts
src/lib/projects/permissions.ts
src/lib/projects/validation.ts
src/lib/applications/queries.ts
src/lib/applications/actions.ts
src/lib/applications/validation.ts
src/lib/audit/audit-log.ts
src/components/projects/project-card.tsx
src/components/projects/project-form.tsx
src/components/projects/project-question-form.tsx
src/components/applications/application-review-table.tsx
```
