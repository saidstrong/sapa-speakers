# SapaSpeakers Volunteer Platform — Routes & Pages

## 1. Purpose

This document defines the route structure, page responsibilities, layouts, sidebars, and page-level access rules for the SapaSpeakers Volunteer Platform.

The platform has three major route zones:

1. Public website
2. Authenticated volunteer area
3. Admin / management area

The route system must support:

- Russian-first UI
- protected authenticated routes
- role-based navigation
- permission-based access
- public recruitment pages
- volunteer личный кабинет
- management dashboards for different internal roles

Important UX rule:

```text
Do not show locked pages in the sidebar.
Only show pages that the current user can actually access.
```

---

## 2. Route Zones

### 2.1 Public Routes

Public routes are visible before login.

Required public routes:

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

### 2.2 Authenticated App Routes

After login, users should be redirected to `/app`.

Required authenticated routes:

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

### 2.3 Admin / Management Routes

Required admin routes:

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

Admin routes must be protected by server-side permission checks. Frontend sidebar hiding is not enough.

---

## 3. Recommended Next.js Route Structure

```text
src/app/
├─ (public)/
│  ├─ page.tsx
│  ├─ about/page.tsx
│  ├─ projects/page.tsx
│  ├─ join/page.tsx
│  ├─ team-application/page.tsx
│  └─ contacts/page.tsx
├─ (auth)/
│  ├─ login/page.tsx
│  └─ register/page.tsx
├─ (app)/
│  └─ app/
│     ├─ layout.tsx
│     ├─ page.tsx
│     ├─ announcements/page.tsx
│     ├─ projects/page.tsx
│     ├─ projects/[id]/page.tsx
│     ├─ applications/page.tsx
│     ├─ achievements/page.tsx
│     ├─ certificates/page.tsx
│     └─ profile/page.tsx
└─ (admin)/
   └─ admin/
      ├─ layout.tsx
      ├─ volunteers/page.tsx
      ├─ team-applications/page.tsx
      ├─ project-applications/page.tsx
      ├─ projects/page.tsx
      ├─ moderation/page.tsx
      ├─ attendance/page.tsx
      ├─ certificates/page.tsx
      ├─ roles/page.tsx
      ├─ stats/page.tsx
      ├─ documents/page.tsx
      ├─ partners/page.tsx
      ├─ settings/page.tsx
      └─ audit-logs/page.tsx
```

---

## 4. Public Pages

### 4.1 `/` — Главная

Purpose: introduce SapaSpeakers and encourage people to become volunteers.

Target users:

- public visitors
- potential volunteers
- potential team members
- partners
- parents/students/guests checking credibility

Main sections:

1. Hero section
2. Mission section
3. Organization description
4. Project categories
5. Impact numbers
6. How volunteering works
7. CTA section
8. Contact/social links

Required UI text examples:

```text
SapaSpeakers
Волонтёрская организация нового уровня
Станьте частью команды, которая создаёт реальные изменения.
Стать волонтёром
Посмотреть проекты
Подать заявку в команду
```

The landing page must explain what SapaSpeakers is, how users can join, that project participation requires approval, and that certificates/achievements are stored digitally.

### 4.2 `/about` — О нас

Purpose: explain the organization’s mission, values, and structure.

Suggested headings:

```text
О SapaSpeakers
Наша миссия
Наши ценности
Как мы работаем
Структура организации
Почему нам можно доверять
```

### 4.3 `/projects` — Проекты

Public list of published projects only.

Project card fields:

- project title
- project category
- short description
- date
- location
- application deadline
- needed volunteers count
- application mode
- CTA button

CTA button if not logged in:

```text
Войти, чтобы подать заявку
```

or:

```text
Зарегистрироваться и подать заявку
```

If logged in:

```text
Подать заявку
```

Empty state:

```text
Сейчас нет опубликованных проектов.
Новые проекты появятся здесь после публикации.
```

### 4.4 `/join` — Стать волонтёром

Explains the volunteer journey:

```text
1. Зарегистрируйтесь
2. Заполните профиль
3. Подайте заявку на проект
4. Дождитесь решения ответственного менеджера
5. Участвуйте в проекте
6. Получите сертификат и достижение
```

Important explanation:

```text
Регистрация не означает автоматическое участие в проекте.
Для каждого проекта нужно подать отдельную заявку и получить одобрение.
```

### 4.5 `/team-application` — Заявка в команду

If user is not logged in, explain the process and ask user to create account first.

Important explanation:

```text
HR-менеджер может рассмотреть вашу заявку и рекомендовать кандидата.
Финальное решение принимает Founder/CEO или CTO.
```

### 4.6 `/contacts` — Контакты

Required content:

- Instagram
- Telegram
- WhatsApp
- email if needed
- location/city if needed

Suggested copy:

```text
Свяжитесь с нами
Мы открыты к волонтёрам, партнёрам и новым проектам.
```

### 4.7 `/login` — Вход

Fields:

- Email
- Пароль

Buttons:

```text
Войти
Создать аккаунт
```

After login redirect to `/app`.

### 4.8 `/register` — Регистрация

Fields:

- Имя
- Фамилия
- Email
- Телефон
- Пароль
- Повторите пароль

Preferred after registration: redirect to `/app/profile`.

Reason: user should complete profile before applying to projects.

---

## 5. Authenticated Volunteer Pages

### 5.1 `/app` — Личный кабинет

Required blocks:

1. Welcome block
2. Quote of the day
3. Profile completion status
4. My active applications
5. My approved upcoming projects
6. Latest announcements
7. My achievements summary
8. Latest certificates

Suggested text:

```text
Добро пожаловать, {firstName}
Ваш личный кабинет
Здесь вы можете отслеживать заявки, проекты, сертификаты и достижения.
```

Profile incomplete message:

```text
Заполните профиль, чтобы подавать заявки на проекты.
```

### 5.2 `/app/announcements` — Объявления

Volunteer sees announcements available to them:

- all volunteers
- projects where they are approved participant
- team announcements if they have internal role

Empty state:

```text
Пока нет объявлений.
Новые сообщения организации появятся здесь.
```

### 5.3 `/app/projects` — Проекты

Shows all published projects available for application.

Project card fields:

- title
- category
- date
- location
- application deadline
- needed volunteers
- application mode
- current application status if user already applied

Buttons:

```text
Подать заявку
Заявка отправлена
Набор закрыт
Заполните профиль
```

### 5.4 `/app/projects/[id]` — Project Detail

Shows full project information and allows application.

If profile incomplete:

```text
Чтобы подать заявку, сначала заполните профиль.
```

If quick application:

```text
Подать заявку
```

If questionnaire:

```text
Заполнить анкету
```

If already applied:

```text
Вы уже подали заявку на этот проект.
Статус: {status}
```

### 5.5 `/app/applications` — Мои заявки

Shows volunteer project application history.

Statuses:

- На рассмотрении
- Одобрено
- В резерве
- Отклонено
- Отменено пользователем
- Участвовал
- Не пришёл

Empty state:

```text
У вас пока нет заявок.
Откройте раздел «Проекты» и подайте заявку на подходящий проект.
```

### 5.6 `/app/achievements` — Мои достижения

Shows verified achievements.

Empty state:

```text
У вас пока нет достижений.
После участия в проектах ваши достижения появятся здесь.
```

### 5.7 `/app/certificates` — Сертификаты

Shows downloadable certificates.

Button:

```text
Скачать сертификат
```

Empty state:

```text
У вас пока нет сертификатов.
Сертификаты появятся здесь после участия в проектах.
```

### 5.8 `/app/profile` — Профиль

Fields:

- Имя
- Фамилия
- Email
- Телефон
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

Button: `Сохранить профиль`.

---

## 6. Admin / Management Pages

### 6.1 `/admin/volunteers` — Волонтёры

Purpose: show volunteer list and allow authorized users to view profiles.

Main users:

- CEO
- CTO
- Operations Manager
- HR Manager

Fields:

- full name
- phone
- Telegram
- city
- skills
- languages
- project count
- hours
- profile completion
- roles

### 6.2 `/admin/team-applications` — Заявки в команду

Main users:

- HR Manager
- CEO
- CTO

HR actions:

```text
Взять в проверку
Назначить собеседование
Рекомендовать
Запросить уточнение
Отклонить на HR-этапе
```

CEO/CTO actions:

```text
Одобрить
Отклонить
Назначить роль
```

### 6.3 `/admin/project-applications` — Заявки на проекты

Main users:

- CEO
- CTO
- Operations Manager
- responsible team leads/coordinators for own projects

Actions:

```text
Одобрить
В резерв
Отклонить
Открыть профиль
```

### 6.4 `/admin/projects` — Проекты

Purpose: create and manage projects.

Actions depending on permission:

```text
Создать проект
Редактировать
Опубликовать
Отправить на модерацию
Закрыть набор
Завершить проект
Отменить проект
```

### 6.5 `/admin/moderation` — Проекты на модерации

Moderators:

- CEO
- CTO
- Operations Manager

Actions:

```text
Одобрить
Вернуть на доработку
Отклонить
```

### 6.6 `/admin/attendance` — Посещаемость

Flow:

1. Select project
2. View approved participants
3. Mark attendance status
4. Save attendance
5. Certificates become available only for present volunteers

Attendance statuses:

```text
Присутствовал
Не пришёл
Опоздал
По уважительной причине
```

### 6.7 `/admin/certificates` — Сертификаты

Certificate upload rule:

```text
approved project application exists
AND attendance status = present
```

Actions:

```text
Загрузить сертификат
Подтвердить
Отклонить
```

### 6.8 `/admin/roles` — Роли и доступ

Main users:

- CEO
- CTO

Protected role warning:

```text
Эта роль защищена и не может быть изменена через обычную панель.
```

Every role assignment/removal must create audit log.

### 6.9 `/admin/stats` — Статистика

MVP metrics:

- total volunteers
- completed projects
- active projects
- pending applications
- approved participants
- certificates issued
- achievements awarded
- volunteer hours if tracked

### 6.10 `/admin/documents` — Документы

Simple MVP or placeholder.

Document categories:

```text
Общие документы
Протоколы
Инструкции
Шаблоны
Проектные документы
HR-документы
Партнёрские документы
```

### 6.11 `/admin/partners` — Партнёры

Simple or postponed.

Fields if included:

- partner name
- contact person
- phone/email
- status
- notes
- related projects

### 6.12 `/admin/settings` — Настройки

Minimal MVP scope:

- organization name
- social links
- contact links
- public impact number visibility
- active quote management

### 6.13 `/admin/audit-logs` — Журнал действий

Main users:

- CEO
- CTO

Fields:

- date/time
- actor
- action
- target type
- target
- old value
- new value
- comment

---

## 7. Layout Requirements

### 7.1 Public Layout

Public layout should contain:

- top navigation
- logo/name
- public menu
- CTA button
- footer

Public menu:

```text
Главная
О нас
Проекты
Стать волонтёром
Заявка в команду
Контакты
```

### 7.2 Authenticated App Layout

Authenticated layout should contain:

- sidebar
- top bar
- current user name
- role labels if useful
- logout button
- main content area

Sidebar must be permission-based.

### 7.3 Admin Layout

Admin pages should include:

- page title
- short description
- primary action button if allowed
- table/list
- filters if useful
- empty state

---

## 8. Page-Level Access Rules

Public routes are accessible to everyone.

If logged-in user opens `/login` or `/register`, redirect to `/app`.

Authenticated app routes require logged-in user. If unauthenticated, redirect to `/login`.

Admin routes require logged-in user and specific permission.

Access denied text:

```text
У вас нет доступа к этой странице.
Если вы считаете, что это ошибка, обратитесь к администратору платформы.
```

---

## 9. Route-To-Permission Map

| Route | Required Permission |
|---|---|
| `/app` | `view_app` |
| `/app/announcements` | `view_app` |
| `/app/projects` | `view_app` |
| `/app/projects/[id]` | `view_app` |
| `/app/applications` | `view_app` |
| `/app/achievements` | `view_own_achievements` |
| `/app/certificates` | `view_own_certificates` |
| `/app/profile` | `edit_own_profile` |
| `/admin/volunteers` | `view_all_volunteers` or `view_basic_volunteers` |
| `/admin/team-applications` | `view_team_applications` |
| `/admin/project-applications` | `view_project_applications` |
| `/admin/projects` | `create_project` or `manage_all_projects` or `manage_own_projects` |
| `/admin/moderation` | `moderate_projects` |
| `/admin/attendance` | `mark_attendance` |
| `/admin/certificates` | `upload_certificates` or `confirm_certificates` |
| `/admin/roles` | `manage_roles` |
| `/admin/stats` | `view_stats` |
| `/admin/documents` | `manage_documents` |
| `/admin/partners` | `manage_partners` |
| `/admin/settings` | `manage_system_settings` |
| `/admin/audit-logs` | `view_audit_logs` |

---

## 10. MVP Page Priority

Phase 1: skeleton pages for all MVP routes with Russian title/description/layout shell/permission boundary.

Phase 2: core volunteer pages:

1. `/register`
2. `/login`
3. `/app`
4. `/app/profile`
5. `/app/projects`
6. `/app/projects/[id]`
7. `/app/applications`

Phase 3: core management pages:

1. `/admin/projects`
2. `/admin/project-applications`
3. `/admin/moderation`
4. `/admin/attendance`
5. `/admin/certificates`

Phase 4: role and team pages:

1. `/admin/team-applications`
2. `/admin/roles`
3. `/admin/audit-logs`
4. `/admin/volunteers`

Phase 5: supporting pages:

1. `/app/achievements`
2. `/app/certificates`
3. `/app/announcements`
4. `/admin/stats`
5. `/admin/documents`

---

## 11. Acceptance Criteria

Routes and pages are correct when:

1. Public users can access public pages.
2. Logged-in users are redirected away from login/register pages.
3. Unauthenticated users cannot access `/app`.
4. Unauthorized users cannot access `/admin`.
5. Volunteer sidebar shows only volunteer pages.
6. CEO/CTO sidebar shows high-control pages.
7. Operations Manager sidebar shows operational pages.
8. HR sidebar shows HR pages.
9. Team leads/coordinators see only assigned project tools.
10. Admin pages are protected by server-side permission checks.
11. All page titles and visible labels are Russian.
12. Public projects page shows only published projects.
13. Volunteer project page blocks application if profile is incomplete.
14. Certificate admin page only supports eligible participants.
15. Audit logs page is visible only to users with audit permission.
16. No locked/inaccessible pages appear in sidebar.
17. Every page has useful empty states.
18. Every major page has a clear primary action.

---

## 12. Implementation Notes for Codex

When implementing routes/pages, Codex should:

1. Use Next.js App Router route groups.
2. Create public, auth, app, and admin layouts.
3. Create route placeholders first.
4. Add Russian page titles and descriptions.
5. Add permission-based sidebar generator.
6. Add server-side route guards for protected pages.
7. Avoid full feature implementation in the skeleton phase.
8. Keep visual design consistent with the palette.
9. Avoid English user-facing copy.
10. Add empty states for pages without data.
