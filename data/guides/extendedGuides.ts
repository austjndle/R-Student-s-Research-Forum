import { GuideStep } from "./guides";

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

export const EXTENDED_GUIDES: ResearchGuide[] = [
  {
    id: "guide-minor-pathways",
    slug: "dinh-huong-chon-minor-theo-major",
    titleEn: "Strategic Minor Pathways: Tailored for Every RMIT Major",
    titleVi: "Định hướng chọn chuyên ngành phụ (Minor) tối ưu theo tính cách & mục tiêu nghề nghiệp",
    descriptionEn: "Complete roadmap on selecting complementary minors (48 credit points) across Business (TBS), Tech (SSET), and Design (SCD) aligned with your strengths and industry demand.",
    descriptionVi: "Cẩm nang chiến lược chọn Minor (48 tín chỉ / 4 môn) liên ngành: kết hợp Kinh doanh, Công nghệ và Truyền thông để nhân đôi lợi thế cạnh tranh khi tốt nghiệp.",
    readTimeMinutes: 6,
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/libraryvn-site/library-news/library-header.jpg",
    steps: [
      {
        number: 1,
        titleEn: "Understand Minor Rules at RMIT Vietnam",
        titleVi: "Quy tắc đăng ký Minor tại RMIT Việt Nam",
        contentEn: "A Minor consists of 48 credit points (typically 4 standard courses). Minors allow you to either deepen your expertise in a related sub-discipline or cross over into another school (e.g. Business students taking an AI/Tech minor, or IT students taking a Management minor). Courses applied to your primary major cannot be double-counted toward a minor.",
        contentVi: "Chuyên ngành phụ (Minor) bao gồm 48 tín chỉ (thường là 4 môn học). Minor cho phép bạn đào sâu vào một phân mảng chuyên sâu hoặc học liên ngành (ví dụ: sinh viên Kinh doanh học thêm Minor về AI/Dữ liệu, hoặc sinh viên CNTT học thêm Minor về Quản trị dự án). Các môn đã tính vào Major chính sẽ không được tính trùng vào Minor.",
        actionLink: {
          url: "https://www.rmit.edu.vn/study-at-rmit/undergraduate-programs/list-of-minors-in-tbs-programs",
          labelEn: "View Official RMIT Minor Catalog ↗",
          labelVi: "Xem danh mục Minor chính thức của RMIT ↗",
        }
      },
      {
        number: 2,
        titleEn: "Complementary Minor Pairings for Business Students",
        titleVi: "Các cặp Minor chiến lược cho khối Kinh doanh (The Business School)",
        contentEn: "• Economics & Finance + FinTech / Business Analytics: Equips you for quantitative investment banking, risk management, and digital banking.\n• Digital Marketing + UX/UI Design or Consumer Analytics: Positions you as a growth hacker and conversion optimization lead.\n• Logistics + ESG & Sustainable Supply Chain: Highly demanded as global corporations transition to net-zero carbon mandates.",
        contentVi: "• Kinh tế & Tài chính + FinTech / Phân tích Dữ liệu: Mở đường vào các quỹ đầu tư định lượng, ngân hàng số và fintech.\n• Digital Marketing + Thiết kế UX/UI / Marketing Analytics: Giúp bạn trở thành Product Marketing Manager hoặc chuyên viên tối ưu chuyển đổi số (CRO).\n• Logistics + Chuỗi cung ứng Xanh & ESG: Bổ trợ đắc lực đón đầu làn sóng chứng chỉ phát thải và chuyển đổi bền vững của các tập đoàn đa quốc gia."
      },
      {
        number: 3,
        titleEn: "High-Leverage Minor Pairings for Tech & Engineering Students",
        titleVi: "Các cặp Minor bứt phá cho khối Công nghệ & Kỹ thuật (SSET)",
        contentEn: "• Information Technology + Tech Management / Entrepreneurship: Elevates you from a pure coder to a Technical Product Manager (TPM) or startup founder capable of pitching to venture capital.\n• Software Engineering + AI & Machine Learning: Specializes in generative AI architecture, large language model deployment, and neural networks.\n• Computer Science + Interactive Digital Media: Prepares you for 3D physics, real-time gaming engines, and spatial computing.",
        contentVi: "• Công nghệ Thông tin + Quản trị Dự án & Khởi nghiệp: Nâng tầm từ một lập trình viên thuần túy thành Technical Product Manager hoặc Tech Lead làm chủ vòng đời sản phẩm.\n• Kỹ thuật Phần mềm + Trí tuệ Nhân tạo & Machine Learning: Đào sâu vào mô hình ngôn ngữ lớn (LLM), mạng nơ-ron và AI tạo sinh.\n• Khoa học Máy tính + Thiết kế Game & Đồ họa tương tác: Làm chủ engine đồ họa 3D thời gian thực và tương tác thực tế ảo."
      },
      {
        number: 4,
        titleEn: "Creative & Media Minor Combinations (SCD)",
        titleVi: "Các hướng kết hợp Minor cho khối Truyền thông & Thiết kế (SCD)",
        contentEn: "• Professional Communication + Global Business & PR: Prepares you for high-stakes corporate diplomacy, brand crisis defense, and government relations.\n• Design Studies + Digital Media Production: Bridges static aesthetic design with multi-platform video storytelling, podcasting, and cinematic narrative direction.",
        contentVi: "• Truyền thông Chuyên nghiệp + Kinh doanh Quốc tế & PR: Trang bị năng lực đối thoại với cổ đông, ngoại giao doanh nghiệp và xử lý khủng hoảng truyền thông.\n• Thiết kế + Sản xuất Truyền thông Số: Kết nối giữa mỹ thuật thị giác với kỹ năng đạo diễn video, podcast và sản xuất nội dung đa nền tảng."
      }
    ],
    officialReferences: [
      { title: "RMIT Business Majors and Minors Directory", url: "https://www.rmit.edu.vn/study-at-rmit/undergraduate-programs/bachelor-business/explore-your-majors-and-minors" },
      { title: "List of Minors in TBS Programs", url: "https://www.rmit.edu.vn/study-at-rmit/undergraduate-programs/list-of-minors-in-tbs-programs" }
    ],
    relatedGuideSlugs: ["how-to-search-course-information", "how-to-find-rmit-policies"]
  },
  {
    id: "guide-canvas-mastery",
    slug: "huong-dan-su-dung-canvas-lms",
    titleEn: "Complete Canvas LMS Mastery: Submissions, Turnitin & Grades",
    titleVi: "Cẩm nang sử dụng Canvas LMS: Nộp bài tập, Kiểm tra Turnitin & Xem điểm",
    descriptionEn: "Essential student walkthrough for RMIT Vietnam's learning portal: submitting assignments, checking Turnitin similarity reports, calculating grades, and setting notification alerts.",
    descriptionVi: "Hướng dẫn thực tế sử dụng hệ thống học tập Canvas LMS tại RMIT Việt Nam: cách nộp bài, đọc kết quả báo cáo Turnitin, tính điểm môn học và cài đặt thông báo hạn nộp bài.",
    readTimeMinutes: 5,
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/pride-week.jpg",
    steps: [
      {
        number: 1,
        titleEn: "Assignment Submission & Accepted File Types",
        titleVi: "Cách nộp bài tập & Định dạng tệp được chấp nhận",
        contentEn: "Always submit through the designated Assignment link on Canvas. Ensure your file format (PDF, DOCX, ZIP) strictly matches lecturer requirements. Never email submissions directly to lecturers unless Canvas is officially confirmed down by IT.",
        contentVi: "Luôn nộp bài trực tiếp qua đường link Assignment trên Canvas. Đảm bảo định dạng file (PDF, DOCX, ZIP) đúng theo đề bài. Tuyệt đối không gửi bài qua email cho giảng viên trừ khi hệ thống Canvas gặp sự cố toàn trường được bộ phận IT xác nhận."
      },
      {
        number: 2,
        titleEn: "Understanding Turnitin Similarity Reports",
        titleVi: "Đọc và hiểu chỉ số trùng lặp Turnitin (Turnitin Similarity)",
        contentEn: "Turnitin highlights text matching existing academic literature and student papers. There is no 'safe threshold percentage' (e.g. 15% or 20%): lecturers evaluate whether highlighted sections are properly quoted and cited, or constitute academic misconduct.",
        contentVi: "Turnitin chỉ ra các đoạn văn bản trùng lặp với nguồn trên mạng và bài làm của sinh viên khác. Không có con số phần trăm 'an toàn tuyệt đối' (như 15% hay 20%): giảng viên sẽ đọc trực tiếp các đoạn bị bôi màu để kiểm tra xem bạn đã trích dẫn đúng chuẩn (citation) hay vi phạm đạo văn."
      },
      {
        number: 3,
        titleEn: "Gradebook, Rubrics & Feedback Comments",
        titleVi: "Tra cứu điểm số, Bảng tiêu chí chấm (Rubrics) & Nhận xét của giảng viên",
        contentEn: "Access 'Grades' from your course navigation menu. Click the speech bubble icon to read instructor comments, or click the grid icon to view detailed rubric performance across each assessment criterion.",
        contentVi: "Vào mục 'Grades' trên thanh menu môn học. Nhấn vào biểu tượng khung chat để đọc nhận xét riêng của giảng viên, hoặc nhấn vào biểu tượng bảng để xem điểm chi tiết theo từng tiêu chí trong Rubric chấm điểm."
      },
      {
        number: 4,
        titleEn: "Late Submission Penalties (10% Per Day Rule)",
        titleVi: "Quy định trừ điểm nộp trễ (Quy tắc 10% mỗi ngày)",
        contentEn: "Under RMIT Academic Assessment Policy, assessments submitted after the deadline without approved Special Consideration incur a penalty of 10% of total available marks per 24-hour period late (up to a maximum of 5 working days).",
        contentVi: "Theo Quy chế Đánh giá Học vụ của RMIT, các bài tập nộp trễ sau hạn chót mà không có đơn Hoàn cảnh đặc biệt được duyệt sẽ bị trừ 10% tổng điểm mỗi 24 giờ nộp muộn (tối đa trong 5 ngày làm việc, sau đó sẽ nhận điểm 0)."
      }
    ],
    officialReferences: [
      { title: "RMIT Canvas Student Portal Guide", url: "https://www.rmit.edu.vn/students/my-studies/canvas-study-portal" },
      { title: "RMIT Assessment Regulations & Penalties", url: "https://www.rmit.edu.vn/students/my-studies/assessment-and-results" }
    ],
    relatedGuideSlugs: ["how-to-write-an-effective-university-enquiry", "how-to-find-rmit-policies"]
  },
  {
    id: "guide-email-lecturers",
    slug: "van-mau-email-cho-giang-vien",
    titleEn: "Lecturer Email Blueprints & Academic Etiquette",
    titleVi: "Văn mẫu Email gửi Giảng viên & Quy tắc giao tiếp học thuật",
    descriptionEn: "Complete email templates for consultations, extensions, grade feedback, group work disputes, and recommendation letters.",
    descriptionVi: "Bộ văn mẫu chuẩn mực kèm khung điền sẵn: xin lịch hẹn consult, xin gia hạn nộp bài, hỏi nhận xét điểm số, xử lý thành viên nhóm không làm bài và xin thư giới thiệu.",
    readTimeMinutes: 6,
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/x-day-2022.jpg",
    steps: [
      {
        number: 1,
        titleEn: "Standard Professional Email Formula",
        titleVi: "Công thức chuẩn cho email gửi giảng viên",
        contentEn: "Subject: [Course Code] - [Brief Purpose] - [Full Name] - [Student ID sXXXXXXX]. Salutation: 'Dear Dr. [Name]' or 'Dear [Title] [Name]'. Body: State context immediately, your specific questions, and propose clear meeting slots.",
        contentVi: "Tiêu đề: [Mã môn học] - [Vấn đề ngắn gọn] - [Họ tên] - [sXXXXXXX]. Lời chào: 'Kính gửi Thầy/Cô [Tên]' hoặc 'Dear Dr. [Name]'. Nội dung: Nêu rõ lớp đang học, trình bày ngắn gọn vấn đề đã chủ động tìm hiểu trước, và đưa ra đề xuất thời gian hẹn cụ thể."
      },
      {
        number: 2,
        titleEn: "Requesting Consultations / Office Hours",
        titleVi: "Xin lịch hẹn tư vấn học thuật (Consultation / Office Hours)",
        contentEn: "Check Canvas first for pre-announced office hours. Prepare 2-3 specific questions in advance so the lecturer can see you have attempted the problem independently.",
        contentVi: "Luôn kiểm tra mục Office Hours trên Canvas trước. Chuẩn bị sẵn 2-3 câu hỏi cụ thể hoặc phần dàn ý đã làm để giảng viên thấy bạn đã chủ động nghiên cứu trước khi đến gặp."
      },
      {
        number: 3,
        titleEn: "Handling Non-Contributing Group Members (Free-Riders)",
        titleVi: "Báo cáo vấn đề thành viên nhóm không hợp tác (Free-riders)",
        contentEn: "Never complain emotionally. Keep a neutral, date-stamped evidence log (Teams chat screenshots, missed meeting dates, version history on shared documents). Alert the lecturer at least 1-2 weeks before submission.",
        contentVi: "Tuyệt đối không dùng từ ngữ cảm tính hoặc công kích cá nhân. Ghi chép nhật ký công việc khách quan có mốc ngày tháng rõ ràng (ảnh chụp tin nhắn Teams nhắc nhở, lịch họp vắng mặt, lịch sử chỉnh sửa trên Google Docs/Word). Báo giảng viên sớm trước 1-2 tuần."
      }
    ],
    officialReferences: [
      { title: "Student Connect Communication Guidelines", url: "https://www.rmit.edu.vn/students/support/student-connect" }
    ],
    relatedGuideSlugs: ["how-to-write-an-effective-university-enquiry", "huong-dan-su-dung-canvas-lms"]
  },
  {
    id: "guide-rmit-vn-clubs",
    slug: "danh-sach-cau-lac-bo-rmit-viet-nam",
    titleEn: "RMIT Vietnam Student Clubs Directory (Saigon South & Hanoi)",
    titleVi: "Danh bạ & Hướng dẫn tham gia Câu lạc bộ RMIT Việt Nam (Cơ sở Nam Sài Gòn & Hà Nội)",
    descriptionEn: "Complete verified guide to student clubs, sports teams, and societies at RMIT Vietnam. How to register during Club Day and contact Student Life.",
    descriptionVi: "Danh bạ câu lạc bộ và đội tuyển thể thao chính thức tại RMIT Việt Nam (Nam Sài Gòn & Hà Nội). Cách đăng ký trong ngày hội Club Day và thông tin liên hệ phòng Student Life.",
    readTimeMinutes: 5,
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/sports-day-2022.jpg",
    steps: [
      {
        number: 1,
        titleEn: "RMIT Vietnam Club Categories",
        titleVi: "Các khối câu lạc bộ tại RMIT Việt Nam",
        contentEn: "Clubs at RMIT Vietnam are categorized into Sports (Basketball RMIT Redbacks, Football, Badminton, Volleyball, Martial Arts), Academic & Professional (FinTech, Business Information Systems, Innovation & Entrepreneurship IEC, Design Club), and Community & Culture (Enactus RMIT Vietnam, Music Club, Dance Club, Photography Club).",
        contentVi: "Các câu lạc bộ tại RMIT Việt Nam được chia thành 3 khối chính: Thể thao (Đội tuyển Bóng rổ RMIT Redbacks, Bóng đá, Cầu lông, Bóng chuyền, Võ thuật), Học thuật & Chuyên môn (FinTech, Hệ thống thông tin kinh doanh BIS, Đổi mới sáng tạo IEC, CLB Thiết kế), và Văn hóa - Xã hội (Enactus RMIT, CLB Âm nhạc, CLB Nhảy, CLB Nhiếp ảnh).",
      },
      {
        number: 2,
        titleEn: "Club Day Registration Timeline",
        titleVi: "Thời gian đăng ký tham gia qua ngày hội Club Day",
        contentEn: "Held every semester during Orientation Week (O-Week) and Week 1 across both Saigon South and Hanoi campuses. Students can visit physical booths, meet club executives, and sign up for recruitment tryouts.",
        contentVi: "Được tổ chức vào Tuần lễ Định hướng (O-Week) và Tuần 1 đầu mỗi học kỳ tại cả hai cơ sở Nam Sài Gòn và Hà Nội. Sinh viên có thể ghé thăm trực tiếp các gian hàng, giao lưu với ban điều hành CLB và nộp đơn ứng tuyển."
      },
      {
        number: 3,
        titleEn: "Official Student Life Contact Channels",
        titleVi: "Kênh liên hệ chính thức của phòng Đời sống Sinh viên (Student Life)",
        contentEn: "Saigon South Campus: Student Life Office Room 10.2.09, Club Hub Room 10.2.08 | Email: student.life@rmit.edu.vn. Hanoi Campus: Student Life Office Room 1.8.007, Club Hub Room 1.5.016 | Email: student.lifehn@rmit.edu.vn.",
        contentVi: "Cơ sở Nam Sài Gòn: Văn phòng Student Life Phòng 10.2.09, Club Hub Phòng 10.2.08 | Email: student.life@rmit.edu.vn. Cơ sở Hà Nội: Văn phòng Student Life Phòng 1.8.007, Club Hub Phòng 1.5.016 | Email: student.lifehn@rmit.edu.vn."
      }
    ],
    officialReferences: [
      { title: "RMIT Vietnam Student Clubs & Societies", url: "https://www.rmit.edu.vn/students/campus-life/clubs" },
      { title: "RMIT Saigon South Campus Club List (PDF)", url: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/documents/pdfs/students/student-clubs/saigon-south-club-list.pdf" },
      { title: "RMIT Hanoi Campus Club List (PDF)", url: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/documents/pdfs/students/student-clubs/hn-club-list.pdf" }
    ],
    relatedGuideSlugs: ["orientation-student-card-campus-access", "how-to-write-an-effective-university-enquiry"]
  }
];
