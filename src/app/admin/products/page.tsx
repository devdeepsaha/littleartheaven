import type { Metadata } from "next";

import { getAdminProducts } from "@/lib/catalog";
import { requireAdminSession } from "@/lib/admin-auth";
import { hasSupabaseAdminConfig, hasSupabaseConfig } from "@/lib/supabase-server";

import { ProductForm } from "@/components/admin/product-form";
import { saveProductAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin catalog",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProductsPage() {
  if (hasSupabaseConfig()) {
    await requireAdminSession();
  }

  const products = await getAdminProducts();

  return (
    <section className="site-shell py-10">
      <div className="rounded-[2rem] bg-white px-6 py-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Product management</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-slate-900">
          Product catalog
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Upload product photos directly, compress them below 1 MB, store them in Supabase, and manage availability or sold-out status from one place.
        </p>
        {!hasSupabaseAdminConfig() ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            Preview mode: add full Supabase admin credentials to make catalog editing, uploads, and live product writes active.
          </div>
        ) : null}
      </div>

      <div className="mt-8">
        <ProductForm saveAction={saveProductAction} />
      </div>

      <div className="mt-8 grid gap-5">
        {products.map((product) => (
          <ProductForm key={product.id} product={product} saveAction={saveProductAction} />
        ))}
      </div>
    </section>
  );
}
