create type public.job_type as enum ('full_time', 'part_time', 'contract', 'internship', 'freelance');
create type public.job_status as enum ('active', 'inactive', 'draft');

alter table public.jobs
drop column if exists status,
    add column status public.job_status not null default 'draft',

    add column job_type public.job_type not null default 'full_time',
    add column salary_min numeric(12, 2),
    add column salary_max numeric(12, 2),
    add column candidates_needed integer not null default 1,

    add column application_form_config jsonb not null default
        '{
           "full_name": "mandatory",
           "photo_profile": "mandatory",
           "email": "mandatory",
           "phone_number": "optional",
           "gender": "optional",
           "domicile": "optional",
           "linkedin_link": "off",
           "date_of_birth": "off"
         }'::jsonb;

comment on column public.jobs.status is 'Status lowongan pekerjaan: Active, Inactive, atau Draft.';
comment on column public.jobs.job_type is 'Jenis pekerjaan seperti Full-time, Part-time, dll.';
comment on column public.jobs.salary_min is 'Gaji minimum yang ditawarkan.';
comment on column public.jobs.salary_max is 'Gaji maksimum yang ditawarkan.';
comment on column public.jobs.candidates_needed is 'Jumlah kandidat yang dibutuhkan untuk posisi ini.';
comment on column public.jobs.application_form_config is 'Konfigurasi JSONB untuk field form aplikasi (mandatory, optional, off).';