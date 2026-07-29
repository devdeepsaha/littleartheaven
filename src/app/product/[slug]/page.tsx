import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/product-detail-view";
import { getProductBySlug } from "@/lib/catalog";

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

  return <ProductDetailView product={product} />;
}
