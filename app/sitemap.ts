import type { MetadataRoute } from "next";
import { VERIFIED_CLUBS } from "@/data/clubs/clubs";
import { KNOWLEDGE_CATEGORIES } from "@/data/knowledge/schema";
import { ALL_RESEARCH_GUIDES } from "@/data/guides/guides";

const BASE_URL = "https://r-students-searchsite.rstuhub.workers.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/search", "/topics", "/guides", "/clubs", "/events", "/calendar", "/facilities", "/contacts", "/about", "/privacy"];
  const topicRoutes = KNOWLEDGE_CATEGORIES.map((category) => `/topics/${category.id}`);
  const guideRoutes = ALL_RESEARCH_GUIDES.map((guide) => `/guides/${guide.slug}`);
  const clubRoutes = VERIFIED_CLUBS.map((club) => `/clubs/${club.id}`);
  const paths = [...new Set([...staticRoutes, ...topicRoutes, ...guideRoutes, ...clubRoutes])];
  return paths.map((path) => ({
    url: `${BASE_URL}${path || "/"}`,
    changeFrequency: path === "" || path === "/events" || path === "/calendar" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/search" || path === "/events" || path === "/calendar" ? 0.9 : 0.7,
  }));
}
