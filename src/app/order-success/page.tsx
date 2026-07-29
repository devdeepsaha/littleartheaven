import type { Metadata } from "next";
import { OrderSuccessCard } from "@/components/order-success-card";

export const metadata: Metadata = {
  title: "Order placed",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; whatsapp?: string }>;
}) {
  const { code, whatsapp } = await searchParams;

  return <OrderSuccessCard code={code} whatsapp={whatsapp} />;
}
