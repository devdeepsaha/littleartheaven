import { business } from "@/data/site";
import { FounderPortrait } from "@/components/founder-portrait";
import { Reveal } from "@/components/ui/reveal";

export function FounderStory() {
  return (
    <Reveal as="section" className="site-shell py-14">
      <div className="grid gap-6 rounded-[2.5rem] border border-[#f2dccd] bg-[linear-gradient(135deg,#fffaf4_0%,#fff1ec_52%,#f8fbf6_100%)] px-6 py-8 text-slate-900 shadow-[0_24px_70px_rgba(149,115,92,0.12)] lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div className="grid gap-4">
          <FounderPortrait src={business.founderImage} name={business.founderName} />
          <div className="rounded-[1.9rem] border border-[#ecd3c1] bg-[linear-gradient(180deg,#fff8ef_0%,#fde9df_100%)] p-6 shadow-[0_14px_40px_rgba(214,160,130,0.16)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c9795d]">
              Founder story
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#7c4c3f]">
              Meet {business.founderName}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              {business.founderBio}
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.9rem] border border-[#d8e6df] bg-[linear-gradient(180deg,#f7fffc_0%,#edf8f2_100%)] p-6 shadow-[0_14px_40px_rgba(115,160,136,0.12)]">
            <p className="text-sm uppercase tracking-[0.3em] text-[#5b9076]">What the brand leads with</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              <li>Thoughtful gifting rooted in handmade detail</li>
              <li>Bright, cheerful, personality-first visuals</li>
              <li>Custom-friendly products that feel special and memorable</li>
            </ul>
          </div>
          <div className="rounded-[1.9rem] border border-[#f0d9d6] bg-[linear-gradient(180deg,#fff8fa_0%,#feeeef_100%)] p-6 shadow-[0_14px_40px_rgba(207,144,144,0.12)]">
            <p className="text-sm uppercase tracking-[0.3em] text-[#cc7b84]">What customers can expect</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              <li>Easy browsing and cart ordering</li>
              <li>Manual WhatsApp follow-up for personal coordination</li>
              <li>Fast admin updates whenever new products are ready</li>
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
