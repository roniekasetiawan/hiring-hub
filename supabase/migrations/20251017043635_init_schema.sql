create table public.users (
                              id uuid primary key default gen_random_uuid(),
                              email text unique not null,
                              full_name text,
                              role text check (role in ('admin','recruiter','applicant')) default 'applicant',
                              created_at timestamptz default now()
);

create table public.jobs (
                             id uuid primary key default gen_random_uuid(),
                             title text not null,
                             description text,
                             location text,
                             status text check (status in ('open','closed')) default 'open',
                             created_at timestamptz default now()
);

create table public.applications (
                                     id uuid primary key default gen_random_uuid(),
                                     user_id uuid references public.users(id) on delete cascade,
                                     job_id uuid references public.jobs(id) on delete cascade,
                                     status text check (status in ('applied','review','interview','rejected','hired')) default 'applied',
                                     created_at timestamptz default now()
);
