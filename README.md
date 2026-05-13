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

Phase 1A: Supabase foundation and public volunteer application intake.

This phase includes:

- Supabase client/server helpers
- runtime environment validation
- first migration for `volunteer_applications`
- public `/join` application form
- server-side Zod validation
- anonymous insert into Supabase through RLS

Real login/register behavior, profiles, roles, admin review, project applications, attendance, certificates, achievements, storage, and audit logs are intentionally not implemented yet.

## Supabase Migration

Apply the migration manually in Supabase SQL Editor, or through the Supabase CLI if the project is linked:

```bash
supabase db push
```

Migration file:

```text
supabase/migrations/0001_volunteer_applications.sql
```

The migration creates `public.volunteer_applications`, enables RLS, allows anonymous inserts, and intentionally does not allow anonymous select/update/delete. Admin review policies will be added after auth and roles exist.

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
