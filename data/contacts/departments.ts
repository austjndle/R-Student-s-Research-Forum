export interface DepartmentContact {
  id: string;
  nameEn: string;
  nameVi: string;
  category: "administrative" | "academic" | "support" | "facilities" | "specialized";
  descriptionEn: string;
  descriptionVi: string;
  responsibilitiesEn: string[];
  responsibilitiesVi: string[];
  typicalEnquiriesEn: string[];
  typicalEnquiriesVi: string[];
  email: string | null;
  phone: string | null;
  formUrl: string | null;
  websiteUrl: string;
  campus: "saigon_south" | "hanoi" | "all";
  locationEn: string;
  locationVi: string;
  serviceHoursEn: string;
  serviceHoursVi: string;
  lastVerifiedDate: string;
}

export const DEPARTMENT_CONTACTS: DepartmentContact[] = [
  {
    id: "dept-student-connect",
    nameEn: "Student Connect",
    nameVi: "Trung tâm Hỗ trợ Sinh viên (Student Connect)",
    category: "administrative",
    descriptionEn: "Single central service point for all academic administration, student records, timetable queries, and official letters.",
    descriptionVi: "Đầu mối tiếp nhận và giải quyết toàn bộ các thủ tục học vụ, hồ sơ sinh viên, điều chỉnh thời khóa biểu và giấy xác nhận.",
    responsibilitiesEn: [
      "Student status letters and official academic transcripts",
      "Course enrolment, add/drop assistance, and program transfers",
      "Graduation eligibility checking and certificate collection",
      "Leaves of absence, intermission, and discontinuation processing"
    ],
    responsibilitiesVi: [
      "Cấp giấy xác nhận sinh viên và bảng điểm học tập chính thức",
      "Hỗ trợ đăng ký môn, thêm/hủy môn và chuyển ngành học",
      "Kiểm tra điều kiện tốt nghiệp và nhận bằng tốt nghiệp",
      "Thủ tục bảo lưu học tập và xin thôi học"
    ],
    typicalEnquiriesEn: [
      "How do I request an official academic transcript or completion letter?",
      "Can I get help adding a course that is currently full on the timetable?",
      "How do I apply for internal program transfer?",
      "What is the procedure for taking a semester off (intermission)?"
    ],
    typicalEnquiriesVi: [
      "Làm sao để xin bảng điểm chính thức hoặc giấy xác nhận sinh viên?",
      "Lớp học trên thời khóa biểu đã đầy thì cần xử lý thế nào?",
      "Quy trình nộp đơn đổi ngành học như thế nào?",
      "Thủ tục xin bảo lưu một kỳ học ra sao?"
    ],
    email: "student.connect@rmit.edu.vn",
    phone: "+84 28 3776 1300",
    formUrl: "https://www.rmit.edu.vn/students/support/student-connect",
    websiteUrl: "https://www.rmit.edu.vn/students/support/student-connect",
    campus: "all",
    locationEn: "Saigon South: Building 1, Ground Floor | Hanoi: Handi Resco, Level 1",
    locationVi: "Nam Sài Gòn: Tòa nhà 1, Tầng trệt | Hà Nội: Tòa nhà Handi Resco, Tầng 1",
    serviceHoursEn: "Monday - Friday: 8:30 AM - 5:00 PM (Closed weekends & public holidays)",
    serviceHoursVi: "Thứ Hai - Thứ Sáu: 8:30 - 17:00 (Nghỉ Thứ Bảy, Chủ Nhật và ngày lễ)",
    lastVerifiedDate: "2026-10-20"
  },
  {
    id: "dept-it",
    nameEn: "IT Service Desk",
    nameVi: "Bộ phận Hỗ trợ CNTT (IT Service Desk)",
    category: "support",
    descriptionEn: "Technical assistance for student accounts, campus Wi-Fi, Canvas LMS, Microsoft 365, and licensed software.",
    descriptionVi: "Hỗ trợ kỹ thuật về tài khoản sinh viên, Wi-Fi trường, cổng học tập Canvas LMS, Microsoft 365 và các phần mềm bản quyền.",
    responsibilitiesEn: [
      "Wi-Fi troubleshooting (RMIT-University network credentials)",
      "Canvas LMS login and submission issue diagnostics",
      "Student email (Outlook) and Multi-Factor Authentication (MFA) resets",
      "Licensed software distribution (Adobe CC, MS Office 365, MATLAB)"
    ],
    responsibilitiesVi: [
      "Khắc phục sự cố kết nối mạng Wi-Fi RMIT",
      "Xử lý lỗi đăng nhập và nộp bài trên Canvas LMS",
      "Khôi phục email sinh viên và đặt lại xác thực 2 lớp (MFA)",
      "Cấp bản quyền phần mềm học tập (Adobe CC, MS Office 365, MATLAB)"
    ],
    typicalEnquiriesEn: [
      "My student account is locked or password expired.",
      "How do I set up RMIT Wi-Fi on my laptop or mobile phone?",
      "Why am I unable to access my Canvas courses?",
      "How can I install the free Adobe Creative Cloud package?"
    ],
    typicalEnquiriesVi: [
      "Tài khoản sinh viên bị khóa hoặc hết hạn mật khẩu.",
      "Cách cài đặt mạng Wi-Fi trường trên laptop và điện thoại?",
      "Tại sao tôi không thấy môn học trên Canvas?",
      "Cách kích hoạt bộ Adobe Creative Cloud miễn phí?"
    ],
    email: "ITServiceDesk@rmit.edu.vn",
    phone: "+84 28 3776 1313",
    formUrl: "https://www.rmit.edu.vn/students/support/it-support",
    websiteUrl: "https://www.rmit.edu.vn/students/support/it-support",
    campus: "all",
    locationEn: "Saigon South: Building 1, Level 3 | Hanoi: IT Counter, Level 1",
    locationVi: "Nam Sài Gòn: Tòa nhà 1, Tầng 3 | Hà Nội: Quầy IT, Tầng 1",
    serviceHoursEn: "Monday - Friday: 8:00 AM - 5:30 PM",
    serviceHoursVi: "Thứ Hai - Thứ Sáu: 8:00 - 17:30",
    lastVerifiedDate: "2026-10-25"
  },
  {
    id: "dept-library",
    nameEn: "RMIT Vietnam Library",
    nameVi: "Thư viện RMIT Việt Nam",
    category: "academic",
    descriptionEn: "Research discovery, physical books, digital databases (IEEE, Scopus, ProQuest), and bookable study rooms.",
    descriptionVi: "Tra cứu tài liệu học thuật, mượn sách giấy, cơ sở dữ liệu số (IEEE, Scopus, ProQuest) và đặt phòng học nhóm.",
    responsibilitiesEn: [
      "Physical book lending and inter-library requests",
      "Digital academic database access and proxy support",
      "Research consultations and referencing style guidance (APA, Harvard)",
      "Management of quiet study zones and collaborative rooms"
    ],
    responsibilitiesVi: [
      "Mượn trả sách giấy và đặt sách luân chuyển giữa các cơ sở",
      "Cung cấp quyền truy cập cơ sở dữ liệu học thuật quốc tế",
      "Tư vấn kỹ năng nghiên cứu và hướng dẫn trích dẫn chuẩn (APA, Harvard)",
      "Quản lý khu tự học yên tĩnh và hệ thống phòng học nhóm"
    ],
    typicalEnquiriesEn: [
      "How do I book a group study room?",
      "Where can I find peer-reviewed papers for my assessment?",
      "How do I extend my borrowed book due date?",
      "Can a librarian review my bibliography referencing?"
    ],
    typicalEnquiriesVi: [
      "Làm sao để đặt phòng thảo luận nhóm?",
      "Tìm bài báo học thuật bình duyệt (peer-reviewed) ở đâu?",
      "Cách gia hạn thời gian mượn sách?",
      "Thủ thư có hỗ trợ kiểm tra định dạng danh mục tài liệu tham khảo không?"
    ],
    email: "library@rmit.edu.vn",
    phone: "+84 28 3776 1300",
    formUrl: "https://www.rmit.edu.vn/students/support/library-services",
    websiteUrl: "https://www.rmit.edu.vn/students/support/library-services",
    campus: "all",
    locationEn: "Saigon South: Building 1, Levels 1-3 | Hanoi: Handi Resco, Level 2",
    locationVi: "Nam Sài Gòn: Tòa nhà 1, Tầng 1-3 | Hà Nội: Tòa nhà Handi Resco, Tầng 2",
    serviceHoursEn: "Semester: Mon - Fri 8:00 AM - 9:00 PM | Sat 9:00 AM - 5:00 PM",
    serviceHoursVi: "Trong kỳ: T2 - T6 8:00 - 21:00 | T7 9:00 - 17:00",
    lastVerifiedDate: "2026-10-19"
  },
  {
    id: "dept-finance",
    nameEn: "Tuition & Finance Office",
    nameVi: "Phòng Tài chính & Học phí",
    category: "administrative",
    descriptionEn: "Handles student fee invoices, payment processing, payment receipts, refund policies, and financial clearance.",
    descriptionVi: "Quản lý phát hành hóa đơn học phí, xác nhận thanh toán, hoàn trả học phí và xử lý gỡ chặn tài chính.",
    responsibilitiesEn: [
      "Semester tuition fee statements and tax invoice generation",
      "Verification of bank transfers and international Flywire transactions",
      "Refund requests for dropped courses before Census Date",
      "Resolution of financial holds on student portal accounts"
    ],
    responsibilitiesVi: [
      "Phát hành bảng kê học phí và hóa đơn điện tử từng học kỳ",
      "Xác nhận đối soát chuyển khoản ngân hàng và cổng quốc tế Flywire",
      "Tiếp nhận và xử lý yêu cầu hoàn học phí khi hủy môn trước Census Date",
      "Gỡ lệnh chặn học vụ do nợ học phí sau khi hoàn tất nộp tiền"
    ],
    typicalEnquiriesEn: [
      "I made a bank transfer yesterday; why is my financial hold not lifted?",
      "How do I request an official VAT e-invoice under my company name?",
      "Can I get a refund for a course dropped prior to Census Date?",
      "What are the payment deadlines for Semester 1, 2, and 3?"
    ],
    typicalEnquiriesVi: [
      "Tôi đã chuyển khoản hôm qua, tại sao tài khoản vẫn bị chặn học vụ?",
      "Làm sao để xuất hóa đơn đỏ (VAT) theo tên công ty của phụ huynh?",
      "Thủ tục hoàn tiền khi hủy môn học trước ngày Census Date?",
      "Hạn chót thanh toán học phí các kỳ trong năm là ngày nào?"
    ],
    email: "student.connect@rmit.edu.vn",
    phone: "+84 28 3776 1300",
    formUrl: "https://www.rmit.edu.vn/vi/hoc-tap-tai-rmit/hoc-phi",
    websiteUrl: "https://www.rmit.edu.vn/vi/hoc-tap-tai-rmit/hoc-phi",
    campus: "all",
    locationEn: "Building 1 Ground Floor (coordinated via Student Connect)",
    locationVi: "Tòa nhà 1 Tầng trệt (tiếp nhận qua quầy Student Connect)",
    serviceHoursEn: "Monday - Friday: 8:30 AM - 5:00 PM",
    serviceHoursVi: "Thứ Hai - Thứ Sáu: 8:30 - 17:00",
    lastVerifiedDate: "2026-10-15"
  },
  {
    id: "dept-scholarships",
    nameEn: "Scholarships Department",
    nameVi: "Bộ phận Học bổng",
    category: "specialized",
    descriptionEn: "Coordinates university-wide scholarships, applications, renewal GPA verifications, and financial aid grants.",
    descriptionVi: "Phụ trách các chương trình học bổng toàn trường, xét duyệt hồ sơ, kiểm tra điều kiện duy trì GPA và trợ cấp học tập.",
    responsibilitiesEn: [
      "Administration of Vice-Chancellor's and Academic Merit scholarships",
      "Eligibility review for prospective and current students",
      "Semester GPA audit for active scholarship recipients",
      "Announcements and interview coordination for shortlisted candidates"
    ],
    responsibilitiesVi: [
      "Quản lý học bổng Hiệu trưởng và học bổng Thành tích học tập",
      "Thẩm định điều kiện hồ sơ ứng tuyển sinh viên mới và sinh viên hiện tại",
      "Kiểm tra duy trì mức GPA tối thiểu mỗi kỳ của sinh viên nhận học bổng",
      "Thông báo kết quả và tổ chức các vòng phỏng vấn học bổng"
    ],
    typicalEnquiriesEn: [
      "What is the minimum GPA needed to maintain my scholarship?",
      "When is the next scholarship application window for current students?",
      "Are scholarship holders eligible to apply for exchange in Melbourne?",
      "How do I submit supporting certificates for my application?"
    ],
    typicalEnquiriesVi: [
      "Cần duy trì mức GPA bao nhiêu để không bị mất học bổng?",
      "Đợt nộp học bổng tiếp theo dành cho sinh viên đang học là khi nào?",
      "Sinh viên có học bổng có được đăng ký đi trao đổi tại Melbourne không?",
      "Cách nộp bổ sung chứng chỉ và giấy khen trong hồ sơ xét duyệt?"
    ],
    email: "scholarships@rmit.edu.vn",
    phone: "+84 28 3776 1300",
    formUrl: "https://www.rmit.edu.vn/vi/hoc-tap-tai-rmit/hoc-bong",
    websiteUrl: "https://www.rmit.edu.vn/vi/hoc-tap-tai-rmit/hoc-bong",
    campus: "all",
    locationEn: "Saigon South & Hanoi Admissions / Student Central offices",
    locationVi: "Văn phòng Tuyển sinh và Quản lý sinh viên tại Nam Sài Gòn & Hà Nội",
    serviceHoursEn: "Monday - Friday: 8:30 AM - 5:00 PM",
    serviceHoursVi: "Thứ Hai - Thứ Sáu: 8:30 - 17:00",
    lastVerifiedDate: "2026-10-18"
  },
  {
    id: "dept-wellbeing",
    nameEn: "Student Wellbeing & Equitable Learning",
    nameVi: "Chăm sóc Sức khỏe Tinh thần & Dịch vụ Học tập Hòa nhập",
    category: "support",
    descriptionEn: "Free confidential psychological counseling, mental wellness workshops, and accessibility accommodations.",
    descriptionVi: "Tư vấn tâm lý chuyên nghiệp hoàn toàn bảo mật, hội thảo sức khỏe tinh thần và hỗ trợ sinh viên hòa nhập.",
    responsibilitiesEn: [
      "1-on-1 private counseling sessions with qualified psychologists",
      "Equitable Learning Plans (ELP) for chronic or temporary medical conditions",
      "Special examination adjustments and accessibility assistance",
      "Crisis intervention and student mental health workshops"
    ],
    responsibilitiesVi: [
      "Tham vấn tâm lý 1-1 riêng tư cùng chuyên gia tâm lý học",
      "Lập Kế hoạch Học tập Hòa nhập (ELP) cho sinh viên có vấn đề sức khỏe",
      "Sắp xếp điều chỉnh phòng thi riêng và hỗ trợ công cụ học tập đặc thù",
      "Can thiệp khủng hoảng tâm lý và tổ chức các chuyên đề sức khỏe tinh thần"
    ],
    typicalEnquiriesEn: [
      "How do I book a private counseling appointment?",
      "Is my counseling session confidential from my lecturers and family?",
      "How can I obtain an Equitable Learning Plan for exam accommodations?",
      "Who can I contact if I am experiencing an overwhelming emotional crisis?"
    ],
    typicalEnquiriesVi: [
      "Làm sao để đặt lịch hẹn tham vấn tâm lý riêng?",
      "Nội dung tư vấn có được bảo mật với giảng viên và phụ huynh không?",
      "Làm sao để lập kế hoạch ELP khi có chấn thương hoặc bệnh cần hỗ trợ thi?",
      "Cần liên hệ ai khi gặp khủng hoảng tinh thần khẩn cấp?"
    ],
    email: "wellbeing@rmit.edu.vn",
    phone: "+84 28 3776 1300",
    formUrl: "https://www.rmit.edu.vn/student-life/support-services/wellbeing",
    websiteUrl: "https://www.rmit.edu.vn/student-life/support-services/wellbeing",
    campus: "all",
    locationEn: "Saigon South: Building 1 Level 3 (Private Suite) | Hanoi: Level 3",
    locationVi: "Nam Sài Gòn: Tòa nhà 1 Tầng 3 (Khu vực riêng) | Hà Nội: Tầng 3",
    serviceHoursEn: "Monday - Friday: 9:00 AM - 5:00 PM (Confidential by appointment)",
    serviceHoursVi: "Thứ Hai - Thứ Sáu: 9:00 - 17:00 (Bảo mật theo lịch hẹn)",
    lastVerifiedDate: "2026-10-21"
  },
  {
    id: "dept-exchange",
    nameEn: "Global Experience Office (International Mobility & Transfer)",
    nameVi: "Văn phòng Trải nghiệm Toàn cầu (Global Experience)",
    category: "specialized",
    descriptionEn: "Guides students through cross-campus transfers to RMIT Melbourne, study abroad, and partner university exchange.",
    descriptionVi: "Hướng dẫn sinh viên chương trình chuyển tiếp sang RMIT Melbourne, du học hè và trao đổi sinh viên quốc tế.",
    responsibilitiesEn: [
      "Advising on RMIT Melbourne cross-campus study options (transfer@rmit.edu.vn)",
      "Coordination of semester-based international exchange applications (mobility@rmit.edu.vn)",
      "Course mapping and academic approval coordination with program managers",
      "Pre-departure visa guidance and overseas briefing sessions"
    ],
    responsibilitiesVi: [
      "Tư vấn lộ trình chuyển tiếp cơ sở sang RMIT Melbourne (transfer@rmit.edu.vn)",
      "Điều phối và tiếp nhận hồ sơ trao đổi sinh viên tại các đại học đối tác (mobility@rmit.edu.vn)",
      "Hỗ trợ quy đổi môn học tương đương với Trưởng ngành",
      "Hướng dẫn thủ tục visa du học và tổ chức các buổi chuẩn bị trước khi lên đường"
    ],
    typicalEnquiriesEn: [
      "What is the GPA requirement to study 1 year at RMIT Melbourne?",
      "Do I pay Vietnam tuition or Australia tuition when studying in Melbourne?",
      "When are application deadlines for Semester 1 and Semester 2 abroad?",
      "How do I verify which Melbourne courses match my program structure?"
    ],
    typicalEnquiriesVi: [
      "Cần GPA bao nhiêu để được chuyển tiếp 1 năm sang RMIT Melbourne?",
      "Khi sang Melbourne học tôi đóng học phí theo mức Việt Nam hay Úc?",
      "Hạn nộp hồ sơ du học trao đổi cho kỳ 1 và kỳ 2 là khi nào?",
      "Làm sao để biết môn học bên Melbourne tương đương với môn nào ở Việt Nam?"
    ],
    email: "mobility@rmit.edu.vn",
    phone: "+84 28 3776 1494",
    formUrl: "https://www.rmit.edu.vn/students/work-and-study-opportunities/global-experience-programs",
    websiteUrl: "https://www.rmit.edu.vn/students/work-and-study-opportunities/global-experience-programs",
    campus: "all",
    locationEn: "Saigon South: Room 1.3.08 | Hanoi: Room 1.1.006 (Handi Resco)",
    locationVi: "Nam Sài Gòn: Phòng 1.3.08 | Hà Nội: Phòng 1.1.006 (Handi Resco)",
    serviceHoursEn: "Monday - Friday: 9:00 AM - 5:00 PM",
    serviceHoursVi: "Thứ Hai - Thứ Sáu: 9:00 - 17:00",
    lastVerifiedDate: "2026-10-30"
  },
  {
    id: "dept-careers",
    nameEn: "Careers, Alumni & Industry Relations",
    nameVi: "Trung tâm Hướng nghiệp & Quan hệ Doanh nghiệp",
    category: "support",
    descriptionEn: "Internship placement support, resume/CV reviews, mock interviews, career expos, and on-campus recruitment.",
    descriptionVi: "Hỗ trợ kết nối thực tập, sửa CV, phỏng vấn thử, tổ chức ngày hội việc làm và tuyển dụng tại trường.",
    responsibilitiesEn: [
      "1-on-1 resume, portfolio, and LinkedIn profile consultations",
      "Career Hub job portal management and internship postings",
      "Annual RMIT Career Fair and industry networking nights",
      "Work-Integrated Learning (WIL) compliance and internship tracking"
    ],
    responsibilitiesVi: [
      "Tư vấn 1-1 tối ưu hồ sơ xin việc (CV), portfolio và hồ sơ LinkedIn",
      "Vận hành cổng thông tin việc làm Career Hub và đăng tin thực tập",
      "Tổ chức Ngày hội Việc làm RMIT thường niên và các buổi giao lưu doanh nghiệp",
      "Quản lý môn học thực tập thực tế (Work-Integrated Learning - WIL)"
    ],
    typicalEnquiriesEn: [
      "Can an advisor critique my resume before I apply for an internship?",
      "How do I register for the upcoming Career Expo on campus?",
      "What are the criteria for my internship to count towards WIL credits?",
      "Where can I find vetted employer listings for RMIT students?"
    ],
    typicalEnquiriesVi: [
      "Tôi có thể nhờ cố vấn xem và sửa CV trước khi nộp thực tập không?",
      "Cách đăng ký tham gia Ngày hội Việc làm tại trường?",
      "Điều kiện để kỳ thực tập được công nhận tín chỉ môn WIL?",
      "Tìm danh sách các doanh nghiệp đối tác tuyển dụng của RMIT ở đâu?"
    ],
    email: "career.centre@rmit.edu.vn",
    phone: "+84 28 3776 1300",
    formUrl: "https://www.rmit.edu.vn/students/work-and-study-opportunities/career-opportunities",
    websiteUrl: "https://www.rmit.edu.vn/students/work-and-study-opportunities/career-opportunities",
    campus: "all",
    locationEn: "Saigon South: Building 2, Ground Floor | Hanoi: Level 1",
    locationVi: "Nam Sài Gòn: Tòa nhà 2, Tầng trệt | Hà Nội: Tầng 1",
    serviceHoursEn: "Monday - Friday: 8:30 AM - 5:00 PM",
    serviceHoursVi: "Thứ Hai - Thứ Sáu: 8:30 - 17:00",
    lastVerifiedDate: "2026-10-17"
  }
];
