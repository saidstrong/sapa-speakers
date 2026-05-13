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

Phase 1B: Supabase Auth foundation, profiles/volunteers schema, and protected route shells.

This phase includes:

- Supabase client/server helpers
- runtime environment validation
- public `volunteer_applications` intake from Phase 1A
- Supabase Auth login/register/logout
- automatic `profiles` creation after auth signup
- `volunteers` table for future approved volunteers
- server-side protection for `/app/*` and `/admin/*`
- public `/join` application form
- server-side Zod validation
- anonymous insert into Supabase through RLS

Application approval, role assignment UI, project applications, attendance, certificates, achievements, storage, and audit logs are intentionally not implemented yet.

## Supabase Migration

Apply the migration manually in Supabase SQL Editor, or through the Supabase CLI if the project is linked:

```bash
supabase db push
```

Migration file:

```text
supabase/migrations/0001_volunteer_applications.sql
supabase/migrations/0002_profiles_volunteers.sql
```

The migrations create `public.volunteer_applications`, `public.profiles`, and `public.volunteers`, enable RLS, and keep anonymous users away from private profile/volunteer data.

## Auth Setup Notes

In Supabase Auth settings, set the local site URL to:

```text
http://localhost:3000
```

New auth users get a `public.profiles` row from the database trigger in `0002_profiles_volunteers.sql`. The default role is `volunteer`. A `public.volunteers` row is not created automatically yet; it will be created later after an application approval workflow exists.

To promote the first admin manually in Supabase SQL Editor:

```sql
update public.profiles
set role = 'founder_ceo'
where email = 'your-founder-email@example.com';
```

Use your own founder email placeholder value; do not commit real personal emails.

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
