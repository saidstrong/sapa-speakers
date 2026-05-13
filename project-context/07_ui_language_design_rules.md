# SapaSpeakers Volunteer Platform — UI, Language & Design Rules

## 1. Purpose

This document defines the user interface, Russian language rules, design identity, component behavior, layout principles, and copy standards for the SapaSpeakers Volunteer Platform.

The platform must feel:

- serious
- professional
- clean
- minimalistic
- warm
- trustworthy
- organized
- operational

This is not a playful social app. This is an internal operating system for a real volunteering organization.

---

## 2. Absolute Language Rule

The entire user-facing platform must be in Russian.

This includes:

- landing page
- auth pages
- dashboard
- личный кабинет
- sidebar
- buttons
- form labels
- validation errors
- success messages
- empty states
- statuses
- filters
- tables
- admin pages
- project categories
- role names
- certificate labels
- achievement labels
- profile fields
- audit log UI
- settings UI

Technical names may be English only in code/database:

- database table names
- API route names
- TypeScript types
- internal enum values
- permission keys
- server function names
- file names

---

## 3. No Mixed UI Languages

Do not mix Russian, English, and Kazakh in the interface unless explicitly requested later.

Bad:

```text
Dashboard
Projects
Apply
Volunteer profile
Submit application
```

Good:

```text
Личный кабинет
Проекты
Подать заявку
Профиль волонтёра
Отправить заявку
```

Exception: some official role names may stay partially English if intentionally chosen:

```text
Founder/CEO
CTO
PR/SMM-менеджер
Logistics Manager
Partnership Manager
MUN
```

But surrounding UI must still be Russian.

---

## 4. Tone of Voice

The platform voice should be:

- respectful
- clear
- calm
- professional
- direct
- supportive

Avoid:

- jokes
- slang
- childish excitement
- overly emotional phrases
- aggressive warnings
- vague motivational text everywhere

Good:

```text
Заполните профиль, чтобы подать заявку на проект.
```

Bad:

```text
Ой! Кажется, вы забыли заполнить профиль 😅
```

---

## 5. Product Copy Principles

### 5.1 Be Clear

Every page should quickly explain:

1. what this page is
2. what the user can do here
3. what the next action is

Example:

```text
Здесь вы можете отслеживать свои заявки, сертификаты и достижения.
```

### 5.2 Be Operational

Good:

```text
Отметьте посещаемость участников проекта.
```

Bad:

```text
Добро пожаловать в удивительный мир посещаемости.
```

### 5.3 Be Trustworthy

Good:

```text
Все изменения ролей сохраняются в журнале действий.
```

Bad:

```text
Меняйте роли как хотите.
```

### 5.4 Explain Controlled Participation

This principle must appear clearly in volunteer-facing flows:

```text
Регистрация не означает автоматическое участие в проекте.
Для каждого проекта нужно подать отдельную заявку и получить одобрение.
```

---

## 6. Color Palette

| Name | Hex | Purpose |
|---|---:|---|
| Bleu Oxford | `#0B0829` | Main dark identity color |
| Orange | `#FF8400` | Primary action color |
| Amande | `#F9DEC6` | Warm soft background |
| Vista Bleu | `#8FA0D8` | Secondary calm accent |

---

## 7. Color Usage Rules

### Bleu Oxford — `#0B0829`

Use for:

- sidebar background
- major headings
- strong text
- dark sections
- dashboard identity blocks
- top-level navigation

### Orange — `#FF8400`

Use for:

- primary buttons
- active sidebar item
- important CTA
- critical action highlight
- selected states
- key numbers if needed

Do not overuse orange. Orange should mean action, importance, or priority.

Avoid:

- orange everywhere
- all cards orange
- all icons orange
- large orange backgrounds on every page

### Amande — `#F9DEC6`

Use for:

- soft cards
- warm background sections
- landing page sections
- dashboard surfaces
- calm empty states

### Vista Bleu — `#8FA0D8`

Use for:

- secondary badges
- info cards
- calm highlights
- supporting labels
- status surfaces
- secondary accents

---

## 8. Visual Style

The interface should be:

- minimal
- spacious
- structured
- readable
- calm
- professional

Avoid:

- too many gradients
- too many shadows
- childish illustrations
- chaotic dashboard widgets
- excessive icons
- low contrast text
- unnecessary animation
- bright orange overload

---

## 9. Layout Principles

### Public Website Layout

Public pages should contain:

- header
- logo/name
- public navigation
- primary CTA
- footer

Public navigation:

```text
Главная
О нас
Проекты
Стать волонтёром
Заявка в команду
Контакты
```

Primary CTA:

```text
Стать волонтёром
```

### Authenticated App Layout

Authenticated pages should use an app shell:

- sidebar
- top bar
- main content area
- current user name
- role labels if useful
- logout button

### Admin Layout

Admin pages should be denser but still readable.

Each admin page should include:

- page title
- short explanation
- primary action
- filters if useful
- table/list
- empty state
- permission-safe actions

---

## 10. Sidebar Rules

The sidebar must be generated from permissions.

Do not show locked pages.

Bad:

```text
Show all pages and block after click.
```

Good:

```text
Only show pages the user can access.
```

Server-side checks are still required. Frontend hiding is not enough.

---

## 11. Component Style Rules

### Buttons

Primary button: main action on page.

Examples:

```text
Стать волонтёром
Подать заявку
Создать проект
Сохранить профиль
Загрузить сертификат
```

Secondary button: less important actions.

Examples:

```text
Подробнее
Отмена
Вернуться
Посмотреть проект
```

Danger button: use carefully.

Examples:

```text
Отклонить
Отменить проект
Удалить роль
```

Protected action warning must appear before dangerous actions.

### Cards

Cards should be used for:

- project cards
- certificate cards
- achievement cards
- dashboard summaries
- announcement previews

Each card should have title, useful information, status/badge if needed, and one clear action.

### Tables

Use tables for admin pages:

- volunteers
- project applications
- team applications
- certificates
- audit logs
- attendance

Tables should include clear column names, filters, status badges, row actions, and empty state.

For mobile, tables should become stacked cards if necessary.

### Badges

Use badges for:

- project status
- application status
- certificate status
- role label
- category label

Badges must be readable and consistent.

---

## 12. Status Label Maps

### Project Statuses

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

### Project Application Statuses

| Internal Value | Russian UI |
|---|---|
| `pending` | На рассмотрении |
| `approved` | Одобрено |
| `waitlisted` | В резерве |
| `rejected` | Отклонено |
| `cancelled_by_user` | Отменено пользователем |
| `attended` | Участвовал |
| `no_show` | Не пришёл |

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

### Attendance Statuses

| Internal Value | Russian UI |
|---|---|
| `present` | Присутствовал |
| `absent` | Не пришёл |
| `late` | Опоздал |
| `excused` | По уважительной причине |

### Certificate Statuses

| Internal Value | Russian UI |
|---|---|
| `uploaded` | Загружен |
| `confirmed` | Подтверждён |
| `rejected` | Отклонён |

### Announcement Statuses

| Internal Value | Russian UI |
|---|---|
| `draft` | Черновик |
| `published` | Опубликовано |
| `archived` | В архиве |

---

## 13. Project Category Labels

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

## 14. Role Display Labels

| Internal Key | Russian UI |
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

---

## 15. Common Button Labels

Use these Russian labels consistently:

```text
Войти
Выйти
Зарегистрироваться
Создать аккаунт
Сохранить
Отмена
Назад
Подробнее
Редактировать
Удалить
Подтвердить
Отклонить
Одобрить
В резерв
Вернуть на доработку
Отправить
Отправить заявку
Подать заявку
Заполнить анкету
Создать проект
Опубликовать
Отправить на модерацию
Закрыть набор
Завершить проект
Отменить проект
Загрузить сертификат
Скачать сертификат
Назначить роль
Сохранить изменения
```

---

## 16. Common Success Messages

```text
Профиль сохранён.
Заявка отправлена.
Анкета отправлена.
Проект создан.
Проект отправлен на модерацию.
Проект опубликован.
Проект возвращён на доработку.
Проект отклонён.
Заявка одобрена.
Заявка добавлена в резерв.
Заявка отклонена.
Посещаемость сохранена.
Сертификат загружен.
Достижение добавлено.
Роль назначена.
Изменения сохранены.
```

---

## 17. Common Error Messages

```text
Заполните обязательные поля.
У вас нет доступа к этой странице.
У вас нет прав для выполнения этого действия.
Войдите или зарегистрируйтесь, чтобы продолжить.
Заполните профиль перед подачей заявки.
Вы уже подали заявку на этот проект.
Дедлайн подачи заявок уже прошёл.
Набор на этот проект закрыт.
Этот проект сейчас недоступен.
Ответьте на обязательный вопрос.
Загрузите файл.
Недопустимый формат файла.
Файл слишком большой.
Сертификат можно загрузить только для участника, который присутствовал на проекте.
Эта роль защищена и не может быть изменена через обычную панель.
Произошла ошибка. Попробуйте ещё раз.
```

---

## 18. Empty State Copy

Projects:

```text
Сейчас нет доступных проектов.
Новые проекты появятся здесь после публикации.
```

My applications:

```text
У вас пока нет заявок.
Откройте раздел «Проекты» и подайте заявку на подходящий проект.
```

Certificates:

```text
У вас пока нет сертификатов.
Сертификаты появятся здесь после участия в проектах.
```

Achievements:

```text
У вас пока нет достижений.
После участия в проектах ваши достижения появятся здесь.
```

Announcements:

```text
Пока нет объявлений.
Новые сообщения организации появятся здесь.
```

Team applications:

```text
Заявок в команду пока нет.
```

Audit logs:

```text
Записей в журнале пока нет.
```

Attendance:

```text
Выберите проект, чтобы отметить посещаемость.
```

Eligible certificates:

```text
Нет участников, которым можно загрузить сертификат.
Сначала отметьте посещаемость проекта.
```

---

## 19. Form Design Rules

Forms should be clear and not overloaded.

Each form should include:

- title
- short explanation
- grouped fields
- required field marks
- clear submit button
- validation messages
- loading state
- success/error feedback

Required fields should use `*`.

Helper text:

```text
Поля, отмеченные *, обязательны для заполнения.
```

### Profile Form Labels

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

### Project Form Labels

```text
Название проекта
Описание проекта
Категория
Тип заявки
Локация
Место встречи
Дата и время начала
Дата и время окончания
Дедлайн подачи заявки
Необходимое количество волонтёров
Ответственный
Ответственный за логистику
Ответственный за PR/SMM
Вопросы анкеты
```

### Team Application Form Labels

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

### Certificate Form Labels

```text
Название сертификата
Проект
Волонтёр
Файл сертификата
Тип сертификата
Дата выдачи
Комментарий
```

---

## 20. Page Titles

Public:

```text
Главная
О нас
Проекты
Стать волонтёром
Заявка в команду
Контакты
Вход
Регистрация
```

Volunteer app:

```text
Личный кабинет
Объявления
Проекты
Мои заявки
Мои достижения
Сертификаты
Профиль
```

Admin:

```text
Волонтёры
Заявки в команду
Заявки на проекты
Проекты
Проекты на модерации
Посещаемость
Сертификаты
Роли и доступ
Статистика
Документы
Партнёры
Настройки
Журнал действий
```

---

## 21. Dashboard Rules

Volunteer dashboard blocks:

- welcome message
- quote of the day
- profile completion
- my applications
- approved upcoming projects
- latest announcements
- latest certificates
- latest achievements

Admin dashboard possible blocks:

- pending project applications
- projects on moderation
- pending team applications
- attendance not marked
- certificates waiting upload
- recent audit events
- basic statistics

Do not build advanced analytics in MVP unless needed.

---

## 22. Quote of the Day UI

Dashboard block title:

```text
Цитата дня
```

Seed quotes:

```text
Большие изменения начинаются с маленького доброго действия.
Волонтёрство — это не свободное время, а свободный выбор.
Сильная команда строится не на словах, а на ответственности.
```

The quote block should be calm and not too large.

---

## 23. Access Denied UI

Title:

```text
Нет доступа
```

Body:

```text
У вас нет доступа к этой странице.
Если вы считаете, что это ошибка, обратитесь к администратору платформы.
```

Button:

```text
Вернуться в личный кабинет
```

---

## 24. Protected Role Warning UI

```text
Эта роль защищена и не может быть изменена через обычную панель.
```

Optional explanation:

```text
Изменение Founder/CEO или CTO требует защищённого системного процесса.
```

---

## 25. Application State UI

Pending:

```text
Ваша заявка находится на рассмотрении.
```

Approved:

```text
Вы одобрены для участия в этом проекте.
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

Already applied:

```text
Вы уже подали заявку на этот проект.
```

---

## 26. Validation Rules

All validation messages must be Russian.

Examples:

```text
Введите имя.
Введите фамилию.
Введите корректный email.
Введите номер телефона.
Введите пароль.
Пароль должен содержать минимум 8 символов.
Заполните обязательные поля.
Ответьте на обязательный вопрос.
Выберите категорию проекта.
Выберите тип заявки.
Укажите дату начала проекта.
Укажите дедлайн подачи заявки.
Загрузите CV-файл.
Загрузите файл сертификата.
```

---

## 27. Loading States

Use Russian loading text:

```text
Загрузка...
Сохранение...
Отправка...
Загрузка файла...
Публикация...
Обработка...
```

Buttons during loading:

```text
Сохраняем...
Отправляем...
Загружаем...
Публикуем...
```

---

## 28. Date and Time Format

Use Russian-friendly date display.

Good:

```text
12 мая 2026
12 мая 2026, 18:00
```

Avoid raw ISO strings.

---

## 29. Mobile UI Rules

The platform should be usable on mobile.

Required behavior:

- sidebar collapses into menu
- tables become cards or horizontally scrollable
- buttons remain easy to tap
- forms use full-width fields
- project cards stay readable
- dashboard widgets stack vertically

---

## 30. Accessibility Rules

Minimum requirements:

- readable contrast
- visible focus states
- buttons must have text labels
- forms must have labels
- error messages must be near fields
- avoid text over complex backgrounds
- do not rely only on color to communicate status

Status badges should include text, not only color.

---

## 31. Icon and Animation Rules

Icons are allowed but should be secondary.

Use icons for:

- navigation
- status support
- project cards
- certificate/download
- profile
- announcements

Do not use icons as the only meaning.

Animation should be minimal:

- subtle hover
- small transition
- loading spinner
- modal open/close

Avoid excessive motion, playful bouncing, and distracting animations.

---

## 32. Public Website Trust Cues

The public website should communicate trust through:

- clear mission
- structured process
- impact numbers
- project categories
- leadership/structure explanation
- certificates and verified history
- contact/social links

Avoid fake numbers.

If real data is unavailable:

```text
Показатели вклада будут обновляться по мере проведения проектов.
```

Impact numbers should use real platform data:

```text
Количество волонтёров
Завершённые проекты
Выданные сертификаты
Волонтёрские часы
```

If data is unavailable:

```text
Скоро здесь появится статистика нашей работы.
```

---

## 33. Russian Constants Requirement

Create central Russian constants file:

```text
src/lib/constants/ru.ts
```

It should contain:

- role labels
- status labels
- category labels
- button labels
- common messages
- empty states
- validation messages

Recommended structure:

```text
RU = {
  roles: {},
  projectStatuses: {},
  applicationStatuses: {},
  teamApplicationStatuses: {},
  attendanceStatuses: {},
  certificateStatuses: {},
  projectCategories: {},
  buttons: {},
  messages: {},
  emptyStates: {},
  validation: {}
}
```

---

## 34. Anti-Patterns

Avoid these mistakes:

1. English UI text.
2. One user = one role assumption.
3. Showing inaccessible pages in sidebar.
4. Orange overuse.
5. Fake impact statistics.
6. Certificates without attendance.
7. Achievements without verified action.
8. Admin pages without empty states.
9. Permission logic only in frontend.
10. Vague dashboard sections.
11. Too many features on first screen.
12. Random inconsistent status labels.

---

## 35. MVP UI Priorities

Focus first on:

1. clean public landing
2. Russian auth pages
3. readable app shell
4. permission-based sidebar
5. volunteer dashboard
6. project cards
7. project application flow
8. admin tables
9. attendance table
10. certificate upload form
11. profile form
12. clear empty states

Do not spend too much time on:

- advanced animations
- complex illustrations
- gamified badges
- advanced analytics visuals
- public certificate verification design
- mobile app design

---

## 36. Acceptance Criteria

UI and language implementation is correct when:

1. All visible UI text is Russian.
2. No English default labels remain in buttons, forms, empty states, or errors.
3. Technical names remain English only inside code/database.
4. Sidebar shows only accessible pages.
5. Public pages look professional and trustworthy.
6. Volunteer dashboard is simple and personal.
7. Admin pages are operational and organized.
8. Orange is used mainly for actions and important states.
9. Status labels are consistent across the app.
10. Empty states exist for all major lists.
11. Validation messages are Russian.
12. Loading states are Russian.
13. Certificate and achievement pages explain empty state clearly.
14. Protected role warning is clear.
15. Access denied page is in Russian.
16. Date/time formatting is readable for Russian-speaking users.
17. Mobile layout remains usable.
18. Public impact numbers are not fake.
19. Central Russian label constants are used.
20. UI supports future expansion without redesigning the entire system.

---

## 37. Implementation Notes for Codex

Recommended files:

```text
src/lib/constants/ru.ts
src/lib/constants/colors.ts
src/components/ui/status-badge.tsx
src/components/ui/empty-state.tsx
src/components/ui/page-header.tsx
src/components/ui/action-card.tsx
src/components/layout/public-header.tsx
src/components/layout/public-footer.tsx
src/components/layout/app-shell.tsx
src/components/layout/sidebar.tsx
src/app/(app)/access-denied/page.tsx
```

Recommended Tailwind theme colors:

```text
oxford: #0B0829
orange: #FF8400
amande: #F9DEC6
vista: #8FA0D8
```
