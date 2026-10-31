import type { EventSourceCheck } from "../lib/events/refresh";
import type { EventReviewDraft } from "../lib/events/review";

const DRAFTS_KEY = "event-review-drafts";
const SOURCE_CHECKS_KEY = "event-source-checks";
const MAX_DRAFTS = 100;

export class EventReviewDurableObject {
  constructor(private readonly state: DurableObjectState) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const drafts = (await this.state.storage.get<EventReviewDraft[]>(DRAFTS_KEY)) ?? [];
    if (url.pathname === "/refresh" && request.method === "POST") {
      const checks = (await request.json()) as EventSourceCheck[];
      await this.state.storage.put(SOURCE_CHECKS_KEY, checks);
      return Response.json({ stored: true, checked: checks.length }, { headers: { "Cache-Control": "no-store" } });
    }

    if (url.pathname === "/sources" && request.method === "GET") {
      const checks = (await this.state.storage.get<EventSourceCheck[]>(SOURCE_CHECKS_KEY)) ?? [];
      return Response.json({ checks }, { headers: { "Cache-Control": "no-store" } });
    }

    if (url.pathname === "/list" && request.method === "GET") {
      return Response.json({ drafts }, { headers: { "Cache-Control": "no-store" } });
    }

    if (url.pathname === "/draft" && request.method === "POST") {
      const draft = (await request.json()) as EventReviewDraft;
      const nextDrafts = [draft, ...drafts.filter((item) => item.id !== draft.id)].slice(0, MAX_DRAFTS);
      await this.state.storage.put(DRAFTS_KEY, nextDrafts);
      return Response.json({ saved: true, id: draft.id }, { status: 201, headers: { "Cache-Control": "no-store" } });
    }

    if (url.pathname === "/review" && request.method === "PATCH") {
      const body = (await request.json()) as { id?: string; reviewStatus?: EventReviewDraft["reviewStatus"] };
      if (!body.id || !body.reviewStatus || !["draft", "published", "archived"].includes(body.reviewStatus)) {
        return Response.json({ error: "Invalid review update." }, { status: 400 });
      }
      const index = drafts.findIndex((item) => item.id === body.id);
      if (index < 0) return Response.json({ error: "Draft not found." }, { status: 404 });
      const updatedDrafts = [...drafts];
      updatedDrafts[index] = { ...updatedDrafts[index], reviewStatus: body.reviewStatus };
      await this.state.storage.put(DRAFTS_KEY, updatedDrafts);
      return Response.json({ updated: true, id: body.id, reviewStatus: body.reviewStatus }, { headers: { "Cache-Control": "no-store" } });
    }

    return Response.json({ error: "Not found." }, { status: 404 });
  }
}
