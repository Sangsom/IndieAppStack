create type public.admin_role as enum ('admin');

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email citext not null,
  role public.admin_role not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_users_email_key unique (email)
);

create trigger admin_users_set_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;

create or replace function public.has_admin_role(target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    target_user_id is not null
    and exists (
      select 1
      from public.admin_users
      where user_id = target_user_id
      and role = 'admin'
    ),
    false
  );
$$;

revoke all on function public.has_admin_role(uuid) from public;
grant execute on function public.has_admin_role(uuid) to authenticated, service_role;

create policy "admin users can read their own role"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

create policy "admins can manage categories"
on public.categories
for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage tools"
on public.tools
for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage tool category assignments"
on public.tool_categories
for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage affiliate programs"
on public.affiliate_programs
for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage affiliate links"
on public.affiliate_links
for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can read click events"
on public.click_events
for select
to authenticated
using (public.has_admin_role());

create policy "admins can manage articles"
on public.articles
for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage article tool assignments"
on public.article_tools
for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage stack recommendations"
on public.stack_recommendations
for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage stack tools"
on public.stack_tools
for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage subscribers"
on public.subscribers
for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

create policy "admins can manage topic queue"
on public.topic_queue
for all
to authenticated
using (public.has_admin_role())
with check (public.has_admin_role());

grant select on public.admin_users to authenticated;

grant select, insert, update, delete on
  public.categories,
  public.tools,
  public.tool_categories,
  public.affiliate_programs,
  public.affiliate_links,
  public.articles,
  public.article_tools,
  public.stack_recommendations,
  public.stack_tools,
  public.subscribers,
  public.topic_queue
to authenticated;

grant select on public.click_events to authenticated;

grant all privileges on public.admin_users to service_role;
