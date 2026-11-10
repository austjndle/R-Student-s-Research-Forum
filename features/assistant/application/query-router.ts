import type { GroundingStatus } from "@/platform/rag/types"
import { analyzeQuery } from "@/features/search/public";

export type ChatRoute = "direct_retrieval" | "rag_generation" | "insufficient_evidence" | "general_guidance";

export function isClassroomPermissionQuery(query: string): boolean {
  const normalized = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const asksPermission = /\b(?:can|may|allowed|permission|okay|ok|should)\b|am i allowed|is it okay|cho phep|duoc phep|co duoc/i.test(normalized);
  const mentionsConsumption = /\b(?:eat|food|drink|eating|an|uong|do an|do uong)\b/i.test(normalized);
  const hasLocation = /\b(?:in|inside|at|on|room|class|classroom|lecture|lecturer|library|toilet|bathroom|elevator|lift|study room|lab|phong|lop|thu vien|wc|nha ve sinh)\b/i.test(normalized);
  const isDiningLookup = /\bwhere\s+can\s+i\s+(?:eat|find food|get food)\b|\bo dau.*(?:an|do an)|(?:food|dining|restaurant|cafe).*(?:where|o dau)/i.test(normalized);
  return !isDiningLookup && asksPermission && mentionsConsumption && hasLocation;
}

export function classifyChatRoute(query: string, evidenceStatus: GroundingStatus, deterministicAnswerAvailable: boolean): ChatRoute {
  if (isClassroomPermissionQuery(query)) return evidenceStatus === "grounded" ? "rag_generation" : "insufficient_evidence";
  const analysis = analyzeQuery(query, /[à-ỹ]/i.test(query) ? "vi" : "en");
  if (analysis.intent === "student_life") return "general_guidance";
  const factualIntent = /where|when|which|what is the name|room|floor|building|date|email|phone|o dau|khi nao|tang|phong|ten gi|ngay|khi nao/i.test(analysis.normalized);
  if (deterministicAnswerAvailable && factualIntent && evidenceStatus === "grounded") return "direct_retrieval";
  if (evidenceStatus === "insufficient_evidence") return "insufficient_evidence";
  return "rag_generation";
}
export function classroomPermissionFallback(language: "en" | "vi"): string {
  return language === "vi"
    ? "Mình chưa tìm thấy quy định RMIT công khai áp dụng chung cho việc ăn uống trong không gian này. Việc này có thể phụ thuộc vào loại không gian, biển báo và quy định của cơ sở. Bạn nên kiểm tra hướng dẫn tại địa điểm hoặc hỏi nhân viên/giảng viên phụ trách trước khi ăn uống."
    : "I couldn't verify a university-wide RMIT rule about eating or drinking in this space. The answer may depend on the space type, local signage, and campus rules. Check the guidance at the location or ask the responsible staff member or lecturer before eating there.";
}
