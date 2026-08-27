"use client";

import { ReactNode, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/admin/logout-button";

type AdminShellProps = {
  brandName: string;
  brandLogo: string;
  showLogout: boolean;
  productGroups: {
    id: string;
    slug: string;
    name: string;
    products: {
      id: string;
      slug: string;
      name: string;
    }[];
  }[];
  children: ReactNode;
};

const primaryLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

function SidebarLinks({
  pathname,
  productGroups,
  onNavigate,
}: {
  pathname: string;
  productGroups: AdminShellProps["productGroups"];
  onNavigate?: () => void;
}) {
  return (
    <>
      <nav className="grid gap-2">
        {primaryLinks.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`rounded-[1.2rem] px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-[linear-gradient(135deg,#f7c9b0_0%,#e89a8f_100%)] text-[#5b312d] shadow-[0_12px_30px_rgba(213,147,124,0.2)]"
                  : "text-slate-700 hover:bg-[#fff5ef]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Categories
        </p>
        <div className="mt-3 grid gap-3">
          {productGroups.map((group) => (
            <details
              key={group.id}
              open={pathname.startsWith("/admin/products")}
              className="rounded-[1.2rem] border border-[#f0e0d5] bg-[#fffaf7]"
            >
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <span>{group.name}</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    {group.products.length}
                  </span>
                </div>
              </summary>
              <div className="border-t border-[#f0e6de] px-3 py-3">
                <div className="grid gap-1">
                  <Link
                    href={`/admin/products#category-${group.slug}`}
                    onClick={onNavigate}
                    className="rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#b46f5f] transition hover:bg-white"
                  >
                    Open section
                  </Link>
                  {group.products.length ? (
                    group.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/admin/products#product-${product.slug}`}
                        onClick={onNavigate}
                        className="rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-white hover:text-slate-900"
                      >
                        {product.name}
                      </Link>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-slate-400">
                      No products yet
                    </p>
                  )}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}

export function AdminShell({
  brandName,
  brandLogo,
  showLogout,
  productGroups,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentTitle = useMemo(() => {
    if (pathname.startsWith("/admin/products")) {
      return "Product Studio";
    }
    if (pathname.startsWith("/admin/orders")) {
      return "Orders";
    }
    if (pathname.startsWith("/admin/login")) {
      return "Admin Login";
    }
    return "Dashboard";
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(247,201,176,0.22),transparent_30%),linear-gradient(180deg,#fffdf9_0%,#fff6f1_36%,#f8fbff_100%)]">
      <div className="mx-auto flex w-full max-w-[1480px] gap-6 px-3 py-3 sm:px-4 lg:px-6">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-[290px] shrink-0 overflow-hidden rounded-[2rem] border border-white/70 bg-white/92 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur lg:flex lg:flex-col">
          <div className="flex items-center gap-3 rounded-[1.4rem] bg-[linear-gradient(135deg,#fff8f3_0%,#fff1ea_100%)] px-3 py-3">
            <Image
              src={brandLogo}
              alt={brandName}
              width={48}
              height={48}
              className="rounded-full border border-[#efd7c8]"
            />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                Admin Studio
              </p>
              <p className="truncate font-[family-name:var(--font-display)] text-2xl text-slate-900">
                {brandName}
              </p>
            </div>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto pr-1">
            <SidebarLinks pathname={pathname} productGroups={productGroups} />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.3rem] border border-[#f0e0d5] bg-[#fffaf7] px-4 py-3">
            <Link href="/" className="text-sm font-semibold text-slate-700">
              View store
            </Link>
            {showLogout ? <LogoutButton /> : null}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="sticky top-3 z-40 mb-5 rounded-[1.8rem] border border-white/70 bg-white/92 px-4 py-3 shadow-[0_18px_46px_rgba(15,23,42,0.1)] backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src={brandLogo}
                  alt={brandName}
                  width={42}
                  height={42}
                  className="rounded-full border border-[#efd7c8]"
                />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    {currentTitle}
                  </p>
                  <p className="truncate font-[family-name:var(--font-display)] text-2xl text-slate-900">
                    {brandName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-expanded={mobileOpen}
                aria-controls="admin-mobile-drawer"
                onClick={() => setMobileOpen((current) => !current)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#edd6c8] bg-white text-slate-800 shadow-sm transition hover:bg-[#fff7f2]"
              >
                <span className="sr-only">
                  {mobileOpen ? "Close admin menu" : "Open admin menu"}
                </span>
                <div className="flex flex-col gap-1">
                  <span className={`block h-0.5 w-4 rounded-full bg-current transition ${mobileOpen ? "translate-y-[6px] rotate-45" : ""}`} />
                  <span className={`block h-0.5 w-4 rounded-full bg-current transition ${mobileOpen ? "opacity-0" : ""}`} />
                  <span className={`block h-0.5 w-4 rounded-full bg-current transition ${mobileOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
                </div>
              </button>
            </div>
          </div>

          <div
            className={`fixed inset-0 z-[65] bg-[rgba(15,23,42,0.24)] transition duration-300 lg:hidden ${
              mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <div
            id="admin-mobile-drawer"
            className={`fixed inset-y-3 left-3 z-[70] w-[min(340px,calc(100vw-1.5rem))] overflow-hidden rounded-[2rem] border border-white/70 bg-white/98 p-4 shadow-[0_26px_60px_rgba(15,23,42,0.18)] backdrop-blur transition duration-300 ease-[var(--motion-ease-standard)] lg:hidden ${
              mobileOpen ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0"
            }`}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-3 rounded-[1.4rem] bg-[#fff7f2] px-3 py-3">
                <Image
                  src={brandLogo}
                  alt={brandName}
                  width={42}
                  height={42}
                  className="rounded-full border border-[#f1ddd2]"
                />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    Admin Menu
                  </p>
                  <p className="truncate font-[family-name:var(--font-display)] text-2xl text-slate-900">
                    {brandName}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex-1 overflow-y-auto pr-1">
                <SidebarLinks
                  pathname={pathname}
                  productGroups={productGroups}
                  onNavigate={() => setMobileOpen(false)}
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.2rem] border border-[#f0e0d5] bg-[#fffaf7] px-4 py-3">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-slate-700"
                >
                  View store
                </Link>
                {showLogout ? <LogoutButton /> : null}
              </div>
            </div>
          </div>

          <div className="pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
