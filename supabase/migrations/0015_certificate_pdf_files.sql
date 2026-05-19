alter table public.certificates
  add column if not exists file_path text,
  add column if not exists file_name text,
  add column if not exists file_size_bytes integer,
  add column if not exists file_mime_type text,
  add column if not exists file_uploaded_by uuid references public.profiles(id) on delete set null,
  add column if not exists file_uploaded_at timestamptz;

alter table public.certificates
  drop constraint if exists certificates_file_mime_type_pdf,
  add constraint certificates_file_mime_type_pdf
    check (file_path is null or file_mime_type = 'application/pdf');

alter table public.certificates
  drop constraint if exists certificates_file_size_positive,
  add constraint certificates_file_size_positive
    check (file_size_bytes is null or file_size_bytes > 0);

alter table public.certificates
  drop constraint if exists certificates_file_size_limit,
  add constraint certificates_file_size_limit
    check (file_size_bytes is null or file_size_bytes <= 10485760);

alter table public.certificates
  drop constraint if exists certificates_file_metadata_consistent,
  add constraint certificates_file_metadata_consistent
    check (
      (
        file_path is null
        and file_name is null
        and file_size_bytes is null
        and file_mime_type is null
        and file_uploaded_by is null
        and file_uploaded_at is null
      )
      or
      (
        file_path is not null
        and file_name is not null
        and file_size_bytes is not null
        and file_mime_type = 'application/pdf'
        and file_uploaded_at is not null
      )
    );

create unique index if not exists certificates_file_path_key
  on public.certificates (file_path)
  where file_path is not null;

create index if not exists certificates_file_uploaded_by_idx
  on public.certificates (file_uploaded_by);

create or replace function public.is_certificate_file_uploader_role(role_key text)
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
    'volunteer_teamlead'
  );
$$;

revoke all on function public.is_certificate_file_uploader_role(text) from public;
grant execute on function public.is_certificate_file_uploader_role(text) to authenticated;

create or replace function public.enforce_certificate_file_metadata_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if (
    old.file_path is distinct from new.file_path
    or old.file_name is distinct from new.file_name
    or old.file_size_bytes is distinct from new.file_size_bytes
    or old.file_mime_type is distinct from new.file_mime_type
    or old.file_uploaded_by is distinct from new.file_uploaded_by
    or old.file_uploaded_at is distinct from new.file_uploaded_at
  ) then
    if old.status <> 'issued' or new.status <> 'issued' then
      raise exception 'Certificate PDF files can only be changed for issued certificates.';
    end if;

    if not coalesce(public.is_certificate_file_uploader_role(public.current_user_role()), false) then
      raise exception 'Current role cannot change official certificate PDF files.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_certificate_file_metadata_update on public.certificates;
create trigger enforce_certificate_file_metadata_update
  before update on public.certificates
  for each row
  execute function public.enforce_certificate_file_metadata_update();

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'certificate-files',
  'certificate-files',
  false,
  10485760,
  array['application/pdf']::text[]
)
on conflict (id) do update
  set public = false,
      file_size_limit = 10485760,
      allowed_mime_types = array['application/pdf']::text[];

drop policy if exists "Authorized roles can upload certificate PDFs" on storage.objects;
create policy "Authorized roles can upload certificate PDFs"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'certificate-files'
    and name like 'certificates/%'
    and coalesce(public.is_certificate_file_uploader_role(public.current_user_role()), false)
  );

drop policy if exists "Authorized roles can replace certificate PDFs" on storage.objects;
create policy "Authorized roles can replace certificate PDFs"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'certificate-files'
    and name like 'certificates/%'
    and coalesce(public.is_certificate_file_uploader_role(public.current_user_role()), false)
  )
  with check (
    bucket_id = 'certificate-files'
    and name like 'certificates/%'
    and coalesce(public.is_certificate_file_uploader_role(public.current_user_role()), false)
  );

drop policy if exists "Authorized roles can delete certificate PDFs" on storage.objects;
create policy "Authorized roles can delete certificate PDFs"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'certificate-files'
    and name like 'certificates/%'
    and coalesce(public.is_certificate_file_uploader_role(public.current_user_role()), false)
  );

drop policy if exists "Authorized users can download certificate PDFs" on storage.objects;
create policy "Authorized users can download certificate PDFs"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'certificate-files'
    and (
      (select public.current_user_is_admin())
      or exists (
        select 1
        from public.certificates as c
        join public.volunteers as v on v.id = c.volunteer_id
        where c.file_path = name
          and c.status = 'issued'
          and v.profile_id = (select auth.uid())
      )
    )
  );

comment on column public.certificates.file_path is
  'Private Supabase Storage object path for the official certificate PDF.';

comment on column public.certificates.file_uploaded_by is
  'Authorized organization profile that uploaded or replaced the official certificate PDF.';

comment on function public.is_certificate_file_uploader_role(text) is
  'Returns true for roles allowed to upload or replace official certificate PDF files.';

comment on trigger enforce_certificate_file_metadata_update on public.certificates is
  'Prevents unauthorized roles and revoked certificates from changing official certificate PDF metadata.';
