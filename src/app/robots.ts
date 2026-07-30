import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/product/", "/about-srijita-nandy", "/terms-and-conditions", "/privacy-policy", "/refund-policy", "/help-and-support"],
        disallow: ["/admin", "/api", "/cart", "/checkout", "/order-success"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
