import { describe, it, expect } from "vitest";
import { computeTotals } from "@/lib/pricing";

describe("cupom", () => {
  it("UNICALOURO10 dá 10% de desconto no subtotal", () => {
    const t = computeTotals([{ price: 10, qty: 2 }, { price: 5, qty: 1 }], "unicalouro10");
    expect(t).toEqual({ subtotal: 25, discount: 2.5, total: 22.5 });
  });
  it("cupom inválido não dá desconto", () => {
    expect(computeTotals([{ price: 10, qty: 1 }], "XYZ").total).toBe(10);
  });
});
