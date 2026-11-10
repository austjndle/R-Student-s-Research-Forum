import { removeVietnameseDiacritics, processQuery } from "./engine";
import type { RAGLanguage, QueryAnalysis, QueryIntent } from "@/platform/rag/types"

const CAMPUS_ALIASES: Record<"saigon_south" | "hanoi", string[]> = {
  saigon_south: ["saigon south", "sgs", "nam sai gon", "nam sài gòn", "ho chi minh", "hcmc", "hcm"],
  hanoi: ["hanoi", "ha noi", "hà nội", "hn"],
};

const TOPIC_TERMS: Record<QueryIntent, string[]> = {
  location: ["where", "location", "building", "floor", "level", "room", "facility", "o dau", "ở đâu", "toa nha", "tòa nhà", "tang", "tầng", "phong", "phòng"],
  dining: ["eat", "food", "dining", "restaurant", "cafe", "coffee", "canteen", "food court", "an", "ăn", "nha hang", "nhà hàng", "quan", "quán", "ca phe", "cà phê"],
  club: ["club", "society", "clb", "cau lac bo", "câu lạc bộ"],
  recruitment: ["join", "recruit", "recruitment", "interview", "application", "tham gia", "tuyen", "tuyển", "phong van", "phỏng vấn"],
  lost_property: ["lost and found", "lost property", "lost belongings", "misplaced", "missing item", "lost wallet", "lost phone", "lost airpods", "found property", "found item", "security enquiries", "lost ticket", "found ticket", "stolen bag", "lost", "lose", "losing", "stuff", "belongings", "found", "mất đồ", "lam mat do", "làm mất đồ", "de quen do", "để quên đồ", "do that lac", "đồ thất lạc", "nhat duoc do", "nhặt được đồ", "mất thẻ sinh viên"],
  scholarship: ["scholarship", "financial aid", "tuition waiver", "hoc bong", "học bổng", "ho tro hoc phi", "hỗ trợ học phí"],
  academic_calendar: ["calendar", "semester", "census", "deadline", "important date", "lich hoc", "lịch học", "hoc ky", "học kỳ", "han chot", "hạn chót"],
  procedure: ["how do", "how can", "procedure", "process", "submit", "apply", "enrol", "enroll", "lam sao", "làm sao", "thu tuc", "thủ tục", "dang ky", "đăng ký"],
  contact: ["email", "phone", "contact", "support", "student connect", "lien he", "liên hệ", "ho tro", "hỗ trợ"],
  event: ["event", "activity", "workshop", "club day", "su kien", "sự kiện", "hoat dong", "hoạt động"],
  student_life: ["friend", "teammate", "groupmate", "make friends", "meet people", "ban be", "bạn bè", "dong doi", "đồng đội", "ket ban", "kết bạn"],
  general_rmit: ["rmit", "student", "course", "program", "major", "tuition", "hoc", "sinh vien", "sinh viên"],
};

function containsAny(text: string, terms: string[]): boolean {
  return terms.some((term) => {
    const normalizedTerm = removeVietnameseDiacritics(term).trim();
    if (normalizedTerm.length <= 3) {
      const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, "i").test(text);
    }
    return text.includes(normalizedTerm);
  });
}

function detectLanguage(query: string, preferred: RAGLanguage): RAGLanguage {
  const normalized = removeVietnameseDiacritics(query.toLowerCase());
  const vietnameseMarkers = ["lam sao", "toi", "minh", "ban be", "sinh vien", "hoc bong", "dang ky", "cau lac bo", "o dau", "khong", "tang", "phong"];
  return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(query) || containsAny(normalized, vietnameseMarkers) ? "vi" : preferred;
}

function detectCampus(normalized: string): Exclude<QueryAnalysis["campus"], undefined> | undefined {
  const matches = (Object.entries(CAMPUS_ALIASES) as Array<[Exclude<QueryAnalysis["campus"], undefined>, string[]]>)
    .filter(([, aliases]) => containsAny(normalized, aliases))
    .map(([campus]) => campus);
  if (matches.length === 0 && /\bbeanland\b/i.test(normalized)) return "saigon_south";
  return matches.length === 1 ? matches[0] : undefined;
}

function detectIntent(normalized: string): QueryIntent {
  const priority: QueryIntent[] = ["recruitment", "lost_property", "dining", "location", "scholarship", "academic_calendar", "contact", "event", "student_life", "procedure", "club", "general_rmit"];
  return priority.find((intent) => containsAny(normalized, TOPIC_TERMS[intent])) ?? "general_rmit";
}

function detectExactTerms(normalized: string): string[] {
  const terms = new Set<string>();
  for (const token of processQuery(normalized).tokens) {
    if (token.length > 2) terms.add(token);
  }
  const room = normalized.match(/\b\d{1,2}\.\d(?:\.\d{1,3}|\.[a-z]\d{1,3})\b/i)?.[0];
  if (room) terms.add(room.toLowerCase());
  const email = normalized.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)?.[0];
  if (email) terms.add(email.toLowerCase());
  return [...terms];
}

export function analyzeQuery(query: string, preferredLanguage: RAGLanguage = "en"): QueryAnalysis {
  const normalized = removeVietnameseDiacritics(query.trim().toLowerCase()).replace(/[^a-z0-9@._-]+/g, " ").replace(/\s+/g, " ");
  const language = detectLanguage(query, preferredLanguage);
  const intent = detectIntent(normalized);
  const campus = detectCampus(normalized);
  const room = normalized.match(/\b\d{1,2}\.\d(?:\.\d{1,3}|\.[a-z]\d{1,3})\b/i)?.[0];
  const building = normalized.match(/\b(?:building|bldg|toa nha|tower)\s*([a-z]?\d+)\b/i)?.[1];
  const academicYear = Number(normalized.match(/\b(20\d{2})\b/)?.[1] ?? 0) || undefined;
  const semester = normalized.match(/\b(?:semester|sem|hoc ky)\s*([123])\b/i)?.[1] ? `S${normalized.match(/\b(?:semester|sem|hoc ky)\s*([123])\b/i)?.[1]}` : undefined;
  const exactTerms = detectExactTerms(normalized);
  const expandedTerms = [...new Set([...processQuery(query).expandedTerms, ...exactTerms])];
  const locationLike = intent === "location" || intent === "dining" || intent === "contact";
  return {
    original: query,
    normalized,
    language,
    intent,
    campus,
    building,
    room,
    category: intent === "general_rmit" ? undefined : intent,
    academicYear,
    semester,
    exactTerms,
    expandedTerms,
    ambiguousCampus: locationLike && !campus && !room && !building && /student connect|library|food|eat|campus|facility|building|room|floor|where|o dau|thu vien|an uong|canteen/.test(normalized),
  };
}

export function matchesCampus(query: QueryAnalysis, campus: string): boolean {
  return !query.campus || campus === "all" || campus === query.campus;
}
