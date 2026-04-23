/**
 * Contexto de autenticação.
 *
 * IMPORTANTE: a implementação atual usa um placeholder local (sem persistência
 * real) APENAS para permitir que o frontend seja construído antes da conexão
 * com Supabase. A API exposta (signIn, signUp, signOut, resetPassword) é a
 * definitiva — quando o Supabase for conectado, apenas a implementação interna
 * deste arquivo é trocada por chamadas a `supabase.auth.*`.
 *
 * NÃO usar este contexto para decisões de segurança no servidor — RLS no
 * Postgres é a fonte de verdade.
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
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

const STORAGE_KEY = "sispao.session.v1";

interface StoredSession {
  user: UserWithRoles;
  activeRole: AppRole;
}

function loadSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

function saveSession(session: StoredSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [activeRole, setActiveRoleState] = useState<AppRole | null>(null);

  useEffect(() => {
    const stored = loadSession();
    if (stored) {
      setUser(stored.user);
      setActiveRoleState(stored.activeRole);
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const setActiveRole = (role: AppRole) => {
    if (!user || !user.roles.includes(role)) return;
    setActiveRoleState(role);
    saveSession({ user, activeRole: role });
  };

  const hasRole = (role: AppRole) => user?.roles.includes(role) ?? false;
  const hasAnyRole = (roles: AppRole[]) => !!user && roles.some((r) => user.roles.includes(r));

  /**
   * Placeholder de signIn — a regra REAL ficará no Supabase.
   * Aqui apenas valida formato e emite um aviso visual. Não há base de usuários.
   */
  const signIn: AuthContextValue["signIn"] = async () => {
    return { error: "Autenticação ainda não está conectada. Habilite o Lovable Cloud ou conecte seu Supabase para ativar o login real." };
  };

  const signUp: AuthContextValue["signUp"] = async () => {
    return { error: "Cadastro ainda não está conectado. Habilite o Lovable Cloud ou conecte seu Supabase para ativar." };
  };

  const resetPassword: AuthContextValue["resetPassword"] = async () => {
    return { error: "Recuperação de senha será habilitada após conectar o backend." };
  };

  const signOut = async () => {
    saveSession(null);
    setUser(null);
    setActiveRoleState(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider
      value={{
        status,
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
