# SapaSpeakers Volunteer Platform — Acceptance Criteria

## 1. Purpose

This document defines the acceptance criteria for the SapaSpeakers Volunteer Platform MVP.

The MVP is accepted only if the platform can support the real operating cycle of the organization:

```text
Volunteer registers
→ completes profile
→ applies to project
→ gets reviewed
→ gets approved
→ attends project
→ receives certificate
→ receives achievement
→ builds verified contribution history
```

The platform must also support internal hierarchy, role assignment, Russian UI, protected access, and audit logs.

---

## 2. Core Product Acceptance Criteria

The MVP is acceptable when:

1. SapaSpeakers has a working public website.
2. Volunteers can register and log in.
3. Volunteers can complete detailed profiles.
4. Volunteers can apply to projects.
5. Project participation is controlled by approval.
6. Managers can review project applications.
7. Attendance can be marked.
8. Certificates can be uploaded only for eligible participants.
9. Achievements are stored and visible.
10. Volunteers can apply to internal team roles.
11. HR can review team applications.
12. CEO/CTO can assign roles.
13. Founder/CEO and CTO roles are protected.
14. Important actions are audit-logged.
15. All user-facing UI is Russian.
16. Role-based navigation hides inaccessible pages.
17. Server-side checks protect important actions.

---

# 3. Public Website Acceptance Criteria

## 3.1 Required Public Pages

The following pages must exist:

```text
/
/about
/projects
/join
/team-application
/contacts
/login
/register
```

## 3.2 Landing Page

Accepted when:

- [ ] Page title and visible text are in Russian.
- [ ] Organization name `SapaSpeakers` is visible.
- [ ] Mission or purpose is clearly explained.
- [ ] CTA `Стать волонтёром` is visible.
- [ ] CTA `Посмотреть проекты` is visible.
- [ ] CTA `Подать заявку в команду` is visible or accessible.
- [ ] Page explains that the organization is structured and professional.
- [ ] Page uses the approved color palette.
- [ ] Page does not use fake impact numbers.

## 3.3 About Page

Accepted when:

- [ ] Page title is `О нас`.
- [ ] Mission is explained.
- [ ] Values are explained.
- [ ] Organization structure is briefly explained.
- [ ] Public trust/reputation is communicated.
- [ ] UI is Russian.

## 3.4 Public Projects Page

Accepted when:

- [ ] Page title is `Проекты`.
- [ ] Only published projects are shown.
- [ ] Draft/moderation/rejected/cancelled projects are hidden.
- [ ] Project cards show title, category, date, location, and application mode.
- [ ] Unauthenticated user is asked to log in/register before applying.
- [ ] Empty state is Russian.

## 3.5 Join Page

Accepted when:

- [ ] Page title is `Стать волонтёром`.
- [ ] Volunteer journey is explained.
- [ ] It clearly says registration does not mean automatic project participation.
- [ ] CTA to register is visible.
- [ ] UI is Russian.

## 3.6 Team Application Public Page

Accepted when:

- [ ] Page title is `Заявка в команду`.
- [ ] Internal team application process is explained.
- [ ] User is told that HR can review, but CEO/CTO makes final decision.
- [ ] Unauthenticated user is asked to log in/register.
- [ ] UI is Russian.

## 3.7 Contacts Page

Accepted when:

- [ ] Page title is `Контакты`.
- [ ] Social/contact links are visible.
- [ ] Contact copy is Russian.
- [ ] Page looks clean and professional.

---

# 4. Authentication Acceptance Criteria

## 4.1 Registration

Accepted when:

- [ ] User can register with name, surname, email, phone, and password.
- [ ] Required fields are validated.
- [ ] Validation messages are Russian.
- [ ] New user receives default `volunteer` role.
- [ ] New user is redirected to profile completion.
- [ ] New user cannot access admin pages.

## 4.2 Login

Accepted when:

- [ ] Existing user can log in.
- [ ] Invalid credentials show Russian error.
- [ ] Successful login redirects to `/app`.
- [ ] Logged-in users are redirected away from `/login` and `/register`.

## 4.3 Logout

Accepted when:

- [ ] Logged-in user can log out.
- [ ] User is redirected to public/login page.
- [ ] Protected pages are no longer accessible after logout.

## 4.4 Auth Protection

Accepted when:

- [ ] Unauthenticated users cannot access `/app`.
- [ ] Unauthenticated users cannot access `/admin`.
- [ ] Unauthenticated users are redirected to `/login`.
- [ ] Server-side route protection exists.

---

# 5. Volunteer Profile Acceptance Criteria

## 5.1 Profile Page

Route: `/app/profile`.

Accepted when:

- [ ] User can view own profile.
- [ ] User can edit own profile.
- [ ] Profile form labels are Russian.
- [ ] Required fields are validated.
- [ ] Success/error messages are Russian.

## 5.2 Required Profile Fields

Accepted when profile supports:

- [ ] Имя
- [ ] Фамилия
- [ ] Email
- [ ] Телефон
- [ ] Дата рождения
- [ ] Город
- [ ] Учебное заведение / место работы
- [ ] Telegram
- [ ] WhatsApp
- [ ] Языки
- [ ] Навыки
- [ ] Интересы
- [ ] Опыт волонтёрства
- [ ] Предпочитаемые направления проектов
- [ ] Кратко о себе

## 5.3 Profile Completion

Accepted when:

- [ ] System calculates or stores `profile_completed`.
- [ ] Dashboard shows profile completion status.
- [ ] Incomplete profile blocks project application.
- [ ] User sees Russian message: `Заполните профиль перед подачей заявки.`
- [ ] Completed profile allows applications.

---

# 6. Role & Permission Acceptance Criteria

## 6.1 Multiple Roles

Accepted when:

- [ ] Database supports `roles`.
- [ ] Database supports `user_roles`.
- [ ] One user can have multiple roles.
- [ ] A user is not limited to one fixed role.
- [ ] Adiat can have `Founder/CEO + Partnership Manager`.
- [ ] Said can have `CTO`.

## 6.2 Required Roles

Accepted when the following roles exist:

- [ ] `founder_ceo`
- [ ] `cto`
- [ ] `operations_manager`
- [ ] `hr_manager`
- [ ] `volunteer_teamlead`
- [ ] `training_manager`
- [ ] `language_coordinator`
- [ ] `eco_coordinator`
- [ ] `logistics_manager`
- [ ] `pr_smm_manager`
- [ ] `partnership_manager`
- [ ] `mun_coordinator`
- [ ] `secretary`
- [ ] `volunteer`

## 6.3 Protected Roles

Accepted when:

- [ ] `founder_ceo` is marked protected.
- [ ] `cto` is marked protected.
- [ ] Protected roles cannot be removed through normal UI.
- [ ] Protected role removal attempt is blocked server-side.
- [ ] Blocked protected-role attempt creates audit log.
- [ ] User sees Russian warning: `Эта роль защищена и не может быть изменена через обычную панель.`

## 6.4 Role Assignment

Accepted when:

- [ ] CEO can assign internal roles.
- [ ] CTO can assign internal roles.
- [ ] HR Manager cannot assign roles.
- [ ] Operations Manager cannot assign roles.
- [ ] Role assignment requires reason/comment if configured.
- [ ] Role assignment creates audit log.
- [ ] Role removal creates audit log.

## 6.5 Permission Helpers

Accepted when permission logic is centralized.

Required helpers or equivalent:

- [ ] `canViewAdmin`
- [ ] `canManageRoles`
- [ ] `canViewAuditLogs`
- [ ] `canCreateProject`
- [ ] `canPublishProject`
- [ ] `canSubmitProjectForModeration`
- [ ] `canModerateProjects`
- [ ] `canManageProject`
- [ ] `canReviewProjectApplications`
- [ ] `canMarkAttendance`
- [ ] `canUploadCertificate`
- [ ] `canViewTeamApplications`
- [ ] `canReviewTeamApplicationAsHR`
- [ ] `canDecideTeamApplication`
- [ ] `canPublishAnnouncement`
- [ ] `canViewStats`

## 6.6 Server-Side Permission Checks

Accepted when:

- [ ] Admin actions are protected server-side.
- [ ] Frontend hiding is not the only protection.
- [ ] Unauthorized role assignment fails.
- [ ] Unauthorized project moderation fails.
- [ ] Unauthorized certificate upload fails.
- [ ] Unauthorized audit log access fails.

---

# 7. Navigation Acceptance Criteria

## 7.1 Sidebar Logic

Accepted when:

- [ ] Sidebar is generated from permissions.
- [ ] Locked pages are not shown.
- [ ] Volunteer does not see admin pages.
- [ ] HR sees HR-related pages.
- [ ] Team leads/coordinators see own project tools.
- [ ] CEO/CTO see role/audit/system pages.
- [ ] Navigation labels are Russian.

## 7.2 Volunteer Sidebar

Accepted when regular volunteer sees:

- [ ] Личный кабинет
- [ ] Объявления
- [ ] Проекты
- [ ] Мои заявки
- [ ] Мои достижения
- [ ] Сертификаты
- [ ] Профиль

## 7.3 CEO/CTO Sidebar

Accepted when CEO/CTO can see:

- [ ] Личный кабинет
- [ ] Объявления
- [ ] Проекты
- [ ] Заявки на проекты
- [ ] Волонтёры
- [ ] Заявки в команду
- [ ] Роли и доступ
- [ ] Сертификаты
- [ ] Достижения
- [ ] Статистика
- [ ] Партнёры
- [ ] Документы
- [ ] Настройки
- [ ] Журнал действий

---

# 8. Volunteer Dashboard Acceptance Criteria

Route: `/app`.

Accepted when dashboard shows:

- [ ] Welcome message in Russian.
- [ ] Quote of the day.
- [ ] Profile completion status.
- [ ] My applications summary.
- [ ] Approved upcoming projects.
- [ ] Latest announcements.
- [ ] Latest certificates.
- [ ] Latest achievements.
- [ ] Empty states when there is no data.

Quote logic accepted when:

- [ ] At least 3 active quotes exist.
- [ ] Quote rotates by date.
- [ ] Quote block title is `Цитата дня`.

Seed quotes:

- [ ] `Большие изменения начинаются с маленького доброго действия.`
- [ ] `Волонтёрство — это не свободное время, а свободный выбор.`
- [ ] `Сильная команда строится не на словах, а на ответственности.`

---

# 9. Projects Acceptance Criteria

## 9.1 Project Data

Accepted when project supports:

- [ ] Title
- [ ] Description
- [ ] Category
- [ ] Status
- [ ] Application mode
- [ ] Location
- [ ] Meeting point
- [ ] Start datetime
- [ ] End datetime
- [ ] Application deadline
- [ ] Needed volunteers count
- [ ] Created by
- [ ] Responsible user
- [ ] Logistics manager
- [ ] PR manager
- [ ] Published at

## 9.2 Project Categories

Accepted when project categories exist:

- [ ] Образовательный
- [ ] Дипломатический
- [ ] Экологический
- [ ] Спортивный
- [ ] Культурный
- [ ] Выставка
- [ ] MUN
- [ ] Обучение
- [ ] Другое

## 9.3 Project Statuses

Accepted when project statuses exist:

- [ ] Черновик
- [ ] На модерации
- [ ] На доработке
- [ ] Опубликован
- [ ] Набор закрыт
- [ ] Завершён
- [ ] Отменён
- [ ] Отклонён

## 9.4 Project Visibility

Accepted when:

- [ ] Volunteers see only published projects.
- [ ] Public users see only published projects.
- [ ] Draft projects are hidden from volunteers.
- [ ] Moderation projects are hidden from volunteers.
- [ ] Rejected/cancelled projects are hidden from volunteers.
- [ ] Managers can see projects according to permissions.

## 9.5 Project Creation

Accepted when:

- [ ] CEO can create and publish project immediately.
- [ ] CTO can create and publish project immediately.
- [ ] Operations Manager can create and publish project immediately.
- [ ] Team leads/coordinators can create project draft.
- [ ] Team leads/coordinators must send project to moderation.
- [ ] Volunteer cannot create project.
- [ ] HR cannot create project by default.

---

# 10. Project Moderation Acceptance Criteria

Route: `/admin/moderation`.

Accepted when:

- [ ] Projects can be sent to moderation.
- [ ] Projects on moderation are visible to CEO/CTO/Ops.
- [ ] CEO can approve, return, or reject.
- [ ] CTO can approve, return, or reject.
- [ ] Operations Manager can approve, return, or reject.
- [ ] Team lead/coordinator cannot approve own project directly.
- [ ] Approval changes status to `published`.
- [ ] Return changes status to `needs_revision`.
- [ ] Rejection changes status to `rejected`.
- [ ] Return requires moderation comment.
- [ ] Rejection requires moderation comment.
- [ ] Moderation actions create audit logs.
- [ ] UI labels are Russian.

---

# 11. Project Application Acceptance Criteria

## 11.1 Application Modes

Accepted when every project supports:

- [ ] `Быстрая заявка`
- [ ] `Заявка с анкетой`

## 11.2 Quick Application

Accepted when:

- [ ] Volunteer clicks `Подать заявку`.
- [ ] Application is created immediately.
- [ ] Application status becomes `На рассмотрении`.
- [ ] User sees Russian success message.
- [ ] Duplicate application is blocked.
- [ ] Application after deadline is blocked.
- [ ] Application with incomplete profile is blocked.

## 11.3 Questionnaire Application

Accepted when:

- [ ] Project creator can add questions.
- [ ] Question types are supported:
  - [ ] Короткий ответ
  - [ ] Развёрнутый ответ
  - [ ] Один вариант
  - [ ] Несколько вариантов
  - [ ] Да / Нет
- [ ] Required questions block submission if unanswered.
- [ ] Answers are saved.
- [ ] Answers are visible to responsible reviewer.
- [ ] User sees Russian success/error messages.

## 11.4 Application Statuses

Accepted when statuses exist:

- [ ] На рассмотрении
- [ ] Одобрено
- [ ] В резерве
- [ ] Отклонено
- [ ] Отменено пользователем
- [ ] Участвовал
- [ ] Не пришёл

## 11.5 Application Review

Accepted when:

- [ ] CEO/CTO/Ops can review all project applications.
- [ ] Responsible team lead/coordinator can review own project applications.
- [ ] Reviewer can approve application.
- [ ] Reviewer can waitlist application.
- [ ] Reviewer can reject application.
- [ ] Reviewer can leave comment.
- [ ] Review stores reviewer and timestamp.
- [ ] Review creates audit log.
- [ ] Volunteer can see updated status in `Мои заявки`.

## 11.6 Official Participant Rule

Accepted when:

- [ ] Only approved applicants become official participants.
- [ ] Pending applicants are not participants.
- [ ] Waitlisted applicants are not participants.
- [ ] Rejected applicants are not participants.
- [ ] Only approved participants appear in attendance list.

---

# 12. Attendance Acceptance Criteria

Route: `/admin/attendance`.

Accepted when:

- [ ] Authorized manager can select project.
- [ ] Only approved participants are shown.
- [ ] Attendance can be marked as:
  - [ ] Присутствовал
  - [ ] Не пришёл
  - [ ] Опоздал
  - [ ] По уважительной причине
- [ ] Attendance stores who marked it.
- [ ] Attendance stores timestamp.
- [ ] Attendance can be updated by authorized manager.
- [ ] Attendance cannot be marked for non-approved users.
- [ ] Attendance action creates audit log.
- [ ] UI is Russian.

---

# 13. Certificate Acceptance Criteria

## 13.1 Volunteer Certificate Page

Route: `/app/certificates`.

Accepted when:

- [ ] Volunteer can see own certificates.
- [ ] Volunteer cannot see other users’ certificates.
- [ ] Certificate card shows title, project, issue date, status.
- [ ] Volunteer can download own certificate.
- [ ] Empty state is Russian.

## 13.2 Admin Certificate Page

Route: `/admin/certificates`.

Accepted when:

- [ ] Authorized manager can upload certificate.
- [ ] Manager can select project.
- [ ] Eligible participants are shown.
- [ ] Non-eligible participants are hidden or blocked.
- [ ] Certificate upload requires file.
- [ ] Accepted file types are PDF, PNG, JPG.
- [ ] File size limit exists.
- [ ] Certificate upload creates audit log.

## 13.3 Certificate Eligibility

Accepted when certificate upload is allowed only if:

- [ ] Project application status is approved.
- [ ] Attendance status is present.
- [ ] Actor has certificate upload permission.
- [ ] Actor can manage the project or has broad certificate permission.

Rejected when:

- [ ] Volunteer was not approved.
- [ ] Volunteer did not attend.
- [ ] Actor has no permission.
- [ ] File is missing.
- [ ] File type is invalid.

## 13.4 Certificate Statuses

Accepted when statuses exist:

- [ ] Загружен
- [ ] Подтверждён
- [ ] Отклонён

MVP minimum:

- [ ] Uploaded certificates are visible to volunteers with status `Загружен`.

---

# 14. Achievement Acceptance Criteria

Route: `/app/achievements`.

Accepted when:

- [ ] Volunteer can see own achievements.
- [ ] Volunteer cannot see other users’ achievements.
- [ ] Achievement card shows title, description, project, awarded date.
- [ ] Empty state is Russian.
- [ ] Achievements are connected to real participation where applicable.
- [ ] Duplicate achievements for same user/project/type are prevented.
- [ ] Achievement creation creates audit log.

Automatic achievement accepted when:

- [ ] Present attendance creates achievement or enables achievement creation.
- [ ] Category-specific achievement is created when possible.
- [ ] Fallback achievement is `Участник проекта`.

Achievement examples:

- [ ] Участник проекта
- [ ] Участник экологического проекта
- [ ] Участник MUN-проекта
- [ ] Прошёл обучение
- [ ] Помог на выставке
- [ ] Волонтёр 10+ часов
- [ ] Волонтёр 25+ часов
- [ ] Участник дипломатического проекта
- [ ] Участник культурного проекта
- [ ] Участник спортивного проекта

---

# 15. Team Application Acceptance Criteria

## 15.1 Submission

Accepted when volunteer can submit team application with:

- [ ] Желаемая должность
- [ ] Почему вы хотите эту роль?
- [ ] Ваш опыт
- [ ] Ваши навыки
- [ ] Сколько времени готовы уделять?
- [ ] CV-файл
- [ ] Telegram
- [ ] Instagram
- [ ] LinkedIn
- [ ] Портфолио / ссылка
- [ ] Дополнительный комментарий

## 15.2 CV Upload

Accepted when:

- [ ] User can upload CV file.
- [ ] CV file is stored securely.
- [ ] Applicant can access own CV.
- [ ] HR can view CV.
- [ ] CEO/CTO can view CV.
- [ ] Unauthorized users cannot access CV.

## 15.3 Team Application Statuses

Accepted when statuses exist:

- [ ] На рассмотрении
- [ ] Проверяется HR
- [ ] Собеседование
- [ ] Рекомендован
- [ ] Одобрен
- [ ] Отклонён
- [ ] Нужно уточнение

## 15.4 HR Review

Accepted when:

- [ ] HR can view team applications.
- [ ] HR can view CV.
- [ ] HR can update HR review status.
- [ ] HR can write HR comment.
- [ ] HR can recommend candidate.
- [ ] HR cannot assign official role.
- [ ] HR review creates audit log.

## 15.5 Final Decision

Accepted when:

- [ ] CEO can approve/reject team application.
- [ ] CTO can approve/reject team application.
- [ ] Approval assigns selected role.
- [ ] Role assignment creates audit log.
- [ ] Team application decision creates audit log.
- [ ] HR cannot make final role assignment.

---

# 16. Announcements Acceptance Criteria

Accepted when:

- [ ] Announcements table exists.
- [ ] Announcements can be draft/published/archived.
- [ ] Announcements support audience type:
  - [ ] Все волонтёры
  - [ ] Команда
  - [ ] Участники проекта
- [ ] Volunteers see relevant announcements.
- [ ] Team-only announcements are hidden from regular volunteers.
- [ ] Project participant announcements are visible to approved participants.
- [ ] CEO/CTO/Ops/PR-SMM can publish according to permissions.
- [ ] Secretary can create drafts if implemented.
- [ ] UI is Russian.

---

# 17. Audit Logs Acceptance Criteria

Route: `/admin/audit-logs`.

Accepted when:

- [ ] Audit log table exists.
- [ ] Audit log stores actor.
- [ ] Audit log stores action.
- [ ] Audit log stores target type.
- [ ] Audit log stores target ID.
- [ ] Audit log stores old value.
- [ ] Audit log stores new value.
- [ ] Audit log stores comment.
- [ ] Audit log stores timestamp.
- [ ] CEO can view audit logs.
- [ ] CTO can view audit logs.
- [ ] Unauthorized users cannot view audit logs.

Required logged events:

- [ ] `role.assigned`
- [ ] `role.removed`
- [ ] `role.change_blocked`
- [ ] `project.created`
- [ ] `project.published`
- [ ] `project.sent_to_moderation`
- [ ] `project.approved`
- [ ] `project.returned_for_revision`
- [ ] `project.rejected`
- [ ] `project.cancelled`
- [ ] `project.completed`
- [ ] `project_application.submitted`
- [ ] `project_application.approved`
- [ ] `project_application.rejected`
- [ ] `project_application.waitlisted`
- [ ] `attendance.marked`
- [ ] `certificate.uploaded`
- [ ] `achievement.awarded`
- [ ] `team_application.submitted`
- [ ] `team_application.hr_reviewed`
- [ ] `team_application.recommended`
- [ ] `team_application.approved`
- [ ] `team_application.rejected`

---

# 18. Database Acceptance Criteria

Accepted when required tables exist:

- [ ] `profiles`
- [ ] `roles`
- [ ] `user_roles`
- [ ] `departments`
- [ ] `projects`
- [ ] `project_questions`
- [ ] `project_applications`
- [ ] `project_application_answers`
- [ ] `attendance`
- [ ] `certificates`
- [ ] `achievements`
- [ ] `team_applications`
- [ ] `announcements`
- [ ] `quotes`
- [ ] `audit_logs`

Constraints:

- [ ] `profiles.user_id` is unique.
- [ ] `user_roles(user_id, role_id)` is unique.
- [ ] `project_applications(project_id, user_id)` is unique.
- [ ] `attendance(project_id, user_id)` is unique.
- [ ] Duplicate certificates are prevented where appropriate.
- [ ] Duplicate achievements are prevented where appropriate.
- [ ] Foreign keys are defined.
- [ ] Useful indexes exist.

Seed data exists for:

- [ ] roles
- [ ] departments
- [ ] quotes

---

# 19. Storage Acceptance Criteria

Required buckets:

- [ ] `certificates`
- [ ] `cvs`

Certificates bucket accepted when:

- [ ] Certificate files can be uploaded.
- [ ] Certificate files are not publicly exposed by default.
- [ ] Certificate owner can access own file.
- [ ] Authorized managers can access relevant files.
- [ ] Unauthorized users cannot access files.

CVs bucket accepted when:

- [ ] CV files can be uploaded.
- [ ] Applicant can access own CV.
- [ ] HR can access CVs.
- [ ] CEO/CTO can access CVs.
- [ ] Unauthorized users cannot access CVs.

---

# 20. Russian UI Acceptance Criteria

Accepted when:

- [ ] All visible page titles are Russian.
- [ ] All buttons are Russian.
- [ ] All form labels are Russian.
- [ ] All validation messages are Russian.
- [ ] All success messages are Russian.
- [ ] All error messages are Russian.
- [ ] All empty states are Russian.
- [ ] All statuses are Russian.
- [ ] All project categories are shown in Russian.
- [ ] All certificate labels are Russian.
- [ ] All achievement labels are Russian.
- [ ] Auth pages are Russian.
- [ ] Admin pages are Russian.
- [ ] No default English UI remains.

Allowed exceptions:

- [ ] Founder/CEO
- [ ] CTO
- [ ] PR/SMM
- [ ] MUN
- [ ] Logistics Manager
- [ ] Partnership Manager

---

# 21. Design Acceptance Criteria

Accepted when:

- [ ] Color palette is used:
  - [ ] `#0B0829`
  - [ ] `#FF8400`
  - [ ] `#F9DEC6`
  - [ ] `#8FA0D8`
- [ ] Orange is used mainly for primary actions and important states.
- [ ] UI feels professional, not childish.
- [ ] Public website feels trustworthy.
- [ ] Volunteer dashboard is simple.
- [ ] Admin pages are structured and operational.
- [ ] Tables/cards are readable.
- [ ] Mobile layout is usable.
- [ ] Empty states exist.
- [ ] Loading states exist.
- [ ] Access denied page exists.
- [ ] Protected role warning exists.

---

# 22. Security Acceptance Criteria

Accepted when:

- [ ] Volunteers can view only their own private profile/certificates/applications.
- [ ] Managers see only data allowed by role/permission.
- [ ] Admin routes are server-protected.
- [ ] Role assignment is server-protected.
- [ ] Certificate upload is server-protected.
- [ ] Project moderation is server-protected.
- [ ] Attendance marking is server-protected.
- [ ] Audit logs are protected.
- [ ] Protected roles cannot be changed casually.
- [ ] Storage files are not exposed to unauthorized users.
- [ ] RLS policies or equivalent server-side protections exist.

---

# 23. QA Test Scenarios

## 23.1 Volunteer Flow

Accepted when this flow works fully:

```text
Register
→ complete profile
→ open projects
→ submit quick application
→ submit questionnaire application
→ view application status
→ get approved
→ appear in attendance list
→ after attendance, see certificate
→ see achievement
```

## 23.2 Manager Project Flow

Accepted when this flow works fully:

```text
Create project
→ choose application mode
→ publish or send to moderation
→ receive applications
→ review applications
→ approve participants
→ mark attendance
→ upload certificates
```

## 23.3 Coordinator Moderation Flow

Accepted when this flow works fully:

```text
Coordinator creates project
→ sends to moderation
→ project is hidden from volunteers
→ Ops/CEO/CTO reviews
→ approves project
→ project becomes visible
```

## 23.4 Team Application Flow

Accepted when this flow works fully:

```text
Volunteer submits team application with CV
→ HR reviews
→ HR recommends
→ CEO/CTO approves
→ role is assigned
→ audit log is created
```

## 23.5 Protected Role Flow

Accepted when:

```text
User tries to remove Founder/CEO or CTO through normal UI
→ action is blocked
→ Russian warning appears
→ audit log is created
```

---

# 24. MVP Launch Readiness Checklist

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

# 25. Final Acceptance Definition

The MVP is accepted when SapaSpeakers can run this real operational process inside the platform:

```text
A person registers as a volunteer.
They complete their profile.
They apply to a project.
A responsible manager reviews the application.
The manager approves them.
The project happens.
Attendance is marked.
A certificate is uploaded.
An achievement appears.
The volunteer has verified contribution history.
```

And when internal leadership can safely manage:

```text
roles
permissions
team applications
project moderation
attendance
certificates
audit logs
```

Without breaking:

```text
Russian UI
protected CEO/CTO access
server-side permissions
controlled project participation
```

If these conditions are met, the MVP is ready for real organizational use.
