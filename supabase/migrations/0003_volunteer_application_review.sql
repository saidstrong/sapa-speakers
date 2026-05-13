alter table public.volunteer_applications
  add column if not exists reviewed_by uuid references public.profiles(id) on delete set null;

create index if not exists volunteer_applications_status_review_idx
  on public.volunteer_applications (status);

create index if not exists volunteer_applications_submitted_at_review_idx
  on public.volunteer_applications (submitted_at desc);

create index if not exists volunteer_applications_email_lower_review_idx
  on public.volunteer_applications (lower(email));

revoke all on table public.volunteer_applications from anon;
revoke all on table public.volunteer_applications from authenticated;

grant insert (
  full_name,
  email,
  phone,
  telegram,
  city,
  age,
  languages,
  interests,
  experience,
  motivation,
  availability,
  status
) on table public.volunteer_applications to anon;

grant select on table public.volunteer_applications to authenticated;
grant update (status, reviewed_at, reviewer_notes, reviewed_by)
  on table public.volunteer_applications
  to authenticated;

grant insert (profile_id, application_id, status)
  on table public.volunteers
  to authenticated;

drop policy if exists "Admin roles can select volunteer applications" on public.volunteer_applications;
create policy "Admin roles can select volunteer applications"
  on public.volunteer_applications
  for select
  to authenticated
  using ((select public.current_user_is_admin()));

drop policy if exists "Admin roles can update volunteer applications" on public.volunteer_applications;
create policy "Admin roles can update volunteer applications"
  on public.volunteer_applications
  for update
  to authenticated
  using ((select public.current_user_is_admin()))
  with check (
    (select public.current_user_is_admin())
    and status in ('pending', 'approved', 'declined')
  );

drop policy if exists "Admin roles can insert volunteers" on public.volunteers;
create policy "Admin roles can insert volunteers"
  on public.volunteers
  for insert
  to authenticated
  with check ((select public.current_user_is_admin()));

comment on column public.volunteer_applications.reviewed_by is
  'Admin profile that reviewed the public volunteer application.';

comment on policy "Admin roles can select volunteer applications"
  on public.volunteer_applications is
  'Allows authenticated admin-capable roles to review public volunteer applications.';

comment on policy "Admin roles can update volunteer applications"
  on public.volunteer_applications is
  'Allows authenticated admin-capable roles to update review status and review metadata only.';

comment on policy "Admin roles can insert volunteers"
  on public.volunteers is
  'Allows admin-capable reviewers to create a volunteer record after approving a public volunteer application.';
