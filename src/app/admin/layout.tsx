import { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { categories, business } from "@/data/site";
import { getAdminProducts } from "@/lib/catalog";
import { hasSupabaseConfig } from "@/lib/supabase-server";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const products = await getAdminProducts();
  const productGroups = categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    products: products
      .filter((product) => product.categoryId === category.id)
      .map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
      })),
  }));

  return (
    <AdminShell
      brandName={business.name}
      brandLogo={business.logo}
      showLogout={hasSupabaseConfig()}
      productGroups={productGroups}
    >
      {children}
    </AdminShell>
  );
}
