import { stableHash } from "@/shared/domain/hash";

export interface CampusBuzzReport {
  id: string;
  messageId?: string;
  from: string;
  subject: string;
  receivedAt: string;
  body: string;
  summary: string;
  sourceLinks: string[];
  campus: "hanoi" | "saigon_south" | "all";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string;
}

export interface CampusBuzzInput {
  messageId?: unknown;
  from?: unknown;
  subject?: unknown;
  receivedAt?: unknown;
  text?: unknown;
}

function cleanText(value: string, maxLength: number): string {
  return value.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, maxLength);
}

function detectCampus(text: string): CampusBuzzReport["campus"] {
  const normalized = text.toLowerCase();
  const hanoi = /\bhanoi\b|ha noi|hà nội|kim mã|kim ma/.test(normalized);
  const saigon = /saigon south|sgs|nam sài gòn|nam sai gon|ho chi minh/.test(normalized);
  if (hanoi && !saigon) return "hanoi";
  if (saigon && !hanoi) return "saigon_south";
  return "all";
}

export function normalizeCampusBuzzInput(input: CampusBuzzInput, now = new Date().toISOString()): { valid: true; report: CampusBuzzReport } | { valid: false; error: string } {
  if (typeof input.from !== "string" || !/^[^\s@]+@(?:[^\s@.]+\.)?rmit\.edu\.vn$/i.test(input.from.trim())) return { valid: false, error: "Sender is not an approved RMIT Vietnam address." };
  if (typeof input.subject !== "string" || input.subject.trim().length < 2 || input.subject.length > 500) return { valid: false, error: "Subject is invalid." };
  if (typeof input.text !== "string" || input.text.trim().length < 20 || input.text.length > 100_000) return { valid: false, error: "Message body is invalid or too large." };
  const subject = cleanText(input.subject, 500);
  const body = cleanText(input.text, 50_000);
  const receivedAt = typeof input.receivedAt === "string" && !Number.isNaN(Date.parse(input.receivedAt)) ? new Date(input.receivedAt).toISOString() : now;
  const sourceLinks = [...body.matchAll(/https:\/\/[^\s)>]+/gi)].map((match) => match[0].replace(/[.,;!?]+$/, "")).filter((url) => /^https:\/\/www\.rmit\.edu\.vn\//i.test(url)).slice(0, 20);
  const summary = body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean).slice(0, 3).join("\n\n").slice(0, 2000);
  const id = `campus-buzz:${stableHash(`${input.messageId ?? ""}|${subject}|${receivedAt}|${body}`)}`;
  return { valid: true, report: { id, messageId: typeof input.messageId === "string" ? input.messageId.slice(0, 256) : undefined, from: input.from.trim().toLowerCase(), subject, receivedAt, body, summary, sourceLinks, campus: detectCampus(`${subject}\n${body}`), status: "pending", createdAt: now } };
}
