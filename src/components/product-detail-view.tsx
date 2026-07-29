"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { MotionImage } from "@/components/ui/motion-image";
import { formatPrice } from "@/lib/utils";
import { ProductWithCategory } from "@/types";

export function ProductDetailView({ product }: { product: ProductWithCategory }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeIndex = useMemo(
    () => Math.max(product.images.findIndex((image) => image === activeImage), 0),
    [activeImage, product.images],
  );

  const styleLabel = `Style ${String(activeIndex + 1).padStart(2, "0")}`;

  function showPreviousImage() {
    const previousIndex =
      activeIndex === 0 ? product.images.length - 1 : activeIndex - 1;
    setActiveImage(product.images[previousIndex]);
  }

  function showNextImage() {
    const nextIndex =
      activeIndex === product.images.length - 1 ? 0 : activeIndex + 1;
    setActiveImage(product.images[nextIndex]);
  }

  return (
    <>
      <section className="site-shell py-6 sm:py-8">
        <div className="overflow-hidden rounded-[1.9rem] bg-white shadow-[0_20px_52px_rgba(15,23,42,0.07)]">
          <div className="grid gap-0 xl:grid-cols-[0.94fr_1.06fr]">
            <div className="border-b border-[#f3e7de] bg-white p-3 sm:p-4 xl:border-b-0 xl:border-r">
              <div className="grid gap-3 xl:grid-cols-[5.5rem_minmax(0,1fr)]">
                <div className="order-2 flex gap-2 overflow-x-auto pb-1 xl:order-1 xl:flex-col xl:overflow-visible xl:pb-0">
                  {product.images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={`group relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.15rem] border bg-[#fffaf7] transition sm:h-24 sm:w-24 ${
                        image === activeImage
                          ? "border-[#efb9a7] shadow-[0_12px_24px_rgba(232,154,143,0.18)]"
                          : "border-[#f1e6de] hover:border-[#e8cdbf]"
                      }`}
                      aria-label={`View ${product.name} image ${index + 1}`}
                    >
                      <MotionImage
                        src={image}
                        alt={`${product.name} style ${index + 1}`}
                        fill
                        sizes="96px"
                        quality={64}
                        wrapperClassName="h-full w-full"
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </button>
                  ))}
                </div>

                <div className="order-1 xl:order-2">
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="group relative block min-h-[280px] w-full overflow-hidden rounded-[1.55rem] bg-[#f8fafc] text-left sm:min-h-[420px] xl:min-h-[520px]"
                  >
                    <MotionImage
                      key={activeImage}
                      src={activeImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1280px) 100vw, 48vw"
                      quality={78}
                      wrapperClassName="h-full w-full"
                      className="gallery-image-enter object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#0f172acc] via-[#0f172a40] to-transparent px-4 py-4 text-white sm:px-5">
                      <span className="text-[10px] uppercase tracking-[0.28em] text-white/80 sm:text-xs">
                        Tap for full view
                      </span>
                      <span className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-semibold">
                        {activeIndex + 1}/{product.images.length}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] p-5 sm:p-6 lg:p-7 xl:p-8">
              <p className="text-[11px] uppercase tracking-[0.34em] text-slate-500 sm:text-xs">
                {product.category.name}
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl leading-none text-slate-900 sm:text-[3.2rem]">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-amber-100 px-4 py-2 text-base font-semibold text-amber-800 sm:text-lg">
                  {formatPrice(product.price)}
                </span>
                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${product.available ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                >
                  {product.available ? "Available" : "Sold out"}
                </span>
                <span className="rounded-full border border-[#f0e2d7] bg-[#fff8f4] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b46f5f] sm:text-xs">
                  {styleLabel} selected
                </span>
              </div>

              <div className="mt-5 rounded-[1.4rem] border border-[#f0e4da] bg-[#fffaf7] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                      Choose a style
                    </p>
                    <p className="mt-1 text-sm text-slate-700 sm:text-[15px]">
                      Pick the frame or design version you like from the photo strip.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="shrink-0 rounded-full border border-[#e8d8cc] bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-[#fff4ee]"
                  >
                    Full view
                  </button>
                </div>
              </div>

              <p className="mt-5 text-[15px] leading-8 text-slate-700 sm:text-base">
                {product.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 transition duration-200 hover:bg-[#fff1ea] hover:text-[#b66b5a]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-[1.55rem] border border-[#f0e4da] bg-[#fff8f4] p-4 sm:p-5">
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Add to cart
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Save this exact style, then order by email and WhatsApp.
                </p>
                <div className="mt-4">
                  <AddToCartButton
                    slug={product.slug}
                    disabled={!product.available}
                    showViewCart
                    imageUrl={activeImage}
                    label={`${product.name} ${styleLabel}`}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                <Link
                  href="/shop"
                  className="font-semibold text-[#b66b5a] transition hover:text-[#9d5748]"
                >
                  Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="font-semibold text-slate-600 transition hover:text-slate-900"
                >
                  Open selected design
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[80] bg-[#0f172ae8] px-3 py-4 backdrop-blur-sm sm:px-6 sm:py-6">
          <div className="mx-auto flex h-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#111827] shadow-[0_24px_80px_rgba(15,23,42,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 text-white sm:px-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 sm:text-xs">
                  {product.category.name}
                </p>
                <p className="mt-1 text-base font-semibold sm:text-lg">{product.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
              >
                Close
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <MotionImage
                key={`${activeImage}-lightbox`}
                src={activeImage}
                alt={product.name}
                fill
                sizes="100vw"
                quality={90}
                wrapperClassName="h-full w-full"
                className="object-contain p-4 sm:p-8"
              />

              {product.images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-[#111827cc] text-xl text-white transition hover:bg-[#1f2937] sm:flex"
                    aria-label="Previous image"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-[#111827cc] text-xl text-white transition hover:bg-[#1f2937] sm:flex"
                    aria-label="Next image"
                  >
                    &gt;
                  </button>
                </>
              ) : null}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-[#020617] via-[#020617c8] to-transparent px-4 py-4 text-white sm:px-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 sm:text-xs">
                    Selected design
                  </p>
                  <p className="mt-1 text-sm font-semibold sm:text-base">
                    {styleLabel} of {product.images.length}
                  </p>
                </div>
                {product.images.length > 1 ? (
                  <div className="flex items-center gap-2 sm:hidden">
                    <button
                      type="button"
                      onClick={showPreviousImage}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={showNextImage}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
