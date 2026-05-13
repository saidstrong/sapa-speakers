create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  telegram text,
  role text not null default 'volunteer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_email_non_empty
    check (char_length(trim(email)) between 3 and 254),
  constraint profiles_role_check
    check (
      role in (
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
    )
);

create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  application_id uuid references public.volunteer_applications(id) on delete set null,
  status text not null default 'active',
  joined_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint volunteers_status_check
    check (status in ('active', 'inactive', 'suspended', 'alumni'))
);

create index if not exists profiles_email_lower_idx
  on public.profiles (lower(email));

create index if not exists profiles_role_idx
  on public.profiles (role);

create index if not exists volunteers_profile_id_idx
  on public.volunteers (profile_id);

create index if not exists volunteers_status_idx
  on public.volunteers (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_volunteers_updated_at on public.volunteers;
create trigger set_volunteers_updated_at
  before update on public.volunteers
  for each row
  execute function public.set_updated_at();

create or replace function public.is_admin_role(role_key text)
returns boolean
language sql
stable
set search_path = public
as $$
  select role_key in (
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
    'secretary'
  );
$$;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles as p
  where p.id = (select auth.uid())
  limit 1;
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.is_admin_role(public.current_user_role()), false);
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    'volunteer'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name),
        phone = coalesce(public.profiles.phone, excluded.phone),
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_profile on auth.users;
create trigger on_auth_user_created_create_profile
  after insert on auth.users
  for each row
  execute function public.handle_new_user_profile();

alter table public.profiles enable row level security;
alter table public.volunteers enable row level security;

revoke all on table public.profiles from anon;
revoke all on table public.volunteers from anon;
revoke all on table public.profiles from authenticated;
revoke all on table public.volunteers from authenticated;

-- Do not grant client-side updates to profiles.role. Role promotion stays manual
-- until the dedicated roles/user_roles workflow and audit logging exist.
grant select on table public.profiles to authenticated;
grant update (email, full_name, phone, telegram, updated_at)
  on table public.profiles
  to authenticated;
grant select, update on table public.volunteers to authenticated;

revoke all on function public.current_user_role() from public;
revoke all on function public.current_user_is_admin() from public;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.current_user_is_admin() to authenticated;

drop policy if exists "Users can select their own profile" on public.profiles;
create policy "Users can select their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Admin roles can select profiles" on public.profiles;
create policy "Admin roles can select profiles"
  on public.profiles
  for select
  to authenticated
  using ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can update profiles" on public.profiles;
create policy "Admin roles can update profiles"
  on public.profiles
  for update
  to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

drop policy if exists "Users can select their own volunteer row" on public.volunteers;
create policy "Users can select their own volunteer row"
  on public.volunteers
  for select
  to authenticated
  using (profile_id = (select auth.uid()));

drop policy if exists "Admin roles can select volunteers" on public.volunteers;
create policy "Admin roles can select volunteers"
  on public.volunteers
  for select
  to authenticated
  using ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can update volunteers" on public.volunteers;
create policy "Admin roles can update volunteers"
  on public.volunteers
  for update
  to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

comment on table public.profiles is
  'Authenticated user profiles for SapaSpeakers. Phase 1B uses a single role field; later phases will move permissions to roles/user_roles.';

comment on table public.volunteers is
  'Volunteer records for approved volunteers. Rows are not auto-created during registration.';

comment on function public.current_user_role() is
  'Security definer helper used by RLS policies to read the current authenticated user role without recursive profile policies.';

comment on function public.current_user_is_admin() is
  'Returns true when the current authenticated profile has an admin-capable role. Admin review and role-management policies will be expanded after full roles/user_roles exist.';
