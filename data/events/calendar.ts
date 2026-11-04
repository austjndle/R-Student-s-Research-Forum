import { ACADEMIC_CALENDAR_2027_ENTRIES } from "./academic";
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
export type RegistrationStatus = "open" | "closed" | "unverified";

export type EventTemporalStatus = "upcoming" | "ongoing" | "ended";
export type EventVerification = "verified" | "manual_review_required";

export interface RegistrationLink {
  labelEn: string;
  labelVi: string;
  url: string;
}

export interface ActivityHighlight {
  id: string;
  titleEn: string;
  titleVi: string;
  descriptionEn: string;
  descriptionVi: string;
  imageUrl?: string;
  imageAlt?: string;
  imageObjectPosition?: string;
  imageSourceUrl?: string;
  imageLastVerified?: string;
  sourceUrl: string;
  lastVerifiedDate: string;
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
  registrationStatus?: RegistrationStatus;
  registrationDeadline?: string;
  eligibilityEn?: string;
  eligibilityVi?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageAltEn?: string;
  imageAltVi?: string;
  imageObjectPosition?: string;
  imageAspectRatio?: string;
  imageSourceUrl?: string;
  imageLastVerified?: string;
  originalUrl: string;
  sourceId: string;
  sourceType: "official_website" | "official_facebook";
  sourceLastVerified: string;
  sourceLastChecked?: string;
  sourceLastChanged?: string;
  publicationStatus: PublicationStatus;
  verification: EventVerification;
  academicYear?: string;
  semester?: string;
  programType?: "higher_education" | "foundation_studies" | "english_program" | "postgraduate";
  cancellationNoticeEn?: string;
  cancellationNoticeVi?: string;
}

const verifiedOn = "2026-11-01";

export const CAMPUS_ACTIVITY_HIGHLIGHTS: ActivityHighlight[] = [
  {
    id: "activity-carnival-day",
    titleEn: "Carnival Day",
    titleVi: "Carnival Day",
    descriptionEn: "Annual campus carnival with food, outdoor games, live performances, and community activities.",
    descriptionVi: "Lễ hội cơ sở thường niên với ẩm thực, trò chơi ngoài trời, biểu diễn trực tiếp và hoạt động kết nối cộng đồng.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/student-activities-01.jpg",
    imageAlt: "RMIT students play outdoor games at a Carnival Day event.",
    imageSourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    imageLastVerified: verifiedOn,
    sourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    lastVerifiedDate: verifiedOn,
  },
  {
    id: "activity-club-day",
    titleEn: "Club Day",
    titleVi: "Club Day",
    descriptionEn: "Semesterly activity where students explore clubs, meet members, and learn about membership opportunities.",
    descriptionVi: "Hoạt động mỗi học kỳ để sinh viên khám phá CLB, gặp gỡ thành viên và tìm hiểu cơ hội tham gia.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/current-students/student-news/2025/club-day-s3-2025/11-club-day-s3-25-students-visiting-booth.jpg",
    imageAlt: "Students at RMIT Business & Finance Club Hanoi's decorated booth during Club Day.",
    imageObjectPosition: "50% 35%",
    imageSourceUrl: "https://www.rmit.edu.vn/students/student-news-and-events/student-news/2025/club-day-goes-full-rcade-with-booth-decorations/cl",
    imageLastVerified: verifiedOn,
    sourceUrl: "https://www.rmit.edu.vn/students/student-news-and-events/student-news/2025/club-day-goes-full-rcade-with-booth-decorations/cl",
    lastVerifiedDate: verifiedOn,
  },
  {
    id: "activity-welcome-day",
    titleEn: "Welcome Day",
    titleVi: "Welcome Day",
    descriptionEn: "Welcome activity with opportunities for new students to meet the RMIT community.",
    descriptionVi: "Hoạt động chào đón giúp sinh viên mới làm quen với cộng đồng RMIT.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/welcome-day-22.jpg",
    imageAlt: "New students meet and talk during RMIT Welcome Day.",
    imageSourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    imageLastVerified: verifiedOn,
    sourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    lastVerifiedDate: verifiedOn,
  },
  {
    id: "activity-x-run",
    titleEn: "X-Run",
    titleVi: "X-Run",
    descriptionEn: "Student activity featuring outdoor challenge and community participation.",
    descriptionVi: "Hoạt động sinh viên kết hợp thử thách ngoài trời và kết nối cộng đồng.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/x-day-2022.jpg",
    imageAlt: "RMIT students take part in an outdoor obstacle activity during X-Run.",
    imageSourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    imageLastVerified: verifiedOn,
    sourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    lastVerifiedDate: verifiedOn,
  },
  {
    id: "activity-sports-day",
    titleEn: "Sports Day",
    titleVi: "Sports Day",
    descriptionEn: "Sports activity with opportunities for participation, teamwork, and community connection.",
    descriptionVi: "Hoạt động thể thao tạo cơ hội tham gia, rèn luyện tinh thần đồng đội và kết nối cộng đồng.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/sports-day-2022.jpg",
    imageAlt: "A student stands beside a net at RMIT Sports Day.",
    imageSourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    imageLastVerified: verifiedOn,
    sourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    lastVerifiedDate: verifiedOn,
  },
  {
    id: "activity-wellbeing-day",
    titleEn: "Wellbeing Day",
    titleVi: "Wellbeing Day",
    descriptionEn: "Wellbeing activity with support and community-focused activities.",
    descriptionVi: "Hoạt động chăm sóc sức khỏe tinh thần với các nội dung hỗ trợ và kết nối cộng đồng.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/wellbeing-day-2022.jpg",
    imageAlt: "Students explore activity stalls at an RMIT wellbeing event.",
    imageSourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    imageLastVerified: verifiedOn,
    sourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    lastVerifiedDate: verifiedOn,
  },
  {
    id: "activity-pride-week",
    titleEn: "Pride Week",
    titleVi: "Pride Week",
    descriptionEn: "Inclusion and community activity celebrating belonging at RMIT.",
    descriptionVi: "Hoạt động về hòa nhập và cộng đồng, lan tỏa cảm giác thuộc về tại RMIT.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/pride-week.jpg",
    imageAlt: "RMIT Pride Week banner displayed at a campus entrance.",
    imageSourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    imageLastVerified: verifiedOn,
    sourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    lastVerifiedDate: verifiedOn,
  },
  {
    id: "activity-career-fair",
    titleEn: "Career Fair",
    titleVi: "Career Fair",
    descriptionEn: "Career activity with employer and career-development opportunities.",
    descriptionVi: "Hoạt động hướng nghiệp với cơ hội kết nối nhà tuyển dụng và phát triển nghề nghiệp.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/career-fair-2022.jpg",
    imageAlt: "Students visit employer booths at an RMIT Career Fair.",
    imageSourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    imageLastVerified: verifiedOn,
    sourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    lastVerifiedDate: verifiedOn,
  },
  {
    id: "activity-international-day",
    titleEn: "International Day",
    titleVi: "International Day",
    descriptionEn: "Cultural activity with student-led booths and community activities.",
    descriptionVi: "Hoạt động giao lưu văn hóa với các gian hàng do sinh viên tổ chức và hoạt động cộng đồng.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/international-festival.jpg",
    imageAlt: "Students visit cultural booths at an RMIT International Day event.",
    imageSourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    imageLastVerified: verifiedOn,
    sourceUrl: "https://www.rmit.edu.vn/students/campus-life/student-activities-and-events",
    lastVerifiedDate: verifiedOn,
  },
];

export const CALENDAR_ENTRIES: CalendarEntry[] = [
  ...ACADEMIC_CALENDAR_2027_ENTRIES,
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
    programType: "higher_education",
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
    programType: "higher_education",
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
    programType: "higher_education",
  },
  {
    id: "rmit-carnival-2026-sgs",
    type: "campus_event",
    titleEn: "RMIT Carnival 2026 — Saigon South",
    titleVi: "RMIT Carnival 2026 — Nam Sài Gòn",
    descriptionEn: "Annual RMIT community event with food, outdoor games, live performances, and activities designed to bring the community together.",
    descriptionVi: "Sự kiện cộng đồng RMIT thường niên với ẩm thực, trò chơi ngoài trời, biểu diễn trực tiếp và các hoạt động kết nối cộng đồng.",
    category: "festival",
    organiserEn: "RMIT Student Life",
    organiserVi: "Đời sống Sinh viên RMIT",
    campus: "saigon_south",
    venueEn: "RMIT Active Hub and Sports field, HCMC",
    venueVi: "RMIT Active Hub và sân thể thao, TP.HCM",
    startAt: "2026-10-31T15:00:00+07:00",
    endAt: "2026-10-31T20:30:00+07:00",
    registrationLinks: [
      { labelEn: "Register students", labelVi: "Đăng ký sinh viên", url: "https://apps.rmit.edu.vn/r/26Carnival-studentSGS" },
      { labelEn: "Register staff", labelVi: "Đăng ký nhân viên", url: "https://apps.rmit.edu.vn/r/26Carnival-staffSGS" },
      { labelEn: "Register alumni", labelVi: "Đăng ký cựu sinh viên", url: "https://apps.rmit.edu.vn/r/26Carnival-alumniSGS" },
    ],
    registrationStatus: "closed",
    registrationDeadline: "2026-10-27T23:59:59+07:00",
    eligibilityEn: "Current students, staff, and alumni.",
    eligibilityVi: "Sinh viên, nhân viên và cựu sinh viên hiện tại.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/events/student-site/2026/carnival-2026/thumbnail-carnival-2026.jpg",
    imageAlt: "Official RMIT Carnival 2026 banner showing the Saigon South and Hanoi dates.",
    imageSourceUrl: "https://www.rmit.edu.vn/students/student-news-and-events/student-events-2026/rmit-carnival-2026",
    imageLastVerified: verifiedOn,
    originalUrl: "https://www.rmit.edu.vn/students/student-news-and-events/student-events-2026/rmit-carnival-2026",
    sourceId: "rmit-student-activities",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
  },
  {
    id: "rmit-carnival-2026-hanoi",
    type: "campus_event",
    titleEn: "RMIT Carnival 2026 — Hanoi",
    titleVi: "RMIT Carnival 2026 — Hà Nội",
    descriptionEn: "Annual RMIT community event with food, outdoor games, live performances, and activities designed to bring the community together.",
    descriptionVi: "Sự kiện cộng đồng RMIT thường niên với ẩm thực, trò chơi ngoài trời, biểu diễn trực tiếp và các hoạt động kết nối cộng đồng.",
    category: "festival",
    organiserEn: "RMIT Student Life",
    organiserVi: "Đời sống Sinh viên RMIT",
    campus: "hanoi",
    venueEn: "Nang Song Hong Village, Bo De Ward, Hanoi",
    venueVi: "Làng Nắng Sông Hồng, phường Bồ Đề, Hà Nội",
    startAt: "2026-11-07T15:00:00+07:00",
    endAt: "2026-11-07T20:30:00+07:00",
    registrationLinks: [
      { labelEn: "Register students", labelVi: "Đăng ký sinh viên", url: "https://apps.rmit.edu.vn/r/26Carnival-StudentHN" },
      { labelEn: "Register alumni", labelVi: "Đăng ký cựu sinh viên", url: "https://apps.rmit.edu.vn/r/26Carnival-AlumniHN" },
    ],
    registrationStatus: "closed",
    registrationDeadline: "2026-11-02T23:59:59+07:00",
    eligibilityEn: "Current students, staff, and alumni.",
    eligibilityVi: "Sinh viên, nhân viên và cựu sinh viên hiện tại.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/events/student-site/2026/carnival-2026/thumbnail-carnival-2026.jpg",
    imageAlt: "Official RMIT Carnival 2026 banner showing the Saigon South and Hanoi dates.",
    imageSourceUrl: "https://www.rmit.edu.vn/students/student-news-and-events/student-events-2026/rmit-carnival-2026",
    imageLastVerified: verifiedOn,
    originalUrl: "https://www.rmit.edu.vn/students/student-news-and-events/student-events-2026/rmit-carnival-2026",
    sourceId: "rmit-student-activities",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
  },
  {
    id: "rmit-sustainability-week-2026-saigon-south",
    type: "campus_event",
    titleEn: "RMIT Sustainability Week 2026 — Saigon South",
    titleVi: "Tuần lễ Phát triển bền vững RMIT 2026 — Nam Sài Gòn",
    descriptionEn: "RMIT Vietnam's sustainability program with talks, workshops, exhibitions, and hands-on activities at Saigon South.",
    descriptionVi: "Chương trình phát triển bền vững của RMIT với tọa đàm, hội thảo, triển lãm và hoạt động thực hành tại Nam Sài Gòn.",
    category: "student-life",
    organiserEn: "RMIT Student Life",
    organiserVi: "Đời sống Sinh viên RMIT",
    campus: "saigon_south",
    venueEn: "RMIT Saigon South campus",
    venueVi: "Cơ sở RMIT Nam Sài Gòn",
    startAt: "2026-11-02T00:00:00+07:00",
    endAt: "2026-11-05T23:59:59+07:00",
    registrationUrl: "https://apps.rmit.edu.vn/r/SUSWeek2026Registration",
    registrationStatus: "unverified",
    eligibilityEn: "RMIT community; confirm activity-specific requirements on the official event page.",
    eligibilityVi: "Cộng đồng RMIT; hãy kiểm tra yêu cầu riêng của từng hoạt động trên trang sự kiện chính thức.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/events/student-site/2026/sustainability-week-2026/sustainability-week-26-thumbnail.jpg",
    imageAlt: "Official RMIT Sustainability Week 2026 artwork showing the title and a student illustration.",
    imageAltEn: "Official RMIT Sustainability Week 2026 artwork showing the event title and a student illustration.",
    imageAltVi: "Hình ảnh Tuần lễ Phát triển bền vững RMIT 2026 với tiêu đề chương trình và hình minh họa sinh viên.",
    imageObjectPosition: "50% 0%",
    imageAspectRatio: "8 / 3",
    imageSourceUrl: "https://www.rmit.edu.vn/students/student-news-and-events/student-events-2026/sustainability-week",
    imageLastVerified: verifiedOn,
    originalUrl: "https://www.rmit.edu.vn/students/student-news-and-events/student-events-2026/sustainability-week",
    sourceId: "rmit-student-activities",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
  },
  {
    id: "rmit-sustainability-week-2026-hanoi",
    type: "campus_event",
    titleEn: "RMIT Sustainability Week 2026 — Hanoi",
    titleVi: "Tuần lễ Phát triển bền vững RMIT 2026 — Hà Nội",
    descriptionEn: "RMIT Vietnam's sustainability program with talks, workshops, exhibitions, and hands-on activities in Hanoi.",
    descriptionVi: "Chương trình phát triển bền vững của RMIT với tọa đàm, hội thảo, triển lãm và hoạt động thực hành tại Hà Nội.",
    category: "student-life",
    organiserEn: "RMIT Student Life",
    organiserVi: "Đời sống Sinh viên RMIT",
    campus: "hanoi",
    venueEn: "RMIT Hanoi campus",
    venueVi: "Cơ sở RMIT Hà Nội",
    startAt: "2026-11-09T00:00:00+07:00",
    endAt: "2026-11-10T23:59:59+07:00",
    registrationUrl: "https://apps.rmit.edu.vn/r/SUSWeek2026Registration",
    registrationStatus: "unverified",
    eligibilityEn: "RMIT community; confirm activity-specific requirements on the official event page.",
    eligibilityVi: "Cộng đồng RMIT; hãy kiểm tra yêu cầu riêng của từng hoạt động trên trang sự kiện chính thức.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/events/student-site/2026/sustainability-week-2026/sustainability-week-26-thumbnail.jpg",
    imageAlt: "Official RMIT Sustainability Week 2026 artwork showing the title and a student illustration.",
    imageAltEn: "Official RMIT Sustainability Week 2026 artwork showing the event title and a student illustration.",
    imageAltVi: "Hình ảnh Tuần lễ Phát triển bền vững RMIT 2026 với tiêu đề chương trình và hình minh họa sinh viên.",
    imageObjectPosition: "50% 0%",
    imageAspectRatio: "8 / 3",
    imageSourceUrl: "https://www.rmit.edu.vn/students/student-news-and-events/student-events-2026/sustainability-week",
    imageLastVerified: verifiedOn,
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
    descriptionEn: "A public RMIT event exploring multiculturality, cultural debt, leadership, and an AI-enabled workforce.",
    descriptionVi: "Sự kiện công khai của RMIT về tính đa văn hóa, nợ văn hóa, lãnh đạo và lực lượng lao động ứng dụng AI.",
    category: "career",
    organiserEn: "RMIT University Vietnam",
    organiserVi: "RMIT Việt Nam",
    campus: "saigon_south",
    venueEn: "Nikko Hotel Saigon — 235 Nguyen Van Cu, Ho Chi Minh City",
    venueVi: "Nikko Hotel Saigon — 235 Nguyễn Văn Cừ, TP.HCM",
    startAt: "2026-11-05T09:30:00+07:00",
    endAt: "2026-11-05T11:30:00+07:00",
    registrationUrl: "https://www.rmit.edu.vn/events/all-events/2026/november-2026/rmit-deloitte-hr-roundtable-2026#register",
    registrationStatus: "unverified",
    eligibilityEn: "C-level executives, HR leaders, strategists, and RMIT faculty with a focus on human-centred innovation.",
    eligibilityVi: "Lãnh đạo cấp cao, lãnh đạo/chiến lược gia nhân sự và giảng viên RMIT quan tâm đến đổi mới lấy con người làm trung tâm.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/events/2026/rmit-deloitte-hr-roundtable/deloitte-hr-forum-2026-thumbnail.jpg",
    imageAlt: "Decorative connected-world image for the RMIT–Deloitte HR Roundtable 2026.",
    imageSourceUrl: "https://www.rmit.edu.vn/events/all-events/2026/november-2026/rmit-deloitte-hr-roundtable-2026",
    imageLastVerified: verifiedOn,
    originalUrl: "https://www.rmit.edu.vn/events/all-events/2026/november-2026/rmit-deloitte-hr-roundtable-2026",
    sourceId: "rmit-events",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
  },
  {
    id: "rmit-experience-day-2026-hanoi",
    type: "campus_event",
    titleEn: "RMIT Experience Day 2026 — Hanoi",
    titleVi: "Ngày trải nghiệm RMIT 2026 — Hà Nội",
    descriptionEn: "Explore RMIT programs, scholarships, student life, clubs, workshops, and campus facilities in Hanoi.",
    descriptionVi: "Khám phá chương trình, học bổng, đời sống sinh viên, CLB, hội thảo và cơ sở vật chất RMIT tại Hà Nội.",
    category: "student-life",
    organiserEn: "RMIT University Vietnam",
    organiserVi: "RMIT Việt Nam",
    campus: "hanoi",
    venueEn: "RMIT Hanoi City campus",

    venueVi: "Cơ sở RMIT Hà Nội",
    startAt: "2026-11-15T08:00:00+07:00",
    endAt: "2026-11-15T16:00:00+07:00",
    registrationUrl: "https://experienceday.rmit.edu.vn/en/?utm_source=Website&utm_medium=Eventpage&utm_content=Event_ENG&utm_campaign=SGS_ExperienceDay_291126",
    registrationStatus: "unverified",
    eligibilityEn: "High school students aged 15–18 and their parents.",
    eligibilityVi: "Học sinh trung học 15–18 tuổi và phụ huynh.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/events/2026/exp-day-2026/experience-day-2026-thumbnail-1200x800.jpg",
    imageAlt: "Three students collaborate on a robotics activity for RMIT Experience Day 2026.",
    imageSourceUrl: "https://www.rmit.edu.vn/events/all-events/2026/november-2026/experience-day-2026",
    imageLastVerified: verifiedOn,
    originalUrl: "https://www.rmit.edu.vn/events/all-events/2026/november-2026/experience-day-2026",
    sourceId: "rmit-events",
    sourceType: "official_website",
    sourceLastVerified: verifiedOn,
    publicationStatus: "published",
    verification: "verified",
  },
  {
    id: "rmit-experience-day-2026-saigon-south",
    type: "campus_event",
    titleEn: "RMIT Experience Day 2026 — Saigon South",
    titleVi: "Ngày trải nghiệm RMIT 2026 — Nam Sài Gòn",
    descriptionEn: "Explore RMIT programs, scholarships, student life, clubs, workshops, and campus facilities at Saigon South.",
    descriptionVi: "Khám phá chương trình, học bổng, đời sống sinh viên, CLB, hội thảo và cơ sở vật chất RMIT tại Nam Sài Gòn.",
    category: "student-life",
    organiserEn: "RMIT University Vietnam",
    organiserVi: "RMIT Việt Nam",
    campus: "saigon_south",
    venueEn: "RMIT Saigon South campus",
    venueVi: "Cơ sở RMIT Nam Sài Gòn",
    startAt: "2026-11-29T08:00:00+07:00",
    endAt: "2026-11-29T16:00:00+07:00",
    registrationUrl: "https://experienceday.rmit.edu.vn/en/?utm_source=Website&utm_medium=Eventpage&utm_content=Event_ENG&utm_campaign=SGS_ExperienceDay_291126",
    registrationStatus: "unverified",
    eligibilityEn: "High school students aged 15–18 and their parents.",
    eligibilityVi: "Học sinh trung học 15–18 tuổi và phụ huynh.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/events/2026/exp-day-2026/experience-day-2026-thumbnail-1200x800.jpg",
    imageAlt: "Three students collaborate on a robotics activity for RMIT Experience Day 2026.",
    imageSourceUrl: "https://www.rmit.edu.vn/events/all-events/2026/november-2026/experience-day-2026",
    imageLastVerified: verifiedOn,
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
    registrationStatus: "unverified",
    eligibilityEn: "Current high school students; confirm the official competition terms.",
    eligibilityVi: "Học sinh trung học hiện tại; hãy kiểm tra thể lệ chính thức của cuộc thi.",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/events/2026/rbpc-2026/rbpc-2026-1200x800.jpg",
    imageAlt: "Official RMIT Business Plan Competition 2026 artwork showing a student with a robot.",
    imageSourceUrl: "https://www.rmit.edu.vn/events/all-events/2026/september-2026/rmit-business-plan-competition-2026",
    imageLastVerified: verifiedOn,
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
export function getEffectiveRegistrationStatus(entry: Pick<CalendarEntry, "registrationStatus" | "registrationDeadline">, now = new Date()): RegistrationStatus | undefined {
  if (!entry.registrationStatus) return undefined;
  if (entry.registrationStatus === "open" && entry.registrationDeadline) {
    const deadline = new Date(entry.registrationDeadline);
    if (!Number.isNaN(deadline.getTime()) && now.getTime() > deadline.getTime()) return "closed";
  }
  return entry.registrationStatus;
}

export function getEventTemporalStatus(entry: CalendarEntry, now = new Date()): EventTemporalStatus {
  const start = new Date(entry.startAt).getTime();
  const end = new Date(entry.endAt ?? entry.startAt).getTime();
  const timestamp = now.getTime();
  if (timestamp < start) return "upcoming";
  if (timestamp <= end) return "ongoing";
  return "ended";
}

export function formatCalendarDate(value: string, language: "en" | "vi"): string {
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatCalendarDateRange(startAt: string, endAt: string | undefined, language: "en" | "vi"): string {
  const start = formatCalendarDate(startAt, language);
  if (!endAt || startAt.slice(0, 10) === endAt.slice(0, 10)) return start;
  return `${start} – ${formatCalendarDate(endAt, language)}`;
}
