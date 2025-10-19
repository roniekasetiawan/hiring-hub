drop policy if exists "Allow admins and recruiters to create jobs" on public.jobs;
drop policy if exists "Allow user to update their own jobs" on public.jobs;
drop policy if exists "Allow user to delete their own jobs" on public.jobs;

drop policy if exists "DEV: Allow all inserts" on public.jobs;
drop policy if exists "DEV: Allow all updates" on public.jobs;
drop policy if exists "DEV: Allow all deletes" on public.jobs;

create policy "Allow all inserts"
on public.jobs for insert
with check (true);

create policy "Allow all updates"
on public.jobs for update
                                                                   using (true);

create policy "Allow all deletes"
on public.jobs for delete
using (true);

drop policy if exists "Allow public read access for active jobs" on public.jobs;
create policy "Allow all reads"
on public.jobs for select
                                   using (true);
