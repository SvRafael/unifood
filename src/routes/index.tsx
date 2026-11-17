import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, ShoppingBag, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unifood — Marketplace universitário" },
      { name: "description", content: "O marketplace dos alunos empreendedores do seu campus. Entre para comprar ou vender lanches, doces e marmitas." },
      { property: "og:title", content: "Unifood — Marketplace universitário" },
      { property: "og:description", content: "O marketplace dos alunos empreendedores do seu campus." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center text-center">
      <div className="relative mb-6 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute -inset-6 rounded-full bg-secondary/20 blur-2xl" />
        <img src="/assets/unifoodmobile.png" alt="Unifood" className="relative h-36 w-auto object-contain drop-shadow-md sm:h-44" />
      </div>

      <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--primary-deep)] sm:text-5xl animate-in fade-in slide-in-from-bottom-2 duration-500">
        Uni<span className="text-secondary">food</span>
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
        O marketplace dos alunos empreendedores do seu campus. Bolos, doces, salgados e marmitas feitos por quem estuda com você.
      </p>

      <div className="mt-8 flex w-full max-w-xs flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
        <Button asChild size="lg" className="rounded-full text-base font-bold shadow-card">
          <Link to="/login">
            Entrar / Começar <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 animate-in fade-in duration-700 delay-300">
        {[
          { icon: Store, t: "Vitrine do campus", d: "Produtos feitos por alunos vendedores" },
          { icon: ShoppingBag, t: "Pedido fácil", d: "Retire no bloco ou receba na sala" },
          { icon: GraduationCap, t: "Renda de aluno", d: "Venda e fature entre uma aula e outra" },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-2xl border bg-card p-4 text-left shadow-card">
            <Icon className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-bold">{t}</p>
            <p className="text-xs text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
