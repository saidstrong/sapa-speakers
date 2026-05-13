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

Phase 2B: admin volunteer directory and volunteer detail surface.

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

Role assignment UI, project applications, attendance, certificates, achievements, storage, notifications, and audit logs are intentionally not implemented yet.

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
```

The migrations create `public.volunteer_applications`, `public.profiles`, and `public.volunteers`, enable RLS, keep anonymous users away from private profile/volunteer data, and allow admin-capable authenticated users to review public volunteer applications.

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
