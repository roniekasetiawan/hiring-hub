alter table public.jobs
    add column created_by_user_id uuid references public.users(id) on delete set null;

comment on column public.jobs.created_by_user_id is 'ID dari user (recruiter/admin) yang membuat lowongan pekerjaan ini.';

alter table public.jobs enable row level security;

create policy "Allow public read access for active jobs"
on public.jobs for select
                              using (status = 'active');

create policy "Allow admins and recruiters to create jobs"
on public.jobs for insert
with check ((select role from public.users where id = auth.uid()) in ('admin', 'recruiter'));

create policy "Allow user to update their own jobs"
on public.jobs for update
                                     using (auth.uid() = created_by_user_id);

create policy "Allow user to delete their own jobs"
on public.jobs for delete
using (auth.uid() = created_by_user_id);

