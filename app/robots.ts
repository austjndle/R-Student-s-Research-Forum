import type { MetadataRoute } from "next";

const BASE_URL = "https://r-students-searchsite.rstuhub.workers.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/admin/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
