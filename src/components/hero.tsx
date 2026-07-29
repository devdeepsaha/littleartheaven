"use client";

import type { CSSProperties } from "react";
import Link from "next/link";

import { business } from "@/data/site";
import { resolveStoredAssetUrl } from "@/lib/storage";
import { motionTokens, ms } from "@/lib/motion";
import { MotionImage } from "@/components/ui/motion-image";

export function Hero() {
  return (
    <section className="site-shell pt-8">
      <div className="grid gap-6 rounded-[2.1rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,246,255,0.93)),radial-gradient(circle_at_top_left,rgba(251,191,36,0.32),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.25),transparent_28%),radial-gradient(circle_at_center,rgba(244,114,182,0.18),transparent_38%)] px-5 py-6 shadow-[0_24px_65px_rgba(15,23,42,0.1)] lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-8">
        <div className="space-y-6">
          {/* This staggered intro guides the eye from brand context to action without a dramatic hero slide. */}
          <span
            className="hero-stagger inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 shadow-sm"
            style={{ "--stagger-delay": ms(0) } as CSSProperties}
          >
            Handmade gifting studio
          </span>
          <div className="space-y-5">
            <h2
              className="hero-stagger max-w-2xl font-[family-name:var(--font-display)] text-4xl leading-[1.02] text-slate-900 md:text-5xl"
              style={{ "--stagger-delay": ms(motionTokens.stagger.fast) } as CSSProperties}
            >
              Gifts that feel personal, playful, and made just for the moment.
            </h2>
            <p
              className="hero-stagger max-w-2xl text-base leading-7 text-slate-700"
              style={{ "--stagger-delay": ms(motionTokens.stagger.standard * 2) } as CSSProperties}
            >
              {business.story}
            </p>
          </div>
          <div
            className="hero-stagger flex flex-wrap gap-4"
            style={{ "--stagger-delay": ms(motionTokens.stagger.standard * 3) } as CSSProperties}
          >
            <Link
              href="/shop"
              className="rounded-full bg-[linear-gradient(135deg,#f7c9b0_0%,#e89a8f_100%)] px-6 py-3 text-sm font-semibold text-[#5b312d] shadow-[0_12px_30px_rgba(213,147,124,0.24)] transition hover:brightness-[1.03]"
            >
              Browse the shop
            </Link>
            <a
              href={`https://wa.me/${business.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div
            className="hero-stagger grid gap-3 md:grid-cols-3"
            style={{ "--stagger-delay": ms(motionTokens.stagger.standard * 4) } as CSSProperties}
          >
            {[
              "Frames, lockets, clay art, bags, and custom keepsakes",
              "Cart-based ordering with WhatsApp follow-up",
              "Built for one-person business flow and easy updates",
            ].map((item) => (
              <div key={item} className="rounded-[1.25rem] bg-white/75 p-3.5 text-sm leading-5 text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          <div className="relative min-h-[280px] overflow-hidden rounded-[1.7rem] bg-white/80 p-3">
            <MotionImage
              src={resolveStoredAssetUrl("/assets/products/starry-night-bag.jpeg")}
              alt="Starry Night Bag"
              fill
              sizes="(max-width: 1024px) 100vw, 34vw"
              priority
              quality={76}
              wrapperClassName="h-full w-full rounded-[1.2rem] overflow-hidden"
              className="object-cover transition duration-500 hover:scale-[1.03]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative min-h-[140px] overflow-hidden rounded-[1.25rem] bg-white/80">
              <MotionImage
                src={resolveStoredAssetUrl("/assets/products/custom-locket.jpeg")}
                alt="Memory Locket"
                fill
                sizes="(max-width: 1024px) 50vw, 18vw"
                quality={70}
                wrapperClassName="h-full w-full"
                className="object-cover transition duration-500 hover:scale-[1.03]"
              />
            </div>
            <div className="relative min-h-[140px] overflow-hidden rounded-[1.25rem] bg-white/80">
              <MotionImage
                src={business.logo}
                alt={business.name}
                fill
                sizes="(max-width: 1024px) 50vw, 18vw"
                quality={68}
                wrapperClassName="h-full w-full"
                className="object-cover transition duration-500 hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
