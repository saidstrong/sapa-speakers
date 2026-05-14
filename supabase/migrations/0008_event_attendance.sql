create table if not exists public.event_attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  volunteer_id uuid not null references public.volunteers(id) on delete cascade,
  registration_id uuid references public.event_registrations(id) on delete set null,
  status text not null default 'attended',
  marked_by uuid references public.profiles(id) on delete set null,
  marked_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_attendance_unique_event_volunteer
    unique (event_id, volunteer_id),
  constraint event_attendance_status_check
    check (status in ('attended', 'absent', 'excused'))
);

create index if not exists event_attendance_event_id_idx
  on public.event_attendance (event_id);

create index if not exists event_attendance_volunteer_id_idx
  on public.event_attendance (volunteer_id);

create index if not exists event_attendance_status_idx
  on public.event_attendance (status);

create index if not exists event_attendance_marked_by_idx
  on public.event_attendance (marked_by);

drop trigger if exists set_event_attendance_updated_at on public.event_attendance;
create trigger set_event_attendance_updated_at
  before update on public.event_attendance
  for each row
  execute function public.set_updated_at();

alter table public.event_attendance enable row level security;

revoke all on table public.event_attendance from anon;
revoke all on table public.event_attendance from authenticated;

grant select, insert, update on table public.event_attendance to authenticated;
revoke delete on table public.event_attendance from authenticated;

drop policy if exists "Admin roles can select event attendance" on public.event_attendance;
create policy "Admin roles can select event attendance"
  on public.event_attendance
  for select
  to authenticated
  using ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can insert event attendance" on public.event_attendance;
create policy "Admin roles can insert event attendance"
  on public.event_attendance
  for insert
  to authenticated
  with check ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can update event attendance" on public.event_attendance;
create policy "Admin roles can update event attendance"
  on public.event_attendance
  for update
  to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

drop policy if exists "Active volunteers can select own event attendance" on public.event_attendance;
create policy "Active volunteers can select own event attendance"
  on public.event_attendance
  for select
  to authenticated
  using (volunteer_id = (select public.current_user_active_volunteer_id()));

comment on table public.event_attendance is
  'Attendance marks for registered SapaSpeakers event/project participants. Phase 4A does not include hours, certificates, achievements, QR check-in, or analytics.';
