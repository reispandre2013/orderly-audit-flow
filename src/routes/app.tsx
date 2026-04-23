import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { useAuth } from "@/lib/auth/auth-context";
import { Wheat } from "lucide-react";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Wheat className="size-5 animate-pulse text-primary" />
          <span className="text-sm">Carregando sessão…</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <UnauthenticatedFallback />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function UnauthenticatedFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-elevated">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Wheat className="size-6" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Sessão necessária</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Você precisa entrar para acessar o sistema. A autenticação real será habilitada após
          conectar o Supabase.
        </p>
        <a
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ir para o login
        </a>
      </div>
    </div>
  );
}
