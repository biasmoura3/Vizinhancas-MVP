import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const PLACEHOLDER_VALUES = new Set([
  'https://YOUR_PROJECT.supabase.co',
  'YOUR_SUPABASE_ANON_KEY',
]);

const normalizeSupabaseUrl = (url: string | undefined) => {
  if (!url || PLACEHOLDER_VALUES.has(url.trim())) return null;

  try {
    const parsedUrl = new URL(url.trim());
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) return null;

    return parsedUrl.origin;
  } catch {
    return null;
  }
};

const normalizedSupabaseUrl = normalizeSupabaseUrl(supabaseUrl);
const normalizedAnonKey = supabaseAnonKey?.trim();

export const supabaseConfigError = !supabaseUrl || !normalizedAnonKey
  ? 'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ativar cadastro e entrada com senha.'
  : !normalizedSupabaseUrl
    ? 'VITE_SUPABASE_URL precisa ser a URL do projeto Supabase, comecando com https://.'
    : PLACEHOLDER_VALUES.has(normalizedAnonKey)
      ? 'Substitua VITE_SUPABASE_ANON_KEY pela chave anon publica do projeto Supabase.'
      : null;

export const isSupabaseConfigured = !supabaseConfigError;

export const supabase = isSupabaseConfigured
  ? createClient(normalizedSupabaseUrl!, normalizedAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
