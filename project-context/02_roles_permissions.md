# SapaSpeakers Volunteer Platform — Roles & Permissions

## 1. Purpose

This document defines the role hierarchy, authority model, permission rules, and access boundaries for the SapaSpeakers Volunteer Platform.

The platform must support:

- multiple roles per user
- protected Founder/CEO and CTO roles
- role-based navigation
- action-based permission checks
- audit logs for important actions
- different access levels for volunteers, managers, coordinators, and top leadership

Important rule:

```text
Do not design the platform with one fixed role per user.
```

A user may have multiple roles.

Examples:

```text
Adiat = Founder/CEO + Partnership Manager
Said Amanzhol = CTO
```

---

## 2. Core Authority Model

### 2.1 Founder/CEO

Founder/CEO is the highest organizational authority.

Current person: Adiat.

Owns:

- organization structure
- final organizational decisions
- internal role assignment
- final team application approval
- organization-level data
- project approval authority
- external reputation and partnerships

Founder/CEO can assign or remove internal roles, except protected limitations must prevent accidental removal of CTO or Founder/CEO access.

### 2.2 CTO

CTO is the highest technical and system authority.

Current person: Said Amanzhol.

Owns:

- platform architecture
- system access
- technical integrity
- role and permission safety
- protected role control
- audit log visibility
- access recovery
- system settings

CTO can assign or remove internal roles, except protected limitations must prevent accidental unsafe changes to Founder/CEO or CTO access.

### 2.3 Operations Manager

Operations Manager is the main daily operator.

Owns:

- daily execution
- project operations
- project moderation
- project applications
- attendance
- certificates
- operational announcements
- operational statistics

Operations Manager has broad operational authority but does not control protected roles or system-level permissions.

---

## 3. Fundamental Permission Principles

### 3.1 Open Registration, Controlled Participation

Anyone can register as a volunteer.

But registration does not automatically mean project participation.

A volunteer must separately apply to each project and be approved.

### 3.2 Multiple Roles Per User

The system must support many-to-many role assignment.

Required tables:

```text
roles
user_roles
```

Do not use only `profiles.role` or `users.role`.

A profile may display the user’s main role visually, but permissions must come from `user_roles`.

### 3.3 Permissions Should Be Action-Based

The platform should not rely only on role-name checks.

Bad pattern:

```text
if user.role === "ceo"
```

Better pattern:

```text
canManageRoles(user)
canPublishProject(user)
canModerateProject(user)
canUploadCertificate(user, project)
```

Recommended structure:

```text
user_roles
→ role_permissions or permission helper map
→ permission checks
```

For MVP, a code-level permission map is acceptable if database permission tables are postponed.

### 3.4 Protected Roles Must Be Safe

The following roles are protected:

- Founder/CEO
- CTO

Protected role rules:

- cannot be removed through normal admin UI
- cannot be edited casually
- cannot be assigned to random users without protected flow
- cannot be deleted from `roles`
- should require manual/system-level action for dangerous changes

### 3.5 Every Important Action Must Leave a Trace

The system must create audit logs for:

- role assignment
- role removal
- team application decision
- project approval/rejection
- project publication
- application review
- attendance marking
- certificate upload
- achievement award
- major settings change

---

## 4. Role List

| Internal Key | Russian UI Name | Protected | Description |
|---|---|---:|---|
| `founder_ceo` | Founder/CEO | Yes | Highest organizational authority |
| `cto` | CTO | Yes | Highest technical/system authority |
| `operations_manager` | Операционный менеджер | No | Daily operations authority |
| `hr_manager` | HR-менеджер | No | People, CVs, team applications |
| `volunteer_teamlead` | Тимлид волонтёров | No | Project-level volunteer execution |
| `training_manager` | Менеджер по обучению | No | Training and educational preparation |
| `language_coordinator` | Координатор лингвистического сопровождения | No | Language support projects |
| `eco_coordinator` | Эко-координатор | No | Ecological projects and impact |
| `logistics_manager` | Logistics Manager | No | Location, materials, equipment, logistics readiness |
| `pr_smm_manager` | PR/SMM-менеджер | No | Media, announcements, public reputation |
| `partnership_manager` | Partnership Manager | No | External partnerships |
| `mun_coordinator` | Координатор MUN | No | MUN and diplomatic projects |
| `secretary` | Секретарь | No | Documents, protocols, archives |
| `volunteer` | Волонтёр | No | Regular registered user |

---

## 5. Permission Keys

| Permission Key | Meaning |
|---|---|
| `view_app` | Access authenticated app |
| `view_admin` | Access management/admin area |
| `manage_roles` | Assign/change/remove internal roles |
| `view_audit_logs` | View audit logs |
| `manage_system_settings` | Manage protected system settings |
| `view_all_volunteers` | View all volunteer profiles |
| `view_basic_volunteers` | View limited volunteer list |
| `manage_volunteers` | Edit volunteer records/admin notes |
| `create_project` | Create project |
| `publish_project` | Publish project immediately |
| `submit_project_for_moderation` | Send project to moderation |
| `moderate_projects` | Approve/reject/return projects |
| `manage_all_projects` | Manage all projects |
| `manage_own_projects` | Manage assigned/created projects |
| `view_project_applications` | View project applications |
| `review_project_applications` | Approve/reject/waitlist project applicants |
| `mark_attendance` | Mark project attendance |
| `upload_certificates` | Upload certificates |
| `confirm_certificates` | Confirm/reject certificates |
| `manage_achievements` | Add/confirm achievements |
| `view_team_applications` | View team applications |
| `review_team_applications_hr` | HR review/recommend team applicants |
| `decide_team_applications` | Final approve/reject team applications |
| `create_announcements` | Create announcements |
| `publish_announcements` | Publish announcements |
| `create_announcement_drafts` | Create announcement drafts |
| `manage_media` | Upload/manage media/photo reports |
| `manage_partners` | Add/edit partners |
| `manage_documents` | Upload/manage documents |
| `view_stats` | View statistics/reports |
| `manage_logistics` | Manage logistics blocks/checklists |
| `apply_to_projects` | Submit project applications |
| `apply_to_team` | Submit team application |
| `view_own_certificates` | View own certificates |
| `view_own_achievements` | View own achievements |
| `edit_own_profile` | Edit own profile |

---

## 6. High-Level Role Permission Matrix

| Permission | Volunteer | Secretary | PR/SMM | Logistics | Team Lead / Coord. | HR | Ops Manager | CTO | CEO |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Access app | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Access admin area | No | Limited | Limited | Limited | Limited | Limited | Yes | Yes | Yes |
| Edit own profile | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Apply to projects | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Apply to team | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Create project | No | No | No | No | Yes | No | Yes | Yes | Yes |
| Publish project immediately | No | No | No | No | No | No | Yes | Yes | Yes |
| Send project to moderation | No | No | No | No | Yes | No | Yes | Yes | Yes |
| Moderate projects | No | No | No | No | No | No | Yes | Yes | Yes |
| Manage all projects | No | No | No | No | No | No | Yes | Yes | Yes |
| Manage own projects | No | No | No | Limited | Yes | No | Yes | Yes | Yes |
| Review project applications | No | No | No | No | Own projects | No | Yes | Yes | Yes |
| Mark attendance | No | No | No | No | Own projects | No | Yes | Yes | Yes |
| Upload certificates | No | No | No | No | Own attended participants | No | Yes | Yes | Yes |
| View volunteers | No | No | No | Approved participants only | Relevant/own project participants | Yes | Yes | Yes | Yes |
| View team applications | No | No | No | No | No | Yes | Limited/optional | Yes | Yes |
| HR review | No | No | No | No | No | Yes | No | Yes | Yes |
| Final team decision | No | No | No | No | No | No | No | Yes | Yes |
| Assign roles | No | No | No | No | No | No | No | Yes | Yes |
| View audit logs | No | No | No | No | No | No | Optional limited | Yes | Yes |
| Publish announcements | No | No | Yes | No | Project-related only if allowed | HR only if allowed | Yes | Yes | Yes |
| Create announcement drafts | No | Yes | Yes | No | Project-related | Yes | Yes | Yes | Yes |
| Manage documents | No | Yes | No | Limited logistics docs | Project docs only | HR docs only | Yes | Yes | Yes |
| Manage partners | No | No | No | No | No | No | Optional | Yes | Yes |
| Manage settings | No | No | No | No | No | No | No | Yes | Limited/Org settings |

---

## 7. Role Definitions and Boundaries

### 7.1 Founder/CEO

Founder/CEO is the highest organizational authority.

Current person: Adiat.

Can:

- manage organization structure
- assign/remove internal roles
- approve/reject team applications
- publish projects immediately
- approve/reject moderated projects
- manage all volunteers
- manage all projects
- manage announcements
- view all project applications
- view all certificates and achievements
- view statistics and reports
- manage partners
- manage organization-level documents
- access audit logs

Cannot normally:

- accidentally remove CTO access through simple UI
- bypass protected system safety for dangerous technical changes
- delete protected audit history

### 7.2 CTO

CTO is the highest technical/system authority.

Current person: Said Amanzhol.

Can:

- manage platform/system
- manage roles and permissions
- assign/remove internal roles
- approve/reject team applications
- publish projects immediately
- approve/reject moderated projects
- view all platform data
- fix access issues
- manage technical settings
- view audit logs
- manage users from system perspective
- protect Founder/CEO and CTO roles

Cannot:

- replace Founder/CEO as organizational leader through normal UI
- remove CEO access casually through normal UI
- delete protected audit history

### 7.3 Операционный менеджер

Операционный менеджер is the main daily operator of the organization.

Can:

- create projects
- publish projects
- moderate projects from team leads/coordinators
- edit projects
- close/cancel projects
- assign responsible people to projects
- manage project applications
- approve/reject/waitlist project applicants
- view volunteer list and profiles
- manage attendance
- upload/approve certificates
- publish operational announcements
- view operational statistics
- view project reports
- manage daily execution

Cannot:

- assign internal roles
- change Founder/CEO or CTO roles
- change system-wide permissions
- delete critical organization data
- permanently delete users
- change protected system settings

### 7.4 HR-менеджер

HR-менеджер manages people, volunteer profiles, team applications, CV review, candidate quality, and internal recruitment.

Can:

- view all volunteers
- view volunteer profiles
- view team applications
- view uploaded CVs
- change HR statuses of applications
- leave HR comments
- recommend candidates to CEO/CTO
- filter volunteers by skills, languages, experience, interests
- manage HR-related notes
- create HR announcement drafts if needed

Cannot:

- assign official internal roles
- publish projects
- upload certificates
- approve project participation unless separately assigned
- delete users
- change system settings
- change protected roles

Important rule: HR can recommend candidates. Founder/CEO or CTO makes final role assignment.

### 7.5 Тимлид волонтёров

Тимлид волонтёров manages project-level execution and volunteer participation for assigned projects.

Can:

- create projects but send to moderation
- manage assigned projects
- view applications to own projects
- approve/reject/waitlist volunteers for own projects
- view approved participants for own projects
- mark attendance for own projects
- upload certificates for own projects
- confirm achievements for own projects
- leave internal notes about participants
- submit short project reports

Cannot:

- publish projects without moderation
- manage unrelated projects
- assign internal roles
- view all CVs/team applications
- delete users
- change system settings
- change protected roles

Certificate rule: Тимлид can upload certificates only for volunteers who were approved for the project and marked as attended/present.

### 7.6 Менеджер по обучению

Responsible for volunteer training, skill development, onboarding quality, educational sessions, and internal preparation.

Can create/manage assigned trainings, review training applications, mark attendance, upload training certificates, materials, confirm training achievements, and view training statistics.

Cannot assign roles, publish without moderation, manage all projects, view all CVs/team applications, delete users, or change settings.

### 7.7 Координатор лингвистического сопровождения

Manages translation, international guest support, delegation support, communication, and selecting volunteers with suitable language skills.

Can create language-support projects/tasks for moderation, manage assigned projects, filter volunteers by languages and experience, mark attendance, upload certificates for assigned projects, confirm language achievements, and upload scripts/templates/instructions.

Cannot assign roles, publish without moderation, manage all projects, view all CVs/team applications, delete users, or change settings.

Useful profile language fields:

- languages: Russian, Kazakh, English, Turkish, Chinese, French, German, Other
- levels: Basic, Intermediate, Good, Fluent, Native
- experience: translation, guest support, public speaking, MUN/debate, written translation, oral communication

### 7.8 Эко-координатор

Manages ecological projects and ecological impact.

Can create eco projects for moderation, manage assigned eco projects, review eco applications, mark attendance, upload certificates, confirm achievements, enter impact metrics, upload safety checklists/sorting rules, and submit reports.

Eco-specific fields:

- eco project type: cleanup, tree planting, recycling/sorting, eco lecture, eco campaign, partner eco project
- impact metrics: kg of trash collected, trees planted, recycling collected, number of participants, volunteer hours, people reached, partner/location

### 7.9 Logistics Manager

Manages physical readiness of assigned projects: location, materials, equipment, meeting point, timing, checklists, and instructions.

Can view assigned projects, manage logistics blocks, edit location/meeting fields if assigned, create checklists, manage equipment lists, publish instructions to approved participants, view approved participant list, mark logistics preparation status, and submit logistics report.

Cannot approve participants, upload certificates, publish projects, assign roles, manage all projects, view CVs/team applications, delete users, or change settings unless they also hold another role.

Principle: Тимлид controls people. Logistics Manager controls readiness.

### 7.10 PR/SMM-менеджер

Manages public image, announcements, media, news, photo reports, project promotion, and reputation.

Can publish informational announcements, write news, upload media, view published projects for content preparation, add photo reports, update public content if allowed, create SMM/content plan, and publish organization achievements based on real platform data.

Cannot assign roles, approve participants, mark attendance, upload certificates, manage volunteers, view CVs/team applications, publish/manage projects unless given another role, change settings, or delete users.

PR/SMM should publish reputation based on real platform data:

- number of volunteers
- completed projects
- volunteer hours
- impact metrics
- certificates issued
- partners

### 7.11 Partnership Manager

For now, Partnership Manager is not a separate person. Adiat is both Founder/CEO and Partnership Manager.

Manages partners, schools, universities, companies, sponsors, venues, collaborations, and reputation opportunities.

Can add/edit partners, store contacts, track partnership status, create partner-related drafts, upload partner documents, write negotiation notes, view impact stats, and connect partners to projects.

For MVP, partnership functions can be simple or postponed. Since Adiat is CEO, partnership functions can live under CEO access.

### 7.12 Координатор MUN

Manages Model United Nations and diplomatic direction: conferences, delegates, committees, roles, preparation, language/protocol discipline, and MUN project quality.

Can create MUN/diplomatic projects for moderation, manage assigned MUN projects, add committees, manage MUN roles, review applications, approve/reject/waitlist participants, assign countries/positions if needed, upload guidebook/rules/templates, mark attendance, upload certificates, confirm MUN achievements, and submit reports.

MUN-specific fields:

- conference name
- format: training, simulation, conference, debate session
- committees
- delegate count
- available countries/positions
- language
- position paper required?
- MUN experience required?
- English required?
- Rules of Procedure file
- guidebook file
- application deadline

MUN applications should usually use questionnaire mode, not one-click quick application.

### 7.13 Секретарь

Manages documents, records, meeting protocols, internal notes, lists, archives, and administrative order.

Can upload internal documents, create meeting protocols, add administrative notes, maintain lists, view basic project information, help prepare project reports, create announcement drafts, manage archives, view project/meeting calendar, and create simple admin tasks/reminders.

Cannot assign roles, approve participants, publish projects without rights, upload certificates, manage volunteers, view CVs/team applications, delete users, or change settings.

Principle: Секретарь records and organizes decisions, but does not make management decisions.

### 7.14 Волонтёр

Regular registered user who can participate in projects and build verified contribution history.

Can:

- register
- complete profile
- view announcements
- view published projects
- apply to projects
- answer project questionnaires
- track own applications
- view own achievements
- download own certificates
- edit own profile
- apply to team/internal roles with CV

Cannot:

- approve project applications
- create projects
- upload certificates
- assign roles
- view other private profiles
- access admin pages

---

## 8. Role Assignment Rules

Only Founder/CEO or CTO can assign, change, or remove internal roles.

Approval from one of them is enough.

Operations Manager cannot assign internal roles.

HR Manager cannot assign internal roles.

HR Manager can only recommend candidates.

Protected roles:

- Founder/CEO
- CTO

Normal UI must not allow removing Founder/CEO, removing CTO, changing protected role ownership, or deleting protected role records.

Recommended MVP approach:

```text
Protected role changes are disabled in UI.
Manual database/system-level action required.
```

Every role assignment or removal must create an audit log.

Example action values:

```text
role.assigned
role.removed
role.changed
protected_role.change_attempt_blocked
```

---

## 9. Permission Helper Requirements

The codebase should contain centralized permission helpers.

Recommended examples:

```text
canViewAdmin(user)
canManageRoles(user)
canViewAuditLogs(user)
canCreateProject(user)
canPublishProject(user)
canSubmitProjectForModeration(user)
canModerateProjects(user)
canManageProject(user, project)
canReviewProjectApplications(user, project)
canMarkAttendance(user, project)
canUploadCertificate(user, project, volunteer)
canViewTeamApplications(user)
canReviewTeamApplicationAsHR(user)
canDecideTeamApplication(user)
canPublishAnnouncement(user)
canCreateAnnouncementDraft(user)
canManageDocuments(user)
canManagePartners(user)
canViewStats(user)
```

Do not scatter role logic across pages. All pages should use shared helpers.

---

## 10. Project-Specific Permission Rules

### 10.1 Project Publishing

Can publish immediately:

- Founder/CEO
- CTO
- Operations Manager

Can create but must send to moderation:

- Volunteer Team Lead
- Training Manager
- Language Coordinator
- Eco Coordinator
- MUN Coordinator

Cannot create projects by default:

- Volunteer
- HR Manager
- Secretary
- PR/SMM Manager
- Logistics Manager

Exception: a user with multiple roles may gain additional permissions.

### 10.2 Project Application Review

Can review all project applications:

- Founder/CEO
- CTO
- Operations Manager

Can review applications only for own/assigned projects:

- Volunteer Team Lead
- Training Manager
- Language Coordinator
- Eco Coordinator
- MUN Coordinator

Logistics Manager can view approved participants for assigned projects but cannot approve/reject applicants unless also assigned project lead.

### 10.3 Attendance

Can mark attendance broadly:

- Founder/CEO
- CTO
- Operations Manager

Can mark attendance for own/assigned projects:

- Volunteer Team Lead
- Training Manager
- Language Coordinator
- Eco Coordinator
- MUN Coordinator

### 10.4 Certificates

Can upload certificates broadly:

- Founder/CEO
- CTO
- Operations Manager

Can upload certificates for own/assigned projects:

- Volunteer Team Lead
- Training Manager
- Language Coordinator
- Eco Coordinator
- MUN Coordinator

Certificate eligibility rule:

```text
approved project application exists
AND attendance status = present
```

---

## 11. Team Application Permission Rules

Any registered volunteer can submit a team application.

HR Manager can:

- view team applications
- view CVs
- update HR status
- write HR comments
- recommend candidates

HR Manager cannot:

- assign role
- make final official decision

Only Founder/CEO or CTO can make final decision and assign role.

---

## 12. Sidebar Visibility Rules

The sidebar must be generated based on permissions, not hardcoded role names.

### Volunteer Sidebar

- Личный кабинет
- Объявления
- Проекты
- Мои заявки
- Мои достижения
- Сертификаты
- Профиль

### CEO / CTO Sidebar

- Личный кабинет
- Объявления
- Проекты
- Заявки на проекты
- Волонтёры
- Заявки в команду
- Роли и доступ
- Сертификаты
- Достижения
- Статистика
- Партнёры
- Документы
- Настройки
- Журнал действий

### Operations Manager Sidebar

- Личный кабинет
- Объявления
- Проекты
- Проекты на модерации
- Заявки на проекты
- Волонтёры
- Посещаемость
- Сертификаты
- Статистика
- Документы

### HR Manager Sidebar

- Личный кабинет
- Волонтёры
- Заявки в команду
- CV кандидатов
- HR-комментарии
- Объявления HR
- Профили волонтёров

### Team Lead / Coordinator Sidebar

- Личный кабинет
- Мои проекты
- Создать проект
- Заявки на мои проекты
- Участники
- Посещаемость
- Сертификаты
- Отчёты

### Logistics Manager Sidebar

- Личный кабинет
- Мои проекты
- Логистика
- Чеклисты
- Инструкции
- Материалы

### PR/SMM Manager Sidebar

- Личный кабинет
- Объявления
- Новости
- Медиа
- Фотоотчёты
- Контент-план
- Публичная страница

### Secretary Sidebar

- Личный кабинет
- Документы
- Протоколы встреч
- Архив
- Черновики объявлений
- Календарь проектов

---

## 13. Database Requirements

### `roles`

Fields:

```text
id
name
display_name
description
is_protected
created_at
```

Seed roles:

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

### `user_roles`

Fields:

```text
id
user_id
role_id
assigned_by
assigned_at
reason
```

Rules:

- one user can have many roles
- one role can belong to many users
- role assignment must be audit-logged
- protected role removal must be blocked

Optional future table: `role_permissions`.

---

## 14. Required Audit Events

Minimum required audit event types:

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

## 15. Acceptance Criteria

Roles and permissions are implemented correctly when:

1. A user can have multiple roles.
2. Regular volunteers cannot access admin pages.
3. Sidebars only show accessible pages.
4. CEO can assign internal roles.
5. CTO can assign internal roles.
6. HR cannot assign internal roles.
7. Operations Manager cannot assign internal roles.
8. Founder/CEO and CTO roles cannot be removed through normal UI.
9. Team leads can manage only their assigned projects.
10. Coordinators can create projects but must send them to moderation.
11. Operations Manager can moderate projects.
12. PR/SMM cannot approve project participants.
13. Logistics Manager cannot approve project participants unless separately assigned as project lead.
14. Certificates can only be uploaded for approved and present participants.
15. Role changes create audit logs.
16. Major project/application/certificate actions create audit logs.
17. Permission logic is centralized in helper functions.
18. No page relies only on frontend hiding; server-side checks protect actions too.

---

## 16. Implementation Notes for Codex

When implementing this part, Codex should:

1. Create role constants.
2. Create permission constants.
3. Create Russian role display labels.
4. Create permission helper functions.
5. Create sidebar generation logic from permissions.
6. Add protected role rules.
7. Add audit log helper.
8. Ensure server actions check permissions.
9. Avoid hardcoding only one user role.
10. Avoid exposing locked admin routes to unauthorized users.

Recommended files:

```text
src/lib/auth/roles.ts
src/lib/auth/permissions.ts
src/lib/auth/guards.ts
src/lib/auth/sidebar.ts
src/lib/audit/audit-log.ts
src/lib/constants/ru.ts
```

Recommended database tables:

```text
roles
user_roles
audit_logs
```

Do not implement full business modules before role and permission foundation is stable.
