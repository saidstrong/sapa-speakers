revoke update (id, email, role, created_at)
  on public.profiles
  from authenticated;

revoke update (full_name, phone, telegram, updated_at)
  on public.profiles
  from authenticated;

grant update (full_name, phone, telegram, updated_at)
  on public.profiles
  to authenticated;

drop policy if exists "Users can update their own safe profile fields" on public.profiles;
create policy "Users can update their own safe profile fields"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

comment on policy "Users can update their own safe profile fields"
  on public.profiles is
  'Allows authenticated users to update only their own safe contact fields through column-level grants. Email, role, id, and created_at remain blocked.';
