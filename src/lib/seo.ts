import { business } from "@/data/site";

function normalizeSiteUrl(url?: string) {
  const fallback = "https://littleartheaven.vercel.app";
  const raw = url?.trim();

  if (!raw) {
    return fallback;
  }

  const withProtocol = raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;

  try {
    const parsed = new URL(withProtocol);

    if (parsed.hostname === "littleartheaven.vercel.app") {
      parsed.protocol = "https:";
    }

    return parsed.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const siteTitle = "Little Art Heaven";
export const siteDescription =
  "Little Art Heaven by Srijita Nandy offers handmade gifts, custom frames, lockets, clay art, painted bags, and thoughtful keepsakes.";
const socialImageVersion = "v2";

export function toAbsoluteUrl(url: string) {
  if (!url) {
    return siteUrl;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return new URL(url, siteUrl).toString();
}

export function getSocialImageUrl() {
  const url = new URL(toAbsoluteUrl(business.socialImage || business.logo));
  url.searchParams.set("v", socialImageVersion);
  return url.toString();
}
