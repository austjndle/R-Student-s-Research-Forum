export interface GuideStep {
  number: number;
  titleEn: string;
  titleVi: string;
  contentEn: string;
  contentVi: string;
  actionLink?: {
    url: string;
    labelEn: string;
    labelVi: string;
  };
}

export interface ResearchGuide {
  id: string;
  slug: string;
  titleEn: string;
  titleVi: string;
  descriptionEn: string;
  descriptionVi: string;
  readTimeMinutes: number;
  imageUrl?: string;
  steps: GuideStep[];
  officialReferences: { title: string; url: string }[];
  relatedGuideSlugs: string[];
}

export const RESEARCH_GUIDES: ResearchGuide[] = [
  {
    id: "guide-find-policies",
    slug: "how-to-find-rmit-policies",
    titleEn: "How to Find & Interpret Official RMIT Policies",
    titleVi: "Cách tìm kiếm & Hiểu đúng quy chế chính thức của RMIT",
    descriptionEn: "Master the RMIT Policy Register to locate enforceable regulations on grading, appeals, academic integrity, and attendance.",
    descriptionVi: "Kỹ năng tra cứu Sổ tay Quy chế (Policy Register) để tìm điều lệ ràng buộc về thang điểm, khiếu nại, liêm chính học thuật và điểm danh.",
    readTimeMinutes: 4,
    imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&auto=format&fit=crop&q=80",
    steps: [
      {
        number: 1,
        titleEn: "Access the Official RMIT Policy Register",
        titleVi: "Truy cập Sổ tay Quy chế Chính thức của RMIT",
        contentEn: "All university policies are centrally published on the RMIT Policy Register. Unlike informal student groups or social media rumors, only policies on this register are legally binding.",
        contentVi: "Tất cả quy định của nhà trường được ban hành tập trung trên RMIT Policy Register. Khác với các tin đồn trên mạng xã hội, chỉ các văn bản tại đây mới có giá trị pháp lý học vụ chính thức.",
        actionLink: {
          url: "https://www.rmit.edu.vn/students/my-studies/rights-and-responsibilities",
          labelEn: "Open RMIT Policy Register ↗",
          labelVi: "Truy cập Sổ tay Quy chế RMIT ↗",
        },
      },
      {
        number: 2,
        titleEn: "Identify the Relevant Domain",
        titleVi: "Xác định nhóm quy chế cần tra cứu",
        contentEn: "Policies are structured into Teaching and Learning, Assessment & Results, Student Conduct, and Admissions. Use exact search terms like 'Assessment Policy' or 'Academic Integrity'.",
        contentVi: "Quy chế được chia theo các mảng: Giảng dạy & Học tập, Đánh giá & Điểm số, Quy tắc ứng xử và Tuyển sinh. Hãy gõ từ khóa chính xác như 'Assessment Policy' hay 'Academic Integrity'."
      },
      {
        number: 3,
        titleEn: "Check Effective Dates & Procedures",
        titleVi: "Kiểm tra ngày hiệu lực và các văn bản hướng dẫn chi tiết",
        contentEn: "Each policy has associated 'Procedures' detailing operational steps (such as timelines for appeal or required documentation). Verify that you are reading the latest version.",
        contentVi: "Mỗi chính sách đều đi kèm 'Procedures' (Quy trình thực hiện) ghi rõ từng bước, thời hạn khiếu nại và mẫu đơn cần nộp. Hãy chắc chắn bạn đang xem phiên bản cập nhật mới nhất."
      }
    ],
    officialReferences: [
      { title: "RMIT University Policy Register", url: "https://www.rmit.edu.vn/students/my-studies/rights-and-responsibilities" },
      { title: "Assessment and Academic Integrity Regulations", url: "https://www.rmit.edu.vn/students/my-studies/assessment-and-results" }
    ],
    relatedGuideSlugs: ["how-to-write-an-effective-university-enquiry", "how-to-contact-student-connect"]
  },
  {
    id: "guide-course-information",
    slug: "how-to-search-course-information",
    titleEn: "How to Search for Course Information & Course Guides (Syllabus)",
    titleVi: "Cách tìm kiếm thông tin môn học & Đề cương chi tiết (Course Guide / Syllabus)",
    descriptionEn: "Find detailed course prerequisites, credit values, assessment weightings, and learning outcomes before enrolling.",
    descriptionVi: "Tra cứu điều kiện tiên quyết, số tín chỉ, tỷ trọng các đầu điểm và chuẩn đầu ra môn học trước khi đăng ký.",
    readTimeMinutes: 3,
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
    steps: [
      {
        number: 1,
        titleEn: "Locate Course Codes and Guides",
        titleVi: "Xác định mã môn học và Course Guide",
        contentEn: "Every course has an alphanumeric code (e.g., COSC2635, BAFI1002). Search the RMIT Course Guide database using this specific code to download the official syllabus.",
        contentVi: "Mỗi môn học đều có mã gồm chữ và số (ví dụ: COSC2635, BAFI1002). Hãy tra cứu trên cơ sở dữ liệu Course Guide của RMIT bằng mã này để tải đề cương chi tiết."
      },
      {
        number: 2,
        titleEn: "Analyze Assessment Breakdown & Hurdle Requirements",
        titleVi: "Phân tích cấu trúc điểm số và điều kiện qua môn (Hurdle)",
        contentEn: "Review whether assessments are individual or group-based, and check for hurdle requirements (e.g., minimum 50% on final exam required to pass the course).",
        contentVi: "Xem kỹ tỷ trọng bài tập cá nhân, bài nhóm và các điều kiện bắt buộc (hurdle) như phải đạt ít nhất 50% điểm thi cuối kỳ mới được tính qua môn."
      },
      {
        number: 3,
        titleEn: "Confirm Prerequisites with Your Program Structure",
        titleVi: "Đối chiếu môn tiên quyết với lộ trình ngành (Program Map)",
        contentEn: "Check your program plan to ensure you have successfully completed all prerequisite subjects before enrolling in advanced units.",
        contentVi: "Kiểm tra sơ đồ môn học (Program Map) của khóa bạn để đảm bảo đã qua môn điều kiện trước khi đăng ký môn nâng cao."
      }
    ],
    officialReferences: [
      { title: "RMIT Course Guides Search", url: "https://www.rmit.edu.vn/students/my-studies" },
      { title: "Program Structures and Academic Maps", url: "https://www.rmit.edu.vn/study-at-rmit" }
    ],
    relatedGuideSlugs: ["how-to-check-academic-deadlines", "how-to-find-rmit-policies"]
  },
  {
    id: "guide-contact-student-connect",
    slug: "how-to-contact-student-connect",
    titleEn: "How to Contact Student Connect & Track Requests",
    titleVi: "Cách liên hệ Student Connect & Theo dõi tiến độ hồ sơ",
    descriptionEn: "Learn the fastest ways to submit administrative inquiries and ensure prompt resolution.",
    descriptionVi: "Phương pháp gửi yêu cầu hành chính nhanh nhất và theo dõi xử lý hồ sơ không bị gián đoạn.",
    readTimeMinutes: 3,
    imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80",
    steps: [
      {
        number: 1,
        titleEn: "Submit via the Online Portal with Student Credentials",
        titleVi: "Gửi qua cổng hỗ trợ trực tuyến bằng tài khoản sinh viên",
        contentEn: "Using the online Student Connect portal generates an automated Case ID, allowing you and the team to track progress securely.",
        contentVi: "Gửi yêu cầu qua cổng trực tuyến sẽ tự động tạo mã vụ việc (Case ID), giúp bạn và nhà trường dễ dàng theo dõi tiến độ xử lý."
      },
      {
        number: 2,
        titleEn: "Always Include Your Student ID (sXXXXXXX)",
        titleVi: "Luôn ghi rõ Mã số sinh viên (sXXXXXXX)",
        contentEn: "Any communication missing your full name and student number will experience delays for identity verification.",
        contentVi: "Mọi thư từ thiếu tên đầy đủ và mã số sinh viên đều sẽ bị chậm trễ do khâu xác minh danh tính."
      },
      {
        number: 3,
        titleEn: "Visit the Service Counter for Urgent Inquiries",
        titleVi: "Đến trực tiếp quầy hỗ trợ đối với các vấn đề khẩn cấp",
        contentEn: "For same-day letter collection or immediate registration blocks, visit Building 1 Ground Floor (Saigon South) or Handi Resco Level 1 (Hanoi).",
        contentVi: "Nếu cần nhận giấy xác nhận gấp hoặc gặp lỗi đăng ký cần mở khóa trong ngày, hãy tới quầy trực tiếp tại Tòa nhà 1 (Nam Sài Gòn) hoặc Tòa nhà Handi Resco (Hà Nội)."
      }
    ],
    officialReferences: [
      { title: "RMIT Vietnam Student Connect Hub", url: "https://www.rmit.edu.vn/students/support/student-connect" }
    ],
    relatedGuideSlugs: ["how-to-write-an-effective-university-enquiry", "how-to-find-right-department"]
  },
  {
    id: "guide-academic-deadlines",
    slug: "how-to-check-academic-deadlines",
    titleEn: "How to Check & Manage Academic Deadlines & Census Dates",
    titleVi: "Cách kiểm tra & Quản lý thời hạn học vụ và ngày Census Date",
    descriptionEn: "Avoid financial loss and academic penalties by keeping track of critical milestone dates each semester.",
    descriptionVi: "Tránh mất học phí và bị điểm phạt học bạ bằng cách nắm chắc các mốc thời gian quan trọng trong kỳ.",
    readTimeMinutes: 4,
    imageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80",
    steps: [
      {
        number: 1,
        titleEn: "Download the Official Academic Calendar PDF",
        titleVi: "Tải file PDF Lịch Học vụ Chính thức",
        contentEn: "Keep the current year's calendar saved on your phone and laptop. Note the exact start date, Census Date, revision week, and exam windows.",
        contentVi: "Lưu lịch học vụ năm hiện tại về điện thoại và máy tính. Đánh dấu ngày bắt đầu học, ngày Census Date, tuần ôn tập và lịch thi."
      },
      {
        number: 2,
        titleEn: "Understand Census Date Implications",
        titleVi: "Hiểu rõ ý nghĩa của ngày Census Date",
        contentEn: "Census Date is the absolute deadline to finalize your study load. Dropping after this date forfeits tuition fees and yields a 'Withdrawn' grade.",
        contentVi: "Census Date là hạn chót chốt danh sách môn học. Hủy môn sau ngày này bạn sẽ mất học phí và nhận điểm rút môn (W)."
      },
      {
        number: 3,
        titleEn: "Subscribe to RMIT Student Announcements",
        titleVi: "Theo dõi các thông báo chính thức của trường",
        contentEn: "Important date changes or timetable updates are announced through student emails and the official Canvas dashboard.",
        contentVi: "Mọi thay đổi về thời gian thi hoặc điều chỉnh thời khóa biểu đều được gửi qua email sinh viên và bảng tin Canvas."
      }
    ],
    officialReferences: [
      { title: "RMIT Academic Calendar", url: "https://www.rmit.edu.vn/students/my-studies/important-dates-and-academic-calendar" }
    ],
    relatedGuideSlugs: ["how-to-search-course-information", "how-to-contact-student-connect"]
  },
  {
    id: "guide-research-scholarships",
    slug: "how-to-research-scholarships",
    titleEn: "How to Research & Apply for RMIT Scholarships",
    titleVi: "Cách tra cứu & Chuẩn bị hồ sơ ứng tuyển học bổng RMIT",
    descriptionEn: "Comprehensive walkthrough of scholarship opportunities for prospective and current students.",
    descriptionVi: "Hướng dẫn toàn diện về các cơ hội học bổng cho tân sinh viên và sinh viên đang theo học.",
    readTimeMinutes: 5,
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    steps: [
      {
        number: 1,
        titleEn: "Match Your Eligibility Profile",
        titleVi: "Đối chiếu hồ sơ với tiêu chuẩn từng loại học bổng",
        contentEn: "Review criteria across Academic Merit, Leadership, Technology, and Equity scholarships to focus your efforts on the highest probability awards.",
        contentVi: "Kiểm tra kỹ điều kiện giữa Học bổng Học thuật, Lãnh đạo, Công nghệ và Hòa nhập để tập trung vào chương trình phù hợp nhất."
      },
      {
        number: 2,
        titleEn: "Prepare Verified Supporting Evidence",
        titleVi: "Chuẩn bị minh chứng xác thực",
        contentEn: "Gather academic transcripts, IELTS/TOEFL certificates, community leadership references, and a compelling personal statement answering the stated prompt.",
        contentVi: "Thu thập bảng điểm, chứng chỉ tiếng Anh, thư giới thiệu hoạt động ngoại khóa và bài luận cá nhân trả lời đúng chủ đề."
      },
      {
        number: 3,
        titleEn: "Understand Maintenance Requirements",
        titleVi: "Nắm rõ điều kiện duy trì học bổng",
        contentEn: "Most scholarships require maintaining a semester GPA of 3.0 or higher. Plan your study load realistically so your scholarship remains active.",
        contentVi: "Hầu hết các học bổng yêu cầu duy trì GPA mỗi kỳ từ 3.0/4.0 trở lên. Hãy phân bổ khối lượng môn học hợp lý để giữ vững học bổng."
      }
    ],
    officialReferences: [
      { title: "RMIT Scholarships Directory", url: "https://www.rmit.edu.vn/vi/hoc-tap-tai-rmit/hoc-bong" }
    ],
    relatedGuideSlugs: ["how-to-find-rmit-policies", "how-to-write-an-effective-university-enquiry"]
  },
  {
    id: "guide-effective-enquiry",
    slug: "how-to-write-an-effective-university-enquiry",
    titleEn: "How to Write an Effective University Enquiry Email",
    titleVi: "Cách viết email yêu cầu học vụ hiệu quả & Nhận phản hồi nhanh",
    descriptionEn: "Frameworks, etiquette, and essential details to get your inquiry resolved on the first attempt.",
    descriptionVi: "Bố cục, quy tắc lịch sự và các thông tin bắt buộc để được xử lý vấn đề ngay từ email đầu tiên.",
    readTimeMinutes: 3,
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
    steps: [
      {
        number: 1,
        titleEn: "Use a Clear, Descriptive Subject Line",
        titleVi: "Đặt tiêu đề email rõ ràng và cụ thể",
        contentEn: "Format: [Student ID] - [Full Name] - [Brief Topic]. Example: 's3912345 - Nguyen Van A - Query Regarding Course Enrolment Timetable'.",
        contentVi: "Định dạng chuẩn: [Mã sinh viên] - [Họ và tên] - [Vấn đề ngắn gọn]. Ví dụ: 's3912345 - Nguyen Van A - Thắc mắc thời khóa biểu môn học'.",
      },
      {
        number: 2,
        titleEn: "Always Send from Your Official Student Email",
        titleVi: "Luôn gửi từ địa chỉ email sinh viên RMIT chính thức",
        contentEn: "University administration strictly verifies student identities. Emails sent from personal Gmail or Yahoo addresses are frequently declined or face verification delays.",
        contentVi: "Nhà trường có quy định xác thực danh tính sinh viên nghiêm ngặt. Thư gửi từ Gmail hoặc Yahoo cá nhân thường không được xử lý hoặc mất thời gian đối soát."
      },
      {
        number: 3,
        titleEn: "Provide Context and Attach Screenshots",
        titleVi: "Nêu rõ bối cảnh và đính kèm ảnh chụp màn hình",
        contentEn: "Explain what steps you already tried, state the exact error message or course code, and attach clean screenshots if applicable.",
        contentVi: "Mô tả bạn đã thử những bước nào, ghi rõ mã môn học hoặc thông báo lỗi và đính kèm ảnh chụp màn hình rõ ràng."
      }
    ],
    officialReferences: [
      { title: "Student Connect Communication Guidelines", url: "https://www.rmit.edu.vn/students/support/student-connect" }
    ],
    relatedGuideSlugs: ["how-to-contact-student-connect", "how-to-find-right-department"]
  },
  {
    id: "guide-find-right-department",
    slug: "how-to-find-right-department",
    titleEn: "How to Identify the Right Department for Your Problem",
    titleVi: "Cách xác định đúng phòng ban tiếp nhận vấn đề của bạn",
    descriptionEn: "Stop sending inquiries to the wrong office. A cheat-sheet of university departments and their jurisdictions.",
    descriptionVi: "Tránh gửi nhầm email lòng vòng. Bảng hướng dẫn tra cứu nhanh trách nhiệm của từng phòng ban tại trường.",
    readTimeMinutes: 3,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
    steps: [
      {
        number: 1,
        titleEn: "Academic Records & Official Letters -> Student Connect",
        titleVi: "Hồ sơ học vụ & Giấy xác nhận -> Student Connect",
        contentEn: "For transcripts, enrolment issues, program transfer, or intermission, always initiate contact with Student Connect.",
        contentVi: "Mọi yêu cầu bảng điểm, lỗi đăng ký môn, chuyển ngành hoặc bảo lưu, luôn bắt đầu từ Student Connect."
      },
      {
        number: 2,
        titleEn: "Invoices, Payments & Holds -> Tuition & Finance Office",
        titleVi: "Hóa đơn, Thanh toán & Chặn học vụ -> Phòng Tài chính & Học phí",
        contentEn: "For tuition statement inquiries, VAT invoice requests, or payment confirmation issues, coordinate with Finance.",
        contentVi: "Các vấn đề về hóa đơn học phí, xuất hóa đơn VAT hoặc xác nhận chuyển khoản ngân hàng do Phòng Tài chính phụ trách."
      },
      {
        number: 3,
        titleEn: "Wi-Fi, Software & LMS -> IT Service Desk",
        titleVi: "Mạng Wi-Fi, Bản quyền phần mềm & LMS -> IT Service Desk",
        contentEn: "For Canvas errors, password reset, or Adobe/Microsoft license installation, contact the IT Service Desk directly.",
        contentVi: "Các lỗi Canvas, quên mật khẩu hoặc cài đặt bộ phần mềm Adobe/Microsoft, hãy liên hệ thẳng IT Service Desk."
      }
    ],
    officialReferences: [
      { title: "RMIT Vietnam University Contact Directory", url: "https://www.rmit.edu.vn/contact-us" }
    ],
    relatedGuideSlugs: ["how-to-contact-student-connect", "how-to-write-an-effective-university-enquiry"]
  }
];

import { EXTENDED_GUIDES } from "./extendedGuides";
export const ALL_RESEARCH_GUIDES: ResearchGuide[] = [...RESEARCH_GUIDES, ...EXTENDED_GUIDES];
