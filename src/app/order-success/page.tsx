import type { Metadata } from "next";
import Link from "next/link";

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

  return (
    <section className="site-shell py-16">
      <div className="mx-auto max-w-2xl rounded-[2.25rem] bg-white px-6 py-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Order placed</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-slate-900">
          Thank you for ordering
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-700">
          Your order reference is <strong>{code || "generated at checkout"}</strong>.
          Srijita will receive the order by email. You can continue the conversation on WhatsApp for confirmation and delivery details.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[linear-gradient(135deg,#f7c9b0_0%,#e89a8f_100%)] px-6 py-3 text-sm font-semibold text-[#5b312d] shadow-[0_12px_30px_rgba(213,147,124,0.24)]"
            >
              Continue on WhatsApp
            </a>
          ) : null}
          <Link
            href="/shop"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800"
          >
            Keep browsing
          </Link>
        </div>
      </div>
    </section>
  );
}
