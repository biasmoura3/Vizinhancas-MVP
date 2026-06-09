alter table public.fragments
add column if not exists is_open_to_connections boolean not null default false;

alter table public.fragments
add column if not exists connected_fragment_ids text[] not null default array[]::text[];

do $$
begin
  alter table public.fragments
  add constraint fragments_connected_fragment_ids_max_5
  check (cardinality(connected_fragment_ids) <= 5);
exception
  when duplicate_object then null;
end $$;
