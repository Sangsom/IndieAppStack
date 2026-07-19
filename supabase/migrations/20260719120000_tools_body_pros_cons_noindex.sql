-- Give each tool room for genuinely unique, long-form substance so the
-- /tools/* pages stop sharing an identical boilerplate skeleton.
--   body_markdown: overview, pricing tiers, setup notes, and an FAQ, authored in
--                  the same Markdown dialect used by guides/comparisons.
--   pros / cons:   distinct, fuller decision points (no longer reusing best_for /
--                  not_good_for, which are short scannable fit phrases).
--   noindex:       lets us keep a thin/off-audience tool published and internally
--                  linked while excluding it from the sitemap and search index.
alter table public.tools
  add column body_markdown text,
  add column pros text[] not null default '{}',
  add column cons text[] not null default '{}',
  add column noindex boolean not null default false;

-- Existing "anon can read published tools" RLS policy already covers every column
-- on public.tools, so the new columns need no additional policy.
