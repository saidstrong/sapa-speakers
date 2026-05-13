# SapaSpeakers Volunteer Platform — Certificate & Achievement Logic

## 1. Purpose

This document defines how certificates, attendance-based eligibility, achievements, contribution history, and volunteer records should work in the SapaSpeakers Volunteer Platform.

The goal is to make every real volunteer contribution visible, verified, and stored in the volunteer’s личный кабинет.

Core principle:

```text
No attendance → no certificate.
No verified action → no achievement.
```

Certificates and achievements must be connected to real project participation.

The system should prevent fake or accidental certificate issuing.

---

## 2. Core Concept

A volunteer’s contribution history should be built from real operational events:

```text
Volunteer applies
→ application is approved
→ volunteer attends project
→ attendance is marked
→ certificate is uploaded
→ achievement is awarded
→ contribution appears in личный кабинет
```

Every important contribution should have:

- project connection
- responsible manager
- timestamp
- certificate or achievement record
- audit log

---

## 3. Difference Between Certificates and Achievements

### Certificate

A certificate is a formal file uploaded to the volunteer’s profile, usually a PDF/image document.

Used for:

- proving participation
- official recognition
- student portfolio
- external use
- volunteer history

Stored in `certificates`.

### Achievement

An achievement is a structured recognition record. It may or may not have a certificate file.

Used for:

- contribution history
- dashboard display
- internal reliability
- volunteer motivation
- categorizing activity
- future badges/statistics

Stored in `achievements`.

---

## 4. Certificate Eligibility Rule

A certificate can be uploaded only if both conditions are true:

```text
project_applications.status = approved
AND attendance.status = present
```

Meaning:

1. The volunteer was officially approved for the project.
2. The volunteer actually attended the project.

This rule must be enforced server-side. Frontend button disabling is not enough.

---

## 5. Certificate Flow

Standard flow:

```text
Project is completed
→ responsible manager opens approved participant list
→ manager marks attendance
→ system checks eligible participants
→ manager uploads certificate files
→ certificates appear in volunteer личный кабинет
→ achievement is created or confirmed
→ audit log is created
```

Detailed flow:

1. Project has approved participants.
2. Project happens in real life.
3. Responsible manager opens attendance page.
4. Manager marks each approved participant: present, absent, late, excused.
5. System saves attendance.
6. For participants marked `present`, certificate upload becomes available.
7. Manager uploads certificate file.
8. Certificate status becomes `uploaded`.
9. Certificate appears in volunteer cabinet.
10. Optional confirmation can change status to `confirmed`.
11. Achievement is awarded automatically or manually.
12. Audit log records the upload.

---

## 6. Attendance Statuses

| Internal Value | Russian UI | Certificate Eligible |
|---|---|---:|
| `present` | Присутствовал | Yes |
| `absent` | Не пришёл | No |
| `late` | Опоздал | Optional later |
| `excused` | По уважительной причине | No by default |

MVP strict rule:

```text
Only present = certificate eligible.
```

Later option:

```text
late + manager override = certificate eligible
```

Do not implement override in MVP unless explicitly requested.

---

## 7. Certificate Statuses

| Internal Value | Russian UI | Meaning |
|---|---|---|
| `uploaded` | Загружен | Certificate file was uploaded |
| `confirmed` | Подтверждён | Certificate was checked/approved |
| `rejected` | Отклонён | Certificate was rejected/invalid |

MVP behavior:

- upload certificate → status = `uploaded`
- uploaded certificates are visible to volunteers
- confirmation can be implemented if not heavy

---

## 8. Certificate Database Fields

Table: `certificates`.

Required fields:

```text
id
user_id
project_id
title
file_url
file_name
certificate_type
uploaded_by
issued_at
status
comment
created_at
updated_at
```

Certificate types:

| Internal Value | Russian UI |
|---|---|
| `participation` | Участие |
| `training` | Обучение |
| `mun` | MUN |
| `eco` | Экологический проект |
| `language_support` | Лингвистическое сопровождение |
| `event_support` | Помощь на мероприятии |
| `other` | Другое |

---

## 9. Who Can Upload Certificates

Can upload certificates broadly:

- Founder/CEO
- CTO
- Операционный менеджер

Can upload certificates only for own/assigned projects:

- Тимлид волонтёров
- Менеджер по обучению
- Координатор лингвистического сопровождения
- Эко-координатор
- Координатор MUN

Cannot upload certificates by default:

- Волонтёр
- HR-менеджер
- Logistics Manager
- PR/SMM-менеджер
- Partnership Manager
- Секретарь

Exception: another role may grant certificate permission.

---

## 10. Certificate Upload Permission Rule

Certificate upload is allowed only if:

```text
actor has upload_certificates permission
AND actor can manage the project
AND target volunteer has approved application
AND target volunteer attendance is present
```

For CEO/CTO/Ops:

```text
actor has broad upload permission
AND target volunteer has approved application
AND target volunteer attendance is present
```

For project managers/coordinators:

```text
actor is responsible for project or assigned manager
AND target volunteer has approved application
AND target volunteer attendance is present
```

---

## 11. Server-Side Certificate Validation

Before certificate upload, server action must check:

1. Is actor authenticated?
2. Does actor have certificate upload permission?
3. Does project exist?
4. Does target volunteer exist?
5. Does approved application exist?
6. Is attendance marked as `present`?
7. Is file valid?
8. Is file type allowed?
9. Is file size acceptable?
10. Create certificate record.
11. Create audit log.

Russian errors:

```text
Сертификат можно загрузить только для одобренного участника проекта.
Сертификат можно загрузить только для участника, который присутствовал на проекте.
У вас нет прав для загрузки сертификатов.
Загрузите файл сертификата.
Недопустимый формат файла.
Файл слишком большой.
Сертификат загружен.
```

---

## 12. Certificate Storage

Recommended Supabase Storage bucket: `certificates`.

Preferred file path pattern:

```text
certificates/{project_id}/{user_id}/{certificate_id}-{filename}
```

Reason:

- easy to group by project
- easy to find volunteer certificate inside project
- supports multiple certificates per user/project if needed

Allowed file types for MVP:

```text
application/pdf
image/png
image/jpeg
```

Recommended max size: 10 MB.

Russian helper text:

```text
Загрузите PDF, PNG или JPG файл до 10 МБ.
```

---

## 13. Volunteer Certificate Page

Route: `/app/certificates`.

Page title: `Сертификаты`.

Volunteer should see:

- certificate title
- project name
- issue date
- status
- download button

Button:

```text
Скачать сертификат
```

Empty state:

```text
У вас пока нет сертификатов.
Сертификаты появятся здесь после участия в проектах.
```

---

## 14. Admin Certificate Page

Route: `/admin/certificates`.

Purpose: allow authorized managers to upload and manage certificates.

Admin page should support:

- select project
- view eligible participants
- upload certificate
- view uploaded certificates
- confirm/reject certificates if implemented
- filter by project/status

Eligible participants are those with approved application and present attendance.

Empty state:

```text
Нет участников, которым можно загрузить сертификат.
Сначала отметьте посещаемость проекта.
```

---

## 15. Duplicate Certificate Rule

Recommended MVP unique constraint:

```text
unique(user_id, project_id, certificate_type)
```

Reason: allows later training/participation certificate split.

---

## 16. Achievement Logic

Achievements represent verified contribution milestones.

They can be created:

1. automatically
2. manually
3. from attendance
4. from certificate

Achievement sources:

| Internal Value | Russian UI |
|---|---|
| `automatic` | Автоматически |
| `manual` | Вручную |
| `certificate_based` | На основе сертификата |
| `attendance_based` | На основе посещаемости |

Achievement fields:

```text
id
user_id
project_id
title
description
type
source
awarded_by
awarded_at
created_at
```

Achievement types:

| Internal Value | Russian UI |
|---|---|
| `project_participation` | Участник проекта |
| `eco_participation` | Участник экологического проекта |
| `mun_participation` | Участник MUN-проекта |
| `training_completed` | Прошёл обучение |
| `exhibition_support` | Помог на выставке |
| `hours_milestone` | Волонтёрские часы |
| `diplomatic_participation` | Участник дипломатического проекта |
| `cultural_participation` | Участник культурного проекта |
| `sports_participation` | Участник спортивного проекта |
| `language_support` | Лингвистическое сопровождение |
| `manual_recognition` | Особое признание |

---

## 17. Automatic Achievement Rules

When attendance is marked `present`, system may create category-specific achievement:

| Project Category | Achievement |
|---|---|
| `ecological` | Участник экологического проекта |
| `mun` | Участник MUN-проекта |
| `training` | Прошёл обучение |
| `exhibition` | Помог на выставке |
| `diplomatic` | Участник дипломатического проекта |
| `cultural` | Участник культурного проекта |
| `sports` | Участник спортивного проекта |
| `educational` | Участник образовательного проекта |

Preferred MVP behavior:

```text
Create one category-specific achievement when possible.
Fallback to “Участник проекта”.
```

Certificate upload may create/confirm a certificate-based achievement, but should not duplicate an existing attendance achievement.

Recommended duplicate prevention:

```text
unique(user_id, project_id, type)
```

Hours-based achievements can be postponed.

---

## 18. Manual Achievements

Authorized managers can manually award achievements for special contribution.

Can manually award:

- Founder/CEO
- CTO
- Operations Manager

Optional project-scoped manual award:

- responsible project managers for own projects

Manual award requires comment/description.

Russian validation:

```text
Укажите описание достижения.
```

---

## 19. Achievement Visibility

Volunteer can see own achievements on `/app/achievements`.

Dashboard can show latest achievements on `/app`.

Recommended MVP: do not create a separate admin achievements page unless needed. Show achievements in volunteer profile/admin volunteer detail or manage through attendance/certificate flow.

---

## 20. Contribution History and Reliability

Each volunteer should have contribution history based on:

- approved applications
- attendance
- certificates
- achievements

MVP can show:

```text
Количество проектов
Количество сертификатов
Количество достижений
```

Reliability indicators are postponed to v2:

- approved projects count
- attended projects count
- no-show count
- attendance rate
- certificates earned
- repeated participation
- manager notes

---

## 21. Audit Events

Required events:

```text
attendance.marked
certificate.uploaded
certificate.confirmed
certificate.rejected
achievement.awarded
achievement.created_automatically
achievement.removed
```

For MVP minimum:

```text
certificate.uploaded
achievement.awarded
attendance.marked
```

---

## 22. Admin Workflow

Recommended workflow:

```text
/admin/attendance
→ select project
→ mark attendance
→ save
→ system shows eligible certificate participants
→ go to /admin/certificates
→ select project
→ upload certificates
```

Future project detail tabs:

```text
Информация
Заявки
Участники
Посещаемость
Сертификаты
Отчёт
```

---

## 23. Russian UI Copy Map

Certificate labels:

```text
Сертификаты
Сертификат
Название сертификата
Проект
Волонтёр
Файл сертификата
Дата выдачи
Статус
Комментарий
Загрузил
Загрузить сертификат
Скачать сертификат
```

Achievement labels:

```text
Мои достижения
Достижение
Название достижения
Описание
Источник
Дата получения
Проект
```

Attendance labels:

```text
Посещаемость
Присутствовал
Не пришёл
Опоздал
По уважительной причине
Сохранить посещаемость
Посещаемость сохранена
```

---

## 24. Server-Side Business Rules

Mark attendance if:

```text
actor has mark_attendance permission
AND actor can manage the project
AND target user has approved application for project
```

On success: upsert attendance record, optionally create achievement, create audit log.

Upload certificate if:

```text
actor has upload_certificates permission
AND actor can manage the project
AND target user has approved application
AND target user attendance = present
AND file is valid
```

On success: upload file, create certificate record, optionally create/confirm achievement, create audit log.

Award manual achievement if actor has `manage_achievements` permission and, for project-scoped manager, can manage the project.

---

## 25. File Upload Security

Certificate files should not be fully public by default.

Recommended MVP:

- store private files in Supabase Storage
- generate signed download URLs for authorized users

Authorized download users:

- certificate owner
- CEO
- CTO
- Operations Manager
- responsible project manager

Certificate download rule:

```text
certificate.user_id = current_user.id
OR current user has certificate management permission
```

Russian error:

```text
У вас нет доступа к этому сертификату.
```

---

## 26. What To Postpone

Postpone to v2:

- automatic PDF certificate generation
- public certificate verification
- advanced badge system
- public volunteer ranking
- complex reliability scoring
- certificate templates
- QR code verification
- automatic certificate emailing
- mass certificate generation
- manager override for late attendance
- advanced achievement levels

---

## 27. Acceptance Criteria

Certificate and achievement logic is correct when:

1. Attendance can be marked only for approved project participants.
2. Certificate upload is blocked if volunteer was not approved.
3. Certificate upload is blocked if attendance is not `present`.
4. Certificate upload permission is checked server-side.
5. Volunteers can see only their own certificates.
6. Volunteers can download their own certificate files.
7. Managers can upload certificates only for projects they can manage.
8. CEO/CTO/Ops can manage certificates broadly.
9. Certificate upload creates an audit log.
10. Attendance marking creates an audit log.
11. Present attendance creates or allows achievement creation.
12. Achievements appear in volunteer личный кабинет.
13. Duplicate achievements are prevented for the same user/project/type.
14. Duplicate certificates are prevented for the same user/project/type.
15. Certificate and achievement UI labels are fully Russian.
16. Empty states are clear and Russian.
17. Private certificate files are not exposed to unauthorized users.
18. The system can later support public verification without rewriting the whole certificate model.

---

## 28. Implementation Notes for Codex

Recommended files:

```text
src/lib/constants/attendance.ts
src/lib/constants/certificates.ts
src/lib/constants/achievements.ts
src/lib/constants/ru.ts
src/lib/attendance/queries.ts
src/lib/attendance/actions.ts
src/lib/attendance/validation.ts
src/lib/certificates/queries.ts
src/lib/certificates/actions.ts
src/lib/certificates/validation.ts
src/lib/certificates/storage.ts
src/lib/achievements/queries.ts
src/lib/achievements/actions.ts
src/lib/achievements/rules.ts
src/components/attendance/attendance-table.tsx
src/components/certificates/certificate-upload-form.tsx
src/components/certificates/certificate-card.tsx
src/components/achievements/achievement-card.tsx
src/app/(app)/app/certificates/page.tsx
src/app/(app)/app/achievements/page.tsx
src/app/(admin)/admin/attendance/page.tsx
src/app/(admin)/admin/certificates/page.tsx
```
