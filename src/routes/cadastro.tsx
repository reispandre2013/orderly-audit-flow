import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Loader2, Wheat } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { isValidCPF } from "@/lib/format";

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Criar conta — SisPão Público" }] }),
  component: CadastroPage,
});

const schema = z.object({
  full_name: z.string().trim().min(3, "Informe seu nome completo").max(120),
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z
    .string()
    .min(8, "Mínimo de 8 caracteres")
    .max(72)
    .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula")
    .regex(/[0-9]/, "Inclua ao menos um número"),
  cpf: z
    .string()
    .trim()
    .refine((v) => isValidCPF(v), "CPF inválido"),
  matricula: z
    .string()
    .trim()
    .min(2, "Informe sua matrícula")
    .max(40)
    .regex(/^[A-Za-z0-9-]+$/, "Use apenas letras, números e hífen"),
  phone: z
    .string()
    .trim()
    .min(10, "Informe um telefone válido")
    .max(20)
    .regex(/^[0-9()\s+-]+$/, "Telefone inválido"),
  orgao: z.string().trim().min(2, "Informe seu órgão").max(160),
  departamento: z.string().trim().min(2, "Informe o departamento").max(120),
  equipe: z.string().trim().max(120).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

function CadastroPage() {
  const { signUp } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    const { error } = await signUp({
      ...data,
      equipe: data.equipe ?? "",
    });
    if (error) {
      setServerError(error);
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wheat className="size-5" />
          </div>
          <div className="text-lg font-bold tracking-tight">SisPão Público</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-7 shadow-elevated">
          <h1 className="text-xl font-semibold text-foreground">Criar conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Após o cadastro, um administrador do seu órgão validará seu acesso.
          </p>

          {serverError && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{serverError}</p>
            </div>
          )}

          {success ? (
            <div className="mt-6 rounded-md border border-success/30 bg-success/10 p-4 text-sm text-success-foreground">
              Conta criada. Verifique seu e-mail para confirmar e aguarde a liberação do
              administrador do órgão.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2" noValidate>
              <Field label="Nome completo" htmlFor="full_name" error={errors.full_name?.message} className="md:col-span-2">
                <input id="full_name" {...register("full_name")} className={inputCls} />
              </Field>
              <Field label="E-mail corporativo" htmlFor="email" error={errors.email?.message}>
                <input id="email" type="email" autoComplete="email" {...register("email")} className={inputCls} />
              </Field>
              <Field label="Senha" htmlFor="password" error={errors.password?.message}>
                <input id="password" type="password" autoComplete="new-password" {...register("password")} className={inputCls} />
              </Field>
              <Field label="CPF" htmlFor="cpf" error={errors.cpf?.message}>
                <input id="cpf" placeholder="000.000.000-00" {...register("cpf")} className={inputCls} />
              </Field>
              <Field label="Matrícula" htmlFor="matricula" error={errors.matricula?.message}>
                <input id="matricula" {...register("matricula")} className={inputCls} />
              </Field>
              <Field label="Telefone" htmlFor="phone" error={errors.phone?.message}>
                <input id="phone" placeholder="(00) 00000-0000" {...register("phone")} className={inputCls} />
              </Field>
              <Field label="Órgão público" htmlFor="orgao" error={errors.orgao?.message}>
                <input id="orgao" placeholder="Ex.: Secretaria de Educação" {...register("orgao")} className={inputCls} />
              </Field>
              <Field label="Departamento" htmlFor="departamento" error={errors.departamento?.message}>
                <input id="departamento" {...register("departamento")} className={inputCls} />
              </Field>
              <Field label="Equipe (opcional)" htmlFor="equipe" error={errors.equipe?.message}>
                <input id="equipe" {...register("equipe")} className={inputCls} />
              </Field>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-shadow hover:shadow-elevated disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  Criar conta
                </button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Já tem conta?{" "}
                  <Link to="/login" className="font-medium text-primary hover:underline">
                    Entrar
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40";

function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
