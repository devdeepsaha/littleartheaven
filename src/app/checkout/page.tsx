import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout-form";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Checkout",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage() {
  const products = await getProducts();
  return (
    <section className="site-shell py-10">
      <CheckoutForm products={products} />
    </section>
  );
}
