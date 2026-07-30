import type { Metadata, Viewport } from "next";
import { Nunito, Caveat } from "next/font/google";

import { CartProvider } from "@/components/providers/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RouteTransition } from "@/components/ui/route-transition";
import { business } from "@/data/site";
import { getSocialImageUrl, siteDescription, siteTitle, siteUrl, toAbsoluteUrl } from "@/lib/seo";

import "./globals.css";

const bodyFont = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Caveat({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700"],
});

const instagramUrl = `https://www.instagram.com/${business.instagramHandle}/`;
const managedByInstagramUrl = `https://www.instagram.com/${business.managedByInstagramHandle}/`;
const founderInstagramUrl = `https://www.instagram.com/${business.founderInstagramHandle}/`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  keywords: [
    "Little Art Heaven",
    "Srijita Nandy",
    "Srijita",
    "Srijita Nandy handmade gifts",
    "Little Art Heaven Instagram",
    "little_art_heavan",
    "artistic_srijita_009",
    "itz_srijita_008",
    "handmade gifts",
    "custom gifts",
    "custom frames",
    "memory lockets",
    "clay art gifts",
    "painted bags",
    "handmade gift shop",
  ],
  authors: [{ name: business.founderName }],
  creator: business.founderName,
  publisher: siteTitle,
  icons: {
    icon: [
      {
        url: business.logo,
        type: "image/jpeg",
      },
    ],
    shortcut: [business.logo],
    apple: [business.logo],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: siteTitle,
    images: [
      {
        url: getSocialImageUrl(),
        alt: `${siteTitle} social banner`,
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [getSocialImageUrl()],
    creator: `@${business.instagramHandle}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "PAYCmm-w6R0jL1vy_FvKzmcHT5874IS4KVVe1rbLXNQ",
  },
  category: "shopping",
};

export const viewport: Viewport = {
  themeColor: "#fff8f4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: business.name,
    alternateName: [business.founderName, ...business.founderAliases],
    url: siteUrl,
    logo: toAbsoluteUrl(business.logo),
    image: getSocialImageUrl(),
    founder: {
      "@type": "Person",
      name: business.founderName,
      alternateName: business.founderAliases,
      sameAs: [managedByInstagramUrl, founderInstagramUrl],
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: business.email,
    },
    sameAs: [
      `https://wa.me/${business.whatsappNumber}`,
      instagramUrl,
      managedByInstagramUrl,
      founderInstagramUrl,
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: business.name,
    url: siteUrl,
    description: siteDescription,
    publisher: {
      "@type": "Organization",
      name: business.name,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl(business.logo),
      },
    },
    about: {
      "@type": "Person",
      name: business.founderName,
      sameAs: [managedByInstagramUrl, founderInstagramUrl],
    },
  };

  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#fffdf7_0%,#fef2f2_26%,#eff6ff_100%)] text-slate-900">
            <SiteHeader />
            <main className="flex-1">
              {/* This lightweight route wrapper softens page swaps so the storefront feels continuous instead of a hard reload. */}
              <RouteTransition>{children}</RouteTransition>
            </main>
            <SiteFooter />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
