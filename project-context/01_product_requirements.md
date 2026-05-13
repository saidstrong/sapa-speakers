# SapaSpeakers Volunteer Platform — Product Requirements

## 1. Purpose

The purpose of this product is to create an internal operating system for SapaSpeakers.

The platform should not be only a public website. It should become the main digital system where the organization manages volunteers, projects, applications, roles, certificates, achievements, and operational history.

The product must help SapaSpeakers become more:

- structured
- disciplined
- scalable
- professional
- trusted
- transparent internally
- attractive to volunteers and partners

The MVP should focus on the core operational cycle:

```text
Volunteer registers
→ completes profile
→ applies to project
→ gets reviewed
→ gets approved
→ attends project
→ receives certificate
→ earns achievement
→ builds verified contribution history
```

---

## 2. Product Positioning

SapaSpeakers Volunteer Platform is:

- an internal volunteer management system
- a public recruitment website
- a project participation system
- an attendance and certificate system
- a role and hierarchy management system
- a verified volunteer history system

It is not:

- a SaaS product
- a marketplace for many organizations
- a public social network
- a payment platform
- a mobile app in MVP
- an AI-first system in MVP

---

## 3. Main Product Principle

The most important product principle:

```text
Registration is open.
Project participation is controlled.
```

Anyone can register as a volunteer.

But registration does not automatically allow participation in projects.

Every project requires:

1. separate application
2. manager review
3. approval or rejection
4. attendance tracking
5. verified result

This principle must be reflected in:

- user flows
- UI copy
- application statuses
- database design
- permission checks
- admin workflows

---

## 4. Language Requirement

The whole user-facing product must be in Russian.

All UI text must be Russian:

- public pages
- auth pages
- dashboard
- sidebar
- forms
- labels
- buttons
- statuses
- validation errors
- empty states
- success messages
- error messages
- role names
- project categories
- certificate labels
- achievement labels
- admin pages

Technical names may be English:

- table names
- code variables
- API routes
- permission keys
- TypeScript types
- internal enum values

No mixed-language UI unless explicitly requested later.

---

## 5. Target Users

### 5.1 Public Visitor

A person who visits the website before registration.

Needs:

- understand what SapaSpeakers is
- see mission and projects
- understand how to become a volunteer
- register easily
- see that the organization is serious and trustworthy

Main actions:

- open landing page
- read about organization
- view public projects
- click “Стать волонтёром”
- create account

### 5.2 Volunteer

A registered user who participates or wants to participate in projects.

Needs:

- complete profile
- find projects
- apply to projects
- track application statuses
- view announcements
- access certificates
- view achievements
- apply to internal team roles

Main actions:

- edit profile
- submit project application
- answer project questionnaire
- view own applications
- download certificates
- view achievements
- submit team application with CV

### 5.3 Founder/CEO

Current person: Adiat.

Needs:

- control organization structure
- assign roles
- approve team applications
- manage all projects
- manage volunteers
- view operational state
- access audit logs
- make final organizational decisions

Main actions:

- assign/remove roles
- approve/reject team applications
- publish projects
- moderate projects
- view statistics
- view audit logs

### 5.4 CTO

Current person: Said Amanzhol.

Needs:

- control platform/system
- manage access safety
- assign roles
- protect system integrity
- fix access issues
- manage technical permissions
- view all platform data

Main actions:

- assign/remove roles
- manage protected access
- view audit logs
- manage settings
- verify system state
- correct permission issues

### 5.5 Operations Manager

Needs:

- run daily operations
- manage project execution
- moderate coordinator-created projects
- manage applications
- track attendance
- manage certificates
- view operational statistics

Main actions:

- create/publish projects
- approve/reject project applications
- moderate projects
- mark attendance
- upload/approve certificates
- publish operational announcements

### 5.6 HR Manager

Needs:

- review volunteers
- manage team applications
- review CVs
- recommend candidates
- keep HR comments
- filter volunteers by skills/languages/experience

Main actions:

- view volunteer profiles
- view CVs
- update HR application statuses
- write HR comments
- recommend candidates to CEO/CTO

Important: HR cannot assign official roles.

### 5.7 Team Lead / Coordinator

Includes:

- Тимлид волонтёров
- Менеджер по обучению
- Координатор лингвистического сопровождения
- Эко-координатор
- Координатор MUN

Needs:

- create projects in their direction
- send projects to moderation
- manage assigned projects
- review applications to own projects
- mark attendance
- upload certificates for eligible participants
- submit reports

Main actions:

- create project draft
- send to moderation
- review own project applications
- approve/reject/waitlist volunteers
- mark attendance
- upload certificates
- confirm achievements

### 5.8 Logistics Manager

Needs:

- manage physical readiness of assigned projects
- control location, meeting point, materials, equipment, and instructions

Main actions:

- edit logistics block
- create checklist
- manage materials list
- publish instructions to approved participants
- submit logistics report

Important: Logistics Manager does not control volunteer approval unless separately assigned as project lead.

### 5.9 PR/SMM Manager

Needs:

- manage public image
- create announcements/news
- upload media
- prepare photo reports
- use real impact numbers for reputation

Main actions:

- create/publish announcements
- write news
- upload media
- create photo reports
- manage public-facing content

Important: PR/SMM must not invent impact numbers. Public reputation content should be based on real platform data.

### 5.10 Secretary

Needs:

- organize documents
- maintain meeting protocols
- manage archives
- prepare drafts
- support administrative order

Main actions:

- upload documents
- create meeting protocols
- create announcement drafts
- maintain archives
- view project calendar

Important: Secretary records decisions but does not make management decisions.

---

## 6. MVP Product Objectives

The MVP must achieve these outcomes:

1. A public visitor can understand the organization and register.
2. A volunteer can create an account and complete profile.
3. A volunteer can apply to published projects.
4. A project can use quick application or questionnaire application.
5. Managers can review project applications.
6. Managers can approve/reject/waitlist applicants.
7. Attendance can be marked after project execution.
8. Certificates can be uploaded only for eligible attended volunteers.
9. Volunteers can see and download their certificates.
10. Achievements can be stored in volunteer profiles.
11. Volunteers can apply to internal team roles with CV.
12. HR can review and recommend team applicants.
13. CEO or CTO can assign roles.
14. Founder/CEO and CTO roles are protected.
15. Major actions are recorded in audit logs.
16. UI is fully Russian.
17. Role-based navigation only shows accessible pages.

---

## 7. Functional Requirements

### 7.1 Public Website

The platform must provide public pages before login.

Required public pages:

- Главная
- О нас
- Проекты
- Стать волонтёром
- Заявка в команду
- Контакты

The public website must:

- explain SapaSpeakers
- show mission
- show project categories
- show public/open projects
- encourage registration
- provide clear contact/social links
- look professional and trustworthy

### 7.2 Authentication

The platform must support account registration and login.

Basic account fields:

- Имя
- Фамилия
- Email
- Телефон
- Пароль

After login, user must be redirected to `/app`, not to public landing page.

### 7.3 Volunteer Profile

Every registered volunteer must have a detailed profile.

Profile fields:

- Дата рождения
- Город
- Учебное заведение / место работы
- Telegram
- WhatsApp
- Языки
- Навыки
- Интересы
- Опыт волонтёрства
- Предпочитаемые направления проектов
- Кратко о себе

The system must calculate or store profile completion status.

A volunteer should not apply to projects until required profile fields are completed.

### 7.4 Role System

The platform must support multiple roles per user.

Required tables:

- `roles`
- `user_roles`

Do not store only one fixed role on the user.

Required roles:

- Founder/CEO
- CTO
- Операционный менеджер
- HR-менеджер
- Тимлид волонтёров
- Менеджер по обучению
- Координатор лингвистического сопровождения
- Эко-координатор
- Logistics Manager
- PR/SMM-менеджер
- Partnership Manager
- Координатор MUN
- Секретарь
- Волонтёр

Role assignment rule:

Only Founder/CEO or CTO can assign, change, or remove internal roles.

Approval from one of them is enough.

### 7.5 Protected Roles

Founder/CEO and CTO roles are protected.

The UI must not allow normal removal of these roles.

Protected role changes must require manual database-level action, special protected mode, or technical/system-level intervention.

Every role change must create an audit log.

### 7.6 Role-Based Navigation

The sidebar must only show pages the current user can access.

Do not show locked pages.

A regular volunteer should not see:

- Роли и доступ
- Журнал действий
- Заявки на проекты
- Посещаемость
- Сертификаты admin page

A CEO/CTO should see high-control pages.

A coordinator should see only own project tools.

### 7.7 Volunteer Dashboard

The volunteer dashboard must show:

- welcome message
- quote of the day
- profile completion status
- active/approved projects
- project application statuses
- latest announcements
- achievements summary
- latest certificates

The dashboard should be simple and personal.

### 7.8 Projects

The platform must support project creation and publishing.

Project fields:

- title
- description
- category
- status
- application mode
- location
- meeting point
- start datetime
- end datetime
- application deadline
- needed volunteers count
- creator
- responsible person
- logistics manager
- PR manager
- published at

Project categories:

- Образовательный
- Дипломатический
- Экологический
- Спортивный
- Культурный
- Выставка
- MUN
- Обучение
- Другое

Only published projects are visible to volunteers.

### 7.9 Project Moderation

High-authority roles can publish projects immediately:

- Founder/CEO
- CTO
- Operations Manager

Coordinator/team roles can create projects but must send them to moderation:

- Тимлид волонтёров
- Менеджер по обучению
- Координатор лингвистического сопровождения
- Эко-координатор
- Координатор MUN

Moderators:

- Founder/CEO
- CTO
- Operations Manager

Moderation actions:

- Одобрить
- Вернуть на доработку
- Отклонить

### 7.10 Project Applications

Every project must have an application mode:

1. Быстрая заявка
2. Заявка с анкетой

Quick application:

- volunteer clicks “Подать заявку”
- application is created immediately
- status becomes “На рассмотрении”

Questionnaire application:

- volunteer answers custom questions
- application is submitted with answers
- responsible manager reviews answers

Project application statuses:

- На рассмотрении
- Одобрено
- В резерве
- Отклонено
- Отменено пользователем
- Участвовал
- Не пришёл

### 7.11 Project Application Review

Responsible managers must be able to:

- view applications to their projects
- view volunteer profile
- view questionnaire answers
- approve applicant
- reject applicant
- move applicant to reserve
- leave review comment

CEO/CTO/Operations Manager can view broader project application data.

Team leads and coordinators should only manage their own assigned projects.

### 7.12 Attendance

After project execution, responsible managers must be able to mark attendance.

Attendance statuses:

- Присутствовал
- Не пришёл
- Опоздал
- По уважительной причине

Attendance marking must store:

- project
- volunteer
- status
- marked by
- marked at
- comment

Attendance is required before certificate upload.

### 7.13 Certificates

The system must support uploading certificates to volunteer profiles.

Certificate upload allowed only if:

1. volunteer was approved for the project
2. volunteer was marked as present/attended

Certificate fields:

- certificate title
- project
- volunteer
- file
- issue date
- uploaded by
- status
- comment

Certificate statuses:

- Загружен
- Подтверждён
- Отклонён

Volunteers must be able to view and download their certificates from личный кабинет.

### 7.14 Achievements

The platform must support volunteer achievements.

Achievement examples:

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

- automatic
- manual
- certificate_based
- attendance_based

Achievements should help build verified volunteer history.

### 7.15 Team Applications

Volunteers must be able to apply to internal roles.

Team application fields:

- Желаемая должность
- Почему вы хотите эту роль?
- Ваш опыт
- Ваши навыки
- Сколько времени готовы уделять?
- CV-файл
- Telegram
- Instagram
- LinkedIn
- Portfolio/link if any
- Additional comment

Team application statuses:

- На рассмотрении
- Проверяется HR
- Собеседование
- Рекомендован
- Одобрен
- Отклонён
- Нужно уточнение

HR can review and recommend.

Only Founder/CEO or CTO can make final decision and assign role.

### 7.16 Announcements

The platform must support announcements.

Announcement audiences for MVP:

- Все волонтёры
- Команда
- Участники проекта

Announcement statuses:

- Черновик
- Опубликовано
- В архиве

Can publish:

- CEO
- CTO
- Operations Manager
- PR/SMM Manager

Secretary can create drafts only.

### 7.17 Motivational Quote of the Day

The volunteer dashboard must show one quote per day.

Minimum seed quotes:

1. Большие изменения начинаются с маленького доброго действия.
2. Волонтёрство — это не свободное время, а свободный выбор.
3. Сильная команда строится не на словах, а на ответственности.

Logic: use active quotes and rotate by date.

### 7.18 Audit Logs

The system must record major actions.

Required audit events:

- role assigned
- role removed
- project created
- project approved
- project rejected
- project returned for revision
- application submitted
- application reviewed
- attendance marked
- certificate uploaded
- achievement awarded
- team application decided

Audit log fields:

- actor user
- action
- target type
- target ID
- old value
- new value
- comment
- created at

---

## 8. Non-Functional Requirements

### 8.1 Security

The system must protect private volunteer data.

Rules:

- volunteers can view only their own private data
- managers see only data required for their role
- protected roles cannot be casually changed
- admin routes must be permission-protected
- certificate upload must be eligibility-protected
- role changes must be audit-logged

### 8.2 Reliability

The system should avoid silent failure.

Important actions should show:

- success message
- error message
- loading state
- empty state

### 8.3 Maintainability

Code should be structured around:

- route groups
- reusable UI components
- central Russian labels
- permission helpers
- database query functions
- server-side validation
- clear role constants
- clear enum/status mapping

### 8.4 Scalability

The MVP should support growth beyond 100 volunteers.

Design should not assume:

- one role per user
- one manager per project forever
- only one project type
- no moderation
- no audit history

### 8.5 UI Simplicity

Volunteer UI should be simple.

Manager UI can be denser but must remain organized.

Every page should answer:

1. What is this page?
2. What can the user do here?
3. What is the next useful action?

---

## 9. MVP Constraints

The MVP must not overbuild.

Avoid building these in MVP:

- mobile app
- payment system
- AI assistant
- public certificate verification
- advanced partner CRM
- advanced analytics
- automatic PDF certificate generation
- complex notifications
- public volunteer ranking
- advanced gamification
- content calendar

The MVP should focus on:

- profiles
- projects
- applications
- moderation
- attendance
- certificates
- achievements
- roles
- team applications
- audit logs

---

## 10. Required Pages

### Public Pages

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

### Authenticated Volunteer Pages

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

### Admin / Management Pages

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

---

## 11. Required Database Entities

Core entities:

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

## 12. Acceptance Criteria

The MVP product requirements are satisfied when:

1. A public visitor can understand the organization and register.
2. A registered user can complete a detailed profile.
3. A volunteer cannot apply to projects before completing required profile fields.
4. A volunteer can see published projects.
5. A volunteer can submit quick applications.
6. A volunteer can submit questionnaire applications.
7. A manager can review applications to their projects.
8. Approved users become official participants.
9. Attendance can be marked only for project participants.
10. Certificates can be uploaded only for approved and present volunteers.
11. Volunteers can see certificates in личный кабинет.
12. Achievements can be awarded and shown on volunteer profiles.
13. Volunteers can submit team applications with CV.
14. HR can review and recommend candidates.
15. CEO or CTO can assign internal roles.
16. Founder/CEO and CTO roles cannot be removed through normal UI.
17. Major actions create audit logs.
18. Sidebars show only pages the user can access.
19. All user-facing UI is Russian.
20. The product can be extended later without rewriting the whole role/project system.

---

## 13. Priority Order for Implementation

Recommended MVP build order:

1. Project skeleton and route groups
2. Russian UI constants and design system
3. Supabase setup
4. Auth
5. Profiles
6. Roles and permissions
7. Role-based navigation
8. Public pages
9. Volunteer dashboard
10. Projects
11. Project applications
12. Project moderation
13. Attendance
14. Certificates
15. Achievements
16. Team applications
17. HR review
18. Role assignment
19. Audit logs
20. Final QA and Russian UI pass

---

## 14. Product Requirement Summary

The MVP is successful if SapaSpeakers can use the platform to run its real volunteer operations:

- recruit volunteers
- structure projects
- approve participants
- track attendance
- issue certificates
- build verified contribution records
- manage internal roles
- process team applications
- create a more professional organization image

The system should be built carefully, with strong role boundaries and Russian-first UI from the beginning.
