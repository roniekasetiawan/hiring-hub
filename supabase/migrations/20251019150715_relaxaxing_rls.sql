drop policy if exists "Allow admins and recruiters to create jobs" on public.jobs;
drop policy if exists "Allow user to update their own jobs" on public.jobs;
drop policy if exists "Allow user to delete their own jobs" on public.jobs;

create policy "DEV: Allow all inserts"
on public.jobs for insert
with check (true);

create policy "DEV: Allow all updates"
on public.jobs for update
                                                    using (true);

create policy "DEV: Allow all deletes"
on public.jobs for delete
using (true);