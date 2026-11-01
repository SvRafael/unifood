export const COUPONS: Record<string, number> = { UNICALOURO10: 0.1 };

export function couponRate(code: string): number {
  return COUPONS[code.trim().toUpperCase()] ?? 0;
}

export function computeTotals(items: { price: number; qty: number }[], coupon: string) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round(subtotal * couponRate(coupon) * 100) / 100;
  return { subtotal, discount, total: Math.round((subtotal - discount) * 100) / 100 };
}

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
