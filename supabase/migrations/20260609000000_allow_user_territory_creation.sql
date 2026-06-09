drop policy if exists "Authenticated users create territories" on public.territories;
create policy "Authenticated users create territories"
on public.territories for insert
with check (auth.uid() is not null);
