import type { ContentSnapshot, FeedbackReport, MonitoredEvent, PendingReview, SourceState, SyncRevision, SyncRunReport } from "../domain/types";
import type { RecruitmentReviewCandidate } from "@/features/clubs/public"
import type { CampusBuzzReport } from "../application/campus-buzz";
import type { SyncStore } from "../application/monitor";
export interface ContentSyncNamespace {
  idFromName(name: string): DurableObjectId;
  get(id: DurableObjectId): DurableObjectStub;
}

export class WorkerContentSyncStore implements SyncStore {
  constructor(private readonly namespace: ContentSyncNamespace) {}

  private stub(): DurableObjectStub {
    return this.namespace.get(this.namespace.idFromName("r-students-content-sync"));
  }

  async getState(): Promise<{ states: SourceState[]; snapshots: ContentSnapshot[]; events: MonitoredEvent[] }> {
    const response = await this.stub().fetch("https://content-sync/sync/state");
    if (!response.ok) throw new Error("Content sync state unavailable.");
    return response.json();
  }

  async commit(payload: { sourceState: SourceState; snapshot?: ContentSnapshot; events?: MonitoredEvent[]; replaceEvents?: boolean; revisions: SyncRevision[]; reviews: PendingReview[]; run: SyncRunReport }): Promise<void> {
    const response = await this.stub().fetch("https://content-sync/sync/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Content sync commit failed.");
  }

  async health(): Promise<unknown> {
    const response = await this.stub().fetch("https://content-sync/sync/health");
    if (!response.ok) throw new Error("Content sync health unavailable.");
    return response.json();
  }

  async reviews(): Promise<PendingReview[]> {
    const response = await this.stub().fetch("https://content-sync/sync/reviews");
    if (!response.ok) throw new Error("Content sync reviews unavailable.");
    const data = await response.json<{ reviews?: PendingReview[] }>();
    return Array.isArray(data.reviews) ? data.reviews : [];
  }

  async review(id: string, status: "approved" | "rejected"): Promise<void> {
    const response = await this.stub().fetch("https://content-sync/sync/review", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) throw new Error("Content sync review action failed.");
  }

  async rollback(eventId: string): Promise<void> {
    const response = await this.stub().fetch("https://content-sync/sync/rollback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventId }) });
    if (!response.ok) throw new Error("Content sync rollback failed.");
  }

  async feedback(): Promise<FeedbackReport[]> {
    const response = await this.stub().fetch("https://content-sync/sync/health");
    if (!response.ok) throw new Error("Content sync feedback unavailable.");
    const data = await response.json<{ feedback?: FeedbackReport[] }>();
    return Array.isArray(data.feedback) ? data.feedback : [];
  }

  async updateFeedback(id: string, status: FeedbackReport["status"]): Promise<void> {
    const response = await this.stub().fetch("https://content-sync/sync/feedback", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) throw new Error("Content sync feedback action failed.");
  }
  async submitFeedback(report: FeedbackReport): Promise<void> {
    const response = await this.stub().fetch("https://content-sync/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(report) });
    if (!response.ok) throw new Error("Content sync feedback submission failed.");
  }
  async submitCampusBuzz(report: CampusBuzzReport): Promise<void> {
    const response = await this.stub().fetch("https://content-sync/campus-buzz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(report) });
    if (!response.ok) throw new Error("Campus Buzz ingestion failed.");
  }
  async recruitmentReviews(clubId?: string): Promise<RecruitmentReviewCandidate[]> {
    const path = clubId ? `https://content-sync/club-recruitment/reviews?clubId=${encodeURIComponent(clubId)}` : "https://content-sync/club-recruitment/reviews";
    const response = await this.stub().fetch(path);
    if (!response.ok) throw new Error("Club recruitment reviews unavailable.");
    const data = await response.json<{ reviews?: RecruitmentReviewCandidate[] }>();
    return Array.isArray(data.reviews) ? data.reviews : [];
  }

  async submitRecruitmentReview(candidate: RecruitmentReviewCandidate): Promise<void> {
    const response = await this.stub().fetch("https://content-sync/club-recruitment/review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(candidate) });
    if (!response.ok) throw new Error("Club recruitment review submission failed.");
  }

  async reviewRecruitment(id: string, reviewStatus: "approved" | "rejected" | "pending"): Promise<void> {
    const response = await this.stub().fetch("https://content-sync/club-recruitment/review", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, reviewStatus }) });
    if (!response.ok) throw new Error("Club recruitment review action failed.");
  }
  async updates(): Promise<SyncRevision[]> {
    const response = await this.stub().fetch("https://content-sync/updates");
    if (!response.ok) throw new Error("Content sync updates unavailable.");
    const data = await response.json<{ updates?: SyncRevision[] }>();
    return Array.isArray(data.updates) ? data.updates : [];
  }
  async events(): Promise<MonitoredEvent[]> {
    const response = await this.stub().fetch("https://content-sync/events");
    if (!response.ok) throw new Error("Published event store unavailable.");
    const data = await response.json<{ events?: MonitoredEvent[] }>();
    return Array.isArray(data.events) ? data.events : [];
  }
}
