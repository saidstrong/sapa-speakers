create table if not exists public.role_change_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  target_profile_id uuid references public.profiles(id) on delete set null,
  old_role text not null,
  new_role text not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint role_change_logs_old_role_check
    check (
      old_role in (
        'founder_ceo',
        'cto',
        'operations_manager',
        'hr_manager',
        'volunteer_teamlead',
        'training_manager',
        'language_coordinator',
        'eco_coordinator',
        'logistics_manager',
        'pr_smm_manager',
        'partnership_manager',
        'mun_coordinator',
        'secretary',
        'volunteer'
      )
    ),
  constraint role_change_logs_new_role_check
    check (
      new_role in (
        'founder_ceo',
        'cto',
        'operations_manager',
        'hr_manager',
        'volunteer_teamlead',
        'training_manager',
        'language_coordinator',
        'eco_coordinator',
        'logistics_manager',
        'pr_smm_manager',
        'partnership_manager',
        'mun_coordinator',
        'secretary',
        'volunteer'
      )
    ),
  constraint role_change_logs_reason_length
    check (reason is null or char_length(reason) <= 1000)
);

create index if not exists role_change_logs_created_at_idx
  on public.role_change_logs (created_at desc);

create index if not exists role_change_logs_actor_profile_id_idx
  on public.role_change_logs (actor_profile_id);

create index if not exists role_change_logs_target_profile_id_idx
  on public.role_change_logs (target_profile_id);

alter table public.role_change_logs enable row level security;

revoke all on table public.role_change_logs from anon;
revoke all on table public.role_change_logs from authenticated;
grant select on table public.role_change_logs to authenticated;

drop policy if exists "Role managers can select role change logs" on public.role_change_logs;
create policy "Role managers can select role change logs"
  on public.role_change_logs
  for select
  to authenticated
  using ((select public.current_user_role()) in ('founder_ceo', 'cto'));

create or replace function public.update_profile_role(
  target_profile_id uuid,
  new_role text,
  reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid := (select auth.uid());
  actor_role text;
  target_old_role text;
  requested_role text := $2;
  clean_reason text := nullif(trim(coalesce($3, '')), '');
begin
  if actor_id is null then
    raise exception 'Authentication is required to update roles.';
  end if;

  select p.role
    into actor_role
  from public.profiles as p
  where p.id = actor_id;

  if actor_role not in ('founder_ceo', 'cto') then
    raise exception 'Only Founder/CEO and CTO can update profile roles.';
  end if;

  if actor_id = $1 then
    raise exception 'Users cannot change their own role.';
  end if;

  if requested_role not in (
    'founder_ceo',
    'cto',
    'operations_manager',
    'hr_manager',
    'volunteer_teamlead',
    'training_manager',
    'language_coordinator',
    'eco_coordinator',
    'logistics_manager',
    'pr_smm_manager',
    'partnership_manager',
    'mun_coordinator',
    'secretary',
    'volunteer'
  ) then
    raise exception 'Requested role is not allowed.';
  end if;

  if clean_reason is not null and char_length(clean_reason) > 1000 then
    raise exception 'Role change reason is too long.';
  end if;

  select p.role
    into target_old_role
  from public.profiles as p
  where p.id = $1
  for update;

  if target_old_role is null then
    raise exception 'Target profile was not found.';
  end if;

  if target_old_role = 'founder_ceo' and actor_role <> 'founder_ceo' then
    raise exception 'Only Founder/CEO can change a Founder/CEO account.';
  end if;

  if requested_role = 'founder_ceo' and actor_role <> 'founder_ceo' then
    raise exception 'Only Founder/CEO can assign the Founder/CEO role.';
  end if;

  if target_old_role = requested_role then
    return;
  end if;

  update public.profiles
    set role = requested_role,
        updated_at = now()
  where id = $1;

  insert into public.role_change_logs (
    actor_profile_id,
    target_profile_id,
    old_role,
    new_role,
    reason
  )
  values (
    actor_id,
    $1,
    target_old_role,
    requested_role,
    clean_reason
  );
end;
$$;

revoke all on function public.update_profile_role(uuid, text, text) from public;
grant execute on function public.update_profile_role(uuid, text, text) to authenticated;

comment on table public.role_change_logs is
  'Append-only role change history written by the secure role management RPC.';

comment on function public.update_profile_role(uuid, text, text) is
  'Security-definer role management RPC. Only Founder/CEO and CTO may call it successfully; self-role changes and protected Founder/CEO transitions are blocked.';
