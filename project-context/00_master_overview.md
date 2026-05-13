# SapaSpeakers Volunteer Platform — Master Overview

## 1. Project Identity

Project name: SapaSpeakers Volunteer Platform

Organization name: SapaSpeakers

Product type: Internal volunteering organization operating system

This is not a SaaS platform. The platform is built only for the internal needs of SapaSpeakers.

The platform should combine:

- public volunteer recruitment website
- volunteer личный кабинет
- project application system
- internal role and hierarchy management
- project moderation system
- attendance tracking
- certificates and achievements
- team application flow
- basic operational/admin tools

The main goal is to make SapaSpeakers more structured, disciplined, trusted, scalable, and professional.

---

## 2. Core Product Idea

SapaSpeakers needs a system where a person can:

1. register as a volunteer
2. complete a detailed profile
3. apply to projects
4. be reviewed and approved by responsible managers
5. participate in real projects
6. receive certificates
7. build verified contribution history
8. apply to internal team roles later

The key product principle:

Registration is open.  
Participation is controlled.

A user can register freely, but registration does not automatically make them a participant in any project.

Every project requires a separate application and approval.

---

## 3. Main Product Goals

The platform must help the organization:

- publish announcements
- publish projects
- recruit volunteers
- collect volunteer applications
- approve or reject project applicants
- manage internal team roles
- manage volunteer profiles
- allow volunteers to apply to internal positions
- upload CVs for team applications
- track attendance
- upload certificates
- store volunteer achievements
- show certificates in volunteer accounts
- record important operational actions
- create a digital trace of real-world contribution
- improve public trust and reputation

---

## 4. Language Requirement

The full user-facing platform must be in Russian.

All visible UI text must be Russian:

- public website
- landing page
- auth pages
- dashboard
- личный кабинет
- navigation
- forms
- buttons
- validation messages
- empty states
- statuses
- role names
- project categories
- admin pages
- certificates
- achievements
- success/error messages

Technical names may be English:

- database table names
- code variables
- API routes
- TypeScript types
- permission keys
- internal enum values

The UI must not mix Russian, English, and Kazakh unless explicitly changed later.

---

## 5. Design Identity

The platform should feel:

- serious
- minimalistic
- professional
- organized
- warm
- trustworthy
- clean

Color palette:

| Name | Hex | Usage |
|---|---:|---|
| Bleu Oxford | `#0B0829` | Main serious/dark identity color, sidebar, headings, strong text |
| Orange | `#FF8400` | Primary buttons, actions, active states, important highlights |
| Amande | `#F9DEC6` | Warm backgrounds, soft cards, calm sections |
| Vista Bleu | `#8FA0D8` | Secondary accents, badges, info blocks |

Important design rule:

Do not overuse orange. Orange should mean action or importance.

---

## 6. Founding Context

Current leadership:

| Person | Current Role |
|---|---|
| Adiat | Founder/CEO |
| Said Amanzhol | CTO |
| Adiat | Partnership Manager temporarily |

Adiat currently acts as both Founder/CEO and Partnership Manager.

Said Amanzhol acts as CTO.

Authority model:

- CEO owns the organization.
- CTO owns the platform/system.
- Operations Manager runs daily operations.
- CEO or CTO can assign roles.
- Founder/CEO and CTO roles are protected.

---

## 7. Planned Organization Hierarchy

Internal roles:

- Founder/CEO — 1
- CTO — 1
- Операционный менеджер — 1
- HR-менеджер — 2
- Тимлид волонтёров — 3
- Менеджер по обучению — 2
- Координатор лингвистического сопровождения — 2
- Эко-координатор — 1
- Logistics Manager — 2
- PR/SMM-менеджер — 2
- Partnership Manager — 1
- Координатор MUN — 2
- Секретарь — 1
- Волонтёр — regular registered role

Important database rule:

One user may have multiple roles.

Example:

- Adiat = Founder/CEO + Partnership Manager
- Said = CTO

Do not design the database as one fixed role per user.

Use:

- `roles`
- `user_roles`

---

## 8. Authority Principles

### Founder/CEO

Founder/CEO is the highest organizational authority.

Owns:

- organization structure
- final organizational decisions
- role assignment authority
- team application final decisions
- high-level project approval
- organization-level data

### CTO

CTO is the highest technical/system authority.

Owns:

- platform structure
- access control
- role and permission system
- technical safety
- audit and system integrity
- fixing access/system issues

### Operations Manager

Operations Manager is the main daily operator.

Owns:

- daily project execution
- project operations
- project moderation
- project applications
- attendance
- certificates
- operational announcements
- operational statistics

Cannot change:

- protected CEO/CTO roles
- system-level permission structure
- protected settings

---

## 9. Protected Role Rule

Founder/CEO and CTO are protected roles.

They should not be removable or editable through normal admin UI.

Changing these roles should require:

- manual database action, or
- special protected system mode, or
- explicit technical intervention

Normal role assignment pages must block protected-role removal.

Every role change must create an audit log.

Audit log should include:

- actor user
- affected user
- old role/value
- new role/value
- reason/comment
- timestamp

---

## 10. Main User Types

### Public Visitor

Can:

- view public pages
- read about the organization
- view public projects
- register
- start volunteer journey

Cannot:

- apply to projects without login
- access private project data
- access личный кабинет

### Volunteer

Can:

- register
- complete profile
- view announcements
- view published projects
- apply to projects
- track own project applications
- view own achievements
- download own certificates
- edit own profile
- apply to team/internal roles with CV

Cannot:

- create projects
- approve applications
- mark attendance
- upload certificates
- assign roles
- access admin pages

### Internal Team Member

Can access management tools based on assigned roles.

Examples:

- HR Manager
- Team Lead
- MUN Coordinator
- PR/SMM Manager
- Secretary

### CEO / CTO

Can access highest-level control surfaces.

They manage:

- role assignment
- team application decisions
- project moderation
- audit logs
- protected system areas

---

## 11. Core Platform Modules

MVP modules:

1. Public website
2. Authentication
3. Volunteer profile
4. Role system
5. Role-based navigation
6. Личный кабинет
7. Announcements
8. Projects
9. Project applications
10. Project questionnaires
11. Project moderation
12. Attendance
13. Certificates
14. Achievements
15. Team applications with CV upload
16. HR review workflow
17. CEO/CTO role assignment
18. Audit logs
19. Quote of the day

---

## 12. Public Pages

Public route structure:

```text
/
/login
/register
/about
/projects
/join
/team-application
/contacts
```

Public pages:

- Главная
- О нас
- Проекты
- Стать волонтёром
- Заявка в команду
- Контакты

After login, users should not be redirected to the public landing page.

They should go to:

```text
/app
```

---

## 13. Authenticated Volunteer Pages

Volunteer route structure:

```text
/app
/app/announcements
/app/projects
/app/projects/[id]
/app/applications
/app/achievements
/app/certificates
/app/profile
```

Volunteer sidebar:

- Личный кабинет
- Объявления
- Проекты
- Мои заявки
- Мои достижения
- Сертификаты
- Профиль

---

## 14. Admin / Management Pages

Admin route structure:

```text
/admin/volunteers
/admin/team-applications
/admin/project-applications
/admin/projects
/admin/moderation
/admin/attendance
/admin/certificates
/admin/roles
/admin/stats
/admin/documents
/admin/partners
/admin/settings
/admin/audit-logs
```

Important UX rule:

Do not show locked pages in the sidebar.

Only show pages the current user can actually access.

---

## 15. Project Categories

Internal values can be English.

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

## 16. Project Application Principle

Every project has an application mode.

Application modes:

1. `quick` — Быстрая заявка
2. `questionnaire` — Заявка с анкетой

Quick application:

- volunteer clicks “Подать заявку”
- application is created immediately
- status becomes “На рассмотрении”

Questionnaire application:

- volunteer answers project-specific questions
- answers are saved
- responsible manager reviews answers
- status becomes “На рассмотрении”

Participation is not automatic.

Only approved volunteers become official project participants.

---

## 17. Project Creation and Moderation

Roles that can publish projects immediately:

- Founder/CEO
- CTO
- Operations Manager

Roles that can create projects but must send them to moderation:

- Тимлид волонтёров
- Менеджер по обучению
- Координатор лингвистического сопровождения
- Эко-координатор
- Координатор MUN

Moderators:

- Founder/CEO
- CTO
- Operations Manager

Project statuses:

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

Only published projects are visible to volunteers.

---

## 18. Project Application Statuses

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

## 19. Team Application Flow

Volunteers can apply to internal team roles.

Flow:

```text
Volunteer opens “Заявка в команду”
→ selects desired role
→ fills motivation and experience
→ uploads CV
→ submits application
→ HR reviews profile/CV
→ HR recommends candidate
→ Founder/CEO or CTO makes final decision
→ if approved, role is assigned
→ audit log is created
```

HR can recommend.

Only Founder/CEO or CTO can assign the actual role.

---

## 20. Certificate Logic

Certificate can be uploaded only if:

1. volunteer was approved for the project
2. volunteer was marked as present/attended

Certificate flow:

```text
Project completed
→ attendance marked
→ certificate uploaded
→ certificate appears in volunteer личный кабинет
→ achievement is created or confirmed
```

Certificate statuses:

| Internal Value | Russian UI |
|---|---|
| `uploaded` | Загружен |
| `confirmed` | Подтверждён |
| `rejected` | Отклонён |

---

## 21. Achievement Logic

Achievements should be partly automatic and partly manual.

Examples:

- Участник проекта
- Участник экологического проекта
- Участник MUN-проекта
- Прошёл обучение
- Помог на выставке
- Волонтёр 10+ часов
- Волонтёр 25+ часов
- Участник дипломатического проекта
- Участник культурного проекта
- Участник спортивного проекта

Achievement sources:

- `automatic`
- `manual`
- `certificate_based`
- `attendance_based`

---

## 22. Announcement Logic

Announcement audiences for MVP:

| Internal Value | Russian UI |
|---|---|
| `all_volunteers` | Все волонтёры |
| `team` | Команда |
| `project_participants` | Участники проекта |

Announcement statuses:

| Internal Value | Russian UI |
|---|---|
| `draft` | Черновик |
| `published` | Опубликовано |
| `archived` | В архиве |

Can publish announcements:

- CEO
- CTO
- Operations Manager
- PR/SMM Manager

Secretary can create drafts.

---

## 23. Database Architecture Direction

Use English table names.

Core tables:

- `profiles`
- `roles`
- `user_roles`
- `departments`
- `projects`
- `project_questions`
- `project_applications`
- `project_application_answers`
- `attendance`
- `certificates`
- `achievements`
- `team_applications`
- `announcements`
- `quotes`
- `audit_logs`

Optional later:

- `partners`
- `documents`
- `project_reports`
- `content_calendar`
- `public_certificate_verification`
- `notifications`

---

## 24. MVP Must-Have Scope

Must-have MVP features:

1. Public landing page
2. Russian UI
3. Authentication
4. Detailed volunteer profile
5. Multiple-role system
6. Protected Founder/CEO and CTO roles
7. Role-based navigation
8. Volunteer dashboard / личный кабинет
9. Announcements
10. Projects
11. Quick project application
12. Questionnaire project application
13. Project applications
14. Project moderation
15. Attendance
16. Certificate upload
17. Certificates visible in volunteer profile
18. Achievements
19. Team applications with CV upload
20. HR review statuses
21. CEO/CTO role assignment
22. Audit logs for role changes and major actions
23. Motivational quote of the day

---

## 25. Postponed V2 Features

Postpone:

- mobile app
- payment system
- AI assistant
- public certificate verification
- advanced CRM for partners
- advanced analytics
- automatic PDF certificate generation
- public impact report generator
- complex notification system
- content calendar
- advanced badge system
- advanced gamification
- public volunteer ranking

---

## 26. Core Product Principles

### Principle 1: Open registration, controlled participation

Anyone can register.

Only approved applicants participate in projects.

### Principle 2: One user can have multiple roles

Do not use one fixed role per user.

Use role relations.

### Principle 3: Permissions should be action-based

Do not rely only on role names.

Use permission/helper checks.

### Principle 4: Protected authority must be safe

Founder/CEO and CTO roles must not be casually changed.

### Principle 5: Volunteers need simple personal experience

Volunteer UI should be clean and easy.

The volunteer should quickly see:

- my projects
- my applications
- my certificates
- my achievements
- announcements

### Principle 6: Managers need operational tools

Managers need access to:

- applications
- attendance
- project participants
- certificates
- reports
- relevant project data

### Principle 7: Every important action leaves a trace

The platform should record:

- project created
- project approved
- application submitted
- application reviewed
- attendance marked
- certificate uploaded
- achievement awarded
- role assigned

---

## 27. Recommended First Build Strategy

Do not start by building all features at once.

First implementation phase should create:

1. Next.js project skeleton
2. public route structure
3. authenticated app route structure
4. admin route structure
5. Russian UI constants
6. role constants
7. permission helper structure
8. Supabase client/server setup
9. first database migration draft
10. protected layouts
11. placeholder pages for all MVP routes

First Codex task should not implement all business logic.

Correct first Codex goal:

Create the stable project skeleton and architecture boundaries.

Business logic should be implemented in later controlled phases.
