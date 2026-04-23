/**
 * Contexto de autenticação — conectado ao Supabase.
 *
 * Modelo de dados esperado no Postgres (a ser criado via migrations no Cursor):
 *   - public.profiles  (id uuid PK = auth.users.id, full_name, email, cpf, ...)
 *   - public.user_roles (user_id uuid FK auth.users.id, role app_role)
 *   - enum public.app_role (ver src/lib/domain/roles.ts)
 *   - função public.has_role(_user_id uuid, _role app_role) SECURITY DEFINER
 *
 * Enquanto o schema não existe no banco, signIn funciona mas o perfil/roles
 * vêm vazios — a UI mostra mensagens apropriadas.
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import type { AppRole } from "@/lib/domain/roles";
import type { UserWithRoles } from "@/lib/domain/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface SignUpData {
  full_name: string;
  email: string;
  password: string;
  cpf: string;
  matricula: string;
  phone: string;
  orgao: string;
  departamento: string;
  equipe: string;
}

interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  user: UserWithRoles | null;
  /** Role primária do usuário (a primeira da lista). UI pode permitir trocar. */
  activeRole: AppRole | null;
  setActiveRole: (role: AppRole) => void;
  hasRole: (role: AppRole) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ACTIVE_ROLE_KEY = "sispao.activeRole.v1";

/**
 * Carrega o perfil + roles do usuário a partir das tabelas `profiles` e `user_roles`.
 * Se as tabelas ainda não existem, devolve null sem quebrar a UI.
 */
async function loadUserWithRoles(userId: string, fallbackEmail: string): Promise<UserWithRoles | null> {
  const [{ data: profile, error: profileErr }, { data: rolesData, error: rolesErr }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);

  // Tabelas ainda não existem — não bloqueia a sessão, apenas avisa.
  if (profileErr || rolesErr) {
    if (import.meta.env.DEV) {
      console.warn("[auth] tabelas profiles/user_roles ainda não existem no Supabase", {
        profileErr,
        rolesErr,
      });
    }
    return {
      id: userId,
      full_name: fallbackEmail,
      email: fallbackEmail,
      cpf: "",
      matricula: "",
      phone: null,
      orgao_id: null,
      fornecedor_id: null,
      departamento: null,
      equipe: null,
      active: true,
      created_at: new Date().toISOString(),
      roles: [],
    };
  }

  if (!profile) return null;

  return {
    ...(profile as Omit<UserWithRoles, "roles">),
    roles: (rolesData ?? []).map((r) => r.role as AppRole),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [activeRole, setActiveRoleState] = useState<AppRole | null>(null);

  useEffect(() => {
    // 1) Listener PRIMEIRO (antes do getSession, para não perder o evento inicial).
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // Defer para evitar deadlocks dentro do callback.
        setTimeout(async () => {
          const userWithRoles = await loadUserWithRoles(newSession.user.id, newSession.user.email ?? "");
          setUser(userWithRoles);
          if (userWithRoles?.roles.length) {
            const stored = typeof window !== "undefined" ? window.localStorage.getItem(ACTIVE_ROLE_KEY) : null;
            const next = stored && userWithRoles.roles.includes(stored as AppRole)
              ? (stored as AppRole)
              : userWithRoles.roles[0];
            setActiveRoleState(next);
          } else {
            setActiveRoleState(null);
          }
          setStatus("authenticated");
        }, 0);
      } else {
        setUser(null);
        setActiveRoleState(null);
        setStatus("unauthenticated");
      }
    });

    // 2) Verifica sessão existente.
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      if (!existing) {
        setStatus("unauthenticated");
      }
      // Se houver sessão, o onAuthStateChange acima cuidará do resto via INITIAL_SESSION.
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const setActiveRole = (role: AppRole) => {
    if (!user || !user.roles.includes(role)) return;
    setActiveRoleState(role);
    if (typeof window !== "undefined") window.localStorage.setItem(ACTIVE_ROLE_KEY, role);
  };

  const hasRole = (role: AppRole) => user?.roles.includes(role) ?? false;
  const hasAnyRole = (roles: AppRole[]) => !!user && roles.some((r) => user.roles.includes(r));

  const signIn: AuthContextValue["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp: AuthContextValue["signUp"] = async (data) => {
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/app` : undefined;
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectTo,
        // Estes campos vão para auth.users.raw_user_meta_data — um trigger no Postgres
        // (a criar via migration) deve copiá-los para public.profiles.
        data: {
          full_name: data.full_name,
          cpf: data.cpf,
          matricula: data.matricula,
          phone: data.phone,
          orgao: data.orgao,
          departamento: data.departamento,
          equipe: data.equipe,
        },
      },
    });
    return { error: error?.message ?? null };
  };

  const resetPassword: AuthContextValue["resetPassword"] = async (email) => {
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/redefinir-senha` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") window.localStorage.removeItem(ACTIVE_ROLE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        status,
        session,
        user,
        activeRole,
        setActiveRole,
        hasRole,
        hasAnyRole,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
