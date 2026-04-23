import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Loader2, Wheat } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({ meta: [{ title: "Recuperar senha — SisPão Público" }] }),
  component: RecuperarSenhaPage,
});

const schema = z.object({ email: z.string().trim().email("E-mail inválido").max(255) });
type Values = z.infer<typeof schema>;

function RecuperarSenhaPage() {
  const { resetPassword } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }: Values) => {
    setServerError(null);
    const { error } = await resetPassword(email);
    if (error) {
      setServerError(error);
      return;
    }
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-7 shadow-elevated">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wheat className="size-5" />
          </div>
          <div className="text-base font-bold tracking-tight">Recuperar senha</div>
        </div>

        {sent ? (
          <p className="rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success-foreground">
            Se este e-mail estiver cadastrado, enviamos um link para redefinir sua senha.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <p className="text-sm text-muted-foreground">
              Informe o e-mail vinculado à sua conta. Enviaremos um link para redefinir sua senha.
            </p>

            {serverError && (
              <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{serverError}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-medium">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Enviar link
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-xs text-muted-foreground">
          <Link to="/login" className="font-medium text-primary hover:underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}
