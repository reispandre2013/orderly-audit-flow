import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Wheat, FileSignature, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SisPão Público — Plataforma de gestão de pedidos para órgãos públicos" },
      {
        name: "description",
        content:
          "Sistema enterprise para gestão rastreável de pedidos de panificação entre órgãos públicos e fornecedores. CPF, matrícula, auditoria e dossiê completo de cada ordem.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wheat className="size-5" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">SisPão Público</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Gestão de abastecimento
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Criar conta <ArrowRight className="size-4" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              Rastreabilidade ponta a ponta
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Gestão de pedidos de panificação para o setor público,{" "}
              <span className="text-primary">com auditoria de verdade</span>.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground">
              Da solicitação ao recebimento: CPF, matrícula, IP, dispositivo, aprovação assinada
              e dossiê completo de cada ordem de compra. Multi-órgão, multi-fornecedor, com
              segregação de acesso por perfil.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/cadastro"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-shadow hover:shadow-elevated"
              >
                Solicitar acesso <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Já tenho conta
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FeatureCard
              icon={ShieldCheck}
              title="Auditoria global"
              description="Toda ação crítica registra ator, IP, dispositivo e diff."
            />
            <FeatureCard
              icon={FileSignature}
              title="Aprovação assinada"
              description="Coordenadores aprovam e assinam digitalmente cada ordem."
            />
            <FeatureCard
              icon={BarChart3}
              title="Dashboards por perfil"
              description="Visão operacional dedicada para cada papel do sistema."
            />
            <FeatureCard
              icon={Wheat}
              title="Catálogo do fornecedor"
              description="Produtos isolados por fornecedor, estoque e lote."
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SisPão Público — Plataforma para gestão pública.
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 inline-flex rounded-lg bg-primary-soft p-2 text-primary">
        <Icon className="size-5" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
