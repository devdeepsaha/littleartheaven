import type { Metadata } from "next";
import Link from "next/link";

import { CategoryCard } from "@/components/category-card";
import { FounderStory } from "@/components/founder-story";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/ui/reveal";
import { business } from "@/data/site";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Little Art Heaven by Srijita Nandy",
  description: `${business.name} is a handmade gifting studio by ${business.founderName} offering custom frames, lockets, clay art, painted bags, and thoughtful keepsakes.`,
};

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
      <>
      <Hero />
      <FounderStory />
      {/* These one-time section reveals keep the page readable by introducing new groups only when they enter view. */}
      <Reveal as="section" className="site-shell py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Browse by category
            </p>
            <h2 className="section-title mt-3 text-slate-900">Gifts for every kind of moment</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-sky-700">
            View full shop
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </Reveal>
      <Reveal as="section" className="site-shell py-10" delay={80}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Featured picks
            </p>
            <h2 className="section-title mt-3 text-slate-900">A few crowd favorites</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-sky-700">
            Shop all products
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Reveal>
    </>
  );
}
