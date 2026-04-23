/**
 * Cliente Supabase singleton.
 *
 * Lê as credenciais de `import.meta.env` (definidas em `.env` na raiz).
 * As variáveis VITE_* são EMBUTIDAS no bundle do navegador no build — o anon key
 * é PÚBLICO por design e seguro para expor no frontend (a segurança real é feita
 * pelas RLS policies do Postgres).
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Falha cedo, com mensagem clara, durante o desenvolvimento.
  throw new Error(
    "[supabase] VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY precisam estar definidos no .env",
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "sispao.supabase.auth",
  },
});
