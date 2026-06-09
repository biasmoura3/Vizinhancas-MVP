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
  ? 'Armazenamento online desativado: avise a equipe para configurar o ambiente.'
  : !normalizedSupabaseUrl
    ? 'Armazenamento online indisponivel: a URL de conexao precisa ser revisada.'
    : PLACEHOLDER_VALUES.has(normalizedAnonKey)
      ? 'Armazenamento online indisponivel: a chave de conexao precisa ser revisada.'
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
