revoke all on table public.events from anon;

grant select, insert, update on table public.events to authenticated;

revoke delete on table public.events from authenticated;

drop policy if exists "Authenticated users can select published events" on public.events;
create policy "Authenticated users can select published events"
  on public.events
  for select
  to authenticated
  using (status = 'published');

comment on policy "Authenticated users can select published events"
  on public.events is
  'Allows authenticated volunteers to view published events/projects in the app. Draft, completed, and cancelled events remain hidden unless an admin policy applies.';
