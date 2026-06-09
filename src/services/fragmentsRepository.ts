import { User } from '@supabase/supabase-js';
import { TERRITORIES } from '../data';
import { FragmentType, Territory, WorldFragment } from '../types';
import { ensureFixedMapPositions } from '../utils/constellationLayout';
import { sanitizeFragmentConnections } from '../utils/fragmentConnections';
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
  is_open_to_connections: boolean | null;
  connected_fragment_ids: string[] | null;
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

const TERRITORIES_STORAGE_KEY = 'vizinhancas_territories';

const isLocalUserFragment = (fragment: WorldFragment) => {
  return Boolean(fragment.authorId) || /^frag-\d+$/.test(fragment.id);
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
  isOpenToConnections: row.is_open_to_connections ?? false,
  connectedFragmentIds: (row.connected_fragment_ids ?? []).slice(0, 5),
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
  is_open_to_connections: fragment.isOpenToConnections ?? false,
  connected_fragment_ids: (fragment.connectedFragmentIds ?? []).slice(0, 5),
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
  ...(fragment.isOpenToConnections !== undefined ? { is_open_to_connections: fragment.isOpenToConnections } : {}),
  ...(fragment.connectedFragmentIds !== undefined ? { connected_fragment_ids: fragment.connectedFragmentIds.slice(0, 5) } : {}),
});

export const loadLocalFragments = () => {
  const saved = localStorage.getItem('situated_memories');
  if (saved) {
    try {
      const fragments = JSON.parse(saved) as WorldFragment[];
      return sanitizeFragmentConnections(ensureFixedMapPositions(fragments.filter(isLocalUserFragment)));
    } catch (error) {
      console.error(error);
    }
  }
  return [];
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
  return [];
};

export const loadLocalTerritories = () => {
  const saved = localStorage.getItem(TERRITORIES_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error(error);
    }
  }
  return TERRITORIES;
};

export const saveLocalTerritories = (territories: Territory[]) => {
  localStorage.setItem(TERRITORIES_STORAGE_KEY, JSON.stringify(territories));
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

export const createRemoteTerritory = async (territory: Territory) => {
  if (!supabase) throw new Error('Armazenamento online nao configurado.');

  const { data: existingTerritory, error: selectError } = await supabase
    .from('territories')
    .select('*')
    .eq('id', territory.id)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existingTerritory) return toTerritory(existingTerritory);

  const { data, error } = await supabase
    .from('territories')
    .insert({
      id: territory.id,
      name: territory.name,
      coordinates: territory.coordinates || null,
    })
    .select('*')
    .single();

  if (error?.code === '23505') {
    const { data: repeatedTerritory, error: repeatedSelectError } = await supabase
      .from('territories')
      .select('*')
      .eq('id', territory.id)
      .single();

    if (repeatedSelectError) throw repeatedSelectError;
    return toTerritory(repeatedTerritory);
  }

  if (error) throw error;
  return toTerritory(data);
};

export const loadRemoteFragments = async (user: User | null) => {
  if (!supabase) return loadLocalFragments();

  const { data, error } = await supabase
    .from('fragments')
    .select('*')
    .not('author_id', 'is', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return sanitizeFragmentConnections(ensureFixedMapPositions((data ?? []).map((row) => toFragment(row, user))));
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
  if (!supabase) throw new Error('Armazenamento online nao configurado.');

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
  if (!supabase) throw new Error('Armazenamento online nao configurado.');

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
  if (!supabase) throw new Error('Armazenamento online nao configurado.');

  const { error } = await supabase
    .from('fragments')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const saveRemoteFragment = async (fragmentId: string, user: User) => {
  if (!supabase) throw new Error('Armazenamento online nao configurado.');

  const { error } = await supabase
    .from('saved_fragments')
    .upsert({ user_id: user.id, fragment_id: fragmentId }, { onConflict: 'user_id,fragment_id' });

  if (error) throw error;
};

export const unsaveRemoteFragment = async (fragmentId: string, user: User) => {
  if (!supabase) throw new Error('Armazenamento online nao configurado.');

  const { error } = await supabase
    .from('saved_fragments')
    .delete()
    .eq('user_id', user.id)
    .eq('fragment_id', fragmentId);

  if (error) throw error;
};
