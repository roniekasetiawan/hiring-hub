create table if not exists public.roles (
                                            id text primary key
);

create table if not exists public.permissions (
                                                  id bigserial primary key,
                                                  action text not null,
                                                  subject text not null,
                                                  conditions jsonb
);

create table if not exists public.role_permissions (
                                                       role_id text references public.roles(id) on delete cascade,
    permission_id bigint references public.permissions(id) on delete cascade,
    primary key (role_id, permission_id)
    );

insert into public.roles(id) values ('admin'),('recruiter'),('applicant') on conflict do nothing;

insert into public.permissions(action,subject,conditions) values ('manage','all',null);

insert into public.permissions(action,subject,conditions) values
                                                              ('create','Job', null),
                                                              ('read','Job',   null),
                                                              ('update','Job', '{"owner_id":"$USER_ID"}'),
                                                              ('delete','Job', '{"owner_id":"$USER_ID"}'),
                                                              ('read','Application', null),
                                                              ('approve','Application','{"job_owner_id":"$USER_ID"}');

insert into public.permissions(action,subject,conditions) values
                                                              ('read','Job', null),
                                                              ('create','Application', null),
                                                              ('read','Application','{"user_id":"$USER_ID"}'),
                                                              ('update','Application','{"user_id":"$USER_ID"}');

insert into public.role_permissions(role_id, permission_id)
select 'admin', p.id from public.permissions p where p.action='manage' and p.subject='all'
    on conflict do nothing;

insert into public.role_permissions(role_id, permission_id)
select 'recruiter', p.id from public.permissions p
where (p.action,p.subject) in (('create','Job'),('read','Job'),('read','Application'),('approve','Application'))
   or (p.action,p.subject) in (('update','Job'),('delete','Job'));

insert into public.role_permissions(role_id, permission_id)
select 'applicant', p.id from public.permissions p
where (p.action,p.subject) in (('read','Job'),('create','Application'),('read','Application'),('update','Application'));
