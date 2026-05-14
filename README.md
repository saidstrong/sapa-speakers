# SapaSpeakers Volunteer Platform

Internal volunteer organization platform for SapaSpeakers.

The product will combine a public volunteer recruitment website, volunteer personal cabinet, role-based management tools, project moderation, attendance, certificates, achievements, team applications, and audit logs.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Supabase Postgres
- Supabase JS client
- Zod validation

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Create `.env.local` from `.env.example` and fill:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Context

Product requirements and implementation guidance live in `project-context/`.

Do not move or rewrite those files without an explicit documentation task.

## Current Phase

Phase 6B: certificate management detail and revoke workflow.

This phase includes:

- Supabase client/server helpers
- runtime environment validation
- public `volunteer_applications` intake from Phase 1A
- Supabase Auth login/register/logout
- automatic `profiles` creation after auth signup
- `volunteers` table for approved applicants with matching profiles
- server-side protection for `/app/*` and `/admin/*`
- public `/join` application form
- server-side Zod validation
- anonymous insert into Supabase through RLS
- admin listing and detail review pages for public volunteer applications
- server-side approve/decline actions for admin-capable roles
- admin volunteer directory for approved/linked volunteer records
- volunteer detail page with profile, operational status, notes, and linked application context
- server-side volunteer status/notes update action for admin-capable roles
- internal `events` table with admin-only RLS
- admin event/project list, create, detail, and edit pages
- server-side event create/update actions for admin-capable roles
- volunteer-facing published event/project list and detail pages
- authenticated read access to published events through RLS
- event registration table for active approved volunteers
- volunteer self-service registration and cancellation for published events
- admin event detail participant list
- volunteer-facing `/app/applications` view of the current user's own project registrations
- attendance table for registered event participants
- admin attendance marking for registered participants with `attended`, `absent`, and `excused` statuses
- central read-only `/admin/attendance` register for marked attendance records
- contribution hour records for confirmed volunteer work
- admin hour awarding/updating from attended attendance records
- volunteer-facing own contribution history on `/app/achievements`
- admin volunteer detail contribution summary and contribution history
- certificate records for volunteers
- admin certificate issuing from volunteer detail pages
- admin and volunteer certificate record views
- admin certificate detail pages
- certificate revocation with a recorded reason
- revoked certificate status visible to volunteers

Role assignment UI, public event pages, certificate PDF generation, certificate storage, QR verification, public certificate verification, achievements, notifications, analytics, rewards, and audit logs are intentionally not implemented yet.

## Supabase Migration

Apply the migration manually in Supabase SQL Editor, or through the Supabase CLI if the project is linked:

```bash
supabase db push
```

Migration file:

```text
supabase/migrations/0001_volunteer_applications.sql
supabase/migrations/0002_profiles_volunteers.sql
supabase/migrations/0003_volunteer_application_review.sql
supabase/migrations/0004_events_foundation.sql
supabase/migrations/0005_fix_events_grants.sql
supabase/migrations/0006_published_events_app_access.sql
supabase/migrations/0007_event_registrations.sql
supabase/migrations/0008_event_attendance.sql
supabase/migrations/0009_volunteer_contributions.sql
supabase/migrations/0010_certificates.sql
```

The migrations create `public.volunteer_applications`, `public.profiles`, `public.volunteers`, `public.events`, `public.event_registrations`, `public.event_attendance`, `public.volunteer_contributions`, and `public.certificates`, enable RLS, keep anonymous users away from private profile/volunteer/event/attendance/contribution/certificate data, allow admin-capable authenticated users to review public volunteer applications, manage internal events, view participants, mark attendance, award contribution hours, and issue certificate records, allow authenticated volunteers to view only published events, and allow active volunteers to manage and view their own event registration, contribution history, and certificate records.

## Auth Setup Notes

In Supabase Auth settings, set the local site URL to:

```text
http://localhost:3000
```

New auth users get a `public.profiles` row from the database trigger in `0002_profiles_volunteers.sql`. The default role is `volunteer`. A `public.volunteers` row is not created at registration time; Phase 2A creates it only when an admin approves a public volunteer application and a matching profile exists.

To promote the first admin manually in Supabase SQL Editor:

```sql
update public.profiles
set role = 'founder_ceo'
where email = 'your-founder-email@example.com';
```

Use your own founder email placeholder value; do not commit real personal emails.

## Reviewing Public Volunteer Applications

Admin-capable users can open:

```text
http://localhost:3000/admin/team-applications
```

The page lists applications submitted through `/join`. A reviewer can open a detail page, approve the application, or decline it. Approval marks the application as `approved`.

If a registered profile already exists with the same email, approval creates or updates one `public.volunteers` row for that profile and links it to the application. If no profile exists yet, the application remains approved, but the volunteer record waits until the applicant registers with the same email.

## Managing Volunteer Records

Admin-capable users can open:

```text
http://localhost:3000/admin/volunteers
```

The page lists existing `public.volunteers` records created through the approved application flow. A reviewer can open a volunteer detail page to see profile contact fields, the profile role label, volunteer status, joined date, notes, and linked public application context.

Phase 2B allows updating only:

- volunteer status: `active`, `inactive`, `suspended`, `alumni`
- volunteer notes

Role management, project assignment, attendance, certificates, achievements, public volunteer profiles, notifications, and audit logs are intentionally not included in this phase.

## Managing Events And Projects

Admin-capable users can open:

```text
http://localhost:3000/admin/events
```

Phase 3A adds the first internal event/project management surface. Admins can create events, view a list, open event details, and edit core fields:

- title
- description
- location
- start and end date/time
- status: `draft`, `published`, `completed`, `cancelled`
- capacity

This phase does not include public event pages, volunteer event registration, RSVP, attendance tracking, project applications, deletion, or analytics.

## Viewing Published Events As A Volunteer

Authenticated volunteers can open:

```text
http://localhost:3000/app/projects
```

The page lists only events with status `published`. Volunteers can open a detail page to view the title, description, location, start/end time, capacity, and status.

The published event list remains a simple browsing surface. Project applications, RSVP-style workflows, attendance, certificates, and notifications are intentionally deferred to later phases.

## Registering For Events

Phase 3C lets active approved volunteers register for published events from:

```text
http://localhost:3000/app/projects/[id]
```

Volunteers can register for a published event, cancel their own registration, and register again if capacity allows. Users without an active volunteer record see a calm approval-pending message instead of a registration button.

Admin-capable users can open an event detail page and see the registered participant list:

```text
http://localhost:3000/admin/events/[id]
```

Attendance, volunteer hours, waitlists, certificates, achievements, reminders, and analytics are intentionally not included in Phase 3C.

## Viewing My Project Registrations

Phase 3D lets authenticated volunteers open:

```text
http://localhost:3000/app/applications
```

The page shows only the current user's own project registrations, including the event title, event status, event date/time, location, registration status, registration time, cancellation time when present, and a link back to the project detail page.

Registration and cancellation still happen on the project detail page:

```text
http://localhost:3000/app/projects/[id]
```

Users without a linked volunteer row see an approval-pending message. Volunteers with no registrations see a simple empty state pointing them back to the projects section. Attendance, volunteer hours, certificates, achievements, reminders, and analytics are intentionally deferred.

## Marking Event Attendance

Phase 4A lets admin-capable users open:

```text
http://localhost:3000/admin/events/[id]
```

The participants section shows active registered participants and lets an admin mark or update attendance with one of three statuses:

- `attended` — был
- `absent` — не был
- `excused` — уважительная причина

Attendance is saved per event and volunteer. The action is server-side, checks that the participant has an active registration for that event, and does not delete attendance records.

Volunteer hours, contribution history, certificates, achievements, QR check-in, public attendance pages, reminders, and analytics are intentionally deferred.

## Viewing The Attendance Register

Phase 4B lets admin-capable users open:

```text
http://localhost:3000/admin/attendance
```

The page is a read-only operational register for already marked attendance across events. It shows the event, event date/time, volunteer, attendance status, marking time, the profile that marked attendance when available, notes, and links back to the event and volunteer detail pages.

Attendance is still marked from event detail pages:

```text
http://localhost:3000/admin/events/[id]
```

The register supports lightweight server-side filtering by attendance status and search by event title, volunteer name, or email. Volunteer hours, contribution history, certificates, achievements, QR check-in, public attendance pages, reminders, and analytics remain deferred.

## Confirming Contribution Hours

Phase 5A lets admin-capable users open:

```text
http://localhost:3000/admin/attendance
```

For attendance rows marked `attended`, admins can award or update confirmed contribution hours. The form saves hours, an optional description, and the admin profile that awarded the record. Hours are derived from an existing attendance record, and the server action verifies that the attendance status is `attended` before saving.

Volunteers can view their own confirmed contribution history at:

```text
http://localhost:3000/app/achievements
```

This page is temporarily used as `Мой вклад`: it shows total confirmed hours and each contribution's event, hours, type, description, and award date. Real achievements, badges, certificates, rankings, rewards, and analytics are intentionally deferred.

## Reviewing Volunteer Contributions

Phase 5B adds contribution context to admin volunteer detail pages:

```text
http://localhost:3000/admin/volunteers/[id]
```

Admins can see total confirmed hours, contribution record count, latest contribution date, and a read-only contribution history for that volunteer. The history includes hours, contribution type, linked event when available, attendance status when linked, description, creation date, and the admin profile that awarded the record when available.

Contribution entry and updates still happen from the attendance register:

```text
http://localhost:3000/admin/attendance
```

Certificates, achievements, badges, public profiles, rankings, and analytics remain deferred.

## Issuing Certificate Records

Phase 6A lets admin-capable users issue simple certificate records from:

```text
http://localhost:3000/admin/volunteers/[id]
```

Admins can enter a title, certificate type, and optional description. The record is stored as `issued` and linked to the volunteer and issuing admin profile. No PDF is generated in this phase.

Admins can view all certificate records at:

```text
http://localhost:3000/admin/certificates
```

Volunteers can view their own certificates at:

```text
http://localhost:3000/app/certificates
```

PDF generation, Supabase Storage, certificate templates/images, QR verification, public verification pages, automated issuing rules, emails, achievements, and analytics are intentionally deferred.

## Managing Certificate Records

Phase 6B adds admin certificate detail pages:

```text
http://localhost:3000/admin/certificates/[id]
```

Admins can inspect certificate metadata, issuing context, linked volunteer details, and revocation state. Issued certificates can be revoked with a required reason. Revocation updates the existing certificate record to `revoked`, stores `revoked_at`, and keeps the record visible instead of deleting it.

Volunteers see revoked certificates clearly in their own certificate list, including revocation date and reason when available.

PDF generation, Supabase Storage, QR verification, public certificate verification pages, templates/images, automated issuing rules, emails, achievements, and analytics are still deferred.

## Phase 2B Manual QA Checklist

1. Submit a test volunteer application through `/join` or use an existing pending application.
2. In a separate account, register the same email if you want approval to create a linked volunteer card immediately.
3. Sign in as an admin-capable user and open `/admin/team-applications`.
4. Approve the application and confirm the result message matches the actual case: either the volunteer card is created or already exists, or the application is approved but the applicant still needs to register with the same email.
5. Open `/admin/volunteers` and confirm the approved volunteer appears in the directory.
6. Open the volunteer detail page and verify profile data, volunteer status, joined date, notes, and linked application context.
7. Change the volunteer status and save; confirm the success message appears and the updated badge/value is visible after reload.
8. Update the volunteer notes and save; confirm the success message appears and the notes persist after reload.
9. Trigger at least one invalid update case if possible, and confirm the error message is shown without exposing internal details.
10. Sign in as a non-admin user and confirm `/admin/volunteers` and `/admin/volunteers/[id]` remain blocked by admin route protection.

## Testing The Public Application Form

1. Apply the migration in Supabase.
2. Fill `.env.local` with Supabase project values.
3. Start the app:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000/join
```

5. Submit the form with ФИО, Email, and motivation. A successful submission redirects back to `/join?status=success`.

## Testing Auth Locally

1. Apply both migrations.
2. Fill `.env.local` from `.env.example`.
3. Run `npm run dev`.
4. Open `/register`, create an account, and confirm email if your Supabase project requires it.
5. Open `/login`, sign in, and confirm `/app` loads.
6. Promote a test account manually with the SQL template above, then confirm `/admin` loads.
