create or replace function public.healthcheck()
returns integer
language sql
stable
as $$
  select 1;
$$;

revoke all on function public.healthcheck() from public;
grant execute on function public.healthcheck() to anon, authenticated, service_role;
