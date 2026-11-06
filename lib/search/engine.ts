import { KNOWLEDGE_DOCUMENTS } from "@/data/knowledge/documents";
import { DEPARTMENT_CONTACTS, type DepartmentContact } from "@/data/contacts/departments";
import { RMIT_CAMPUS_HOURS } from "@/data/facilities/campusHours";
import { getPublishedCalendarEntries } from "@/data/events/calendar";
import { getVerifiedClubs } from "@/data/clubs/clubs";
import { SSET_INDUSTRY, SSET_INFRASTRUCTURE, SSET_OVERVIEW, SSET_PROGRAMS, SSET_PROJECTS, SSET_RESEARCH, SSET_URLS } from "@/data/sset";
import { SCHOOL_DIRECTORIES } from "@/data/schoolDirectories";
import type { KnowledgeDocument, Campus } from "@/data/knowledge/schema";
import { KNOWLEDGE_INDEX_VERSION } from "@/data/knowledge/indexManifest";

/**
 * Remove Vietnamese accents and diacritics for insensitive matching.
 * "đổi ngành" -> "doi nganh", "học bổng" -> "hoc bong"
 */
export function removeVietnameseDiacritics(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, (char) => (char === "đ" ? "d" : "D"))
    .toLowerCase()
    .trim();
}

/**
 * Common English and Vietnamese stop words to filter for keyword extraction.
 */
const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "is", "are", "was", "were",
  "how", "what", "where", "when", "why", "who", "which", "can", "i", "do", "does", "my", "you",
  "your", "yours", "we", "our", "ours", "they", "them", "their", "it", "its", "me", "he", "she",
  "la", "o", "tai", "va", "hoac", "cua", "cho", "lam", "sao", "the", "nao", "gi", "o", "dau",
  "co", "the", "toi", "minh", "duoc", "khong", "ban", "cho", "ve", "nay", "do", "nhu", "de",
  "tham", "gia", "giup", "muon", "can", "xin", "hoi"
]);

/**
 * Bilingual synonym dictionary for university terminology.
 */
const BILINGUAL_SYNONYM_MAP: Record<string, string[]> = {
  "lich hoc": ["calendar", "academic calendar", "semester dates", "lich hoc ki nay", "lich hoc ky nay", "semester 3"],
  "lich hoc ki nay": ["academic calendar", "semester 3", "lich hoc", "census date", "exam period"],
  "lich hoc ky nay": ["academic calendar", "semester 3", "lich hoc", "census date", "exam period"],
  "doi nganh": ["change major", "program transfer", "chuyen nganh", "internal transfer"],
  "chuyen nganh": ["change major", "doi nganh", "program transfer"],
  "change major": ["doi nganh", "chuyen nganh", "program transfer", "switch major"],
  "hoc phi": ["tuition fees", "payment", "thanh toan", "invoice", "financial hold"],
  "tuition": ["hoc phi", "tuition fees", "fee statement", "payment"],
  "hoc bong": ["scholarship", "merit", "vice chancellor", "bursary"],
  "scholarship": ["hoc bong", "merit grant", "tuition discount"],
  "lost and found": ["lost property", "lost belongings", "missing item", "found property", "do that lac", "mat do"],
  "lost property": ["lost and found", "lost belongings", "missing item", "security enquiries", "do that lac", "bao mat do"],
  "mat do": ["lost and found", "lost property", "do that lac", "bao mat do"],
  "dean list": ["dean's list", "academic recognition", "academic award", "danh hieu hoc thuat", "ghi nhan hoc tap"],
  "danh hieu hoc thuat": ["academic recognition", "dean's list", "academic award"],
  "sset": ["school of science engineering technology", "science engineering technology", "khoa khoa hoc ky thuat cong nghe"],
  "robotics": ["robotics and mechatronics", "BH123", "robot va co dien tu", "robotics engineering"],
  "mechatronics": ["robotics and mechatronics", "BH123", "co dien tu"],
  "program map": ["program guide", "program guides and maps", "plan code", "so do chuong trinh"],
  "program guide": ["program map", "program guides and maps", "handbook", "cam nang chuong trinh"],
  "dang ky mon": ["course enrolment", "enrolment", "add drop", "census date"],
  "enrolment": ["dang ky mon", "class registration", "add drop", "census date"],
  "census date": ["han chot", "deadline", "drop course", "rut mon", "census"],
  "student connect": ["phong hoc vu", "phong sinh vien", "student central", "support desk"],
  "thu vien": ["library", "database", "study room", "muon sach"],
  "library": ["thu vien", "study space", "databases", "borrow books"],
  "it support": ["wifi", "canvas", "password", "mat khau", "service desk"],
  "wifi": ["it support", "network", "rmit-university", "internet"],
  "canvas": ["it support", "lms", "nop bai", "assignment", "courses"],
  "trao doi": ["exchange", "melbourne", "study abroad", "du hoc"],
  "exchange": ["trao doi", "melbourne", "cross-campus", "study abroad"],
  "gpa": ["thang diem", "grading scale", "diem trung binh", "hd", "di", "cr", "pa", "nn"],
  "gia han": ["special consideration", "extension", "nop tre", "hoan canh dac biet"]
};
function buildAuxiliarySearchDocuments(): KnowledgeDocument[] {
  const clubDocuments = getVerifiedClubs().map((club): KnowledgeDocument => ({
    id: `club-${club.id}`,
    slug: club.id,
    titleEn: club.nameEn,
    titleVi: club.nameVi,
    categoryId: "clubs",
    keywords: [club.nameEn, club.nameVi, club.category, club.campus],
    synonymsEn: ["student club", "club", "society", "join club"],
    synonymsVi: ["câu lạc bộ", "clb", "tham gia clb"],
    summaryEn: club.descriptionEn ?? "Verified RMIT Vietnam student club record.",
    summaryVi: club.descriptionVi ?? "Thông tin câu lạc bộ sinh viên RMIT Việt Nam đã được xác minh.",
    detailedGuidanceEn: "Open the club detail page for verified profile, public channels, recruitment status, and source links.",
    detailedGuidanceVi: "Mở trang chi tiết CLB để xem hồ sơ đã xác minh, kênh công khai, trạng thái tuyển thành viên và nguồn.",
    keyDetailsEn: [`Campus: ${club.campus}`, `Category: ${club.category}`, club.contactEmail ? `Email: ${club.contactEmail}` : "Public email not published in the checked source."],
    keyDetailsVi: [`Cơ sở: ${club.campus}`, `Danh mục: ${club.category}`, club.contactEmail ? `Email: ${club.contactEmail}` : "Nguồn đã kiểm tra chưa công bố email."],
    officialSourceUrl: club.officialClubUrl ?? club.sourceUrl,
    sourceTitle: "RMIT Vietnam student clubs",
    departmentId: "dept-student-connect",
    campus: club.campus,
    lastVerifiedDate: club.lastVerifiedDate,
    verificationStatus: "verified",
    resultHref: `/clubs/${club.id}`,
  }));

  const facilityDocuments = RMIT_CAMPUS_HOURS.map((building): KnowledgeDocument => ({
    id: `facility-${building.id}`,
    slug: building.id,
    titleEn: building.nameEn,
    titleVi: building.nameVi,
    categoryId: "campus-facilities",
    keywords: [
      building.nameEn,
      building.nameVi,
      building.id,
      building.buildingCode ?? "",
      ...building.floors.flatMap((floor) => [floor.floorEn ?? floor.floor, floor.floorVi ?? floor.floor, floor.facilitiesEn, floor.facilitiesVi]),
    ],
    synonymsEn: ["building", "facility", "campus map", "where is", "library", "student connect", "gym", "health centre", "clinic", "international sos"],
    synonymsVi: ["tòa nhà", "cơ sở vật chất", "bản đồ cơ sở", "ở đâu", "thư viện", "phòng gym"],
    summaryEn: building.overviewEn,
    summaryVi: building.overviewVi,
    detailedGuidanceEn: "Use the official floor-plan or campus map link for navigation. Building access and facility hours are shown only when published in the checked source.",
    detailedGuidanceVi: "Dùng liên kết sơ đồ tầng hoặc bản đồ cơ sở chính thức để tìm đường. Chỉ hiển thị giờ mở cửa khi nguồn đã kiểm tra công bố.",
    keyDetailsEn: building.floors.map((floor) => `${floor.floorEn ?? floor.floor}: ${floor.facilitiesEn} (${floor.weekdayHours})`),
    keyDetailsVi: building.floors.map((floor) => `${floor.floorVi ?? floor.floor}: ${floor.facilitiesVi} (${floor.weekdayHours})`),
    sourceTitle: "RMIT Vietnam campus facilities",
    officialSourceUrl: building.floorPlanPdfUrl ?? building.floors.find((floor) => floor.sourceUrl)?.sourceUrl ?? "https://www.rmit.edu.vn/students/campus-life/campus-facilities",
    departmentId: "dept-student-connect",
    campus: building.campus,
    lastVerifiedDate: "2026-11-03",
    verificationStatus: "verified",
    resultHref: `/facilities#${building.id}`,
  }));

  const calendarDocuments = getPublishedCalendarEntries().map((entry): KnowledgeDocument => ({
    id: `calendar-${entry.id}`,
    slug: entry.id,
    titleEn: entry.titleEn,
    titleVi: entry.titleVi,
    categoryId: entry.type === "academic_date" ? "academic-calendar" : "campus-events",
    keywords: [entry.titleEn, entry.titleVi, entry.semester ?? "", entry.academicYear ?? "", entry.category],
    synonymsEn: entry.type === "academic_date" ? ["academic calendar", "deadline", "semester date", "census", "enrolment"] : ["event", "campus event", "student activity"],
    synonymsVi: entry.type === "academic_date" ? ["lịch học vụ", "hạn chót", "học kỳ", "đăng ký môn"] : ["sự kiện", "hoạt động sinh viên", "sự kiện cơ sở"],
    summaryEn: entry.descriptionEn,
    summaryVi: entry.descriptionVi,
    detailedGuidanceEn: "Check the official source linked below. Program-specific calendars may differ where RMIT says so.",
    detailedGuidanceVi: "Kiểm tra nguồn chính thức bên dưới. Lịch riêng của từng chương trình có thể khác khi RMIT có ghi chú.",
    keyDetailsEn: [`Date: ${entry.startAt}`, entry.semester ? `Semester: ${entry.semester}` : "", entry.academicYear ? `Academic year: ${entry.academicYear}` : ""].filter(Boolean),
    keyDetailsVi: [`Ngày: ${entry.startAt}`, entry.semester ? `Học kỳ: ${entry.semester}` : "", entry.academicYear ? `Năm học: ${entry.academicYear}` : ""].filter(Boolean),
    officialSourceUrl: entry.originalUrl,
    sourceTitle: "RMIT Vietnam official calendar and events",
    departmentId: "dept-student-connect",
    campus: entry.campus,
    lastVerifiedDate: entry.sourceLastVerified,
    verificationStatus: entry.verification === "verified" ? "verified" : "needs_review",
    resultHref: entry.type === "academic_date" ? "/calendar" : "/events",
  }));

  const contactDocuments = DEPARTMENT_CONTACTS.filter((department) => department.isAcademicSchool).map((department): KnowledgeDocument => {
    const specialized = department.specializedContacts ?? [];
    const keywords = [department.nameEn, department.nameVi, department.abbreviation ?? "", department.email ?? "", department.isAcademicSchool ? "contact" : "", department.isAcademicSchool ? "academic school" : "", ...specialized.flatMap((contact) => [contact.labelEn, contact.labelVi])].filter(Boolean);
    return {
      id: `contact-${department.id}`,
      slug: department.id,
      titleEn: department.nameEn,
      titleVi: department.nameVi,
      categoryId: department.isAcademicSchool ? "academic-info" : "student-connect",
      keywords,
      synonymsEn: department.isAcademicSchool ? ["academic school", "faculty", "school contact", "academic progress", "show cause", "course coordinator"] : ["department contact", "student support", "official contact"],
      synonymsVi: department.isAcademicSchool ? ["khoa", "liên hệ khoa", "học vụ", "tiến độ học tập", "show cause", "giảng viên phụ trách"] : ["liên hệ phòng ban", "hỗ trợ sinh viên", "liên hệ chính thức"],
      summaryEn: department.descriptionEn,
      summaryVi: department.descriptionVi,
      detailedGuidanceEn: [...department.responsibilitiesEn, ...specialized.map((contact) => `${contact.labelEn}: ${contact.purposeEn}`)].join(" "),
      detailedGuidanceVi: [...department.responsibilitiesVi, ...specialized.map((contact) => `${contact.labelVi}: ${contact.purposeVi}`)].join(" "),
      keyDetailsEn: [department.email ? `${department.emailLabelEn ?? "Official email"}: ${department.email}` : "No direct email published in the checked official source.", department.phone ? `Phone: ${department.phone}` : "No direct phone published in the checked official source.", department.locationEn, ...specialized.map((contact) => `${contact.labelEn}: ${contact.email ?? "Use the official school contact route."}`)],
      keyDetailsVi: [department.email ? `${department.emailLabelVi ?? "Email chính thức"}: ${department.email}` : "Nguồn chính thức đã kiểm tra chưa công bố email trực tiếp.", department.phone ? `Điện thoại: ${department.phone}` : "Nguồn chính thức đã kiểm tra chưa công bố số điện thoại trực tiếp.", department.locationVi, ...specialized.map((contact) => `${contact.labelVi}: ${contact.email ?? "Sử dụng kênh liên hệ chính thức của Khoa."}`)],
      officialSourceUrl: department.websiteUrl,
      sourceTitle: department.nameEn,
      departmentId: department.id,
      campus: department.campus,
      lastVerifiedDate: department.lastVerifiedDate,
      verificationStatus: "verified",
      resultHref: `/contacts#contact-${department.id}`,
    };
  });
  const ssetDocuments: KnowledgeDocument[] = [
    {
      id: "sset-program-guides-maps",
      slug: "sset-program-guides-maps",
      titleEn: "SSET Program Guides and Maps",
      titleVi: "Program Guides và Maps SSET",
      categoryId: "sset",
      keywords: ["program guides", "program maps", "program guide", "program map", "bản đồ chương trình", "cẩm nang chương trình", "BH123", "BH073", "BP162", "BP094", "plan code", "intake"],
      synonymsEn: ["handbook", "course structure", "program plan", "current intake"],
      synonymsVi: ["cẩm nang chương trình", "bản đồ chương trình", "mã plan", "đợt nhập học"],
      summaryEn: "Use RMIT Vietnam's official program-guides index for current intake-specific guides and maps. RMIT says an RMIT account is required before accessing the files.",
      summaryVi: "Dùng trang program guides chính thức của RMIT Việt Nam cho guide và map theo đợt nhập học hiện tại. RMIT cho biết cần tài khoản RMIT trước khi truy cập tệp.",
      detailedGuidanceEn: "Do not treat an indicative course sequence as an unconditional enrolment requirement. Do not use an older intake map by default.",
      detailedGuidanceVi: "Không coi trình tự môn mang tính định hướng là điều kiện đăng ký tuyệt đối. Không mặc định dùng map của đợt nhập học cũ.",
      keyDetailsEn: [`Official index: ${SSET_URLS.guides}`, "RMIT login required before accessing files", "BH123 Robotics and Mechatronics; BH073 Electronic and Computer Systems; BP162 Information Technology; BP094 Computer Science"],
      keyDetailsVi: [`Danh mục chính thức: ${SSET_URLS.guides}`, "Cần đăng nhập RMIT trước khi truy cập tệp", "BH123 Kỹ thuật Robot và Cơ điện tử; BH073 Kỹ thuật Điện tử và Hệ thống Máy tính; BP162 Công nghệ Thông tin; BP094 Khoa học Máy tính"],
      officialSourceUrl: SSET_URLS.guides,
      sourceTitle: "RMIT Vietnam program guides and maps",
      departmentId: "school-sset",
      campus: "all",
      lastVerifiedDate: "2026-11-05",
      verificationStatus: "verified",
      resultHref: "/topics/sset",
    },
    {
      id: "sset-overview",
      slug: "sset-overview",
      titleEn: "SSET: Science, Engineering & Technology",
      titleVi: "SSET: Khoa Khoa học, Kỹ thuật & Công nghệ",
      categoryId: "sset",
      keywords: ["SSET", "School of Science Engineering Technology", "SSET Vietnam", "RMIT Vietnam", "research", "laboratories", "student projects", "SSET Canvas Shell", "Dean's List"],
      synonymsEn: ["science engineering technology school", "academic school", "engineering school", "SSET office", "program maps", "student project showcase"],
      synonymsVi: ["khoa khoa học kỹ thuật công nghệ", "khoa SSET", "dự án sinh viên SSET", "phòng lab", "bản đồ chương trình", "Dean's List SSET"],
      summaryEn: SSET_OVERVIEW.en,
      summaryVi: SSET_OVERVIEW.vi,
      detailedGuidanceEn: [SSET_RESEARCH.en, SSET_INFRASTRUCTURE.en, SSET_INDUSTRY.en].join(" "),
      detailedGuidanceVi: [SSET_RESEARCH.vi, SSET_INFRASTRUCTURE.vi, SSET_INDUSTRY.vi].join(" "),
      keyDetailsEn: ["Official SSET website", "Saigon South: Academic Building 2, Level 4", "Hanoi: Handi Resco Building, Level 5, Tower A", "Contact: sset@rmit.edu.vn; +84 28 3776 1416", "Canvas shell URL not publicly confirmed; RMIT student login is required."],
      keyDetailsVi: ["Website SSET chính thức", "Nam Sài Gòn: Tòa nhà Học thuật 2, Tầng 4", "Hà Nội: Tòa nhà Handi Resco, Tầng 5, Tháp A", "Liên hệ: sset@rmit.edu.vn; +84 28 3776 1416", "Chưa xác nhận URL Canvas shell công khai; yêu cầu đăng nhập RMIT."],
      officialSourceUrl: SSET_URLS.overview,
      sourceTitle: "RMIT Vietnam SSET official website",
      departmentId: "school-sset",
      campus: "all",
      lastVerifiedDate: "2026-11-05",
      verificationStatus: "verified",
      resultHref: "/topics/sset",
    },
    ...SSET_PROGRAMS.map((program): KnowledgeDocument => ({
      id: `sset-program-${program.id}`,
      slug: program.id,
      titleEn: program.title.en,
      titleVi: program.title.vi,
      categoryId: "sset",
      keywords: [program.code, ...program.campuses, program.title.en, program.title.vi, ...program.specialisations.flatMap((item) => [item.en, item.vi])],
      synonymsEn: ["SSET program", "program guide", "program map", "engineering degree", "technology degree"],
      synonymsVi: ["chương trình SSET", "program guide", "program map", "ngành kỹ thuật", "ngành công nghệ"],
      summaryEn: program.summary.en,
      summaryVi: program.summary.vi,
      detailedGuidanceEn: [program.structure.en, program.industryExperience.en, program.accessNote.en].join(" "),
      detailedGuidanceVi: [program.structure.vi, program.industryExperience.vi, program.accessNote.vi].join(" "),
      keyDetailsEn: [`Program code: ${program.code}`, `Campus: ${program.campuses.join(", ")}`, `Duration: ${program.duration.en}`, ...program.guideUrls.map((guide) => `${guide.label.en}: ${guide.url}`), `Program map: ${program.mapUrl ?? "No separate public map URL confirmed."}`],
      keyDetailsVi: [`Mã chương trình: ${program.code}`, `Cơ sở: ${program.campuses.join(", ")}`, `Thời lượng: ${program.duration.vi}`, ...program.guideUrls.map((guide) => `${guide.label.vi}: ${guide.url}`), `Program map: ${program.mapUrl ?? "Chưa xác nhận URL map công khai riêng."}`],
      officialSourceUrl: program.programUrl,
      sourceTitle: "RMIT Vietnam SSET program page",
      departmentId: "school-sset",
      campus: program.campuses.length === 1 && program.campuses[0] === "Saigon South" ? "saigon_south" : "all",
      lastVerifiedDate: program.lastVerified,
      verificationStatus: "verified",
      resultHref: "/topics/sset",
    })),
    {
      id: "sset-student-projects",
      slug: "sset-student-projects",
      titleEn: "SSET student projects and showcase",
      titleVi: "Dự án sinh viên và showcase SSET",
      categoryId: "sset",
      keywords: SSET_PROJECTS.flatMap((project) => [project.title.en, project.title.vi, project.focus.en, project.focus.vi]),
      synonymsEn: ["SSET student projects", "capstone", "project showcase", "WIL projects", "engineering projects"],
      synonymsVi: ["dự án sinh viên SSET", "đồ án", "showcase dự án", "dự án WIL", "dự án kỹ thuật"],
      summaryEn: "RMIT Vietnam publishes public SSET student-project summaries and links to a project showcase directory.",
      summaryVi: "RMIT Việt Nam công bố tóm tắt dự án sinh viên SSET và liên kết tới danh mục showcase dự án.",
      detailedGuidanceEn: SSET_PROJECTS.map((project) => `${project.title.en}: ${project.summary.en}`).join(" "),
      detailedGuidanceVi: SSET_PROJECTS.map((project) => `${project.title.vi}: ${project.summary.vi}`).join(" "),
      keyDetailsEn: ["Six-month WIL capstone projects are described on the official SSET page.", `Official showcase: ${SSET_URLS.showcase}`, ...SSET_PROJECTS.map((project) => project.title.en)],
      keyDetailsVi: ["Trang SSET chính thức mô tả capstone WIL sáu tháng.", `Showcase chính thức: ${SSET_URLS.showcase}`, ...SSET_PROJECTS.map((project) => project.title.vi)],
      officialSourceUrl: SSET_URLS.projects,
      sourceTitle: "RMIT Vietnam SSET student projects",
      departmentId: "school-sset",
      campus: "all",
      lastVerifiedDate: "2026-11-05",
      verificationStatus: "verified",
      resultHref: "/topics/sset",
    },
  ];
  const schoolDocuments: KnowledgeDocument[] = SCHOOL_DIRECTORIES.flatMap((school) => {
    const overview: KnowledgeDocument = {
      id: `${school.id}-overview`,
      slug: `${school.id}-overview`,
      titleEn: `${school.abbreviation}: ${school.name.en}`,
      titleVi: `${school.abbreviation}: ${school.name.vi}`,
      categoryId: school.id,
      keywords: [school.abbreviation, school.name.en, school.name.vi, ...school.programs.flatMap((program) => [program.title.en, program.title.vi, program.code]), "research", "research clusters", "industry", "contact", "program guide", "program map", "CBET", "Cities and Urbanism", "Creativity, Heritage and Society", "Sustainability"],
      synonymsEn: [`${school.name.en} programs`, `${school.abbreviation} office`, `${school.abbreviation} research`, `${school.abbreviation} industry`, "academic school"],
      synonymsVi: [`chương trình ${school.name.vi}`, `liên hệ ${school.abbreviation}`, `nghiên cứu ${school.abbreviation}`, "khoa học thuật"],
      summaryEn: school.overview.en,
      summaryVi: school.overview.vi,
      detailedGuidanceEn: [school.programsIntro.en, school.research.en, school.industry.en, school.facilities.en].join(" "),
      detailedGuidanceVi: [school.programsIntro.vi, school.research.vi, school.industry.vi, school.facilities.vi].join(" "),
      keyDetailsEn: [`Email: ${school.contact.email}`, `Phone: ${school.contact.phone}`, school.contact.location.en, ...school.programs.map((program) => `${program.code}: ${program.title.en}`)],
      keyDetailsVi: [`Email: ${school.contact.email}`, `Điện thoại: ${school.contact.phone}`, school.contact.location.vi, ...school.programs.map((program) => `${program.code}: ${program.title.vi}`)],
      officialSourceUrl: school.links.find((link) => link.id === "overview")?.url ?? school.contact.url,
      sourceTitle: `${school.name.en} official website`,
      departmentId: `school-${school.id}`,
      campus: "all",
      lastVerifiedDate: school.lastVerified,
      verificationStatus: "verified",
      resultHref: `/topics/${school.id}`,
    };
    const programs = school.programs.map((program): KnowledgeDocument => ({
      id: `${school.id}-program-${program.id}`,
      slug: program.id,
      titleEn: program.title.en,
      titleVi: program.title.vi,
      categoryId: school.id,
      keywords: [school.abbreviation, program.code, program.title.en, program.title.vi, ...program.focus.flatMap((item) => [item.en, item.vi]), ...program.campuses],
      synonymsEn: ["program guide", "program map", "course structure", "industry experience"],
      synonymsVi: ["program guide", "program map", "cấu trúc chương trình", "kết nối ngành"],
      summaryEn: program.summary.en,
      summaryVi: program.summary.vi,
      detailedGuidanceEn: [program.industry.en, program.accessNote.en].join(" "),
      detailedGuidanceVi: [program.industry.vi, program.accessNote.vi].join(" "),
      keyDetailsEn: [`Program code: ${program.code}`, `Campus: ${program.campuses.join(", ")}`, `Duration: ${program.duration.en}`, ...program.focus.map((item) => item.en), ...program.guideUrls.map((guide) => `${guide.label.en}: ${guide.url}`)],
      keyDetailsVi: [`Mã chương trình: ${program.code}`, `Cơ sở: ${program.campuses.join(", ")}`, `Thời lượng: ${program.duration.vi}`, ...program.focus.map((item) => item.vi), ...program.guideUrls.map((guide) => `${guide.label.vi}: ${guide.url}`)],
      officialSourceUrl: program.programUrl,
      sourceTitle: `${school.name.en} program page`,
      departmentId: `school-${school.id}`,
      campus: "all",
      lastVerifiedDate: school.lastVerified,
      verificationStatus: "verified",
      resultHref: `/topics/${school.id}`,
    }));
    return [overview, ...programs];
  });
  return [...clubDocuments, ...facilityDocuments, ...calendarDocuments, ...contactDocuments, ...ssetDocuments, ...schoolDocuments];
}

const AUXILIARY_SEARCH_DOCUMENTS = buildAuxiliarySearchDocuments();
type NormalizedTerm = { value: string; normalized: string };
type SearchDocumentIndex = {
  document: KnowledgeDocument;
  titleEn: string;
  titleVi: string;
  summaryEn: string;
  summaryVi: string;
  keywords: NormalizedTerm[];
  synonyms: NormalizedTerm[];
};

const NORMALIZED_SYNONYMS = Object.entries(BILINGUAL_SYNONYM_MAP).map(([phrase, synonyms]) => ({
  phrase,
  synonyms: synonyms.map(removeVietnameseDiacritics),
}));

function indexDocuments(documents: KnowledgeDocument[]): SearchDocumentIndex[] {
  return documents.map((document) => ({
    document,
    titleEn: removeVietnameseDiacritics(document.titleEn),
    titleVi: removeVietnameseDiacritics(document.titleVi),
    summaryEn: removeVietnameseDiacritics(document.summaryEn),
    summaryVi: removeVietnameseDiacritics(document.summaryVi),
    keywords: document.keywords.map((value) => ({ value, normalized: removeVietnameseDiacritics(value) })),
    synonyms: [...document.synonymsEn, ...document.synonymsVi].map((value) => ({ value, normalized: removeVietnameseDiacritics(value) })),
  }));
}

const CORE_SEARCH_DOCUMENT_INDEX = indexDocuments(KNOWLEDGE_DOCUMENTS);
const SEARCH_DOCUMENT_INDEX = [...CORE_SEARCH_DOCUMENT_INDEX, ...indexDocuments(AUXILIARY_SEARCH_DOCUMENTS)];
const SEARCH_RESULT_CACHE = new Map<string, SearchResultItem[]>();
function cacheSearchResult(key: string, results: SearchResultItem[]): SearchResultItem[] {
  if (SEARCH_RESULT_CACHE.size >= 128) SEARCH_RESULT_CACHE.clear();
  SEARCH_RESULT_CACHE.set(key, results);
  return results;
}
const AUXILIARY_SEARCH_HINTS = [
  "club", "clb", "cau lac bo", "câu lạc bộ", "building", "facility", "library", "gym", "health centre", "clinic", "international sos", "circle k", "beanland", "lygon", "melbourne theatre", "calendar", "semester",
  "học kỳ", "lịch học", "event", "sự kiện", "where is", "ở đâu", "tòa nhà", "co so", "cơ sở", "tầng", "floor", "level",
  "school", "schools", "faculty", "sset", "tbs", "scd", "seup", "academic progress", "show cause", "foundation studies", "unistart", "english for university", "khoa", "liên hệ khoa", "học vụ",
  "dean list", "academic recognition", "danh hiệu học thuật", "ghi nhận học tập", "program map", "program maps", "program guide", "program guides", "bản đồ chương trình", "cẩm nang chương trình", "bh123", "bh073", "student project showcase",
];
const AUXILIARY_DISCOVERY_STOP_TERMS = new Set(["rmit", "club", "campus", "building", "calendar", "semester", "official", "student", "hanoi", "saigon", "south", "university", "academic", "hub"]);
const AUXILIARY_DISCOVERY_TERMS = new Set(
  AUXILIARY_SEARCH_DOCUMENTS.flatMap((document) => [document.titleEn, document.titleVi, ...document.keywords])
    .flatMap((title) => removeVietnameseDiacritics(title).split(/\s+/))
    .filter((term) => term.length > 3 && !AUXILIARY_DISCOVERY_STOP_TERMS.has(term)),
);

const AUXILIARY_QUERY_DECISION_CACHE = new Map<string, boolean>();

export function shouldSearchAuxiliaryDocuments(query: string): boolean {
  const normalized = removeVietnameseDiacritics(query);
  const cached = AUXILIARY_QUERY_DECISION_CACHE.get(normalized);
  if (cached !== undefined) return cached;
  const hasLocationIntent = /\b(?:where is|ở đâu|building|tòa nhà|cơ sở)\b/i.test(normalized);
  const hasHoursIntent = /\b(?:hours?|giờ|mo cua|mở cửa)\b/i.test(normalized);
  if (hasHoursIntent && !hasLocationIntent) {
    AUXILIARY_QUERY_DECISION_CACHE.set(normalized, false);
    return false;
  }
  const result = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(query)
    ? AUXILIARY_SEARCH_HINTS.some((hint) => normalized.includes(removeVietnameseDiacritics(hint)))
    : AUXILIARY_SEARCH_HINTS.some((hint) => normalized.includes(removeVietnameseDiacritics(hint)))
      || normalized.split(/\s+/).some((term) => AUXILIARY_DISCOVERY_TERMS.has(term));
  if (AUXILIARY_QUERY_DECISION_CACHE.size >= 128) AUXILIARY_QUERY_DECISION_CACHE.clear();
  AUXILIARY_QUERY_DECISION_CACHE.set(normalized, result);
  return result;
}

const DEPARTMENT_BY_ID = new Map(DEPARTMENT_CONTACTS.map((department) => [department.id, department]));

export interface SearchFilterOptions {
  categoryId?: string;
  campus?: Campus;
  language?: "en" | "vi";
  limit?: number;
  includeAuxiliary?: boolean;
}

export interface SearchResultItem {
  document: KnowledgeDocument;
  score: number;
  bestAnswer: string;
  keyDetails: string[];
  matchedKeywords: string[];
  relevantDepartment?: DepartmentContact;
  relatedQuestions: string[];
}
export function getSearchResultHref(document: KnowledgeDocument): string {
  if (document.categoryId === "scholarships") return "/topics/scholarships";
  return document.resultHref ?? (document.slug ? `/guides/${document.slug}` : `/topics/${document.categoryId}`);
}

/**
 * Normalizes query into tokens and expanded synonyms.
 */
export function processQuery(query: string): {
  normalized: string;
  diacriticFree: string;
  tokens: string[];
  expandedTerms: string[];
} {
  const normalized = query.toLowerCase().trim().replace(/[^\w\s\u00C0-\u1EF9]/gi, " ");
  const diacriticFree = removeVietnameseDiacritics(normalized);

  const rawTokens = diacriticFree.split(/\s+/).filter(Boolean);
  const tokens = rawTokens.filter((token) => !STOP_WORDS.has(token) && token.length > 1);

  const expandedTerms = new Set<string>();

  // Check phrase synonym matches
  for (const { phrase, synonyms } of NORMALIZED_SYNONYMS) {
    if (diacriticFree.includes(phrase)) {
      synonyms.forEach((synonym) => expandedTerms.add(synonym));
    }
  }

  return {
    normalized,
    diacriticFree,
    tokens: tokens.length > 0 ? tokens : rawTokens,
    expandedTerms: Array.from(expandedTerms),
  };
}

/**
 * Performs weighted client/server search over curated RMIT documents without invoking AI.
 */
export function searchKnowledgeBase(
  query: string,
  options: SearchFilterOptions = {}
): SearchResultItem[] {
  if (!query || !query.trim()) {
    return [];
  }

  const { language = "en", categoryId, campus, limit = 10, includeAuxiliary = true } = options;
  const cacheKey = `${KNOWLEDGE_INDEX_VERSION}|${query.trim().toLocaleLowerCase()}|${language}|${categoryId ?? "all"}|${campus ?? "all"}|${limit}|${includeAuxiliary}`;
  const cachedResults = SEARCH_RESULT_CACHE.get(cacheKey);
  if (cachedResults) return cachedResults;
  const { diacriticFree, tokens } = processQuery(query);
  const tokenMatchers = tokens.map((token) => new RegExp(`\\b${token}\\b`, "i"));


  const scoredResults: SearchResultItem[] = [];

  const searchIndex = includeAuxiliary && shouldSearchAuxiliaryDocuments(query)
    ? SEARCH_DOCUMENT_INDEX
    : CORE_SEARCH_DOCUMENT_INDEX;
  for (const indexed of searchIndex) {
    const doc = indexed.document;
    // 1. Filter by category if requested
    if (categoryId && categoryId !== "all" && doc.categoryId !== categoryId) {
      continue;
    }

    // 2. Filter by campus if requested
    if (campus && campus !== "all" && doc.campus !== "all" && doc.campus !== campus) {
      continue;
    }

    let score = 0;
    const requestedBuilding = diacriticFree.match(/\b(?:building\s*|b)(1|2|8|9|10)\b/)?.[1];
    if (requestedBuilding && doc.resultHref?.startsWith("/facilities#")) {
      const exactBuilding = doc.id.endsWith(`b${requestedBuilding}`) || indexed.titleEn.includes(`building ${requestedBuilding}`);
      score += exactBuilding ? 300 : -150;
    }
    let matchedKeywords: string[] | undefined;

    const titleEnClean = indexed.titleEn;
    const titleViClean = indexed.titleVi;
    const summaryEnClean = indexed.summaryEn;
    const summaryViClean = indexed.summaryVi;

    // 1. Full phrase matching (Super high weight)
    if (titleEnClean === diacriticFree || titleViClean === diacriticFree) {
      score += 250;
      (matchedKeywords ??= []).push(query);
    } else if (titleEnClean.includes(diacriticFree) || titleViClean.includes(diacriticFree)) {
      score += 150;
      (matchedKeywords ??= []).push(query);
    }

    // 2. Keyword exact sequence match
    for (const keyword of indexed.keywords) {
      if (keyword.normalized === diacriticFree) {
        score += 200;
        (matchedKeywords ??= []).push(keyword.value);
      } else if (diacriticFree.includes(keyword.normalized) || keyword.normalized.includes(diacriticFree)) {
        score += 80;
        (matchedKeywords ??= []).push(keyword.value);
      }
    }

    // 3. Synonyms & translations match
    for (const synonym of indexed.synonyms) {
      if (diacriticFree.includes(synonym.normalized) || synonym.normalized.includes(diacriticFree)) {
        score += 70;
        (matchedKeywords ??= []).push(synonym.value);
      }
    }

    // 4. Word boundary token level matching (only full words)
    let matchedTokenCount = 0;
    for (const tokenRegex of tokenMatchers) {
      let matchedThisToken = false;

      if (tokenRegex.test(titleEnClean) || tokenRegex.test(titleViClean)) {
        score += 35;
        matchedThisToken = true;
      }
      for (const keyword of indexed.keywords) {
        if (tokenRegex.test(keyword.normalized)) {
          score += 30;
          matchedThisToken = true;
          if (!matchedKeywords?.includes(keyword.value)) (matchedKeywords ??= []).push(keyword.value);
        }
      }
      if (tokenRegex.test(summaryEnClean) || tokenRegex.test(summaryViClean)) {
        score += 15;
        matchedThisToken = true;
      }

      if (matchedThisToken) {
        matchedTokenCount += 1;
      }
    }

    // Multi-token multiplier: heavily boost documents that match ALL or MOST search tokens
    if (tokens.length > 1 && matchedTokenCount >= tokens.length) {
      score += 100 * matchedTokenCount;
    }

    // Verified boost (only if there was an actual content match)
    if (score > 0 && doc.verificationStatus === "verified") {
      score += 5;
    }

    // Strict relevance threshold: must have meaningful keyword or title overlap
    if (score >= 45) {
      const bestAnswer = language === "vi" ? doc.summaryVi : doc.summaryEn;
      const keyDetails = language === "vi" ? doc.keyDetailsVi : doc.keyDetailsEn;
      const relevantDepartment = DEPARTMENT_BY_ID.get(doc.departmentId);

      // Related questions based on language
      const relatedQuestions =
        language === "vi"
          ? [
              `Thủ tục liên hệ ${relevantDepartment?.nameVi || "phòng ban phụ trách"}?`,
              `Hạn chót giải quyết ${doc.titleVi}?`,
              `Xem chi tiết quy chế trên website chính thức RMIT?`,
            ]
          : [
              `How to contact ${relevantDepartment?.nameEn || "the responsible department"}?`,
              `What are the deadlines related to ${doc.titleEn}?`,
              `Where is the official RMIT policy documented?`,
            ];

      scoredResults.push({
        document: doc,
        score,
        bestAnswer,
        keyDetails,
        matchedKeywords: matchedKeywords ? Array.from(new Set(matchedKeywords)) : [],
        relevantDepartment,
        relatedQuestions,
      });
    }
  }

  // Sort by score descending
  scoredResults.sort((a, b) => b.score - a.score);

  if (scoredResults.length === 0) {
    return cacheSearchResult(cacheKey, []);
  }

  const topScore = scoredResults[0].score;

  // When there is a clear, high-confidence match (topScore >= 100),
  // strictly filter out all irrelevant low-scoring noise and return only the best 1-2 answers.
  if (topScore >= 100) {
    const strictFiltered = scoredResults.filter(
      (res) => res.score >= topScore * 0.65
    );
    return cacheSearchResult(cacheKey, strictFiltered.slice(0, 2));
  }

  // For broader exploratory searches, return at most top 3 only if their score is high
  return cacheSearchResult(cacheKey, scoredResults.filter((res) => res.score >= Math.max(50, topScore * 0.6)).slice(0, 3));
}
