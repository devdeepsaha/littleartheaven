"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type MobileNavDrawerProps = {
  logo: string;
  brandName: string;
};

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about-srijita-nandy", label: "Myself" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/help-and-support", label: "Help and Support" },
];

export function MobileNavDrawer({ logo, brandName }: MobileNavDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#edd6c8] bg-white text-slate-800 shadow-sm transition hover:bg-[#fff7f2]"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <div className="flex flex-col gap-1">
          <span
            className={`block h-0.5 w-4 rounded-full bg-current transition ${open ? "translate-y-[6px] rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-4 rounded-full bg-current transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-4 rounded-full bg-current transition ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
          />
        </div>
      </button>

      <div
        className={`fixed inset-0 z-[65] bg-[rgba(15,23,42,0.16)] transition duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-nav-drawer"
        className={`fixed inset-x-3 top-24 z-[70] rounded-[2rem] border border-[#f0e3d8] bg-white/98 p-4 shadow-[0_26px_60px_rgba(15,23,42,0.18)] backdrop-blur transition duration-300 ease-[var(--motion-ease-standard)] ${open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"}`}
      >
        <div className="flex items-center gap-3 rounded-[1.4rem] bg-[#fff7f2] px-3 py-3">
          <Image
            src={logo}
            alt={brandName}
            width={40}
            height={40}
            className="rounded-full border border-[#f1ddd2]"
          />
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
              Menu
            </p>
            <p className="font-[family-name:var(--font-display)] text-xl text-slate-900">
              {brandName}
            </p>
          </div>
        </div>

        <nav className="mt-4 grid gap-2">
          {menuLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-[1.35rem] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#fff7f2] hover:text-slate-900"
              style={{ transitionDelay: open ? `${index * 35}ms` : "0ms" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
