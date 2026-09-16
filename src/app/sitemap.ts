import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

// Single-page site now — everything lives at "/" under its own #anchors.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteConfig.url, lastModified: new Date() }];
}
