# SapaSpeakers Volunteer Platform — Database Schema

## 1. Purpose

This document defines the database structure for the SapaSpeakers Volunteer Platform MVP.

The database must support:

- volunteer profiles
- multiple roles per user
- protected Founder/CEO and CTO roles
- project creation and moderation
- project applications
- questionnaire answers
- attendance tracking
- certificate upload
- volunteer achievements
- team applications with CV upload
- announcements
- quote of the day
- audit logs

Important principle:

```text
Every real-world action should leave a digital trace.
```

The database should make it possible to trace who registered, applied, approved/rejected, attended, uploaded certificates, received achievements, assigned roles, and changed important records.

---

## 2. Recommended Stack Assumption

Recommended database: Supabase Postgres.

Recommended auth: Supabase Auth.

Recommended file storage: Supabase Storage.

Storage should be used for:

- CV files
- certificate files
- project materials
- internal documents
- media files later

---

## 3. Naming Rules

Use English technical names.

Use Russian only in user-facing UI.

Good database names:

```text
profiles
roles
user_roles
projects
project_applications
certificates
achievements
audit_logs
```

Internal enum values should be English. Russian labels should be handled in UI/constants.

Example:

```text
Database value: pending
Russian UI label: На рассмотрении
```

---

## 4. Core Entity List

Required MVP tables:

```text
profiles
roles
user_roles
departments
projects
project_questions
project_applications
project_application_answers
attendance
certificates
achievements
team_applications
announcements
quotes
audit_logs
```

Optional later tables:

```text
partners
documents
project_reports
content_calendar
public_certificate_verification
notifications
```

---

## 5. Table: `profiles`

### Purpose

Stores detailed volunteer/user profile data. Each authenticated user should have one profile.

Used for:

- volunteer identity
- project applications
- manager review
- HR review
- language/skill filtering
- certificate ownership
- achievement ownership

### Fields

```text
id uuid primary key
user_id uuid not null unique references auth.users(id) on delete cascade
first_name text not null
last_name text not null
phone text
telegram text
whatsapp text
birth_date date
city text
education_place text
languages jsonb default '[]'
skills jsonb default '[]'
interests jsonb default '[]'
volunteering_experience text
preferred_project_categories jsonb default '[]'
about text
profile_completed boolean default false
created_at timestamptz default now()
updated_at timestamptz default now()
```

### Notes

`languages` can store structured data:

```json
[
  {
    "language": "English",
    "level": "Fluent",
    "experience": ["oral_communication", "mun_debate"]
  }
]
```

`skills`, `interests`, and `preferred_project_categories` can be arrays.

### Access Rules

Volunteer can view/edit own profile. HR and management can view profiles according to permissions.

---

## 6. Table: `roles`

### Purpose

Stores all possible platform roles and whether a role is protected.

### Fields

```text
id uuid primary key
name text not null unique
display_name text not null
description text
is_protected boolean default false
created_at timestamptz default now()
```

### Seed Roles

```text
founder_ceo
cto
operations_manager
hr_manager
volunteer_teamlead
training_manager
language_coordinator
eco_coordinator
logistics_manager
pr_smm_manager
partnership_manager
mun_coordinator
secretary
volunteer
```

### Russian Display Names

| `name` | `display_name` |
|---|---|
| `founder_ceo` | Founder/CEO |
| `cto` | CTO |
| `operations_manager` | Операционный менеджер |
| `hr_manager` | HR-менеджер |
| `volunteer_teamlead` | Тимлид волонтёров |
| `training_manager` | Менеджер по обучению |
| `language_coordinator` | Координатор лингвистического сопровождения |
| `eco_coordinator` | Эко-координатор |
| `logistics_manager` | Logistics Manager |
| `pr_smm_manager` | PR/SMM-менеджер |
| `partnership_manager` | Partnership Manager |
| `mun_coordinator` | Координатор MUN |
| `secretary` | Секретарь |
| `volunteer` | Волонтёр |

Protected roles:

```text
founder_ceo
cto
```

Rules:

- cannot be removed through normal UI
- cannot be deleted from roles table
- should require manual/system-level action for dangerous changes

---

## 7. Table: `user_roles`

### Purpose

Connects users to roles. Required because one user can have multiple roles.

### Fields

```text
id uuid primary key
user_id uuid not null references auth.users(id) on delete cascade
role_id uuid not null references roles(id) on delete restrict
assigned_by uuid references auth.users(id)
assigned_at timestamptz default now()
reason text
unique(user_id, role_id)
```

### Rules

- every user should receive `volunteer` role by default
- only CEO or CTO can assign internal roles
- protected roles cannot be removed through normal UI
- every role assignment/removal must create audit log

---

## 8. Table: `departments`

### Purpose

Stores organization departments/directions.

### Fields

```text
id uuid primary key
name text not null unique
description text
lead_user_id uuid references auth.users(id)
created_at timestamptz default now()
```

### Seed Departments

```text
HR
Операции
Обучение
MUN
Лингвистическое сопровождение
Эко-направление
Логистика
PR/SMM
Партнёрства
Секретариат
```

---

## 9. Table: `projects`

### Purpose

Stores volunteer projects/events. Projects are the central operational unit of the platform.

### Fields

```text
id uuid primary key
title text not null
description text not null
category text not null
status text not null default 'draft'
application_mode text not null default 'quick'
location text
meeting_point text
start_datetime timestamptz not null
end_datetime timestamptz
application_deadline timestamptz
needed_volunteers_count integer
created_by uuid not null references auth.users(id)
responsible_user_id uuid references auth.users(id)
logistics_manager_id uuid references auth.users(id)
pr_manager_id uuid references auth.users(id)
moderation_comment text
moderated_by uuid references auth.users(id)
moderated_at timestamptz
published_at timestamptz
created_at timestamptz default now()
updated_at timestamptz default now()
```

### Project Categories

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

### Project Statuses

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

Russian labels:

| Internal Value | Russian UI |
|---|---|
| `draft` | Черновик |
| `pending_moderation` | На модерации |
| `needs_revision` | На доработке |
| `published` | Опубликован |
| `recruitment_closed` | Набор закрыт |
| `completed` | Завершён |
| `cancelled` | Отменён |
| `rejected` | Отклонён |

Only projects with status `published` are visible to volunteers.

### Application Modes

| Internal Value | Russian UI |
|---|---|
| `quick` | Быстрая заявка |
| `questionnaire` | Заявка с анкетой |

---

## 10. Table: `project_questions`

### Purpose

Stores custom questionnaire questions for projects where `application_mode = questionnaire`.

### Fields

```text
id uuid primary key
project_id uuid not null references projects(id) on delete cascade
question_text text not null
question_type text not null
is_required boolean default false
options jsonb default '[]'
sort_order integer default 0
created_at timestamptz default now()
```

### Question Types

| Internal Value | Russian UI |
|---|---|
| `short_text` | Короткий ответ |
| `long_text` | Развёрнутый ответ |
| `single_choice` | Один вариант |
| `multiple_choice` | Несколько вариантов |
| `yes_no` | Да / Нет |

---

## 11. Table: `project_applications`

### Purpose

Stores volunteer applications to projects. Project application does not mean participation; only approved application means official participation.

### Fields

```text
id uuid primary key
project_id uuid not null references projects(id) on delete cascade
user_id uuid not null references auth.users(id) on delete cascade
status text not null default 'pending'
submitted_at timestamptz default now()
reviewed_by uuid references auth.users(id)
reviewed_at timestamptz
review_comment text
cancelled_at timestamptz
unique(project_id, user_id)
```

### Application Statuses

| Internal Value | Russian UI |
|---|---|
| `pending` | На рассмотрении |
| `approved` | Одобрено |
| `waitlisted` | В резерве |
| `rejected` | Отклонено |
| `cancelled_by_user` | Отменено пользователем |
| `attended` | Участвовал |
| `no_show` | Не пришёл |

### Rules

- user can apply only once to the same project
- user cannot apply if profile is incomplete
- user cannot apply after deadline
- project must be published
- application status begins as `pending`
- only approved users are official participants

---

## 12. Table: `project_application_answers`

### Purpose

Stores answers to project questionnaire questions.

### Fields

```text
id uuid primary key
application_id uuid not null references project_applications(id) on delete cascade
question_id uuid not null references project_questions(id) on delete cascade
answer_text text
answer_json jsonb
created_at timestamptz default now()
unique(application_id, question_id)
```

Use `answer_text` for short/long text and simple yes/no. Use `answer_json` for multiple choice or structured answers.

---

## 13. Table: `attendance`

### Purpose

Tracks whether approved participants attended a project. Attendance is required before certificates can be uploaded.

### Fields

```text
id uuid primary key
project_id uuid not null references projects(id) on delete cascade
user_id uuid not null references auth.users(id) on delete cascade
status text not null
marked_by uuid not null references auth.users(id)
marked_at timestamptz default now()
comment text
unique(project_id, user_id)
```

### Attendance Statuses

| Internal Value | Russian UI |
|---|---|
| `present` | Присутствовал |
| `absent` | Не пришёл |
| `late` | Опоздал |
| `excused` | По уважительной причине |

Attendance can be marked only for users with approved project application.

Certificate can be uploaded only if:

```text
project application status = approved
AND attendance status = present
```

Preferred MVP source of truth:

```text
Attendance table is source of truth.
Application status can remain approved.
```

---

## 14. Table: `certificates`

### Purpose

Stores uploaded certificates for volunteers.

### Fields

```text
id uuid primary key
user_id uuid not null references auth.users(id) on delete cascade
project_id uuid references projects(id) on delete set null
title text not null
file_url text not null
file_name text
certificate_type text
uploaded_by uuid not null references auth.users(id)
issued_at date
status text not null default 'uploaded'
comment text
created_at timestamptz default now()
updated_at timestamptz default now()
```

### Certificate Statuses

| Internal Value | Russian UI |
|---|---|
| `uploaded` | Загружен |
| `confirmed` | Подтверждён |
| `rejected` | Отклонён |

Certificate upload is allowed only if:

```text
approved project application exists
AND attendance status = present
```

This rule must be enforced server-side.

---

## 15. Table: `achievements`

### Purpose

Stores verified volunteer achievements.

### Fields

```text
id uuid primary key
user_id uuid not null references auth.users(id) on delete cascade
project_id uuid references projects(id) on delete set null
title text not null
description text
type text
source text not null default 'manual'
awarded_by uuid references auth.users(id)
awarded_at timestamptz default now()
created_at timestamptz default now()
```

### Achievement Sources

| Internal Value | Russian UI |
|---|---|
| `automatic` | Автоматически |
| `manual` | Вручную |
| `certificate_based` | На основе сертификата |
| `attendance_based` | На основе посещаемости |

Achievement examples:

```text
Участник проекта
Участник экологического проекта
Участник MUN-проекта
Прошёл обучение
Помог на выставке
Волонтёр 10+ часов
Волонтёр 25+ часов
Участник дипломатического проекта
Участник культурного проекта
Участник спортивного проекта
```

---

## 16. Table: `team_applications`

### Purpose

Stores applications from volunteers who want to join internal team/leadership roles.

### Fields

```text
id uuid primary key
user_id uuid not null references auth.users(id) on delete cascade
desired_role_id uuid references roles(id)
motivation text not null
experience text
skills_summary text
availability text
cv_file_url text
links jsonb default '{}'
status text not null default 'pending'
hr_comment text
final_comment text
reviewed_by_hr uuid references auth.users(id)
hr_reviewed_at timestamptz
decided_by uuid references auth.users(id)
decided_at timestamptz
created_at timestamptz default now()
updated_at timestamptz default now()
```

### Team Application Statuses

| Internal Value | Russian UI |
|---|---|
| `pending` | На рассмотрении |
| `hr_review` | Проверяется HR |
| `interview` | Собеседование |
| `recommended` | Рекомендован |
| `approved` | Одобрен |
| `rejected` | Отклонён |
| `needs_clarification` | Нужно уточнение |

Example `links` JSON:

```json
{
  "telegram": "@username",
  "instagram": "https://instagram.com/example",
  "linkedin": "https://linkedin.com/in/example",
  "portfolio": "https://example.com"
}
```

Rules:

- any registered volunteer can submit team application
- CV upload is required or strongly recommended
- HR can review and recommend
- HR cannot assign official role
- only CEO/CTO can make final decision
- approval assigns role in `user_roles` and creates audit log

---

## 17. Table: `announcements`

### Purpose

Stores organization announcements.

### Fields

```text
id uuid primary key
title text not null
body text not null
audience_type text not null default 'all_volunteers'
project_id uuid references projects(id) on delete cascade
created_by uuid not null references auth.users(id)
status text not null default 'draft'
published_at timestamptz
created_at timestamptz default now()
updated_at timestamptz default now()
```

### Audience Types

| Internal Value | Russian UI |
|---|---|
| `all_volunteers` | Все волонтёры |
| `team` | Команда |
| `project_participants` | Участники проекта |

### Announcement Statuses

| Internal Value | Russian UI |
|---|---|
| `draft` | Черновик |
| `published` | Опубликовано |
| `archived` | В архиве |

Can publish:

- CEO
- CTO
- Operations Manager
- PR/SMM Manager

Can draft:

- Secretary
- HR Manager for HR announcements
- Coordinators for project-related announcements if allowed

---

## 18. Table: `quotes`

### Purpose

Stores motivational quotes for volunteer dashboard.

### Fields

```text
id uuid primary key
text text not null
author text
is_active boolean default true
created_at timestamptz default now()
```

Seed quotes:

```text
Большие изменения начинаются с маленького доброго действия.
Волонтёрство — это не свободное время, а свободный выбор.
Сильная команда строится не на словах, а на ответственности.
```

MVP rotation logic:

```text
active_quotes[day_of_year % active_quotes.length]
```

---

## 19. Table: `audit_logs`

### Purpose

Stores important platform actions.

### Fields

```text
id uuid primary key
actor_user_id uuid references auth.users(id)
action text not null
target_type text
target_id uuid
old_value jsonb
new_value jsonb
comment text
created_at timestamptz default now()
```

### Required Audit Events

```text
role.assigned
role.removed
role.change_blocked
project.created
project.published
project.sent_to_moderation
project.approved
project.returned_for_revision
project.rejected
project.cancelled
project.completed
project_application.submitted
project_application.approved
project_application.rejected
project_application.waitlisted
attendance.marked
certificate.uploaded
certificate.confirmed
certificate.rejected
achievement.awarded
team_application.submitted
team_application.hr_reviewed
team_application.recommended
team_application.approved
team_application.rejected
settings.updated
```

---

## 20. Optional Later Tables

### `partners`

```text
id uuid primary key
name text not null
contact_person text
phone text
email text
status text
notes text
created_by uuid references auth.users(id)
created_at timestamptz default now()
updated_at timestamptz default now()
```

### `documents`

```text
id uuid primary key
title text not null
file_url text not null
file_name text
category text
visibility text
uploaded_by uuid references auth.users(id)
created_at timestamptz default now()
```

### `project_reports`

```text
id uuid primary key
project_id uuid references projects(id) on delete cascade
created_by uuid references auth.users(id)
summary text
impact_metrics jsonb default '{}'
problems text
recommendations text
created_at timestamptz default now()
```

### `notifications`

```text
id uuid primary key
user_id uuid references auth.users(id) on delete cascade
title text not null
body text
type text
read_at timestamptz
created_at timestamptz default now()
```

---

## 21. Core Relationships

```text
auth.users.id → profiles.user_id
auth.users.id → user_roles.user_id
roles.id → user_roles.role_id
auth.users.id → projects.created_by
auth.users.id → projects.responsible_user_id
auth.users.id → projects.logistics_manager_id
auth.users.id → projects.pr_manager_id
projects.id → project_applications.project_id
project_applications.id → project_application_answers.application_id
project_questions.id → project_application_answers.question_id
projects.id → attendance.project_id
auth.users.id → attendance.user_id
projects.id → certificates.project_id
auth.users.id → certificates.user_id
projects.id → achievements.project_id
auth.users.id → achievements.user_id
auth.users.id → team_applications.user_id
roles.id → team_applications.desired_role_id
```

---

## 22. Required Indexes

Recommended indexes:

```text
profiles(user_id)
user_roles(user_id)
user_roles(role_id)
projects(status)
projects(category)
projects(start_datetime)
projects(created_by)
projects(responsible_user_id)
project_questions(project_id)
project_applications(project_id)
project_applications(user_id)
project_applications(status)
project_applications(project_id, user_id)
project_application_answers(application_id)
attendance(project_id)
attendance(user_id)
attendance(project_id, user_id)
certificates(user_id)
certificates(project_id)
certificates(status)
achievements(user_id)
achievements(project_id)
team_applications(user_id)
team_applications(status)
team_applications(desired_role_id)
announcements(status)
announcements(audience_type)
announcements(project_id)
audit_logs(actor_user_id)
audit_logs(action)
audit_logs(target_type)
audit_logs(created_at)
```

---

## 23. Row Level Security Direction

Profiles: volunteers can read/update own profile; HR/management can read according to permission.

Roles: authenticated users may read role labels; only privileged server actions modify roles.

User roles: users can read own roles; CEO/CTO can manage through server action; protected role changes blocked server-side.

Projects: public/authenticated users can read published projects; managers manage according to permission.

Project applications: volunteers create/read own applications; responsible managers review own project applications; CEO/CTO/Ops can review broadly.

Attendance: volunteers can read own attendance if needed; responsible managers and leadership can mark according to permission.

Certificates: volunteers read own certificates; responsible managers upload for eligible participants; leadership can manage broadly.

Team applications: volunteers create/read own; HR reviews; CEO/CTO decide and assign roles.

Audit logs: only CEO/CTO should read all audit logs.

---

## 24. Important Server-Side Business Rules

### Project Application Rule

A volunteer can apply only if:

```text
user is authenticated
profile is completed
project.status = published
application_deadline has not passed
user has not already applied
```

### Project Approval Rule

A manager can approve/reject/waitlist application only if they have broad review permission or are responsible for that project.

### Attendance Rule

Attendance can be marked only for users with approved project application.

### Certificate Rule

Certificate can be uploaded only if:

```text
approved project application exists
AND attendance.status = present
```

### Role Assignment Rule

Role can be assigned only if actor has `manage_roles` permission and is Founder/CEO or CTO.

### Protected Role Rule

Protected role cannot be removed through normal UI/server action. If attempted: block action, create audit log, return Russian error:

```text
Эта роль защищена и не может быть изменена через обычную панель.
```

---

## 25. Supabase Storage Buckets

Recommended buckets:

```text
certificates
cvs
documents
project-media
```

### `certificates`

Stores uploaded certificate files.

Access:

- volunteer can read own certificate file
- managers can upload according to permission
- files should not be public by default unless later public verification is added

### `cvs`

Stores CV files for team applications.

Access:

- applicant can upload own CV
- HR can read CVs
- CEO/CTO can read CVs

---

## 26. MVP Migration Order

Recommended migration order:

```text
0001_profiles.sql
0002_roles_user_roles.sql
0003_departments.sql
0004_projects.sql
0005_project_applications.sql
0006_attendance_certificates_achievements.sql
0007_team_applications.sql
0008_announcements_quotes.sql
0009_audit_logs.sql
0010_storage_policies.sql
```

---

## 27. Seed Data Requirements

Seed:

1. roles
2. departments
3. quotes
4. optional first protected users/roles manually

---

## 28. Acceptance Criteria

Database schema is acceptable when:

1. One user can have multiple roles.
2. Founder/CEO and CTO roles are marked as protected.
3. Volunteer profile has all required fields.
4. Project can store category, status, application mode, dates, and responsible people.
5. Project questionnaire questions can be stored.
6. Project applications can store statuses and review data.
7. Questionnaire answers can be linked to applications.
8. Attendance can be marked per project and user.
9. Certificate upload can be linked to user and project.
10. Achievements can be linked to user and project.
11. Team applications can store desired role, CV, HR comment, and final decision.
12. Announcements can target all volunteers, team, or project participants.
13. Quotes can rotate on dashboard.
14. Audit logs can store actor, action, target, old/new value, and comment.
15. Storage buckets are planned for certificates and CVs.
16. Core indexes support normal dashboard/admin queries.
17. Server-side business rules can be implemented cleanly on top of this schema.
18. Russian UI labels are not hardcoded into database logic unnecessarily.

---

## 29. Implementation Notes for Codex

When implementing database schema, Codex should:

1. Create Supabase migrations.
2. Use English table and column names.
3. Add foreign keys.
4. Add unique constraints where required.
5. Add indexes.
6. Seed roles.
7. Seed departments.
8. Seed quotes.
9. Enable RLS if using Supabase.
10. Add simple RLS policies carefully.
11. Avoid overcomplicated permission database tables in MVP unless necessary.
12. Keep protected role logic in server actions/helpers too, not only database.
13. Create storage bucket policies for CVs and certificates.
14. Avoid building optional v2 tables unless explicitly requested.
