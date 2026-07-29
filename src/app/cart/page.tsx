import type { Metadata } from "next";

import { CartPage } from "@/components/cart-page";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Cart",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CartScreen() {
  const products = await getProducts();

  return (
    <section className="site-shell py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Your picks</p>
        <h1 className="section-title mt-3 text-slate-900">Cart</h1>
      </div>
      <CartPage products={products} />
    </section>
  );
}
