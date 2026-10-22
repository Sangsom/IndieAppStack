-- Sitemap lastmod reads updated_at. set_updated_at() used to assign now() on
-- every update, including a reseed that wrote the same column values. Keep the
-- previous timestamp unless a column other than updated_at actually changed.
--
-- Push to main applies this file in .github/workflows/seed-production.yml
-- (supabase link, then supabase db push) before the content upsert. The seed
-- only upserts content, and it skips unchanged rows, so lastmod stays put on
-- a reseed even before this function is replaced. The function still needs to
-- land so admin saves and one-off upserts follow the same rule.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  if (to_jsonb(new) - 'updated_at') is distinct from (to_jsonb(old) - 'updated_at') then
    new.updated_at = now();
  else
    new.updated_at = old.updated_at;
  end if;

  return new;
end;
$$;
