import Link from "next/link";

import { FounderPhotoPanel } from "@/components/admin/founder-photo-panel";
import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAllOrders } from "@/lib/orders";
import { hasSupabaseConfig } from "@/lib/supabase-server";
import { getProducts } from "@/lib/catalog";

export default async function AdminHome() {
  if (hasSupabaseConfig()) {
    await requireAdminSession();
  }

  const [orders, products] = await Promise.all([getAllOrders(), getProducts()]);

  return (
    <section className="site-shell py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2.25rem] bg-slate-900 px-6 py-8 text-white shadow-[0_22px_60px_rgba(15,23,42,0.2)]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Admin panel</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl">
            Little Art Heaven dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Manage products, review order requests, and keep Srijita&apos;s storefront up to date.
          </p>
        </div>
        {hasSupabaseConfig() ? <LogoutButton /> : null}
      </div>

      {!hasSupabaseConfig() ? (
        <div className="mt-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
          Supabase is not configured yet, so this dashboard is running in preview mode using seeded catalog data and local mock orders.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { label: "Products", value: products.length.toString() },
          { label: "Orders", value: orders.length.toString() },
          {
            label: "Status",
            value: hasSupabaseConfig() ? "Live data" : "Preview mode",
          },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <FounderPhotoPanel />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Link href="/admin/products" className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-900">Manage products</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Review seeded items, add products, and update pricing or publish status when Supabase is connected.
          </p>
        </Link>
        <Link href="/admin/orders" className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-900">Manage orders</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Track inquiries, contact customers, and update the order workflow from new to completed.
          </p>
        </Link>
      </div>
    </section>
  );
}
