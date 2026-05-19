alter table public.profiles
  add column if not exists avatar_path text,
  add column if not exists avatar_file_name text,
  add column if not exists avatar_file_size_bytes integer,
  add column if not exists avatar_mime_type text,
  add column if not exists avatar_uploaded_at timestamptz;

alter table public.profiles
  drop constraint if exists profiles_avatar_mime_type_check,
  add constraint profiles_avatar_mime_type_check
    check (
      avatar_path is null
      or avatar_mime_type in ('image/jpeg', 'image/png', 'image/webp')
    );

alter table public.profiles
  drop constraint if exists profiles_avatar_file_size_positive,
  add constraint profiles_avatar_file_size_positive
    check (avatar_file_size_bytes is null or avatar_file_size_bytes > 0);

alter table public.profiles
  drop constraint if exists profiles_avatar_file_size_limit,
  add constraint profiles_avatar_file_size_limit
    check (avatar_file_size_bytes is null or avatar_file_size_bytes <= 5242880);

alter table public.profiles
  drop constraint if exists profiles_avatar_metadata_consistent,
  add constraint profiles_avatar_metadata_consistent
    check (
      (
        avatar_path is null
        and avatar_file_name is null
        and avatar_file_size_bytes is null
        and avatar_mime_type is null
        and avatar_uploaded_at is null
      )
      or
      (
        avatar_path is not null
        and avatar_file_name is not null
        and avatar_file_size_bytes is not null
        and avatar_mime_type in ('image/jpeg', 'image/png', 'image/webp')
        and avatar_uploaded_at is not null
      )
    );

create unique index if not exists profiles_avatar_path_key
  on public.profiles (avatar_path)
  where avatar_path is not null;

create or replace function public.enforce_profile_avatar_metadata_update()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  current_profile_id uuid := (select auth.uid());
begin
  if (
    old.avatar_path is distinct from new.avatar_path
    or old.avatar_file_name is distinct from new.avatar_file_name
    or old.avatar_file_size_bytes is distinct from new.avatar_file_size_bytes
    or old.avatar_mime_type is distinct from new.avatar_mime_type
    or old.avatar_uploaded_at is distinct from new.avatar_uploaded_at
  ) then
    if current_profile_id is null or current_profile_id <> new.id then
      raise exception 'Users can change only their own profile avatar.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_profile_avatar_metadata_update on public.profiles;
create trigger enforce_profile_avatar_metadata_update
  before update on public.profiles
  for each row
  execute function public.enforce_profile_avatar_metadata_update();

grant update (
  avatar_path,
  avatar_file_name,
  avatar_file_size_bytes,
  avatar_mime_type,
  avatar_uploaded_at
) on public.profiles to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'profile-avatars',
  'profile-avatars',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
  set public = false,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']::text[];

drop policy if exists "Users can view permitted profile avatars" on storage.objects;
create policy "Users can view permitted profile avatars"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'profile-avatars'
    and (
      name like ('profiles/' || ((select auth.uid())::text) || '/%')
      or (select public.current_user_is_admin())
    )
  );

drop policy if exists "Users can upload own profile avatars" on storage.objects;
create policy "Users can upload own profile avatars"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'profile-avatars'
    and name like ('profiles/' || ((select auth.uid())::text) || '/%')
  );

drop policy if exists "Users can replace own profile avatars" on storage.objects;
create policy "Users can replace own profile avatars"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'profile-avatars'
    and name like ('profiles/' || ((select auth.uid())::text) || '/%')
  )
  with check (
    bucket_id = 'profile-avatars'
    and name like ('profiles/' || ((select auth.uid())::text) || '/%')
  );

drop policy if exists "Users can delete own profile avatars" on storage.objects;
create policy "Users can delete own profile avatars"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'profile-avatars'
    and name like ('profiles/' || ((select auth.uid())::text) || '/%')
  );

comment on column public.profiles.avatar_path is
  'Private Supabase Storage object path for the current profile avatar.';

comment on function public.enforce_profile_avatar_metadata_update() is
  'Prevents authenticated users, including admins, from changing another profile avatar metadata through direct profile updates.';

comment on trigger enforce_profile_avatar_metadata_update on public.profiles is
  'Keeps profile avatar metadata self-service only. Admins can view private avatars through storage policy but cannot edit another user avatar.';
