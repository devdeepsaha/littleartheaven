import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { getProductBySlug } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://littleartheaven.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  const title = `${product.name} | Little Art Heaven`;
  const description = product.shortDescription || product.description;
  const canonical = `${siteUrl}/product/${product.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Little Art Heaven",
      type: "website",
      images: product.images[0]
        ? [
            {
              url: product.images[0],
              alt: product.name,
            },
          ]
        : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="site-shell py-10">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="grid gap-4 bg-white p-3 sm:p-4">
            <div className="relative min-h-[320px] overflow-hidden rounded-[1.65rem] bg-[#f8fafc] sm:min-h-[420px]">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                quality={78}
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {product.images.slice(1).map((image) => (
                <div
                  key={image}
                  className="relative min-h-[120px] overflow-hidden rounded-[1.2rem] bg-[#f8fafc] sm:min-h-[150px]"
                >
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 18vw"
                    quality={68}
                    className="object-cover"
                  />
                </div>
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
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600"
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
