import { KnowledgeDocument } from "./schema";

export const KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: "doc-change-major",
    slug: "how-to-change-major-program",
    titleEn: "How to Change Your Program or Major at RMIT Vietnam",
    titleVi: "Thủ tục chuyển ngành hoặc chương trình học tại RMIT Việt Nam",
    categoryId: "programs-majors",
    keywords: [
      "change major", "transfer program", "switch major", "change course",
      "doi nganh", "chuyen nganh", "chuyen chuong trinh", "thay doi nganh hoc",
      "gpa requirement", "internal transfer"
    ],
    synonymsEn: ["program transfer", "major transfer", "internal course transfer", "switch specialization"],
    synonymsVi: ["đổi ngành", "chuyển ngành", "thay đổi chuyên ngành", "chuyển khoa"],
    summaryEn: "To change your major or program at RMIT Vietnam, submit an Internal Program Transfer form to Student Connect before the semester application deadline. You must meet the entry requirements and minimum GPA for your destination program.",
    summaryVi: "Để đổi ngành hoặc chuyển chương trình học tại RMIT Việt Nam, bạn cần nộp đơn Chuyển ngành nội bộ (Internal Program Transfer) cho Student Connect trước thời hạn quy định. Bạn cần đáp ứng chuẩn đầu vào và mức GPA tối thiểu của ngành mới.",
    detailedGuidanceEn: "Program transfers are evaluated based on academic standing, GPA, and available places in the destination program. If approved, eligible completed courses are credited towards the new program. Always speak with an Academic Advisor before transferring.",
    detailedGuidanceVi: "Hồ sơ chuyển ngành được xét duyệt dựa trên điểm GPA hiện tại, kết quả học tập và số lượng chỉ tiêu còn lại của ngành muốn chuyển đến. Các môn đã học phù hợp sẽ được xét miễn giảm tín chỉ tương đương. Hãy trao đổi với Academic Advisor trước khi nộp đơn.",
    keyDetailsEn: [
      "Check minimum GPA requirements for your target discipline (Business, Design, Technology).",
      "Submit the Internal Program Transfer application via the Student Connect portal before the published deadline.",
      "Receive formal outcome before Census Date of the upcoming semester.",
      "Academic credits already achieved will be mapped where applicable."
    ],
    keyDetailsVi: [
      "Kiểm tra điều kiện GPA tối thiểu của ngành bạn muốn chuyển sang (Khối Kinh doanh, Thiết kế, Công nghệ).",
      "Nộp đơn xin chuyển chương trình nội bộ qua cổng Student Connect trước hạn chót.",
      "Kết quả chính thức sẽ được gửi trước ngày Census Date của học kỳ kế tiếp.",
      "Các tín chỉ đã hoàn thành sẽ được xem xét chuyển đổi tương đương nếu phù hợp."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/support/student-connect",
    sourceTitle: "RMIT Vietnam Student Connect - Program Enrolment & Transfers",
    departmentId: "dept-student-connect",
    campus: "all",
    lastVerifiedDate: "2026-10-15",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/rmit-sgs-campus-facilities/2015-campus-photos/rmit-sgs-b2-inside-12.jpg",
    relatedDocIds: ["doc-student-connect", "doc-enrolment-deadlines", "doc-credit-transfer"]
  },
  {
    id: "doc-student-connect",
    slug: "student-connect-support-channels",
    titleEn: "Student Connect: Official Support Channels & Locations",
    titleVi: "Student Connect: Kênh hỗ trợ chính thức và địa điểm",
    categoryId: "student-connect",
    keywords: [
      "student connect", "hotline", "email", "office", "desk", "counter",
      "support", "contact", "phong sinh vien", "hoc vu", "dia chi", "so dien thoai"
    ],
    synonymsEn: ["student central", "student enquiry hub", "student administration desk"],
    synonymsVi: ["phòng công tác sinh viên", "bàn hỗ trợ sinh viên", "trung tâm dịch vụ sinh viên"],
    summaryEn: "Student Connect is the single point of contact for all student administrative enquiries at RMIT Vietnam. Contact them via the online enquiry portal, official email, or in person on campus.",
    summaryVi: "Student Connect là đầu mối giải đáp và tiếp nhận toàn bộ các thủ tục hành chính sinh viên tại RMIT Việt Nam. Bạn có thể liên hệ qua cổng gửi yêu cầu trực tuyến, email chính thức hoặc trực tiếp tại quầy cơ sở.",
    detailedGuidanceEn: "Operating hours are Monday to Friday, 8:30 AM to 5:00 PM. Student Connect assists with student status letters, official transcripts, timetable adjustments, leaves of absence, and graduation advice.",
    detailedGuidanceVi: "Thời gian làm việc từ Thứ Hai đến Thứ Sáu, 8:30 sáng đến 5:00 chiều. Student Connect hỗ trợ cấp giấy xác nhận sinh viên, bảng điểm chính thức, điều chỉnh thời khóa biểu, bảo lưu và tư vấn tốt nghiệp.",
    keyDetailsEn: [
      "Saigon South Campus: Building 1, Ground Floor (near Main Entrance).",
      "Hanoi Campus: Handi Resco Building, 521 Kim Ma, Ba Dinh, Level 1.",
      "Official Email: student.connect@rmit.edu.vn",
      "Phone: +84 28 3776 1300 (Saigon) / +84 24 3726 1460 (Hanoi)."
    ],
    keyDetailsVi: [
      "Cơ sở Nam Sài Gòn: Tòa nhà 1, Tầng trệt (gần lối vào chính).",
      "Cơ sở Hà Nội: Tòa nhà Handi Resco, 521 Kim Mã, Ba Đình, Tầng 1.",
      "Email chính thức: student.connect@rmit.edu.vn",
      "Điện thoại: +84 28 3776 1300 (Sài Gòn) / +84 24 3726 1460 (Hà Nội)."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/support/student-connect",
    sourceTitle: "RMIT Vietnam Student Connect Contact & Services",
    departmentId: "dept-student-connect",
    campus: "all",
    lastVerifiedDate: "2026-10-20",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/current-students/student-council.jpg",
    relatedDocIds: ["doc-change-major", "doc-enrolment-deadlines"]
  },
  {
    id: "doc-scholarships-types",
    slug: "rmit-vietnam-scholarships-overview",
    titleEn: "RMIT Vietnam Scholarships: Eligibility & Application Procedures",
    titleVi: "Học bổng RMIT Việt Nam: Điều kiện & Quy trình ứng tuyển",
    categoryId: "scholarships",
    keywords: [
      "scholarship", "hoc bong", "vice chancellor", "merit", "financial aid",
      "gpa scholarship", "hoc bong toan phan", "hoc bong ban phan", "dieu kien hoc bong"
    ],
    synonymsEn: ["bursary", "merit grant", "financial award", "tuition discount"],
    synonymsVi: ["học bổng", "học bổng toàn phần", "học bổng hiệu trưởng", "trợ cấp học phí"],
    summaryEn: "RMIT Vietnam offers numerous scholarship categories covering 25% to 100% of tuition fees, including Vice-Chancellor's Scholarships, Academic Excellence, and Discipline-Specific Awards.",
    summaryVi: "RMIT Việt Nam cấp nhiều hạng mục học bổng từ 25% đến 100% học phí, bao gồm Học bổng Hiệu trưởng, Học bổng Thành tích Học thuật xuất sắc và các học bổng theo chuyên ngành.",
    detailedGuidanceEn: "Applications usually open twice a year. Criteria include stellar academic performance, leadership evidence, community impact, and personal statement. Maintaining a scholarship requires keeping a minimum semester GPA (typically 3.0 or higher).",
    detailedGuidanceVi: "Các đợt xét tuyển học bổng mở định kỳ trong năm. Tiêu chí bao gồm thành tích học tập vượt trội, năng lực lãnh đạo, đóng góp cộng đồng và bài luận cá nhân. Để duy trì học bổng, sinh viên phải giữ mức GPA tối thiểu theo quy định mỗi kỳ (thường từ 3.0/4.0 trở lên).",
    keyDetailsEn: [
      "Vice-Chancellor's Scholars: 100% tuition for outstanding holistic student leaders.",
      "Academic Merit: 25% - 50% tuition deduction for top performers.",
      "Requirements: Valid English certificate (IELTS/equivalent), academic transcripts, portfolio/video submission.",
      "Deadlines: Check the official RMIT Vietnam scholarships portal for exact semester cut-off dates."
    ],
    keyDetailsVi: [
      "Học bổng Hiệu trưởng: 100% học phí cho sinh viên xuất sắc toàn diện.",
      "Học bổng Thành tích học thuật: Miễn giảm 25% - 50% học phí cho sinh viên có GPA cao.",
      "Hồ sơ bao gồm: Chứng chỉ tiếng Anh hợp lệ, học bạ/bảng điểm, bài luận và video/portfolio minh chứng.",
      "Hạn chót: Xem ngày chính xác trên cổng thông tin học bổng chính thức của trường."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/vi/hoc-tap-tai-rmit/hoc-bong",
    sourceTitle: "RMIT Vietnam Official Scholarships Directory",
    departmentId: "dept-scholarships",
    campus: "all",
    lastVerifiedDate: "2026-10-18",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/rmit-hanoi-campus-facilities/rmit-hanoi-campus-facilities-06.jpg",
    relatedDocIds: ["doc-tuition-payment", "doc-student-connect"]
  },
  {
    id: "doc-scholarship-vice-chancellor",
    slug: "rmit-vice-chancellor-scholarship",
    titleEn: "RMIT Vice-Chancellor's Scholarship",
    titleVi: "Học bổng Hiệu trưởng RMIT",
    categoryId: "scholarships",
    keywords: ["vice chancellor scholarship", "full scholarship", "100% tuition", "hoc bong hieu truong", "hoc bong toan phan"],
    synonymsEn: ["RMIT full tuition scholarship", "leadership scholarship"],
    synonymsVi: ["học bổng toàn phần RMIT", "học bổng lãnh đạo"],
    summaryEn: "The Vice-Chancellor's Scholarship is listed by RMIT Vietnam as a 100% tuition scholarship for outstanding holistic student leaders.",
    summaryVi: "Học bổng Hiệu trưởng được RMIT Việt Nam giới thiệu là học bổng 100% học phí dành cho sinh viên xuất sắc toàn diện và có tố chất lãnh đạo.",
    detailedGuidanceEn: "Review the official scholarship directory for the current intake, eligibility rules, required English evidence, academic records, portfolio or video requirements, and submission deadline.",
    detailedGuidanceVi: "Hãy xem cổng thông tin học bổng chính thức để kiểm tra đợt tuyển hiện tại, điều kiện, minh chứng tiếng Anh, bảng điểm, portfolio hoặc video và hạn nộp hồ sơ.",
    keyDetailsEn: [
      "Coverage: 100% tuition according to the curated RMIT record.",
      "Profile: Outstanding holistic student leaders.",
      "Documents: English evidence, academic transcripts, and supporting portfolio or video may be required.",
      "Always confirm the current intake details on the official scholarship directory."
    ],
    keyDetailsVi: [
      "Mức hỗ trợ: 100% học phí theo bản ghi RMIT đã xác minh.",
      "Đối tượng: Sinh viên có thành tích nổi bật và tố chất lãnh đạo toàn diện.",
      "Hồ sơ: Có thể cần chứng chỉ tiếng Anh, bảng điểm và portfolio hoặc video minh chứng.",
      "Luôn đối chiếu đợt tuyển hiện tại trên cổng học bổng chính thức."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/vi/hoc-tap-tai-rmit/hoc-bong",
    sourceTitle: "RMIT Vietnam Official Scholarships Directory",
    departmentId: "dept-scholarships",
    campus: "all",
    lastVerifiedDate: "2026-10-18",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/career-fair-2022.jpg",
    relatedDocIds: ["doc-scholarships-types"]
  },
  {
    id: "doc-scholarship-academic-merit",
    slug: "rmit-academic-merit-scholarship",
    titleEn: "RMIT Academic Merit Scholarship",
    titleVi: "Học bổng Thành tích học thuật RMIT",
    categoryId: "scholarships",
    keywords: ["academic merit scholarship", "25% scholarship", "50% scholarship", "hoc bong thanh tich hoc thuat", "gpa hoc bong"],
    synonymsEn: ["academic excellence scholarship", "GPA scholarship"],
    synonymsVi: ["học bổng GPA", "học bổng thành tích"],
    summaryEn: "RMIT Vietnam's curated scholarship record describes Academic Merit awards as 25%–50% tuition deductions for high-performing students.",
    summaryVi: "Bản ghi học bổng RMIT Việt Nam mô tả Học bổng Thành tích học thuật là mức miễn giảm 25%–50% học phí dành cho sinh viên có thành tích cao.",
    detailedGuidanceEn: "Check the official scholarship portal for the current GPA threshold, intake deadline, English requirements, and documents. Scholarship continuation requirements can apply each semester.",
    detailedGuidanceVi: "Kiểm tra cổng học bổng chính thức để biết ngưỡng GPA, hạn nộp, yêu cầu tiếng Anh và hồ sơ của đợt hiện tại. Học bổng có thể có điều kiện duy trì theo từng học kỳ.",
    keyDetailsEn: [
      "Coverage: 25%–50% tuition deduction according to the curated RMIT record.",
      "Selection: Academic performance and the current published criteria.",
      "Documents: Academic transcripts and valid English evidence may be required.",
      "Confirm the exact semester cut-off date on the official portal."
    ],
    keyDetailsVi: [
      "Mức hỗ trợ: Miễn giảm 25%–50% học phí theo bản ghi RMIT đã xác minh.",
      "Xét duyệt: Thành tích học tập và tiêu chí được công bố cho từng đợt.",
      "Hồ sơ: Có thể cần bảng điểm và chứng chỉ tiếng Anh hợp lệ.",
      "Xem hạn nộp chính xác của từng học kỳ trên cổng chính thức."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/vi/hoc-tap-tai-rmit/hoc-bong",
    sourceTitle: "RMIT Vietnam Official Scholarships Directory",
    departmentId: "dept-scholarships",
    campus: "all",
    lastVerifiedDate: "2026-10-18",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/rmit-sgs-campus-facilities/2015-campus-photos/rmit-sgs-b2-inside-12.jpg",
    relatedDocIds: ["doc-scholarships-types"]
  },
  {
    id: "doc-scholarship-discipline-awards",
    slug: "rmit-discipline-specific-scholarships",
    titleEn: "RMIT Discipline-Specific Scholarships",
    titleVi: "Học bổng theo chuyên ngành RMIT",
    categoryId: "scholarships",
    keywords: ["discipline specific scholarship", "program scholarship", "major scholarship", "hoc bong chuyen nganh", "hoc bong theo nganh"],
    synonymsEn: ["subject scholarship", "program-specific award"],
    synonymsVi: ["học bổng theo ngành", "học bổng chương trình"],
    summaryEn: "RMIT Vietnam's scholarship overview includes discipline-specific awards alongside Vice-Chancellor's and Academic Merit scholarships.",
    summaryVi: "Tổng quan học bổng RMIT Việt Nam bao gồm các học bổng theo chuyên ngành bên cạnh học bổng Hiệu trưởng và Thành tích học thuật.",
    detailedGuidanceEn: "Use the official scholarship directory to check whether your intended program has a current discipline-specific award. Do not assume an award applies to every program or campus.",
    detailedGuidanceVi: "Tra cứu cổng học bổng chính thức để kiểm tra chương trình của bạn có học bổng theo chuyên ngành trong đợt hiện tại hay không. Không mặc định học bổng áp dụng cho mọi chương trình hoặc cơ sở.",
    keyDetailsEn: [
      "Availability: Program and intake specific.",
      "Eligibility: Follow the criteria published for the relevant discipline.",
      "Application: Use the official RMIT scholarship channel for the current cycle.",
      "Confirm coverage, deadline, and continuation rules before applying."
    ],
    keyDetailsVi: [
      "Phạm vi: Phụ thuộc chương trình và đợt tuyển.",
      "Điều kiện: Theo tiêu chí được công bố cho từng chuyên ngành.",
      "Ứng tuyển: Sử dụng kênh học bổng chính thức của RMIT cho đợt hiện tại.",
      "Xác nhận mức hỗ trợ, hạn nộp và điều kiện duy trì trước khi nộp."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/vi/hoc-tap-tai-rmit/hoc-bong",
    sourceTitle: "RMIT Vietnam Official Scholarships Directory",
    departmentId: "dept-scholarships",
    campus: "all",
    lastVerifiedDate: "2026-10-18",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/student-activities-01.jpg",
    relatedDocIds: ["doc-scholarships-types"]
  },
  {
    id: "doc-tuition-payment",
    slug: "tuition-fees-payment-methods-deadlines",
    titleEn: "Tuition Fees: Payment Methods, Invoices & Due Dates",
    titleVi: "Học phí RMIT: Phương thức thanh toán, Hóa đơn & Hạn nộp",
    categoryId: "tuition-fees",
    keywords: [
      "tuition", "hoc phi", "payment", "thanh toan", "invoice", "hoa don",
      "bank transfer", "chuyen khoan", "due date", "financial hold", "chan hoc vu"
    ],
    synonymsEn: ["student fees", "course payment", "fee statement", "tuition invoice"],
    synonymsVi: ["học phí", "đóng tiền học", "hóa đơn học phí", "chuyển khoản học phí"],
    summaryEn: "Tuition fees must be paid before the invoice due date each semester. Payments can be made via local bank transfer, Flywire for international transfers, or designated payment gateways.",
    summaryVi: "Học phí phải được thanh toán trước ngày hết hạn trên hóa đơn học phí của từng học kỳ. Sinh viên có thể nộp qua chuyển khoản ngân hàng nội địa, cổng quốc tế Flywire hoặc cổng thanh toán chính thức.",
    detailedGuidanceEn: "Invoices are available on the Student Online portal after course enrolment. Missing the payment deadline incurs late payment fees or a financial block preventing Canvas and timetable access.",
    detailedGuidanceVi: "Hóa đơn được phát hành trên cổng trực tuyến sau khi hoàn tất đăng ký môn. Nếu không thanh toán đúng hạn, sinh viên có thể bị phạt phí trễ hạn hoặc bị áp dụng biện pháp chặn học vụ (financial hold) khiến không vào được Canvas và thời khóa biểu.",
    keyDetailsEn: [
      "View invoice: Log in to RMIT Student Portal -> Financial Information.",
      "Payment description: Must specify Student ID (sXXXXXXX) + Full Name.",
      "Deadlines: Stated clearly on each semester's tuition statement.",
      "Assistance: Contact the Finance and Tuition department via Student Connect."
    ],
    keyDetailsVi: [
      "Tra cứu hóa đơn: Đăng nhập Cổng sinh viên RMIT -> Mục Tài chính (Financial Information).",
      "Cú pháp chuyển khoản: Bắt buộc ghi rõ Mã sinh viên (sXXXXXXX) + Họ và tên.",
      "Hạn thanh toán: Được ghi cụ thể trên từng hóa đơn phát hành đầu kỳ.",
      "Hỗ trợ: Liên hệ Bộ phận Học phí & Tài chính qua cổng Student Connect."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/vi/hoc-tap-tai-rmit/hoc-phi",
    sourceTitle: "RMIT Vietnam Tuition Fees and Payment Guide",
    departmentId: "dept-finance",
    campus: "all",
    lastVerifiedDate: "2026-10-12",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/career-fair-2022.jpg",
    relatedDocIds: ["doc-scholarships-types", "doc-enrolment-deadlines"]
  },
  {
    id: "doc-enrolment-deadlines",
    slug: "course-enrolment-census-date",
    titleEn: "Course Enrolment, Add/Drop Timelines and Census Date",
    titleVi: "Quy trình đăng ký môn học, Thêm/Hủy môn và Census Date",
    categoryId: "enrolment",
    keywords: [
      "enrolment", "census date", "add drop", "dang ky mon", "huy mon",
      "rut mon", "timetable", "thoi khoa bieu", "han chot", "hoc ky"
    ],
    synonymsEn: ["class registration", "subject enrol", "drop course", "course withdrawal"],
    synonymsVi: ["đăng ký tín chỉ", "đăng ký lớp", "rút môn học", "thêm bớt môn"],
    summaryEn: "Enrolment opens prior to each semester according to student cohort groups. The Census Date is the final deadline to add, drop, or withdraw from courses without academic or financial penalty.",
    summaryVi: "Cổng đăng ký môn mở trước mỗi học kỳ theo từng đợt sinh viên. Ngày Census Date là thời hạn chót cuối cùng để thêm, hủy hoặc rút môn mà không bị phạt học phí hay ảnh hưởng điểm học bạ.",
    detailedGuidanceEn: "Dropping a course before Census Date results in zero financial penalty and no course mention on academic records. Withdrawing after Census Date results in full fee liability and a 'Withdrawal' grade unless special consideration is approved.",
    detailedGuidanceVi: "Hủy môn trước Census Date sẽ được hoàn lại 100% học phí môn đó và không ghi nhận trên bảng điểm. Rút môn sau Census Date sẽ không được hoàn học phí và nhận điểm 'W' (Withdrawn) trừ khi có đơn xem xét hoàn cảnh đặc biệt.",
    keyDetailsEn: [
      "Check enrolment dates in myTimetable and the official RMIT Academic Calendar.",
      "Complete Course Enrolment Online (CEO) before classes begin.",
      "Census Date: Usually week 3 or 4 of each standard semester.",
      "Prerequisites: Ensure all prerequisite courses have passed before enrolling."
    ],
    keyDetailsVi: [
      "Kiểm tra lịch mở cổng đăng ký trên myTimetable và Lịch Học vụ RMIT.",
      "Hoàn thành đăng ký môn học trực tuyến (CEO) trước khi kỳ học bắt đầu.",
      "Census Date: Thường rơi vào cuối tuần 3 hoặc tuần 4 của kỳ học tiêu chuẩn.",
      "Môn tiên quyết: Đảm bảo đã hoàn thành các môn điều kiện trước khi đăng ký môn nâng cao."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/my-studies/enrolment",
    sourceTitle: "RMIT Vietnam Enrolment & Timetable Procedures",
    departmentId: "dept-student-connect",
    campus: "all",
    lastVerifiedDate: "2026-10-22",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/headers/rmit-events-home-header.jpg",
    relatedDocIds: ["doc-academic-calendar", "doc-change-major"]
  },
  {
    id: "doc-academic-calendar",
    slug: "academic-calendar-semesters-dates",
    titleEn: "RMIT Vietnam Academic Calendar: Semesters, Exams & Holidays",
    titleVi: "Lịch học vụ RMIT Việt Nam: Các kỳ học, Lịch thi & Nghỉ lễ",
    categoryId: "academic-calendar",
    keywords: [
      "calendar", "lich hoc", "lich hoc ki nay", "hoc ky nay", "semester 3", "semester 1", "semester 2",
      "census date", "exam period", "tet holiday", "nghi le", "lich thi", "hoc ky 1", "hoc ky 2", "hoc ky 3",
      "lich hoc vu", "han dong hoc phi", "add drop date"
    ],
    synonymsEn: ["current semester schedule", "academic calendar 2026", "term dates", "semester dates"],
    synonymsVi: ["lịch học kỳ này", "thời gian học kỳ 3", "lịch thi cử", "hạn nộp học phí kỳ này"],
    summaryEn: "RMIT Vietnam operates on a 3-semester calendar per year. Currently in Semester 3, 2026 (commencing 26 October 2026 through 23 January 2027), followed by the assessment and exam period.",
    summaryVi: "RMIT Việt Nam hoạt động theo 3 học kỳ/năm. Hiện tại trường đang trong Học kỳ 3 năm 2026 (bắt đầu từ ngày 26/10/2026 đến ngày 23/01/2027), tiếp theo là tuần ôn tập và kỳ thi học kỳ.",
    detailedGuidanceEn: "Detailed semester milestone schedule:\n• Teaching Commences: Monday, 26 October 2026\n• Last date to add classes: Friday, 6 November 2026 (End of Week 2)\n• Tuition Fee Payment Deadline: Friday, 13 November 2026 (End of Week 3)\n• Census Date (Final date to drop courses without financial/academic penalty): Friday, 20 November 2026 (Week 4)\n• Teaching Concludes: Saturday, 23 January 2027\n• Assessment & Final Exam Period: 25 January 2027 - 06 February 2027\n• Vietnam Lunar New Year (Tet Holiday): 08 February 2027 - 21 February 2027\n• Next Semester (Semester 1, 2027): Commences 01 March 2027.",
    detailedGuidanceVi: "Các mốc thời gian chi tiết của Học kỳ 3 năm 2026 (Học kỳ hiện tại):\n• Bắt đầu tuần học 1: Thứ Hai, ngày 26/10/2026\n• Hạn chót thêm môn (Add classes): Thứ Sáu, ngày 06/11/2026 (Cuối tuần 2)\n• Hạn chót đóng học phí kỳ 3: Thứ Sáu, ngày 13/11/2026 (Cuối tuần 3)\n• Census Date (Hạn chót rút môn không mất học phí và không ghi học bạ): Thứ Sáu, ngày 20/11/2026 (Tuần 4)\n• Kết thúc 12 tuần học: Thứ Bảy, ngày 23/01/2027\n• Tuần ôn tập và Lịch thi học kỳ: 25/01/2027 - 06/02/2027\n• Nghỉ Tết Nguyên Đán: 08/02/2027 - 21/02/2027\n• Học kỳ tiếp theo (Học kỳ 1 năm 2027): Bắt đầu từ 01/03/2027.",
    keyDetailsEn: [
      "Current Semester (Semester 3, 2026): 26 October 2026 to 23 January 2027.",
      "Census Date: Friday, 20 November 2026 (Final cut-off to withdraw without fee penalty).",
      "Tuition Payment Due Date: Friday, 13 November 2026.",
      "Final Assessment & Exam Window: 25 January 2027 to 06 February 2027.",
      "Upcoming Semester (Semester 1, 2027): Starts on Monday, 01 March 2027."
    ],
    keyDetailsVi: [
      "Học kỳ hiện tại (Học kỳ 3, 2026): Bắt đầu từ ngày 26/10/2026 đến ngày 23/01/2027.",
      "Census Date (Hạn chót rút môn): Thứ Sáu, ngày 20/11/2026.",
      "Hạn chót thanh toán học phí: Thứ Sáu, ngày 13/11/2026.",
      "Thời gian thi cuối kỳ: Từ ngày 25/01/2027 đến ngày 06/02/2027.",
      "Học kỳ kế tiếp (Học kỳ 1, 2027): Bắt đầu vào Thứ Hai, ngày 01/03/2027."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/my-studies/important-dates-and-academic-calendar",
    sourceTitle: "Official RMIT Vietnam Academic Calendar 2026-2027",
    departmentId: "dept-student-connect",
    campus: "all",
    lastVerifiedDate: "2026-10-30",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/events/2026/exp-day-2026/experience-day-2026-thumbnail-1200x800.jpg",
    relatedDocIds: ["doc-enrolment-deadlines"]
  },
  {
    id: "doc-library-services",
    slug: "rmit-library-services-databases-hours",
    titleEn: "Library Services: Databases, Study Spaces & Borrowing Rules",
    titleVi: "Dịch vụ Thư viện RMIT: Cơ sở dữ liệu số, Không gian tự học & Mượn sách",
    categoryId: "library",
    keywords: [
      "library", "thu vien", "database", "study room", "phong tu hoc",
      "borrow books", "muon sach", "citation", "endnote", "opening hours", "gio mo cua"
    ],
    synonymsEn: ["campus library", "learning commons", "academic resources", "research database"],
    synonymsVi: ["thư viện trường", "tra cứu sách", "mượn tài liệu", "phòng học nhóm"],
    summaryEn: "RMIT Vietnam Library provides access to millions of digital journals, textbooks, physical book loans, quiet study zones, bookable group study rooms, and individual research referencing consultations.",
    summaryVi: "Thư viện RMIT Việt Nam cung cấp quyền truy cập vào hàng triệu tạp chí học thuật, sách số, mượn sách giấy, khu vực tự học yên tĩnh, phòng thảo luận nhóm và tư vấn phương pháp nghiên cứu, trích dẫn.",
    detailedGuidanceEn: "Students log in with their RMIT account to access Scopus, IEEE Xplore, ProQuest, and Emerald databases. Librarians offer 1-on-1 consultations for literature reviews and EndNote referencing.",
    detailedGuidanceVi: "Sinh viên đăng nhập tài khoản RMIT để tra cứu Scopus, IEEE Xplore, ProQuest, Emerald. Nhân viên thư viện có dịch vụ tư vấn 1-1 hỗ trợ sinh viên tìm tài liệu nghiên cứu và dùng phần mềm trích dẫn EndNote.",
    keyDetailsEn: [
      "Physical books can be borrowed for up to 4 weeks using your Student ID card.",
      "Group study rooms must be booked online in advance via the Library portal.",
      "Operating hours during semester: Monday - Friday 8:00 AM - 9:00 PM; Saturday 9:00 AM - 5:00 PM.",
      "Ask a Librarian service is available via live chat and email."
    ],
    keyDetailsVi: [
      "Mượn sách giấy tối đa 4 tuần bằng thẻ sinh viên RMIT.",
      "Phòng học nhóm cần đặt trước trực tuyến qua trang web Thư viện.",
      "Giờ mở cửa trong kỳ: Thứ Hai - Thứ Sáu 8:00 - 21:00; Thứ Bảy 9:00 - 17:00.",
      "Dịch vụ 'Hỏi Thủ thư' (Ask a Librarian) hỗ trợ qua khung chat trực tuyến và email."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/support/library-services",
    sourceTitle: "RMIT Vietnam Library Portal",
    departmentId: "dept-library",
    campus: "all",
    lastVerifiedDate: "2026-10-19",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/libraryvn-site/library-news/library-header.jpg",
    relatedDocIds: ["doc-it-support", "doc-campus-facilities"]
  },
  {
    id: "doc-it-support",
    slug: "it-service-desk-wifi-canvas-software",
    titleEn: "IT Service Desk: RMIT Wi-Fi, Canvas LMS, Microsoft 365 & Password",
    titleVi: "Hỗ trợ CNTT (IT Support): Wi-Fi RMIT, Canvas LMS, Microsoft 365 & Đổi mật khẩu",
    categoryId: "it-support",
    keywords: [
      "it support", "wifi", "canvas", "password", "mat khau", "microsoft 365",
      "office", "adobe", "email sinh vien", "login issue", "khong vao duoc mang"
    ],
    synonymsEn: ["IT desk", "tech support", "computer services", "student network"],
    synonymsVi: ["phòng tin học", "bộ phận kỹ thuật", "hỗ trợ máy tính", "mạng wifi trường"],
    summaryEn: "The RMIT IT Service Desk assists students with campus Wi-Fi ('RMIT-University'), Canvas LMS access, student email, Microsoft 365 student licenses, Adobe Creative Cloud, and account security.",
    summaryVi: "Bộ phận Hỗ trợ CNTT (IT Service Desk) hỗ trợ sinh viên kết nối mạng Wi-Fi trường ('RMIT-University'), truy cập Canvas LMS, email sinh viên, cài đặt miễn phí Microsoft 365, Adobe và bảo mật tài khoản.",
    detailedGuidanceEn: "If locked out of your account, use the self-service password reset portal. For software licenses, visit the RMIT OnTheHub digital software center.",
    detailedGuidanceVi: "Nếu quên mật khẩu hoặc bị khóa tài khoản, hãy dùng cổng Self-service Password Reset. Sinh viên được cấp bản quyền miễn phí bộ ứng dụng Microsoft Office 365 và gói Adobe Creative Cloud trong suốt thời gian theo học.",
    keyDetailsEn: [
      "IT Service Desk Email: ITServiceDesk@rmit.edu.vn",
      "Phone Hotline: +84 28 3776 1313 (Saigon) / +84 24 3726 1460 ext 1313 (Hanoi).",
      "In-person: Building 1 Level 3 (Saigon South) / Level 1 IT Counter (Hanoi).",
      "Canvas App: Download Canvas Student on iOS/Android and log in with RMIT credentials."
    ],
    keyDetailsVi: [
      "Email IT: ITServiceDesk@rmit.edu.vn",
      "Hotline điện thoại: +84 28 3776 1313 (Sài Gòn) / +84 24 3726 1460 (Hà Nội).",
      "Hỗ trợ trực tiếp: Tòa nhà 1 Tầng 3 (Nam Sài Gòn) / Quầy IT Tầng 1 (Hà Nội).",
      "Ứng dụng Canvas: Tải ứng dụng Canvas Student trên iOS/Android và đăng nhập bằng email sinh viên."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/support/it-support",
    sourceTitle: "RMIT Vietnam IT Support Services",
    departmentId: "dept-it",
    campus: "all",
    lastVerifiedDate: "2026-10-25",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/rmit-hanoi-campus-facilities/rmit-hanoi-campus-facilities-06.jpg",
    relatedDocIds: ["doc-library-services", "doc-student-connect"]
  },
  {
    id: "doc-exchange-melbourne",
    slug: "exchange-study-abroad-rmit-melbourne",
    titleEn: "Exchange & Study Abroad: Cross-Campus Transfer to RMIT Melbourne",
    titleVi: "Chương trình Trao đổi & Du học: Chuyển tiếp cơ sở RMIT Melbourne",
    categoryId: "exchange",
    keywords: [
      "exchange", "du hoc", "melbourne", "cross campus", "study abroad",
      "chuyen tiep", "trao doi sinh vien", "visa uc", "hoc phi trao doi"
    ],
    synonymsEn: ["global mobility", "campus transfer", "australia exchange", "partner university"],
    synonymsVi: ["chuyển tiếp úc", "học kỳ trao đổi", "du học úc rmit", "giao lưu quốc tế"],
    summaryEn: "RMIT Vietnam students can study for 1 to 2 semesters at RMIT Melbourne or over 200 partner universities globally while paying RMIT Vietnam tuition fees (cross-campus transfer program).",
    summaryVi: "Sinh viên RMIT Việt Nam có thể tham gia học từ 1 đến 2 học kỳ tại RMIT Melbourne hoặc hơn 200 trường đại học đối tác toàn cầu với mức học phí đóng theo mức tại RMIT Việt Nam (chương trình Chuyển tiếp cơ sở).",
    detailedGuidanceEn: "Applicants must have completed at least 72 credit points (usually 6-8 courses) at RMIT Vietnam and maintain a minimum cumulative GPA (usually 2.5/4.0 or above). Application deadlines are usually 6 months before the target semester.",
    detailedGuidanceVi: "Sinh viên cần hoàn thành ít nhất 72 tín chỉ (thường tương đương 6-8 môn học) tại RMIT Việt Nam và đạt mức GPA tích lũy tối thiểu (thường từ 2.5/4.0 trở lên). Thời hạn nộp hồ sơ trước kỳ học mục tiêu khoảng 6 tháng.",
    keyDetailsEn: [
      "Tuition advantage: Pay RMIT Vietnam tuition rates for RMIT Melbourne exchange semesters.",
      "Living expenses & airfare: Covered independently by the student.",
      "Australian Student Visa (Subclass 500) required for Melbourne study.",
      "Global Experience team conducts informational webinars each semester."
    ],
    keyDetailsVi: [
      "Ưu đãi học phí: Đóng học phí theo mức RMIT Việt Nam khi sang học tại RMIT Melbourne.",
      "Chi phí sinh hoạt và vé máy bay: Sinh viên tự chi trả.",
      "Thủ tục visa: Cần xin Visa Du học Úc (Subclass 500).",
      "Bộ phận Global Experience tổ chức các buổi hội thảo hướng dẫn chi tiết mỗi kỳ."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/work-and-study-opportunities/global-experience-programs",
    sourceTitle: "RMIT Vietnam Global Mobility & Cross-Campus Exchange",
    departmentId: "dept-exchange",
    campus: "all",
    lastVerifiedDate: "2026-10-14",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/student-activities-01.jpg",
    relatedDocIds: ["doc-enrolment-deadlines", "doc-tuition-payment"]
  },
  {
    id: "doc-wellbeing-counseling",
    slug: "student-wellbeing-counseling-accessibility",
    titleEn: "Student Wellbeing: Free Confidential Counseling & Equitable Learning",
    titleVi: "Chăm sóc sức khỏe tinh thần: Tư vấn tâm lý bảo mật & Hỗ trợ học tập hòa nhập",
    categoryId: "wellbeing-accessibility",
    keywords: [
      "wellbeing", "counseling", "tam ly", "stress", "suc khoe tinh than",
      "tu van tam ly", "disability", "equitable learning", "elp", "ho tro hoa nhap"
    ],
    synonymsEn: ["mental health support", "psychological service", "disability support", "student care"],
    synonymsVi: ["tham vấn tâm lý", "hỗ trợ tinh thần", "chăm sóc sinh viên", "hỗ trợ người khuyết tật"],
    summaryEn: "RMIT Vietnam provides professional, strictly confidential psychological counseling services free of charge to all enrolled students. The Equitable Learning Services team creates adjustments for students with temporary or permanent health conditions.",
    summaryVi: "RMIT Việt Nam cung cấp dịch vụ tư vấn tâm lý chuyên nghiệp, hoàn toàn bảo mật và miễn phí cho mọi sinh viên. Bộ phận Dịch vụ Học tập Hòa nhập (ELS) thiết lập kế hoạch hỗ trợ cho sinh viên có vấn đề sức khỏe tạm thời hoặc lâu dài.",
    detailedGuidanceEn: "Counseling sessions can be booked online via the Student Wellbeing portal or email. Equitable Learning Plans (ELP) may grant extensions on assignments, alternative exam arrangements, or specialized assistive technology.",
    detailedGuidanceVi: "Lịch tư vấn có thể đặt trực tuyến qua cổng Student Wellbeing hoặc email. Kế hoạch Học tập Hòa nhập (ELP) có thể hỗ trợ gia hạn bài tập, sắp xếp phòng thi riêng phù hợp hoặc cung cấp thiết bị trợ thính, trợ thị.",
    keyDetailsEn: [
      "100% Free & Confidential: Nothing disclosed to lecturers, parents, or academic transcripts.",
      "Contact: wellbeing@rmit.edu.vn / equitablelearning@rmit.edu.vn",
      "Crisis line: 24/7 emergency psychological support contacts are listed on the portal.",
      "Location: Dedicated private consultation suites at Saigon South and Hanoi campuses."
    ],
    keyDetailsVi: [
      "100% Miễn phí & Tuyệt đối bảo mật: Không tiết lộ cho giảng viên, gia đình hoặc ghi trên học bạ.",
      "Email liên hệ: wellbeing@rmit.edu.vn / equitablelearning@rmit.edu.vn",
      "Đường dây khẩn cấp: Số điện thoại hỗ trợ khủng hoảng 24/7 được cập nhật trên cổng sinh viên.",
      "Địa điểm: Phòng tư vấn riêng tư tại cơ sở Nam Sài Gòn và Hà Nội."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/student-life/support-services/wellbeing",
    sourceTitle: "RMIT Vietnam Student Wellbeing and Counseling",
    departmentId: "dept-wellbeing",
    campus: "all",
    lastVerifiedDate: "2026-10-21",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/wellbeing-day-2022.jpg",
    relatedDocIds: ["doc-student-connect"]
  },
  {
    id: "doc-grading-gpa-scale",
    slug: "grading-scale-gpa-calculation-rules",
    titleEn: "Grading Scale, GPA Calculation & Academic Standing",
    titleVi: "Thang điểm RMIT, Cách tính GPA & Xếp loại học lực",
    categoryId: "academic-info",
    keywords: [
      "grading scale", "gpa", "thang diem", "tinh gpa", "hd", "di", "cr", "pa", "nn",
      "high distinction", "pass", "fail", "diem trung binh", "hoc luc", "academic integrity"
    ],
    synonymsEn: ["marks", "grade points", "academic transcript", "passing score"],
    synonymsVi: ["điểm số", "xếp loại tốt nghiệp", "điểm qua môn", "thang điểm 4"],
    summaryEn: "RMIT uses a 5-tier letter grading system: High Distinction (HD: 80-100%, 4.0), Distinction (DI: 70-79%, 3.0), Credit (CR: 60-69%, 2.0), Pass (PA: 50-59%, 1.0), and Fail (NN: 0-49%, 0.0).",
    summaryVi: "RMIT áp dụng hệ thống 5 mức xếp loại: High Distinction (HD: 80-100%, 4.0), Distinction (DI: 70-79%, 3.0), Credit (CR: 60-69%, 2.0), Pass (PA: 50-59%, 1.0), và Fail (NN: 0-49%, 0.0).",
    detailedGuidanceEn: "GPA is calculated on a 4.0 scale weighted by credit points. A student must achieve at least 50% overall in a course to obtain a passing grade. Failing a course requires re-enrolment and payment of the course tuition again.",
    detailedGuidanceVi: "Điểm GPA được tính theo thang điểm 4.0 trọng số theo tín chỉ môn học. Sinh viên cần đạt tối thiểu 50% tổng điểm môn để qua môn. Nếu bị điểm rớt (NN), sinh viên phải đăng ký học lại và đóng lại học phí môn đó.",
    keyDetailsEn: [
      "HD (80-100%): 4.0 GPA points | Exceptional mastery.",
      "DI (70-79%): 3.0 GPA points | Superior achievement.",
      "CR (60-69%): 2.0 GPA points | Good comprehension.",
      "PA (50-59%): 1.0 GPA points | Satisfactory achievement (passing threshold).",
      "NN (0-49%): 0.0 GPA points | Unsatisfactory (Fail)."
    ],
    keyDetailsVi: [
      "HD (80-100%): 4.0 điểm GPA | Xuất sắc toàn diện.",
      "DI (70-79%): 3.0 điểm GPA | Giỏi.",
      "CR (60-69%): 2.0 điểm GPA | Khá.",
      "PA (50-59%): 1.0 điểm GPA | Đạt (ngưỡng qua môn).",
      "NN (0-49%): 0.0 điểm GPA | Không đạt (Rớt môn)."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/my-studies/assessment-and-results",
    sourceTitle: "RMIT Assessment and Grading Regulations",
    departmentId: "dept-student-connect",
    campus: "all",
    lastVerifiedDate: "2026-10-16",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/events/2026/rbpc-2026/rbpc-2026-1200x800.jpg",
    relatedDocIds: ["doc-change-major", "doc-enrolment-deadlines"]
  },
  {
    id: "doc-special-consideration",
    slug: "special-consideration-assignment-extension",
    titleEn: "Special Consideration & Extension of Submission Time",
    titleVi: "Xét duyệt Hoàn cảnh Đặc biệt & Xin gia hạn nộp bài",
    categoryId: "academic-info",
    keywords: [
      "special consideration", "extension", "gia han bai tap", "hoan canh dac biet",
      "sick leave", "benh", "giay bac si", "medical certificate", "nop tre"
    ],
    synonymsEn: ["assignment extension", "compassionate grounds", "illness during exam"],
    synonymsVi: ["xin hoãn thi", "nộp muộn bài tập", "lý do sức khỏe", "đơn gia hạn"],
    summaryEn: "If unforeseen circumstances (such as severe illness, bereavement, or accident) prevent you from completing an assessment or exam, you can apply for Special Consideration with official supporting documentation.",
    summaryVi: "Nếu gặp tình huống bất khả kháng (như ốm đau nặng, tai nạn hoặc việc gia đình đột xuất) ảnh hưởng đến việc nộp bài hoặc thi cử, bạn có thể nộp đơn Xét duyệt Hoàn cảnh Đặc biệt kèm giấy tờ chứng minh hợp lệ.",
    detailedGuidanceEn: "Applications must generally be submitted within 5 working days of the assessment due date or exam date. Supporting documents such as a registered medical practitioner certificate or hospital discharge form are mandatory.",
    detailedGuidanceVi: "Đơn phải được nộp trong vòng 5 ngày làm việc kể từ hạn nộp bài hoặc ngày thi. Giấy chứng nhận y tế từ bệnh viện/phòng khám được cấp phép là tài liệu bắt buộc.",
    keyDetailsEn: [
      "Submit online via the official RMIT Special Consideration portal.",
      "Eligible reasons: Acute medical conditions, family crisis, significant unexpected events.",
      "Ineligible reasons: Technology glitch, heavy study workload, travel plans, routine employment commitments.",
      "Outcomes: Extensions, deferred exam, or alternative assessment arrangement."
    ],
    keyDetailsVi: [
      "Nộp đơn trực tuyến qua cổng Special Consideration chính thức của RMIT.",
      "Lý do hợp lệ: Bệnh cấp tính, khủng hoảng gia đình, tai nạn nghiêm trọng bất ngờ.",
      "Lý do KHÔNG hợp lệ: Lỗi máy tính cá nhân, lịch học bận, đi du lịch, lịch làm thêm thường nhật.",
      "Hình thức hỗ trợ: Được gia hạn nộp bài, xếp lịch thi lại hoặc bài kiểm tra thay thế."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/my-studies/assessment-and-results",
    sourceTitle: "RMIT Vietnam Special Consideration Guidelines",
    departmentId: "dept-student-connect",
    campus: "all",
    lastVerifiedDate: "2026-10-24",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/pride-week.jpg",
    relatedDocIds: ["doc-grading-gpa-scale", "doc-wellbeing-counseling"]
  },
  {
    id: "doc-student-clubs-sports",
    slug: "student-clubs-societies-sports",
    titleEn: "Student Clubs & Sports: RMIT Redbacks, Football, Badminton & Society Information",
    titleVi: "Câu lạc bộ & Thể thao sinh viên: Đội tuyển RMIT Redbacks, Bóng đá & Hoạt động phong trào",
    categoryId: "campus-facilities",
    keywords: [
      "cau lac bo", "clb", "bong ro", "bong da", "the thao", "club", "society",
      "sports", "basketball", "redbacks", "rmit redbacks", "football", "badminton", "sinh hoat clb", "club day",
      "tham gia clb", "dang ky clb", "cheerleading", "enactus", "music club", "fintech club"
    ],
    synonymsEn: ["student societies", "sports clubs", "RMIT Redbacks basketball", "campus activities", "recreation clubs"],
    synonymsVi: ["câu lạc bộ sinh viên", "clb thể thao", "đội tuyển rmit redbacks", "hoạt động ngoại khóa", "đội bóng rổ redback"],
    summaryEn: "RMIT Vietnam features over 60 student-led clubs and varsity teams across Saigon South and Hanoi campuses, including the famous RMIT Redbacks (Basketball, Badminton, Football) and academic/cultural societies. Students register during Club Days at the start of each semester or via RMIT Student Life.",
    summaryVi: "RMIT Việt Nam có hơn 60 câu lạc bộ và đội tuyển thể thao sinh viên tại cơ sở Nam Sài Gòn và Hà Nội, nổi bật với các đội tuyển RMIT Redbacks (Bóng rổ, Cầu lông, Bóng đá), cùng các CLB học thuật và nghệ thuật. Sinh viên đăng ký tham gia qua ngày hội Club Days đầu mỗi kỳ học hoặc qua phòng Đời sống Sinh viên (Student Life).",
    detailedGuidanceEn: "Club Days take place during Orientation Week and Week 1 of standard semesters across Saigon South (Building 10 / Sảnh chính) and Hanoi (Handi Resco sảnh tầng 1 & tầng 8). Active varsity sports include:\n• Basketball: RMIT Redbacks Basketball Team (thi đấu các giải sinh viên toàn quốc và VUG)\n• Football & Futsal: RMIT Football Club (luyện tập tại sân cỏ nhân tạo SGS / sân vận động HN)\n• Cheerleading: RMIT Cheerleading Team\n• Academic Clubs: FinTech Club, Business Information Systems (BIS), Innovation & Entrepreneurship (IEC), Debate Club\n• Culture & Art: Enactus RMIT Vietnam, Music Club, Dance Club, Photography Club.",
    detailedGuidanceVi: "Ngày hội Club Days diễn ra vào Tuần định hướng (O-Week) và Tuần 1 đầu các học kỳ chính tại Nam Sài Gòn (Tòa nhà 10 / Sảnh chính) và Hà Nội (Handi Resco Tầng 1 & Tầng 8). Các đội tuyển thể thao & CLB tiêu biểu:\n• Bóng rổ: Đội tuyển RMIT Redbacks Basketball Team (tập luyện định kỳ tại Sports Hall, tham gia giải bóng rổ sinh viên toàn quốc và giải VUG)\n• Bóng đá & Futsal: RMIT Football Club (tập luyện tại sân bóng đá SGS và sân bóng Hà Nội)\n• Cheerleading: Đội tuyển cổ vũ RMIT Cheerleading Club\n• Khối Học thuật: FinTech Club, Hệ thống thông tin kinh doanh (BIS), Đổi mới sáng tạo & Khởi nghiệp (IEC), CLB Tranh biện (Debate Club)\n• Khối Nghệ thuật & Cộng đồng: Enactus RMIT Vietnam, Music Club, Dance Club, Photography Club.",
    keyDetailsEn: [
      "Join via Club Days: Held during O-Week and Week 1 of Semesters 1, 2, and 3.",
      "Basketball Varsity: RMIT Redbacks Basketball Team with weekly training and competitive fixtures at the Sports Hall.",
      "Sports Lineup: Redbacks Basketball, Football/Futsal, Badminton, Volleyball, Martial Arts, Table Tennis.",
      "Academic & Cultural Societies: FinTech Club, IEC Entrepreneurship, Debate Club, Enactus RMIT Vietnam, Music Club, Dance Club.",
      "Department: Student Life Office (SGS Room 10.2.09 / Hanoi Room 1.8.007) | Email: student.life@rmit.edu.vn."
    ],
    keyDetailsVi: [
      "Đăng ký tham gia: Tại ngày hội Club Days (diễn ra vào O-Week và Tuần 1 đầu kỳ 1, 2 và 3).",
      "Đội tuyển Bóng rổ: RMIT Redbacks Basketball Team tập luyện định kỳ và thi đấu giải tại Nhà thi đấu Thể thao (Sports Hall).",
      "Các bộ môn thể thao: Redbacks Bóng rổ, Bóng đá/Futsal, Cầu lông, Bóng chuyền, Võ thuật, Bóng bàn.",
      "CLB Học thuật & Nghệ thuật: FinTech Club, Khởi nghiệp IEC, CLB Tranh biện Debate, Enactus RMIT, Music Club, Dance Club.",
      "Phòng ban phụ trách: Văn phòng Student Life (Nam Sài Gòn: Phòng 10.2.09 / Hà Nội: Phòng 1.8.007) | Email: student.life@rmit.edu.vn."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/campus-life/clubs",
    sourceTitle: "RMIT Vietnam Clubs and Societies Portal",
    departmentId: "dept-student-connect",
    campus: "all",
    lastVerifiedDate: "2026-10-25",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/sports-day-2022.jpg",
  },
  {
    id: "doc-orientation-getting-started",
    slug: "orientation-student-card-campus-access",
    titleEn: "Getting Started: Orientation (O-Week), Student ID Card & Campus Access",
    titleVi: "Bắt đầu tại RMIT: Tuần lễ định hướng (O-Week), Làm thẻ sinh viên & Ra vào cơ sở",
    categoryId: "getting-started",
    keywords: [
      "getting started", "orientation", "o-week", "student card", "the sinh vien",
      "nhap hoc", "tan sinh vien", "campus access", "building 1", "handi resco",
      "bat dau tai rmit", "huong dan tan sinh vien"
    ],
    synonymsEn: ["new student guide", "first year induction", "campus card", "student registration"],
    synonymsVi: ["hướng dẫn tân sinh viên", "làm thẻ sinh viên", "tuần lễ định hướng", "thủ tục nhập học"],
    summaryEn: "Essential onboarding guide for new RMIT Vietnam students: attending Orientation Week, capturing and collecting your physical Student ID card, and setting up access to campus facilities.",
    summaryVi: "Cẩm nang bắt đầu dành cho tân sinh viên RMIT Việt Nam: tham gia Tuần lễ định hướng (O-Week), chụp ảnh và nhận thẻ sinh viên chính thức, kích hoạt quyền ra vào thư viện và cơ sở vật chất.",
    detailedGuidanceEn: "New students must upload a passport-style photo via the Student Portal before O-Week. Collect your Student ID card at the Student Connect Hub. The card grants access to campus turnstiles, library borrowing, printing facilities, and Sports Hall amenities.",
    detailedGuidanceVi: "Tân sinh viên cần tải ảnh chân dung chuẩn lên Cổng thông tin sinh viên trước tuần O-Week. Nhận thẻ sinh viên tại quầy Student Connect. Thẻ sinh viên dùng để quét cổng an ninh, mượn sách thư viện, in ấn tài liệu và sử dụng phòng tập thể thao.",
    keyDetailsEn: [
      "Orientation Week (O-Week): Held one week prior to teaching commencement in Semesters 1, 2, and 3.",
      "Student ID Card: Upload photo online -> Collect in person at Student Connect (Building 1 Saigon South / Level 1 Hanoi).",
      "Essential Accounts: Activate RMIT Microsoft 365 student email and Canvas LMS credentials.",
      "Campus WiFi: Connect to 'RMIT-University' using student ID (sXXXXXXX) and network password."
    ],
    keyDetailsVi: [
      "Tuần lễ định hướng (O-Week): Diễn ra 1 tuần trước khi kỳ học chính thức bắt đầu (Kỳ 1, 2, 3).",
      "Làm thẻ sinh viên: Tải ảnh thẻ trực tuyến -> Nhận thẻ trực tiếp tại quầy Student Connect (Tòa nhà 1 Nam Sài Gòn / Tầng 1 Hà Nội).",
      "Kích hoạt tài khoản: Đăng nhập email sinh viên Microsoft 365 và hệ thống học tập Canvas LMS.",
      "Mạng Wi-Fi: Kết nối vào mạng 'RMIT-University' bằng mã số sinh viên (sXXXXXXX) và mật khẩu tài khoản."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/my-studies/new-students/orientation-information",
    sourceTitle: "RMIT Vietnam New Student Orientation & Getting Started",
    departmentId: "dept-student-connect",
    campus: "all",
    lastVerifiedDate: "2026-10-28",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/student-activities/welcome-day-22.jpg",
    relatedDocIds: ["doc-student-connect", "doc-it-support"],
  },
  {
    id: "doc-graduation-careers",
    slug: "graduation-ceremony-eligibility-careers",
    titleEn: "Graduation & Careers: Ceremony Schedule, Testamur & Career Fair",
    titleVi: "Tốt nghiệp & Hướng nghiệp: Lễ tốt nghiệp, Bằng cấp & Ngày hội việc làm",
    categoryId: "graduation",
    keywords: [
      "graduation", "tot nghiep", "le tot nghiep", "testamur", "bang tot nghiep",
      "career fair", "tuyen dung", "career hub", "thuc tap", "alumni", "cuu sinh vien"
    ],
    synonymsEn: ["degree conferral", "graduation ceremony", "employment consulting", "internship fair"],
    synonymsVi: ["nhận bằng tốt nghiệp", "hội chợ việc làm", "tư vấn nghề nghiệp", "kết nối doanh nghiệp"],
    summaryEn: "Comprehensive guide to RMIT graduation procedures, applying to attend the annual graduation ceremony, collecting your official Australian testamur, and accessing career consulting and Career Hub job boards.",
    summaryVi: "Hướng dẫn toàn diện về thủ tục tốt nghiệp tại RMIT, đăng ký tham dự Lễ tốt nghiệp thường niên, nhận bằng cử nhân chuẩn Úc (Testamur) và sử dụng dịch vụ tư vấn việc làm, kết nối thực tập qua Career Hub.",
    detailedGuidanceEn: "Final semester students must complete course requirements and ensure zero outstanding tuition fees. Graduations take place in Hanoi and Saigon South each year. Career Centre offers ongoing lifetime support for graduates.",
    detailedGuidanceVi: "Sinh viên trong kỳ học cuối cần hoàn thành đủ tín chỉ theo cấu trúc ngành và không còn nợ học phí. Lễ tốt nghiệp được tổ chức trang trọng tại Nam Sài Gòn và Hà Nội. Trung tâm Hướng nghiệp hỗ trợ kết nối doanh nghiệp và sửa CV miễn phí cho sinh viên và cựu sinh viên.",
    keyDetailsEn: [
      "Eligibility Audit: Student Connect reviews academic transcripts upon final grade release.",
      "Ceremonies: Held annually in Saigon South (April/December) and Hanoi (November).",
      "Academic Regalia: Gown and mortarboard hire available through official ceremony portals.",
      "Career Support: Lifetime access to RMIT Career Hub job portal and alumni networking events."
    ],
    keyDetailsVi: [
      "Xét duyệt tốt nghiệp: Student Connect rà soát bảng điểm sau khi có điểm thi kỳ cuối.",
      "Lễ tốt nghiệp: Tổ chức hàng năm tại Nam Sài Gòn (tháng 4 / tháng 12) và Hà Nội (tháng 11).",
      "Trang phục tốt nghiệp: Thuê lễ phục áo cử nhân và mũ qua cổng đăng ký của trường.",
      "Hỗ trợ việc làm: Quyền truy cập trọn đời cổng việc làm RMIT Career Hub và mạng lưới cựu sinh viên toàn cầu."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/my-studies/graduation",
    sourceTitle: "RMIT Vietnam Graduation & Career Services",
    departmentId: "dept-careers",
    campus: "all",
    lastVerifiedDate: "2026-10-26",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/events/student-site/2026/carnival-2026/thumbnail-carnival-2026.jpg",
    relatedDocIds: ["doc-student-connect"],
  },
  {
    id: "doc-deans-list-honours",
    slug: "deans-list-academic-awards-honours",
    titleEn: "Dean's List, Academic Awards & Commendation Criteria",
    titleVi: "Danh sách vinh danh Dean's List, Khen thưởng Học thuật & Tiêu chuẩn",
    categoryId: "academic-info",
    keywords: [
      "deans list", "dean's list", "vinh danh", "khen thuong", "academic awards",
      "top students", "danh sach dean", "gpa deans list", "hoc bong deans list",
      "giay khen", "certificate of achievement", "bang khen dean"
    ],
    synonymsEn: ["Dean's list of academic excellence", "Commendation letter", "Honor roll", "Top performing students"],
    synonymsVi: ["danh sách hiệu trưởng", "vinh danh khoa", "bảng vàng thành tích", "khen thưởng học kỳ"],
    summaryEn: "The Dean's List at RMIT University recognizes undergraduate and postgraduate students who achieve outstanding academic results in a semester (typically a semester GPA of 3.8 to 4.0 or top 5% of their school). Recipients receive an official Certificate of Achievement and public university commendation.",
    summaryVi: "Danh sách Dean's List tại Đại học RMIT vinh danh các sinh viên đại học và sau đại học đạt kết quả học tập xuất sắc trong học kỳ (thường yêu cầu GPA học kỳ từ 3.8/4.0 trở lên hoặc thuộc top 5% của khoa/trường). Sinh viên trong danh sách được cấp Giấy chứng nhận Thành tích Học thuật chính thức và ghi nhận trong hồ sơ trường.",
    detailedGuidanceEn: "Dean's List is evaluated automatically at the conclusion of each teaching semester following official grade release. Students must be enrolled in a standard full-time study load (at least 36 credit points, typically 3 to 4 courses in the semester) with no failed grades.",
    detailedGuidanceVi: "Danh sách Dean's List được trường xét duyệt tự động sau khi công bố điểm chính thức của mỗi học kỳ. Sinh viên cần đăng ký đủ tải học tập tiêu chuẩn (tối thiểu 36 tín chỉ, thường là 3-4 môn trong kỳ) và không có môn nào bị điểm rớt.",
    keyDetailsEn: [
      "Academic Criterion: Semester GPA typically 3.8/4.0 or higher (or ranking in top 5% of the School).",
      "Study Load Condition: Enrolled in at least 3 courses (36 credit points) in the evaluated semester.",
      "Recognition: Official Certificate of Academic Excellence issued by the Dean of the School.",
      "Award vs Scholarship: Dean's List is an honorary academic award and certificate; it does not automatically confer a direct cash or tuition deduction scholarship unless coupled with an Academic Merit Scholarship."
    ],
    keyDetailsVi: [
      "Tiêu chí học lực: GPA học kỳ đạt từ 3.8/4.0 trở lên (hoặc thuộc top 5% sinh viên có điểm cao nhất của Khoa/Trường).",
      "Điều kiện số môn: Học tối thiểu 3 môn (36 tín chỉ) trong học kỳ được xét, không có môn rớt.",
      "Hình thức vinh danh: Nhận Giấy khen Thành tích Xuất sắc do Trưởng khoa (Dean of School) ký tặng.",
      "Phân biệt với Học bổng: Dean's List là danh hiệu khen thưởng danh dự và chứng nhận học thuật, KHÔNG tự động giảm trừ tiền học phí trực tiếp (để được giảm học phí cần nộp đơn Học bổng Thành tích học thuật - Academic Merit Scholarship riêng)."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/my-studies/assessment-and-results",
    sourceTitle: "RMIT Vietnam Academic Recognition & Awards",
    departmentId: "dept-student-connect",
    campus: "all",
    lastVerifiedDate: "2026-10-30",
    verificationStatus: "verified",
    imageUrl: "https://s7ap1.scene7.com/is/image/rmit/rmit-hanoi-campus-facilities-10?wid=800",
    relatedDocIds: ["doc-grading-gpa-scale", "doc-scholarships-types"],
  },
  {
    id: "doc-email-lecturers-consult",
    slug: "van-mau-email-cho-giang-vien",
    titleEn: "Lecturer Email Blueprints & Academic Consultation Etiquette",
    titleVi: "Văn mẫu Email gửi Giảng viên: Xin lịch hẹn Consult, Gia hạn nộp bài & Hỏi điểm",
    categoryId: "academic-info",
    keywords: [
      "mail consult", "email consult", "consult giang vien", "mail giang vien", "email giang vien",
      "consultation", "office hours", "gap thay co", "xin consult", "hoi bai giang vien",
      "xin gia han", "email hoi diem", "free rider", "thu gioi thieu"
    ],
    synonymsEn: ["emailing professors", "consultation email", "academic inquiry letter", "office hour meeting"],
    synonymsVi: ["thư gửi thầy cô", "mẫu email học vụ", "xin hẹn gặp giảng viên", "cách viết mail cho thầy cô"],
    summaryEn: "Standard professional email templates for contacting RMIT lecturers: requesting a 1-on-1 consultation, applying for an assessment extension, clarifying grading feedback, reporting group free-riders, and requesting recommendation letters.",
    summaryVi: "Bộ văn mẫu chuẩn mực gửi giảng viên RMIT: đăng ký lịch hẹn tư vấn học thuật 1-1 (Consultation/Office Hours), xin gia hạn nộp bài tập (Extension), trao đổi văn minh về nhận xét điểm số, xử lý thành viên nhóm không hợp tác (Free-rider) và xin thư giới thiệu học bổng.",
    detailedGuidanceEn: "Always use your official RMIT student email. Format subject: [Course Code] - [Brief Topic] - [Full Name] - [sXXXXXXX]. State your specific questions in advance so the lecturer knows you have reviewed course materials.",
    detailedGuidanceVi: "Luôn gửi từ email sinh viên @rmit.edu.vn. Đặt tiêu đề chuẩn: [Mã môn] - [Vấn đề] - [Họ tên] - [sXXXXXXX]. Chuẩn bị sẵn 2-3 câu hỏi cụ thể và nêu rõ khung giờ mong muốn hẹn gặp.",
    keyDetailsEn: [
      "Consultation Request: State 2-3 specific questions prepared in advance and propose slots during their Canvas office hours.",
      "Extension Request: Email at least 24-48 hours before the deadline with evidence of progress and medical certificates if applicable.",
      "Grade Feedback: Request clarification constructively focusing on rubric criteria and future improvements, never aggressive bargaining.",
      "Group Free-Rider: Provide a dated evidence log of missed meetings and message outreach at least 1-2 weeks before submission."
    ],
    keyDetailsVi: [
      "Xin hẹn Consult: Nêu 1-2 câu hỏi cụ thể đã tìm hiểu trước và đề xuất khung giờ trong giờ Office Hours trên Canvas.",
      "Xin gia hạn nộp bài (Extension): Gửi TRƯỚC hạn nộp 24-48 tiếng kèm minh chứng tiến độ bài làm và giấy khám bệnh nếu có.",
      "Hỏi phản hồi điểm số: Tiếp cận với tinh thần học hỏi cách hoàn thiện tiêu chí rubric cho bài sau, không dùng từ ngữ đòi điểm.",
      "Báo cáo bạn nhóm không làm bài (Free-rider): Lập nhật ký mốc ngày tháng bằng chứng khách quan gửi giảng viên trước hạn nộp 1-2 tuần."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/support/student-connect",
    sourceTitle: "RMIT Academic Communication & Consultation Guidelines",
    departmentId: "dept-student-connect",
    campus: "all",
    lastVerifiedDate: "2026-10-30",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/events/marketing/provincial-tour-2026/2026-provincial-thumbnail-1200x800.jpg",
    relatedDocIds: ["doc-canvas-lms-guide", "doc-student-connect"]
  },
  {
    id: "doc-canvas-lms-guide",
    slug: "huong-dan-su-dung-canvas-lms",
    titleEn: "Canvas LMS Student Guide: Submitting Assignments, Turnitin & Grades",
    titleVi: "Hướng dẫn sử dụng Canvas LMS: Nộp bài tập, Kiểm tra Turnitin & Xem điểm",
    categoryId: "it-support",
    keywords: [
      "canvas", "canvas lms", "turnitin", "nop bai", "rubric", "diem", "xem diem",
      "nop tre", "deadline", "late penalty", "phan tram turnitin", "similarity report"
    ],
    synonymsEn: ["Canvas study portal", "Turnitin plagiarism check", "online assignment submission"],
    synonymsVi: ["cổng học tập canvas", "kiểm tra đạo văn turnitin", "nộp bài trực tuyến"],
    summaryEn: "Comprehensive guide to using RMIT's digital learning management system (Canvas): submitting assignments safely, understanding Turnitin similarity reports, reading rubrics, and the 10% per day late submission penalty rule.",
    summaryVi: "Cẩm nang hướng dẫn sử dụng hệ thống học tập Canvas LMS tại RMIT: các bước nộp bài an toàn, đọc hiểu chỉ số trùng lặp Turnitin, tra cứu điểm số theo Rubric và quy chế phạt trừ 10% điểm mỗi ngày nộp muộn.",
    detailedGuidanceEn: "Submissions must be made through Canvas Assignment portals before the exact minute of the deadline. File formats must match rubric rules.",
    detailedGuidanceVi: "Bài làm phải được nộp qua đúng cổng Assignment trên Canvas trước thời khắc chốt deadline. Định dạng file cần tuân thủ đúng yêu cầu đề bài (PDF/Word/ZIP).",
    keyDetailsEn: [
      "Submission Check: Always download and verify your submitted file on Canvas immediately after uploading.",
      "Turnitin Similarity: No magic percentage threshold exists; instructors read highlighted text to verify proper citation.",
      "Late Penalty: 10% deduction per 24 hours late under RMIT Academic Assessment Policy.",
      "Technical Issues: If Canvas experiences a system-wide outage, IT Service Desk logs the incident officially."
    ],
    keyDetailsVi: [
      "Kiểm tra sau khi nộp: Luôn tải lại file vừa nộp trên Canvas về máy để kiểm tra file không bị lỗi trắng trang.",
      "Chỉ số Turnitin: Không có ngưỡng an toàn cố định; giảng viên sẽ đọc trực tiếp các câu trùng lặp để xem bạn trích dẫn đúng chuẩn chưa.",
      "Phạt nộp trễ: Bị trừ 10% điểm bài tập mỗi 24 giờ nộp muộn theo Quy chế Đánh giá RMIT.",
      "Sự cố hệ thống: Nếu Canvas bị sập toàn trường, IT Service Desk sẽ ghi nhận sự cố để gia hạn chung."
    ],
    officialSourceUrl: "https://www.rmit.edu.vn/students/my-studies/canvas-study-portal",
    sourceTitle: "RMIT Vietnam Canvas LMS Study Portal",
    departmentId: "dept-it",
    campus: "all",
    lastVerifiedDate: "2026-10-30",
    verificationStatus: "verified",
    imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/rmit-sgs-campus-facilities/indoor-general/students-hanging-out-4.jpg",
    relatedDocIds: ["doc-it-support", "doc-email-lecturers-consult"]
  }
];
