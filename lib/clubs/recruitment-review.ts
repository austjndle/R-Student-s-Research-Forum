import type { ClubRecord } from "@/data/clubs/clubs";
import type { ClubRecruitmentAnnouncement, RecruitmentAnnouncementCategory, RecruitmentStatus, RequirementState } from "@/data/clubs/recruitment";

export interface RecruitmentReviewCandidate extends ClubRecruitmentAnnouncement {
  sourceChannelUrl: string;
}

export interface RecruitmentReviewValidation {
  valid: boolean;
  errors: string[];
  candidate?: RecruitmentReviewCandidate;
}

const MAX_TEXT = 500;
const ALLOWED_SOCIAL_HOSTS = new Set(["facebook.com", "www.facebook.com", "m.facebook.com", "instagram.com", "www.instagram.com"]);
const ALLOWED_OFFICIAL_HOSTS = new Set(["rmit.edu.vn", "www.rmit.edu.vn"]);
const CATEGORIES = new Set<RecruitmentAnnouncementCategory>(["opening", "deadline", "membership", "committee", "application", "interview", "tryout", "results", "closure"]);
const STATUSES = new Set<RecruitmentStatus>(["recruiting", "closed", "upcoming", "not_announced", "unverified"]);
const REQUIREMENTS = new Set<RequirementState>(["yes", "no", "not_confirmed"]);

function text(value: unknown, field: string, required = true): string | undefined {
  if (value === undefined && !required) return undefined;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= MAX_TEXT ? trimmed : undefined;
}

function httpsUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > 2048) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function belongsToOfficialChannel(postUrl: string, channelUrl: string): boolean {
  const post = new URL(postUrl);
  const channel = new URL(channelUrl);
  if (post.hostname !== channel.hostname) return false;
  return post.pathname === channel.pathname || post.pathname.startsWith(`${channel.pathname.replace(/\/$/, "")}/`);
}

export function validateRecruitmentReviewCandidate(input: unknown, club: ClubRecord, lastVerifiedDate: string): RecruitmentReviewValidation {
  const errors: string[] = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) return { valid: false, errors: ["Candidate must be an object."] };
  const body = input as Record<string, unknown>;
  const titleEn = text(body.titleEn, "titleEn");
  const titleVi = text(body.titleVi, "titleVi");
  const publishedAt = text(body.publishedAt, "publishedAt");
  const category = text(body.category, "category") as RecruitmentAnnouncementCategory | undefined;
  const status = text(body.status, "status") as RecruitmentStatus | undefined;
  const originalPostUrl = httpsUrl(body.originalPostUrl);
  const sourceChannelUrl = httpsUrl(body.sourceChannelUrl);
  if (!titleEn) errors.push("titleEn is required.");
  if (!titleVi) errors.push("titleVi is required.");
  if (!publishedAt || Number.isNaN(Date.parse(publishedAt))) errors.push("publishedAt must be an ISO date or datetime.");
  if (!category || !CATEGORIES.has(category)) errors.push("category is invalid.");
  if (!status || !STATUSES.has(status)) errors.push("status is invalid.");
  if (!originalPostUrl) errors.push("originalPostUrl must be HTTPS.");
  if (!sourceChannelUrl) errors.push("sourceChannelUrl must be HTTPS.");
  if (originalPostUrl && sourceChannelUrl) {
    const postHost = new URL(originalPostUrl).hostname;
    if (!ALLOWED_SOCIAL_HOSTS.has(postHost) && !ALLOWED_OFFICIAL_HOSTS.has(postHost)) errors.push("Post URL must use an allowed official channel host.");
    if (!belongsToOfficialChannel(originalPostUrl, sourceChannelUrl)) errors.push("Post URL must belong to the submitted club channel.");
  }
  const applicationDeadline = text(body.applicationDeadline, "applicationDeadline", false);
  if (applicationDeadline && Number.isNaN(Date.parse(applicationDeadline))) errors.push("applicationDeadline must be an ISO date or datetime.");
  if (status === "recruiting" && (!applicationDeadline || new Date(applicationDeadline).getTime() < Date.now())) errors.push("An open recruitment record requires a future application deadline.");
  const applicationUrl = body.applicationUrl === null || body.applicationUrl === undefined ? undefined : httpsUrl(body.applicationUrl);
  if (body.applicationUrl !== undefined && body.applicationUrl !== null && !applicationUrl) errors.push("applicationUrl must be HTTPS.");
  const interviewRequired = text(body.interviewRequired, "interviewRequired", false) as RequirementState | undefined;
  const cvPortfolioRequired = text(body.cvPortfolioRequired, "cvPortfolioRequired", false) as RequirementState | undefined;
  const tryoutRequired = text(body.tryoutRequired, "tryoutRequired", false) as RequirementState | undefined;
  if (interviewRequired && !REQUIREMENTS.has(interviewRequired)) errors.push("interviewRequired is invalid.");
  if (cvPortfolioRequired && !REQUIREMENTS.has(cvPortfolioRequired)) errors.push("cvPortfolioRequired is invalid.");
  if (tryoutRequired && !REQUIREMENTS.has(tryoutRequired)) errors.push("tryoutRequired is invalid.");
  if (publishedAt && new Date(publishedAt).getTime() > Date.now()) errors.push("publishedAt cannot be in the future.");
  if (errors.length > 0 || !titleEn || !titleVi || !publishedAt || !category || !status || !originalPostUrl || !sourceChannelUrl) return { valid: false, errors };
  return {
    valid: true,
    errors: [],
    candidate: {
      id: `recruitment:${club.id}:${crypto.randomUUID()}`,
      clubId: club.id,
      campus: club.campus,
      titleEn,
      titleVi,
      publishedAt: new Date(publishedAt).toISOString(),
      category,
      status,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline).toISOString() : undefined,
      applicationUrl,
      interviewRequired: interviewRequired ?? "not_confirmed",
      cvPortfolioRequired: cvPortfolioRequired ?? "not_confirmed",
      tryoutRequired: tryoutRequired ?? "not_confirmed",
      originalPostUrl,
      lastVerifiedDate,
      sourceChannelUrl,
    },
  };
}
