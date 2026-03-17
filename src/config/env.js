// Variáveis de ambiente — lê do Vite (produção/Vercel) ou de window globals (fallback dev)
export function getEnv() {
  const SUPABASE_URL =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof window !== 'undefined' && window.SUPABASE_URL) ||
    ''

  const SUPABASE_ANON_KEY =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY) ||
    ''

  const ADMIN_SENHA =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_SENHA) ||
    (typeof window !== 'undefined' && window.ADMIN_SENHA) ||
    'admin123'

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas.')
  }

  return { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_SENHA }
}
