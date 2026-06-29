create or replace function public.admin_click_analytics(p_start_at timestamptz)
returns table (
  group_type text,
  group_key text,
  label text,
  click_count bigint,
  last_clicked_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  with scoped_clicks as (
    select
      ce.affiliate_link_id,
      ce.clicked_at,
      ce.metadata,
      coalesce(nullif(ce.metadata ->> 'placement', ''), 'unknown') as placement_key,
      coalesce(
        nullif(ce.metadata ->> 'placement', ''),
        'Unknown placement'
      ) as placement_label,
      ce.source,
      coalesce(
        nullif(ce.metadata ->> 'source_page', ''),
        nullif(ce.source, ''),
        'unknown'
      ) as source_key,
      case
        when nullif(ce.metadata ->> 'source_type', '') is null then
          coalesce(
            nullif(ce.metadata ->> 'source_page', ''),
            nullif(ce.source, ''),
            'Unknown source'
          )
        else
          coalesce(
            nullif(ce.metadata ->> 'source_page', ''),
            nullif(ce.source, ''),
            'Unknown source'
          ) || ' · ' || (ce.metadata ->> 'source_type')
      end as source_label,
      ce.tool_id
    from public.click_events ce
    where ce.clicked_at >= p_start_at
      and public.has_admin_role()
  ),
  overview as (
    select
      'overview'::text as group_type,
      'total'::text as group_key,
      'Total clicks'::text as label,
      count(*)::bigint as click_count,
      max(clicked_at) as last_clicked_at
    from scoped_clicks
  ),
  by_tool as (
    select
      'tool'::text as group_type,
      coalesce(sc.tool_id::text, 'unassigned') as group_key,
      coalesce(t.name, 'Unassigned tool') as label,
      count(*)::bigint as click_count,
      max(sc.clicked_at) as last_clicked_at
    from scoped_clicks sc
    left join public.tools t on t.id = sc.tool_id
    group by sc.tool_id, t.name
  ),
  by_source_page as (
    select
      'source_page'::text as group_type,
      sc.source_key as group_key,
      sc.source_label as label,
      count(*)::bigint as click_count,
      max(sc.clicked_at) as last_clicked_at
    from scoped_clicks sc
    group by sc.source_key, sc.source_label
  ),
  by_placement as (
    select
      'placement'::text as group_type,
      sc.placement_key as group_key,
      sc.placement_label as label,
      count(*)::bigint as click_count,
      max(sc.clicked_at) as last_clicked_at
    from scoped_clicks sc
    group by sc.placement_key, sc.placement_label
  )
  select * from overview
  union all
  select * from by_tool
  union all
  select * from by_source_page
  union all
  select * from by_placement
  order by group_type, click_count desc, label asc;
$$;

grant execute on function public.admin_click_analytics(timestamptz) to authenticated;
