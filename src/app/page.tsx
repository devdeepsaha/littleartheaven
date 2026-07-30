import type { Metadata } from "next";
import Link from "next/link";

import { CategoryCard } from "@/components/category-card";
import { FounderStory } from "@/components/founder-story";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/ui/reveal";
import { business } from "@/data/site";
import { getCategories, getFeaturedProducts } from "@/lib/catalog";
import { getSocialImageUrl, siteTitle, siteUrl } from "@/lib/seo";

const homeTitle = "Little Art Heaven by Srijita Nandy";
const homeDescription = `${business.name} is a handmade gifting studio by ${business.founderName} offering custom frames, lockets, clay art, painted bags, and thoughtful keepsakes.`;

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: siteUrl,
    siteName: siteTitle,
    type: "website",
    images: [
      {
        url: getSocialImageUrl(),
        alt: "Little Art Heaven social banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: [getSocialImageUrl()],
  },
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
      <Reveal as="section" className="site-shell pt-2 pb-6" delay={40}>
        <div className="rounded-[1.7rem] border border-[#f0ddd2] bg-white/80 px-5 py-5 text-sm leading-7 text-slate-700 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
          <p>
            <strong>Little Art Heaven</strong> is the handmade gifting brand created by{" "}
            <strong>{business.founderName}</strong>. From custom frames and lockets to clay art and painted gifts, the studio is designed for people searching for thoughtful, personal pieces made with heart.
          </p>
          <Link href="/about-srijita-nandy" className="mt-3 inline-flex font-semibold text-sky-700">
            Read about {business.founderName}
          </Link>
        </div>
      </Reveal>
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
