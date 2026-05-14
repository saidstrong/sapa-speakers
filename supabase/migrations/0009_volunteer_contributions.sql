create table if not exists public.volunteer_contributions (
  id uuid primary key default gen_random_uuid(),
  volunteer_id uuid not null references public.volunteers(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  attendance_id uuid references public.event_attendance(id) on delete set null,
  hours numeric(5,2) not null,
  contribution_type text not null default 'event_attendance',
  description text,
  awarded_by uuid references public.profiles(id) on delete set null,
  awarded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint volunteer_contributions_hours_positive_check
    check (hours > 0),
  constraint volunteer_contributions_hours_max_check
    check (hours <= 24),
  constraint volunteer_contributions_type_check
    check (contribution_type in ('event_attendance', 'manual_adjustment'))
);

create unique index if not exists volunteer_contributions_event_attendance_unique_idx
  on public.volunteer_contributions (attendance_id)
  where contribution_type = 'event_attendance'
    and attendance_id is not null;

create index if not exists volunteer_contributions_volunteer_id_idx
  on public.volunteer_contributions (volunteer_id);

create index if not exists volunteer_contributions_event_id_idx
  on public.volunteer_contributions (event_id);

create index if not exists volunteer_contributions_attendance_id_idx
  on public.volunteer_contributions (attendance_id);

create index if not exists volunteer_contributions_awarded_at_idx
  on public.volunteer_contributions (awarded_at desc);

drop trigger if exists set_volunteer_contributions_updated_at on public.volunteer_contributions;
create trigger set_volunteer_contributions_updated_at
  before update on public.volunteer_contributions
  for each row
  execute function public.set_updated_at();

alter table public.volunteer_contributions enable row level security;

revoke all on table public.volunteer_contributions from anon;
revoke all on table public.volunteer_contributions from authenticated;

grant select, insert, update on table public.volunteer_contributions to authenticated;
revoke delete on table public.volunteer_contributions from authenticated;

drop policy if exists "Admin roles can select volunteer contributions" on public.volunteer_contributions;
create policy "Admin roles can select volunteer contributions"
  on public.volunteer_contributions
  for select
  to authenticated
  using ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can insert volunteer contributions" on public.volunteer_contributions;
create policy "Admin roles can insert volunteer contributions"
  on public.volunteer_contributions
  for insert
  to authenticated
  with check ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can update volunteer contributions" on public.volunteer_contributions;
create policy "Admin roles can update volunteer contributions"
  on public.volunteer_contributions
  for update
  to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

drop policy if exists "Active volunteers can select own volunteer contributions" on public.volunteer_contributions;
create policy "Active volunteers can select own volunteer contributions"
  on public.volunteer_contributions
  for select
  to authenticated
  using (volunteer_id = (select public.current_user_active_volunteer_id()));

comment on table public.volunteer_contributions is
  'Confirmed volunteer contribution hour records. Phase 5A does not include certificates, achievements, rankings, rewards, or analytics.';
