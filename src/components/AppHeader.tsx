import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, LayoutDashboard, LogOut, ShoppingBag, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStore, type Role } from "@/lib/store";
import { cn } from "@/lib/utils";
import logoImg from "../../public/assets/logo.png";

export function AppHeader() {
  const { role, setRole, cart, favorites, user, setUser } = useStore();
  const nav = useNavigate();
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  const switchRole = (r: Role) => {
    setRole(r);
    nav({ to: r === "seller" ? "/vendedor" : "/vitrine" });
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
        <Link to="/vitrine" className="mr-auto flex items-center gap-2">
          <img src={logoImg} className="h-8 md:h-10 w-auto object-contain" />
        </Link>
        {role === "buyer" ? (
          <nav className="flex items-center gap-1">
            <Link to="/vitrine" className={cn(linkCls, "hidden sm:flex")} activeProps={active}><Store className="h-4 w-4" />Vitrine</Link>
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
            <Button size="icon" variant="ghost" aria-label="Sair" onClick={() => { setUser(null); nav({ to: "/" }); toast("Você saiu"); }}><LogOut /></Button>
          </div>
        ) : (
          <Button size="sm" className="rounded-full" onClick={() => nav({ to: "/login" })}>Entrar</Button>
        )}
      </div>
    </header>
  );
}
