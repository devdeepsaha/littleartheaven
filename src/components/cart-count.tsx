"use client";

import { useCart } from "@/components/providers/cart-provider";

export function CartCount() {
  const { items, cartPulseKey } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <span
      key={cartPulseKey}
      className="count-pop inline-flex min-w-6 items-center justify-center rounded-full bg-[#fff7f3] px-2 py-1 text-xs font-bold text-[#a95f52] shadow-[inset_0_0_0_1px_rgba(169,95,82,0.12)]"
    >
      {count}
    </span>
  );
}
