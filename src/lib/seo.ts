import { business } from "@/data/site";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://littleartheaven.vercel.app";
export const siteTitle = "Little Art Heaven";
export const siteDescription =
  "Little Art Heaven by Srijita Nandy offers handmade gifts, custom frames, lockets, clay art, painted bags, and thoughtful keepsakes.";

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
  return toAbsoluteUrl(business.socialImage || business.logo);
}
