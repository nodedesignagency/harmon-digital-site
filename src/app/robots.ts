import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site.config";

/**
 * robots.txt.
 *
 * Everything is open except the routes that are not the site: the CMS and the
 * palette sheet a developer reads.
 *
 * `Disallow` is a request not to crawl, not a lock — it keeps these out of
 * search results, and the Studio has its own sign-in for the part that
 * matters.
 *
 * The sitemap is named here as well as served, because that is how a crawler
 * that was not submitted the URL finds it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/studio/", "/dev/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
