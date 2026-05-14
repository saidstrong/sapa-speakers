create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  volunteer_id uuid not null references public.volunteers(id) on delete cascade,
  title text not null,
  description text,
  achievement_type text not null default 'general',
  status text not null default 'awarded',
  awarded_by uuid references public.profiles(id) on delete set null,
  awarded_at timestamptz not null default now(),
  revoked_at timestamptz,
  revocation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint achievements_title_non_empty
    check (char_length(trim(title)) > 0),
  constraint achievements_type_check
    check (achievement_type in ('general', 'attendance', 'contribution', 'leadership', 'special')),
  constraint achievements_status_check
    check (status in ('awarded', 'revoked'))
);

create index if not exists achievements_volunteer_id_idx
  on public.achievements (volunteer_id);

create index if not exists achievements_status_idx
  on public.achievements (status);

create index if not exists achievements_awarded_at_idx
  on public.achievements (awarded_at desc);

create index if not exists achievements_awarded_by_idx
  on public.achievements (awarded_by);

create index if not exists achievements_type_idx
  on public.achievements (achievement_type);

drop trigger if exists set_achievements_updated_at on public.achievements;
create trigger set_achievements_updated_at
  before update on public.achievements
  for each row
  execute function public.set_updated_at();

alter table public.achievements enable row level security;

revoke all on table public.achievements from anon;
revoke all on table public.achievements from authenticated;

grant select, insert, update on table public.achievements to authenticated;
revoke delete on table public.achievements from authenticated;

drop policy if exists "Admin roles can select achievements" on public.achievements;
create policy "Admin roles can select achievements"
  on public.achievements
  for select
  to authenticated
  using ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can insert achievements" on public.achievements;
create policy "Admin roles can insert achievements"
  on public.achievements
  for insert
  to authenticated
  with check ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can update achievements" on public.achievements;
create policy "Admin roles can update achievements"
  on public.achievements
  for update
  to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

drop policy if exists "Active volunteers can select own achievements" on public.achievements;
create policy "Active volunteers can select own achievements"
  on public.achievements
  for select
  to authenticated
  using (volunteer_id = (select public.current_user_active_volunteer_id()));

comment on table public.achievements is
  'Manual achievement and badge records for SapaSpeakers volunteers. Phase 7A does not include automation, points, levels, leaderboards, public pages, or notifications.';
