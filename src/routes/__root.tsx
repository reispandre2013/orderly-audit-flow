import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SisPão Público — Gestão de pedidos para órgãos públicos" },
      {
        name: "description",
        content:
          "Plataforma enterprise para gestão de pedidos de panificação entre órgãos públicos e fornecedores, com rastreabilidade total e auditoria.",
      },
      { name: "author", content: "SisPão Público" },
      { property: "og:title", content: "SisPão Público — Gestão de pedidos para órgãos públicos" },
      {
        property: "og:description",
        content: "Gestão rastreável de pedidos entre órgãos públicos e fornecedores.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "SisPão Público — Gestão de pedidos para órgãos públicos" },
      { name: "description", content: "Order Guardian is a SaaS platform for public sector procurement of bakery goods, ensuring end-to-end traceability and multi-company management." },
      { property: "og:description", content: "Order Guardian is a SaaS platform for public sector procurement of bakery goods, ensuring end-to-end traceability and multi-company management." },
      { name: "twitter:description", content: "Order Guardian is a SaaS platform for public sector procurement of bakery goods, ensuring end-to-end traceability and multi-company management." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/de41b84a-3ae5-479f-9ca1-79d038ac55e9/id-preview-c57aadae--e40b0831-9d79-4215-b559-814a5bf75357.lovable.app-1776976470673.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/de41b84a-3ae5-479f-9ca1-79d038ac55e9/id-preview-c57aadae--e40b0831-9d79-4215-b559-814a5bf75357.lovable.app-1776976470673.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}
