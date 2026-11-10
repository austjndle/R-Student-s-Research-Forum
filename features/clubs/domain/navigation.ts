import type { ClubCampus, ClubCategory, ClubRecord } from "../data/clubs";

export interface ClubDirectoryContext {
  campus: ClubCampus;
  category: ClubCategory | "all";
  query: string;
}

const categories = new Set(["all", "academic", "active", "creative_collectives", "social_special_interest"]);

export function parseClubDirectoryContext(params: URLSearchParams, fallbackCampus: ClubCampus = "saigon_south"): ClubDirectoryContext {
  const campus = params.get("campus");
  const category = params.get("category") ?? "all";
  return {
    campus: campus === "hanoi" || campus === "saigon_south" ? campus : fallbackCampus,
    category: categories.has(category) ? category as ClubDirectoryContext["category"] : "all",
    query: (params.get("q") ?? "").slice(0, 200),
  };
}

export function clubDirectoryContextFromSearchParams(
  values: Record<string, string | string[] | undefined>,
  club?: Pick<ClubRecord, "campus" | "category">,
): ClubDirectoryContext {
  const params = new URLSearchParams();
  for (const key of ["campus", "category", "q"]) {
    if (typeof values[key] === "string") params.set(key, values[key]);
  }
  if (club && !params.has("category")) params.set("category", club.category);
  return parseClubDirectoryContext(params, club?.campus);
}

export function clubDirectoryQuery(context: ClubDirectoryContext): string {
  const params = new URLSearchParams({ campus: context.campus, category: context.category });
  if (context.query) params.set("q", context.query);
  return params.toString();
}

export function clubDirectoryHref(context: ClubDirectoryContext): string {
  return `/clubs?${clubDirectoryQuery(context)}`;
}
