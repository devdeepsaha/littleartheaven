import type { Metadata } from "next";
import Link from "next/link";

import { FounderPortrait } from "@/components/founder-portrait";
import { business } from "@/data/site";
import { getSocialImageUrl, siteTitle, toAbsoluteUrl } from "@/lib/seo";

const pageTitle = `${business.founderName} | Founder of ${siteTitle}`;
const pageDescription =
  `${business.founderName} is the founder of Little Art Heaven, an online handmade gifting studio creating custom frames, lockets, clay art, painted gifts, and keepsakes.`;
const canonical = `${toAbsoluteUrl("/about-srijita-nandy")}`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical,
  },
  openGraph: {
    type: "profile",
    title: pageTitle,
    description: pageDescription,
    url: canonical,
    siteName: siteTitle,
    images: [
      {
        url: getSocialImageUrl(),
        alt: `${siteTitle} brand image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [getSocialImageUrl()],
  },
};

export default function AboutSrijitaNandyPage() {
  const managedByInstagramUrl = `https://www.instagram.com/${business.managedByInstagramHandle}/`;
  const founderInstagramUrl = `https://www.instagram.com/${business.founderInstagramHandle}/`;

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${business.founderName} | ${siteTitle}`,
    url: canonical,
    mainEntity: {
      "@type": "Person",
      name: business.founderName,
      alternateName: business.founderAliases,
      description: business.founderBio,
      image: toAbsoluteUrl(business.founderImage || business.logo),
      jobTitle: `Founder of ${business.name}`,
      worksFor: {
        "@type": "Organization",
        name: business.name,
        url: toAbsoluteUrl("/"),
      },
      sameAs: [managedByInstagramUrl, founderInstagramUrl],
    },
  };

  return (
    <section className="site-shell py-8 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <div className="rounded-[2.2rem] border border-[#f0ddd2] bg-[linear-gradient(180deg,#fffdf9_0%,#fff7f0_52%,#ffffff_100%)] p-5 shadow-[0_22px_60px_rgba(15,23,42,0.08)] sm:p-7 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="grid gap-4">
            <FounderPortrait
              src={business.founderImage}
              name={`${business.founderName}, founder of ${business.name}`}
            />
            <div className="rounded-[1.6rem] border border-[#ecd8cb] bg-white/90 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#c9795d]">
                Founder profile
              </p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-none text-slate-900">
                {business.founderName}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Founder of Little Art Heaven, an online handmade gifting studio focused on custom keepsakes and bright, memory-filled pieces.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.8rem] border border-[#f0ddd2] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
                About the founder
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-slate-900 sm:text-[3.5rem]">
                Meet {business.founderName}
              </h1>
              <p className="mt-4 text-base leading-8 text-slate-700">
                {business.story}
              </p>
              <p className="mt-4 text-base leading-8 text-slate-700">
                {business.founderName} runs {business.name} as a personal online brand for handmade gifting, custom frames, lockets, clay art, painted accessories, and one-of-a-kind keepsakes made for birthdays, thank-yous, and meaningful moments.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-[#e8efe9] bg-[#f7fffb] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-[#5b9076]">
                  Brand identity
                </p>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
                  <div className="rounded-[1.1rem] bg-white/80 px-4 py-3">
                    Little Art Heaven by {business.founderName}
                  </div>
                  <div className="rounded-[1.1rem] bg-white/80 px-4 py-3">
                    Handmade gifts, custom keepsakes, and cheerful memory pieces
                  </div>
                  <div className="rounded-[1.1rem] bg-white/80 px-4 py-3">
                    Managed personally through Instagram, the website, and WhatsApp follow-up
                  </div>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-[#f0ddd2] bg-[#fffaf7] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-[#b66b5a]">
                  Official links
                </p>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
                  <a className="rounded-[1.1rem] bg-white px-4 py-3 hover:bg-[#fff2ea]" href={managedByInstagramUrl} target="_blank" rel="noreferrer">
                    Instagram manager account: @{business.managedByInstagramHandle}
                  </a>
                  <a className="rounded-[1.1rem] bg-white px-4 py-3 hover:bg-[#fff2ea]" href={founderInstagramUrl} target="_blank" rel="noreferrer">
                    Founder Instagram: @{business.founderInstagramHandle}
                  </a>
                  <Link className="rounded-[1.1rem] bg-white px-4 py-3 hover:bg-[#fff2ea]" href="/shop">
                    Explore the Little Art Heaven shop
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
