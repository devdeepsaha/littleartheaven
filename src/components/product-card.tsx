import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import { ProductWithCategory } from "@/types";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { MotionImage } from "@/components/ui/motion-image";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const defaultSelectionLabel =
    product.images.length > 1 ? `${product.name} Style 01` : product.name;

  return (
    <article className="group overflow-hidden rounded-[1.35rem] border border-white/70 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.08)] transition duration-200 ease-[var(--motion-ease-standard)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(15,23,42,0.12)] sm:rounded-[1.5rem] sm:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.15),_transparent_55%),linear-gradient(180deg,#fff,#f8fafc)]">
          {/* Keeping the image motion inside the crop gives tactile zoom feedback without shifting the card itself. */}
          <MotionImage
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            quality={72}
            wrapperClassName="h-full w-full"
            className="object-cover transition duration-500 group-hover:scale-[1.035]"
          />
          {/* This secondary action appears right at the product edge so attention stays on the card instead of jumping elsewhere. */}
          <div className="quick-action absolute inset-x-3 bottom-3 hidden sm:block">
            <span className="inline-flex rounded-full border border-white/80 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
              Quick view
            </span>
          </div>
        </div>
      </Link>
      <div className="space-y-2.5 p-2.5 sm:space-y-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500 sm:text-xs sm:tracking-[0.25em]">
              {product.category.name}
            </p>
            <Link
              href={`/product/${product.slug}`}
              className="mt-1 block line-clamp-3 text-[0.95rem] font-semibold leading-tight text-slate-900 sm:mt-1.5 sm:text-lg"
            >
              {product.name}
            </Link>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5 sm:gap-2">
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 sm:px-3 sm:py-1 sm:text-sm">
              {formatPrice(product.price)}
            </span>
            {!product.available ? (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-rose-700 sm:px-3 sm:py-1 sm:text-[11px] sm:tracking-[0.16em]">
                Sold out
              </span>
            ) : null}
          </div>
        </div>
        <p className="line-clamp-3 min-h-[3.45rem] text-[11px] leading-[1.4] text-slate-600 sm:min-h-0 sm:text-sm sm:leading-5">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <Link
            href={`/product/${product.slug}`}
            className="text-[11px] font-semibold text-sky-700 sm:text-sm"
          >
            View details
          </Link>
          <AddToCartButton
            slug={product.slug}
            disabled={!product.available}
            imageUrl={product.images[0]}
            label={defaultSelectionLabel}
          />
        </div>
      </div>
    </article>
  );
}
