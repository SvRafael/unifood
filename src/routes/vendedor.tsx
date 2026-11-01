import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DollarSign, ImagePlus, Package, Plus, Receipt, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES, SELLER_NAME, useStore, type Category, type OrderStatus } from "@/lib/store";
import { brl } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vendedor")({
  head: () => ({
    meta: [
      { title: "Painel do vendedor | Unifood" },
      { name: "description", content: "Acompanhe vendas, pedidos e cadastre produtos no seu negócio universitário." },
      { property: "og:title", content: "Painel do vendedor | Unifood" },
      { property: "og:description", content: "Vendas, pedidos e catálogo do aluno empreendedor." },
    ],
  }),
  component: Dashboard,
});

const STATUS_CLS: Record<OrderStatus, string> = {
  Pendente: "bg-secondary/15 text-secondary",
  "Em preparo": "bg-accent text-accent-foreground",
  Concluído: "bg-success/15 text-success",
};
const NEXT: Record<OrderStatus, OrderStatus> = { Pendente: "Em preparo", "Em preparo": "Concluído", Concluído: "Concluído" };

function Dashboard() {
  const { orders, setOrderStatus, products } = useStore();
  const [open, setOpen] = useState(false);
  const startToday = new Date().setHours(0, 0, 0, 0);
  const week = Date.now() - 7 * 864e5;
  const today = orders.filter((o) => o.createdAt >= startToday);
  const weekO = orders.filter((o) => o.createdAt >= week);
  const sum = (l: typeof orders) => l.reduce((s, o) => s + o.total, 0);
  const mine = products.filter((p) => p.seller === SELLER_NAME).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-secondary">{SELLER_NAME}</p>
          <h1 className="text-3xl font-extrabold">Painel de vendas</h1>
        </div>
        <Button variant="secondary" className="rounded-full font-bold" onClick={() => setOpen(true)}><Plus /> Novo produto</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric icon={<DollarSign />} label="Faturado hoje" value={brl(sum(today))} />
        <Metric icon={<TrendingUp />} label="Faturado na semana" value={brl(sum(weekO))} />
        <Metric icon={<Receipt />} label="Pedidos (semana)" value={String(weekO.length)} />
        <Metric icon={<Package />} label="Ticket médio" value={brl(weekO.length ? sum(weekO) / weekO.length : 0)} hint={`${mine} produtos no catálogo`} />
      </div>

      <section className="overflow-hidden rounded-2xl border bg-card">
        <h2 className="border-b p-4 text-lg font-bold">Pedidos recentes</h2>
        <div className="divide-y">
          {orders.map((o) => (
            <div key={o.id} className="grid grid-cols-[1fr_auto] items-center gap-2 p-4 sm:grid-cols-[80px_1fr_auto_auto_auto] sm:gap-4">
              <span className="font-mono text-sm font-bold text-primary">{o.id}</span>
              <div className="min-w-0 sm:order-none">
                <p className="truncate font-semibold">{o.customer} · {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</p>
                <p className="text-xs text-muted-foreground">{o.delivery} · {o.payment} · {new Date(o.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</p>
              </div>
              <span className="font-bold">{brl(o.total)}</span>
              <span className={cn("w-fit rounded-full px-2.5 py-0.5 text-xs font-bold", STATUS_CLS[o.status])}>{o.status}</span>
              {o.status !== "Concluído" ? (
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => setOrderStatus(o.id, NEXT[o.status])}>
                  {o.status === "Pendente" ? "Aceitar" : "Concluir"}
                </Button>
              ) : <span />}
            </div>
          ))}
        </div>
      </section>
      <ProductDialog open={open} setOpen={setOpen} />
    </div>
  );
}

function Metric({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card">
      <span className="mb-2 grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-extrabold">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const SAMPLE_IMG = "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=70";

function ProductDialog({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const { addProduct, setRole } = useStore();
  const nav = useNavigate();
  const [img, setImg] = useState("");
  const [category, setCategory] = useState<Category>("Doces");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const price = parseFloat(String(f.get("price")).replace(",", "."));
    if (!(price > 0)) { toast.error("Informe um preço válido"); return; }
    addProduct({ name: String(f.get("name")), category, price, description: String(f.get("description")), image: img || SAMPLE_IMG });
    setOpen(false); setImg("");
    toast.success("Produto publicado na vitrine!", { action: { label: "Ver vitrine", onClick: () => { setRole("buyer"); nav({ to: "/" }); } } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader><DialogTitle className="font-display text-2xl">Cadastrar produto</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          <label className="relative grid aspect-video cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed bg-muted text-muted-foreground hover:border-primary">
            {img ? <img src={img} alt="Prévia" className="absolute inset-0 h-full w-full object-cover" /> : <span className="flex flex-col items-center gap-1 text-sm"><ImagePlus className="h-8 w-8" />Enviar foto</span>}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
              const file = e.target.files?.[0]; if (!file) return;
              const r = new FileReader(); r.onload = () => setImg(String(r.result)); r.readAsDataURL(file);
            }} />
          </label>
          <div className="grid gap-1"><Label htmlFor="name">Nome do produto</Label><Input id="name" name="name" required placeholder="Ex: Cookie de Gotas" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label htmlFor="cat">Categoria</Label>
              <select id="cat" value={category} onChange={(e) => setCategory(e.target.value as Category)} className="h-9 rounded-md border bg-card px-2 text-sm">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid gap-1"><Label htmlFor="price">Preço (R$)</Label><Input id="price" name="price" required inputMode="decimal" placeholder="9,90" /></div>
          </div>
          <div className="grid gap-1"><Label htmlFor="description">Descrição</Label><Textarea id="description" name="description" required rows={3} placeholder="Ingredientes, tamanho, sabor..." /></div>
          <Button type="submit" className="rounded-full">Salvar e publicar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
