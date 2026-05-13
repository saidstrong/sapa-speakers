create extension if not exists pgcrypto;

create table if not exists public.volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  telegram text,
  city text,
  age integer,
  languages text[] not null default '{}',
  interests text[] not null default '{}',
  experience text,
  motivation text not null,
  availability text,
  status text not null default 'pending',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_notes text,
  constraint volunteer_applications_full_name_length
    check (char_length(trim(full_name)) between 2 and 160),
  constraint volunteer_applications_email_length
    check (char_length(trim(email)) between 3 and 254),
  constraint volunteer_applications_email_basic
    check (position('@' in email) > 1),
  constraint volunteer_applications_phone_length
    check (phone is null or char_length(trim(phone)) <= 40),
  constraint volunteer_applications_telegram_length
    check (telegram is null or char_length(trim(telegram)) <= 64),
  constraint volunteer_applications_city_length
    check (city is null or char_length(trim(city)) <= 100),
  constraint volunteer_applications_age_reasonable
    check (age is null or age between 12 and 100),
  constraint volunteer_applications_motivation_length
    check (char_length(trim(motivation)) between 10 and 3000),
  constraint volunteer_applications_status_check
    check (status in ('pending', 'approved', 'declined'))
);

create index if not exists volunteer_applications_status_idx
  on public.volunteer_applications (status);

create index if not exists volunteer_applications_submitted_at_idx
  on public.volunteer_applications (submitted_at desc);

create index if not exists volunteer_applications_email_lower_idx
  on public.volunteer_applications (lower(email));

alter table public.volunteer_applications enable row level security;

revoke all on table public.volunteer_applications from anon;
revoke all on table public.volunteer_applications from authenticated;

grant insert on table public.volunteer_applications to anon;

create policy "Anonymous users can submit volunteer applications"
  on public.volunteer_applications
  for insert
  to anon
  with check (
    status = 'pending'
    and reviewed_at is null
    and reviewer_notes is null
  );

comment on table public.volunteer_applications is
  'Public intake applications from potential SapaSpeakers volunteers. Admin review policies will be added later after auth and roles exist.';

comment on policy "Anonymous users can submit volunteer applications"
  on public.volunteer_applications is
  'Allows public form submissions only. Anonymous select, update, and delete are intentionally not allowed.';
