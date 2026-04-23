/**
 * Página de redefinição de senha.
 * Acessada via link enviado por e-mail pelo Supabase (resetPasswordForEmail).
 * O Supabase já estabelece uma sessão de "recovery" automaticamente quando
 * o usuário chega aqui pelo link — basta chamar updateUser({ password }).
 */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Loader2, Wheat } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({ meta: [{ title: "Redefinir senha — SisPão Público" }] }),
  component: RedefinirSenhaPage,
});

const schema = z
  .object({
    password: z.string().min(8, "Mínimo de 8 caracteres").max(72),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "As senhas não conferem" });

type Values = z.infer<typeof schema>;

function RedefinirSenhaPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    // Quando o usuário chega pelo link, o Supabase processa o hash e dispara
    // PASSWORD_RECOVERY — confirmamos que existe sessão antes de permitir o submit.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasRecoverySession(!!session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setHasRecoverySession(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ password }: Values) => {
    setServerError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setServerError(error.message);
      return;
    }
    toast.success("Senha redefinida com sucesso");
    navigate({ to: "/app" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-7 shadow-elevated">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wheat className="size-5" />
          </div>
          <div className="text-base font-bold tracking-tight">Definir nova senha</div>
        </div>

        {!hasRecoverySession ? (
          <p className="rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning-foreground">
            Esta página deve ser aberta a partir do link enviado para seu e-mail. Se chegou aqui
            por engano, volte ao{" "}
            <Link to="/login" className="font-medium underline">
              login
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {serverError && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{serverError}</p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-medium">
                Nova senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirm" className="mb-1 block text-xs font-medium">
                Confirmar nova senha
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                {...register("confirm")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              {errors.confirm && <p className="mt-1 text-xs text-destructive">{errors.confirm.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Salvar nova senha
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
