import { User } from '@supabase/supabase-js';
import { INITIAL_FRAGMENTS, TERRITORIES } from '../data';
import { FragmentType, Territory, WorldFragment } from '../types';
import { ensureFixedMapPositions } from '../utils/constellationLayout';
import { supabase } from '../lib/supabase';

type FragmentRow = {
  id: string;
  title: string;
  type: FragmentType;
  source: string;
  territory_id: string;
  content: string;
  map_position_x: number | null;
  map_position_y: number | null;
  image_url: string | null;
  media_links: string[] | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

type TerritoryRow = {
  id: string;
  name: string;
  coordinates: string | null;
  created_at: string;
};

const toTerritory = (row: TerritoryRow): Territory => ({
  id: row.id,
  name: row.name,
  coordinates: row.coordinates ?? '',
  createdAt: row.created_at,
});

const toFragment = (row: FragmentRow, user: User | null): WorldFragment => ({
  id: row.id,
  title: row.title,
  type: row.type,
  source: row.source,
  territory: row.territory_id,
  content: row.content,
  mapPosition: row.map_position_x !== null && row.map_position_y !== null
    ? { x: row.map_position_x, y: row.map_position_y }
    : undefined,
  imageUrl: row.image_url ?? undefined,
  mediaLinks: (row.media_links ?? []).slice(0, 3),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  authorId: row.author_id,
  isUserCreated: Boolean(user && row.author_id === user.id),
});

const toFragmentInsert = (
  fragment: Omit<WorldFragment, 'id' | 'createdAt'>,
  id: string,
  user: User,
) => ({
  id,
  title: fragment.title,
  type: fragment.type,
  source: fragment.source,
  territory_id: fragment.territory,
  content: fragment.content,
  map_position_x: fragment.mapPosition?.x ?? null,
  map_position_y: fragment.mapPosition?.y ?? null,
  image_url: fragment.imageUrl ?? null,
  media_links: (fragment.mediaLinks ?? []).slice(0, 3),
  author_id: user.id,
});

const toFragmentUpdate = (fragment: Partial<Omit<WorldFragment, 'id' | 'createdAt'>>) => ({
  ...(fragment.title !== undefined ? { title: fragment.title } : {}),
  ...(fragment.type !== undefined ? { type: fragment.type } : {}),
  ...(fragment.source !== undefined ? { source: fragment.source } : {}),
  ...(fragment.territory !== undefined ? { territory_id: fragment.territory } : {}),
  ...(fragment.content !== undefined ? { content: fragment.content } : {}),
  ...(fragment.mapPosition !== undefined
    ? {
        map_position_x: fragment.mapPosition?.x ?? null,
        map_position_y: fragment.mapPosition?.y ?? null,
      }
    : {}),
  ...(fragment.imageUrl !== undefined ? { image_url: fragment.imageUrl ?? null } : {}),
  ...(fragment.mediaLinks !== undefined ? { media_links: fragment.mediaLinks.slice(0, 3) } : {}),
});

export const loadLocalFragments = () => {
  const saved = localStorage.getItem('situated_memories');
  if (saved) {
    try {
      return ensureFixedMapPositions(JSON.parse(saved));
    } catch (error) {
      console.error(error);
    }
  }
  return ensureFixedMapPositions(INITIAL_FRAGMENTS);
};

export const loadLocalSavedFragmentIds = () => {
  const saved = localStorage.getItem('saved_fragment_ids');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error(error);
    }
  }
  return ['alti-1', 'memb-3'];
};

export const loadRemoteTerritories = async () => {
  if (!supabase) return TERRITORIES;

  const { data, error } = await supabase
    .from('territories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(toTerritory);
};

export const loadRemoteFragments = async (user: User | null) => {
  if (!supabase) return loadLocalFragments();

  const { data, error } = await supabase
    .from('fragments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ensureFixedMapPositions((data ?? []).map((row) => toFragment(row, user)));
};

export const loadRemoteSavedFragmentIds = async (user: User | null) => {
  if (!supabase || !user) return [];

  const { data, error } = await supabase
    .from('saved_fragments')
    .select('fragment_id')
    .eq('user_id', user.id);

  if (error) throw error;
  return (data ?? []).map((row) => row.fragment_id);
};

export const createRemoteFragment = async (
  fragment: Omit<WorldFragment, 'id' | 'createdAt'>,
  id: string,
  user: User,
) => {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase
    .from('fragments')
    .insert(toFragmentInsert(fragment, id, user))
    .select('*')
    .single();

  if (error) throw error;
  return toFragment(data, user);
};

export const updateRemoteFragment = async (
  id: string,
  fragment: Partial<Omit<WorldFragment, 'id' | 'createdAt'>>,
  user: User,
) => {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase
    .from('fragments')
    .update(toFragmentUpdate(fragment))
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toFragment(data, user);
};

export const deleteRemoteFragment = async (id: string) => {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { error } = await supabase
    .from('fragments')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const saveRemoteFragment = async (fragmentId: string, user: User) => {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { error } = await supabase
    .from('saved_fragments')
    .upsert({ user_id: user.id, fragment_id: fragmentId }, { onConflict: 'user_id,fragment_id' });

  if (error) throw error;
};

export const unsaveRemoteFragment = async (fragmentId: string, user: User) => {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { error } = await supabase
    .from('saved_fragments')
    .delete()
    .eq('user_id', user.id)
    .eq('fragment_id', fragmentId);

  if (error) throw error;
};
