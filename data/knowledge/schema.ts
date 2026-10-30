export type Campus = "saigon_south" | "hanoi" | "all";
export type VerificationStatus = "verified" | "needs_review" | "unavailable";

export interface KnowledgeCategory {
  id: string;
  nameEn: string;
  nameVi: string;
  descriptionEn: string;
  descriptionVi: string;
  iconName: string;
  imageUrl?: string;
}

export interface KnowledgeDocument {
  id: string;
  slug: string;
  titleEn: string;
  titleVi: string;
  categoryId: string;
  keywords: string[];
  synonymsEn: string[];
  synonymsVi: string[];
  summaryEn: string;
  summaryVi: string;
  detailedGuidanceEn: string;
  detailedGuidanceVi: string;
  keyDetailsEn: string[];
  keyDetailsVi: string[];
  officialSourceUrl: string;
  sourceTitle: string;
  departmentId: string;
  campus: Campus;
  lastVerifiedDate: string;
  verificationStatus: VerificationStatus;
  relatedDocIds?: string[];
  imageUrl?: string;
}

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  {
    id: "getting-started",
    nameEn: "Getting Started",
    nameVi: "Bắt đầu tại RMIT",
    descriptionEn: "Essential orientation, student ID cards, campus access, and introductory information.",
    descriptionVi: "Thông tin nhập học, thẻ sinh viên, quyền truy cập cơ sở và hướng dẫn ban đầu.",
    iconName: "Compass",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "academic-info",
    nameEn: "Academic Information & Policies",
    nameVi: "Thông tin & Quy chế học vụ",
    descriptionEn: "Grading scales, GPA calculations, academic integrity, special consideration, and appeals.",
    descriptionVi: "Thang điểm, cách tính GPA, liêm chính học thuật, xét duyệt hoàn cảnh đặc biệt.",
    iconName: "GraduationCap",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "enrolment",
    nameEn: "Course Enrolment",
    nameVi: "Đăng ký môn học",
    descriptionEn: "Timetables, add/drop periods, prerequisites, census dates, and program enrolment.",
    descriptionVi: "Thời khóa biểu, thời hạn thêm/hủy môn, môn tiên quyết, census date.",
    iconName: "CalendarCheck",
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "programs-majors",
    nameEn: "Programs & Majors",
    nameVi: "Chương trình & Ngành học",
    descriptionEn: "Program structures, changing majors, credit transfers, minors, and electives.",
    descriptionVi: "Cấu trúc chương trình, chuyển ngành học, công nhận tín chỉ, môn tự chọn.",
    iconName: "BookOpen",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "tuition-fees",
    nameEn: "Tuition Fees & Payments",
    nameVi: "Học phí & Thanh toán",
    descriptionEn: "Tuition deadlines, payment methods, fee statements, refunds, and financial holds.",
    descriptionVi: "Hạn đóng học phí, phương thức thanh toán, hoàn phí và gỡ chặn tài chính.",
    iconName: "CreditCard",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "scholarships",
    nameEn: "Scholarships",
    nameVi: "Học bổng",
    descriptionEn: "Vice-Chancellor's scholarships, academic achievement, eligibility, and renewal criteria.",
    descriptionVi: "Học bổng Hiệu trưởng, thành tích học tập, điều kiện ứng tuyển và duy trì học bổng.",
    iconName: "Award",
    imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "exchange",
    nameEn: "Exchange & Overseas Study",
    nameVi: "Trao đổi & Du học nước ngoài",
    descriptionEn: "Global mobility, cross-campus transfers to Melbourne, study abroad partner universities.",
    descriptionVi: "Chuyển tiếp sang RMIT Melbourne, du học trao đổi tại các trường đối tác toàn cầu.",
    iconName: "Globe",
    imageUrl: "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "academic-calendar",
    nameEn: "Academic Calendar & Semesters",
    nameVi: "Lịch học vụ & Kỳ học",
    descriptionEn: "Semester 1, 2, and 3 dates, census dates, exam periods, and public holidays.",
    descriptionVi: "Thời gian các học kỳ 1, 2, 3, census date, kỳ thi và các kỳ nghỉ lễ.",
    iconName: "Calendar",
    imageUrl: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "library",
    nameEn: "Library Services",
    nameVi: "Dịch vụ Thư viện",
    descriptionEn: "Physical and digital databases, study spaces, borrowing, research consultations, and referencing.",
    descriptionVi: "Cơ sở dữ liệu số, phòng học nhóm, mượn sách, hướng dẫn trích dẫn và nghiên cứu.",
    iconName: "Library",
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "it-support",
    nameEn: "IT Support & Digital Tools",
    nameVi: "Hỗ trợ CNTT & Công cụ số",
    descriptionEn: "Canvas LMS, student email, RMIT Wi-Fi, software licenses (Office 365, Adobe), and password reset.",
    descriptionVi: "Canvas LMS, email sinh viên, Wi-Fi RMIT, bản quyền phần mềm và đặt lại mật khẩu.",
    iconName: "Laptop",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "student-connect",
    nameEn: "Student Connect",
    nameVi: "Trung tâm Student Connect",
    descriptionEn: "Primary point of contact for official administrative enquiries, student letters, and records.",
    descriptionVi: "Đầu mối tiếp nhận hỗ trợ thủ tục sinh viên, xin giấy xác nhận và hồ sơ học vụ.",
    iconName: "Users",
    imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "wellbeing-accessibility",
    nameEn: "Wellbeing & Equitable Learning",
    nameVi: "Sức khỏe tâm lý & Hỗ trợ hòa nhập",
    descriptionEn: "Confidential psychological counseling, disability accommodations, and Equitable Learning Plans.",
    descriptionVi: "Tư vấn tâm lý bảo mật, kế hoạch học tập hòa nhập (ELP) và hỗ trợ sinh viên khuyết tật.",
    iconName: "HeartPulse",
    imageUrl: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "campus-facilities",
    nameEn: "Campus Facilities & Security",
    nameVi: "Cơ sở vật chất & An ninh",
    descriptionEn: "Sports halls, medical centers, parking, lost and found, and 24/7 security contacts.",
    descriptionVi: "Khu thể thao, phòng y tế, gửi xe, đồ thất lạc và an ninh trực 24/7.",
    iconName: "Building2",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "graduation",
    nameEn: "Graduation & Careers",
    nameVi: "Tốt nghiệp & Hướng nghiệp",
    descriptionEn: "Graduation ceremonies, testamurs, career consulting, internship fairs, and alumni networks.",
    descriptionVi: "Lễ tốt nghiệp, bằng tốt nghiệp, tư vấn việc làm, hội chợ thực tập và mạng lưới cựu sinh viên.",
    iconName: "Briefcase",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80",
  },
];
