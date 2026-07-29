"use client";

import { useState } from "react";
import Link from "next/link";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { MotionImage } from "@/components/ui/motion-image";
import { ProductWithCategory } from "@/types";
import { formatPrice } from "@/lib/utils";

export function ProductDetailView({ product }: { product: ProductWithCategory }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [zoomed, setZoomed] = useState(false);

  return (
    <section className="site-shell py-10">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="grid gap-4 bg-white p-3 sm:p-4">
            {/* Cross-fading the selected gallery image keeps attention on product detail instead of thumbnail swapping. */}
            <button
              type="button"
              onClick={() => setZoomed((current) => !current)}
              className="relative min-h-[320px] overflow-hidden rounded-[1.65rem] bg-[#f8fafc] text-left sm:min-h-[420px]"
            >
              <MotionImage
                key={activeImage}
                src={activeImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                quality={78}
                wrapperClassName="h-full w-full"
                className={`gallery-image-enter object-cover transition duration-300 ${zoomed ? "scale-[1.12]" : "hover:scale-[1.03]"}`}
              />
            </button>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {product.images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => {
                    setActiveImage(image);
                    setZoomed(false);
                  }}
                  className={`relative min-h-[120px] overflow-hidden rounded-[1.2rem] border transition sm:min-h-[150px] ${
                    image === activeImage
                      ? "border-[#efc4b2] shadow-[0_12px_30px_rgba(232,154,143,0.2)]"
                      : "border-transparent"
                  }`}
                >
                  <MotionImage
                    src={image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 18vw"
                    quality={68}
                    wrapperClassName="h-full w-full"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#f1e6de] bg-[linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {product.category.name}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-slate-900 sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-amber-100 px-4 py-2 text-lg font-semibold text-amber-800">
                {formatPrice(product.price)}
              </span>
              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${product.available ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
              >
                {product.available ? "Available" : "Sold out"}
              </span>
            </div>
            <p className="mt-6 text-base leading-8 text-slate-700">{product.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 transition duration-200 hover:bg-[#fff1ea] hover:text-[#b66b5a]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 rounded-[1.6rem] border border-[#f0e4da] bg-[#fff8f4] p-4 sm:p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Add to cart
              </p>
              <div className="mt-4">
                <AddToCartButton
                  slug={product.slug}
                  disabled={!product.available}
                  showViewCart
                  imageUrl={product.images[0]}
                  label={product.name}
                />
              </div>
            </div>
            <div className="mt-5">
              <Link
                href="/shop"
                className="text-sm font-semibold text-[#b66b5a] transition hover:text-[#9d5748]"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
