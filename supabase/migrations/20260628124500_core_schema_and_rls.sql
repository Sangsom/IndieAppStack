create extension if not exists citext with schema public;

create type public.tool_status as enum ('draft', 'published', 'archived');
create type public.category_status as enum ('draft', 'published', 'archived');
create type public.article_status as enum (
  'idea',
  'draft',
  'review',
  'published',
  'archived',
  'rejected'
);
create type public.article_content_type as enum (
  'guide',
  'comparison',
  'tool_review',
  'category_page',
  'stack_finder',
  'news'
);
create type public.pricing_model as enum (
  'free',
  'freemium',
  'paid',
  'usage_based',
  'open_source',
  'custom',
  'unknown'
);
create type public.affiliate_program_status as enum (
  'not_applied',
  'applied',
  'approved',
  'rejected',
  'paused'
);
create type public.affiliate_link_status as enum (
  'pending',
  'active',
  'inactive',
  'broken'
);
create type public.stack_recommendation_status as enum (
  'draft',
  'published',
  'archived'
);
create type public.subscriber_status as enum (
  'pending',
  'active',
  'unsubscribed'
);
create type public.topic_status as enum (
  'idea',
  'briefed',
  'drafted',
  'reviewing',
  'published',
  'rejected'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  status public.category_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_key unique (slug),
  constraint categories_slug_not_empty check (length(trim(slug)) > 0)
);

create table public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  tagline text,
  description text,
  website_url text,
  logo_url text,
  pricing_summary text,
  pricing_last_checked date,
  pricing_model public.pricing_model not null default 'unknown',
  best_for text[] not null default '{}',
  not_good_for text[] not null default '{}',
  platforms text[] not null default '{}',
  app_stages text[] not null default '{}',
  alternatives text[] not null default '{}',
  internal_notes text,
  status public.tool_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tools_slug_key unique (slug),
  constraint tools_slug_not_empty check (length(trim(slug)) > 0)
);

create table public.tool_categories (
  tool_id uuid not null references public.tools(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (tool_id, category_id)
);

create table public.affiliate_programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  network text not null default 'direct',
  status public.affiliate_program_status not null default 'not_applied',
  application_url text,
  dashboard_url text,
  commission_notes text,
  cookie_notes text,
  allowed_promotion_notes text,
  contact_email citext,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint affiliate_programs_name_key unique (name)
);

create table public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references public.tools(id) on delete set null,
  affiliate_program_id uuid references public.affiliate_programs(id) on delete set null,
  destination_url text not null,
  slug text not null,
  status public.affiliate_link_status not null default 'pending',
  default_rel text not null default 'sponsored nofollow',
  disclosure_required boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint affiliate_links_slug_key unique (slug),
  constraint affiliate_links_slug_not_empty check (length(trim(slug)) > 0)
);

create table public.click_events (
  id uuid primary key default gen_random_uuid(),
  affiliate_link_id uuid references public.affiliate_links(id) on delete set null,
  tool_id uuid references public.tools(id) on delete set null,
  clicked_at timestamptz not null default now(),
  source text,
  referrer text,
  user_agent text,
  ip_hash text,
  metadata jsonb not null default '{}'::jsonb
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  subtitle text,
  excerpt text,
  body_markdown text,
  author text,
  status public.article_status not null default 'idea',
  content_type public.article_content_type not null default 'guide',
  primary_category_id uuid references public.categories(id) on delete set null,
  affiliate_cta_blocks jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  human_reviewed boolean not null default false,
  ai_assisted boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_slug_key unique (slug),
  constraint articles_slug_not_empty check (length(trim(slug)) > 0),
  constraint articles_published_requires_review check (
    status <> 'published' or human_reviewed = true
  )
);

create table public.article_tools (
  article_id uuid not null references public.articles(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  relationship text not null default 'related',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (article_id, tool_id)
);

create table public.stack_recommendations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  quiz_answers jsonb not null default '{}'::jsonb,
  status public.stack_recommendation_status not null default 'draft',
  cost_notes text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stack_recommendations_slug_key unique (slug),
  constraint stack_recommendations_slug_not_empty check (length(trim(slug)) > 0)
);

create table public.stack_tools (
  stack_recommendation_id uuid not null references public.stack_recommendations(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  role text not null,
  reason text,
  alternatives text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (stack_recommendation_id, tool_id, role)
);

create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null,
  status public.subscriber_status not null default 'pending',
  source text,
  double_opt_in boolean not null default false,
  consent_at timestamptz,
  unsubscribed_at timestamptz,
  deleted_at timestamptz,
  provider text,
  provider_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscribers_email_key unique (email)
);

create table public.topic_queue (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  target_keyword text,
  search_intent text,
  target_category_id uuid references public.categories(id) on delete set null,
  related_tool_ids uuid[] not null default '{}',
  priority integer not null default 0,
  status public.topic_status not null default 'idea',
  notes text,
  feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint topic_queue_slug_key unique (slug),
  constraint topic_queue_slug_not_empty check (length(trim(slug)) > 0),
  constraint topic_queue_drafting_requires_intent check (
    status in ('idea', 'rejected') or length(trim(coalesce(search_intent, ''))) > 0
  )
);

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger tools_set_updated_at
before update on public.tools
for each row execute function public.set_updated_at();

create trigger affiliate_programs_set_updated_at
before update on public.affiliate_programs
for each row execute function public.set_updated_at();

create trigger affiliate_links_set_updated_at
before update on public.affiliate_links
for each row execute function public.set_updated_at();

create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

create trigger stack_recommendations_set_updated_at
before update on public.stack_recommendations
for each row execute function public.set_updated_at();

create trigger subscribers_set_updated_at
before update on public.subscribers
for each row execute function public.set_updated_at();

create trigger topic_queue_set_updated_at
before update on public.topic_queue
for each row execute function public.set_updated_at();

create index categories_status_idx on public.categories(status);
create index categories_slug_idx on public.categories(slug);
create index categories_parent_id_idx on public.categories(parent_id);
create index categories_sort_order_idx on public.categories(sort_order);

create index tools_status_idx on public.tools(status);
create index tools_slug_idx on public.tools(slug);
create index tools_platforms_idx on public.tools using gin(platforms);
create index tools_app_stages_idx on public.tools using gin(app_stages);

create index tool_categories_category_id_idx on public.tool_categories(category_id);

create index affiliate_programs_status_idx on public.affiliate_programs(status);
create index affiliate_links_slug_idx on public.affiliate_links(slug);
create index affiliate_links_status_idx on public.affiliate_links(status);
create index affiliate_links_tool_id_idx on public.affiliate_links(tool_id);

create index click_events_tool_id_idx on public.click_events(tool_id);
create index click_events_affiliate_link_id_idx on public.click_events(affiliate_link_id);
create index click_events_clicked_at_idx on public.click_events(clicked_at desc);

create index articles_status_idx on public.articles(status);
create index articles_slug_idx on public.articles(slug);
create index articles_primary_category_id_idx on public.articles(primary_category_id);
create index articles_published_at_idx on public.articles(published_at desc);

create index article_tools_tool_id_idx on public.article_tools(tool_id);

create index stack_recommendations_status_idx on public.stack_recommendations(status);
create index stack_recommendations_slug_idx on public.stack_recommendations(slug);
create index stack_tools_tool_id_idx on public.stack_tools(tool_id);

create index subscribers_status_idx on public.subscribers(status);
create index subscribers_source_idx on public.subscribers(source);

create index topic_queue_status_idx on public.topic_queue(status);
create index topic_queue_slug_idx on public.topic_queue(slug);
create index topic_queue_target_category_id_idx on public.topic_queue(target_category_id);

alter table public.categories enable row level security;
alter table public.tools enable row level security;
alter table public.tool_categories enable row level security;
alter table public.affiliate_programs enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.click_events enable row level security;
alter table public.articles enable row level security;
alter table public.article_tools enable row level security;
alter table public.stack_recommendations enable row level security;
alter table public.stack_tools enable row level security;
alter table public.subscribers enable row level security;
alter table public.topic_queue enable row level security;

create policy "anon can read published categories"
on public.categories
for select
to anon
using (status = 'published');

create policy "anon can read published tools"
on public.tools
for select
to anon
using (status = 'published');

create policy "anon can read published tool category assignments"
on public.tool_categories
for select
to anon
using (
  exists (
    select 1 from public.tools
    where tools.id = tool_categories.tool_id
    and tools.status = 'published'
  )
  and exists (
    select 1 from public.categories
    where categories.id = tool_categories.category_id
    and categories.status = 'published'
  )
);

create policy "anon can read published reviewed articles"
on public.articles
for select
to anon
using (status = 'published' and human_reviewed = true);

create policy "anon can read published article tool assignments"
on public.article_tools
for select
to anon
using (
  exists (
    select 1 from public.articles
    where articles.id = article_tools.article_id
    and articles.status = 'published'
    and articles.human_reviewed = true
  )
  and exists (
    select 1 from public.tools
    where tools.id = article_tools.tool_id
    and tools.status = 'published'
  )
);

create policy "anon can read published stack recommendations"
on public.stack_recommendations
for select
to anon
using (status = 'published');

create policy "anon can read published stack tools"
on public.stack_tools
for select
to anon
using (
  exists (
    select 1 from public.stack_recommendations
    where stack_recommendations.id = stack_tools.stack_recommendation_id
    and stack_recommendations.status = 'published'
  )
  and exists (
    select 1 from public.tools
    where tools.id = stack_tools.tool_id
    and tools.status = 'published'
  )
);

grant usage on schema public to anon, authenticated, service_role;
grant select on
  public.categories,
  public.tools,
  public.tool_categories,
  public.articles,
  public.article_tools,
  public.stack_recommendations,
  public.stack_tools
to anon;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all routines in schema public to service_role;
