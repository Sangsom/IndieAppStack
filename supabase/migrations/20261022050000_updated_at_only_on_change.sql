-- Sitemap lastmod reads updated_at. set_updated_at() used to assign now() on
-- every update, including a reseed that wrote the same column values. Keep the
-- previous timestamp unless a column other than updated_at actually changed.
--
-- Apply this file to the hosted Supabase project the same way as the other
-- files in supabase/migrations/: `supabase db push`, or paste it into the SQL
-- editor. GitHub Actions does not run migrations. The production seed workflow
-- only upserts content. That seed also skips unchanged rows, so lastmod stays
-- put on the next reseed even before this function is replaced. Apply the
-- function anyway so admin saves and one-off upserts follow the same rule.

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
