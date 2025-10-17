insert into public.users (email, full_name, role)
values
    ('admin@hiringhub.com','Admin User','admin'),
    ('recruiter@hiringhub.com','Recruiter User','recruiter'),
    ('applicant@hiringhub.com','Applicant User','applicant')
    on conflict (email) do nothing;

insert into public.jobs (title, description, location)
values
    ('Frontend Engineer','Work on React/Next.js','Remote'),
    ('Backend Engineer','Work on Go/Postgres','Jakarta')
    on conflict do nothing;
