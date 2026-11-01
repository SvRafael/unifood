import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Heart, LayoutDashboard, LogOut, ShoppingBag, Store, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStore, type Role } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { role, setRole, cart, favorites, user, setUser } = useStore();
  const nav = useNavigate();
  const [auth, setAuth] = useState<null | "login" | "signup">(null);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  const switchRole = (r: Role) => {
    setRole(r);
    nav({ to: r === "seller" ? "/vendedor" : "/" });
    toast(r === "seller" ? "Modo Vendedor ativado" : "Modo Comprador ativado");
  };

  const linkCls = "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground";
  const active = { className: "bg-accent text-accent-foreground" };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-1.5 text-xs">
          <span className="hidden sm:inline">Modo demonstração · TCC</span>
          <div className="flex rounded-full bg-primary-foreground/15 p-0.5">
            {(["buyer", "seller"] as Role[]).map((r) => (
              <button key={r} onClick={() => switchRole(r)}
                className={cn("rounded-full px-3 py-1 font-bold transition-colors", role === r ? "bg-secondary text-secondary-foreground" : "text-primary-foreground/80")}>
                {r === "buyer" ? "Aluno Comprador" : "Aluno Vendedor"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
        <Link to="/" className="mr-auto flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-hero text-primary-foreground"><UtensilsCrossed className="h-5 w-5" /></span>
          <span className="font-display text-2xl font-extrabold text-primary-deep">Uni<span className="text-secondary">food</span></span>
        </Link>
        {role === "buyer" ? (
          <nav className="flex items-center gap-1">
            <Link to="/" className={cn(linkCls, "hidden sm:flex")} activeProps={active} activeOptions={{ exact: true }}><Store className="h-4 w-4" />Vitrine</Link>
            <Link to="/favoritos" className={linkCls} activeProps={active} aria-label="Favoritos">
              <Heart className="h-4 w-4" /><span className="hidden sm:inline">Favoritos</span>
              {favorites.length > 0 && <span className="rounded-full bg-secondary px-1.5 text-xs text-secondary-foreground">{favorites.length}</span>}
            </Link>
            <Link to="/sacola" className={linkCls} activeProps={active} aria-label="Sacola">
              <ShoppingBag className="h-4 w-4" /><span className="hidden sm:inline">Sacola</span>
              {count > 0 && <span className="rounded-full bg-secondary px-1.5 text-xs text-secondary-foreground">{count}</span>}
            </Link>
          </nav>
        ) : (
          <Link to="/vendedor" className={linkCls} activeProps={active}><LayoutDashboard className="h-4 w-4" />Painel</Link>
        )}
        {user ? (
          <div className="flex items-center gap-1">
            <span className="hidden text-sm font-semibold md:inline">Olá, {user.name.split(" ")[0]}</span>
            <Button size="icon" variant="ghost" aria-label="Sair" onClick={() => { setUser(null); toast("Você saiu"); }}><LogOut /></Button>
          </div>
        ) : (
          <Button size="sm" className="rounded-full" onClick={() => setAuth("login")}>Entrar</Button>
        )}
      </div>
      <AuthDialog mode={auth} setMode={setAuth} />
    </header>
  );
}

function AuthDialog({ mode, setMode }: { mode: null | "login" | "signup"; setMode: (m: null | "login" | "signup") => void }) {
  const { setUser } = useStore();
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const name = f.name || f.email.split("@")[0];
    setUser({ name, email: f.email, course: f.course, semester: f.semester, ra: f.ra });
    toast.success(mode === "signup" ? "Conta criada! Bem-vindo(a) ao Unifood" : `Bem-vindo(a) de volta, ${name}!`);
    setMode(null);
  };
  return (
    <Dialog open={!!mode} onOpenChange={(o) => !o && setMode(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-2xl"><GraduationCap className="text-primary" />{mode === "signup" ? "Criar conta" : "Entrar"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          {mode === "signup" && <F label="Nome completo" name="name" required />}
          <F label="E-mail institucional" name="email" type="email" required placeholder="voce@universidade.edu.br" />
          <F label="Senha" name="password" type="password" required />
          {mode === "signup" && (
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted p-3">
              <p className="col-span-3 text-xs font-semibold text-muted-foreground">Contexto acadêmico (opcional)</p>
              <F label="Curso" name="course" /><F label="Semestre" name="semester" /><F label="RA" name="ra" />
            </div>
          )}
          <Button type="submit" className="mt-1 rounded-full">{mode === "signup" ? "Cadastrar" : "Entrar"}</Button>
          <button type="button" className="text-sm text-primary hover:underline" onClick={() => setMode(mode === "signup" ? "login" : "signup")}>
            {mode === "signup" ? "Já tenho conta" : "Não tem conta? Cadastre-se"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
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
