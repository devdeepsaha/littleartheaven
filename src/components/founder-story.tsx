import { business } from "@/data/site";
import { FounderPortrait } from "@/components/founder-portrait";
import { Reveal } from "@/components/ui/reveal";
import Link from "next/link";

export function FounderStory() {
  return (
    <Reveal as="section" className="site-shell py-14">
      <div className="rounded-[2.5rem] border border-[#f2dccd] bg-[linear-gradient(135deg,#fffaf4_0%,#fff1ec_42%,#f7fcf8_100%)] px-5 py-6 text-slate-900 shadow-[0_24px_70px_rgba(149,115,92,0.12)] sm:px-6 sm:py-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
          <div className="grid gap-4">
            <FounderPortrait src={business.founderImage} name={business.founderName} />
            <div className="rounded-[1.6rem] border border-[#ecd3c1] bg-[linear-gradient(180deg,#fff8ef_0%,#feece2_100%)] p-5 shadow-[0_14px_36px_rgba(214,160,130,0.16)]">
              <p className="text-xs uppercase tracking-[0.32em] text-[#c9795d]">
                Founder note
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-none text-[#7c4c3f]">
                Handmade with heart, always.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Every Little Art Heaven piece is made to feel personal, bright, and worth keeping.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.9rem] border border-[#f0ddd2] bg-white/82 p-6 shadow-[0_14px_40px_rgba(149,115,92,0.1)]">
              <p className="text-xs uppercase tracking-[0.35em] text-[#c9795d]">
                Creator story
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h2 className="font-[family-name:var(--font-display)] text-4xl text-[#7c4c3f] sm:text-[3.35rem]">
                  Meet {business.founderName}
                </h2>
                <span className="rounded-full bg-[#fff1ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b66b5a]">
                  Little Art Heaven
                </span>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 sm:text-[15px]">
                {business.founderBio}
              </p>
              <div className="mt-4">
                <Link href="/about-srijita-nandy" className="text-sm font-semibold text-sky-700">
                  Learn more about {business.founderName}
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {[
                  "Handmade details",
                  "Custom gifting",
                  "Cheerful design",
                  "Made for memories",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#efd8c9] bg-[#fffaf7] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.7rem] border border-[#d8e6df] bg-[linear-gradient(180deg,#f7fffc_0%,#edf8f2_100%)] p-5 shadow-[0_14px_32px_rgba(115,160,136,0.1)]">
                <p className="text-xs uppercase tracking-[0.28em] text-[#5b9076]">
                  What the brand leads with
                </p>
                <div className="mt-4 grid gap-3">
                  {[
                    "Thoughtful gifting rooted in handmade detail",
                    "Bright, cheerful, personality-first visuals",
                    "Custom-friendly products that feel personal and memorable",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.15rem] bg-white/72 px-4 py-3 text-sm leading-6 text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.7rem] border border-[#f0d9d6] bg-[linear-gradient(180deg,#fff8fa_0%,#feeeef_100%)] p-5 shadow-[0_14px_32px_rgba(207,144,144,0.1)]">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#cc7b84]">
                    Customer experience
                  </p>
                  <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
                    <div className="rounded-[1.15rem] bg-white/72 px-4 py-3">
                      Easy browsing and cart ordering
                    </div>
                    <div className="rounded-[1.15rem] bg-white/72 px-4 py-3">
                      Personal WhatsApp follow-up for custom coordination
                    </div>
                    <div className="rounded-[1.15rem] bg-white/72 px-4 py-3">
                      Fast, one-person studio updates whenever new pieces are ready
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.7rem] border border-[#f0e2d7] bg-[#fffdf9] px-5 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-500">
                    Why this section works
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    A real face, a short founder note, and a quick sense of what the brand feels like.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
