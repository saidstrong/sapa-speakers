# SapaSpeakers Volunteer Platform — MVP Scope

## 1. Purpose

This document defines what must be built in the MVP, what can be treated as medium priority, and what must be postponed to v2 or later.

The MVP should not try to become a huge system immediately.

The first version must prove the core operating model:

```text
Volunteer registers
→ completes profile
→ applies to project
→ gets reviewed
→ attends project
→ receives certificate
→ receives achievement
→ builds verified contribution history
```

The MVP must focus on discipline, structure, and trust.

---

## 2. MVP Definition

The MVP is the first usable internal operating system for SapaSpeakers.

It must support the real work of the organization:

- public volunteer recruitment
- volunteer registration
- detailed volunteer profiles
- project publishing
- project applications
- project moderation
- attendance tracking
- certificates
- achievements
- internal team applications
- role assignment
- audit logs

The MVP should be good enough for the organization to use with real volunteers.

It does not need to include every future feature.

---

## 3. Core MVP Principle

The MVP must enforce this rule:

```text
Registration is open.
Project participation is controlled.
```

This means:

- anyone can register as a volunteer
- registration does not automatically mean project participation
- every project requires separate application
- every application requires review
- only approved volunteers become participants
- certificates require approved participation and attendance

---

## 4. MVP Success Criteria

The MVP is successful if SapaSpeakers can use it to:

1. publish public information about the organization
2. register volunteers
3. collect detailed volunteer profiles
4. publish projects
5. collect project applications
6. review and approve/reject applications
7. track attendance
8. upload certificates
9. show certificates to volunteers
10. store achievements
11. process team applications
12. assign internal roles
13. protect CEO/CTO access
14. view audit history for important actions

---

# 5. Must-Have MVP Features

## 5.1 Public Website

Required pages:

```text
/
/about
/projects
/join
/team-application
/contacts
```

The public website must include:

- organization introduction
- mission
- project categories
- public project list
- call to action to register
- call to action to apply to team
- contact/social links

Required CTAs:

```text
Стать волонтёром
Посмотреть проекты
Подать заявку в команду
```

Acceptance criteria:

- public visitor can understand what SapaSpeakers is
- public visitor can see published projects
- public visitor can start registration
- public UI is fully Russian
- design feels professional and trustworthy

---

## 5.2 Authentication

Required pages:

```text
/login
/register
```

Required functionality:

- register account
- log in
- log out
- redirect logged-in user to `/app`
- redirect new user to profile completion

Basic registration fields:

```text
Имя
Фамилия
Email
Телефон
Пароль
Повторите пароль
```

Acceptance criteria:

- user can register
- user can log in
- user can log out
- authenticated pages are protected
- auth UI is fully Russian

---

## 5.3 Volunteer Profile

Required route: `/app/profile`.

Required profile fields:

```text
Имя
Фамилия
Email
Телефон
Дата рождения
Город
Учебное заведение / место работы
Telegram
WhatsApp
Языки
Навыки
Интересы
Опыт волонтёрства
Предпочитаемые направления проектов
Кратко о себе
```

Required functionality:

- create profile after registration
- edit own profile
- calculate/store profile completion
- block project applications until profile is complete

Acceptance criteria:

- volunteer can fill profile
- volunteer can update profile
- profile completion is visible
- incomplete profile blocks project application
- profile UI is fully Russian

---

## 5.4 Role System

Required tables:

```text
roles
user_roles
```

Required roles:

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

Required functionality:

- one user can have multiple roles
- new users receive volunteer role
- CEO/CTO can assign roles
- protected roles cannot be removed through normal UI
- role changes create audit logs

Protected roles:

```text
founder_ceo
cto
```

Acceptance criteria:

- Adiat can be Founder/CEO + Partnership Manager
- Said can be CTO
- user can have multiple roles
- HR cannot assign roles
- Operations Manager cannot assign roles
- protected roles are blocked from normal removal
- role changes are audit-logged

---

## 5.5 Permission-Based Navigation

Required functionality:

- sidebar generated from permissions
- inaccessible pages hidden
- server-side route protection
- Russian navigation labels

Required volunteer sidebar:

```text
Личный кабинет
Объявления
Проекты
Мои заявки
Мои достижения
Сертификаты
Профиль
```

Acceptance criteria:

- regular volunteer does not see admin pages
- CEO/CTO see role/audit/control pages
- HR sees HR pages
- team leads see project management pages
- frontend hiding is backed by server-side checks

---

## 5.6 Volunteer Dashboard

Required route: `/app`.

Required blocks:

- welcome message
- quote of the day
- profile completion status
- active applications
- approved upcoming projects
- latest announcements
- latest certificates
- latest achievements

Required quote examples:

```text
Большие изменения начинаются с маленького доброго действия.
Волонтёрство — это не свободное время, а свободный выбор.
Сильная команда строится не на словах, а на ответственности.
```

Acceptance criteria:

- volunteer sees personal dashboard after login
- dashboard shows profile completion warning if needed
- quote rotates by date
- dashboard copy is Russian
- dashboard is simple, not overloaded

---

## 5.7 Announcements

Required route: `/app/announcements`.

Management can be handled through `/admin/announcements` if added, or through related admin pages in MVP.

Required audience types:

```text
all_volunteers
team
project_participants
```

Russian labels:

```text
Все волонтёры
Команда
Участники проекта
```

Required statuses:

```text
draft
published
archived
```

Russian labels:

```text
Черновик
Опубликовано
В архиве
```

Acceptance criteria:

- volunteers can see relevant announcements
- team announcements are not shown to regular volunteers without internal roles
- project participant announcements are visible only to approved participants
- announcement UI is Russian

---

## 5.8 Projects

Required routes:

```text
/app/projects
/app/projects/[id]
/admin/projects
```

Required project fields:

```text
title
description
category
status
application_mode
location
meeting_point
start_datetime
end_datetime
application_deadline
needed_volunteers_count
created_by
responsible_user_id
logistics_manager_id
pr_manager_id
published_at
```

Required categories:

```text
Образовательный
Дипломатический
Экологический
Спортивный
Культурный
Выставка
MUN
Обучение
Другое
```

Acceptance criteria:

- managers can create projects
- published projects are visible to volunteers
- unpublished projects are hidden from volunteers
- project cards show important information
- project detail page allows application
- all project UI is Russian

---

## 5.9 Project Moderation

Required route: `/admin/moderation`.

Statuses:

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

Can publish immediately:

```text
Founder/CEO
CTO
Операционный менеджер
```

Must send to moderation:

```text
Тимлид волонтёров
Менеджер по обучению
Координатор лингвистического сопровождения
Эко-координатор
Координатор MUN
```

Moderators:

```text
Founder/CEO
CTO
Операционный менеджер
```

Required moderation actions:

```text
Одобрить
Вернуть на доработку
Отклонить
```

Acceptance criteria:

- high-authority roles can publish directly
- coordinators cannot publish directly
- projects on moderation can be approved, returned, or rejected
- return/reject requires comment
- moderation actions create audit logs

---

## 5.10 Project Application Modes

Every project must support one of two modes:

### Quick Application

Internal value: `quick`.

Russian UI: `Быстрая заявка`.

Behavior:

```text
Volunteer clicks “Подать заявку”
→ application created
→ status = pending
```

### Questionnaire Application

Internal value: `questionnaire`.

Russian UI: `Заявка с анкетой`.

Question types:

```text
Короткий ответ
Развёрнутый ответ
Один вариант
Несколько вариантов
Да / Нет
```

Acceptance criteria:

- project creator can choose application mode
- quick application submits immediately
- questionnaire application requires answers
- required questions block submission if unanswered
- answers are visible to responsible managers

---

## 5.11 Project Applications

Required routes:

```text
/app/applications
/admin/project-applications
```

Required statuses:

```text
На рассмотрении
Одобрено
В резерве
Отклонено
Отменено пользователем
Участвовал
Не пришёл
```

Required rules:

- user cannot apply with incomplete profile
- user cannot apply twice to same project
- user cannot apply after deadline
- application starts as pending
- approved application means official participant

Acceptance criteria:

- volunteer can submit application
- volunteer can track application status
- manager can approve/reject/waitlist
- waitlisted user is not official participant
- rejected user cannot receive certificate
- project application actions create audit logs

---

## 5.12 Attendance

Required route: `/admin/attendance`.

Required statuses:

```text
Присутствовал
Не пришёл
Опоздал
По уважительной причине
```

Required rules:

- attendance can be marked only for approved participants
- only authorized managers can mark attendance
- attendance is required before certificate upload

Acceptance criteria:

- manager can select project
- manager can see approved participants
- manager can mark attendance
- attendance saves correctly
- attendance action creates audit log
- non-approved users are not shown for attendance

---

## 5.13 Certificates

Required routes:

```text
/app/certificates
/admin/certificates
```

Required statuses:

```text
Загружен
Подтверждён
Отклонён
```

Required upload rule:

```text
project_applications.status = approved
AND attendance.status = present
```

Required certificate fields:

```text
title
project_id
user_id
file_url
file_name
certificate_type
uploaded_by
issued_at
status
comment
```

Required storage bucket: `certificates`.

Accepted file types: PDF, PNG, JPG.

Acceptance criteria:

- certificate upload is blocked without approved application
- certificate upload is blocked without present attendance
- certificate upload is permission-protected
- volunteer can see own certificates
- volunteer can download own certificates
- certificate upload creates audit log
- certificate UI is Russian

---

## 5.14 Achievements

Required route: `/app/achievements`.

Achievements can be managed through attendance/certificate flow in MVP.

Required achievement examples:

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

Required sources:

```text
Автоматически
Вручную
На основе сертификата
На основе посещаемости
```

MVP preferred rule:

```text
Attendance present → create achievement if missing.
Certificate upload → create certificate, do not duplicate achievement.
```

Acceptance criteria:

- present attendance can create achievement
- volunteer can see achievements
- duplicate achievements are prevented
- achievement UI is Russian
- achievement creation creates audit log

---

## 5.15 Team Applications With CV

Required routes:

```text
/team-application
/admin/team-applications
```

Required fields:

```text
Желаемая должность
Почему вы хотите эту роль?
Ваш опыт
Ваши навыки
Сколько времени готовы уделять?
CV-файл
Telegram
Instagram
LinkedIn
Портфолио / ссылка
Дополнительный комментарий
```

Required statuses:

```text
На рассмотрении
Проверяется HR
Собеседование
Рекомендован
Одобрен
Отклонён
Нужно уточнение
```

Required logic:

- volunteer submits team application
- HR reviews and recommends
- CEO/CTO makes final decision
- if approved, role is assigned
- audit log is created

Acceptance criteria:

- volunteer can submit team application with CV
- HR can review application
- HR can recommend candidate
- HR cannot assign role
- CEO/CTO can approve and assign role
- team application UI is Russian

---

## 5.16 Audit Logs

Required route: `/admin/audit-logs`.

Required fields:

```text
actor_user_id
action
target_type
target_id
old_value
new_value
comment
created_at
```

Required audit events:

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
```

Access: CEO and CTO. Optional limited access for Operations Manager.

Acceptance criteria:

- role changes are logged
- project moderation actions are logged
- application review actions are logged
- attendance and certificate actions are logged
- audit page is permission-protected
- audit UI is Russian

---

# 6. Medium Priority Features

Useful but should not block MVP launch:

- basic statistics
- documents
- partners
- project reports
- media/photo reports
- advanced filtering

MVP can include placeholders or simple versions.

---

# 7. Explicitly Postponed V2 Features

Do not build in MVP unless requested later:

- mobile app
- payment system
- AI assistant
- public certificate verification
- advanced partner CRM
- advanced analytics
- automatic PDF certificate generation
- public impact report generator
- complex notification system
- content calendar
- advanced badge system
- public volunteer ranking

---

# 8. MVP Route Scope

Public routes:

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

Volunteer routes:

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

Admin routes:

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

Core admin routes that must work:

```text
/admin/projects
/admin/moderation
/admin/project-applications
/admin/attendance
/admin/certificates
/admin/team-applications
/admin/roles
/admin/audit-logs
```

---

# 9. MVP Database Scope

Required tables:

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

Optional later:

```text
partners
documents
project_reports
content_calendar
public_certificate_verification
notifications
```

---

# 10. MVP Storage Scope

Required buckets:

```text
certificates
cvs
```

Optional later:

```text
documents
project-media
```

---

# 11. MVP Permission Scope

Must implement permission helpers for:

```text
canViewAdmin
canManageRoles
canViewAuditLogs
canCreateProject
canPublishProject
canSubmitProjectForModeration
canModerateProjects
canManageProject
canReviewProjectApplications
canMarkAttendance
canUploadCertificate
canViewTeamApplications
canReviewTeamApplicationAsHR
canDecideTeamApplication
canPublishAnnouncement
canCreateAnnouncementDraft
canManageDocuments
canManagePartners
canViewStats
```

Do not scatter permission logic across React components. Server actions must check permissions.

---

# 12. MVP UI Scope

Must implement:

- Russian UI constants
- public header/footer
- app shell
- permission-based sidebar
- page header component
- status badge component
- empty state component
- project card
- certificate card
- achievement card
- basic tables for admin pages
- Russian validation/error/success messages

Design must use:

```text
#0B0829
#FF8400
#F9DEC6
#8FA0D8
```

Do not overuse orange.

---

# 13. MVP Build Order

## Phase 0 — Project Skeleton

Build route groups, layouts, placeholder pages, Russian constants, color/theme setup.

## Phase 1 — Auth and Profiles

Build login, register, logout, profile creation/editing, profile completion, redirects.

## Phase 2 — Roles and Permissions

Build roles, user_roles, seed roles, helpers, protected role logic, sidebar, role assignment, audit logs.

## Phase 3 — Projects and Applications

Build projects, creation form, statuses, application modes, list/detail, quick application, questionnaire application, review, moderation.

## Phase 4 — Attendance, Certificates, Achievements

Build attendance, certificate storage/upload, eligibility checks, volunteer pages, achievement creation, audit logs.

## Phase 5 — Team Applications and HR

Build team application form, CV upload, HR review, CEO/CTO final decision, role assignment from approved application.

## Phase 6 — Announcements and Basic Stats

Build announcements, audience visibility, quote of the day, simple stats, dashboard polish.

## Phase 7 — QA and Launch Polish

Do Russian UI audit, permission audit, mobile check, empty state check, certificate security check, role protection check, and core flow testing.

---

# 14. MVP Non-Goals

The MVP must not try to solve:

- multi-organization SaaS
- external NGO marketplace
- payments
- full CRM
- full HR system
- full LMS
- full event ticketing
- public social network
- advanced analytics platform
- mobile app
- AI automation
- automated certificate design
- mass public reporting

This platform is first an internal operating system for SapaSpeakers.

---

# 15. MVP Risk Control

Risks and controls:

- Overbuilding → build only core operational loop first.
- Weak permissions → implement roles and permissions before admin workflows.
- Certificate abuse → enforce approved application + present attendance.
- Russian UI inconsistency → use centralized Russian constants and final copy audit.
- Role confusion → use clear role labels and hide inaccessible pages.
- Protected role mistake → block normal removal and audit blocked attempts.

---

# 16. Launch Readiness Checklist

Critical:

- [ ] Auth works.
- [ ] Profile completion works.
- [ ] Role system works.
- [ ] Protected roles work.
- [ ] Permission-based sidebar works.
- [ ] Projects work.
- [ ] Applications work.
- [ ] Moderation works.
- [ ] Attendance works.
- [ ] Certificate eligibility works.
- [ ] Certificate upload works.
- [ ] Achievements work.
- [ ] Team applications work.
- [ ] Role assignment works.
- [ ] Audit logs work.
- [ ] Russian UI audit passed.
- [ ] Security checks passed.

Important but non-blocking:

- [ ] Basic statistics.
- [ ] Documents placeholder.
- [ ] Partners placeholder.
- [ ] Media/photo reports placeholder.
- [ ] Advanced filters.

Must not block MVP:

- [ ] Mobile app.
- [ ] Payment system.
- [ ] AI assistant.
- [ ] Public certificate verification.
- [ ] Advanced partner CRM.
- [ ] Advanced analytics.
- [ ] Automatic PDF certificate generation.
- [ ] Complex notification system.
- [ ] Content calendar.
- [ ] Public ranking.

---

# 17. Implementation Notes for Codex

Recommended build sequence:

```text
Skeleton
→ Auth/Profile
→ Roles/Permissions
→ Projects/Applications
→ Attendance/Certificates/Achievements
→ Team Applications/HR
→ Announcements/Stats
→ QA/Launch Polish
```

When implementing MVP scope, Codex should build in phases, avoid v2 features, keep UI Russian, use permission helpers, use server-side validation, create audit logs, protect Founder/CEO and CTO roles, enforce certificate eligibility server-side, and use Supabase Storage for CVs/certificates.

---

# 18. Final MVP Boundary

The MVP should answer one question:

```text
Can SapaSpeakers professionally manage real volunteers, projects, approvals, attendance, certificates, achievements, and internal roles in one system?
```

If yes, the MVP is successful.

Do not chase v2 complexity before this core answer is proven.
