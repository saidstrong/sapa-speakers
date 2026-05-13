create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'draft',
  capacity integer,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_title_non_empty
    check (char_length(trim(title)) between 1 and 160),
  constraint events_status_check
    check (status in ('draft', 'published', 'completed', 'cancelled')),
  constraint events_capacity_check
    check (capacity is null or capacity > 0),
  constraint events_ends_after_start_check
    check (ends_at is null or ends_at >= starts_at)
);

create index if not exists events_status_idx
  on public.events (status);

create index if not exists events_starts_at_idx
  on public.events (starts_at desc);

create index if not exists events_created_by_idx
  on public.events (created_by);

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
  before update on public.events
  for each row
  execute function public.set_updated_at();

alter table public.events enable row level security;

revoke all on table public.events from anon;
revoke all on table public.events from authenticated;

grant select on table public.events to authenticated;
grant insert (
  title,
  description,
  location,
  starts_at,
  ends_at,
  status,
  capacity,
  created_by
) on table public.events to authenticated;
grant update (
  title,
  description,
  location,
  starts_at,
  ends_at,
  status,
  capacity,
  updated_at
) on table public.events to authenticated;

drop policy if exists "Admin roles can select events" on public.events;
create policy "Admin roles can select events"
  on public.events
  for select
  to authenticated
  using ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can insert events" on public.events;
create policy "Admin roles can insert events"
  on public.events
  for insert
  to authenticated
  with check ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can update events" on public.events;
create policy "Admin roles can update events"
  on public.events
  for update
  to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

comment on table public.events is
  'Internal SapaSpeakers events/projects managed by admin-capable roles. Phase 3A does not include public event pages, RSVP, attendance, or volunteer registration.';

comment on policy "Admin roles can select events"
  on public.events is
  'Allows authenticated admin-capable roles to view internal events/projects.';

comment on policy "Admin roles can insert events"
  on public.events is
  'Allows authenticated admin-capable roles to create internal events/projects.';

comment on policy "Admin roles can update events"
  on public.events is
  'Allows authenticated admin-capable roles to update internal event/project fields. Delete is intentionally not granted in Phase 3A.';
