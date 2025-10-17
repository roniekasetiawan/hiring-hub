insert into public.users (email, full_name, role)
values
    ('admin@hiringhub.com', 'Admin User', 'admin'),
    ('recruiter@hiringhub.com', 'Recruiter User', 'recruiter'),
    ('applicant@hiringhub.com', 'Applicant User', 'applicant');

insert into public.jobs (title, description, location)
values
    ('Frontend Engineer', 'Work on React and Next.js apps', 'Remote'),
    ('Backend Engineer', 'Work on Go and PostgreSQL systems', 'Jakarta');
