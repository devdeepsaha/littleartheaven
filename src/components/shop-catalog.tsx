"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { Category, ProductWithCategory } from "@/types";

type ShopCategory = Category & {
  productCount: number;
};

export function ShopCatalog({
  categories,
  products,
  activeCategorySlug,
}: {
  categories: ShopCategory[];
  products: ProductWithCategory[];
  activeCategorySlug?: string;
}) {
  const categoryRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const productsRef = useRef<HTMLElement | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(activeCategorySlug);

  useEffect(() => {
    setSelectedCategorySlug(activeCategorySlug);
  }, [activeCategorySlug]);

  useEffect(() => {
    if (!selectedCategorySlug) {
      return;
    }

    const activeNode = categoryRefs.current[selectedCategorySlug];
    if (!activeNode) {
      return;
    }

    activeNode.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedCategorySlug]);

  function applyCategoryFilter(slug?: string) {
    setSelectedCategorySlug(slug);
    window.history.replaceState(null, "", slug ? `/shop?category=${slug}` : "/shop");

    requestAnimationFrame(() => {
      productsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  const filteredProducts = useMemo(() => {
    if (!selectedCategorySlug) {
      return products;
    }

    return products.filter((product) => product.category.slug === selectedCategorySlug);
  }, [selectedCategorySlug, products]);

  const activeCategory = categories.find((category) => category.slug === selectedCategorySlug);
  const sectionTitle = activeCategory ? activeCategory.name : "All products";

  return (
    <>
      <div className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900">Categories</h2>
          {activeCategory ? (
            <button
              type="button"
              onClick={() => applyCategoryFilter()}
              className="rounded-full border border-[#edd6c8] bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Clear filter
            </button>
          ) : null}
        </div>

        <div className="-mx-1 mt-5 flex gap-3 overflow-x-auto px-1 pb-2 sm:hidden">
          {categories.map((category) => {
            const isActive = category.slug === selectedCategorySlug;

            return (
              <button
                type="button"
                key={category.id}
                ref={(node) => {
                  categoryRefs.current[category.slug] = node;
                }}
                onClick={() => applyCategoryFilter(isActive ? undefined : category.slug)}
                className={`flex shrink-0 items-center gap-3 rounded-full border px-3 py-2 pr-4 shadow-[0_10px_26px_rgba(15,23,42,0.07)] transition ${
                  isActive
                    ? "border-[#efc4b2] bg-[linear-gradient(135deg,#fff8f3_0%,#fff1ea_100%)]"
                    : "border-white/70 bg-white"
                }`}
              >
                <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-[#fff4ee]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="whitespace-nowrap text-sm font-semibold text-slate-900">
                    {category.name}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-rose-700">
                    {category.productCount} items
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 hidden gap-4 sm:grid md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => {
            const isActive = category.slug === selectedCategorySlug;

            return (
              <button
                type="button"
                key={category.id}
                onClick={() => applyCategoryFilter(isActive ? undefined : category.slug)}
                className={`group flex items-center gap-4 rounded-[1.5rem] border px-4 py-4 text-left shadow-[0_14px_35px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)] ${
                  isActive
                    ? "border-[#efc4b2] bg-[linear-gradient(135deg,#fff8f3_0%,#fff1ea_100%)]"
                    : "border-white/70 bg-white"
                }`}
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-[#fff4ee]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="80px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
                    <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
                      {category.productCount} items
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">
                    {category.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <section id="products" ref={productsRef} className="mt-12 scroll-mt-28">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{sectionTitle}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
