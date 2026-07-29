import type { Metadata } from "next";

import { ShopCatalog } from "@/components/shop-catalog";
import { business } from "@/data/site";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: `Shop ${business.name}`,
  description:
    "Browse handmade gifts, custom keepsakes, lockets, frames, clay art, and painted accessories from Little Art Heaven.",
  alternates: {
    canonical: "/shop",
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <section className="site-shell py-10">
      <div className="rounded-[2.25rem] bg-white/80 px-6 py-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">The full catalog</p>
        <h1 className="section-title mt-3 text-slate-900">Shop Little Art Heaven</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Browse the current collection of handmade products. Each order is placed through the site and confirmed personally on WhatsApp.
        </p>
      </div>

      <ShopCatalog
        categories={categories}
        products={products}
        activeCategorySlug={category}
      />
    </section>
  );
}
