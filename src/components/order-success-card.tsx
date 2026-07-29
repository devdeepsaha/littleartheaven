"use client";

import Link from "next/link";

export function OrderSuccessCard({
  code,
  whatsapp,
}: {
  code?: string;
  whatsapp?: string;
}) {
  return (
    <section className="site-shell py-16">
      <div className="mx-auto max-w-2xl rounded-[2.25rem] bg-white px-6 py-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Order placed</p>
        <div className="mt-3 flex justify-center gap-3 text-lg text-[#e28779]">
          <span className="floating-sparkle">✦</span>
          <span className="floating-sparkle" style={{ animationDelay: "320ms" }}>
            ✦
          </span>
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-slate-900">
          Thank you for ordering
        </h1>
        {/* A soft pop on the reference number marks the emotional handoff from browsing into a real placed order. */}
        <p className="success-pop mt-5 rounded-full bg-[#fff8f4] px-5 py-3 text-base font-semibold text-[#7c4c3f]">
          Order reference: {code || "generated at checkout"}
        </p>
        <p className="mt-4 text-base leading-8 text-slate-700">
          Srijita will receive the order by email. You can continue the conversation on WhatsApp for confirmation and delivery details.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[linear-gradient(135deg,#f7c9b0_0%,#e89a8f_100%)] px-6 py-3 text-sm font-semibold text-[#5b312d] shadow-[0_12px_30px_rgba(213,147,124,0.24)] transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.03]"
            >
              Continue on WhatsApp
            </a>
          ) : null}
          <Link
            href="/shop"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition duration-200 hover:bg-[#fff8f4]"
          >
            Keep browsing
          </Link>
        </div>
      </div>
    </section>
  );
}
