import type { Metadata } from "next";

import { getAdminProducts } from "@/lib/catalog";
import { requireAdminSession } from "@/lib/admin-auth";
import { hasSupabaseAdminConfig, hasSupabaseConfig } from "@/lib/supabase-server";

import { ProductEditorList } from "@/components/admin/product-editor-list";
import { ProductForm } from "@/components/admin/product-form";

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
    <section className="space-y-8">
      <div className="rounded-[2.2rem] border border-white/70 bg-white/88 px-6 py-7 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Product management</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-slate-900">
          Product studio
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Add new products, upload photos directly to Supabase, and keep existing catalog entries neatly tucked into category sections until you need to edit them.
        </p>
        {!hasSupabaseAdminConfig() ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            Preview mode: add full Supabase admin credentials to make catalog editing, uploads, and live product writes active.
          </div>
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-[#f0ddd2] bg-[linear-gradient(135deg,#fffaf5_0%,#fff4ee_100%)] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-5">
        <ProductForm />
      </div>

      <ProductEditorList products={products} />
    </section>
  );
}
