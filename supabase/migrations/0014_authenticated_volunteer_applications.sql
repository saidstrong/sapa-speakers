revoke insert on table public.volunteer_applications from anon;
revoke insert (
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
) on table public.volunteer_applications from anon;

drop policy if exists "Anonymous users can submit volunteer applications"
  on public.volunteer_applications;

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
) on table public.volunteer_applications to authenticated;

drop policy if exists "Authenticated users can submit volunteer applications"
  on public.volunteer_applications;
create policy "Authenticated users can submit volunteer applications"
  on public.volunteer_applications
  for insert
  to authenticated
  with check (
    status = 'pending'
    and reviewed_at is null
    and reviewer_notes is null
    and reviewed_by is null
  );

comment on policy "Authenticated users can submit volunteer applications"
  on public.volunteer_applications is
  'Allows signed-in applicants to submit pending volunteer applications from the authenticated app. Select, update, and delete remain unavailable to normal users through RLS.';
