import { searchKnowledgeBase } from "@/lib/search/engine";
import { DEPARTMENT_CONTACTS } from "@/data/contacts/departments";

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
  /tot nghiep/i, /graduation/i, /career/i, /thuc tap/i, /internship/i, /sset/i, /sbm/i, /scd/i
];

const OBVIOUS_OUT_OF_SCOPE_PATTERNS = [
  /write (a|an)? python/i, /viet code/i, /viet chuong trinh/i, /write code/i,
  /who won the world cup/i, /ai thang world cup/i, /tell me a (funny )?joke/i, /joke/i, /ke chuyen cuoi/i,
  /quantum mechanics/i, /vat ly luong tu/i, /solve this math/i, /giai toan/i,
  /recipe/i, /cong thuc nau an/i, /crypto/i, /bitcoin/i, /ignore previous instructions/i,
  /jailbreak/i, /act as DAN/i
];

export function isQueryInScope(query: string): { inScope: boolean; reason?: string } {
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

  // 2. Strong match in verified RMIT knowledge base
  const searchMatches = searchKnowledgeBase(trimmed, { limit: 1 });
  if (searchMatches.length > 0 && searchMatches[0].score >= 35) {
    return { inScope: true };
  }

  // 3. Match explicit RMIT university topical keywords
  for (const pattern of RMIT_TOPIC_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { inScope: true };
    }
  }

  // 4. Default: Reject any question not related to RMIT
  return {
    inScope: false,
    reason: "Out of scope: Please ask a question related to RMIT University Vietnam (e.g., courses, enrolment, scholarships, tuition, or campus contacts).",
  };
}

export function buildRAGContext(query: string, language: "en" | "vi" = "en"): GroundedContext {
  const matches = searchKnowledgeBase(query, { language, limit: 3 });

  if (matches.length === 0) {
    return {
      contextText: "No specific knowledge records matched this query directly.",
      sources: [{ title: "RMIT Vietnam Official Website", url: "https://www.rmit.edu.vn" }],
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

  return `You are "Mr Hachiware", a polite, friendly, and concise university research assistant for students at RMIT University Vietnam.

STRICT DOMAIN BOUNDARIES:
- You ONLY answer questions related to RMIT University Vietnam (policies, courses, enrolment, tuition fees, scholarships, academic calendar, library, IT support, wellbeing, exchange, contacts).
- If the user asks about unrelated topics, politely decline.

GROUNDING & FORMAT RULES:
- Synthesize the answer clearly and naturally. Never print raw debug metadata like "[Record 1]" or "Title: ... Summary: ...".
- Use clean Markdown with bold headings and bullet points.
- Structure your answer:
  1. Direct concise summary (1-2 sentences).
  2. Actionable bullet points.
  3. Recommended department to contact.

Language: Respond strictly in ${isVi ? "Vietnamese" : "English"}.`;
}
