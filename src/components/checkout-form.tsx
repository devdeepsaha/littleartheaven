"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils";
import { ProductWithCategory } from "@/types";

type OrderResponse = {
  error?: string;
  orderCode?: string;
  whatsappUrl?: string;
};

export function CheckoutForm({ products }: { products: ProductWithCategory[] }) {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartProducts = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((entry) => entry.slug === item.slug);
          if (!product) {
            return null;
          }

          return {
            ...product,
            quantity: item.quantity,
            lineTotal: item.quantity * product.price,
          };
        })
        .filter(Boolean),
    [items, products],
  ) as Array<ProductWithCategory & { quantity: number; lineTotal: number }>;

  const total = cartProducts.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <form
        className="rounded-[1.7rem] border border-white/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
        onSubmit={async (event) => {
          event.preventDefault();
          setSubmitting(true);
          setError(null);

          const formData = new FormData(event.currentTarget);
          const payload = {
            customerName: String(formData.get("customerName") || ""),
            phone: String(formData.get("phone") || ""),
            email: String(formData.get("email") || ""),
            address: String(formData.get("address") || ""),
            notes: String(formData.get("notes") || ""),
            items: items.map((item) => ({
              slug: item.slug,
              quantity: item.quantity,
            })),
          };

          const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          let body: OrderResponse | null = null;

          try {
            body = (await response.json()) as OrderResponse;
          } catch {
            body = null;
          }

          if (!response.ok) {
            setError(body?.error || "Unable to place order right now.");
            setSubmitting(false);
            return;
          }

          if (!body?.orderCode || !body?.whatsappUrl) {
            setError("The order response was incomplete. Please try again.");
            setSubmitting(false);
            return;
          }

          clearCart();
          router.push(
            `/order-success?code=${body.orderCode}&whatsapp=${encodeURIComponent(
              body.whatsappUrl,
            )}`,
          );
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
              Checkout
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Place the order here, then continue the final confirmation on WhatsApp.
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="customerName">
              Full name
            </label>
            <input
              id="customerName"
              name="customerName"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e89a8f]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e89a8f]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e89a8f]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="address">
              Address or locality
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e89a8f]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Customization, occasion, urgency, or color preferences"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#e89a8f]"
            />
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting || !cartProducts.length}
          className="mt-6 rounded-full bg-[linear-gradient(135deg,#f7c9b0_0%,#e89a8f_100%)] px-6 py-3 text-sm font-semibold text-[#5b312d] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>
      <aside className="rounded-[1.7rem] border border-white/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <h2 className="font-[family-name:var(--font-display)] text-[2rem] text-slate-900">
          Order summary
        </h2>
        <div className="mt-5 space-y-3">
          {cartProducts.map((item) => (
            <div key={item.slug} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">Qty {item.quantity}</p>
              </div>
              <span className="font-semibold text-slate-900">
                {formatPrice(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </aside>
    </div>
  );
}
