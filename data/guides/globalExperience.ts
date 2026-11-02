export type GlobalExperienceProgramId =
  | "partner-exchange"
  | "cross-campus-melbourne"
  | "interlocation-asia"
  | "global-short-programs";

export type GlobalApplicationStatus = "open" | "upcoming" | "closed" | "not_announced";

export interface BilingualText {
  en: string;
  vi: string;
}

export interface GlobalApplicationCycle {
  id: string;
  programId: GlobalExperienceProgramId;
  label: BilingualText;
  opensOn?: string;
  closesOn?: string;
  deadlineTimeZone: "Australia/Melbourne";
  applicationUrl: string;
}

export interface GlobalExperienceProgram {
  id: GlobalExperienceProgramId;
  title: BilingualText;
  summary: BilingualText;
  destination: BilingualText;
  duration: BilingualText;
  comparisonEligibility: BilingualText;
  tuitionAndCosts: BilingualText;
  eligibility: BilingualText[];
  applicationSteps: BilingualText[];
  requiredDocuments: BilingualText[];
  applicationPortalUrl: string;
  applicationPortalLabel: BilingualText;
  informationUrl: string;
  instructionsUrl?: string;
  notes?: BilingualText;
  cycles: GlobalApplicationCycle[];
}

export const GLOBAL_EXPERIENCE_LAST_VERIFIED = "2026-11-01";
export const GLOBAL_EXPERIENCE_HERO_IMAGE = "https://www.rmit.edu.au/assets/rmit-images/marketing-only/about-sub-mastheads/City-Campus-Masthead-1920x960.jpg";

export const GLOBAL_EXPERIENCE_URLS = {
  overview: "https://www.rmit.edu.vn/students/work-and-study-opportunities/global-experience-programs",
  partnerExchange: "https://www.rmit.edu.vn/students/work-and-study-opportunities/global-experience-programs/exchange-to-partners-worldwide",
  partnerExchangeInstructions: "https://www.rmit.edu.vn/students/work-and-study-opportunities/global-experience-programs/exchange-to-partners-worldwide/how-to-register-for-an-exchange-program",
  partnerList: "https://apps.rmit.edu.vn/r/partner-exchange-list",
  partnerUndergraduateList: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/documents/pdfs/global-experiences/exchange-to-a-partner-university/how-to-register-for-exchange/global-exchange-program-list-of-partner-universities-undergraduate-mar2025.pdf",
  partnerPostgraduateList: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/documents/pdfs/global-experiences/exchange-to-a-partner-university/how-to-register-for-exchange/global-exchange-program-list-of-partner-universities-postgraduate-mar2025.pdf",
  crossCampus: "https://www.rmit.edu.vn/students/work-and-study-opportunities/global-experience-programs/cross-campus-to-rmit-melbourne",
  crossCampusInstructions: "https://www.rmit.edu.vn/students/work-and-study-opportunities/global-experience-programs/cross-campus-to-rmit-melbourne/how-to-register-for-cross-campus-to-rmit-melbourne-program",
  interlocation: "https://www.rmit.edu.vn/students/work-and-study-opportunities/global-experience-programs/rmit-interlocation-in-asia",
  shortPrograms: "https://www.rmit.edu.vn/students/work-and-study-opportunities/short-courses-and-programs/global-short-programs",
  shortProgramsPortal: "https://outbound.rmit.edu.au/_portal/program-discovery?search=%5B%7B%22filterType%22%3A%22programDiscoveryIsActive%22%2C%22filterValues%22%3A%5B%7B%22value%22%3Atrue%7D%5D%7D%2C%7B%22filterType%22%3A%22programDiscoveryProgramParameters%22%2C%22filterValues%22%3A%5B%7B%22id%22%3A10017%2C%22value%22%3A%22Active%22%7D%5D%7D%2C%7B%22filterType%22%3A%22programDiscoveryProgramParameters%22%2C%22filterValues%22%3A%5B%7B%22id%22%3A10009%2C%22value%22%3A%22Global%20Summer%20Programs%22%7D%5D%7D%5D",
  scholarships: "https://www.rmit.edu.vn/students/work-and-study-opportunities/global-experience-programs/global-experience-scholarships-grants",
  studyPlan: "https://www.rmit.edu.vn/students/work-and-study-opportunities/global-experience-programs/global-experience-study-plan",
  studyPlanSubmission: "https://rmit.service-now.com/connect_vn?id=sc_cat_item&sys_id=01a7f3024fe32a0025c7a8fe0310c7dd",
  crossCampusStudyPlanForm: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/global-experiences/cross-campus-study-plan-form.xlsx",
  crossCampusStudyPlanExample: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/global-experiences/cross-campus-study-plan-example.xlsx",
  partnerStudyPlanForm: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/global-experiences/partner-short-term-study-plan-form2.xlsx",
  partnerStudyPlanExample: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/global-experiences/partner-study-plan-example2.xlsx",
  studentStories: "https://www.rmit.edu.vn/study-at-rmit/global-experiences/exchange-student-stories",
  melbourneCityCampus: "https://www.rmit.edu.au/about/our-locations-and-facilities/locations/melbourne-city-campus",
  permanentTransfer: "https://www.rmit.edu.vn/students/work-and-study-opportunities/permanent-transfer-to-melbourne",
  partnerMobi: "https://outbound.rmit.edu.au/index.cfm?FuseAction=Programs.ViewProgramAngular&id=11522",
  crossCampusStudyLink: "https://student-rmit.studylink.com/index.cfm?event=security.showLogin&msg=eventsecured&fr=sp&en=default",
  interlocationMobi: "https://outbound.rmit.edu.au/index.cfm?FuseAction=Programs.ViewProgramAngular&id=11794",
  consultation: "https://outlook.office365.com/book/GlobalExperienceConsultation5@rmiteduau.onmicrosoft.com/?login_hint",
} as const;

export const GLOBAL_EXPERIENCE_PROGRAMS: GlobalExperienceProgram[] = [
  {
    id: "partner-exchange",
    title: { en: "Partner Exchange Worldwide", vi: "Trao đổi với các trường đối tác" },
    summary: {
      en: "Study for one or two semesters at an RMIT partner university overseas. You remain enrolled at RMIT Vietnam and continue paying tuition to RMIT Vietnam; no tuition is paid to the host university.",
      vi: "Học một hoặc hai học kỳ tại trường đại học đối tác của RMIT ở nước ngoài. Bạn vẫn đăng ký học tại RMIT Việt Nam và đóng học phí cho RMIT Việt Nam; không đóng học phí cho trường đối tác.",
    },
    destination: {
      en: "RMIT lists 200+ partner universities across 40+ countries. Examples include the USA, France, Canada, Denmark, the UK, Singapore, Spain and Sweden. Course and place availability depend on your study area and the current Mobi profile.",
      vi: "RMIT liệt kê hơn 200 trường đối tác tại hơn 40 quốc gia. Một số điểm đến được nêu gồm Mỹ, Pháp, Canada, Đan Mạch, Anh, Singapore, Tây Ban Nha và Thụy Điển. Khả năng chọn môn và chỉ tiêu tùy ngành học và hồ sơ Mobi hiện hành.",
    },
    duration: { en: "1–2 semesters", vi: "1–2 học kỳ" },
    comparisonEligibility: {
      en: "RMIT Vietnam Bachelor or Master; age 18+; GPA ≥2.0/4.0 and 72 Bachelor / 36 Master RMIT credit points before nomination. A first-semester exception applies before nomination.",
      vi: "Đang học Cử nhân hoặc Thạc sĩ tại RMIT Việt Nam; từ 18 tuổi; GPA ≥2.0/4.0 và hoàn thành 72 tín chỉ Cử nhân / 36 tín chỉ Thạc sĩ trước khi được đề cử. Sinh viên học kỳ đầu có ngoại lệ trước khi được đề cử.",
    },
    tuitionAndCosts: {
      en: "Continue paying RMIT Vietnam tuition; the host university does not charge tuition for the exchange place. Students budget separately for travel, accommodation, living costs, visa and insurance where applicable.",
      vi: "Tiếp tục đóng học phí RMIT Việt Nam; trường đối tác không thu học phí cho vị trí trao đổi. Sinh viên tự dự trù vé máy bay, chỗ ở, sinh hoạt phí, visa và bảo hiểm nếu áp dụng.",
    },
    eligibility: [
      { en: "Be currently enrolled in an RMIT Vietnam Bachelor or Master program.", vi: "Đang theo học chương trình Cử nhân hoặc Thạc sĩ tại RMIT Việt Nam." },
      { en: "Before nomination: be at least 18, have a minimum GPA of 2.0/4.0, and complete 72 RMIT credit points for Bachelor or 36 for Master. External transferred credits do not count toward this threshold.", vi: "Trước khi được đề cử: đủ 18 tuổi, GPA tối thiểu 2.0/4.0 và hoàn thành 72 tín chỉ RMIT đối với Cử nhân hoặc 36 đối với Thạc sĩ. Tín chỉ chuyển từ bên ngoài không tính vào ngưỡng này." },
      { en: "First-semester students may apply before meeting the GPA/credit threshold, but must meet it before nomination. Host universities may set higher or course-specific requirements.", vi: "Sinh viên học kỳ đầu có thể nộp hồ sơ trước khi đạt ngưỡng GPA/tín chỉ, nhưng phải đáp ứng trước khi được đề cử. Trường đối tác có thể yêu cầu GPA hoặc điều kiện môn học cao hơn." },
      { en: "RMIT states that students cannot exchange to a host country where they hold the same nationality.", vi: "RMIT lưu ý sinh viên không thể trao đổi đến quốc gia nơi mình có cùng quốc tịch." },
    ],
    applicationSteps: [
      { en: "Review partner profiles in Mobi: language, courses for exchange students, term availability, demand level and host-specific GPA requirements. Rank up to four preferences; RMIT recommends including at least one low-demand option.", vi: "Xem hồ sơ trường đối tác trên Mobi: ngôn ngữ, môn dành cho sinh viên trao đổi, kỳ học, mức độ cạnh tranh và GPA riêng. Xếp tối đa bốn nguyện vọng; RMIT khuyến nghị có ít nhất một lựa chọn mức nhu cầu thấp." },
      { en: "Submit the Mobi application and questionnaires by the intake deadline. Upload a passport information page; RMIT says the passport must remain valid for at least six months after the exchange ends.", vi: "Nộp đơn Mobi và các câu hỏi trước hạn của đợt tuyển. Tải trang thông tin hộ chiếu; RMIT yêu cầu hộ chiếu còn hạn ít nhất sáu tháng sau khi kết thúc trao đổi." },
      { en: "RMIT reviews and allocates applicants. If nominated, accept the allocation in Mobi (Commit) and attend the Get Set briefing.", vi: "RMIT xét và phân bổ sinh viên. Nếu được đề cử, xác nhận phân bổ trên Mobi (Commit) và tham gia buổi Get Set." },
      { en: "Prepare and submit a Study Plan to Student Connect. Partner Study Plans take 15 working days after all required documents are received; upload the approved plan to Mobi by the required timeline.", vi: "Chuẩn bị và nộp Study Plan cho Student Connect. Study Plan đối tác được xử lý trong 15 ngày làm việc sau khi nhận đủ hồ sơ; tải bản đã duyệt lên Mobi đúng thời hạn." },
      { en: "After nomination, follow the host university's separate application instructions and deadline. RMIT nomination is not host acceptance; wait for the host's official acceptance before booking travel or applying for a visa.", vi: "Sau khi được đề cử, làm theo hướng dẫn và hạn nộp riêng của trường tiếp nhận. Đề cử của RMIT không đồng nghĩa được trường nhận; chờ thư chấp nhận chính thức trước khi đặt vé hoặc xin visa." },
      { en: "Attend the pre-departure session and check RMIT Vietnam enrolment/payment requirements for the exchange semester.", vi: "Tham gia buổi tiền khởi hành và kiểm tra yêu cầu đăng ký môn/thanh toán của RMIT Việt Nam cho học kỳ trao đổi." },
    ],
    requiredDocuments: [
      { en: "Passport information page; passport valid at least six months after the exchange ends.", vi: "Trang thông tin hộ chiếu; hộ chiếu còn hạn ít nhất sáu tháng sau ngày kết thúc trao đổi." },
      { en: "Mobi application questionnaires and preference choices.", vi: "Các câu hỏi trong đơn Mobi và danh sách nguyện vọng." },
      { en: "For Study Plan approval: host course codes, course outlines/syllabi, learning outcomes, topics, workload, assessment and prerequisites, with source links. Host-specific documents may also apply.", vi: "Để duyệt Study Plan: mã môn của trường đối tác, đề cương, chuẩn đầu ra, nội dung, khối lượng học, đánh giá, môn tiên quyết và liên kết nguồn. Có thể có hồ sơ riêng của trường tiếp nhận." },
    ],
    applicationPortalUrl: GLOBAL_EXPERIENCE_URLS.partnerMobi,
    applicationPortalLabel: { en: "View Mobi application portal", vi: "Mở cổng đăng ký Mobi" },
    informationUrl: GLOBAL_EXPERIENCE_URLS.partnerExchange,
    instructionsUrl: GLOBAL_EXPERIENCE_URLS.partnerExchangeInstructions,
    notes: {
      en: "The March 2025 undergraduate/postgraduate partner PDFs are dated references. Use the live Mobi partner list for current host availability. Demand-tier GPA figures on partner profiles are indicative and can differ by host.",
      vi: "PDF danh sách đối tác bậc Đại học/Sau đại học tháng 3/2025 chỉ là tài liệu tham khảo có ngày. Dùng danh sách Mobi trực tiếp để xem chỉ tiêu hiện tại. GPA theo mức nhu cầu trên hồ sơ đối tác chỉ mang tính tham khảo và có thể khác theo trường.",
    },
    cycles: [
      { id: "partner-s1-2027", programId: "partner-exchange", label: { en: "Semester 1, 2027", vi: "Học kỳ 1, 2027" }, opensOn: "2026-03-02", closesOn: "2026-05-15", deadlineTimeZone: "Australia/Melbourne", applicationUrl: GLOBAL_EXPERIENCE_URLS.partnerMobi },
      { id: "partner-s2-2027", programId: "partner-exchange", label: { en: "Semester 2, 2027", vi: "Học kỳ 2, 2027" }, opensOn: "2026-08-03", closesOn: "2026-09-30", deadlineTimeZone: "Australia/Melbourne", applicationUrl: GLOBAL_EXPERIENCE_URLS.partnerMobi },
    ],
  },
  {
    id: "cross-campus-melbourne",
    title: { en: "Cross-campus to RMIT Melbourne (temporary study)", vi: "Cross-campus tại RMIT Melbourne (học tạm thời)" },
    summary: {
      en: "Study one or two semesters (up to one year) at RMIT Melbourne while remaining enrolled full-time at RMIT Vietnam and paying your usual RMIT Vietnam tuition. This is not a permanent transfer.",
      vi: "Học một hoặc hai học kỳ (tối đa một năm) tại RMIT Melbourne trong khi vẫn đăng ký học toàn thời gian tại RMIT Việt Nam và đóng mức học phí thông thường tại Việt Nam. Đây không phải chuyển tiếp vĩnh viễn.",
    },
    destination: { en: "RMIT Melbourne campuses, Australia", vi: "Các cơ sở RMIT tại Melbourne, Úc" },
    duration: { en: "1–2 semesters (up to one year)", vi: "1–2 học kỳ (tối đa một năm)" },
    comparisonEligibility: {
      en: "RMIT Vietnam Bachelor or Master; age 18+; GPA ≥2.0/4.0; 72 Bachelor / 36 Master RMIT credit points. RMIT also lists two completed Vietnam semesters for Bachelor or one for Master.",
      vi: "Đang học Cử nhân hoặc Thạc sĩ tại RMIT Việt Nam; từ 18 tuổi; GPA ≥2.0/4.0; hoàn thành 72 tín chỉ Cử nhân / 36 tín chỉ Thạc sĩ. RMIT cũng nêu yêu cầu đã học hai học kỳ tại Việt Nam với Cử nhân hoặc một học kỳ với Thạc sĩ.",
    },
    tuitionAndCosts: {
      en: "Continue paying RMIT Vietnam tuition at the Vietnam rate. Budget separately for flights, accommodation, daily costs, Overseas Student Health Cover (OSHC), visa and other travel expenses.",
      vi: "Tiếp tục đóng học phí RMIT Việt Nam theo mức tại Việt Nam. Tự dự trù vé máy bay, chỗ ở, sinh hoạt phí, OSHC, visa và các chi phí đi lại khác.",
    },
    eligibility: [
      { en: "Be enrolled in an RMIT Vietnam Bachelor or Master program and be at least 18.", vi: "Đang theo học chương trình Cử nhân hoặc Thạc sĩ tại RMIT Việt Nam và đủ 18 tuổi." },
      { en: "Minimum GPA: 2.0/4.0. Complete at least 72 RMIT credit points for Bachelor or 36 for Master; external transferred credits do not count.", vi: "GPA tối thiểu 2.0/4.0. Hoàn thành ít nhất 72 tín chỉ RMIT đối với Cử nhân hoặc 36 đối với Thạc sĩ; tín chỉ chuyển từ bên ngoài không tính." },
      { en: "RMIT's cross-campus information page says students should complete at least two semesters in Vietnam for undergraduate study or one semester for postgraduate study before applying; confirm your program-specific eligibility with Global Experience.", vi: "Trang thông tin Cross-campus của RMIT nêu sinh viên Cử nhân nên hoàn thành ít nhất hai học kỳ tại Việt Nam, hoặc một học kỳ đối với Sau đại học, trước khi nộp hồ sơ; hãy xác nhận điều kiện riêng của chương trình với Global Experience." },
    ],
    applicationSteps: [
      { en: "Check remaining program requirements and prepare an approved Study Plan with courses available at the Melbourne campus.", vi: "Kiểm tra các môn còn lại trong chương trình và chuẩn bị Study Plan đã được duyệt với các môn có tại cơ sở Melbourne." },
      { en: "Apply through StudyLink by the intake deadline. Upload a valid passport and approved Study Plan(s); RMIT Melbourne may request additional documents.", vi: "Nộp hồ sơ qua StudyLink trước hạn của đợt. Tải hộ chiếu hợp lệ và Study Plan đã duyệt; RMIT Melbourne có thể yêu cầu hồ sơ bổ sung." },
      { en: "If successful, follow the offer letter instructions, accept the offer, arrange OSHC and complete the required payment before RMIT issues an eCOE.", vi: "Nếu được chấp nhận, làm theo thư mời, xác nhận nhập học, sắp xếp OSHC và thanh toán theo yêu cầu trước khi RMIT cấp eCOE." },
      { en: "Use the eCOE to apply for an Australian Student Visa (subclass 500) if required for your circumstances. Visa applications are the student's responsibility.", vi: "Dùng eCOE để xin visa du học Úc (Subclass 500) nếu áp dụng cho trường hợp của bạn. Sinh viên tự chịu trách nhiệm nộp hồ sơ visa." },
      { en: "Attend pre-departure and confirm enrolment, tuition and course changes with RMIT Vietnam and RMIT Melbourne.", vi: "Tham gia buổi tiền khởi hành và xác nhận đăng ký, học phí, thay đổi môn với RMIT Việt Nam và RMIT Melbourne." },
    ],
    requiredDocuments: [
      { en: "Passport information page; passport valid at least six months after the program ends.", vi: "Trang thông tin hộ chiếu; hộ chiếu còn hạn ít nhất sáu tháng sau khi chương trình kết thúc." },
      { en: "Approved Cross-campus Study Plan(s). Course availability and host approval are not guaranteed by the Study Plan approval.", vi: "Study Plan Cross-campus đã được duyệt. Việc duyệt Study Plan không đảm bảo môn học còn chỗ hoặc được cơ sở tiếp nhận chấp nhận." },
      { en: "Additional documents may be listed in your StudyLink application or offer letter; OSHC and visa documents are needed after an offer, if applicable.", vi: "Hồ sơ bổ sung có thể được liệt kê trong StudyLink hoặc thư mời; giấy tờ OSHC/visa cần sau khi nhận thư mời nếu áp dụng." },
    ],
    applicationPortalUrl: GLOBAL_EXPERIENCE_URLS.crossCampusStudyLink,
    applicationPortalLabel: { en: "View StudyLink portal", vi: "Mở cổng StudyLink" },
    informationUrl: GLOBAL_EXPERIENCE_URLS.crossCampus,
    instructionsUrl: GLOBAL_EXPERIENCE_URLS.crossCampusInstructions,
    notes: {
      en: "Study Plans for Cross-campus are processed in about 10 working days after complete documents are submitted. Prepare the plan at least two months before the application deadline. Full-time study in Australia is normally 48 credit points per semester; RMIT lists limited program-specific 36-credit-point exceptions.",
      vi: "Study Plan Cross-campus được xử lý khoảng 10 ngày làm việc sau khi nộp đủ hồ sơ. Nên chuẩn bị ít nhất hai tháng trước hạn nộp. Khối lượng toàn thời gian ở Úc thường là 48 tín chỉ mỗi học kỳ; RMIT có một số ngoại lệ 36 tín chỉ theo chương trình cụ thể.",
    },
    cycles: [
      { id: "cross-campus-s1-2027", programId: "cross-campus-melbourne", label: { en: "Semester 1, 2027", vi: "Học kỳ 1, 2027" }, opensOn: "2026-07-31", closesOn: "2026-08-31", deadlineTimeZone: "Australia/Melbourne", applicationUrl: GLOBAL_EXPERIENCE_URLS.crossCampusStudyLink },
      { id: "cross-campus-s2-2027", programId: "cross-campus-melbourne", label: { en: "Semester 2, 2027", vi: "Học kỳ 2, 2027" }, opensOn: "2027-01-04", closesOn: "2027-02-01", deadlineTimeZone: "Australia/Melbourne", applicationUrl: GLOBAL_EXPERIENCE_URLS.crossCampusStudyLink },
    ],
  },
  {
    id: "interlocation-asia",
    title: { en: "RMIT Interlocation in Asia", vi: "RMIT Interlocation tại châu Á" },
    summary: {
      en: "Study at an RMIT interlocation partner in Singapore or Hong Kong. The RMIT page names Singapore Institute of Management (SIM), Hong Kong Arts School and VTC SHAPE; it also refers to four partners, so check Mobi for the current complete list.",
      vi: "Học tại đối tác Interlocation của RMIT ở Singapore hoặc Hồng Kông. Trang RMIT nêu Singapore Institute of Management (SIM), Hong Kong Arts School và VTC SHAPE; trang cũng đề cập bốn đối tác, vì vậy hãy kiểm tra Mobi để xem danh sách hiện hành đầy đủ.",
    },
    destination: { en: "Singapore and Hong Kong; host and course options vary by Mobi listing", vi: "Singapore và Hồng Kông; trường tiếp nhận và môn học tùy danh sách Mobi" },
    duration: { en: "Host-program length varies; confirm in Mobi", vi: "Thời lượng tùy chương trình của trường tiếp nhận; xác nhận trên Mobi" },
    comparisonEligibility: {
      en: "RMIT Bachelor only; age 18+; GPA ≥2.0/4.0 and at least 72 RMIT credit points.",
      vi: "Chỉ dành cho sinh viên Cử nhân RMIT; từ 18 tuổi; GPA ≥2.0/4.0 và hoàn thành ít nhất 72 tín chỉ RMIT.",
    },
    tuitionAndCosts: {
      en: "Continue paying RMIT Vietnam tuition at the Vietnam rate. Budget separately for travel, accommodation, living costs and any host-country visa/insurance requirements.",
      vi: "Tiếp tục đóng học phí RMIT Việt Nam theo mức tại Việt Nam. Tự dự trù vé máy bay, chỗ ở, sinh hoạt phí và yêu cầu visa/bảo hiểm của quốc gia tiếp nhận nếu có.",
    },
    eligibility: [
      { en: "Be currently enrolled in an RMIT Bachelor program (the official page does not list Master programs for this pathway).", vi: "Đang theo học chương trình Cử nhân tại RMIT (trang chính thức không liệt kê chương trình Thạc sĩ cho lộ trình này)." },
      { en: "Be at least 18, have a minimum GPA of 2.0/4.0 and complete at least 72 RMIT credit points; external transferred credits do not count.", vi: "Đủ 18 tuổi, GPA tối thiểu 2.0/4.0 và hoàn thành ít nhất 72 tín chỉ RMIT; tín chỉ chuyển từ bên ngoài không tính." },
      { en: "For Vietnamese nationals and some other nationalities, Hong Kong study-visa applications may be assessed case by case and take longer.", vi: "Đối với công dân Việt Nam và một số quốc tịch khác, hồ sơ visa học tập Hồng Kông có thể được xét từng trường hợp và mất nhiều thời gian hơn." },
    ],
    applicationSteps: [
      { en: "Review the Mobi profiles and select one eligible interlocation partner; confirm courses, language and host requirements.", vi: "Xem hồ sơ Mobi và chọn một đối tác Interlocation đủ điều kiện; xác nhận môn học, ngôn ngữ và yêu cầu của trường tiếp nhận." },
      { en: "Prepare a Study Plan with remaining RMIT Vietnam courses and submit it to Student Connect. Processing takes about 10 working days after complete documents are received.", vi: "Chuẩn bị Study Plan với các môn RMIT Việt Nam còn lại và nộp cho Student Connect. Hồ sơ được xử lý khoảng 10 ngày làm việc sau khi nhận đủ tài liệu." },
      { en: "Submit the Mobi application by the published deadline with a valid passport and approved Study Plan(s).", vi: "Nộp hồ sơ Mobi trước hạn công bố, kèm hộ chiếu hợp lệ và Study Plan đã duyệt." },
      { en: "If nominated, follow the host university's application and visa steps. RMIT nomination does not guarantee host acceptance.", vi: "Nếu được đề cử, làm theo quy trình nộp hồ sơ và visa của trường tiếp nhận. Đề cử của RMIT không đảm bảo được trường nhận." },
    ],
    requiredDocuments: [
      { en: "Passport information page; valid at least six months after the program ends.", vi: "Trang thông tin hộ chiếu; còn hạn ít nhất sáu tháng sau khi chương trình kết thúc." },
      { en: "Approved Study Plan(s) and any course information required for credit assessment.", vi: "Study Plan đã duyệt và thông tin môn học cần cho xét công nhận tín chỉ." },
      { en: "Host-specific application and visa documents; Hong Kong visa processing may take longer for Vietnamese nationals and some other nationalities.", vi: "Hồ sơ nộp trường tiếp nhận và visa theo yêu cầu riêng; visa Hồng Kông có thể mất nhiều thời gian hơn với công dân Việt Nam và một số quốc tịch khác." },
    ],
    applicationPortalUrl: GLOBAL_EXPERIENCE_URLS.interlocationMobi,
    applicationPortalLabel: { en: "View Mobi interlocation portal", vi: "Mở cổng Interlocation trên Mobi" },
    informationUrl: GLOBAL_EXPERIENCE_URLS.interlocation,
    instructionsUrl: GLOBAL_EXPERIENCE_URLS.interlocation,
    notes: {
      en: "The source lists three named partner programs but says there are four partners. The fourth was not named in the checked public page; use the Mobi portal for current availability rather than inferring a partner.",
      vi: "Nguồn liệt kê ba chương trình đối tác có tên nhưng nói có bốn đối tác. Trang công khai đã kiểm tra không nêu tên đối tác thứ tư; hãy dùng Mobi để xem khả năng tham gia hiện tại, không tự suy đoán.",
    },
    cycles: [
      { id: "interlocation-s1-2027", programId: "interlocation-asia", label: { en: "Semester 1, 2027", vi: "Học kỳ 1, 2027" }, opensOn: "2026-06-15", closesOn: "2026-08-30", deadlineTimeZone: "Australia/Melbourne", applicationUrl: GLOBAL_EXPERIENCE_URLS.interlocationMobi },
      { id: "interlocation-s2-2027", programId: "interlocation-asia", label: { en: "Semester 2, 2027", vi: "Học kỳ 2, 2027" }, opensOn: "2027-02-01", closesOn: "2027-02-28", deadlineTimeZone: "Australia/Melbourne", applicationUrl: GLOBAL_EXPERIENCE_URLS.interlocationMobi },
    ],
  },
  {
    id: "global-short-programs",
    title: { en: "Global Short Programs", vi: "Chương trình toàn cầu ngắn hạn" },
    summary: {
      en: "Short overseas study tours, summer/winter programs and courses run for about one to four weeks. Credit is awarded when the program's required assessment is completed and the study plan is approved.",
      vi: "Các chuyến học tập, chương trình hè/đông và khóa học ở nước ngoài thường kéo dài khoảng một đến bốn tuần. Tín chỉ được công nhận khi hoàn thành bài đánh giá bắt buộc và Study Plan được duyệt.",
    },
    destination: { en: "Varies by active host program in the Mobi discovery portal", vi: "Tùy chương trình đang mở của trường tiếp nhận trên Mobi" },
    duration: { en: "1–4 weeks, depending on program", vi: "1–4 tuần, tùy chương trình" },
    comparisonEligibility: {
      en: "Requirements, prerequisites and places vary by the active individual program listing.",
      vi: "Điều kiện, môn tiên quyết và chỉ tiêu tùy theo hồ sơ chương trình đang mở.",
    },
    tuitionAndCosts: {
      en: "For listings coded STX (Study Exchange), the official page says you continue paying RMIT Vietnam tuition. Fees for other short-program formats are listing-specific; check the Mobi program details before applying.",
      vi: "Với chương trình mã STX (Study Exchange), trang chính thức nêu sinh viên tiếp tục đóng học phí RMIT Việt Nam. Phí của các loại chương trình ngắn hạn khác tùy từng danh sách; hãy kiểm tra chi tiết trên Mobi trước khi nộp.",
    },
    eligibility: [
      { en: "Eligibility, prerequisites, host places and costs vary by program; review the individual Mobi listing and consult your School about academic fit.", vi: "Điều kiện, môn tiên quyết, chỉ tiêu và chi phí tùy từng chương trình; xem hồ sơ Mobi và hỏi School về mức độ phù hợp học thuật." },
      { en: "Confirm that the program duration fits your RMIT semester and study plan.", vi: "Xác nhận thời lượng chương trình phù hợp với học kỳ và Study Plan RMIT." },
    ],
    applicationSteps: [
      { en: "Search active Global Summer Programs in Mobi; RMIT advises searching STX listings for Study Exchange programs.", vi: "Tìm chương trình Global Summer đang hoạt động trên Mobi; RMIT khuyến nghị tìm mã STX cho chương trình Study Exchange." },
      { en: "Check the specific destination, eligibility, dates, costs, assessment and host instructions in that program's listing.", vi: "Kiểm tra điểm đến, điều kiện, ngày, chi phí, bài đánh giá và hướng dẫn của trường tiếp nhận trong hồ sơ chương trình." },
      { en: "For STX, submit a Study Plan to Student Connect, then complete the Mobi and host applications by their stated deadlines.", vi: "Với STX, nộp Study Plan cho Student Connect rồi hoàn thành đơn Mobi và hồ sơ của trường tiếp nhận đúng các hạn được nêu." },
      { en: "Confirm credit and course suitability with your School before committing to travel.", vi: "Xác nhận việc công nhận tín chỉ và mức độ phù hợp môn học với School trước khi quyết định đi." },
    ],
    requiredDocuments: [
      { en: "Program-specific items in Mobi; STX applications may require a valid passport and approved Study Plan.", vi: "Tài liệu riêng theo hồ sơ Mobi; đơn STX có thể yêu cầu hộ chiếu hợp lệ và Study Plan đã duyệt." },
      { en: "Host-specific visa, health-cover and travel documents where applicable.", vi: "Giấy tờ visa, bảo hiểm và đi lại theo yêu cầu của nước tiếp nhận nếu áp dụng." },
    ],
    applicationPortalUrl: GLOBAL_EXPERIENCE_URLS.shortProgramsPortal,
    applicationPortalLabel: { en: "View active program listings", vi: "Xem chương trình đang được đăng" },
    informationUrl: GLOBAL_EXPERIENCE_URLS.shortPrograms,
    instructionsUrl: GLOBAL_EXPERIENCE_URLS.shortPrograms,
    notes: {
      en: "RMIT gives typical application windows: Winter term (June–July), applications around March–May of the same year; Summer term (January–February), applications around September–November of the previous year. These are indicative, not current program deadlines. The linked discovery portal is filtered to active Global Summer Programs; availability changes by listing.",
      vi: "RMIT nêu khung thời gian thường gặp: Winter (tháng 6–7), thường mở hồ sơ khoảng tháng 3–5 cùng năm; Summer (tháng 1–2), thường mở khoảng tháng 9–11 năm trước. Đây là khung tham khảo, không phải hạn hiện tại của từng chương trình. Cổng khám phá được liên kết lọc Global Summer đang hoạt động; khả năng tham gia thay đổi theo từng hồ sơ.",
    },
    cycles: [],
  },
];

export const GLOBAL_EXPERIENCE_SCHOLARSHIPS = [
  {
    id: "erasmus-general",
    title: { en: "Erasmus+ partner funding", vi: "Hỗ trợ Erasmus+ theo trường đối tác" },
    intake: { en: "Availability varies by partner and academic year", vi: "Tùy trường đối tác và năm học" },
    amount: { en: "Funding can include a monthly stipend and/or travel support; amount and availability vary annually by partner.", vi: "Có thể gồm trợ cấp hàng tháng và/hoặc hỗ trợ đi lại; mức và khả năng có quỹ thay đổi hằng năm theo trường đối tác." },
    eligibility: { en: "Only for students allocated to a European partner with Erasmus+ availability for that academic year.", vi: "Chỉ dành cho sinh viên được phân bổ vào trường đối tác châu Âu có quỹ Erasmus+ trong năm học đó." },
    application: { en: "Invitation-based: eligible students are contacted directly. No public scholarship application form is listed.", vi: "Theo thư mời: sinh viên đủ điều kiện được liên hệ trực tiếp. Nguồn không liệt kê đơn đăng ký học bổng công khai." },
    partnerDeadline: undefined,
    sourceUrl: GLOBAL_EXPERIENCE_URLS.scholarships,
  },
  {
    id: "erasmus-aarhus-s1-2027",
    title: { en: "Erasmus+ Grant — Aarhus University", vi: "Trợ cấp Erasmus+ — Aarhus University" },
    intake: { en: "Semester 1, 2027", vi: "Học kỳ 1, 2027" },
    amount: { en: "Up to €900/month for at most five months, plus €1,735 travel support.", vi: "Tối đa €900/tháng trong tối đa năm tháng, cộng €1.735 hỗ trợ chi phí đi lại." },
    eligibility: { en: "Students allocated and nominated to Aarhus University for Partner Exchange S1 2027; grant steps follow host acceptance.", vi: "Sinh viên được phân bổ và đề cử đến Aarhus University theo Partner Exchange Học kỳ 1/2027; bước xin trợ cấp được hướng dẫn sau khi trường tiếp nhận chấp nhận." },
    application: { en: "RMIT says eligible students will be contacted after acceptance. The Partner Exchange prerequisite deadline was 15 May 2026 (passed).", vi: "RMIT cho biết sinh viên đủ điều kiện sẽ được liên hệ sau khi được trường nhận. Hạn Partner Exchange cần đáp ứng là 15/05/2026 (đã qua)." },
    partnerDeadline: "2026-05-15",
    sourceUrl: GLOBAL_EXPERIENCE_URLS.scholarships,
  },
  {
    id: "erasmus-aalto-s1-2027",
    title: { en: "Erasmus+ Grant — Aalto University", vi: "Trợ cấp Erasmus+ — Aalto University" },
    intake: { en: "Semester 1, 2027", vi: "Học kỳ 1, 2027" },
    amount: { en: "Up to €900/month for at most five months, plus €1,735 travel support.", vi: "Tối đa €900/tháng trong tối đa năm tháng, cộng €1.735 hỗ trợ chi phí đi lại." },
    eligibility: { en: "RMIT Vietnam Business and Engineering students allocated to Aalto University for Partner Exchange S1 2027.", vi: "Sinh viên khối Kinh doanh và Kỹ thuật RMIT Việt Nam được phân bổ đến Aalto University theo Partner Exchange Học kỳ 1/2027." },
    application: { en: "RMIT says eligible students will be contacted after acceptance. The Partner Exchange prerequisite deadline was 15 May 2026 (passed).", vi: "RMIT cho biết sinh viên đủ điều kiện sẽ được liên hệ sau khi được trường nhận. Hạn Partner Exchange cần đáp ứng là 15/05/2026 (đã qua)." },
    partnerDeadline: "2026-05-15",
    sourceUrl: GLOBAL_EXPERIENCE_URLS.scholarships,
  },
  {
    id: "erasmus-aalto-s2-2027",
    title: { en: "Erasmus+ Grant — Aalto University", vi: "Trợ cấp Erasmus+ — Aalto University" },
    intake: { en: "Semester 2, 2027", vi: "Học kỳ 2, 2027" },
    amount: { en: "Up to €900/month for at most five months, plus €1,735 travel support.", vi: "Tối đa €900/tháng trong tối đa năm tháng, cộng €1.735 hỗ trợ chi phí đi lại." },
    eligibility: { en: "Students allocated to Aalto for S2 2027 who plan to take courses in the eligible schools listed by RMIT; check prerequisites in the official scholarship details.", vi: "Sinh viên được phân bổ đến Aalto Học kỳ 2/2027 và dự định học môn tại các khoa đủ điều kiện RMIT liệt kê; kiểm tra môn tiên quyết trong thông tin học bổng chính thức." },
    application: { en: "The prerequisite Partner Exchange deadline was 30 September 2026 (passed); eligible students are contacted after host acceptance.", vi: "Hạn Partner Exchange cần đáp ứng là 30/09/2026 (đã qua); sinh viên đủ điều kiện được liên hệ sau khi trường tiếp nhận chấp nhận." },
    partnerDeadline: "2026-09-30",
    sourceUrl: GLOBAL_EXPERIENCE_URLS.scholarships,
  },
  {
    id: "erasmus-amfi-s2-2027",
    title: { en: "Erasmus+ Grant — Amsterdam Fashion Institute (AMFI)", vi: "Trợ cấp Erasmus+ — Amsterdam Fashion Institute (AMFI)" },
    intake: { en: "Semester 2, 2027", vi: "Học kỳ 2, 2027" },
    amount: { en: "Up to €900/month for at most five months, plus €1,735 travel support.", vi: "Tối đa €900/tháng trong tối đa năm tháng, cộng €1.735 hỗ trợ chi phí đi lại." },
    eligibility: { en: "RMIT Vietnam Fashion (Enterprise) students allocated to AMFI; RMIT notes participation in the Industry Challenge.", vi: "Sinh viên Fashion (Enterprise) RMIT Việt Nam được phân bổ đến AMFI; RMIT lưu ý người nhận trợ cấp tham gia Industry Challenge." },
    application: { en: "The prerequisite Partner Exchange deadline was 30 September 2026 (passed); eligible students are contacted after host acceptance.", vi: "Hạn Partner Exchange cần đáp ứng là 30/09/2026 (đã qua); sinh viên đủ điều kiện được liên hệ sau khi trường tiếp nhận chấp nhận." },
    partnerDeadline: "2026-09-30",
    sourceUrl: GLOBAL_EXPERIENCE_URLS.scholarships,
  },
  {
    id: "seed-canada-asean",
    title: { en: "SEED Canada–ASEAN Scholarships and Educational Exchanges", vi: "Học bổng và Trao đổi Giáo dục SEED Canada–ASEAN" },
    intake: { en: "Partner-specific; no current intake date listed", vi: "Tùy đối tác; chưa có ngày đợt hiện tại" },
    amount: { en: "The RMIT page does not state a universal award amount; availability depends on the Canadian partner and annual funding.", vi: "Trang RMIT không nêu một mức trợ cấp chung; khả năng có quỹ tùy trường đối tác Canada và nguồn tài trợ hằng năm." },
    eligibility: { en: "Only students allocated to a Canadian partner with SEED funding availability.", vi: "Chỉ dành cho sinh viên được phân bổ vào trường đối tác Canada có quỹ SEED." },
    application: { en: "Invitation-based; eligible students are contacted directly. The source lists no public application link or current deadline.", vi: "Theo thư mời; sinh viên đủ điều kiện được liên hệ trực tiếp. Nguồn không nêu liên kết đăng ký công khai hoặc hạn hiện tại." },
    partnerDeadline: undefined,
    sourceUrl: GLOBAL_EXPERIENCE_URLS.scholarships,
  },
] as const;

export const GLOBAL_EXPERIENCE_STUDY_PLAN = {
  overview: {
    en: "A Study Plan is RMIT Vietnam's approval of which host courses may transfer into your RMIT program. Approval does not guarantee the host will offer or accept a course; availability can change.",
    vi: "Study Plan là thỏa thuận RMIT Việt Nam duyệt các môn tại trường tiếp nhận có thể được công nhận vào chương trình RMIT của bạn. Được duyệt không đảm bảo trường tiếp nhận mở hoặc chấp nhận môn; khả năng học có thể thay đổi.",
  },
  steps: [
    {
      en: "Check your remaining program requirements in myRMIT and consult your Senior Academic Advisor/Program Coordinator about course fit.",
      vi: "Kiểm tra yêu cầu chương trình còn lại trên myRMIT và hỏi Senior Academic Advisor/Program Coordinator về mức độ phù hợp của môn học.",
    },
    {
      en: "Choose host courses open to exchange students in the correct term and study level; check course prerequisites, language and schedule.",
      vi: "Chọn môn dành cho sinh viên trao đổi ở đúng học kỳ và bậc học; kiểm tra môn tiên quyết, ngôn ngữ và thời khóa biểu.",
    },
    {
      en: "Provide course codes, outlines/syllabi, learning outcomes, content, workload, assessment, prerequisites and official source links.",
      vi: "Cung cấp mã môn, đề cương, chuẩn đầu ra, nội dung, khối lượng học, đánh giá, môn tiên quyết và liên kết nguồn chính thức.",
    },
    {
      en: "Submit the correct program template through Student Connect. The plan must be approved before you upload it to Mobi/StudyLink or complete host enrolment.",
      vi: "Nộp đúng biểu mẫu chương trình qua Student Connect. Study Plan phải được duyệt trước khi tải lên Mobi/StudyLink hoặc hoàn tất đăng ký tại trường tiếp nhận.",
    },
    {
      en: "If a host course is unavailable or your RMIT enrolment changes, contact Student Connect for an Additional Study Plan; do not assume an unapproved replacement will transfer.",
      vi: "Nếu môn tại trường tiếp nhận không còn mở hoặc đăng ký RMIT thay đổi, liên hệ Student Connect để làm Additional Study Plan; không mặc định môn thay thế chưa duyệt sẽ được công nhận.",
    },
  ],
  programLoads: [
    { en: "Cross-campus Melbourne: normally 48 credit points per semester in Australia. RMIT lists limited program-specific 36-credit-point exceptions.", vi: "Cross-campus Melbourne: thông thường 48 tín chỉ mỗi học kỳ ở Úc. RMIT nêu một số ngoại lệ 36 tín chỉ theo chương trình cụ thể." },
    { en: "Interlocation in Asia: 36–48 credit points per exchange semester, subject to both RMIT and host requirements.", vi: "Interlocation châu Á: 36–48 tín chỉ mỗi học kỳ trao đổi, tùy yêu cầu của RMIT và trường tiếp nhận." },
    { en: "Partner Exchange: meet the full-time load for both RMIT and the host; check host credit equivalency in Mobi. The RMIT page recommends 6–8 proposed courses as backup options.", vi: "Partner Exchange: đáp ứng khối lượng toàn thời gian của cả RMIT và trường tiếp nhận; kiểm tra quy đổi tín chỉ trên Mobi. RMIT khuyến nghị đề xuất 6–8 môn dự phòng." },
  ],
  processingTimes: [
    { en: "Partner Exchange Study Plan: 15 working days after complete documents are received.", vi: "Study Plan Partner Exchange: 15 ngày làm việc sau khi nhận đủ hồ sơ." },
    { en: "Cross-campus, Interlocation and STX short-program Study Plans: 10 working days after complete documents are received.", vi: "Study Plan Cross-campus, Interlocation và chương trình ngắn hạn STX: 10 ngày làm việc sau khi nhận đủ hồ sơ." },
  ],
} as const;

export const GLOBAL_EXPERIENCE_OFFICIAL_REFERENCES = [
  { title: "RMIT Global Experience programs", titleVi: "Các chương trình Global Experience của RMIT", url: GLOBAL_EXPERIENCE_URLS.overview },
  { title: "Partner Exchange worldwide", titleVi: "Partner Exchange toàn cầu", url: GLOBAL_EXPERIENCE_URLS.partnerExchange },
  { title: "Partner Exchange application instructions", titleVi: "Hướng dẫn đăng ký Partner Exchange", url: GLOBAL_EXPERIENCE_URLS.partnerExchangeInstructions },
  { title: "Current Partner Exchange list in Mobi", titleVi: "Danh sách Partner Exchange hiện tại trên Mobi", url: GLOBAL_EXPERIENCE_URLS.partnerList },
  { title: "Undergraduate partner list (March 2025 PDF)", titleVi: "Danh sách đối tác bậc Cử nhân (PDF tháng 3/2025)", url: GLOBAL_EXPERIENCE_URLS.partnerUndergraduateList },
  { title: "Postgraduate partner list (March 2025 PDF)", titleVi: "Danh sách đối tác bậc Sau đại học (PDF tháng 3/2025)", url: GLOBAL_EXPERIENCE_URLS.partnerPostgraduateList },
  { title: "Cross-campus to RMIT Melbourne", titleVi: "Cross-campus tại RMIT Melbourne", url: GLOBAL_EXPERIENCE_URLS.crossCampus },
  { title: "Cross-campus application instructions", titleVi: "Hướng dẫn đăng ký Cross-campus", url: GLOBAL_EXPERIENCE_URLS.crossCampusInstructions },
  { title: "RMIT Interlocation in Asia", titleVi: "RMIT Interlocation tại châu Á", url: GLOBAL_EXPERIENCE_URLS.interlocation },
  { title: "Global Short Programs", titleVi: "Global Short Programs", url: GLOBAL_EXPERIENCE_URLS.shortPrograms },
  { title: "Global Experience scholarships and grants", titleVi: "Học bổng và trợ cấp Global Experience", url: GLOBAL_EXPERIENCE_URLS.scholarships },
  { title: "Global Experience Study Plan", titleVi: "Study Plan Global Experience", url: GLOBAL_EXPERIENCE_URLS.studyPlan },
  { title: "Exchange student stories", titleVi: "Chia sẻ của sinh viên trao đổi", url: GLOBAL_EXPERIENCE_URLS.studentStories },
  { title: "RMIT Melbourne City campus", titleVi: "Cơ sở RMIT Melbourne City", url: GLOBAL_EXPERIENCE_URLS.melbourneCityCampus },
  { title: "Permanent transfer to Melbourne (separate pathway)", titleVi: "Chuyển tiếp vĩnh viễn sang Melbourne (lộ trình riêng)", url: GLOBAL_EXPERIENCE_URLS.permanentTransfer },
];

function dateInTimeZone(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getApplicationCycleStatus(cycle: GlobalApplicationCycle, now = new Date()): GlobalApplicationStatus {
  if (!cycle.opensOn || !cycle.closesOn) return "not_announced";
  const today = dateInTimeZone(now, cycle.deadlineTimeZone);
  if (today < cycle.opensOn) return "upcoming";
  if (today <= cycle.closesOn) return "open";
  return "closed";
}

export function getDeadlineStatus(deadline: string | undefined, now = new Date(), timeZone = "Australia/Melbourne"): GlobalApplicationStatus {
  if (!deadline) return "not_announced";
  return dateInTimeZone(now, timeZone) <= deadline ? "open" : "closed";
}

export function formatGlobalExperienceDate(date: string, language: "en" | "vi"): string {
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
}
