import { Heart, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStore, type Product } from "@/lib/store";
import { brl } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function ProductCard({ p }: { p: Product }) {
  const { favorites, toggleFavorite, addToCart } = useStore();
  const fav = favorites.includes(p.id);
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-transform hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-0.5 text-xs font-bold text-primary-deep">{p.category}</span>
        <button
          aria-label={fav ? "Remover dos favoritos" : "Favoritar"}
          onClick={() => toggleFavorite(p.id)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 transition-transform active:scale-90"
        >
          <Heart className={cn("h-5 w-5 transition-colors", fav ? "fill-secondary text-secondary" : "text-muted-foreground")} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-lg font-bold leading-tight">{p.name}</h3>
        <p className="text-xs text-muted-foreground">{p.seller}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-secondary text-secondary" /> <b className="text-foreground">{p.rating.toFixed(1)}</b> · {p.sold} vendidos
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-xl font-extrabold text-primary">{brl(p.price)}</span>
          <Button size="sm" variant="secondary" className="rounded-full font-bold" onClick={() => { addToCart(p.id); toast.success(`${p.name} na sacola!`); }}>
            <Plus /> Sacola
          </Button>
        </div>
      </div>
    </div>
  );
}
