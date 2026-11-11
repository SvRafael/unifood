import { createContext, useContext, useState, type ReactNode } from "react";
import imgBolo from "../../public/assets/bolo-de-pote-0.jpg";
import imgEsfirra from "../../public/assets/espiha.jfif";
import imgBrownie from "../../public/assets/beownie.jfif";
import imgEmpada from "../../public/assets/empada.jfif";
import imgSuco from "../../public/assets/sucos.jfif";
import imgCookie from "../../public/assets/cookies.jfif";

export type Category = "Bolos" | "Doces" | "Salgados" | "Bebidas" | "Saudável" | "Vegano";
export const CATEGORIES: Category[] = ["Bolos", "Doces", "Salgados", "Bebidas", "Saudável", "Vegano"];

export type Product = {
  id: string; name: string; seller: string; category: Category; price: number;
  description: string; image: string; rating: number; sold: number;
};
export type OrderStatus = "Pendente" | "Em preparo" | "Concluído";
export type Order = {
  id: string; customer: string; items: { name: string; qty: number }[]; total: number;
  status: OrderStatus; createdAt: number; delivery: string; payment: string;
};
export type User = { name: string; email: string; course?: string; semester?: string; ra?: string };
export type Role = "buyer" | "seller";

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const SELLER_NAME = "Doces da Ju (Eng. Civil)";

const INITIAL: Product[] = [
  { id: "p1", name: "Bolo de Pote", seller: SELLER_NAME, category: "Bolos", price: 8, description: "Camadas de massa fofinha, creme de leite Ninho e brigadeiro. Pote de 250ml.", image: imgBolo, rating: 4.9, sold: 312 },
  { id: "p2", name: "Esfirra", seller: "Salgados do Pedro (ADS)", category: "Salgados", price: 8, description: "Massa crocante, recheio cremoso de frango desfiado com Catupiry original.", image: imgEsfirra, rating: 4.8, sold: 540 },
  { id: "p3", name: "Brownie Artesanal", seller: SELLER_NAME, category: "Doces", price: 8.5, description: "Chocolate 70% cacau, casquinha crocante e centro molhadinho.", image: imgBrownie, rating: 4.9, sold: 401 },
  { id: "p4", name: "Empada de Frango", seller: "Salgados do Pedro (ADS)", category: "Salgados", price: 6, description: "Massa amanteigada que desmancha, recheio de frango com Catupiry.", image: imgEmpada, rating: 4.6, sold: 188 },
  { id: "p5", name: "Suco Natural", seller: "Mari Doceria (Nutrição)", category: "Doces", price: 5, description: "Sucos naturais sem açucar.", image: imgSuco, rating: 4.7, sold: 276 },
  { id: "p6", name: "Cookie Artesanal", seller: "Mari Doceria (Nutrição)", category: "Saudável", price: 4, description: "Cookies de chocolates recheados com brigadeiro", image: imgCookie, rating: 4.8, sold: 150 },
]

const now = Date.now();
const INITIAL_ORDERS: Order[] = [
  { id: "#1042", customer: "Lucas M.", items: [{ name: "Brownie Artesanal 70%", qty: 2 }], total: 17, status: "Pendente", createdAt: now - 6e5, delivery: "Retirada · Bloco A", payment: "PIX" },
  { id: "#1041", customer: "Ana B.", items: [{ name: "Bolo de Pote Ninho com Nutella", qty: 1 }], total: 12, status: "Em preparo", createdAt: now - 2.4e6, delivery: "Sala 204 · Prédio 3", payment: "Cartão" },
  { id: "#1040", customer: "Rafa S.", items: [{ name: "Bolo de Pote Ninho com Nutella", qty: 3 }], total: 36, status: "Concluído", createdAt: now - 7.2e6, delivery: "Retirada · Cantina Central", payment: "PIX" },
  { id: "#1039", customer: "Bia T.", items: [{ name: "Brownie Artesanal 70%", qty: 4 }], total: 34, status: "Concluído", createdAt: now - 1.5e8, delivery: "Retirada · Estacionamento", payment: "Na entrega" },
  { id: "#1038", customer: "João P.", items: [{ name: "Brownie Artesanal 70%", qty: 1 }, { name: "Bolo de Pote Ninho com Nutella", qty: 1 }], total: 20.5, status: "Concluído", createdAt: now - 3e8, delivery: "Retirada · Bloco A", payment: "PIX" },
];

type Ctx = {
  role: Role; setRole: (r: Role) => void;
  user: User | null; setUser: (u: User | null) => void;
  products: Product[]; addProduct: (p: Omit<Product, "id" | "rating" | "sold" | "seller">) => void;
  favorites: string[]; toggleFavorite: (id: string) => void;
  cart: Record<string, number>; addToCart: (id: string) => void; setQty: (id: string, q: number) => void; clearCart: () => void;
  orders: Order[]; addOrder: (o: Order) => void; setOrderStatus: (id: string, s: OrderStatus) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("buyer");
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState(INITIAL);
  const [favorites, setFav] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const value: Ctx = {
    role, setRole, user, setUser, products, favorites, cart, orders,
    addProduct: (p) => setProducts((ps) => [{ ...p, id: "p" + Date.now(), rating: 5, sold: 0, seller: SELLER_NAME }, ...ps]),
    toggleFavorite: (id) => setFav((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    addToCart: (id) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 })),
    setQty: (id, q) => setCart((c) => { const n = { ...c }; if (q <= 0) delete n[id]; else n[id] = q; return n; }),
    clearCart: () => setCart({}),
    addOrder: (o) => setOrders((os) => [o, ...os]),
    setOrderStatus: (id, s) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: s } : o))),
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
}
