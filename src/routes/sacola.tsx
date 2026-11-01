import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Banknote, Bike, Check, Copy, CreditCard, MapPin, Minus, Plus, QrCode, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStore, type OrderStatus } from "@/lib/store";
import { brl, computeTotals, couponRate } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sacola")({
  head: () => ({
    meta: [
      { title: "Sacola e pagamento | Unifood" },
      { name: "description", content: "Revise seus itens, escolha retirada ou entrega no campus e pague com PIX ou cartão." },
      { property: "og:title", content: "Sacola e pagamento | Unifood" },
      { property: "og:description", content: "Revise seus itens e finalize seu pedido no campus." },
    ],
  }),
  component: Cart,
});

const POINTS = ["Bloco A", "Cantina Central", "Estacionamento", "Biblioteca"];
const PIX_KEY = "00020126580014BR.GOV.BCB.PIX0136unifood-demo-tcc@pix.com.br5204000053039865802BR5925UNIFOOD6009SAO PAULO";
const STEPS = ["Aguardando vendedor", "Preparando", "Pronto para retirada"];

function Cart() {
  const { products, cart, setQty, clearCart, addOrder, setOrderStatus, user } = useStore();
  const items = products.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] }));
  const [mode, setMode] = useState<"pickup" | "delivery">("pickup");
  const [point, setPoint] = useState(POINTS[0]);
  const [room, setRoom] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState("");
  const [pay, setPay] = useState<"pix" | "card" | "cash">("pix");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });
  const [placed, setPlaced] = useState<null | { id: string; step: number }>(null);
  const t = computeTotals(items, coupon);

  useEffect(() => {
    if (!placed || placed.step >= 2) return;
    const id = setTimeout(() => {
      const step = placed.step + 1;
      setPlaced({ ...placed, step });
      setOrderStatus(placed.id, (step === 1 ? "Em preparo" : "Concluído") as OrderStatus);
    }, 3500);
    return () => clearTimeout(id);
  }, [placed, setOrderStatus]);

  const applyCoupon = () => {
    if (couponRate(couponInput) > 0) { setCoupon(couponInput); toast.success("Cupom aplicado: 10% de desconto!"); }
    else { setCoupon(""); toast.error("Cupom inválido"); }
  };

  const checkout = () => {
    if (mode === "delivery" && !room.trim()) return toast.error("Informe a sala/prédio para entrega");
    if (pay === "card" && (card.number.replace(/\D/g, "").length < 12 || !card.name || !card.exp || card.cvv.length < 3)) return toast.error("Preencha os dados do cartão");
    const id = "#" + Math.floor(1100 + Math.random() * 900);
    addOrder({
      id, customer: user?.name ?? "Visitante", items: items.map((i) => ({ name: i.name, qty: i.qty })), total: t.total,
      status: "Pendente", createdAt: Date.now(), delivery: mode === "pickup" ? `Retirada · ${point}` : room,
      payment: pay === "pix" ? "PIX" : pay === "card" ? "Cartão" : "Na entrega",
    });
    clearCart(); setCoupon(""); setCouponInput("");
    setPlaced({ id, step: 0 });
  };

  if (!items.length && !placed)
    return (
      <div className="grid place-items-center gap-3 rounded-3xl border border-dashed bg-card py-16 text-center">
        <ShoppingBag className="h-10 w-10 text-primary" />
        <p className="text-muted-foreground">Sua sacola está vazia.</p>
        <Button asChild className="rounded-full"><Link to="/">Ver vitrine</Link></Button>
      </div>
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <h1 className="text-3xl font-extrabold">Sua sacola</h1>
        <div className="divide-y rounded-2xl border bg-card">
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-3 p-3">
              <img src={i.image} alt={i.name} className="h-16 w-16 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{i.name}</p>
                <p className="text-sm text-muted-foreground">{brl(i.price)}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full border p-0.5">
                <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" aria-label="Diminuir" onClick={() => setQty(i.id, i.qty - 1)}><Minus /></Button>
                <span className="w-6 text-center font-bold">{i.qty}</span>
                <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" aria-label="Aumentar" onClick={() => setQty(i.id, i.qty + 1)}><Plus /></Button>
              </div>
              <Button size="icon" variant="ghost" aria-label="Remover" onClick={() => setQty(i.id, 0)}><Trash2 className="text-destructive" /></Button>
            </div>
          ))}
        </div>

        <Section title="Modalidade">
          <div className="grid grid-cols-2 gap-2">
            <Choice on={mode === "pickup"} onClick={() => setMode("pickup")} icon={<MapPin />} label="Retirar no Campus" />
            <Choice on={mode === "delivery"} onClick={() => setMode("delivery")} icon={<Bike />} label="Receber na Sala/Prédio" />
          </div>
          {mode === "pickup" ? (
            <div className="flex flex-wrap gap-2">
              {POINTS.map((p) => (
                <button key={p} onClick={() => setPoint(p)} className={cn("rounded-full border px-3 py-1 text-sm font-semibold", point === p ? "border-secondary bg-secondary text-secondary-foreground" : "bg-card")}>{p}</button>
              ))}
            </div>
          ) : (
            <Input placeholder="Ex: Sala 204, Prédio 3" value={room} onChange={(e) => setRoom(e.target.value)} />
          )}
        </Section>

        <Section title="Pagamento">
          <div className="grid grid-cols-3 gap-2">
            <Choice on={pay === "pix"} onClick={() => setPay("pix")} icon={<QrCode />} label="PIX" />
            <Choice on={pay === "card"} onClick={() => setPay("card")} icon={<CreditCard />} label="Cartão" />
            <Choice on={pay === "cash"} onClick={() => setPay("cash")} icon={<Banknote />} label="Na entrega" />
          </div>
          {pay === "pix" && (
            <div className="flex flex-col items-center gap-3 rounded-xl bg-muted p-4 sm:flex-row">
              <MockQr />
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm text-muted-foreground">Escaneie o QR Code ou copie a chave PIX:</p>
                <p className="truncate rounded-lg bg-card px-2 py-1 font-mono text-xs">{PIX_KEY}</p>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => { navigator.clipboard?.writeText(PIX_KEY); toast.success("Chave PIX copiada!"); }}><Copy /> Copiar chave</Button>
              </div>
            </div>
          )}
          {pay === "card" && (
            <div className="grid grid-cols-2 gap-2">
              <Input className="col-span-2" placeholder="Número do cartão" inputMode="numeric" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
              <Input className="col-span-2" placeholder="Nome impresso" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
              <Input placeholder="MM/AA" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} />
              <Input placeholder="CVV" inputMode="numeric" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
            </div>
          )}
          {pay === "cash" && <p className="text-sm text-muted-foreground">Pague em dinheiro ou PIX direto ao vendedor no momento da entrega.</p>}
        </Section>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border bg-card p-5 shadow-card lg:sticky lg:top-32">
        <h2 className="text-xl font-extrabold">Resumo</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9 uppercase" placeholder="Cupom" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
          </div>
          <Button variant="outline" onClick={applyCoupon}>Aplicar</Button>
        </div>
        <dl className="space-y-1 text-sm">
          <Row k="Subtotal" v={brl(t.subtotal)} />
          {t.discount > 0 && <Row k={`Desconto (${coupon.toUpperCase()})`} v={"− " + brl(t.discount)} className="text-success" />}
          <Row k="Entrega" v="Grátis" />
          <Row k="Total" v={brl(t.total)} className="border-t pt-2 text-lg font-extrabold text-foreground" />
        </dl>
        <Button variant="secondary" size="lg" className="w-full rounded-full font-bold" onClick={checkout} disabled={!items.length}>Finalizar pedido</Button>
      </aside>

      <Dialog open={!!placed} onOpenChange={(o) => !o && setPlaced(null)}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader><DialogTitle className="text-center font-display text-2xl">Pedido {placed?.id} enviado!</DialogTitle></DialogHeader>
          <ol className="space-y-3 text-left">
            {STEPS.map((s, i) => {
              const done = (placed?.step ?? 0) >= i;
              return (
                <li key={s} className="flex items-center gap-3">
                  <span className={cn("grid h-8 w-8 place-items-center rounded-full border-2 transition-colors", done ? "border-success bg-success text-primary-foreground" : "text-muted-foreground")}>
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={cn("font-semibold", !done && "text-muted-foreground", placed?.step === i && "text-primary")}>{s}</span>
                </li>
              );
            })}
          </ol>
          <Button asChild className="mt-2 rounded-full" onClick={() => setPlaced(null)}><Link to="/">Voltar à vitrine</Link></Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-3 rounded-2xl border bg-card p-4"><h2 className="text-lg font-bold">{title}</h2>{children}</section>;
}
function Choice({ on, onClick, icon, label }: { on: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center text-sm font-bold transition-colors [&_svg]:h-5 [&_svg]:w-5", on ? "border-primary bg-accent text-accent-foreground" : "hover:border-primary/40")}>
      {icon}{label}
    </button>
  );
}
function Row({ k, v, className }: { k: string; v: string; className?: string }) {
  return <div className={cn("flex justify-between text-muted-foreground", className)}><dt>{k}</dt><dd>{v}</dd></div>;
}
function MockQr() {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21, y = Math.floor(i / 21);
    const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7 && (x === a || x === a + 6 || y === b || y === b + 6 || (x > a + 1 && x < a + 5 && y > b + 1 && y < b + 5));
    if (finder(0, 0) || finder(14, 0) || finder(0, 14)) return true;
    if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) return false;
    return ((x * 7 + y * 13 + x * y) % 5) < 2;
  });
  return (
    <div className="grid h-36 w-36 shrink-0 grid-cols-[repeat(21,1fr)] rounded-lg bg-card p-2">
      {cells.map((c, i) => <span key={i} className={c ? "bg-foreground" : ""} />)}
    </div>
  );
}
