revoke all on table public.events from anon;

grant select, insert, update on table public.events to authenticated;

revoke delete on table public.events from authenticated;
