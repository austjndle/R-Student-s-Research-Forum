export type RecognitionLocalized = { en: string; vi: string };
export type RecognitionVerification = "verified" | "unavailable" | "needs_review";

export interface AcademicRecognitionRecord {
  id: string;
  name: RecognitionLocalized;
  institution: RecognitionLocalized;
  campus: RecognitionLocalized;
  school: RecognitionLocalized;
  academicYear: RecognitionLocalized;
  description: RecognitionLocalized;
  purpose: RecognitionLocalized;
  eligibility: RecognitionLocalized;
  gpa: RecognitionLocalized;
  ranking: RecognitionLocalized;
  credits: RecognitionLocalized;
  integrity: RecognitionLocalized;
  selection: RecognitionLocalized;
  nomination: RecognitionLocalized;
  schedule: RecognitionLocalized;
  benefits: RecognitionLocalized;
  certificate: RecognitionLocalized;
  financialSupport: RecognitionLocalized;
  enquiry: RecognitionLocalized;
  sourceTitle: RecognitionLocalized;
  sourceUrl: string;
  lastVerified: string;
  verificationStatus: RecognitionVerification;
}

const T = (en: string, vi: string): RecognitionLocalized => ({ en, vi });

export const ACADEMIC_RECOGNITION_LAST_VERIFIED = "2026-11-05";

export const ACADEMIC_RECOGNITION: readonly AcademicRecognitionRecord[] = [
  {
    id: "rmit-australia-sct-deans-list-2025",
    name: T("School of Computing Technologies Dean's List", "Dean's List của School of Computing Technologies"),
    institution: T("RMIT University Australia", "RMIT University Australia"),
    campus: T("Australia; campus is not specified on the checked page", "Australia; trang đã kiểm tra không nêu cơ sở cụ thể"),
    school: T("School of Computing Technologies", "School of Computing Technologies"),
    academicYear: T("2025 page / criteria currently published", "Trang năm 2025 / tiêu chí đang được công bố"),
    description: T("Academic recognition for high-achieving students who demonstrate outstanding performance in their program.", "Danh hiệu học thuật dành cho sinh viên có thành tích cao và thể hiện kết quả nổi bật trong chương trình."),
    purpose: T("Recognise academic excellence and consistent performance; the source describes possible CV, scholarship-application and employment/postgraduate-study value, not a tuition award.", "Ghi nhận thành tích học tập và sự ổn định; nguồn mô tả giá trị tiềm năng cho CV, hồ sơ học bổng, việc làm hoặc học sau đại học, không phải hỗ trợ học phí."),
    eligibility: T("Cumulative GPA above 3.0; top 3% of the cohort by GPA within program and year level; currently enrolled or graduated; other academic requirements must be met.", "GPA tích lũy trên 3.0; thuộc top 3% cohort theo GPA trong từng chương trình và năm học; đang học hoặc đã tốt nghiệp; phải đáp ứng các yêu cầu học vụ khác."),
    gpa: T("Cumulative GPA above 3.0.", "GPA tích lũy trên 3.0."),
    ranking: T("Top 3% of students in the cohort, calculated separately by program and year level.", "Top 3% sinh viên trong cohort, tính riêng theo chương trình và năm học."),
    credits: T("Year-level bands are published: 0–84 CP, 96–180 CP, 192–276 CP, 288–372 CP and 384+ CP. The page does not state a separate minimum completed-credit threshold beyond these bands.", "Nguồn công bố các khoảng CP theo năm: 0–84, 96–180, 192–276, 288–372 và từ 384 CP. Trang không nêu thêm ngưỡng tín chỉ tối thiểu riêng ngoài các khoảng này."),
    integrity: T("Discontinued, suspended or students with a history of academic misconduct may not be eligible; failed courses or invalid results may also exclude a student.", "Sinh viên bị ngừng học, đình chỉ hoặc có lịch sử vi phạm liêm chính học thuật có thể không đủ điều kiện; môn trượt hoặc kết quả không hợp lệ cũng có thể loại trừ."),
    selection: T("The published criteria describe record-based GPA and cohort ranking. No separate application or interview is described.", "Tiêu chí công bố dựa trên hồ sơ GPA và xếp hạng cohort. Không thấy mô tả đơn ứng tuyển hoặc phỏng vấn riêng."),
    nomination: T("No nomination or application process is published on the checked page.", "Trang đã kiểm tra không công bố quy trình đề cử hoặc ứng tuyển."),
    schedule: T("The checked page links a Dean's List 2025 page; a recurring announcement date was not confirmed.", "Trang đã kiểm tra liên kết trang Dean's List 2025; chưa xác nhận lịch công bố định kỳ."),
    benefits: T("Academic honour and public recognition on the Dean's List page; no financial benefit is stated.", "Danh hiệu học thuật và ghi nhận công khai trên trang Dean's List; không nêu lợi ích tài chính."),
    certificate: T("Certificate or transcript notation is not confirmed on the checked public page.", "Chưa xác nhận chứng nhận hoặc ghi chú trên bảng điểm từ trang công khai đã kiểm tra."),
    financialSupport: T("Not a scholarship; no tuition discount or financial support is published.", "Không phải học bổng; không công bố giảm học phí hoặc hỗ trợ tài chính."),
    enquiry: T("Ask the relevant RMIT Australia School of Computing Technologies office for current status.", "Liên hệ văn phòng School of Computing Technologies của RMIT Australia để hỏi tình trạng hiện tại."),
    sourceTitle: T("RMIT Australia School of Computing Technologies Dean's List", "Dean's List School of Computing Technologies RMIT Australia"),
    sourceUrl: "https://www.rmit.edu.au/about/schools-colleges/computing-technologies/school-of-computing-technologies-deans-list",
    lastVerified: ACADEMIC_RECOGNITION_LAST_VERIFIED,
    verificationStatus: "verified",
  },
  {
    id: "rmit-vietnam-sset-deans-list-status",
    name: T("SSET Dean's List / Dean's List at RMIT Vietnam", "Dean's List SSET / Dean's List tại RMIT Việt Nam"),
    institution: T("RMIT University Vietnam", "RMIT University Việt Nam"),
    campus: T("Saigon South and Hanoi scope not publicly confirmed", "Chưa xác nhận công khai phạm vi Nam Sài Gòn và Hà Nội"),
    school: T("School of Science, Engineering & Technology (SSET)", "Khoa Khoa học, Kỹ thuật & Công nghệ (SSET)"),
    academicYear: T("Not publicly confirmed", "Chưa được công khai xác nhận"),
    description: T("A Vietnam-specific SSET Dean's List could not be verified from the checked official public sources.", "Không thể xác minh Dean's List riêng của SSET Việt Nam từ các nguồn chính thức công khai đã kiểm tra."),
    purpose: T("Not publicly confirmed.", "Chưa được công khai xác nhận."),
    eligibility: T("Eligibility criteria not publicly confirmed.", "Eligibility criteria not publicly confirmed."),
    gpa: T("Not publicly confirmed.", "Chưa được công khai xác nhận."),
    ranking: T("Not publicly confirmed.", "Chưa được công khai xác nhận."),
    credits: T("Not publicly confirmed.", "Chưa được công khai xác nhận."),
    integrity: T("Not publicly confirmed.", "Chưa được công khai xác nhận."),
    selection: T("Not publicly confirmed.", "Chưa được công khai xác nhận."),
    nomination: T("No official application or nomination process was found in the checked public sources. Do not show an Apply Now action.", "Không tìm thấy quy trình ứng tuyển hoặc đề cử chính thức trong các nguồn công khai đã kiểm tra. Không hiển thị nút Apply Now."),
    schedule: T("Not publicly confirmed.", "Chưa được công khai xác nhận."),
    benefits: T("Not publicly confirmed; do not treat this record as a scholarship or tuition discount.", "Chưa được công khai xác nhận; không coi bản ghi này là học bổng hoặc giảm học phí."),
    certificate: T("Not publicly confirmed.", "Chưa được công khai xác nhận."),
    financialSupport: T("Not a verified scholarship record; no financial support may be inferred.", "Không phải bản ghi học bổng đã xác minh; không được suy luận có hỗ trợ tài chính."),
    enquiry: T("Contact SSET at sset@rmit.edu.vn or +84 28 3776 1416 using the official contact page.", "Liên hệ SSET qua sset@rmit.edu.vn hoặc +84 28 3776 1416 theo trang liên hệ chính thức."),
    sourceTitle: T("RMIT Vietnam SSET official website and contact page", "Website và trang liên hệ SSET RMIT Việt Nam"),
    sourceUrl: "https://www.rmit.edu.vn/about-us/schools-and-centres/school-of-science-engineering-and-technology/contact",
    lastVerified: ACADEMIC_RECOGNITION_LAST_VERIFIED,
    verificationStatus: "unavailable",
  },
  {
    id: "rmit-vietnam-student-leadership-recognition-awards-2026",
    name: T("Student Leadership Recognition Awards 2026", "Giải thưởng Ghi nhận Lãnh đạo Sinh viên 2026"),
    institution: T("RMIT University Vietnam", "RMIT University Việt Nam"),
    campus: T("RMIT Vietnam", "RMIT Việt Nam"),
    school: T("University-wide Student Leadership and Development Program", "Chương trình Lãnh đạo và Phát triển Sinh viên toàn trường"),
    academicYear: T("2026", "2026"),
    description: T("A verified recognition program for outstanding student leadership. Its Leadership Excellence category asks applicants to show academic performance alongside leadership and impact.", "Chương trình ghi nhận lãnh đạo sinh viên đã được xác minh. Hạng mục Leadership Excellence yêu cầu thể hiện thành tích học tập cùng năng lực lãnh đạo và tác động."),
    purpose: T("Recognise leadership, dedication and positive impact; selected recipients may join the Global Impact Student Leadership Program.", "Ghi nhận năng lực lãnh đạo, sự cống hiến và tác động tích cực; người được chọn có thể tham gia Global Impact Student Leadership Program."),
    eligibility: T("Current RMIT Vietnam higher-education student, enrolled through at least the end of 2026, with minimum GPA 2.0/4.0 and evidence of leadership and community involvement.", "Sinh viên giáo dục đại học hiện tại của RMIT Việt Nam, tiếp tục ghi danh ít nhất đến cuối năm 2026, GPA tối thiểu 2.0/4.0 và có minh chứng lãnh đạo, đóng góp cộng đồng."),
    gpa: T("Minimum GPA 2.0/4.0 at application.", "GPA tối thiểu 2.0/4.0 tại thời điểm ứng tuyển."),
    ranking: T("No cohort ranking is published.", "Không công bố xếp hạng cohort."),
    credits: T("No minimum completed-credit requirement is published.", "Không công bố yêu cầu tối thiểu về tín chỉ đã hoàn thành."),
    integrity: T("No separate academic-integrity condition is stated on the public event page.", "Trang sự kiện công khai không nêu điều kiện liêm chính học thuật riêng."),
    selection: T("Leadership Excellence is self-nominated; Impactful Leaders is third-party nominated. The public page directs applicants to a sign-in SharePoint page for the detailed checklist and criteria.", "Leadership Excellence do ứng viên tự đề cử; Impactful Leaders do bên thứ ba đề cử. Trang công khai dẫn tới SharePoint yêu cầu đăng nhập để xem checklist và tiêu chí chi tiết."),
    nomination: T("Self-nomination for Leadership Excellence; third-party nomination for Impactful Leaders.", "Tự đề cử cho Leadership Excellence; bên thứ ba đề cử cho Impactful Leaders."),
    schedule: T("Application window listed: 13 July–2 August 2026; deadline 11:59pm Sunday 2 August 2026 (Vietnam time).", "Thời gian ứng tuyển: 13/7–2/8/2026; hạn 23:59 Chủ nhật 2/8/2026 (giờ Việt Nam)."),
    benefits: T("Fully funded opportunity to join GISLP in Singapore, plus recognition certificates, trophies, merchandise and networking opportunities.", "Cơ hội được tài trợ toàn bộ để tham gia GISLP tại Singapore, cùng chứng nhận, cúp, quà RMIT và cơ hội kết nối."),
    certificate: T("Recognition certificates and trophies are explicitly published.", "Nguồn công bố rõ chứng nhận và cúp ghi nhận."),
    financialSupport: T("Recognition and sponsored experience; not a tuition scholarship.", "Ghi nhận và trải nghiệm được tài trợ; không phải học bổng học phí."),
    enquiry: T("The public page lists Ms Phuong Do at phuong.do16@rmit.edu.vn for questions or accessible submission support.", "Trang công khai nêu liên hệ Ms Phuong Do qua phuong.do16@rmit.edu.vn cho câu hỏi hoặc hỗ trợ nộp hồ sơ tiếp cận."),
    sourceTitle: T("RMIT Vietnam Student Leadership Recognition Awards 2026", "Giải thưởng Ghi nhận Lãnh đạo Sinh viên RMIT Việt Nam 2026"),
    sourceUrl: "https://www.rmit.edu.vn/students/student-news-and-events/student-events-2026/student-leadership-recognition-awards",
    lastVerified: ACADEMIC_RECOGNITION_LAST_VERIFIED,
    verificationStatus: "verified",
  },
  {
    id: "rmit-vietnam-business-medal-2019",
    name: T("RMIT University Business Medal", "Huy chương Kinh doanh RMIT University"),
    institution: T("RMIT University; recipient was an RMIT Vietnam student", "RMIT University; người nhận là sinh viên RMIT Việt Nam"),
    campus: T("Saigon South recipient; global college prize-giving", "Người nhận tại Nam Sài Gòn; lễ trao giải cấp college toàn cầu"),
    school: T("College of Business / business discipline", "College of Business / lĩnh vực kinh doanh"),
    academicYear: T("2019 report", "Bài viết năm 2019"),
    description: T("The official RMIT Vietnam article reports that the Business Medal recognises outstanding academic achievement across RMIT's global campuses.", "Bài viết chính thức của RMIT Việt Nam cho biết Huy chương Kinh doanh ghi nhận thành tích học tập nổi bật tại các cơ sở RMIT toàn cầu."),
    purpose: T("Recognise outstanding academic achievement through the College of Business Prize Giving program.", "Ghi nhận thành tích học tập nổi bật qua chương trình College of Business Prize Giving."),
    eligibility: T("A full current eligibility rule is not published in the checked article; the report describes the prize as part of College of Business Prize Giving.", "Bài viết đã kiểm tra không công bố đầy đủ quy định đủ điều kiện hiện hành; chỉ mô tả giải thuộc College of Business Prize Giving."),
    gpa: T("Not published in the checked article.", "Không công bố trong bài viết đã kiểm tra."),
    ranking: T("Not published in the checked article.", "Không công bố trong bài viết đã kiểm tra."),
    credits: T("Not published in the checked article.", "Không công bố trong bài viết đã kiểm tra."),
    integrity: T("Not published in the checked article.", "Không công bố trong bài viết đã kiểm tra."),
    selection: T("The article says the recipient's academic success, community engagement and leadership distinguished her; a formal current selection process is not published.", "Bài viết nêu thành tích học tập, đóng góp cộng đồng và lãnh đạo của người nhận; chưa công bố quy trình tuyển chọn hiện hành chính thức."),
    nomination: T("Not published in the checked article.", "Không công bố trong bài viết đã kiểm tra."),
    schedule: T("The article is dated 25 July 2019; a recurring schedule was not confirmed.", "Bài viết ngày 25/7/2019; chưa xác nhận lịch định kỳ."),
    benefits: T("Prestigious academic recognition; no tuition discount or financial benefit is stated.", "Ghi nhận học thuật uy tín; không nêu giảm học phí hoặc lợi ích tài chính."),
    certificate: T("The checked article reports receipt of the medal; certificate or transcript treatment is not confirmed.", "Bài viết nêu việc nhận huy chương; chưa xác nhận chứng nhận hoặc ghi chú trên bảng điểm."),
    financialSupport: T("Not a scholarship; no financial support is published.", "Không phải học bổng; không công bố hỗ trợ tài chính."),
    enquiry: T("Ask the relevant RMIT Vietnam school or RMIT College of Business for current award information.", "Hỏi Khoa RMIT Việt Nam liên quan hoặc RMIT College of Business về thông tin giải hiện hành."),
    sourceTitle: T("RMIT Vietnam student takes home University's top business award", "Sinh viên RMIT Việt Nam nhận giải thưởng kinh doanh hàng đầu của RMIT"),
    sourceUrl: "https://www.rmit.edu.vn/news/all-news/2019/jun/rmit-vietnam-student-takes-home-university-s-top-business-award",
    lastVerified: ACADEMIC_RECOGNITION_LAST_VERIFIED,
    verificationStatus: "verified",
  },
];
