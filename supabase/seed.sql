insert into public.territories (id, name, coordinates)
values
  ('Setor 4', 'Territorio das Alturas (Setor 4)', '19.4324 S, 69.2154 W'),
  ('Setor 7G', 'Selvageria Urbana (Setor 7G)', '23.5505 S, 46.6333 W'),
  ('Setor 2A', 'Margens do Igapo (Setor 2A)', '3.0722 S, 60.0125 W'),
  ('Setor 9N', 'Aluvioes do Vale Central (Setor 9N)', '33.4489 S, 70.6693 W')
on conflict (id) do update
set name = excluded.name,
    coordinates = excluded.coordinates;
