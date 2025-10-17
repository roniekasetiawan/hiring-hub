create extension if not exists pgcrypto with schema extensions;

create or replace function public.create_user_with_password(
  p_email text,
  p_password text,
  p_full_name text default null,
  p_role text default 'applicant'
)
returns table (
  id uuid,
  email text,
  full_name text,
  role text,
  created_at timestamptz
)
language plpgsql
security definer
as $$
begin
return query
    insert into public.users (email, full_name, role, password_hash)
  values (
    lower(p_email),
    nullif(p_full_name, ''),
    coalesce(p_role, 'applicant'),
    extensions.crypt(p_password, extensions.gen_salt('bf'))
  )
  returning users.id, users.email, users.full_name, users.role, users.created_at;
end;
$$;

grant execute on function public.create_user_with_password(text, text, text, text)
  to anon, authenticated, service_role;
