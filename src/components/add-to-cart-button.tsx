"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { useCart } from "@/components/providers/cart-provider";
import { ButtonSpinner } from "@/components/ui/button-spinner";

export function AddToCartButton({
  slug,
  disabled = false,
  showViewCart = false,
  imageUrl,
  label,
}: {
  slug: string;
  disabled?: boolean;
  showViewCart?: boolean;
  imageUrl?: string;
  label?: string;
}) {
  const { items, addItem, updateItem } = useCart();
  const [phase, setPhase] = useState<"idle" | "loading" | "success">("idle");

  const quantity = useMemo(
    () => items.find((item) => item.slug === slug)?.quantity || 0,
    [items, slug],
  );

  async function handleAdd(event: React.MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget;
    setPhase("loading");
    await Promise.resolve();
    addItem(slug, {
      originRect: button.getBoundingClientRect(),
      imageUrl,
      label,
    });
    setPhase("success");
    window.setTimeout(() => setPhase("idle"), 720);
  }

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className="rounded-full bg-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-500 sm:px-4 sm:text-sm"
      >
        Sold out
      </button>
    );
  }

  if (!quantity) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex min-w-[4.8rem] items-center justify-center rounded-full bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-700 sm:px-4 sm:text-sm"
      >
        {phase === "loading" ? (
          <ButtonSpinner />
        ) : phase === "success" ? (
          <span className="success-pop">✓ Added</span>
        ) : (
          "Add"
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd6] bg-[#fffaf7] p-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]">
        <button
          type="button"
          onClick={() => updateItem(slug, quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#efe2d7] bg-white text-base font-semibold text-[#7c5a52] transition hover:bg-[#f8f1eb] sm:h-9 sm:w-9"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="min-w-6 text-center text-sm font-semibold text-slate-900 sm:min-w-7">
          {quantity}
        </span>
        <button
          type="button"
          onClick={(event) => {
            addItem(slug, {
              originRect: event.currentTarget.getBoundingClientRect(),
              imageUrl,
              label,
            });
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f3b2a2_0%,#e28779_100%)] text-base font-semibold text-white shadow-[0_10px_18px_rgba(226,135,121,0.22)] transition hover:brightness-[1.03] sm:h-9 sm:w-9"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      {showViewCart ? (
        <Link
          href="/cart"
          className="inline-flex items-center rounded-full border border-[#e7d7cc] bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-[#fff7f2] sm:text-sm"
        >
          View cart
        </Link>
      ) : null}
    </div>
  );
}
