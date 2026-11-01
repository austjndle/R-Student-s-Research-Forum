import { searchKnowledgeBase } from "@/lib/search/engine";
import { DEPARTMENT_CONTACTS } from "@/data/contacts/departments";
import { getPublishedCalendarEntries, type CalendarEntry } from "@/data/events/calendar";
import { getVerifiedClubs, type ClubCategory, type ClubRecord } from "@/data/clubs/clubs";

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
  /friend/i, /make friends/i, /meet people/i, /teammate/i, /team mate/i, /study partner/i,
  /club/i, /society/i, /workshop/i, /event/i, /network/i, /community/i, /campus life/i,
  /new student/i, /first year/i, /lonely/i, /homesick/i, /shy/i, /social anxiety/i,
  /group assignment/i, /free[- ]rider/i, /group conflict/i, /classmate/i, /student life/i,
  /ket ban/i, /ban be/i, /lam quen/i, /tim ban/i, /dong doi/i, /ban hoc/i, /cau lac bo/i,
  /su kien/i, /hoat dong/i, /hoi thao/i, /ket noi/i, /cong dong/i, /tan sinh vien/i,
  /co don/i, /nho nha/i, /ngai giao tiep/i, /ap luc nhom/i
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
export interface EventContext {
  contextText: string;
  sources: { title: string; url: string }[];
  matchedEventTitles: string[];
}

function normalizeEventText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function getEventRegistrationLinks(entry: CalendarEntry): { label: string; url: string }[] {
  if (entry.registrationLinks?.length) {
    return entry.registrationLinks.map((link) => ({ label: link.labelEn, url: link.url }));
  }
  return entry.registrationUrl ? [{ label: "Register", url: entry.registrationUrl }] : [];
}

export function buildEventContext(query: string, language: "en" | "vi" = "en"): EventContext {
  const normalizedQuery = normalizeEventText(query);
  const eventIntent = /event|happening|this week|this weekend|workshop|festival|competition|what can i join|su kien|hoat dong|hoi thao|le hoi|cuoc thi|tuan nay|cuoi tuan/i.test(normalizedQuery);
  if (!eventIntent) return { contextText: "", sources: [], matchedEventTitles: [] };

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

  return { contextText, sources, matchedEventTitles };
}
export function isPracticalStudentLifeQuery(query: string): boolean {
  return /make friends|find teammates|find a teammate|study partner|how do i join|how can i join|im shy|i am shy|dont know anyone|don't know anyone|ket ban|tim dong doi|tim ban hoc|tham gia cau lac bo|ngai giao tiep|lam sao de ket ban/i.test(normalizeEventText(query));
}
export function formatStudentLifeFallback(query: string, language: "en" | "vi", eventContext: EventContext): string {
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

  return language === "vi"
    ? "Bạn có thể bắt đầu bằng một bước nhỏ: bắt chuyện với bạn cùng lớp, tham gia một hoạt động phù hợp sở thích hoặc rủ một người học chung sau giờ học. Nếu cần, mình có thể giúp bạn soạn một tin nhắn mở lời tự nhiên."
    : "Start with one low-pressure step: talk to a classmate, join an activity that matches your interests, or invite someone to study after class. I can also help you write a natural opening message.";
}
export function formatClubFallback(language: "en" | "vi", clubContext: ClubContext): string {
  if (clubContext.matchedClubNames.length === 0) {
    return language === "vi"
      ? "Hiện chưa có bản ghi câu lạc bộ đã xác minh phù hợp với bộ lọc này. Bạn có thể xem danh sách câu lạc bộ chính thức của RMIT để tìm thêm."
      : "No verified club records matched those filters. You can check the official RMIT club directory for more options.";
  }

  if (clubContext.specificClub) {
    const clubLines = clubContext.matchedClubs.map((club) => {
      const campus = club.campus === "saigon_south" ? (language === "vi" ? "Nam Sài Gòn" : "Saigon South") : (language === "vi" ? "Hà Nội" : "Hanoi");
      const description = club.descriptionEn ?? (language === "vi" ? "Trang CLB chính thức có thông tin mới nhất." : "The official club page has the latest club information.");
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
      const facebook = club.facebookUrl ? `Facebook: ${club.facebookUrl}` : (language === "vi" ? "Facebook: Chưa được công bố trong nguồn chính thức." : "Facebook: Not published in the official source.");
      return language === "vi"
        ? `**${club.nameVi} — ${campus}**\n${description}\nTrạng thái tuyển: ${status}\nPhỏng vấn: ${interview}\nHạn đăng ký: ${deadline}\n${facebook}`
        : `**${club.nameEn} — ${campus}**\n${description}\nRecruitment status: ${status}\nInterview required: ${interview}\nDeadline: ${deadline}\n${facebook}`;
    }).join("\n\n");
    return language === "vi"
      ? `${clubLines}\n\nBạn có thể nhắn cho CLB qua Facebook hoặc email để hỏi đợt tuyển hiện tại. Nếu chưa có thông báo chính thức, đừng giả định rằng CLB đang tuyển hoặc bắt buộc phỏng vấn.`
      : `${clubLines}\n\nMessage the club through Facebook or email to confirm the current intake. If no current announcement is published, do not assume that recruitment is open or that an interview is required.`;
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
}

function getClubCategoryLabel(category: ClubCategory): string {
  return {
    academic: "Academic",
    active: "Active",
    creative_collectives: "Creative Collectives",
    social_special_interest: "Social & Special Interest",
  }[category];
}

export function buildClubContext(query: string, language: "en" | "vi" = "en"): ClubContext {
  const normalizedQuery = normalizeEventText(query);
  const clubs = getVerifiedClubs();
  const namedClubIntent = clubs.some((club) => {
    const shortName = normalizeEventText(club.nameEn.replace(/\s+club$/i, ""));
    return shortName.length >= 4 && normalizedQuery.includes(shortName);
  });
  const clubIntent = /club|society|student organization|cau lac bo|clb|join.*club|tham gia.*clb|tham gia.*cau lac/i.test(normalizedQuery) || namedClubIntent;
  if (!clubIntent) return { contextText: "", sources: [], matchedClubNames: [], matchedClubs: [], specificClub: false, recruitmentIntent: false };

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
  const recruitmentIntent = /recruit|interview|application|apply|committee|core team|cv|portfolio|tryout|tuyen|phong van|don/i.test(normalizedQuery);
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
  const specificMatches = candidates.filter(({ club }) => {
    const searchableName = normalizeEventText(club.nameEn);
    const nameTerms = queryTerms.filter((term) => !new Set(["club", "clubs", "join", "find", "rmit", "require", "requires", "interview", "interviews", "do", "does", "what", "which", "how", "can", "i", "the", "a", "an", "is", "are", "there", "any", "this", "week"]).has(term));
    return nameTerms.length > 0 && nameTerms.some((term) => searchableName.includes(term));
  });
  const specificClub = !allIntent && specificMatches.length > 0;
  const selected = allIntent ? candidates : specificClub ? specificMatches.slice(0, 4) : candidates.slice(0, 8);

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
    ...(club.facebookUrl ? [{ title: `${club.nameEn} — Facebook`, url: club.facebookUrl }] : []),
    ...(club.instagramUrl ? [{ title: `${club.nameEn} — Instagram`, url: club.instagramUrl }] : []),
    ...(club.recruitment.applicationUrl ? [{ title: `${club.nameEn} — Application`, url: club.recruitment.applicationUrl }] : []),
    ...(club.recruitment.recruitmentAnnouncementUrl ? [{ title: `${club.nameEn} — Recruitment`, url: club.recruitment.recruitmentAnnouncementUrl }] : []),
  ]);
  const matchedClubNames = selected.map(({ club }) => language === "vi" ? club.nameVi : club.nameEn);
  const contextText = selected.map(({ club }) => {
    const name = language === "vi" ? club.nameVi : club.nameEn;
    const description = club.descriptionEn ?? (language === "vi" ? "Mới chỉ có tên trong danh sách câu lạc bộ chính thức." : "Name verified in the official campus club list; public description was not available.");
    return [
      `[Verified RMIT Club]`,
      `Name: ${name}`,
      `Campus: ${club.campus === "saigon_south" ? "Saigon South" : "Hanoi"}`,
      `Category: ${getClubCategoryLabel(club.category)}`,
      `Description: ${description}`,
      club.contactEmail ? `Contact email: ${club.contactEmail}` : "Contact email: Not published in the public source.",
      club.facebookUrl ? `Facebook: ${club.facebookUrl}` : "Facebook: Not published in the public source.",
      club.instagramUrl ? `Instagram: ${club.instagramUrl}` : "Instagram: Not published in the public source.",
      `Source: ${club.officialClubUrl ?? club.sourceUrl}`,
      `Campus list PDF: ${club.campusListPdfUrl}`,
      `Recruitment status: ${club.recruitment.recruitmentStatus}`,
      `Interview required: ${club.recruitment.interviewRequired}`,
      `CV or portfolio required: ${club.recruitment.cvPortfolioRequired}`,
      `Tryout or assessment required: ${club.recruitment.tryoutRequired}`,
      `Application deadline: ${club.recruitment.applicationDeadline ?? "Not published"}`,
      `Application link: ${club.recruitment.applicationUrl ?? "Not published"}`,
      `Recruitment announcement: ${club.recruitment.recruitmentAnnouncementUrl ?? "Not published"}`,
      `Details status: ${club.detailsStatus}`,
    ].join("\n");
  }).join("\n\n");

  return { contextText, sources, matchedClubNames, matchedClubs: selected.map(({ club }) => club), specificClub, recruitmentIntent };
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

  // Keep recruitment facts grounded in structured records; never infer an opening or requirement.
  return `You are "Mr Hachiware", a warm, practical, bilingual student-life companion for students at RMIT University Vietnam.

SCOPE:
- Answer RMIT academic, administrative, campus, student-life, belonging, clubs, events, study-partner, teammate, group-assignment, communication, and ordinary wellbeing questions.
- For social questions, give low-pressure, practical suggestions that respect introverted students and different comfort levels.
- Help with conversation starters, respectful teammate outreach, group expectations, free-rider communication, and constructive conflict resolution.
- You may suggest clubs or communities only when they appear in verified context. Never invent club names, memberships, matches, student profiles, or availability.
- For "meet people", "make friends", or "gặp người mới" questions, prioritize events marked social/recreational (festivals, student-life activities, workshops) and do not lead with competitions unless the user asks for them.
- You may recommend events only from VERIFIED CAMPUS EVENT context. Never invent dates, venues, registration status, or event availability.
- Do not claim to introduce, match, contact, or access another student.
- Treat ordinary loneliness, shyness, homesickness, and group stress with empathy, without diagnosing. Mention verified RMIT wellbeing resources only when relevant.
- Clearly decline unrelated requests such as coding, jokes, general trivia, recipes, or jailbreak instructions.

GROUNDING & FORMAT:
- Treat VERIFIED RMIT KNOWLEDGE CONTEXT, VERIFIED CAMPUS EVENT CONTEXT, and VERIFIED RMIT CLUB CONTEXT as the only source of current institutional facts.
- For club recruitment questions, report the structured recruitment status, interview, CV/portfolio, tryout, deadline, and application-link fields exactly as provided. "not_announced" or "not_confirmed" means unknown; never turn it into yes/no or a current opening.
- For practical social questions such as making friends or finding teammates, lead with a concise two- or three-step guide and one example message; do not turn the answer into a generic institutional policy summary.
- Never print raw debug metadata such as "[Record 1]" or internal labels.
- Answer directly, then give two or three practical actions. Ask at most one useful follow-up question.
- Include source links when making institution-specific claims. Include original event and registration links when provided.
- If no matching verified event exists, say so and suggest the Campus Events page; do not fabricate a substitute.
- Keep answers concise, natural, and non-repetitive. Do not force an event recommendation into every conversation.

Language: Respond strictly in ${isVi ? "Vietnamese" : "English"}.`;
}
