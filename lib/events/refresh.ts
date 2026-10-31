import { EVENT_SOURCES } from "../../data/events/sources";

export interface EventSourceCheck {
  sourceId: string;
  checkedAt: string;
  status: "healthy" | "failed";
  httpStatus?: number;
}

export async function checkOfficialEventSources(): Promise<EventSourceCheck[]> {
  const sources = EVENT_SOURCES.filter((source) => source.sourceType === "official_website");
  return Promise.all(sources.map(async (source) => {
    const checkedAt = new Date().toISOString();
    try {
      const response = await fetch(source.url, {
        headers: { "User-Agent": "R-Students-Research-Source-Check/1.0" },
        signal: AbortSignal.timeout(8000),
      });
      return { sourceId: source.id, checkedAt, status: response.ok ? "healthy" : "failed", httpStatus: response.status };
    } catch {
      return { sourceId: source.id, checkedAt, status: "failed" };
    }
  }));
}
