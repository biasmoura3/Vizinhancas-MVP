update public.fragments
set
  is_open_to_connections = true,
  connected_fragment_ids = case id
    when 'alti-1' then array['poet-2', 'memb-3']::text[]
    when 'poet-2' then array['alti-1']::text[]
    when 'memb-3' then array['alti-1']::text[]
    when 'flor-5' then array['linc-7']::text[]
    when 'linc-7' then array['flor-5']::text[]
    else connected_fragment_ids
  end
where id in ('alti-1', 'poet-2', 'memb-3', 'mang-4', 'flor-5', 'vale-6', 'linc-7', 'vento-8')
  and cardinality(connected_fragment_ids) = 0;
