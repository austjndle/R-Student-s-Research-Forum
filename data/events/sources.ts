export type EventSourceType = "official_website" | "official_facebook";
export type SourceVerificationStatus = "verified" | "manual_review_required";

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
    lastSuccessfulCheck: "2026-10-31",
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
    lastSuccessfulCheck: "2026-10-31",
    notesEn: "Official student-life page with campus activity information and event announcements.",
    notesVi: "Trang đời sống sinh viên chính thức với thông tin hoạt động cơ sở và thông báo sự kiện.",
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
    id: "rmit-vietnam-facebook",
    nameEn: "RMIT University Vietnam Facebook",
    nameVi: "Facebook RMIT University Vietnam",
    organisation: "RMIT University Vietnam",
    sourceType: "official_facebook",
    url: "https://www.facebook.com/RMITUniversityVietnam",
    verificationStatus: "manual_review_required",
    lastSuccessfulCheck: "2026-10-31",
    notesEn: "Public discovery source. Facebook announcements are not imported automatically; each event requires manual review and original-post verification.",
    notesVi: "Nguồn khám phá công khai. Không tự động nhập thông báo Facebook; từng sự kiện cần được kiểm tra thủ công và xác minh bài đăng gốc.",
  },
];

export function getEventSource(sourceId: string): EventSource | undefined {
  return EVENT_SOURCES.find((source) => source.id === sourceId);
}
