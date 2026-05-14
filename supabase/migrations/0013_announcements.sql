create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  status text not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint announcements_title_check
    check (char_length(trim(title)) between 1 and 180),
  constraint announcements_body_check
    check (char_length(trim(body)) > 0),
  constraint announcements_status_check
    check (status in ('draft', 'published', 'archived'))
);

create index if not exists announcements_status_idx
  on public.announcements (status);

create index if not exists announcements_published_at_idx
  on public.announcements (published_at);

create index if not exists announcements_created_by_idx
  on public.announcements (created_by);

drop trigger if exists set_announcements_updated_at on public.announcements;
create trigger set_announcements_updated_at
  before update on public.announcements
  for each row
  execute function public.set_updated_at();

alter table public.announcements enable row level security;

revoke all on table public.announcements from anon;
revoke all on table public.announcements from authenticated;

grant select, insert, update on table public.announcements to authenticated;

drop policy if exists "Admin roles can select announcements" on public.announcements;
create policy "Admin roles can select announcements"
  on public.announcements
  for select
  to authenticated
  using ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can insert announcements" on public.announcements;
create policy "Admin roles can insert announcements"
  on public.announcements
  for insert
  to authenticated
  with check ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can update announcements" on public.announcements;
create policy "Admin roles can update announcements"
  on public.announcements
  for update
  to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

drop policy if exists "Authenticated users can select published announcements" on public.announcements;
create policy "Authenticated users can select published announcements"
  on public.announcements
  for select
  to authenticated
  using (status = 'published');

comment on table public.announcements is
  'Internal announcements for authenticated SapaSpeakers users. Phase 9B does not include notifications, comments, reactions, targeting, attachments, or read receipts.';
