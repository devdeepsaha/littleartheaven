import { unstable_cache } from "next/cache";

import { categories, seededProducts } from "@/data/site";
import {
  createSupabaseAdminClient,
  hasSupabaseConfig,
} from "@/lib/supabase-server";
import { resolveStoredAssetUrl } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { Category, Product, ProductWithCategory } from "@/types";

function resolveProductImages(product: Product): Product {
  return {
    ...product,
    images: product.images.map(resolveStoredAssetUrl),
  };
}

function withCategory(products: Product[]): ProductWithCategory[] {
  return products
    .map((product) => {
      const category = categories.find((item) => item.id === product.categoryId);

      if (!category) {
        return null;
      }

      return {
        ...product,
        category,
      };
    })
    .filter(Boolean) as ProductWithCategory[];
}

function normalizeSupabaseProduct(row: {
  id: string;
  slug: string;
  category_id: string;
  name: string;
  price: number;
  description: string | null;
  short_description: string | null;
  image_urls: string[] | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  is_available: boolean | null;
  tags: string[] | null;
}): Product {
  return {
    id: row.id,
    slug: row.slug || slugify(row.name),
    categoryId: row.category_id,
    name: row.name,
    price: row.price,
    description: row.description || "",
    shortDescription: row.short_description || row.description || "",
    images: row.image_urls?.length ? row.image_urls : ["/assets/brand/logo.jpg"],
    featured: Boolean(row.is_featured),
    published: row.is_published ?? true,
    available: row.is_available ?? true,
    tags: row.tags || [],
  };
}

export const publicCatalogTag = "public-catalog";

const getCachedPublicProducts = unstable_cache(
  async (): Promise<Product[]> => {
    let products = seededProducts.filter((product) => product.published);

    if (!hasSupabaseConfig()) {
      return products.map(resolveProductImages);
    }

    try {
      const supabase = await createSupabaseAdminClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (data?.length) {
        products = data.map(normalizeSupabaseProduct);
      }
    } catch {
      products = seededProducts.filter((product) => product.published);
    }

    return products.map(resolveProductImages);
  },
  ["public-catalog-products"],
  {
    revalidate: 3600,
    tags: [publicCatalogTag],
  },
);

export async function getCategories() {
  const publicProducts = await getCachedPublicProducts();

  const items = categories.map((category) => {
    const productCount = publicProducts.filter(
      (product) => product.categoryId === category.id && product.published,
    ).length;

    return {
      ...category,
      productCount,
    };
  });

  return items;
}

export async function getProducts(options?: {
  categorySlug?: string;
  featuredOnly?: boolean;
}) {
  let products = await getCachedPublicProducts();

  if (options?.categorySlug) {
    const category = categories.find((item) => item.slug === options.categorySlug);
    products = category
      ? products.filter((product) => product.categoryId === category.id)
      : [];
  }

  if (options?.featuredOnly) {
    products = products.filter((product) => product.featured);
  }

  return withCategory(products);
}

export async function getAdminProducts() {
  let products = seededProducts;

  if (hasSupabaseConfig()) {
    try {
      const supabase = await createSupabaseAdminClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (data?.length) {
        products = data.map(normalizeSupabaseProduct);
      }
    } catch {
      products = seededProducts;
    }
  }

  return withCategory(products.map(resolveProductImages));
}

export async function getFeaturedProducts() {
  return getProducts({ featuredOnly: true });
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return categories.find((category) => category.slug === slug) || null;
}

export async function getProductsBySlugs(slugs: string[]) {
  const products = await getProducts();
  return products.filter((product) => slugs.includes(product.slug));
}
