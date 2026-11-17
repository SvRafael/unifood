import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar | Unifood" },
      { name: "description", content: "Acesse sua conta Unifood para comprar ou vender no campus." },
      { property: "og:title", content: "Entrar | Unifood" },
      { property: "og:description", content: "Acesse sua conta Unifood para comprar ou vender no campus." },
    ],
  }),
  component: Login,
});

function Login() {
  const { setUser } = useStore();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [entering, setEntering] = useState<string | null>(null);

  useEffect(() => {
    if (!entering) return;
    const t = setTimeout(() => nav({ to: "/vitrine" }), 1600);
    return () => clearTimeout(t);
  }, [entering, nav]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const email = f["email"] ?? "";
    const name = f["name"] || email.split("@")[0] || "Aluno";
    setUser({ name, email, course: f["course"], semester: f["semester"], ra: f["ra"] });
    toast.success(mode === "signup" ? "Conta criada! Bem-vindo(a) ao Unifood" : `Bem-vindo(a) de volta, ${name}!`);
    setEntering(name);
  };

  if (entering) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-hero text-primary-foreground">
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-8 animate-ping rounded-full bg-primary-foreground/20" />
          <img
            src="/assets/unifoodmobile.png"
            alt="Unifood"
            className="relative h-40 w-auto object-contain drop-shadow-xl animate-in zoom-in-50 spin-in-6 duration-700"
          />
        </div>
        <p className="mt-6 font-display text-2xl font-bold animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
          Olá, {entering.split(" ")[0]}!
        </p>
        <p className="mt-1 text-sm text-primary-foreground/80 animate-in fade-in duration-500 delay-500">
          Preparando a vitrine do campus...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <div className="rounded-3xl border bg-card p-6 shadow-card sm:p-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src="/assets/unifoodmobile.png" alt="Unifood" className="h-20 w-auto object-contain" />
          <h1 className="mt-3 flex items-center gap-2 font-display text-2xl font-bold">
            <GraduationCap className="text-primary" />
            {mode === "signup" ? "Criar conta" : "Entrar no Unifood"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Use seu e-mail institucional para continuar.</p>
        </div>

        <form onSubmit={submit} className="grid gap-3">
          {mode === "signup" && <F label="Nome completo" name="name" required />}
          <F label="E-mail institucional" name="email" type="email" required defaultValue={"aluno@univem.com.br"} placeholder="voce@universidade.edu.br" />
          <F label="Senha" name="password" type="password" defaultValue={"#rd123pp123"} required />
          {mode === "signup" && (
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted p-3">
              <p className="col-span-3 text-xs font-semibold text-muted-foreground">Contexto acadêmico (opcional)</p>
              <F label="Curso" name="course" />
              <F label="Semestre" name="semester" />
              <F label="RA" name="ra" />
            </div>
          )}
          <Button type="submit" className="mt-1 rounded-full font-bold">
            {mode === "signup" ? "Cadastrar" : "Entrar"}
          </Button>
          <button type="button" className="text-sm text-primary hover:underline" onClick={() => setMode(mode === "signup" ? "login" : "signup")}>
            {mode === "signup" ? "Já tenho conta" : "Não tem conta? Cadastre-se"}
          </button>
        </form>
      </div>
    </div>
  );
}

function F({ label, ...props }: { label: string } & React.ComponentProps<"input">) {
  return (
    <div className="grid gap-1">
      <Label htmlFor={props.name} className="text-xs">{label}</Label>
      <Input id={props.name} {...props} />
    </div>
  );
}
