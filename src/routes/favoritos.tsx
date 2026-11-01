import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Meus favoritos | Unifood" },
      { name: "description", content: "Os lanches e doces que você salvou no Unifood." },
      { property: "og:title", content: "Meus favoritos | Unifood" },
      { property: "og:description", content: "Os lanches e doces que você salvou no Unifood." },
    ],
  }),
  component: Favorites,
});

function Favorites() {
  const { products, favorites } = useStore();
  const list = products.filter((p) => favorites.includes(p.id));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Meus favoritos</h1>
      {list.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      ) : (
        <div className="grid place-items-center gap-3 rounded-3xl border border-dashed bg-card py-16 text-center">
          <Heart className="h-10 w-10 text-secondary" />
          <p className="text-muted-foreground">Toque no coração de um produto para salvá-lo aqui.</p>
          <Button asChild className="rounded-full"><Link to="/">Explorar vitrine</Link></Button>
        </div>
      )}
    </div>
  );
}
