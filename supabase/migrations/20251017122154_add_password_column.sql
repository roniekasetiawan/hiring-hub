create extension if not exists pgcrypto with schema extensions;

alter table public.users
    add column if not exists password_hash text;

update public.users
set password_hash = extensions.crypt('Admin123!', extensions.gen_salt('bf'))
where email = 'admin@hiringhub.com' and (password_hash is null or password_hash = '');

update public.users
set password_hash = extensions.crypt('Recruiter123!', extensions.gen_salt('bf'))
where email = 'recruiter@hiringhub.com' and (password_hash is null or password_hash = '');

update public.users
set password_hash = extensions.crypt('Applicant123!', extensions.gen_salt('bf'))
where email = 'applicant@hiringhub.com' and (password_hash is null or password_hash = '');

do $$
begin
  if not exists (select 1 from public.users where password_hash is null) then
alter table public.users alter column password_hash set not null;
end if;
end $$;

create index if not exists idx_users_email on public.users (email);

create or replace function public.set_user_password(p_email text, p_password text)
returns void
language plpgsql
security definer
as $$
begin
update public.users
set password_hash = extensions.crypt(p_password, extensions.gen_salt('bf'))
where email = p_email;
end;
$$;

create or replace function public.verify_user_password(p_password text, p_hash text)
returns boolean
language sql
stable
as $$
select extensions.crypt(p_password, p_hash) = p_hash;
$$;

grant execute on function public.set_user_password(text, text) to anon, authenticated, service_role;
grant execute on function public.verify_user_password(text, text) to anon, authenticated, service_role;
