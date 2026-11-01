import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, useStore, type Category } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitrine | Unifood" },
      { name: "description", content: "Bolos, doces, salgados e marmitas feitos por alunos do campus. Busque, favorite e peça." },
      { property: "og:title", content: "Vitrine | Unifood" },
      { property: "og:description", content: "Bolos, doces, salgados e marmitas feitos por alunos do campus." },
    ],
  }),
  component: Index,
});

type Sort = "relevance" | "price" | "sold";

function Index() {
  const { products } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "Todos">("Todos");
  const [sort, setSort] = useState<Sort>("relevance");

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const r = products.filter((p) => (cat === "Todos" || p.category === cat) && (!t || p.name.toLowerCase().includes(t) || p.seller.toLowerCase().includes(t)));
    if (sort === "price") return [...r].sort((a, b) => a.price - b.price);
    if (sort === "sold") return [...r].sort((a, b) => b.sold - a.sold);
    return r;
  }, [products, q, cat, sort]);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-hero p-6 text-primary-foreground sm:p-10">
        <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-bold"><Sparkles className="h-3.5 w-3.5" /> Cupom calouro: UNICALOURO10</p>
        <h1 className="max-w-xl text-3xl font-extrabold leading-tight sm:text-5xl">O lanche do intervalo, feito por quem estuda com você.</h1>
        <div className="relative mt-6 max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por item ou vendedor..." className="h-12 rounded-full border-0 bg-card pl-11 text-base text-foreground" />
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {(["Todos", ...CATEGORIES] as const).map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={cn("shrink-0 rounded-full border px-4 py-1.5 text-sm font-bold transition-colors", cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary hover:text-primary")}>
              {c}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-9 rounded-full border bg-card px-3 text-sm font-semibold">
          <option value="relevance">Relevância</option>
          <option value="price">Menor preço</option>
          <option value="sold">Mais vendidos</option>
        </select>
      </div>

      {list.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      ) : (
        <p className="py-16 text-center text-muted-foreground">Nenhum item encontrado. Tente outra busca.</p>
      )}
    </div>
  );
}
