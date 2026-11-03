import { processQuery, removeVietnameseDiacritics, searchKnowledgeBase, type SearchResultItem } from "@/lib/search/engine";
import { DEPARTMENT_CONTACTS } from "@/data/contacts/departments";
import { CAMPUS_ACTIVITY_HIGHLIGHTS, getPublishedCalendarEntries, type CalendarEntry } from "@/data/events/calendar";
import { getVerifiedClubs, type ClubCategory, type ClubRecord } from "@/data/clubs/clubs";
import { RMIT_CAMPUS_HOURS } from "@/data/facilities/campusHours";
import {
  GLOBAL_EXPERIENCE_LAST_VERIFIED,
  GLOBAL_EXPERIENCE_PROGRAMS,
  GLOBAL_EXPERIENCE_SCHOLARSHIPS,
  GLOBAL_EXPERIENCE_STUDY_PLAN,
  GLOBAL_EXPERIENCE_URLS,
  formatGlobalExperienceDate,
  getApplicationCycleStatus,
  getDeadlineStatus,
  type GlobalExperienceProgramId,
} from "@/data/guides/globalExperience";
import { SCHOLARSHIPS, type ScholarshipRecord } from "@/data/scholarships";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GroundedContext {
  contextText: string;
  sources: { title: string; url: string; departmentName?: string }[];
  matchedDocTitles: string[];
  bestDoc?: any;
}

const RMIT_TOPIC_PATTERNS = [
  /rmit/i, /student/i, /sinh vien/i, /major/i, /nganh/i, /khoa/i, /mon/i, /course/i,
  /enrol/i, /dang ky/i, /hoc phi/i, /tuition/i, /fee/i, /scholarship/i, /hoc bong/i,
  /gpa/i, /grade/i, /diem/i, /pass/i, /fail/i, /calendar/i, /lich/i, /semester/i, /ky hoc/i,
  /library/i, /thu vien/i, /canvas/i, /wifi/i, /it support/i, /mat khau/i, /password/i,
  /exchange/i, /trao doi/i, /melbourne/i, /du hoc/i, /wellbeing/i, /tam ly/i, /stress/i,
  /counseling/i, /bac si/i, /health/i, /contact/i, /lien he/i, /email/i, /hotline/i,
  /connect/i, /census/i, /deadlines/i, /han chot/i, /bai tap/i, /assignment/i, /special consideration/i,
  /tot nghiep/i, /graduation/i, /career/i, /thuc tap/i, /internship/i, /sset/i, /sbm/i, /scd/i,
  /friend/i, /make friends/i, /meet people/i, /meet students/i, /new people/i, /teammate/i, /team mate/i, /groupmate/i, /group mate/i, /groupmates/i, /study partner/i,
  /club/i, /society/i, /workshop/i, /event/i, /network/i, /community/i, /campus life/i,
  /new student/i, /first year/i, /lonely/i, /homesick/i, /shy/i, /social anxiety/i,
  /group assignment/i, /free[- ]rider/i, /group conflict/i, /classmate/i, /student life/i,
  /ket ban/i, /ban be/i, /lam quen/i, /tim ban/i, /dong doi/i, /ban hoc/i, /cau lac bo/i,
  /su kien/i, /hoat dong/i, /hoi thao/i, /ket noi/i, /cong dong/i, /tan sinh vien/i,
  /co don/i, /nho nha/i, /ngai giao tiep/i, /ap luc nhom/i,
  /global experience/i, /study abroad/i, /overseas study/i, /study overseas/i,
  /partner exchange/i, /cross[- ]campus/i, /interlocation/i, /study plan/i,
  /permanent transfer/i, /erasmus/i, /seed/i, /study in melbourne/i,
  /du hoc/i, /du học/i, /trao doi/i, /trao đổi/i, /hoc o nuoc ngoai/i,
  /kế hoạch học tập/i, /chuyển tiếp/i,
];

const GENERIC_CHAT_RETRIEVAL_TERMS = new Set([
  "rmit", "vietnam", "viet", "nam", "university", "universities", "student", "students",
  "sinh", "vien", "course", "courses", "program", "programs", "class", "classes",
  "assignment", "assignments", "academic", "study", "studies", "mon", "hoc",
]);
function normalizeChatRetrievalTerm(term: string): string {
  const normalized = removeVietnameseDiacritics(term);
  if (normalized.length > 4 && normalized.endsWith("ies")) {
    return `${normalized.slice(0, -3)}y`;
  }
  if (normalized.length > 4 && normalized.endsWith("s") && !normalized.endsWith("ss")) {
    return normalized.slice(0, -1);
  }
  return normalized;
}
const OBVIOUS_OUT_OF_SCOPE_PATTERNS = [
  /write (a|an)? python/i, /viet code/i, /viet chuong trinh/i, /write code/i,
  /who won the world cup/i, /ai thang world cup/i, /tell me a (funny )?joke/i, /joke/i, /ke chuyen cuoi/i,
  /quantum mechanics/i, /vat ly luong tu/i, /solve this math/i, /giai toan/i,
  /recipe/i, /cong thuc nau an/i, /crypto/i, /bitcoin/i, /ignore previous instructions/i,
  /jailbreak/i, /act as DAN/i
];
const VIETNAMESE_LANGUAGE_MARKERS =
  /\b(?:lam sao|toi|tui|minh|ban be|ban hoc|sinh vien|cau lac bo|clb nay|hoc phi|hoc bong|dang ky|dang tuyen|tuyen thanh vien|ket ban|tim ban|dong doi|su kien|hoat dong|lich hoc|ngoai khoa|giang vien|hong|khong)\b/i;

export function detectChatLanguage(message: string, preferredLanguage: "en" | "vi"): "en" | "vi" {
  const hasVietnameseDiacritics = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(message);
  const hasVietnameseWords = VIETNAMESE_LANGUAGE_MARKERS.test(removeVietnameseDiacritics(message));
  return hasVietnameseDiacritics || hasVietnameseWords ? "vi" : preferredLanguage;
}
export interface ChatHistoryTurn {
  role: "user" | "assistant";
  content: string;
}

export function sanitizeChatHistory(value: unknown): ChatHistoryTurn[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((turn): turn is { role?: unknown; content: string } => (turn.role === "user" || turn.role === "assistant") && typeof turn.content === "string")
    .map((turn) => ({ role: turn.role as "user" | "assistant", content: turn.content.trim().slice(0, 1200) }))
    .filter((turn) => turn.content.length > 0)
    .slice(-6);
}

export function resolveConversationQuery(
  message: string,
  history: ChatHistoryTurn[],
  language: "en" | "vi",
): string {
  const normalized = normalizeEventText(message).trim();
  const campusOnly = /^(?:(?:and|what about|how about|also|con|the con)(?:\s+ben)?\s+)?(?:hanoi|hn|hnoi|ha noi|saigon south|sgs|nam sai gon)(?:\s+campus)?[?.!]*$/i.test(normalized);
  if (!campusOnly) return message;
  const previousUser = [...history].reverse().find((turn) => turn.role === "user");
  if (!previousUser) return message;
  const previousNormalized = normalizeEventText(previousUser.content);
  const hasTopic = /food|eat|restaurant|cafe|library|building|facility|club|event|calendar|semester|contact|support|ăn|an uong|nha hang|thu vien|toa nha|co so|cau lac bo|su kien|lich hoc/i.test(previousNormalized);
  if (!hasTopic) return message;
  const targetCampus = /hanoi|hn|hnoi|ha noi/.test(normalized)
    ? (language === "vi" ? "cơ sở Hà Nội" : "Hanoi campus")
    : (language === "vi" ? "cơ sở Nam Sài Gòn" : "Saigon South campus");
  const resolved = `${previousUser.content} — ${targetCampus}`;
  return resolved.length <= 2000 ? resolved : message;
}

export function isQueryInScope(query: string, contextClubId?: unknown): { inScope: boolean; reason?: string } {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { inScope: false, reason: "Query too short." };
  }

  // 1. Explicit out-of-scope patterns check
  for (const pattern of OBVIOUS_OUT_OF_SCOPE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        inScope: false,
        reason: "Out of scope: R Research Assistant only answers questions related to RMIT University Vietnam.",
      };
    }
  }

  if (isCurrentClubQuestion(normalizeEventText(trimmed)) && resolveContextClubId(contextClubId)) {
    return { inScope: true };
  }

  // 2. Strong match in verified RMIT knowledge base
  const searchMatches = searchKnowledgeBase(trimmed, { limit: 1, includeAuxiliary: false });
  if (searchMatches.length > 0 && searchMatches[0].score >= 35) {
    return { inScope: true };
  }

  // 3. Recognize verified club names even when the user omits "RMIT" or "club".
  if (clubNameMentions(normalizeEventText(trimmed), getVerifiedClubs()).length > 0) {
    return { inScope: true };
  }
  if (isFoodFacilityQuery(trimmed) || /\b(?:building|facility|facilities|library|shuttle|parking|hanoi|saigon south|sgs|toa nha|co so|thu vien|xe buyt|bai xe)\b/i.test(removeVietnameseDiacritics(trimmed))) {
    return { inScope: true };
  }
  // 4. Match explicit RMIT university topical keywords
  for (const pattern of RMIT_TOPIC_PATTERNS) {
    if (pattern.test(removeVietnameseDiacritics(trimmed)) || /\bclb\b/i.test(trimmed)) {
      return { inScope: true };
    }
  }

  // 5. Default: Reject any question not related to RMIT
  return {
    inScope: false,
    reason: "Out of scope: Please ask a question related to RMIT University Vietnam (e.g., courses, enrolment, scholarships, tuition, or campus contacts).",
  };
}

function buildGroundedContextFromSearchResults(matches: SearchResultItem[], language: "en" | "vi"): GroundedContext {
  const deptMap = new Map(DEPARTMENT_CONTACTS.map((department) => [department.id, department]));
  const sources: GroundedContext["sources"] = [];
  const matchedDocTitles: string[] = [];
  const contextBlocks = matches.map((item, index) => {
    const doc = item.document;
    const dept = deptMap.get(doc.departmentId);
    matchedDocTitles.push(language === "vi" ? doc.titleVi : doc.titleEn);
    sources.push({
      title: doc.sourceTitle || (language === "vi" ? doc.titleVi : doc.titleEn),
      url: doc.officialSourceUrl,
      departmentName: language === "vi" ? dept?.nameVi : dept?.nameEn,
    });
    return `[Verified RMIT record ${index + 1}]
Title: ${language === "vi" ? doc.titleVi : doc.titleEn}
Summary: ${language === "vi" ? doc.summaryVi : doc.summaryEn}
Details: ${(language === "vi" ? doc.keyDetailsVi : doc.keyDetailsEn).join("\n- ")}
Source: ${doc.officialSourceUrl}`;
  });
  return {
    contextText: contextBlocks.join("\n\n"),
    sources,
    matchedDocTitles,
    bestDoc: matches[0]?.document,
  };
}
const FOOD_FACILITY_PATTERN = /\b(?:food|eat|restaurant|cafe|coffee|noodle|soya|boost juice|circle k|nine|sorrento|vending)\b|global cafe/i;
const VIETNAMESE_FOOD_PATTERN = /ăn|nhà hàng|quán|cà phê|đồ ăn/i;
const FOOD_FACILITY_RECORD_PATTERN = /\b(?:food|restaurant|cafe|café|coffee|noodle|soya|boost juice|circle k|nine|sorrento|vending)\b|global café|kootoro|highlands|curry hut|la cantina|4gs|nhà hàng|quán|cà phê/i;
export function isFoodFacilityQuery(query: string): boolean {
  return FOOD_FACILITY_PATTERN.test(normalizeEventText(query)) || VIETNAMESE_FOOD_PATTERN.test(query);
}
function extractFoodLabel(value: string): string {
  const segments = value.split(/[;,]/).map((segment) => segment.trim()).filter(Boolean);
  const foodSegments = segments.filter((segment) => FOOD_FACILITY_RECORD_PATTERN.test(segment));
  return foodSegments.join("; ") || value;
}

function foodFacilityRecords(query: string, language: "en" | "vi") {
  const normalized = normalizeEventText(query);
  const campus = /hanoi|ha noi|handi resco/.test(normalized)
    ? "hanoi"
    : /sgs|saigon south|nam sai gon/.test(normalized)
      ? "saigon_south"
      : undefined;
  return RMIT_CAMPUS_HOURS
    .filter((building) => !campus || building.campus === campus)
    .flatMap((building) => building.floors
      .filter((floor) => FOOD_FACILITY_RECORD_PATTERN.test(`${floor.facilitiesEn} ${floor.facilitiesVi}`))
      .map((floor) => ({ building, floor, label: extractFoodLabel(language === "vi" ? floor.facilitiesVi : floor.facilitiesEn) })));
}

export function formatFoodFacilityFallback(language: "en" | "vi", query: string): string {
  const records = foodFacilityRecords(query, language);
  if (records.length === 0) {
    return language === "vi"
      ? "Chưa tìm thấy địa điểm ăn uống đã xác minh phù hợp với cơ sở này."
      : "No verified food or dining location matched that campus.";
  }
  const listEn = records.map(({ building, floor, label }) => `• ${building.nameEn} — ${floor.floorEn ?? floor.floor}: ${label}`).join("\n");
  const listVi = records.map(({ building, floor, label }) => `• ${building.nameVi} — ${floor.floorVi ?? floor.floor}: ${label}`).join("\n");
  return language === "vi"
    ? `Các địa điểm ăn uống đã xác minh:\n${listVi}\n\nKiểm tra nguồn chính thức để xác nhận giờ hoạt động hiện tại.`
    : `Verified food options:\n${listEn}\n\nCheck the official source for current operating hours.`;
}

function buildFoodFacilityContext(query: string, language: "en" | "vi"): GroundedContext {
  const records = foodFacilityRecords(query, language);
  const sources = [...new Map(records.map(({ building, floor }) => {
    const url = floor.sourceUrl ?? building.floorPlanPdfUrl ?? "https://www.rmit.edu.vn/students/campus-life/campus-facilities";
    return [url, { title: building.nameEn, url }];
  })).values()];
  const contextText = records.length === 0
    ? language === "vi" ? "Không tìm thấy địa điểm ăn uống đã xác minh phù hợp." : "No verified food or dining location matched this campus."
    : records.map(({ building, floor, label }) => `[Verified food facility]\nBuilding: ${building.nameEn}\nFloor: ${floor.floorEn ?? floor.floor}\nFacilities: ${label}\nSource: ${floor.sourceUrl ?? building.floorPlanPdfUrl ?? "https://www.rmit.edu.vn/students/campus-life/campus-facilities"}`).join("\n\n");
  return { contextText, sources, matchedDocTitles: records.map(({ building }) => language === "vi" ? building.nameVi : building.nameEn) };
}

function buildHanoiFacilityContext(query: string, language: "en" | "vi"): GroundedContext | null {
  const normalized = normalizeEventText(query);
  if (!/hanoi|ha noi|hnoi/.test(normalized)) return null;
  if (/difference|different|differ|compare|khac/.test(normalized) && /beanland|saigon south|sgs/.test(normalized)) return null;
  const target = /library|thu vien/.test(normalized)
    ? "Hanoi Library"
    : /student connect|trung tam ho tro/.test(normalized)
      ? "Hanoi Student Connect"
      : /it support|support.*it|ho tro cntt/.test(normalized)
        ? "Hanoi IT Support"
        : /career ready|career hub|huong nghiep/.test(normalized)
          ? "Hanoi Career Ready Hub"
          : /study room|meeting room|phong hoc nhom|phong hop/.test(normalized)
            ? "Hanoi study rooms"
            : /highlands|vending|food|eat|an uong|nha hang|ca phe/.test(normalized)
              ? "Hanoi food facilities"
              : /student access lab|access lab/.test(normalized)
                ? "Hanoi Student Access Lab"
                : null;
  if (!target) return null;
  const match = searchKnowledgeBase(target, { language, limit: 10 }).find((result) => result.document.resultHref === "/facilities#hn-main");
  if (!match) return null;
  const sourceUrl = /library|thu vien/.test(normalized)
    ? "https://www.rmit.edu.vn/students/support/library-services"
    : /student connect|trung tam ho tro/.test(normalized)
      ? "https://www.rmit.edu.vn/students/support/student-connect"
      : /it support|support.*it|ho tro cntt/.test(normalized)
        ? "https://www.rmit.edu.vn/students/support/it-support"
        : /career ready|career hub|huong nghiep/.test(normalized)
          ? "https://www.rmit.edu.vn/students/work-and-study-opportunities/career-opportunities"
          : /study room|meeting room|phong hoc nhom|phong hop/.test(normalized)
            ? "https://www.rmit.edu.vn/students/campus-life/campus-facilities"
            : match.document.officialSourceUrl;
  const document = { ...match.document, officialSourceUrl: sourceUrl };
  return buildGroundedContextFromSearchResults([{ ...match, document }], language);
}
export function buildRAGContext(query: string, language: "en" | "vi" = "en"): GroundedContext {
  if (isPracticalStudentLifeQuery(query)) {
    const assignmentAdvice = isAssignmentPerformanceAdviceQuery(query);
    return {
      contextText: assignmentAdvice
        ? language === "vi"
          ? "Đây là câu hỏi xin lời khuyên học tập chung, không phải quy định chấm điểm của RMIT. Đưa ra gợi ý thực tế, không bảo đảm điểm số và không chuyển sang hướng dẫn nộp bài Canvas hoặc nộp trễ."
          : "This is a request for general study-strategy advice, not an RMIT marking policy. Give practical, non-guaranteed suggestions; do not substitute Canvas submission or late-penalty instructions."
        : language === "vi"
          ? "Không cần tài liệu quy định cho câu hỏi thực tế về đời sống sinh viên này. Trả lời trực tiếp bằng hướng dẫn chung, không thay thế bằng một quy trình học vụ không liên quan."
          : "No policy document is required for this practical student-life question. Answer with general guidance and do not substitute an unrelated academic procedure guide.",
      sources: assignmentAdvice ? [] : [{ title: "RMIT Vietnam Student Life", url: "https://www.rmit.edu.vn/students/campus-life" }],
      matchedDocTitles: [],
    };
  }
  if (isGlobalExperienceQuery(query)) {
    return {
      contextText: "",
      sources: [],
      matchedDocTitles: [],
    };
  }
  if (isFoodFacilityQuery(query)) return buildFoodFacilityContext(query, language);
  const hanoiFacilityContext = buildHanoiFacilityContext(query, language);
  if (hanoiFacilityContext) return hanoiFacilityContext;
  const normalizedFacilityQuery = normalizeEventText(query);
  if (
    /difference|different|differ|compare|khac/.test(normalizedFacilityQuery)
    && /hanoi|ha noi/.test(normalizedFacilityQuery)
    && /beanland|saigon south|sgs/.test(normalizedFacilityQuery)
  ) {
    const beanland = searchKnowledgeBase("Beanland Library", { language, limit: 10 }).find((result) => result.document.resultHref === "/facilities#sgs-b1");
    const hanoi = searchKnowledgeBase("Hanoi Library", { language, limit: 10 }).find((result) => result.document.resultHref === "/facilities#hn-main");
    if (beanland && hanoi) {
      const comparisonDocument = {
        ...beanland.document,
        id: "facility-library-comparison",
        titleEn: "Beanland Library and Hanoi Campus Library comparison",
        titleVi: "So sánh Thư viện Beanland và Thư viện Cơ sở Hà Nội",
        summaryEn: "Beanland Library & Learning Commons is at Building 1, Level 3, Saigon South; the Hanoi Campus Library is in the Handi Resco Hanoi campus record.",
        summaryVi: "Beanland Library & Learning Commons ở Tòa nhà 1, Tầng 3, Nam Sài Gòn; Thư viện Cơ sở Hà Nội thuộc hồ sơ cơ sở Handi Resco Hà Nội.",
        keyDetailsEn: [
          "Saigon South: Beanland Library & Learning Commons — Building 1, Level 3, Room 1.3.30.",
          "Hanoi: RMIT Hanoi Campus Library — Handi Resco campus; use the Hanoi-specific floor-plan record and official library source.",
          "These are different campus facilities; do not substitute one location for the other.",
        ],
        keyDetailsVi: [
          "Nam Sài Gòn: Beanland Library & Learning Commons — Tòa nhà 1, Tầng 3, Phòng 1.3.30.",
          "Hà Nội: Thư viện Cơ sở RMIT Hà Nội — cơ sở Handi Resco; dùng hồ sơ sơ đồ Hà Nội và nguồn thư viện chính thức.",
          "Đây là hai cơ sở khác nhau; không thay thế địa điểm này bằng địa điểm kia.",
        ],
        sourceTitle: "RMIT Vietnam library location comparison",
      };
      return buildGroundedContextFromSearchResults([
        { ...beanland, document: comparisonDocument },
        hanoi,
      ], language);
    }
  }
  const candidates = searchKnowledgeBase(query, { language, limit: 3 });
  const queryTerms = processQuery(query).tokens
    .map(normalizeChatRetrievalTerm)
    .filter((term) => !GENERIC_CHAT_RETRIEVAL_TERMS.has(term));
  const queryTermSet = new Set(queryTerms);
  const matches = queryTermSet.size > 0
    ? candidates.filter((candidate) =>
        candidate.matchedKeywords.some((keyword) =>
          normalizeChatRetrievalTerm(keyword)
            .split(/\s+/)
            .some((term) => queryTermSet.has(term))
        )
      )
    : [];

  if (matches.length === 0) {
    return {
      contextText: language === "vi"
        ? "Không tìm thấy tài liệu RMIT đã xác minh có độ liên quan đủ cao. Không suy đoán chính sách hoặc thông tin cụ thể; hãy hỏi lại để làm rõ hoặc nêu rõ giới hạn thông tin."
        : "No high-confidence verified RMIT record matches this question. Do not infer policies or specific facts; ask for clarification or state the information limit.",
      sources: [],
      matchedDocTitles: [],
    };
  }
  const deptMap = new Map(DEPARTMENT_CONTACTS.map((d) => [d.id, d]));
  const sources: { title: string; url: string; departmentName?: string }[] = [];
  const matchedDocTitles: string[] = [];

  const contextBlocks = matches.map((item, idx) => {
    const doc = item.document;
    const dept = deptMap.get(doc.departmentId);
    matchedDocTitles.push(language === "vi" ? doc.titleVi : doc.titleEn);

    sources.push({
      title: doc.sourceTitle || (language === "vi" ? doc.titleVi : doc.titleEn),
      url: doc.officialSourceUrl,
      departmentName: language === "vi" ? dept?.nameVi : dept?.nameEn,
    });

    return `[Tài liệu ${idx + 1}]
Tiêu đề: ${language === "vi" ? doc.titleVi : doc.titleEn}
Tóm tắt: ${language === "vi" ? doc.summaryVi : doc.summaryEn}
Chi tiết: ${(language === "vi" ? doc.keyDetailsVi : doc.keyDetailsEn).join("\n- ")}
Phòng ban liên hệ: ${dept ? `${dept.nameVi || dept.nameEn} (Email: ${dept.email || "N/A"}, ĐT: ${dept.phone || "N/A"})` : "Student Connect"}`;
  });

  return {
    contextText: contextBlocks.join("\n\n"),
    sources,
    matchedDocTitles,
    bestDoc: matches[0].document,
  };
}
export interface ScholarshipContext {
  contextText: string;
  sources: { title: string; url: string }[];
  matchedScholarshipIds: string[];
  matchedScholarshipTitles: string[];
  hasBroadIntent: boolean;
}

function vietnamToday(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function scholarshipCycleStatus(record: ScholarshipRecord): "open" | "upcoming" | "closed" | "unverified" | "not_announced" {
  const cycles = record.cycles.filter((cycle) => cycle.dateStatus === "verified" || cycle.publishedStatus);
  if (cycles.some((cycle) => cycle.publishedStatus === "open" || cycle.publishedStatus === "rolling")) return "open";
  if (cycles.some((cycle) => cycle.publishedStatus === "upcoming")) return "upcoming";
  if (cycles.some((cycle) => cycle.publishedStatus === "closed")) return "closed";
  const datedCycles = cycles.filter((cycle) => cycle.opensOn && cycle.closesOn && cycle.dateStatus === "verified");
  if (datedCycles.length === 0) return record.cycles.some((cycle) => cycle.dateStatus === "conflicting") ? "unverified" : "not_announced";
  const today = vietnamToday();
  if (datedCycles.some((cycle) => today >= cycle.opensOn! && today <= cycle.closesOn!)) return "open";
  if (datedCycles.some((cycle) => today < cycle.opensOn!)) return "upcoming";
  return "closed";
}

function currentScholarshipCycle(record: ScholarshipRecord) {
  const ranked = record.cycles
    .filter((cycle) => cycle.dateStatus === "verified")
    .sort((a, b) => (a.opensOn ?? "9999").localeCompare(b.opensOn ?? "9999"));
  const status = scholarshipCycleStatus(record);
  return ranked.find((cycle) => status === "open" && cycle.opensOn && cycle.closesOn)
    ?? ranked.find((cycle) => cycle.opensOn && cycle.closesOn && vietnamToday() < cycle.opensOn)
    ?? ranked.at(-1)
    ?? record.cycles[0];
}

export function isScholarshipQuery(query: string): boolean {
  return /scholarship|financial aid|tuition waiver|học bổng|hoc bong|học phí.*(hỗ trợ|miễn)|hỗ trợ học phí/i.test(normalizeEventText(query));
}

export function buildScholarshipContext(query: string, language: "en" | "vi" = "en"): ScholarshipContext {
  const empty: ScholarshipContext = { contextText: "", sources: [], matchedScholarshipIds: [], matchedScholarshipTitles: [], hasBroadIntent: false };
  if (!isScholarshipQuery(query)) return empty;
  const normalized = normalizeEventText(query);
  const broadRequest = /all|every|available|what scholarships|list|danh sach|tat ca|co nhung|nhung hoc bong nao/i.test(normalized);
  const matchSpecificRecord = (record: ScholarshipRecord) => {
    const haystack = [record.name.en, record.name.vi, record.searchTermsEn.join(" "), record.searchTermsVi.join(" "), record.eligiblePrograms.map((item) => `${item.en} ${item.vi}`).join(" "), record.targetGroup.en, record.targetGroup.vi].join(" ");
    const normalizedHaystack = normalizeEventText(haystack);
    const meaningfulQueryTerms = normalized.split(/\s+/).filter((term) => term.length >= 4 && !GENERIC_CHAT_RETRIEVAL_TERMS.has(term));
    const matchedTerms = meaningfulQueryTerms.filter((term) => normalizedHaystack.includes(term));
    return matchedTerms.length >= Math.min(2, Math.max(1, meaningfulQueryTerms.length));
  };
  const specificRecords = SCHOLARSHIPS.filter(matchSpecificRecord);
  const records = specificRecords.length > 0
    ? specificRecords
    : broadRequest
      ? SCHOLARSHIPS
      : SCHOLARSHIPS.filter((record) => record.category === "future_undergraduate").slice(0, 6);
  const broad = specificRecords.length === 0 && broadRequest;
  const sources = new Map<string, { title: string; url: string }>();
  const contextRecords = (broad ? records.slice(0, 8) : records).map((record, index) => {
    const title = record.name[language];
    const cycle = currentScholarshipCycle(record);
    const status = scholarshipCycleStatus(record);
    const detail = record.sources.find((source) => source.kind.includes("detail")) ?? record.sources[0];
    if (detail) sources.set(detail.url, { title, url: detail.url });
    if (record.application.directUrl) sources.set(record.application.directUrl, { title: `${title} — application`, url: record.application.directUrl });
    return [`[Verified Scholarship ${index + 1}]`, `Name: ${title}`, `Summary: ${record.summary[language]}`, `Target: ${record.targetGroup[language]}`, `Award: ${record.award.display[language]}`, `Eligibility: ${record.eligibility.gpa[language]} ${record.eligibility.citizenship[language]}`, `Cycle: ${cycle ? `${cycle.label[language]}, ${cycle.opensOn ?? "not announced"} to ${cycle.closesOn ?? "not announced"}, status ${status}` : "not announced"}`, `Application: ${record.application.directUrl ?? record.application.landingUrl ?? "not verified"}`, `Official source: ${detail?.url ?? "not available"}`].join("\n");
  });
  return { contextText: contextRecords.join("\n\n"), sources: [...sources.values()], matchedScholarshipIds: records.map((record) => record.id), matchedScholarshipTitles: records.map((record) => record.name[language]), hasBroadIntent: broad };
}

export function formatScholarshipFallback(query: string, language: "en" | "vi", context: ScholarshipContext): string {
  const records = SCHOLARSHIPS.filter((record) => context.matchedScholarshipIds.includes(record.id));
  if (records.length === 0) return language === "vi" ? "Hiện chưa tìm thấy bản ghi học bổng RMIT đã xác minh phù hợp. Hãy mở trang Học bổng RMIT để kiểm tra các đợt mới nhất." : "No verified RMIT scholarship record matched that question. Open the RMIT Scholarships page for the latest published cycles.";
  const statusLabel = (status: ReturnType<typeof scholarshipCycleStatus>) => language === "vi" ? ({ open: "đang mở", upcoming: "sắp mở", closed: "đã đóng", unverified: "chưa xác minh", not_announced: "chưa công bố" }[status]) : ({ open: "open", upcoming: "upcoming", closed: "closed", unverified: "unverified", not_announced: "not announced" }[status]);
  const lines = records.map((record) => {
    const cycle = currentScholarshipCycle(record);
    const status = scholarshipCycleStatus(record);
    const detail = record.sources.find((source) => source.kind.includes("detail")) ?? record.sources[0];
    const application = record.application.directUrl ?? record.application.landingUrl;
    return language === "vi" ? `• ${record.name.vi}: ${record.award.display.vi} Trạng thái: ${statusLabel(status)}${cycle?.closesOn ? `; hạn ${cycle.closesOn}` : ""}. ${application ? `Ứng tuyển/thông tin: ${application}` : "Link ứng tuyển chưa xác minh."} Nguồn: ${detail?.url ?? "RMIT"}` : `• ${record.name.en}: ${record.award.display.en} Status: ${statusLabel(status)}${cycle?.closesOn ? `; deadline ${cycle.closesOn}` : ""}. ${application ? `Apply/instructions: ${application}` : "Application link is not verified."} Source: ${detail?.url ?? "RMIT"}`;
  }).join("\n");
  return language === "vi" ? `Mình tìm thấy các học bổng RMIT đã xác minh:\n\n${lines}\n\nĐiều kiện và hạn có thể khác theo chương trình. Hãy mở nguồn chính thức trước khi nộp hồ sơ.` : `I found these verified RMIT scholarships:\n\n${lines}\n\nEligibility and deadlines vary by program. Open the official source before applying.`;
}
export interface GlobalExperienceContext {
  contextText: string;
  sources: { title: string; url: string }[];
  matchedProgramIds: GlobalExperienceProgramId[];
  matchedProgramTitles: string[];
  matchedScholarshipIds: string[];
  matchedScholarshipTitles: string[];
  hasScholarshipIntent: boolean;
  hasStudyPlanIntent: boolean;
  hasPermanentTransferIntent: boolean;
}

export function isGlobalExperienceQuery(query: string): boolean {
  const normalized = normalizeEventText(query);
  return /global experience|global scholarship|study abroad|overseas study|study overseas|outbound mobility|exchange|cross[- ]campus|interlocation|international exchange|semester abroad|study plan|credit transfer|permanent transfer|erasmus|seed|du hoc|trao doi|hoc o nuoc ngoai|ke hoach hoc tap|chuyen tiep vinh vien/i.test(normalized)
    || (/canada|australia|singapore|hong kong|melbourne/i.test(normalized) && /study|exchange|program|du hoc|trao doi|hoc/i.test(normalized));
}

export function buildGlobalExperienceContext(query: string, language: "en" | "vi" = "en"): GlobalExperienceContext {
  const empty: GlobalExperienceContext = {
    contextText: "",
    sources: [],
    matchedProgramIds: [],
    matchedProgramTitles: [],
    matchedScholarshipIds: [],
    matchedScholarshipTitles: [],
    hasScholarshipIntent: false,
    hasStudyPlanIntent: false,
    hasPermanentTransferIntent: false,
  };
  if (!isGlobalExperienceQuery(query)) return empty;

  const normalized = normalizeEventText(query);
  const hasScholarshipIntent = /scholarship|grant|erasmus|seed|hoc bong|tro cap/i.test(normalized);
  const hasStudyPlanIntent = /study plan|studyplan|credit transfer|cong nhan tin chi|ke hoach hoc tap/i.test(normalized);
  const hasPermanentTransferIntent = /permanent transfer|transfer permanently|complete.*degree.*melbourne|chuyen tiep vinh vien|chuyen truong.*melbourne/i.test(normalized);
  const explicitCrossCampus = /cross[- ]campus|rmit melbourne|study in melbourne|exchange.*melbourne|melbourne.*(exchange|semester|study)/i.test(normalized);
  const explicitInterlocation = /interlocation|singapore|hong kong|hongkong|asia|chau a|vtc shape|hong kong arts/i.test(normalized);
  const explicitShortProgram = /short program|short course|global summer|summer program|winter program|stx/i.test(normalized);
  const explicitPartnerExchange = /partner exchange|exchange.*partner|partner.*universit|worldwide exchange|canada/i.test(normalized);
  const selectedIds = new Set<GlobalExperienceProgramId>();
  if (explicitCrossCampus) selectedIds.add("cross-campus-melbourne");
  if (explicitInterlocation) selectedIds.add("interlocation-asia");
  if (explicitShortProgram) selectedIds.add("global-short-programs");
  if (explicitPartnerExchange) selectedIds.add("partner-exchange");
  if (hasPermanentTransferIntent && /difference|versus|\bvs\b|compare|khac|so sanh/i.test(normalized)) {
    selectedIds.add("cross-campus-melbourne");
  }
  if (
    selectedIds.size === 0 &&
    !hasScholarshipIntent &&
    !hasStudyPlanIntent &&
    !hasPermanentTransferIntent
  ) {
    GLOBAL_EXPERIENCE_PROGRAMS.forEach((program) => selectedIds.add(program.id));
  }

  const programs = GLOBAL_EXPERIENCE_PROGRAMS.filter((program) => selectedIds.has(program.id));
  const scholarships = hasScholarshipIntent
    ? GLOBAL_EXPERIENCE_SCHOLARSHIPS.filter((scholarship) => {
        const title = normalizeEventText(scholarship.title.en);
        if (/seed/i.test(normalized)) return scholarship.id === "seed-canada-asean";
        if (/erasmus/i.test(normalized)) return scholarship.id.startsWith("erasmus");
        const namedHost = ["aarhus", "aalto", "amfi", "amsterdam"].some((host) => normalized.includes(host));
        return !namedHost || title.split(/\s+/).some((word) => word.length > 3 && normalized.includes(word));
      })
    : [];

  const sources = new Map<string, { title: string; url: string }>();
  const addSource = (title: string, url: string) => {
    if (url) sources.set(url, { title, url });
  };
  addSource(language === "vi" ? "RMIT Global Experience" : "RMIT Global Experience", GLOBAL_EXPERIENCE_URLS.overview);
  for (const program of programs) {
    addSource(program.title[language], program.informationUrl);
    if (program.instructionsUrl) addSource(language === "vi" ? "Hướng dẫn đăng ký RMIT" : "RMIT application instructions", program.instructionsUrl);
    addSource(program.applicationPortalLabel[language], program.applicationPortalUrl);
  }
  if (hasPermanentTransferIntent) {
    addSource(language === "vi" ? "Chuyển tiếp vĩnh viễn sang Melbourne" : "Permanent transfer to Melbourne", GLOBAL_EXPERIENCE_URLS.permanentTransfer);
  }
  if (hasScholarshipIntent) addSource(language === "vi" ? "Học bổng và hỗ trợ Global Experience" : "Global Experience scholarships and grants", GLOBAL_EXPERIENCE_URLS.scholarships);
  if (hasStudyPlanIntent) {
    addSource(language === "vi" ? "Global Experience Study Plan" : "Global Experience Study Plan", GLOBAL_EXPERIENCE_URLS.studyPlan);
    addSource(language === "vi" ? "Student Connect Online Portal" : "Student Connect Online Portal", GLOBAL_EXPERIENCE_URLS.studyPlanSubmission);
  }

  const blocks = [`Global Experience information last checked against official RMIT sources: ${GLOBAL_EXPERIENCE_LAST_VERIFIED}.`];
  for (const program of programs) {
    const cycles = program.cycles.length
      ? program.cycles.map((cycle) => {
          const status = getApplicationCycleStatus(cycle);
          const opens = cycle.opensOn ? formatGlobalExperienceDate(cycle.opensOn, language) : "not announced";
          const closes = cycle.closesOn ? formatGlobalExperienceDate(cycle.closesOn, language) : "not announced";
          return `${cycle.label[language]}: opens ${opens}, closes ${closes} at 11:59 pm Melbourne time; status ${status}.`;
        }).join("\n")
      : (language === "vi" ? "Ngày tuyển hiện tại: tùy hồ sơ Mobi; không có hạn chung được công bố." : "Current dates: listing-specific in Mobi; no general deadline is published.");
    const steps = /how|apply|application|register|deadline|when|nộp|đăng ký|hạn|khi nào/i.test(normalized)
      ? `\nApplication steps:\n- ${program.applicationSteps.map((step) => step[language]).join("\n- ")}`
      : "";
    blocks.push([
      `Program: ${program.title[language]}`,
      `Summary: ${program.summary[language]}`,
      `Destination and duration: ${program.destination[language]}; ${program.duration[language]}.`,
      `Tuition and costs: ${program.tuitionAndCosts[language]}`,
      `Eligibility: ${program.eligibility.map((item) => item[language]).join(" ")}`,
      `Published intake dates: ${cycles}`,
      program.notes ? `Source note: ${program.notes[language]}` : "",
      steps,
      `Official information: ${program.informationUrl}`,
      program.instructionsUrl ? `Application instructions: ${program.instructionsUrl}` : "",
      `Application portal (portal access does not indicate an open intake): ${program.applicationPortalUrl}`,
    ].filter(Boolean).join("\n"));
  }

  if (hasScholarshipIntent) {
    blocks.push(`Global Experience scholarships and grants:\n${scholarships.map((scholarship) => {
      const deadline = scholarship.partnerDeadline
        ? ` Partner Exchange prerequisite cutoff: ${formatGlobalExperienceDate(scholarship.partnerDeadline, language)}; current status ${getDeadlineStatus(scholarship.partnerDeadline)}. This is not a separate scholarship deadline.`
        : "";
      return `- ${scholarship.title[language]} (${scholarship.intake[language]}): ${scholarship.amount[language]} Eligibility: ${scholarship.eligibility[language]} Application: ${scholarship.application[language]}${deadline}`;
    }).join("\n")}\nRMIT scholarship source: ${GLOBAL_EXPERIENCE_URLS.scholarships}`);
  }

  if (hasStudyPlanIntent) {
    blocks.push([
      `Study Plan: ${GLOBAL_EXPERIENCE_STUDY_PLAN.overview[language]}`,
      `Steps:\n- ${GLOBAL_EXPERIENCE_STUDY_PLAN.steps.map((step) => step[language]).join("\n- ")}`,
      `Program loads:\n- ${GLOBAL_EXPERIENCE_STUDY_PLAN.programLoads.map((item) => item[language]).join("\n- ")}`,
      `Processing:\n- ${GLOBAL_EXPERIENCE_STUDY_PLAN.processingTimes.map((item) => item[language]).join("\n- ")}`,
      `Study Plan page: ${GLOBAL_EXPERIENCE_URLS.studyPlan}`,
      `Submission: ${GLOBAL_EXPERIENCE_URLS.studyPlanSubmission}`,
      `Forms: ${GLOBAL_EXPERIENCE_URLS.crossCampusStudyPlanForm}; ${GLOBAL_EXPERIENCE_URLS.partnerStudyPlanForm}`,
    ].join("\n"));
  }

  if (hasPermanentTransferIntent) {
    blocks.push(`Permanent transfer is a separate pathway for completing a degree in Melbourne, not a temporary Cross-campus semester. Official information: ${GLOBAL_EXPERIENCE_URLS.permanentTransfer}`);
  }

  return {
    contextText: blocks.join("\n\n"),
    sources: [...sources.values()],
    matchedProgramIds: programs.map((program) => program.id),
    matchedProgramTitles: programs.map((program) => program.title[language]),
    matchedScholarshipIds: scholarships.map((scholarship) => scholarship.id),
    matchedScholarshipTitles: scholarships.map((scholarship) => scholarship.title[language]),
    hasScholarshipIntent,
    hasStudyPlanIntent,
    hasPermanentTransferIntent,
  };
}

export function formatGlobalExperienceFallback(
  query: string,
  language: "en" | "vi",
  context: GlobalExperienceContext,
): string {
  if (context.hasStudyPlanIntent) {
    return language === "vi"
      ? "Study Plan là bước để RMIT Việt Nam duyệt các môn dự kiến được công nhận. Hãy kiểm tra yêu cầu chương trình còn lại, chọn môn phù hợp ở đúng học kỳ, chuẩn bị đề cương và nộp đúng biểu mẫu qua Student Connect. Thời gian xử lý thường là 15 ngày làm việc với Partner Exchange và 10 ngày với Cross-campus, Interlocation hoặc STX. Được duyệt không đảm bảo trường tiếp nhận còn môn hoặc chấp nhận đăng ký."
      : "A Study Plan is RMIT Vietnam’s approval of proposed courses for credit. Check your remaining program requirements, choose host courses for the correct term, prepare course outlines, and submit the right form through Student Connect. Processing is usually 15 working days for Partner Exchange and 10 for Cross-campus, Interlocation or STX. Approval does not guarantee host-course availability or acceptance.";
  }
  if (context.hasScholarshipIntent) {
    const scholarships = GLOBAL_EXPERIENCE_SCHOLARSHIPS.filter((scholarship) => context.matchedScholarshipIds.includes(scholarship.id));
    const listAll = /all|every|list|danh sach|toan bo/i.test(normalizeEventText(query));
    const lines = scholarships.map((scholarship) => `• ${scholarship.title[language]}: ${scholarship.amount[language]} ${scholarship.application[language]}`).join("\n");
    const intro = language === "vi"
      ? "Học bổng Global Experience phụ thuộc trường đối tác và đợt tuyển. Các khoản cụ thể có thể theo thư mời; hạn Partner Exchange của các khoản năm 2027 đã qua. RMIT chưa công bố đợt học bổng 2028 trên trang đã kiểm tra."
      : "Global Experience funding depends on the host partner and intake. Specific grants may be invitation-based; the prerequisite Partner Exchange cutoffs for listed 2027 awards have passed. The checked RMIT page has no 2028 grant intake dates.";
    const shown = listAll ? lines : scholarships.slice(0, 3).map((scholarship) => `• ${scholarship.title[language]}: ${scholarship.amount[language]} ${scholarship.application[language]}`).join("\n");
    return `${intro}${shown ? `\n\n${shown}` : ""}`;
  }
  if (context.hasPermanentTransferIntent) {
    return language === "vi"
      ? "Chuyển tiếp vĩnh viễn sang Melbourne là lộ trình riêng để hoàn tất bằng tại RMIT Melbourne. Cross-campus chỉ là học tạm thời 1–2 học kỳ, vẫn đăng ký toàn thời gian và đóng học phí RMIT Việt Nam."
      : "Permanent transfer to Melbourne is a separate pathway to complete your degree at RMIT Melbourne. Cross-campus is temporary study for 1–2 semesters while you remain enrolled full-time and pay RMIT Vietnam tuition.";
  }

  const programs = GLOBAL_EXPERIENCE_PROGRAMS.filter((program) => context.matchedProgramIds.includes(program.id));
  if (programs.length === 1) {
    const program = programs[0];
    const status = program.cycles.map((cycle) => {
      const applicationStatus = getApplicationCycleStatus(cycle);
      const statusLabel = language === "vi"
        ? { open: "đang mở", upcoming: "sắp mở", closed: "đã đóng", not_announced: "chưa công bố" }[applicationStatus]
        : { open: "open", upcoming: "upcoming", closed: "closed", not_announced: "not announced" }[applicationStatus];
      const range = cycle.opensOn && cycle.closesOn
        ? ` (${formatGlobalExperienceDate(cycle.opensOn, language)}–${formatGlobalExperienceDate(cycle.closesOn, language)}, ${language === "vi" ? "giờ Melbourne" : "Melbourne time"})`
        : "";
      return `${cycle.label[language]}: ${statusLabel}${range}`;
    }).join("; ");
    return `${program.title[language]}: ${program.summary[language]}\n\n${language === "vi" ? "Điều kiện chính" : "Main eligibility"}: ${program.eligibility.slice(0, 2).map((item) => item[language]).join(" ")}\n\n${status ? `${language === "vi" ? "Các đợt đã công bố" : "Published intakes"}: ${status}.` : (language === "vi" ? "Ngày và điều kiện tùy hồ sơ chương trình hiện hành." : "Dates and eligibility are specific to current program listings.")} ${language === "vi" ? "Mở nguồn chính thức kèm theo để xem cổng và hồ sơ." : "Open the attached official sources for the application portal and instructions."}`;
  }
  const overview = programs.length > 0 ? programs : GLOBAL_EXPERIENCE_PROGRAMS;
  return language === "vi"
    ? `RMIT có bốn lộ trình Global Experience khác nhau:\n\n${overview.map((program) => `• ${program.title.vi}: ${program.summary.vi}`).join("\n")}\n\nHãy chọn lộ trình phù hợp rồi kiểm tra điều kiện, Study Plan và hạn của đúng đợt trên nguồn RMIT.`
    : `RMIT offers four distinct Global Experience pathways:\n\n${overview.map((program) => `• ${program.title.en}: ${program.summary.en}`).join("\n")}\n\nChoose a pathway, then verify its eligibility, Study Plan and intake deadline on the official RMIT sources.`;
}

export interface EventContext {
  contextText: string;
  sources: { title: string; url: string }[];
  matchedEventTitles: string[];
  matchedActivityTitles: string[];
}

function normalizeEventText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/đ/g, "d");
}

function isAssignmentPerformanceAdviceQuery(query: string): boolean {
  const normalized = normalizeEventText(query);
  const assignmentTask = /\b(?:assignments?|assessments?|coursework|projects?|bai tap|bai lam)\b/i.test(normalized);
  const gradeGoal = /\b(?:high|higher|good|better|top)\s+(?:scores?|marks?|grades?)\b|\b(?:score|mark|grade)\s+(?:high|better|well)\b|\b(?:improve|raise|boost|achieve|get|earn)\b.{0,35}\b(?:scores?|marks?|grades?)\b|\bdiem cao\b|\bdat diem cao\b|\bcai thien diem\b/i.test(normalized);
  return assignmentTask && gradeGoal;
}
function isClubDayActivityQuery(query: string): boolean {
  return /club day|clubs day|ngay hoi cau lac bo|ngay hoi clb/i.test(normalizeEventText(query));
}

function getEventRegistrationLinks(entry: CalendarEntry): { label: string; url: string }[] {
  if (entry.registrationLinks?.length) {
    return entry.registrationLinks.map((link) => ({ label: link.labelEn, url: link.url }));
  }
  return entry.registrationUrl ? [{ label: "Register", url: entry.registrationUrl }] : [];
}

export function buildEventContext(query: string, language: "en" | "vi" = "en"): EventContext {
  const normalizedQuery = normalizeEventText(query);
  const eventIntent = /event|happening|this week|this weekend|workshop|festival|competition|what can i join|su kien|hoat dong|hoi thao|le hoi|cuoc thi|tuan nay|cuoi tuan/i.test(normalizedQuery) || isClubDayActivityQuery(normalizedQuery);
  if (!eventIntent) return { contextText: "", sources: [], matchedEventTitles: [], matchedActivityTitles: [] };
  if (isClubDayActivityQuery(normalizedQuery)) {
    const clubDay = CAMPUS_ACTIVITY_HIGHLIGHTS.find((activity) => activity.id === "activity-club-day");
    const contextText = language === "vi"
      ? "[Hoạt động định kỳ RMIT đã xác minh]\nTên: Club Day.\nTần suất và cơ sở: Trang lưu trữ chính thức của RMIT cho biết Club Day diễn ra mỗi học kỳ tại cả Nam Sài Gòn và Hà Nội.\nNội dung: Sinh viên có thể tham quan gian hàng câu lạc bộ, gặp thành viên, tìm hiểu hoạt động và hỏi về cơ hội tham gia.\nLịch hiện tại: Các nguồn hoạt động/sự kiện chính thức đã kiểm tra chưa công bố ngày hiện tại cho từng cơ sở. Hãy nói lịch chưa được công bố; không suy ra ngày từ bài viết cũ hoặc bịa link đăng ký.\nBước tiếp theo: xem trang thông báo hoạt động RMIT, danh bạ câu lạc bộ chính thức và hướng dẫn tham gia."
      : "[Verified recurring RMIT activity]\nName: Club Day.\nFrequency and campuses: RMIT's official archive says Club Day is held every semester at both Saigon South and Hanoi.\nWhat students can do: Explore club booths, meet members, discover activities, and ask about membership opportunities.\nCurrent schedule: The official activities/events sources checked do not announce a current date for either campus. Say the date is TBA; do not infer dates from old posts or invent registration links.\nNext steps: check RMIT's activity announcements, the official club directory, and the How to Join guide.";
    return {
      contextText,
      sources: [
        { title: language === "vi" ? "Hoạt động và sự kiện sinh viên RMIT" : "RMIT Student Activities and Events", url: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events" },
        { title: language === "vi" ? "Club Day Fun Day — bài viết lưu trữ RMIT" : "Club Day Fun Day — RMIT official archive", url: "https://www.rmit.edu.vn/news/all-news/2017/mar/club-day-fun-day" },
        { title: language === "vi" ? "Game On! Club Day — gian hàng câu lạc bộ" : "Game On! Club Day goes full ‘RCADE’ with booth decorations", url: clubDay?.sourceUrl ?? "https://www.rmit.edu.vn/students/student-news-and-events/student-news/2025/club-day-goes-full-rcade-with-booth-decorations/cl" },
        { title: "Newbie 101: Clubs and Societies", url: "https://www.rmit.edu.vn/students/student-news-and-events/student-news/student-news-2024/newbie-101-clubs-and-societies" },
        { title: language === "vi" ? "Danh bạ câu lạc bộ RMIT" : "RMIT Student Clubs directory", url: "https://www.rmit.edu.vn/students/campus-life/clubs" },
        { title: language === "vi" ? "Khám phá câu lạc bộ" : "Explore Student Clubs", url: "/clubs" },
        { title: language === "vi" ? "Hướng dẫn tham gia CLB" : "How to Join a Club", url: "/guides/danh-sach-cau-lac-bo-rmit-viet-nam" },
      ],
      matchedEventTitles: [],
      matchedActivityTitles: [language === "vi" ? (clubDay?.titleVi ?? "Club Day") : (clubDay?.titleEn ?? "Club Day")],
    };
  }

  const socialEventIntent = /meet people|make friends|network|connect with people|new people|gặp người mới|gap nguoi moi|kết bạn|ket ban|làm quen|lam quen|mở rộng vòng tròn|mo rong vong tron/i.test(normalizedQuery);
  const queryTerms = normalizedQuery.split(/\s+/).filter((term) => term.length >= 3);
  const now = Date.now();
  const upcomingEntries = getPublishedCalendarEntries()
    .filter((entry) => entry.type === "campus_event")
    .filter((entry) => Date.parse(entry.endAt ?? entry.startAt) >= now);
  const socialEntries = upcomingEntries.filter((entry) => entry.category === "festival" || entry.category === "student-life");
  const candidateEntries = socialEventIntent && socialEntries.length > 0 ? socialEntries : upcomingEntries;
  const scoredEntries = candidateEntries
    .map((entry) => {
      const searchable = normalizeEventText([
        entry.titleEn,
        entry.titleVi,
        entry.descriptionEn,
        entry.descriptionVi,
        entry.category,
        entry.organiserEn,
        entry.organiserVi,
        entry.venueEn ?? "",
        entry.venueVi ?? "",
      ].join(" "));
      const keywordScore = queryTerms.reduce((score, term) => score + (searchable.includes(term) ? 2 : 0), 0);
      const socialCategoryScore = socialEventIntent && (entry.category === "festival" || entry.category === "student-life") ? 4 : 0;
      return { entry, score: keywordScore + socialCategoryScore };
    })
    .sort((left, right) => right.score - left.score || left.entry.startAt.localeCompare(right.entry.startAt))
    .slice(0, 3);

  if (scoredEntries.length === 0) {
    return {
      contextText: language === "vi"
        ? "Không có sự kiện cơ sở nào đã xác minh phù hợp trong danh sách hiện tại."
        : "No matching verified campus events are currently listed.",
      sources: [],
      matchedEventTitles: [],
      matchedActivityTitles: [],
    };
  }

  const sources = scoredEntries.flatMap(({ entry }) => {
    const title = language === "vi" ? entry.titleVi : entry.titleEn;
    const registrationSources = getEventRegistrationLinks(entry).map((link) => ({
      title: `${title} — ${link.label}`,
      url: link.url,
    }));
    return [{ title, url: entry.originalUrl }, ...registrationSources];
  });
  const matchedEventTitles = scoredEntries.map(({ entry }) => language === "vi" ? entry.titleVi : entry.titleEn);
  const contextText = scoredEntries.map(({ entry }, index) => {
    const title = language === "vi" ? entry.titleVi : entry.titleEn;
    const description = language === "vi" ? entry.descriptionVi : entry.descriptionEn;
    const organiser = language === "vi" ? entry.organiserVi : entry.organiserEn;
    const venue = language === "vi" ? entry.venueVi : entry.venueEn;
    const registrations = getEventRegistrationLinks(entry);
    return [
      `[Verified Campus Event ${index + 1}]`,
      `Title: ${title}`,
      `Date: ${entry.startAt}${entry.endAt ? ` to ${entry.endAt}` : ""}`,
      `Event type: ${entry.category === "festival" || entry.category === "student-life" ? "social / recreational activity" : entry.category}`,
      `Campus: ${entry.campus}`,
      `Venue: ${venue ?? "Not specified"}`,
      `Organiser: ${organiser}`,
      `Description: ${description}`,
      registrations.length > 0 ? `Registration links: ${registrations.map((link) => `${link.label}: ${link.url}`).join(" | ")}` : "Registration link: Not listed in the verified source.",
    ].join("\n");
  }).join("\n\n");

  return { contextText, sources, matchedEventTitles, matchedActivityTitles: [] };
}
export function isPracticalStudentLifeQuery(query: string): boolean {
  const normalizedQuery = normalizeEventText(query);
  return isAssignmentPerformanceAdviceQuery(query) || /make friends|meet people|meet students|new people|other majors|students from|find teammates|find a teammate|teammate|team mate|teammates|groupmate|group mate|groupmates|team members|find a group|reliable.*(team|group)|group assignment|study partner|how do i join|how can i join|im shy|i am shy|dont know anyone|don't know anyone|ket ban|tim dong doi|tim ban hoc|tim teammate|tim nhom|ban cung nhom|ban chung nganh|kiem ban chung nganh|lam viec nhom|tham gia cau lac bo|ngai giao tiep|lam sao de ket ban/i.test(normalizedQuery) || isClubDayActivityQuery(normalizedQuery);
}
export function formatStudentLifeFallback(query: string, language: "en" | "vi", eventContext: EventContext): string {
  if (isAssignmentPerformanceAdviceQuery(query)) {
    return language === "vi"
      ? "Hãy dùng đề bài và rubric làm checklist trước khi bắt đầu. Đáp ứng từng tiêu chí, hỗ trợ luận điểm bằng nguồn đáng tin và trích dẫn đúng; dành thời gian viết nháp, hỏi giảng viên khi cần và rà soát trước khi nộp. Kiểm tra yêu cầu riêng của môn học; không có cách chung nào bảo đảm một mức điểm."
      : "Use the assignment brief and rubric as a checklist before you start. Address each criterion, support claims with credible evidence and correct citations, and leave time for a draft, feedback or consultation, and proofreading. Check the course-specific requirements; no general approach can guarantee a particular mark.";
  }
  if (eventContext.matchedActivityTitles.some((title) => /club day/i.test(title))) {
    return language === "vi"
      ? "Club Day là ngày hội câu lạc bộ diễn ra mỗi học kỳ tại Nam Sài Gòn và Hà Nội. Bạn có thể tham quan gian hàng, gặp thành viên và hỏi trực tiếp về hoạt động/cách tham gia. Lịch hiện tại của từng cơ sở chưa được công bố; hãy theo dõi trang Hoạt động và sự kiện RMIT. Bạn cũng có thể xem Danh bạ CLB hoặc Hướng dẫn tham gia để chuẩn bị."
      : "Club Day is held each semester at Saigon South and Hanoi. Visit club booths, meet members, and ask about activities and how to join. Current dates for either campus have not been announced; check RMIT's Student Activities and Events page. The Club Directory and How to Join guide can help you prepare.";
  }
  if (eventContext.matchedEventTitles.length > 0) {
    const titles = eventContext.matchedEventTitles.map((title) => `• ${title}`).join("\n");
    return language === "vi"
      ? `Mình tìm thấy các sự kiện RMIT đã được xác minh:\n\n${titles}\n\nBạn có thể mở các nguồn và link đăng ký đi kèm để xem chi tiết.`
      : `I found these verified RMIT events:\n\n${titles}\n\nOpen the attached source and registration links for details.`;
  }

  if (/event|workshop|festival|competition|su kien|hoi thao|le hoi|cuoc thi/i.test(normalizeEventText(query))) {
    return language === "vi"
      ? "Hiện chưa có sự kiện RMIT đã xác minh phù hợp trong danh sách. Bạn có thể xem thêm tại trang Campus Events."
      : "No matching verified RMIT event is currently listed. You can check the Campus Events page for the latest entries.";
  }

  const normalizedQuery = normalizeEventText(query);
  const teammateIntent = /teammate|team mate|teammates|groupmate|group mate|groupmates|team members|find a group|group assignment|reliable.*(team|group)|tim teammate|tim nhom|ban cung nhom|lam viec nhom/i.test(normalizedQuery);
  if (teammateIntent) {
    return language === "vi"
      ? "Để tìm teammate đáng tin cậy, bạn có thể:\n\n• Bắt đầu từ bạn cùng lớp hoặc tutorial; hỏi về lịch rảnh, cách giao tiếp và mức độ cam kết.\n• Thống nhất sớm vai trò, deadline nội bộ và cách cập nhật tiến độ.\n• Kiểm tra quy định của giảng viên về cách lập nhóm trước khi chốt thành viên.\n\nBạn có thể nhắn: “Bạn đã có nhóm cho bài này chưa? Mình muốn tìm teammate có thể lên kế hoạch và chia việc rõ ràng.” Nếu teammate không phản hồi, lưu lại các lần liên hệ và báo giảng viên theo quy định môn học."
      : "To find reliable teammates:\n\n• Start with classmates or tutorial partners and ask about availability, communication style, and commitment.\n• Agree on roles, internal deadlines, and progress updates before forming the group.\n• Check your lecturer's group-formation rules before finalising members.\n\nYou could write: “Have you found a group for this assignment? I'm looking for teammates who can plan the work and communicate clearly.” If someone becomes unresponsive, keep a record of your attempts and contact the lecturer according to the course rules.";
  }

  const friendshipIntent = /make friends|meet people|meet students|new people|other majors|students from|lonely|shy|dont know anyone|don't know anyone|ket ban|lam quen|tim ban|ban be|ban chung nganh|ngai giao tiep/i.test(normalizedQuery);
  if (friendshipIntent) {
    return language === "vi"
      ? "Bạn có thể mở rộng vòng tròn bạn bè bằng vài bước thực tế:\n\n• Bắt chuyện với bạn cùng lớp sau tutorial bằng một câu hỏi về môn học hoặc bài tập.\n• Rủ một người học chung, ăn trưa hoặc tham gia một hoạt động nhỏ.\n• Chọn CLB, workshop hoặc sự kiện phù hợp sở thích để gặp người mới tự nhiên hơn.\n\nNếu bạn hơi ngại, hãy bắt đầu bằng một tin nhắn ngắn và một hoạt động có mục tiêu rõ ràng."
      : "A few practical ways to expand your circle:\n\n• Start with classmates after a tutorial by asking about the subject or assignment.\n• Invite someone to study, have lunch, or join a small activity.\n• Try a club, workshop, or campus event that matches your interests so conversation happens naturally.\n\nIf you are shy, start with one short message and an activity with a clear purpose.";
  }

  return language === "vi"
    ? "Bạn có thể bắt đầu bằng một bước nhỏ: bắt chuyện với bạn cùng lớp, tham gia một hoạt động phù hợp sở thích hoặc rủ một người học chung sau giờ học. Nếu cần, mình có thể giúp bạn soạn một tin nhắn mở lời tự nhiên."
    : "Start with one low-pressure step: talk to a classmate, join an activity that matches your interests, or invite someone to study after class. I can also help you write a natural opening message.";
}
export function formatClubFallback(language: "en" | "vi", clubContext: ClubContext): string {
  if (clubContext.needsClubClarification) {
    return language === "vi"
      ? "Bạn muốn hỏi về CLB nào và ở cơ sở nào? Mình chưa xác định được CLB từ trang hiện tại."
      : "Which club and campus do you mean? I could not identify a verified club from the current page.";
  }
  if (clubContext.matchedClubNames.length === 0) {
    return language === "vi"
      ? "Hiện chưa có bản ghi câu lạc bộ đã xác minh phù hợp với bộ lọc này. Bạn có thể xem danh sách câu lạc bộ chính thức của RMIT để tìm thêm."
      : "No verified club records matched those filters. You can check the official RMIT club directory for more options.";
  }

  if (clubContext.specificClub) {
    const clubLines = clubContext.matchedClubs.map((club) => {
      const campus = club.campus === "saigon_south" ? (language === "vi" ? "Nam Sài Gòn" : "Saigon South") : (language === "vi" ? "Hà Nội" : "Hanoi");
      const description = clubAboutSummary(club, language);
      const recruitment = club.recruitment;
      const status = {
        recruiting: language === "vi" ? "Đang tuyển" : "Recruiting",
        closed: language === "vi" ? "Đã đóng" : "Closed",
        upcoming: language === "vi" ? "Sắp mở" : "Upcoming",
        not_announced: language === "vi" ? "Chưa có thông báo" : "Not announced",
        unverified: language === "vi" ? "Chưa xác minh" : "Unverified",
      }[recruitment.recruitmentStatus];
      const interview = recruitment.interviewRequired === "yes" ? (language === "vi" ? "Có" : "Yes") : recruitment.interviewRequired === "no" ? (language === "vi" ? "Không" : "No") : (language === "vi" ? "Chưa xác minh" : "Not confirmed");
      const deadline = recruitment.applicationDeadline ?? (language === "vi" ? "Chưa có hạn hiện tại" : "No current deadline published");
      const channels = clubContactLines(club, language).join("\n");
      const heading = `**${language === "vi" ? club.nameVi : club.nameEn} — ${campus}**`;
      if (clubContext.recruitmentIntent) {
        const requirement = (value: string) => value === "yes"
          ? (language === "vi" ? "Có" : "Yes")
          : value === "no" ? (language === "vi" ? "Không" : "No")
            : (language === "vi" ? "Chưa xác minh" : "Not confirmed");
        const application = recruitment.applicationUrl ?? (language === "vi" ? "Chưa được công bố" : "Not published");
        const joining = language === "vi"
          ? [recruitment.generalMembershipVi, recruitment.committeeRecruitmentVi, recruitment.eligibilityVi, ...recruitment.applicationProcessVi]
          : [recruitment.generalMembershipEn, recruitment.committeeRecruitmentEn, recruitment.eligibilityEn, ...recruitment.applicationProcessEn];
        const joiningText = joining.map((step) => `• ${step}`).join("\n");
        return language === "vi"
          ? `${heading}\nTrạng thái tuyển: ${status}\nPhỏng vấn: ${interview}\nCV/portfolio: ${requirement(recruitment.cvPortfolioRequired)}\nThử sức/đánh giá: ${requirement(recruitment.tryoutRequired)}\nHạn đăng ký: ${deadline}\nĐăng ký: ${application}\n${joiningText}\n${channels}\nHãy xác nhận đợt tuyển với CLB; thông tin chưa xác minh không có nghĩa là có hoặc không có yêu cầu.`
          : `${heading}\nRecruitment status: ${status}\nInterview required: ${interview}\nCV/portfolio: ${requirement(recruitment.cvPortfolioRequired)}\nTryout/assessment: ${requirement(recruitment.tryoutRequired)}\nDeadline: ${deadline}\nApply: ${application}\n${joiningText}\n${channels}\nConfirm the current intake with the club; unknown information does not mean a requirement exists or is waived.`;
      }
      if (clubContext.contactIntent) return `${heading}\n${channels}`;
      const activities = club.profile?.activities.slice(0, 5).map((activity) => `• ${activity[language]}`).join("\n");
      return `${heading}\n${description}${activities ? `\n\n${language === "vi" ? "Hoạt động công khai" : "Published activities"}:\n${activities}` : ""}`;
    }).join("\n\n");
    return clubLines;
  }

  if (clubContext.recruitmentIntent) {
    return language === "vi"
      ? "Thông tin công khai hiện tại chưa xác minh yêu cầu phỏng vấn, CV, portfolio hoặc tryout chung cho các CLB. Mỗi CLB có thể có quy trình riêng; hãy mở trang chi tiết của CLB và kiểm tra kênh chính thức trước khi đăng ký."
      : "The current public records do not confirm a universal interview, CV, portfolio, or tryout requirement. Each club may use a different process, so check the club detail page and official channel before applying.";
  }

  const names = clubContext.matchedClubNames.map((name) => `• ${name}`).join("\n");
  return language === "vi"
    ? `Mình tìm thấy các câu lạc bộ RMIT đã được xác minh:\n\n${names}\n\nMở các liên kết nguồn đi kèm để xem mô tả và hướng dẫn tham gia.`
    : `I found these verified RMIT clubs:\n\n${names}\n\nOpen the attached source links for descriptions and joining guidance.`;
}
export interface ClubContext {
  contextText: string;
  sources: { title: string; url: string }[];
  matchedClubNames: string[];
  matchedClubs: ClubRecord[];
  specificClub: boolean;
  recruitmentIntent: boolean;
  contactIntent?: boolean;
  needsClubClarification?: boolean;
}

function getClubCategoryLabel(category: ClubCategory): string {
  return {
    academic: "Academic",
    active: "Active",
    creative_collectives: "Creative Collectives",
    social_special_interest: "Social & Special Interest",
  }[category];
}

/** Resolve only an existing verified record; never accept client-supplied club facts. */
export function resolveContextClubId(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > 100) return undefined;
  return getVerifiedClubs().find((club) => club.id === value)?.id;
}

function isCurrentClubQuestion(query: string): boolean {
  return /\b(this club|this society|clb nay|cau lac bo nay)\b/.test(query)
    || /^(how (do|can) i join|how to join|can i join|how (do|can) i contact (them|you)|what (is|s) (the |your )?(email|contact)|do (i|you) need an interview|is an interview required|tham gia nhu the nao|lam sao (de )?tham gia|co can phong van khong)\??$/.test(query);
}

function clubNameMentions(query: string, clubs: ClubRecord[]): ClubRecord[] {
  const searchableQuery = query.replace(/[^a-z0-9]+/g, " ").trim();
  const matches = clubs.map((club) => {
    const names = [club.nameEn, club.nameVi, club.profile?.officialName]
      .filter((name): name is string => Boolean(name))
      .flatMap((name) => [name, name.replace(/\([^)]*\)/g, " ")])
      .flatMap((name) => {
        const normalized = normalizeEventText(name).replace(/[^a-z0-9]+/g, " ").trim();
        return [normalized, normalized
          .replace(/\brmit\b|\bvietnam\b|\bclub\b|\bclb\b|\bcau lac bo\b|\bsaigon south\b|\bnam sai gon\b|\bhanoi\b|\bha noi\b/g, " ")
          .replace(/\s+/g, " ").trim()];
      });
    const matchedName = names.filter((name) => name.length >= 3 && ` ${searchableQuery} `.includes(` ${name} `))
      .sort((a, b) => b.length - a.length)[0];
    return { club, matchedName };
  }).filter((match): match is { club: ClubRecord; matchedName: string } => Boolean(match.matchedName));
  // "Flag Football" must not also match the shorter "Football" name.
  return matches.filter((match) => !matches.some((other) =>
    other.matchedName !== match.matchedName && other.matchedName.includes(match.matchedName)
  )).map(({ club }) => club);
}

function clubAboutSummary(club: ClubRecord, language: "en" | "vi"): string {
  const about = club.profile?.about.slice(0, 2).map((paragraph) => paragraph[language]).join(" ");
  return (about || club.profile?.summary[language]
    || (language === "vi" ? club.descriptionVi : club.descriptionEn)
    || (language === "vi" ? "Nguồn chính thức chưa cung cấp mô tả chi tiết." : "A detailed description is not published in the official source.")).slice(0, 1600);
}

function clubContactLines(club: ClubRecord, language: "en" | "vi"): string[] {
  const unknown = language === "vi" ? "Chưa được công bố trong nguồn chính thức." : "Not published in the official source.";
  // A checked profile's null deliberately overrides stale directory metadata.
  const email = club.profile ? club.profile.contactEmail : club.contactEmail;
  const facebook = club.profile ? club.profile.facebookUrl : club.facebookUrl;
  const instagram = club.profile ? club.profile.instagramUrl : club.instagramUrl;
  return [
    `Email: ${email || unknown}`,
    `Facebook: ${facebook || unknown}`,
    `Instagram: ${instagram || unknown}`,
    ...(club.profile?.otherLinks.slice(0, 3).map((link) => `${link.label}: ${link.url}`) ?? []),
  ];
}
/**
 * Optional page context resolves deictic club questions only. Explicit names win;
 * unknown IDs never supply facts, and unrelated topics do not inherit page data.
 */
export function buildClubContext(query: string, language: "en" | "vi" = "en", contextClubId?: unknown): ClubContext {
  const normalizedQuery = normalizeEventText(query);
  const empty: ClubContext = { contextText: "", sources: [], matchedClubNames: [], matchedClubs: [], specificClub: false, recruitmentIntent: false };
  if (isClubDayActivityQuery(normalizedQuery) || isScholarshipQuery(query)) return empty;
  const explicitClubTopic = /\b(club|clubs|society|student organization|cau lac bo|clb)\b/.test(normalizedQuery);
  if (!explicitClubTopic && /\b(tuition|course|courses|assignment|assignments|grade|gpa|enrolment|hoc phi|mon hoc|bai tap|diem|chuyen nganh)\b/.test(normalizedQuery)) return empty;
  const clubs = getVerifiedClubs();
  const namedClubs = clubNameMentions(normalizedQuery, clubs);
  const currentClubQuestion = isCurrentClubQuestion(normalizedQuery);
  const currentClub = currentClubQuestion ? clubs.find((club) => club.id === resolveContextClubId(contextClubId)) : undefined;
  const clubIntent = explicitClubTopic || namedClubs.length > 0 || Boolean(currentClub);
  if (!clubIntent) return empty;
  if (currentClubQuestion && !currentClub && namedClubs.length === 0) {
    return {
      ...empty,
      needsClubClarification: true,
      contextText: language === "vi" ? "Chưa xác định được CLB. Hãy hỏi tên CLB và cơ sở; không tự chọn CLB." : "The club is unknown. Ask for its name and campus; do not select an arbitrary club.",
    };
  }

  const campus = /sgs|saigon south|nam sai gon/i.test(normalizedQuery)
    ? "saigon_south"
    : /hanoi|ha noi|handi resco/i.test(normalizedQuery)
      ? "hanoi"
      : undefined;
  const category = /academic|business|finance|engineering|technology|tech|analytics|hoc thuat|kinh doanh|cong nghe/i.test(normalizedQuery)
    ? "academic"
    : /sport|sports|basketball|football|badminton|pickleball|the thao|bong ro|bong da/i.test(normalizedQuery)
      ? "active"
      : /creative|dance|music|media|fashion|art|sang tao|am nhac|nhay/i.test(normalizedQuery)
        ? "creative_collectives"
        : /social|culture|volunteer|community|social interest|van hoa|cong dong|tinh nguyen/i.test(normalizedQuery)
          ? "social_special_interest"
          : undefined;
  const allIntent = /what clubs|which clubs|\blist\b|\ball\b|\bavailable\b|there at|danh sach|co nhung|tat ca/i.test(normalizedQuery);
  const recruitmentIntent = /\b(recruit|recruiting|recruitment|interview|interviews|application|apply|join|joining|committee|core team|cv|portfolio|tryout|tuyen|phong van|don|tham gia|dang ky)\b/.test(normalizedQuery);
  const contactIntent = /\b(contact|email|facebook|instagram|socials|channels|lien he|kenh)\b/.test(normalizedQuery);
  const queryTerms = normalizedQuery.split(/\s+/).filter((term) => term.length >= 3);
  const candidates = clubs
    .filter((club) => !campus || club.campus === campus)
    .filter((club) => !category || club.category === category)
    .map((club) => {
      const searchable = normalizeEventText(`${club.nameEn} ${club.nameVi} ${club.descriptionEn ?? ""} ${club.category}`);
      const score = queryTerms.reduce((total, term) => total + (searchable.includes(term) ? 2 : 0), 0);
      return { club, score };
    })
    .sort((left, right) => right.score - left.score || left.club.nameEn.localeCompare(right.club.nameEn));
  const specificMatches = namedClubs.filter((club) => !campus || club.campus === campus);
  const specificClub = namedClubs.length > 0 || Boolean(currentClub);
  const selected = namedClubs.length > 0
    ? specificMatches.slice(0, 4).map((club) => ({ club, score: 0 }))
    : currentClub
      ? [{ club: currentClub, score: 0 }]
      : allIntent ? candidates : candidates.slice(0, 8);

  if (selected.length === 0) {
    return {
      contextText: language === "vi"
        ? "Không tìm thấy câu lạc bộ đã xác minh phù hợp với bộ lọc hiện tại."
        : "No verified club records matched the current filters.",
      sources: [],
      matchedClubNames: [],
      matchedClubs: [],
      specificClub,
      recruitmentIntent,
    };
  }

  const sources = selected.flatMap(({ club }) => [
    {
      title: `${club.nameEn} — ${club.campus === "saigon_south" ? "Saigon South" : "Hanoi"}`,
      url: club.officialClubUrl ?? club.sourceUrl,
    },
    ...((club.profile ? club.profile.facebookUrl : club.facebookUrl) ? [{ title: `${club.nameEn} — Facebook`, url: (club.profile ? club.profile.facebookUrl : club.facebookUrl)! }] : []),
    ...((club.profile ? club.profile.instagramUrl : club.instagramUrl) ? [{ title: `${club.nameEn} — Instagram`, url: (club.profile ? club.profile.instagramUrl : club.instagramUrl)! }] : []),
    ...(club.recruitment.applicationUrl ? [{ title: `${club.nameEn} — Application`, url: club.recruitment.applicationUrl }] : []),
    ...(club.recruitment.recruitmentAnnouncementUrl ? [{ title: `${club.nameEn} — Recruitment`, url: club.recruitment.recruitmentAnnouncementUrl }] : []),
  ]);
  const matchedClubNames = selected.map(({ club }) => language === "vi" ? club.nameVi : club.nameEn);
  const contextText = selected.map(({ club }) => {
    const name = language === "vi" ? club.nameVi : club.nameEn;
    const description = clubAboutSummary(club, language);
    return [
      `[Verified RMIT Club]`,
      `Name: ${name}`,
      `Campus: ${club.campus === "saigon_south" ? "Saigon South" : "Hanoi"}`,
      `Category: ${getClubCategoryLabel(club.category)}`,
      `About: ${description}`,
      `Published activities: ${club.profile?.activities.slice(0, 5).map((activity) => activity[language].slice(0, 220)).join("; ") || "Not published"}`,
      ...clubContactLines(club, language),
      `Source: ${club.officialClubUrl ?? club.sourceUrl}`,
      `Campus list PDF: ${club.campusListPdfUrl}`,
      `Recruitment status: ${club.recruitment.recruitmentStatus}`,
      `Interview required: ${club.recruitment.interviewRequired}`,
      `CV or portfolio required: ${club.recruitment.cvPortfolioRequired}`,
      `Tryout or assessment required: ${club.recruitment.tryoutRequired}`,
      `Application deadline: ${club.recruitment.applicationDeadline ?? "Not published"}`,
      `Application link: ${club.recruitment.applicationUrl ?? "Not published"}`,
      `Recruitment announcement: ${club.recruitment.recruitmentAnnouncementUrl ?? "Not published"}`,
      ...(recruitmentIntent ? [
        `General membership: ${language === "vi" ? club.recruitment.generalMembershipVi : club.recruitment.generalMembershipEn}`,
        `Committee recruitment: ${language === "vi" ? club.recruitment.committeeRecruitmentVi : club.recruitment.committeeRecruitmentEn}`,
        `Eligibility: ${language === "vi" ? club.recruitment.eligibilityVi : club.recruitment.eligibilityEn}`,
        `Application process: ${(language === "vi" ? club.recruitment.applicationProcessVi : club.recruitment.applicationProcessEn).slice(0, 5).join("; ")}`,
      ] : []),
      `Details status: ${club.detailsStatus}`,
    ].join("\n");
  }).join("\n\n");

  return { contextText, sources, matchedClubNames, matchedClubs: selected.map(({ club }) => club), specificClub, recruitmentIntent, contactIntent };
}
export function isSimpleFactualQuery(query: string): boolean {
  const normalized = normalizeEventText(query);
  if (/tell me everything|everything about|full overview|chi tiet tat ca|toan bo/i.test(normalized)) return false;
  return /where|which building|which floor|what floor|what room|room number|what is the name|when|start|begin|date|difference|compare|where can i eat|food|restaurant|cafe|café|eat|ăn|an uong|nha hang|quan|ca phe|do an|nhà hàng|quán|cà phê|đồ ăn|o dau|tang may|phong so|khi nao|ten gi|khac nhau/i.test(normalized);
}

function formatExactFactAnswer(doc: any, query: string, language: "en" | "vi"): string | null {
  const normalized = normalizeEventText(query);
  const isVi = language === "vi";

  if (doc.id === "facility-library-comparison") {
    return isVi
      ? "Beanland Library & Learning Commons: Tòa nhà 1, Tầng 3, Phòng 1.3.30, Nam Sài Gòn. Thư viện Hà Nội: cơ sở Handi Resco, Hà Nội."
      : "Beanland Library & Learning Commons: Building 1, Level 3, Room 1.3.30, Saigon South. Hanoi Library: Handi Resco campus, Hanoi.";
  }

  if (doc.id === "facility-sgs-b1") {
    const libraryIntent = /beanland|library|thu vien/.test(normalized);
    const roomIntent = /room|phong/.test(normalized);
    const floorIntent = /floor|level|tang/.test(normalized);
    const levelTwoIntent = /level 2|tang 2/.test(normalized);
    if (libraryIntent) {
      if (/name|ten gi/.test(normalized)) return "Beanland Library & Learning Commons.";
      if (roomIntent) return isVi ? "Phòng 1.3.30." : "Room 1.3.30.";
      if (floorIntent && !/where|o dau/.test(normalized)) return isVi ? "Tầng 3." : "Level 3.";
      return isVi ? "Tòa nhà 1, Tầng 3, Phòng 1.3.30, cơ sở Nam Sài Gòn." : "Building 1, Level 3, Room 1.3.30, Saigon South Campus.";
    }
    if (levelTwoIntent) {
      return isVi
        ? "Tầng 2: Lygon Café (khu phía Tây), Melbourne Theatre (Phòng 1.2.35) và các không gian giảng dạy, học tập."
        : "Level 2: Lygon Café (West), Melbourne Theatre (Room 1.2.35), and teaching and learning spaces.";
    }
  }

  if (doc.id === "facility-hn-main") {
    if (/library|thu vien/.test(normalized)) return isVi ? "Thư viện Hà Nội, Tầng 2, Phòng 1.2.006." : "Hanoi Library, Level 2, Room 1.2.006.";
    if (/student connect|trung tam ho tro/.test(normalized)) return isVi ? "Student Connect Hà Nội, Tầng 1, Phòng 1.1.009." : "Hanoi Student Connect, Level 1, Room 1.1.009.";
    if (/it support|support.*it|ho tro cntt/.test(normalized)) return isVi ? "IT Support Hà Nội: Tòa nhà B, Tầng 5, Phòng 11." : "Hanoi IT Support: Building B, Level 5, Room 11.";
    if (/writing|learning centre|wlc|academic success|hoc tap/.test(normalized)) return isVi ? "Writing and Learning Centre Hà Nội, Phòng 1.2.001." : "Hanoi Writing and Learning Centre, Room 1.2.001.";
    if (/career ready|career hub|career|huong nghiep/.test(normalized)) return isVi ? "Career Ready Hub: Tower A, Tầng 5, Phòng 1.5.A024. Nhãn sơ đồ cần được xác nhận với dịch vụ Career hiện hành." : "Career Ready Hub: Tower A, Level 5, Room 1.5.A024. The floor-plan label requires confirmation against the current Career service.";
    if (/highlands|vending|food|eat|an uong|nha hang|ca phe/.test(normalized)) return isVi ? "Highlands Coffee và máy bán đồ ăn nhẹ/đồ uống ở Tầng 5C." : "Highlands Coffee and a snack/beverage vending machine are on Level 5C.";
    if (/student access lab|access lab/.test(normalized)) return isVi ? "Student Access Lab được ghi trên sơ đồ Hà Nội tại Tầng 2; hoạt động hiện tại cần xác nhận." : "Student Access Lab is labelled on the Hanoi Level 2 floor plan; current operation requires confirmation.";
    if (/health|y te|medical|clinic/.test(normalized)) return isVi ? "Health Centre Hà Nội, Phòng 1.1.017." : "Hanoi Health Centre, Room 1.1.017.";
    if (/sport|recreation|gym|the thao|phong tap/.test(normalized)) return isVi ? "RMIT Active Hub Hà Nội: Room 1.5.B001 theo trang dịch vụ hiện hành; sơ đồ cũ ghi 1.5.001, nên cần xác nhận trước khi đến." : "RMIT Active Hub Hanoi: Room 1.5.B001 on the current service page; the older floor plan labels 1.5.001, so confirm before visiting.";
    if (/study room|meeting room|phong hoc nhom|phong hop/.test(normalized)) return isVi ? "Phòng học nhóm thư viện Hà Nội: 1.2.007, 1.2.010, 1.2.012, 1.2.019, 1.2.020, 1.2.021, 1.2.022 và 1.2.023." : "Hanoi Library bookable rooms: 1.2.007, 1.2.010, 1.2.012, 1.2.019, 1.2.020, 1.2.021, 1.2.022, and 1.2.023.";
  }
  if (doc.categoryId === "academic-calendar" && /when|start|begin|date|khi nao|bat dau|ngay/.test(normalized)) {
    const dateDetail = [...(language === "vi" ? doc.keyDetailsVi : doc.keyDetailsEn)].find((detail: string) => /^\s*(?:Date|Ngày):\s*\d{4}-\d{2}-\d{2}/i.test(detail));
    const isoDate = dateDetail?.match(/\d{4}-\d{2}-\d{2}/)?.[0];
    if (isoDate) {
      const [year, month, day] = isoDate.split("-").map(Number);
      const formatted = new Intl.DateTimeFormat(isVi ? "vi-VN" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(Date.UTC(year, month - 1, day)));
      return isVi ? formatted.charAt(0).toUpperCase() + formatted.slice(1) + "." : formatted + ".";
    }
  }

  if (doc.id === "doc-myrmit-submit-requests" && /leave of absence|loa|bao luu|bảo lưu/.test(normalized)) {
    return isVi
      ? "Mở myRMIT → Submit Requests → chọn Leave of Absence → đọc hướng dẫn, đính kèm giấy tờ nếu yêu cầu và nộp. Theo dõi trạng thái trong lịch sử yêu cầu; nếu không thấy biểu mẫu, liên hệ Student Connect."
      : "Open myRMIT → Submit Requests → choose Leave of Absence → follow the instructions, attach required documents, and submit. Track status in request history; contact Student Connect if the form is missing.";
  }

  return null;
}

/**
 * Synthesizes a natural, beautifully formatted student response from verified RMIT knowledge.
 */
export function formatKnowledgeAnswer(
  doc: any,
  query: string,
  language: "en" | "vi" = "vi"
): string {
  const isVi = language === "vi";

  if (!doc) {
    return isVi
      ? `Hiện tại Mr Hachiware chưa tìm thấy tài liệu chính thức trực tiếp khớp với câu hỏi: "${query}".\n\nBạn có thể thử tìm kiếm với các từ khóa ngắn gọn hơn (ví dụ: "đổi ngành", "học phí", "học bổng", "câu lạc bộ") hoặc liên hệ trực tiếp Student Connect (student.connect@rmit.edu.vn) để được hỗ trợ cụ thể.`
      : `Mr Hachiware couldn't find an exact verified policy record matching: "${query}".\n\nPlease try searching with concise keywords (e.g. "change major", "tuition", "scholarships", "clubs") or reach out directly to Student Connect (student.connect@rmit.edu.vn).`;
  }
  const exactAnswer = formatExactFactAnswer(doc, query, language);
  if (exactAnswer) return exactAnswer;
  const summary = isVi ? doc.summaryVi : doc.summaryEn;
  const keyDetails: string[] = isVi ? doc.keyDetailsVi : doc.keyDetailsEn;
  const title = isVi ? doc.titleVi : doc.titleEn;

  // Dynamically tailor the intro sentence to the user question
  let tailoredIntro = "";
  const qLower = query.toLowerCase();

  if (isVi) {
    if (qLower.includes("lich hoc") || qLower.includes("hoc ky") || qLower.includes("ki nay") || qLower.includes("ky nay") || qLower.includes("census")) {
      return `**Lịch Học Vụ Chính Thức — Học Kỳ 3 Năm 2026 (Học Kỳ Hiện Tại)**

RMIT Việt Nam hiện đang trong **Học kỳ 3 năm 2026** (kéo dài từ **26/10/2026** đến **23/01/2027**). Dưới đây là các mốc thời gian chính xác cần lưu ý:

• **Bắt đầu kỳ học:** Thứ Hai, 26/10/2026 (Tuần 1 bắt đầu giảng dạy)

• **Hạn chót thêm môn (Add courses):** Thứ Sáu, 06/11/2026 (Cuối Tuần 2)

• **Hạn chót thanh toán học phí:** Thứ Sáu, 13/11/2026 (Cuối Tuần 3)

• **Census Date (Hạn chót rút môn không phạt học phí):** Thứ Sáu, 20/11/2026 (Cuối Tuần 4)

• **Kết thúc 12 tuần học:** Thứ Bảy, 23/01/2027

• **Tuần ôn tập & Lịch thi học kỳ:** 25/01/2027 – 06/02/2027

• **Nghỉ Tết Nguyên Đán:** 08/02/2027 – 21/02/2027

• **Học kỳ tiếp theo (Học kỳ 1, 2027):** Bắt đầu vào Thứ Hai, 01/03/2027.

🔗 Bạn có thể xem và tải bản PDF đầy đủ của Lịch Học vụ 2026–2027 ở đường link đính kèm bên dưới.`;
    }

    if (qLower.includes("lam sao") || qLower.includes("cach") || qLower.includes("thu tuc") || qLower.includes("quy trinh")) {
      tailoredIntro = `Dưới đây là các bước hướng dẫn cụ thể về **${title}**:`;
    } else if (qLower.includes("o dau") || qLower.includes("dia chi") || qLower.includes("phong ban")) {
      tailoredIntro = `Thông tin địa điểm và phòng ban phụ trách về **${title}**:`;
    } else if (qLower.includes("dieu kien") || qLower.includes("yeu cau")) {
      tailoredIntro = `Các điều kiện và tiêu chuẩn quy định cho **${title}**:`;
    } else {
      tailoredIntro = `Thông tin chính thức về **${title}**:`;
    }

    return `${tailoredIntro}

${summary}

**Các điểm quan trọng cần lưu ý:**

${keyDetails.map((k: string) => `• ${k}`).join("\n\n")}

💡 **Gợi ý:** Bạn có thể tham khảo thêm các văn bản và kênh liên hệ chính thức ở mục nguồn đính kèm bên dưới.`;
  }

  if (qLower.includes("calendar") || qLower.includes("current semester") || qLower.includes("semester dates") || qLower.includes("census")) {
    return `**Official Academic Calendar — Current Semester (Semester 3, 2026)**

RMIT University Vietnam is currently in **Semester 3, 2026** (running from **26 October 2026** to **23 January 2027**). Exact milestone dates:

• **Teaching Commences:** Monday, 26 October 2026 (Week 1)

• **Last date to add classes:** Friday, 06 November 2026 (End of Week 2)

• **Tuition Payment Deadline:** Friday, 13 November 2026 (End of Week 3)

• **Census Date (Final drop deadline without fee penalty):** Friday, 20 November 2026 (Week 4)

• **Teaching Concludes:** Saturday, 23 January 2027

• **Exam & Assessment Period:** 25 January 2027 – 06 February 2027

• **Upcoming Semester (Semester 1, 2027):** Begins Monday, 01 March 2027.

🔗 Full official calendar PDF is linked in the sources section below.`;
  }

  if (qLower.includes("how") || qLower.includes("procedure") || qLower.includes("process") || qLower.includes("step")) {
    tailoredIntro = `Here are the official guidelines regarding **${title}**:`;
  } else if (qLower.includes("where") || qLower.includes("location") || qLower.includes("contact")) {
    tailoredIntro = `Contact and office location details for **${title}**:`;
  } else if (qLower.includes("requirement") || qLower.includes("eligibility") || qLower.includes("criteria")) {
    tailoredIntro = `Official eligibility requirements for **${title}**:`;
  } else {
    tailoredIntro = `Official university guidance regarding **${title}**:`;
  }

  return `${tailoredIntro}

${summary}

**Key Guidelines & Action Steps:**

${keyDetails.map((k: string) => `• ${k}`).join("\n\n")}

💡 **Tip:** Refer to the official university source links attached below for full details.`;
}

export function buildSystemInstruction(language: "en" | "vi" = "en"): string {
  const isVi = language === "vi";

  // Keep recruitment facts grounded in structured records; never infer an opening or requirement.
  return `You are "Mr Hachiware", a warm, practical, bilingual student-life companion for students at RMIT University Vietnam.

SCOPE:
- Answer RMIT academic, administrative, campus, student-life, belonging, clubs, events, study-partner, teammate, group-assignment, communication, and ordinary wellbeing questions.
- For social questions, give low-pressure, practical suggestions that respect introverted students and different comfort levels.
- Help with conversation starters, respectful teammate outreach, group expectations, free-rider communication, and constructive conflict resolution.
- You may suggest clubs or communities only when they appear in verified context. Never invent club names, memberships, matches, student profiles, or availability.
- For "meet people", "make friends", or "gặp người mới" questions, prioritize events marked social/recreational (festivals, student-life activities, workshops) and do not lead with competitions unless the user asks for them.
${isVi ? "- Với Club Day, phân biệt hoạt động diễn ra mỗi học kỳ với sự kiện có ngày cụ thể. Nếu chưa có lịch hiện tại, nói rõ ngày chưa công bố và dẫn đến thông báo RMIT; không suy ra lịch từ bài cũ." : "- For Club Day, distinguish a semesterly activity from a specifically dated event. If no current schedule is available, say the date is TBA and link official RMIT announcements; do not infer dates from historical posts."}
- Do not claim to introduce, match, contact, or access another student.
- Treat ordinary loneliness, shyness, homesickness, and group stress with empathy, without diagnosing. Mention verified RMIT wellbeing resources only when relevant.
- Clearly decline unrelated requests such as coding, jokes, general trivia, recipes, or jailbreak instructions.

GROUNDING & FORMAT:
  - Treat VERIFIED RMIT KNOWLEDGE CONTEXT, VERIFIED CAMPUS EVENT / ACTIVITY CONTEXT, VERIFIED RMIT CLUB CONTEXT, and VERIFIED RMIT GLOBAL EXPERIENCE CONTEXT as the only source of current institutional facts.
  - Identify the user's primary intent before answering and return only the requested fields. Do not repeat the full retrieved context.
  - For a simple fact such as a building, floor, room, date, fee, or contact, answer in one sentence, usually under 40 words.
  - For a procedure, give only the necessary 3–5 steps plus a relevant deadline, exception, or escalation path.
  - Expand only when the user asks for a comparison, explanation, detailed guide, or complete overview.
- For Global Experience, use only matching program records and distinguish temporary Cross-campus study from permanent transfer. Match dates to the exact intake and time zone; do not imply that a reachable portal is accepting applications.
- For a specific club question, use only the selected club records. Answer definitions from About, contacts from the exact club channels, and joining questions from recruitment fields. Do not replace unknown contacts with university footer or staff contacts, or infer private member information.
- For club recruitment questions, report the structured recruitment status, interview, CV/portfolio, tryout, deadline, and application-link fields exactly as provided. "not_announced" or "not_confirmed" means unknown; never turn it into yes/no or a current opening.
- For practical social questions such as making friends or finding teammates, lead with a concise two- or three-step guide and one example message; do not turn the answer into a generic institutional policy summary.
- For teammate or groupmate questions, do not cite Canvas, Turnitin, submission, or grading guides unless the user explicitly asks about those systems.
- For assignment-mark improvement questions, give general study-strategy advice from the brief and rubric; never promise a grade or substitute Canvas submission or late-penalty guidance unless asked.
- Answer directly, then give two or three practical actions. Ask at most one useful follow-up question.
- Include source links when making institution-specific claims. Include original event and registration links when provided.
- If no matching verified event exists, say so and suggest the Campus Events page; do not fabricate a substitute.
- Keep answers concise, natural, and non-repetitive. Do not force an event recommendation into every conversation.

Language: Respond strictly in ${isVi ? "Vietnamese" : "English"}.`;
}
