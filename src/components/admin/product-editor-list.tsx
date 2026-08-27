"use client";

import { useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { ProductWithCategory } from "@/types";
import { formatPrice } from "@/lib/utils";

type ProductEditorListProps = {
  products: ProductWithCategory[];
};

function ProductStatusPill({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
        active
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {label}
    </span>
  );
}

export function ProductEditorList({
  products,
}: ProductEditorListProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncHashTarget = () => {
      const hash = window.location.hash;
      if (!hash) {
        return;
      }

      const target = document.querySelector(hash);
      if (!target) {
        return;
      }

      if (target instanceof HTMLDetailsElement) {
        target.open = true;
      }

      const detailsParent = target.closest("details");
      if (detailsParent) {
        detailsParent.open = true;
      }

      target.scrollIntoView({ block: "start", behavior: "smooth" });
    };

    syncHashTarget();
    window.addEventListener("hashchange", syncHashTarget);
    return () => window.removeEventListener("hashchange", syncHashTarget);
  }, [pathname]);

  const groupedProducts = products.reduce<Record<string, ProductWithCategory[]>>(
    (groups, product) => {
      const key = product.category.slug;
      groups[key] = groups[key] || [];
      groups[key].push(product);
      return groups;
    },
    {},
  );

  return (
    <div className="space-y-8">
      {Object.values(groupedProducts).map((group) => {
        const category = group[0]?.category;
        if (!category) {
          return null;
        }

        return (
          <section
            key={category.id}
            id={`category-${category.slug}`}
            className="scroll-mt-28 rounded-[2rem] border border-white/70 bg-white/78 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-5"
          >
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#f1e6de] pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b46f5f]">
                  Category
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {category.name}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  {category.description}
                </p>
              </div>
              <span className="rounded-full border border-[#ecd8cc] bg-[#fff8f4] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {group.length} products
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {group.map((product) => (
                <details
                  key={product.id}
                  id={`product-${product.slug}`}
                  className="scroll-mt-28 overflow-hidden rounded-[1.5rem] border border-[#f0e4da] bg-[#fffaf7]"
                >
                  <summary className="list-none cursor-pointer px-4 py-4 sm:px-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] border border-[#eddcd1] bg-white">
                          <Image
                            src={product.images[0] || "/assets/brand/logo.jpg"}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                            {product.slug}
                          </p>
                          <h3 className="mt-1 truncate text-lg font-semibold text-slate-900">
                            {product.name}
                          </h3>
                          <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                            {product.shortDescription || product.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800">
                          {formatPrice(product.price)}
                        </span>
                        <ProductStatusPill label="Available" active={product.available} />
                        <ProductStatusPill label="Published" active={product.published} />
                        <ProductStatusPill label="Featured" active={product.featured} />
                        <span className="rounded-full border border-[#ecd8cc] bg-white px-3 py-1.5 text-sm font-semibold text-[#b46f5f]">
                          Edit
                        </span>
                      </div>
                    </div>
                  </summary>

                  <div className="border-t border-[#f0e4da] p-3 sm:p-4">
                    <ProductForm product={product} />
                  </div>
                </details>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
