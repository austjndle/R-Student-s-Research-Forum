import { getEventSource } from "./sources";

export type CalendarEntryType = "academic_date" | "campus_event";
export type EventCategory =
  | "academic"
  | "festival"
  | "competition"
  | "career"
  | "student-life";
export type Campus = "saigon_south" | "hanoi" | "all";
export type PublicationStatus = "published" | "draft" | "archived";
export type EventVerification = "verified" | "tentative" | "manual_review_required";

export interface RegistrationLink {
  labelEn: string;
  labelVi: string;
  url: string;
}

export interface CalendarEntry {
  id: string;
  type: CalendarEntryType;
  titleEn: string;
  titleVi: string;
  descriptionEn: string;
  descriptionVi: string;
  category: EventCategory;
  organiserEn: string;
  organiserVi: string;
  campus: Campus;
  venueEn?: string;
  venueVi?: string;
  startAt: string;
  endAt?: string;
  registrationUrl?: string;
  registrationLinks?: RegistrationLink[];
  originalUrl: string;
  sourceId: string;
  sourceType: "official_website" | "official_facebook";
  sourceLastVerified: string;
  publicationStatus: PublicationStatus;
  verification: EventVerification;
  academicYear?: string;
  semester?: string;
  cancellationNoticeEn?: string;
  cancellationNoticeVi?: string;
}

const verifiedOn = "2026-10-31";

export const CALENDAR_ENTRIES: CalendarEntry[] = [
  {
    id: "academic-s3-2026-start",
    type: "academic_date",
    titleEn: "Semester 3, 2026 begins",
    titleVi: "Bắt đầu học kỳ 3 năm 2026",
    descriptionEn: "Official Vietnam Campus academic calendar milestone. Program-specific calendars may differ.",
    descriptionVi: "Mốc lịch học vụ chính thức của cơ sở Việt Nam. Lịch riêng của từng chương trình có thể khác.",
    category: "academic",
    organiserEn: "RMIT University Vietnam",
    organiserVi: "RMIT Việt Nam",
    campus: "all",
    startAt: "2026-10-26T00:00:00+07:00",
    originalUrl: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/academic-calendar/academic-calendar-detailed-2026.pdf",
    sourceId: "rmit-academic-calendar-2026",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
    academicYear: "2026",
    semester: "Semester 3",
  },
  {
    id: "academic-s3-2026-add-classes",
    type: "academic_date",
    titleEn: "Last date to add classes — Semester 3, 2026",
    titleVi: "Hạn cuối đăng ký thêm lớp — Học kỳ 3 năm 2026",
    descriptionEn: "Official deadline listed in the Vietnam Campus academic calendar.",
    descriptionVi: "Hạn chính thức được nêu trong lịch học vụ cơ sở Việt Nam.",
    category: "academic",
    organiserEn: "RMIT University Vietnam",
    organiserVi: "RMIT Việt Nam",
    campus: "all",
    startAt: "2026-11-06T00:00:00+07:00",
    originalUrl: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/academic-calendar/academic-calendar-detailed-2026.pdf",
    sourceId: "rmit-academic-calendar-2026",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
    academicYear: "2026",
    semester: "Semester 3",
  },
  {
    id: "academic-s3-2026-tuition-payment",
    type: "academic_date",
    titleEn: "Tuition payment deadline — Semester 3, 2026",
    titleVi: "Hạn thanh toán học phí — Học kỳ 3 năm 2026",
    descriptionEn: "Official tuition payment deadline. Check your invoice and program communications for applicable details.",
    descriptionVi: "Hạn thanh toán học phí chính thức. Hãy kiểm tra hóa đơn và thông báo của chương trình để biết chi tiết áp dụng.",
    category: "academic",
    organiserEn: "RMIT University Vietnam",
    organiserVi: "RMIT Việt Nam",
    campus: "all",
    startAt: "2026-11-13T00:00:00+07:00",
    originalUrl: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/academic-calendar/academic-calendar-detailed-2026.pdf",
    sourceId: "rmit-academic-calendar-2026",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
    academicYear: "2026",
    semester: "Semester 3",
  },
  {
    id: "rmit-carnival-2026",
    type: "campus_event",
    titleEn: "RMIT Carnival 2026",
    titleVi: "RMIT Carnival 2026",
    descriptionEn: "Annual community event bringing the RMIT community together across campus activities.",
    descriptionVi: "Sự kiện cộng đồng thường niên quy tụ cộng đồng RMIT qua nhiều hoạt động tại cơ sở.",
    category: "festival",
    organiserEn: "RMIT Student Life",
    organiserVi: "Đời sống Sinh viên RMIT",
    campus: "all",
    startAt: "2026-10-31T00:00:00+07:00",
    endAt: "2026-11-08T23:59:59+07:00",
    registrationLinks: [
      {
        labelEn: "Register SGS",
        labelVi: "Đăng ký Nam Sài Gòn",
        url: "https://apps.rmit.edu.vn/r/26Carnival-studentSGS",
      },
      {
        labelEn: "Register Hanoi",
        labelVi: "Đăng ký Hà Nội",
        url: "https://apps.rmit.edu.vn/r/26Carnival-StudentHN",
      },
    ],
    originalUrl: "https://www.rmit.edu.vn/students/student-news-and-events/student-events-2026/rmit-carnival-2026",
    sourceId: "rmit-student-activities",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
  },
  {
    id: "rmit-sustainability-week-2026",
    type: "campus_event",
    titleEn: "RMIT Sustainability Week 2026",
    titleVi: "Tuần lễ Phát triển bền vững RMIT 2026",
    descriptionEn: "Student activities and programming focused on sustainability in motion.",
    descriptionVi: "Các hoạt động sinh viên tập trung vào chủ đề phát triển bền vững.",
    category: "student-life",
    organiserEn: "RMIT Student Life",
    organiserVi: "Đời sống Sinh viên RMIT",
    campus: "all",
    startAt: "2026-11-02T00:00:00+07:00",
    endAt: "2026-11-10T23:59:59+07:00",
    registrationUrl: "https://apps.rmit.edu.vn/r/SUSWeek2026Registration",
    originalUrl: "https://www.rmit.edu.vn/students/student-news-and-events/student-events-2026/sustainability-week",
    sourceId: "rmit-student-activities",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
  },
  {
    id: "rmit-deloitte-hr-roundtable-2026",
    type: "campus_event",
    titleEn: "RMIT–Deloitte HR Roundtable 2026",
    titleVi: "Tọa đàm Nhân sự RMIT–Deloitte 2026",
    descriptionEn: "A public RMIT event exploring the multicultural and AI-enabled workforce.",
    descriptionVi: "Sự kiện công khai của RMIT về môi trường nhân sự đa văn hóa và ứng dụng AI.",
    category: "career",
    organiserEn: "RMIT University Vietnam",
    organiserVi: "RMIT Việt Nam",
    campus: "saigon_south",
    venueEn: "RMIT Saigon South",
    venueVi: "RMIT Nam Sài Gòn",
    startAt: "2026-11-05T00:00:00+07:00",
    registrationUrl: "https://rmit.tfaforms.net/forms/help/3237",
    originalUrl: "https://www.rmit.edu.vn/events/all-events/2026/november-2026/rmit-deloitte-hr-roundtable-2026",
    sourceId: "rmit-events",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
  },
  {
    id: "rmit-experience-day-2026",
    type: "campus_event",
    titleEn: "RMIT Experience Day 2026",
    titleVi: "Ngày trải nghiệm RMIT 2026",
    descriptionEn: "Explore RMIT student life through activities at the Hanoi and Saigon South campuses.",
    descriptionVi: "Khám phá đời sống sinh viên RMIT qua các hoạt động tại cơ sở Hà Nội và Nam Sài Gòn.",
    category: "student-life",
    organiserEn: "RMIT University Vietnam",
    organiserVi: "RMIT Việt Nam",
    campus: "all",
    startAt: "2026-11-15T00:00:00+07:00",
    endAt: "2026-11-29T23:59:59+07:00",
    registrationUrl: "https://experienceday.rmit.edu.vn/en/?utm_source=Website&utm_medium=Eventpage&utm_content=Event_ENG&utm_campaign=SGS_ExperienceDay_291126",
    originalUrl: "https://www.rmit.edu.vn/events/all-events/2026/november-2026/experience-day-2026",
    sourceId: "rmit-events",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
  },
  {
    id: "rmit-business-plan-competition-2026",
    type: "campus_event",
    titleEn: "RMIT Business Plan Competition 2026",
    titleVi: "Cuộc thi Lập kế hoạch Kinh doanh RMIT 2026",
    descriptionEn: "A national challenge inviting high school students to tackle real-world problems with innovative business ideas.",
    descriptionVi: "Cuộc thi toàn quốc dành cho học sinh trung học giải quyết vấn đề thực tế bằng ý tưởng kinh doanh sáng tạo.",
    category: "competition",
    organiserEn: "RMIT University Vietnam",
    organiserVi: "RMIT Việt Nam",
    campus: "all",
    startAt: "2026-09-20T00:00:00+07:00",
    endAt: "2026-12-06T23:59:59+07:00",
    registrationUrl: "https://www.rmit.edu.vn/events/all-events/2026/september-2026/rmit-business-plan-competition-2026#register",
    originalUrl: "https://www.rmit.edu.vn/events/all-events/2026/september-2026/rmit-business-plan-competition-2026",
    sourceId: "rmit-events",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
  },
];

export const ACADEMIC_CALENDAR_SOURCE = getEventSource("rmit-academic-calendar-2026");

export function getPublishedCalendarEntries(): CalendarEntry[] {
  return CALENDAR_ENTRIES.filter((entry) => entry.publicationStatus === "published");
}

export function getCalendarEntriesByType(type: CalendarEntryType): CalendarEntry[] {
  return getPublishedCalendarEntries().filter((entry) => entry.type === type);
}

export function formatCalendarDate(value: string, language: "en" | "vi"): string {
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
