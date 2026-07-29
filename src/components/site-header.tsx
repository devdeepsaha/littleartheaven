import Link from "next/link";
import Image from "next/image";

import { business } from "@/data/site";
import { CartCount } from "@/components/cart-count";

export async function SiteHeader() {
  return (
    <header className="site-shell sticky top-3 z-50 pt-3">
      <div className="rounded-[2rem] border border-white/70 bg-white/92 px-4 py-3 shadow-[0_20px_50px_rgba(31,41,55,0.12)] backdrop-blur">
        <div className="hidden xl:flex xl:items-center xl:justify-between xl:gap-4">
          <Link href="/" className="flex items-center gap-3 self-start">
            <Image
              src={business.logo}
              alt={business.name}
              width={56}
              height={56}
              className="rounded-full border border-sky-100"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Creative Studio
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
                {business.name}
              </h1>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700 xl:justify-end">
            <Link
              href="/"
              className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="ml-1 inline-flex items-center gap-2 rounded-full border border-[#efcfbf] bg-[linear-gradient(135deg,#f7c9b0_0%,#e89a8f_100%)] px-4 py-2.5 text-sm font-semibold text-[#5b312d] shadow-[0_12px_30px_rgba(213,147,124,0.28)] transition hover:brightness-[1.03]"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff5ef] text-[#b66b5a] ring-1 ring-[#eab9a4]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="20" r="1.5" />
                  <circle cx="18" cy="20" r="1.5" />
                  <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H7" />
                </svg>
              </span>
              <span>Cart</span>
              <CartCount />
            </Link>
          </nav>
        </div>

        <div className="xl:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <Image
                src={business.logo}
                alt={business.name}
                width={44}
                height={44}
                className="rounded-full border border-sky-100"
              />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  Creative Studio
                </p>
                <h1 className="truncate font-[family-name:var(--font-display)] text-xl text-slate-900">
                  {business.name}
                </h1>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-full border border-[#efcfbf] bg-[linear-gradient(135deg,#f7c9b0_0%,#e89a8f_100%)] px-3 py-2 text-xs font-semibold text-[#5b312d] shadow-[0_12px_30px_rgba(213,147,124,0.22)]"
              >
                <span>Cart</span>
                <CartCount />
              </Link>

              <details className="group relative">
                <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-[#edd6c8] bg-white text-slate-800 shadow-sm transition hover:bg-[#fff7f2]">
                  <span className="sr-only">Open menu</span>
                  <div className="flex flex-col gap-1">
                    <span className="block h-0.5 w-4 rounded-full bg-current" />
                    <span className="block h-0.5 w-4 rounded-full bg-current" />
                    <span className="block h-0.5 w-4 rounded-full bg-current" />
                  </div>
                </summary>
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-60 rounded-[1.5rem] border border-[#f0e3d8] bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
                  <nav className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                    <Link href="/" className="rounded-2xl px-4 py-3 transition hover:bg-slate-50">
                      Home
                    </Link>
                    <Link
                      href="/shop"
                      className="rounded-2xl px-4 py-3 transition hover:bg-slate-50"
                    >
                      Shop
                    </Link>
                  </nav>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
