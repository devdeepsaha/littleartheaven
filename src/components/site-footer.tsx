"use client";

import Link from "next/link";

import { business } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="site-shell pb-10 pt-14">
      <div className="grid gap-8 rounded-[2rem] bg-slate-900 px-6 py-10 text-slate-100 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Little Art Heaven</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl">
            Handmade gifts with heart.
          </h2>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Quick Links
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/shop">Shop</Link>
            <Link href="/terms-and-conditions">Terms and Conditions</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/refund-policy">Refund Policy</Link>
            <Link href="/help-and-support">Help and Support</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Contact
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>{business.email}</p>
            <a
              href={`https://wa.me/${business.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp orders
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
