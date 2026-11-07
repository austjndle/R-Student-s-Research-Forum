export type EventSourceType = "official_website" | "official_facebook";
export type SourceVerificationStatus = "verified" | "partially_verified" | "unverified" | "source_unavailable" | "conflicting" | "review_required";

export interface EventSource {
  id: string;
  nameEn: string;
  nameVi: string;
  organisation: string;
  sourceType: EventSourceType;
  url: string;
  verificationStatus: SourceVerificationStatus;
  lastSuccessfulCheck: string;
  notesEn: string;
  notesVi: string;
}

export const EVENT_SOURCES: EventSource[] = [
  {
    id: "rmit-events",
    nameEn: "RMIT Vietnam Events",
    nameVi: "Sự kiện RMIT Việt Nam",
    organisation: "RMIT University Vietnam",
    sourceType: "official_website",
    url: "https://www.rmit.edu.vn/events",
    verificationStatus: "verified",
    lastSuccessfulCheck: "2026-11-01",
    notesEn: "Official public events listing maintained by RMIT University Vietnam.",
    notesVi: "Trang danh sách sự kiện công khai chính thức do RMIT Việt Nam quản lý.",
  },
  {
    id: "rmit-student-activities",
    nameEn: "Student activities and events",
    nameVi: "Hoạt động và sự kiện sinh viên",
    organisation: "RMIT Student Life",
    sourceType: "official_website",
    url: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    verificationStatus: "verified",
    lastSuccessfulCheck: "2026-11-01",
    notesEn: "Official student-life page with campus activity information and event announcements.",
    notesVi: "Trang đời sống sinh viên chính thức với thông tin hoạt động cơ sở và thông báo sự kiện.",
  },
  {
    id: "rmit-club-day-archive",
    nameEn: "Club Day Fun Day (official RMIT archive)",
    nameVi: "Vui cùng Ngày hội Câu lạc bộ (lưu trữ RMIT)",
    organisation: "RMIT University Vietnam",
    sourceType: "official_website",
    url: "https://www.rmit.edu.vn/news/all-news/2017/mar/club-day-fun-day",
    verificationStatus: "verified",
    lastSuccessfulCheck: "2026-11-01",
    notesEn: "Historical official page states Club Day is held every semester at both Saigon South and Hanoi; it does not announce current dates.",
    notesVi: "Trang lưu trữ chính thức cho biết Club Day diễn ra mỗi học kỳ tại Nam Sài Gòn và Hà Nội; trang không công bố lịch hiện tại.",
  },
  {
    id: "rmit-club-day-2024",
    nameEn: "Newbie 101: Clubs and Societies",
    nameVi: "Newbie 101: Câu lạc bộ và hội nhóm",
    organisation: "RMIT Student Life",
    sourceType: "official_website",
    url: "https://www.rmit.edu.vn/students/student-news-and-events/student-news/student-news-2024/newbie-101-clubs-and-societies",
    verificationStatus: "verified",
    lastSuccessfulCheck: "2026-11-01",
    notesEn: "Official 2024 student-life article with participation context; it does not announce current campus dates.",
    notesVi: "Bài viết đời sống sinh viên chính thức năm 2024 có thông tin tham gia; không công bố lịch hiện tại theo cơ sở.",
  },
  {
    id: "rmit-club-day-2025",
    nameEn: "Game On! Club Day goes full ‘RCADE’ with booth decorations",
    nameVi: "Game On! Club Day goes full ‘RCADE’ with booth decorations",
    organisation: "RMIT Student Life",
    sourceType: "official_website",
    url: "https://www.rmit.edu.vn/students/student-news-and-events/student-news/2025/club-day-goes-full-rcade-with-booth-decorations/cl",
    verificationStatus: "verified",
    lastSuccessfulCheck: "2026-11-01",
    notesEn: "Official RMIT 2025 article describing Club Day booth decorations and containing the selected image; this is historical coverage, not a current schedule.",
    notesVi: "Bài viết chính thức của RMIT năm 2025 mô tả gian hàng Club Day và có ảnh được chọn; đây là tư liệu sự kiện đã qua, không phải lịch hiện tại.",
  },
  {
    id: "rmit-academic-calendar",
    nameEn: "Important dates and academic calendar",
    nameVi: "Các mốc thời gian và lịch học vụ",
    organisation: "RMIT University Vietnam",
    sourceType: "official_website",
    url: "https://www.rmit.edu.vn/students/my-studies/important-dates-and-academic-calendar",
    verificationStatus: "verified",
    lastSuccessfulCheck: "2026-10-31",
    notesEn: "Official page explaining that dates vary by program and linking to the current academic calendar.",
    notesVi: "Trang chính thức lưu ý lịch thay đổi theo chương trình và liên kết đến lịch học vụ hiện hành.",
  },
  {
    id: "rmit-academic-calendar-2026",
    nameEn: "Vietnam Campus Academic Calendar 2026",
    nameVi: "Lịch học vụ cơ sở Việt Nam năm 2026",
    organisation: "RMIT University Vietnam",
    sourceType: "official_website",
    url: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/academic-calendar/academic-calendar-detailed-2026.pdf",
    verificationStatus: "verified",
    lastSuccessfulCheck: "2026-10-31",
    notesEn: "Official PDF. Last updated 10 November 2025; students should confirm program-specific dates on the source page.",
    notesVi: "PDF chính thức. Cập nhật lần cuối ngày 10/11/2025; sinh viên cần đối chiếu lịch riêng của chương trình trên trang nguồn.",
  },
  {
    id: "rmit-academic-calendar-2027",
    nameEn: "Vietnam Campus Academic Calendar 2027",
    nameVi: "Lịch học vụ cơ sở Việt Nam năm 2027",
    organisation: "RMIT University Vietnam",
    sourceType: "official_website",
    url: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/documents/pdfs/academic-calendar/academic-calendar-2027.pdf",
    verificationStatus: "verified",
    lastSuccessfulCheck: "2026-11-03",
    notesEn: "Official approved Vietnam Campus Higher Education calendar for 2027. Program-specific schedules may differ.",
    notesVi: "Lịch học vụ cơ sở Việt Nam năm 2027 chính thức đã được phê duyệt. Lịch riêng của từng chương trình có thể khác.",
  },
  {
    id: "rmit-vietnam-facebook",
    nameEn: "RMIT University Vietnam Facebook",
    nameVi: "Facebook RMIT University Vietnam",
    organisation: "RMIT University Vietnam",
    sourceType: "official_facebook",
    url: "https://www.facebook.com/RMITUniversityVietnam",
    verificationStatus: "review_required",
    lastSuccessfulCheck: "2026-10-31",
    notesEn: "Public discovery source. Facebook announcements are not imported automatically; each event requires manual review and original-post verification.",
    notesVi: "Nguồn khám phá công khai. Không tự động nhập thông báo Facebook; từng sự kiện cần được kiểm tra thủ công và xác minh bài đăng gốc.",
  },
];

export function getEventSource(sourceId: string): EventSource | undefined {
  return EVENT_SOURCES.find((source) => source.id === sourceId);
}
