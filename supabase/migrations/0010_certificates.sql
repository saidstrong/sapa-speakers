create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  volunteer_id uuid not null references public.volunteers(id) on delete cascade,
  title text not null,
  description text,
  certificate_type text not null default 'participation',
  status text not null default 'issued',
  issued_by uuid references public.profiles(id) on delete set null,
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  revocation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint certificates_title_non_empty
    check (char_length(trim(title)) > 0),
  constraint certificates_type_check
    check (certificate_type in ('participation', 'contribution', 'leadership', 'special')),
  constraint certificates_status_check
    check (status in ('issued', 'revoked'))
);

create index if not exists certificates_volunteer_id_idx
  on public.certificates (volunteer_id);

create index if not exists certificates_status_idx
  on public.certificates (status);

create index if not exists certificates_issued_at_idx
  on public.certificates (issued_at desc);

create index if not exists certificates_issued_by_idx
  on public.certificates (issued_by);

drop trigger if exists set_certificates_updated_at on public.certificates;
create trigger set_certificates_updated_at
  before update on public.certificates
  for each row
  execute function public.set_updated_at();

alter table public.certificates enable row level security;

revoke all on table public.certificates from anon;
revoke all on table public.certificates from authenticated;

grant select, insert, update on table public.certificates to authenticated;
revoke delete on table public.certificates from authenticated;

drop policy if exists "Admin roles can select certificates" on public.certificates;
create policy "Admin roles can select certificates"
  on public.certificates
  for select
  to authenticated
  using ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can insert certificates" on public.certificates;
create policy "Admin roles can insert certificates"
  on public.certificates
  for insert
  to authenticated
  with check ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can update certificates" on public.certificates;
create policy "Admin roles can update certificates"
  on public.certificates
  for update
  to authenticated
  using ((select public.current_user_is_admin()))
  with check ((select public.current_user_is_admin()));

drop policy if exists "Active volunteers can select own certificates" on public.certificates;
create policy "Active volunteers can select own certificates"
  on public.certificates
  for select
  to authenticated
  using (volunteer_id = (select public.current_user_active_volunteer_id()));

comment on table public.certificates is
  'Simple certificate records for SapaSpeakers volunteers. Phase 6A does not include PDFs, storage, QR verification, templates, or public verification pages.';
