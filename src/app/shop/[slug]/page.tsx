import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { getCategoryBySlug, getProducts } from "@/lib/catalog";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const products = await getProducts({ categorySlug: slug });

  return (
    <section className="site-shell py-10">
      <div className="rounded-[2.25rem] bg-white/80 px-6 py-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Category</p>
        <h1 className="section-title mt-3 text-slate-900">{category.name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          {category.description}
        </p>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
