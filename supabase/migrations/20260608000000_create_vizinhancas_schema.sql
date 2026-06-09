create extension if not exists pgcrypto;

do $$
begin
  create type public.fragment_type as enum ('audio', 'poetic', 'visual');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Ouvinte Atento',
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.territories (
  id text primary key,
  name text not null,
  coordinates text,
  created_at timestamptz not null default now()
);

create table if not exists public.fragments (
  id text primary key,
  title text not null,
  type public.fragment_type not null,
  source text not null,
  territory_id text not null references public.territories(id),
  content text not null,
  map_position_x numeric,
  map_position_y numeric,
  image_url text,
  media_links text[] not null default array[]::text[],
  is_open_to_connections boolean not null default false,
  connected_fragment_ids text[] not null default array[]::text[],
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fragments_media_links_max_3 check (cardinality(media_links) <= 3),
  constraint fragments_connected_fragment_ids_max_5 check (cardinality(connected_fragment_ids) <= 5)
);

create table if not exists public.saved_fragments (
  user_id uuid not null references auth.users(id) on delete cascade,
  fragment_id text not null references public.fragments(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, fragment_id)
);

drop trigger if exists fragments_set_updated_at on public.fragments;
create trigger fragments_set_updated_at
before update on public.fragments
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), 'Ouvinte Atento'),
    coalesce(new.email, '')
  )
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.territories enable row level security;
alter table public.fragments enable row level security;
alter table public.saved_fragments enable row level security;

drop policy if exists "Profiles are readable" on public.profiles;
create policy "Profiles are readable"
on public.profiles for select
using (true);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Territories are readable" on public.territories;
create policy "Territories are readable"
on public.territories for select
using (true);

drop policy if exists "Admins manage territories" on public.territories;
create policy "Admins manage territories"
on public.territories for all
using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

drop policy if exists "Fragments are readable" on public.fragments;
create policy "Fragments are readable"
on public.fragments for select
using (true);

drop policy if exists "Authenticated users create own fragments" on public.fragments;
create policy "Authenticated users create own fragments"
on public.fragments for insert
with check (auth.uid() is not null and author_id = auth.uid());

drop policy if exists "Authors update own fragments" on public.fragments;
create policy "Authors update own fragments"
on public.fragments for update
using (author_id = auth.uid())
with check (author_id = auth.uid());

drop policy if exists "Authors delete own fragments" on public.fragments;
create policy "Authors delete own fragments"
on public.fragments for delete
using (author_id = auth.uid());

drop policy if exists "Users read own saved fragments" on public.saved_fragments;
create policy "Users read own saved fragments"
on public.saved_fragments for select
using (user_id = auth.uid());

drop policy if exists "Users save own fragments" on public.saved_fragments;
create policy "Users save own fragments"
on public.saved_fragments for insert
with check (user_id = auth.uid());

drop policy if exists "Users remove own saved fragments" on public.saved_fragments;
create policy "Users remove own saved fragments"
on public.saved_fragments for delete
using (user_id = auth.uid());

drop policy if exists "Users update own saved fragments" on public.saved_fragments;
create policy "Users update own saved fragments"
on public.saved_fragments for update
using (user_id = auth.uid())
with check (user_id = auth.uid());
