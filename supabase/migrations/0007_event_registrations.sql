create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  volunteer_id uuid not null references public.volunteers(id) on delete cascade,
  status text not null default 'registered',
  registered_at timestamptz not null default now(),
  cancelled_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_registrations_unique_event_volunteer
    unique (event_id, volunteer_id),
  constraint event_registrations_status_check
    check (status in ('registered', 'cancelled')),
  constraint event_registrations_cancelled_at_check
    check (
      (status = 'registered' and cancelled_at is null)
      or (status = 'cancelled' and cancelled_at is not null)
    )
);

create index if not exists event_registrations_event_id_idx
  on public.event_registrations (event_id);

create index if not exists event_registrations_volunteer_id_idx
  on public.event_registrations (volunteer_id);

create index if not exists event_registrations_status_idx
  on public.event_registrations (status);

drop trigger if exists set_event_registrations_updated_at on public.event_registrations;
create trigger set_event_registrations_updated_at
  before update on public.event_registrations
  for each row
  execute function public.set_updated_at();

create or replace function public.current_user_active_volunteer_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select v.id
  from public.volunteers as v
  where v.profile_id = (select auth.uid())
    and v.status = 'active'
  limit 1;
$$;

create or replace function public.is_published_event(event_id_input uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.events as e
    where e.id = event_id_input
      and e.status = 'published'
  );
$$;

create or replace function public.event_registered_count(event_id_input uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select case
    when (select public.current_user_is_admin())
      or (select public.is_published_event(event_id_input))
    then (
      select count(*)::integer
      from public.event_registrations as er
      where er.event_id = event_id_input
        and er.status = 'registered'
    )
    else 0
  end;
$$;

create or replace function public.enforce_event_registration_update_scope()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if (select public.current_user_is_admin()) then
    return new;
  end if;

  if new.event_id is distinct from old.event_id
    or new.volunteer_id is distinct from old.volunteer_id
    or new.registered_at is distinct from old.registered_at
    or new.notes is distinct from old.notes
    or new.created_at is distinct from old.created_at then
    raise exception 'Only registration status can be changed by the volunteer.';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_event_registration_update_scope on public.event_registrations;
create trigger enforce_event_registration_update_scope
  before update on public.event_registrations
  for each row
  execute function public.enforce_event_registration_update_scope();

alter table public.event_registrations enable row level security;

revoke all on table public.event_registrations from anon;
revoke all on table public.event_registrations from authenticated;

grant select, insert, update on table public.event_registrations to authenticated;
revoke delete on table public.event_registrations from authenticated;

revoke all on function public.current_user_active_volunteer_id() from public;
revoke all on function public.is_published_event(uuid) from public;
revoke all on function public.event_registered_count(uuid) from public;
revoke all on function public.enforce_event_registration_update_scope() from public;

grant execute on function public.current_user_active_volunteer_id() to authenticated;
grant execute on function public.is_published_event(uuid) to authenticated;
grant execute on function public.event_registered_count(uuid) to authenticated;

drop policy if exists "Admin roles can select event registrations" on public.event_registrations;
create policy "Admin roles can select event registrations"
  on public.event_registrations
  for select
  to authenticated
  using ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can update event registrations" on public.event_registrations;
create policy "Admin roles can update event registrations"
  on public.event_registrations
  for update
  to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

drop policy if exists "Active volunteers can select own event registrations" on public.event_registrations;
create policy "Active volunteers can select own event registrations"
  on public.event_registrations
  for select
  to authenticated
  using (volunteer_id = (select public.current_user_active_volunteer_id()));

drop policy if exists "Active volunteers can insert own published event registrations" on public.event_registrations;
create policy "Active volunteers can insert own published event registrations"
  on public.event_registrations
  for insert
  to authenticated
  with check (
    volunteer_id = (select public.current_user_active_volunteer_id())
    and (select public.is_published_event(event_id))
    and status = 'registered'
    and cancelled_at is null
  );

drop policy if exists "Active volunteers can update own event registrations" on public.event_registrations;
create policy "Active volunteers can update own event registrations"
  on public.event_registrations
  for update
  to authenticated
  using (volunteer_id = (select public.current_user_active_volunteer_id()))
  with check (
    volunteer_id = (select public.current_user_active_volunteer_id())
    and (select public.is_published_event(event_id))
    and status in ('registered', 'cancelled')
  );

comment on table public.event_registrations is
  'Volunteer registrations for published SapaSpeakers events/projects. Phase 3C does not include attendance, hours, certificates, waitlists, or moderation.';

comment on function public.current_user_active_volunteer_id() is
  'Security definer helper used by event registration RLS to resolve the current authenticated user active volunteer record.';

comment on function public.is_published_event(uuid) is
  'Security definer helper used by event registration RLS to check whether an event is published.';

comment on function public.event_registered_count(uuid) is
  'Security definer helper used by app pages and server actions to count active registrations without exposing registration rows.';

comment on function public.enforce_event_registration_update_scope() is
  'Prevents non-admin users from changing event registration fields beyond registration status/cancellation metadata.';
