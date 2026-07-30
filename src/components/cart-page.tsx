"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/components/providers/cart-provider";
import { MotionImage } from "@/components/ui/motion-image";
import { formatPrice } from "@/lib/utils";
import { ProductWithCategory } from "@/types";

export function CartPage({ products }: { products: ProductWithCategory[] }) {
  const { items, updateItem, removeItem } = useCart();
  const [removingSlug, setRemovingSlug] = useState<string | null>(null);
  const [flashSlug, setFlashSlug] = useState<string | null>(null);

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((entry) => entry.slug === item.slug);
          if (!product) {
            return null;
          }

          return {
            ...product,
            lineId: item.lineId,
            selectedImage: item.imageUrl || product.images[0],
            selectedLabel: item.label || product.name,
            quantity: item.quantity,
            total: product.price * item.quantity,
          };
        })
        .filter(Boolean),
    [items, products],
  ) as Array<
    ProductWithCategory & {
      lineId: string;
      selectedImage: string;
      selectedLabel: string;
      quantity: number;
      total: number;
    }
  >;

  const total = lines.reduce((sum, item) => sum + item.total, 0);

  if (!lines.length) {
    return (
      <div className="rounded-[1.7rem] border border-dashed border-slate-300 bg-white/75 p-8 text-center">
        {/* This empty-state keeps the cart from feeling dead by giving it a small handcrafted gift vignette. */}
        <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[linear-gradient(180deg,#fff6ef_0%,#feece3_100%)] shadow-[0_18px_40px_rgba(226,135,121,0.12)]">
          <div className="relative h-14 w-14 rounded-[1.2rem] bg-white shadow-[0_10px_25px_rgba(15,23,42,0.08)]">
            <span className="absolute inset-x-5 top-0 h-full w-1 rounded-full bg-[#f3b2a2]" />
            <span className="absolute left-0 right-0 top-5 h-1 rounded-full bg-[#f3b2a2]" />
            <span className="floating-sparkle absolute -right-2 -top-2 text-lg">✦</span>
          </div>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Your cart is empty
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Pick a few handmade favorites and come back here when you&apos;re ready to order.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-[linear-gradient(135deg,#f7c9b0_0%,#e89a8f_100%)] px-5 py-3 text-sm font-semibold text-[#5b312d]"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_290px]">
      <div className="space-y-3">
        {lines.map((item) => (
          <article
            key={item.lineId}
            className={`grid gap-4 rounded-[1.6rem] border border-white/70 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] md:grid-cols-[96px_1fr_auto] ${removingSlug === item.lineId ? "collapse-out" : ""}`}
          >
            <div className="relative aspect-square overflow-hidden rounded-[1rem]">
              <MotionImage
                src={item.selectedImage}
                alt={item.selectedLabel}
                fill
                sizes="96px"
                wrapperClassName="h-full w-full"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                {item.category.name}
              </p>
              <h2 className="mt-1.5 text-[1.7rem] leading-tight font-semibold text-slate-900">
                {item.name}
              </h2>
              {item.selectedLabel !== item.name ? (
                <span className="mt-2 inline-flex rounded-full border border-[#efdfd4] bg-[#fff8f4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b46f5f]">
                  {item.selectedLabel.replace(`${item.name} `, "")}
                </span>
              ) : null}
              <p className="mt-2 text-sm leading-5 text-slate-600">{item.shortDescription}</p>
              <button
                type="button"
                onClick={() => {
                  setRemovingSlug(item.lineId);
                  window.setTimeout(() => removeItem(item.lineId), 220);
                }}
                className="mt-4 text-sm font-semibold text-rose-600"
              >
                Remove
              </button>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <span
                className={`rounded-full px-2 py-1 text-base font-semibold text-slate-900 ${flashSlug === item.lineId ? "price-flash" : ""}`}
              >
                {formatPrice(item.total)}
              </span>
              <div className="flex items-center gap-1.5 rounded-full border border-[#eadfd6] bg-[#fffaf7] px-1.5 py-1">
                <button
                  type="button"
                  onClick={() => {
                    setFlashSlug(item.lineId);
                    updateItem(item.lineId, item.quantity - 1);
                    window.setTimeout(() => setFlashSlug(null), 340);
                  }}
                  className="h-9 w-9 rounded-full bg-[#f6efe9] text-base text-[#7c5a52]"
                >
                  -
                </button>
                <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFlashSlug(item.lineId);
                    updateItem(item.lineId, item.quantity + 1);
                    window.setTimeout(() => setFlashSlug(null), 340);
                  }}
                  className="h-9 w-9 rounded-full bg-[#e89a8f] text-base text-white"
                >
                  +
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className="rounded-[1.8rem] border border-white/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <h2 className="font-[family-name:var(--font-display)] text-[2rem] text-slate-900">
          Summary
        </h2>
        <div className="mt-5 flex items-center justify-between text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#f7c9b0_0%,#e89a8f_100%)] px-5 py-3 text-sm font-semibold text-[#5b312d] shadow-[0_12px_30px_rgba(213,147,124,0.24)]"
        >
          Continue to checkout
        </Link>
      </aside>
    </div>
  );
}
