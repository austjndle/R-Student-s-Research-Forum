export type SSETLocalized = { en: string; vi: string };

export type SSETProgram = {
  id: string;
  title: SSETLocalized;
  code: string;
  campuses: string[];
  duration: SSETLocalized;
  summary: SSETLocalized;
  structure: SSETLocalized;
  specialisations: SSETLocalized[];
  learningOutcomes: SSETLocalized[];
  industryExperience: SSETLocalized;
  careers: SSETLocalized[];
  furtherStudy: SSETLocalized;
  programUrl: string;
  guideUrls: Array<{ label: SSETLocalized; url: string; campus: SSETLocalized; planCode?: string }>;
  mapUrl: string | null;
  accessNote: SSETLocalized;
  lastVerified: string;
};

export type SSETProject = {
  id: string;
  title: SSETLocalized;
  discipline: SSETLocalized;
  program: SSETLocalized;
  summary: SSETLocalized;
  focus: SSETLocalized;
  year: string;
  url: string;
  sourceTitle: SSETLocalized;
};

export type SSETLink = {
  id: string;
  label: SSETLocalized;
  description: SSETLocalized;
  url: string;
  requiresLogin?: boolean;
};

const T = (en: string, vi: string): SSETLocalized => ({ en, vi });

export const SSET_LAST_VERIFIED = "2026-11-05";

export const SSET_URLS = {
  overview: "https://www.rmit.edu.vn/about-us/schools-and-centres/school-of-science-engineering-and-technology",
  programs: "https://www.rmit.edu.vn/about-us/schools-and-centres/school-of-science-engineering-and-technology/programs",
  research: "https://www.rmit.edu.vn/about-us/schools-and-centres/school-of-science-engineering-and-technology/research",
  industry: "https://www.rmit.edu.vn/about-us/schools-and-centres/school-of-science-engineering-and-technology/industry",
  infrastructure: "https://www.rmit.edu.vn/about-us/schools-and-centres/school-of-science-engineering-and-technology/infrastructure",
  projects: "https://www.rmit.edu.vn/about-us/schools-and-centres/school-of-science-engineering-and-technology/student-projects",
  showcase: "https://www.rmitvn-showcase.com/sst-school-projects",
  guides: "https://www.rmit.edu.vn/students/my-studies/program-course-information/program-guides-and-maps",
  contact: "https://www.rmit.edu.vn/about-us/schools-and-centres/school-of-science-engineering-and-technology/contact",
} as const;

export const SSET_PROGRAMS: readonly SSETProgram[] = [
  {
    id: "robotics-mechatronics",
    title: T("Bachelor of Engineering (Robotics and Mechatronics Engineering) (Honours)", "Cử nhân Kỹ thuật (Kỹ thuật Robot và Cơ điện tử) (Danh dự)"),
    code: "BH123",
    campuses: ["Saigon South"],
    duration: T("4 years full time", "4 năm toàn thời gian"),
    summary: T("An Engineers Australia-accredited engineering degree focused on intelligent robotic, automated, electronic and mechanical systems.", "Chương trình kỹ thuật được Engineers Australia kiểm định, tập trung vào hệ thống robot thông minh, tự động hóa, điện tử và cơ khí."),
    structure: T("The published page describes an advised structure. First-year engineering fundamentals precede specialisation; the sequence is indicative and may vary by intake.", "Trang chương trình công bố cấu trúc được khuyến nghị. Sinh viên học nền tảng kỹ thuật trước khi chuyên sâu; trình tự mang tính định hướng và có thể thay đổi theo đợt nhập học."),
    specialisations: [T("Robotics & Intelligent Systems Engineering", "Kỹ thuật Robot và Hệ thống thông minh"), T("Intelligent Manufacturing Technologies", "Công nghệ sản xuất thông minh"), T("Digital and Embedded Systems Engineering", "Kỹ thuật Hệ thống số và nhúng"), T("Advanced Software Engineering and Technology", "Kỹ thuật phần mềm và công nghệ nâng cao"), T("Entrepreneurship", "Khởi nghiệp")],
    learningOutcomes: [T("Apply engineering methods to complex problem solving and systematic design.", "Áp dụng phương pháp kỹ thuật để giải quyết vấn đề phức tạp và thiết kế có hệ thống."), T("Communicate professionally, manage information and work effectively in teams.", "Giao tiếp chuyên nghiệp, quản lý thông tin và làm việc hiệu quả trong nhóm."), T("Develop ethical, creative and accountable engineering practice.", "Phát triển năng lực kỹ thuật có đạo đức, sáng tạo và trách nhiệm.")],
    industryExperience: T("The program page describes projects, group work and industry placements. The SSET project page describes six-month WIL capstone projects guided by academics and industry partners.", "Trang chương trình nêu dự án, làm việc nhóm và thực tập ngành. Trang dự án SSET mô tả capstone WIL kéo dài sáu tháng với giảng viên và đối tác doanh nghiệp hướng dẫn."),
    careers: [T("Robotic engineer", "Kỹ sư robot"), T("Mechatronic engineer", "Kỹ sư cơ điện tử"), T("Automation engineer", "Kỹ sư tự động hóa"), T("Industrial or manufacturing engineer", "Kỹ sư công nghiệp hoặc sản xuất"), T("Technology consultant", "Tư vấn công nghệ")],
    furtherStudy: T("Successful graduates may be eligible for direct entry to an RMIT research master's or PhD program.", "Sinh viên tốt nghiệp có thể đủ điều kiện vào thẳng chương trình thạc sĩ nghiên cứu hoặc tiến sĩ của RMIT."),
    programUrl: "https://www.rmit.edu.vn/study-at-rmit/undergraduate-programs/bachelor-engineering-robotics-mechatronics-engineering-honours",
    guideUrls: [{ label: T("English program guide", "Cẩm nang chương trình tiếng Anh"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BH123VRI23", campus: T("Saigon South", "Nam Sài Gòn"), planCode: "BH123VRI23" }],
    mapUrl: null,
    accessNote: T("The public SSET page links the English handbook guide. The public program-guides index says students should log in with an RMIT account before accessing program files. No separate public program-map URL was confirmed.", "Trang SSET công khai liên kết cẩm nang tiếng Anh. Trang danh mục guide/map yêu cầu đăng nhập tài khoản RMIT trước khi truy cập tệp chương trình. Chưa xác nhận được URL program map công khai riêng."),
    lastVerified: SSET_LAST_VERIFIED,
  },
  {
    id: "electronic-computer-systems",
    title: T("Bachelor of Engineering (Electronic and Computer Systems Engineering) (Honours)", "Cử nhân Kỹ thuật (Kỹ thuật Điện tử và Hệ thống Máy tính) (Danh dự)"),
    code: "BH073",
    campuses: ["Saigon South"],
    duration: T("4 years full time", "4 năm toàn thời gian"),
    summary: T("An Engineers Australia-accredited engineering degree covering electronic systems, embedded systems, IoT, communications and networks.", "Chương trình kỹ thuật được Engineers Australia kiểm định, bao quát hệ thống điện tử, hệ thống nhúng, IoT, truyền thông và mạng."),
    structure: T("Students choose program electives or four courses from one minor: Digital Circuits and Systems, Embedded Systems and IoT, Advanced Communication and Network Engineering, Advanced Software Engineering and Technology, or Entrepreneurship. The listed structure is advised, not an unconditional enrolment rule.", "Sinh viên chọn môn tự chọn hoặc bốn môn trong một chuyên ngành phụ: Mạch và Hệ thống số, Hệ thống nhúng và IoT, Truyền thông và Mạng nâng cao, Kỹ thuật phần mềm và công nghệ nâng cao, hoặc Khởi nghiệp. Cấu trúc công bố là khuyến nghị, không phải điều kiện đăng ký tuyệt đối."),
    specialisations: [T("Digital Circuits and Systems", "Mạch và Hệ thống số"), T("Embedded Systems and Internet of Things", "Hệ thống nhúng và Internet vạn vật"), T("Advanced Communication & Network Engineering", "Kỹ thuật Truyền thông và Mạng nâng cao"), T("Advanced Software Engineering and Technology", "Kỹ thuật phần mềm và công nghệ nâng cao"), T("Entrepreneurship", "Khởi nghiệp")],
    learningOutcomes: [T("Solve complex engineering problems using established methods and tools.", "Giải quyết vấn đề kỹ thuật phức tạp bằng phương pháp và công cụ phù hợp."), T("Design and manage engineering projects systematically.", "Thiết kế và quản lý dự án kỹ thuật có hệ thống."), T("Practise ethical communication, information management and teamwork.", "Thực hành giao tiếp có đạo đức, quản lý thông tin và làm việc nhóm.")],
    industryExperience: T("Final-year students collaborate with industry partners on capstone projects and complete a 12-week professional engineering internship placement as described on the program page.", "Theo trang chương trình, sinh viên năm cuối phối hợp với đối tác doanh nghiệp trong capstone và hoàn thành kỳ thực tập kỹ thuật chuyên nghiệp 12 tuần."),
    careers: [T("Electronic or embedded systems engineer", "Kỹ sư điện tử hoặc hệ thống nhúng"), T("IC design engineer", "Kỹ sư thiết kế mạch tích hợp"), T("Network or telecommunications engineer", "Kỹ sư mạng hoặc viễn thông"), T("Automation engineer", "Kỹ sư tự động hóa"), T("Technology consultant", "Tư vấn công nghệ")],
    furtherStudy: T("Successful graduates may be eligible for direct entry to an RMIT research master's or PhD program.", "Sinh viên tốt nghiệp có thể đủ điều kiện vào thẳng chương trình thạc sĩ nghiên cứu hoặc tiến sĩ của RMIT."),
    programUrl: "https://www.rmit.edu.vn/study-at-rmit/undergraduate-programs/bachelor-engineering-electronic-and-computer-systems-engineering-honours",
    guideUrls: [{ label: T("English program guide", "Cẩm nang chương trình tiếng Anh"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BH073VRI23", campus: T("Saigon South", "Nam Sài Gòn"), planCode: "BH073VRI23" }],
    mapUrl: null,
    accessNote: T("The public program page confirms BH073 and the Saigon South guide link. No separate public program-map URL was confirmed; use the official program-guides index with an RMIT account.", "Trang chương trình xác nhận BH073 và liên kết guide Nam Sài Gòn. Chưa xác nhận được URL program map công khai riêng; dùng trang guide/map chính thức với tài khoản RMIT."),
    lastVerified: SSET_LAST_VERIFIED,
  },
  {
    id: "software-engineering",
    title: T("Bachelor of Engineering (Software Engineering) (Honours)", "Cử nhân Kỹ thuật (Kỹ thuật Phần mềm) (Danh dự)"),
    code: "BH120",
    campuses: ["Saigon South", "Hanoi"],
    duration: T("4 years full time", "4 năm toàn thời gian"),
    summary: T("An engineering degree combining computer science, engineering and mathematics for software, systems, devices and networks.", "Chương trình kết hợp khoa học máy tính, kỹ thuật và toán học để phát triển phần mềm, hệ thống, thiết bị và mạng."),
    structure: T("Students may choose four minor courses or courses from program minor lists. Campus accreditation and guide links differ between Saigon South and Hanoi.", "Sinh viên có thể chọn bốn môn chuyên ngành phụ hoặc môn từ các danh sách chuyên ngành phụ. Kiểm định và liên kết guide khác nhau theo cơ sở Nam Sài Gòn và Hà Nội."),
    specialisations: [T("AI and Machine Learning", "AI và Học máy"), T("Cloud Computing", "Điện toán đám mây"), T("Cyber Assurance", "Đảm bảo an ninh mạng"), T("Data Science", "Khoa học dữ liệu"), T("Enterprise Systems Development", "Phát triển hệ thống doanh nghiệp")],
    learningOutcomes: [T("Design and implement software systems against stated requirements.", "Thiết kế và triển khai hệ thống phần mềm theo yêu cầu."), T("Communicate and work across technical and non-technical teams.", "Giao tiếp và làm việc với nhóm kỹ thuật và phi kỹ thuật."), T("Apply engineering principles, ethics and systematic methods.", "Áp dụng nguyên lý kỹ thuật, đạo đức và phương pháp có hệ thống.")],
    industryExperience: T("The published page describes workshops, guest lectures, job opportunities and a flagship internship program.", "Trang công bố workshop, bài giảng khách mời, cơ hội việc làm và chương trình thực tập trọng điểm."),
    careers: [T("Software developer", "Nhà phát triển phần mềm"), T("AI/ML engineer", "Kỹ sư AI/Học máy"), T("Cloud or DevOps engineer", "Kỹ sư Cloud hoặc DevOps"), T("Security engineer", "Kỹ sư an ninh mạng")],
    furtherStudy: T("Graduates may be eligible for an RMIT honours or postgraduate program in Vietnam or Australia.", "Sinh viên tốt nghiệp có thể đủ điều kiện học chương trình danh dự hoặc sau đại học tại RMIT Việt Nam hoặc Australia."),
    programUrl: "https://www.rmit.edu.vn/study-at-rmit/undergraduate-programs/bachelor-engineering-software-engineering-honours",
    guideUrls: [{ label: T("Saigon South English program guide", "Cẩm nang tiếng Anh Nam Sài Gòn"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BH120VRI23", campus: T("Saigon South", "Nam Sài Gòn"), planCode: "BH120VRI23" }, { label: T("Hanoi English program guide", "Cẩm nang tiếng Anh Hà Nội"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BH120VH", campus: T("Hanoi", "Hà Nội"), planCode: "BH120VH" }],
    mapUrl: null,
    accessNote: T("The program page publishes campus-specific handbook links. Program-map files remain behind the official program-guides access boundary unless the authenticated page exposes them.", "Trang chương trình công bố liên kết handbook theo cơ sở. Tệp program map vẫn thuộc ranh giới truy cập của trang guide/map chính thức nếu trang yêu cầu xác thực."),
    lastVerified: SSET_LAST_VERIFIED,
  },
  {
    id: "information-technology",
    title: T("Bachelor of Information Technology", "Cử nhân Công nghệ Thông tin"),
    code: "BP162",
    campuses: ["Saigon South", "Hanoi"],
    duration: T("3 years full time", "3 năm toàn thời gian"),
    summary: T("A flexible IT degree with majors and minors in enterprise systems, digital innovation, cybersecurity, AI, data and cloud technologies.", "Chương trình CNTT linh hoạt với các chuyên ngành và chuyên ngành phụ về hệ thống doanh nghiệp, đổi mới số, an ninh mạng, AI, dữ liệu và cloud."),
    structure: T("Students can use eight electives for one major, two minors, or other program options and university electives; the published structure is intake-sensitive.", "Sinh viên có thể dùng tám môn tự chọn cho một major, hai minor hoặc các lựa chọn chương trình và môn tự chọn toàn trường; cấu trúc phụ thuộc đợt nhập học."),
    specialisations: [T("Enterprise Systems Development", "Phát triển Hệ thống Doanh nghiệp"), T("Digital Innovation", "Đổi mới Số"), T("Cyber Security", "An ninh mạng"), T("AI and Machine Learning", "AI và Học máy"), T("Data Science", "Khoa học dữ liệu"), T("Cloud Computing", "Điện toán đám mây")],
    learningOutcomes: [T("Analyse requirements and design software solutions.", "Phân tích yêu cầu và thiết kế giải pháp phần mềm."), T("Communicate technical recommendations to varied audiences.", "Trình bày khuyến nghị kỹ thuật với nhiều nhóm đối tượng."), T("Apply ethical, legal and privacy considerations in IT practice.", "Áp dụng cân nhắc về đạo đức, pháp luật và quyền riêng tư trong CNTT.")],
    industryExperience: T("The published page describes lectures, projects, group work and industry placements, with modern labs and industry-standard tools.", "Trang công bố bài giảng, dự án, làm việc nhóm và thực tập ngành, cùng phòng lab hiện đại và công cụ chuẩn ngành."),
    careers: [T("Software developer", "Nhà phát triển phần mềm"), T("Data or business analyst", "Chuyên viên dữ liệu hoặc phân tích nghiệp vụ"), T("Cloud engineer", "Kỹ sư cloud"), T("Security engineer", "Kỹ sư an ninh mạng"), T("IT consultant", "Tư vấn CNTT")],
    furtherStudy: T("Graduates may be eligible for an RMIT honours or postgraduate program in Vietnam or Australia.", "Sinh viên tốt nghiệp có thể đủ điều kiện học chương trình danh dự hoặc sau đại học tại RMIT Việt Nam hoặc Australia."),
    programUrl: "https://www.rmit.edu.vn/study-at-rmit/undergraduate-programs/bachelor-information-technology",
    guideUrls: [{ label: T("Saigon South English program guide", "Cẩm nang tiếng Anh Nam Sài Gòn"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BP162VI23", campus: T("Saigon South", "Nam Sài Gòn"), planCode: "BP162VI23" }, { label: T("Hanoi English program guide", "Cẩm nang tiếng Anh Hà Nội"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BP162VH23", campus: T("Hanoi", "Hà Nội"), planCode: "BP162VH23" }],
    mapUrl: null,
    accessNote: T("The public program page confirms BP162 and campus-specific guide links. Check the official program-guides index for the current intake and map; do not rely on an older map.", "Trang chương trình xác nhận BP162 và guide theo cơ sở. Kiểm tra trang guide/map chính thức cho đợt nhập học hiện tại; không dùng map cũ mặc định."),
    lastVerified: SSET_LAST_VERIFIED,
  },
  {
    id: "computer-science",
    title: T("Bachelor of Computer Science", "Cử nhân Khoa học Máy tính"),
    code: "BP094",
    campuses: ["Saigon South", "Hanoi"],
    duration: T("3 years full time", "3 năm toàn thời gian"),
    summary: T("A computer science degree covering systems, software development, algorithms, networks, operating systems, AI and data-driven applications.", "Chương trình khoa học máy tính bao quát hệ thống, phát triển phần mềm, thuật toán, mạng, hệ điều hành, AI và ứng dụng dữ liệu."),
    structure: T("Students can choose one major or up to two minors using eight elective courses. The published course sequence should be checked against the applicable intake.", "Sinh viên có thể chọn một major hoặc tối đa hai minor bằng tám môn tự chọn. Cần đối chiếu trình tự môn với đợt nhập học áp dụng."),
    specialisations: [T("Advanced Computer Science", "Khoa học Máy tính Nâng cao"), T("Enterprise Systems Development", "Phát triển Hệ thống Doanh nghiệp"), T("Cyber Security", "An ninh mạng"), T("Artificial Intelligence and Machine Learning", "AI và Học máy"), T("Data Science", "Khoa học dữ liệu")],
    learningOutcomes: [T("Build computational thinking and problem-solving capability.", "Phát triển tư duy tính toán và năng lực giải quyết vấn đề."), T("Design, implement and maintain complex computational models.", "Thiết kế, triển khai và duy trì mô hình tính toán phức tạp."), T("Work with industry projects and advanced technologies.", "Làm việc với dự án ngành và công nghệ tiên tiến.")],
    industryExperience: T("The program page describes programming bootcamps, studio-based learning, industry projects, internships and advanced labs.", "Trang chương trình mô tả bootcamp lập trình, học theo studio, dự án ngành, thực tập và phòng lab tiên tiến."),
    careers: [T("AI/ML engineer", "Kỹ sư AI/Học máy"), T("Software developer", "Nhà phát triển phần mềm"), T("Data scientist", "Nhà khoa học dữ liệu"), T("Cloud or security engineer", "Kỹ sư cloud hoặc an ninh mạng")],
    furtherStudy: T("Graduates may be eligible for RMIT honours or postgraduate study in Vietnam or Australia.", "Sinh viên tốt nghiệp có thể đủ điều kiện học danh dự hoặc sau đại học tại RMIT Việt Nam hoặc Australia."),
    programUrl: "https://www.rmit.edu.vn/study-at-rmit/undergraduate-programs/bachelor-of-computer-science",
    guideUrls: [{ label: T("Saigon South English program guide", "Cẩm nang tiếng Anh Nam Sài Gòn"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BP094VRI&clear=5", campus: T("Saigon South", "Nam Sài Gòn"), planCode: "BP094VRI" }, { label: T("Hanoi English program guide", "Cẩm nang tiếng Anh Hà Nội"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BP094VH&clear=5", campus: T("Hanoi", "Hà Nội"), planCode: "BP094VH" }],
    mapUrl: null,
    accessNote: T("The public program page confirms BP094 and campus-specific guide links. Check the official program-guides index for the current intake and any program-map file.", "Trang chương trình xác nhận BP094 và guide theo cơ sở. Kiểm tra trang guide/map chính thức cho đợt nhập học hiện tại và tệp program map nếu có."),
    lastVerified: SSET_LAST_VERIFIED,
  },
  {
    id: "psychology",
    title: T("Bachelor of Psychology", "Cử nhân Tâm lý học"),
    code: "BP154",
    campuses: ["Saigon South", "Hanoi"],
    duration: T("3 years full time", "3 năm toàn thời gian"),
    summary: T("An APAC-accredited psychology degree combining evidence-based psychology, research methods, field placement and a final-year research or practice option.", "Chương trình tâm lý học được APAC kiểm định, kết hợp kiến thức dựa trên bằng chứng, phương pháp nghiên cứu, field placement và lựa chọn nghiên cứu hoặc thực hành năm cuối."),
    structure: T("Students choose a Mental Health minor or a combination of Mental Health minor courses and university electives. The published structure is advised and intake-sensitive.", "Sinh viên chọn minor Mental Health hoặc kết hợp các môn minor Mental Health với môn tự chọn toàn trường. Cấu trúc công bố mang tính khuyến nghị và phụ thuộc đợt nhập học."),
    specialisations: [T("Mental Health minor", "Minor Sức khỏe Tâm thần"), T("Research project or field study placement", "Dự án nghiên cứu hoặc field study placement")],
    learningOutcomes: [T("Use evidence-based psychological knowledge and research methods.", "Sử dụng kiến thức tâm lý và phương pháp nghiên cứu dựa trên bằng chứng."), T("Communicate ethically with diverse people and groups.", "Giao tiếp có đạo đức với các cá nhân và nhóm đa dạng."), T("Apply psychology knowledge to professional and community contexts.", "Áp dụng kiến thức tâm lý trong bối cảnh nghề nghiệp và cộng đồng.")],
    industryExperience: T("Final-year Work Integrated Learning may include Professional Practices in Psychology and Psychology Field Placement.", "Work Integrated Learning năm cuối có thể gồm Professional Practices in Psychology và Psychology Field Placement."),
    careers: [T("Researcher", "Nhà nghiên cứu"), T("Human resources specialist", "Chuyên viên nhân sự"), T("Market research specialist", "Chuyên viên nghiên cứu thị trường"), T("Education counsellor", "Tư vấn giáo dục")],
    furtherStudy: T("Graduates may be eligible for Psychology Honours or postgraduate study; practising as a psychologist requires further study and confirmation of local registration requirements.", "Sinh viên tốt nghiệp có thể đủ điều kiện học Psychology Honours hoặc sau đại học; hành nghề tâm lý cần học tiếp và xác nhận yêu cầu đăng ký tại địa phương."),
    programUrl: "https://www.rmit.edu.vn/study-at-rmit/undergraduate-programs/bachelor-of-psychology",
    guideUrls: [{ label: T("Saigon South English program guide", "Cẩm nang tiếng Anh Nam Sài Gòn"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BP154VRI23", campus: T("Saigon South", "Nam Sài Gòn"), planCode: "BP154VRI23" }, { label: T("Hanoi English program guide", "Cẩm nang tiếng Anh Hà Nội"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BP154VH23", campus: T("Hanoi", "Hà Nội"), planCode: "BP154VH23" }],
    mapUrl: null,
    accessNote: T("The public program page confirms BP154 and campus-specific handbook links. Use the official program-guides index for the current intake map.", "Trang chương trình xác nhận BP154 và handbook theo cơ sở. Dùng trang program guides chính thức cho map của đợt nhập học hiện tại."),
    lastVerified: SSET_LAST_VERIFIED,
  },
  {
    id: "psychology-honours",
    title: T("Bachelor of Psychology (Honours)", "Cử nhân Tâm lý học (Danh dự)"),
    code: "BH000",
    campuses: ["Saigon South"],
    duration: T("4 years total pathway (BP154 Bachelor: 3 years + BH000 Honours: 1 year)", "Tổng lộ trình 4 năm (BP154 Cử nhân: 3 năm + BH000 Danh dự: 1 năm)"),
    summary: T("The Psychology Honours pathway is four years in total: a three-year Bachelor of Psychology (BP154) followed by the one-year BH000 Honours year.", "Lộ trình Tâm lý học Danh dự kéo dài tổng cộng 4 năm: Cử nhân Tâm lý học (BP154) 3 năm, tiếp theo là năm Danh dự BH000 kéo dài 1 năm."),
    structure: T("The program includes advanced research methods, psychological assessment and intervention, and Thesis 1 and Thesis 2. The sequence is advised and may change by intake.", "Chương trình gồm phương pháp nghiên cứu nâng cao, đánh giá và can thiệp tâm lý, cùng Thesis 1 và Thesis 2. Trình tự mang tính khuyến nghị và có thể thay đổi theo đợt nhập học."),
    specialisations: [T("Research thesis", "Luận văn nghiên cứu"), T("Psychological assessment and intervention", "Đánh giá và can thiệp tâm lý")],
    learningOutcomes: [T("Conduct and report an independent psychological study.", "Thực hiện và báo cáo một nghiên cứu tâm lý độc lập."), T("Make evidence-based decisions with ethical professional communication.", "Ra quyết định dựa trên bằng chứng và giao tiếp nghề nghiệp có đạo đức.")],
    industryExperience: T("Students complete a supervised research project with academic guidance.", "Sinh viên hoàn thành dự án nghiên cứu có giảng viên hướng dẫn."),
    careers: [T("Research officer", "Cán bộ nghiên cứu"), T("Research assistant", "Trợ lý nghiên cứu"), T("Project officer", "Cán bộ dự án"), T("Public health officer", "Cán bộ y tế công cộng")],
    furtherStudy: T("The program can prepare graduates for master's, doctoral or professional psychology pathways; registration requirements follow the relevant authority.", "Chương trình chuẩn bị cho lộ trình thạc sĩ, tiến sĩ hoặc tâm lý chuyên nghiệp; yêu cầu đăng ký theo cơ quan có thẩm quyền liên quan."),
    programUrl: "https://www.rmit.edu.vn/study-at-rmit/undergraduate-programs/bachelor-of-psychology-honours",
    guideUrls: [{ label: T("Saigon South English program guide", "Cẩm nang tiếng Anh Nam Sài Gòn"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BH000VRI", campus: T("Saigon South", "Nam Sài Gòn"), planCode: "BH000VRI" }],
    mapUrl: null,
    accessNote: T("RMIT's BH000 page labels the Honours component itself as one year and describes it as the fourth year. This directory displays the combined BP154 + BH000 pathway as four years total.", "Trang BH000 của RMIT ghi phần Danh dự kéo dài 1 năm và mô tả đây là năm thứ tư. Directory này hiển thị tổng lộ trình BP154 + BH000 là 4 năm."),
    lastVerified: SSET_LAST_VERIFIED,
  },
  {
    id: "aviation",
    title: T("Bachelor of Applied Science (Aviation)", "Cử nhân Khoa học Ứng dụng (Hàng không)"),
    code: "BP070",
    campuses: ["Saigon South"],
    duration: T("3 years full time", "3 năm toàn thời gian"),
    summary: T("An aviation operations and management degree covering airline, airport, ground handling and safety contexts, with an industry capstone.", "Chương trình vận hành và quản lý hàng không bao quát hãng bay, sân bay, phục vụ mặt đất và an toàn, cùng capstone ngành."),
    structure: T("The program offers business and aviation electives and an Aviation Industry Project capstone. RMIT notes that the course sequence may change.", "Chương trình có môn tự chọn kinh doanh và hàng không, cùng capstone Aviation Industry Project. RMIT lưu ý trình tự môn có thể thay đổi."),
    specialisations: [T("Aviation operations and management", "Vận hành và quản lý hàng không"), T("Airline and airport operations", "Vận hành hãng bay và sân bay"), T("Aviation safety and quality", "An toàn và chất lượng hàng không")],
    learningOutcomes: [T("Analyse aviation stakeholder needs, constraints and risks.", "Phân tích nhu cầu, ràng buộc và rủi ro của các bên liên quan hàng không."), T("Apply research, project management and professional communication.", "Áp dụng nghiên cứu, quản lý dự án và giao tiếp chuyên nghiệp.")],
    industryExperience: T("The final-year Aviation Industry Project may be coordinated with an industry partner or conducted within RMIT.", "Aviation Industry Project năm cuối có thể phối hợp với đối tác ngành hoặc thực hiện trong RMIT."),
    careers: [T("Airline operations planner", "Nhân sự hoạch định vận hành hãng bay"), T("Airport operations professional", "Nhân sự vận hành sân bay"), T("Aviation safety manager", "Quản lý an toàn hàng không"), T("Airport planning professional", "Nhân sự quy hoạch sân bay")],
    furtherStudy: T("Graduates may be eligible for RMIT honours or postgraduate study; students interested in pilot training may explore the stated Melbourne transfer option.", "Sinh viên tốt nghiệp có thể đủ điều kiện học danh dự hoặc sau đại học; người quan tâm đào tạo phi công có thể tìm hiểu lựa chọn chuyển tiếp Melbourne được nêu trên trang."),
    programUrl: "https://www.rmit.edu.vn/study-at-rmit/undergraduate-programs/bachelor-of-applied-science-aviation",
    guideUrls: [{ label: T("Saigon South English program guide", "Cẩm nang tiếng Anh Nam Sài Gòn"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BP070VRI23", campus: T("Saigon South", "Nam Sài Gòn"), planCode: "BP070VRI23" }],
    mapUrl: null,
    accessNote: T("The public page confirms BP070, Saigon South and the handbook guide. Do not treat the advised sequence as unconditional enrolment.", "Trang công khai xác nhận BP070, Nam Sài Gòn và handbook guide. Không coi trình tự khuyến nghị là điều kiện đăng ký tuyệt đối."),
    lastVerified: SSET_LAST_VERIFIED,
  },
  {
    id: "food-technology-nutrition",
    title: T("Bachelor of Food Technology and Nutrition", "Cử nhân Công nghệ Thực phẩm và Dinh dưỡng"),
    code: "BP199",
    campuses: ["Saigon South"],
    duration: T("3 years full time", "3 năm toàn thời gian"),
    summary: T("A food science and nutrition degree with laboratory, food-processing, product-development and quality-assurance learning.", "Chương trình khoa học thực phẩm và dinh dưỡng với học tập trong phòng lab, chế biến, phát triển sản phẩm và đảm bảo chất lượng."),
    structure: T("Students can double major or combine Food Science and Technology and Nutrition Science through the published major/minor options; the structure is advised and intake-sensitive.", "Sinh viên có thể học double major hoặc kết hợp Food Science and Technology với Nutrition Science theo các lựa chọn major/minor công bố; cấu trúc mang tính khuyến nghị và phụ thuộc đợt nhập học."),
    specialisations: [T("Food Science and Technology", "Khoa học và Công nghệ Thực phẩm"), T("Nutrition Science", "Khoa học Dinh dưỡng")],
    learningOutcomes: [T("Apply scientific methods to food technology and nutrition problems.", "Áp dụng phương pháp khoa học cho vấn đề công nghệ thực phẩm và dinh dưỡng."), T("Develop, process and quality-assure safe and nutritious food products.", "Phát triển, chế biến và đảm bảo chất lượng sản phẩm thực phẩm an toàn, giàu dinh dưỡng.")],
    industryExperience: T("WIL includes laboratories, pilot-plant practicals, industrial visits, production trials and final-year projects.", "WIL gồm phòng lab, thực hành pilot plant, tham quan cơ sở công nghiệp, thử nghiệm sản xuất và dự án năm cuối."),
    careers: [T("Food product development professional", "Nhân sự phát triển sản phẩm thực phẩm"), T("Food processing R&D professional", "Nhân sự R&D chế biến thực phẩm"), T("Nutrition consultant", "Tư vấn dinh dưỡng"), T("Food business manager", "Quản lý doanh nghiệp thực phẩm")],
    furtherStudy: T("Graduates may be eligible for RMIT honours or postgraduate study in Vietnam and Australia.", "Sinh viên tốt nghiệp có thể đủ điều kiện học danh dự hoặc sau đại học tại RMIT Việt Nam và Australia."),
    programUrl: "https://www.rmit.edu.vn/study-at-rmit/undergraduate-programs/bachelor-of-food-technology-and-nutrition",
    guideUrls: [{ label: T("Saigon South English program guide", "Cẩm nang tiếng Anh Nam Sài Gòn"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=BP199VRI23", campus: T("Saigon South", "Nam Sài Gòn"), planCode: "BP199VRI23" }],
    mapUrl: null,
    accessNote: T("The public page confirms BP199 and its Saigon South guide link. Use the official program-guides index for the current intake map.", "Trang công khai xác nhận BP199 và guide Nam Sài Gòn. Dùng trang program guides chính thức cho map của đợt nhập học hiện tại."),
    lastVerified: SSET_LAST_VERIFIED,
  },
  {
    id: "master-artificial-intelligence",
    title: T("Master of Artificial Intelligence", "Thạc sĩ Trí tuệ Nhân tạo"),
    code: "MC271",
    campuses: ["Saigon South"],
    duration: T("Not stated on the checked program page", "Trang chương trình đã kiểm tra không nêu thời lượng"),
    summary: T("A postgraduate AI degree with project and research streams covering machine learning, data analysis, automation, deep learning, NLP and ethical AI.", "Chương trình sau đại học về AI với hướng project và research, bao quát học máy, phân tích dữ liệu, tự động hóa, deep learning, NLP và AI có đạo đức."),
    structure: T("The page states 14–15 courses and 192 credit points depending on the project or research stream. The handbook link is the current program reference.", "Trang nêu 14–15 môn và 192 tín chỉ tùy hướng project hoặc research. Liên kết handbook là tham chiếu chương trình hiện hành."),
    specialisations: [T("Project stream", "Hướng Project"), T("Research stream", "Hướng Research"), T("Deep learning and natural language processing", "Deep learning và xử lý ngôn ngữ tự nhiên")],
    learningOutcomes: [T("Design, evaluate and implement AI solutions with critical and ethical judgement.", "Thiết kế, đánh giá và triển khai giải pháp AI với tư duy phản biện và đạo đức."), T("Plan and execute substantial research or applied project work.", "Lập kế hoạch và thực hiện dự án ứng dụng hoặc nghiên cứu quy mô đáng kể.")],
    industryExperience: T("The project stream focuses on practical AI solutions, case studies and hands-on projects; the research stream prepares for new AI knowledge and PhD study.", "Hướng project tập trung giải pháp AI thực tế, case study và dự án thực hành; hướng research chuẩn bị cho nghiên cứu mới và học PhD."),
    careers: [T("AI engineer", "Kỹ sư AI"), T("Machine learning engineer", "Kỹ sư học máy"), T("Data scientist", "Nhà khoa học dữ liệu"), T("AI product manager", "Quản lý sản phẩm AI")],
    furtherStudy: T("The research stream can prepare students for PhD study; the page also describes career advancement and further research pathways.", "Hướng research có thể chuẩn bị cho học PhD; trang cũng mô tả lộ trình thăng tiến nghề nghiệp và nghiên cứu tiếp theo."),
    programUrl: "https://www.rmit.edu.vn/study-at-rmit/postgraduate-programs/master-of-artificial-intelligence",
    guideUrls: [{ label: T("English program guide", "Cẩm nang chương trình tiếng Anh"), url: "https://handbook.rmit.edu.au/ords/r/rmit/catalogue/program?p5_code=MC271VRI", campus: T("Saigon South", "Nam Sài Gòn"), planCode: "MC271VRI" }],
    mapUrl: null,
    accessNote: T("The public page confirms MC271, Saigon South and the handbook reference. Use the official guide/map index for intake-specific documents.", "Trang công khai xác nhận MC271, Nam Sài Gòn và handbook. Dùng trang guide/map chính thức cho tài liệu theo đợt nhập học."),
    lastVerified: SSET_LAST_VERIFIED,
  },
];

export const SSET_PROJECTS: readonly SSETProject[] = [
  { id: "emotional-flip-llms", title: T("Emotional flip reasoning via stacked-instruction finetuning of LLMs", "Suy luận cảm xúc bằng tinh chỉnh LLM theo chỉ dẫn xếp tầng"), discipline: T("Artificial intelligence", "Trí tuệ nhân tạo"), program: T("SSET project; program not stated on the listing", "Dự án SSET; trang liệt kê không nêu chương trình"), summary: T("A novel approach to fine-tune large language models for understanding emotional dynamics in conversations.", "Phương pháp tinh chỉnh mô hình ngôn ngữ lớn để hiểu diễn biến cảm xúc trong hội thoại."), focus: T("LLM fine-tuning and conversational AI", "Tinh chỉnh LLM và AI hội thoại"), year: "Not stated", url: `${SSET_URLS.projects}/emotional-flip-reasoning-via-stacked-instruction-finetuning-of-llms`, sourceTitle: T("RMIT Vietnam SSET student projects", "Dự án sinh viên SSET RMIT Việt Nam") },
  { id: "healthlight", title: T("HealthLight - Bridging health information gap through AI", "HealthLight - Thu hẹp khoảng cách thông tin y tế bằng AI"), discipline: T("Artificial intelligence and health communication", "AI và truyền thông y tế"), program: T("SSET project; program not stated on the listing", "Dự án SSET; trang liệt kê không nêu chương trình"), summary: T("An AI-powered system designed to make health information accessible and easy to understand for Vietnamese users.", "Hệ thống dùng AI để giúp người dùng Việt Nam tiếp cận thông tin sức khỏe dễ hiểu hơn."), focus: T("AI-powered health information", "Thông tin sức khỏe ứng dụng AI"), year: "Not stated", url: `${SSET_URLS.projects}/healthlight-bridging-health-information-gap-through-ai`, sourceTitle: T("RMIT Vietnam SSET student projects", "Dự án sinh viên SSET RMIT Việt Nam") },
  { id: "medvoice", title: T("Medvoice - Real-time audio to medical documentation pipeline", "Medvoice - Quy trình chuyển âm thanh thành tài liệu y khoa theo thời gian thực"), discipline: T("Artificial intelligence and software", "AI và phần mềm"), program: T("SSET project; program not stated on the listing", "Dự án SSET; trang liệt kê không nêu chương trình"), summary: T("An AI-powered solution that automates transcription of medical documents.", "Giải pháp dùng AI tự động hóa việc ghi chép tài liệu y khoa."), focus: T("Speech processing and medical documentation", "Xử lý giọng nói và tài liệu y khoa"), year: "Not stated", url: `${SSET_URLS.projects}/medvoice-real-time-audio-to-medical-documentation-pipeline`, sourceTitle: T("RMIT Vietnam SSET student projects", "Dự án sinh viên SSET RMIT Việt Nam") },
  { id: "uav-system", title: T("Unmanned aerial vehicle system and development", "Thiết kế và phát triển hệ thống phương tiện bay không người lái"), discipline: T("Engineering and robotics", "Kỹ thuật và robot"), program: T("SSET project; program not stated on the listing", "Dự án SSET; trang liệt kê không nêu chương trình"), summary: T("Students built a UAV system capable of performing complex tasks in challenging environments.", "Sinh viên xây dựng hệ thống UAV có khả năng thực hiện tác vụ phức tạp trong môi trường khó khăn."), focus: T("UAV systems and autonomous engineering", "Hệ thống UAV và kỹ thuật tự hành"), year: "Not stated", url: `${SSET_URLS.projects}/unmanned-aerial-vehical-system-design-and-development`, sourceTitle: T("RMIT Vietnam SSET student projects", "Dự án sinh viên SSET RMIT Việt Nam") },
  { id: "smart-shrimp-feeding", title: T("Design and prototype development of a smart shrimp feeding system", "Thiết kế và phát triển nguyên mẫu hệ thống cho tôm ăn thông minh"), discipline: T("Engineering and automation", "Kỹ thuật và tự động hóa"), program: T("SSET project; program not stated on the listing", "Dự án SSET; trang liệt kê không nêu chương trình"), summary: T("A prototype automates manual data collection and improves feeding accuracy and efficiency.", "Nguyên mẫu tự động hóa thu thập dữ liệu thủ công và cải thiện độ chính xác, hiệu quả cho ăn."), focus: T("Automation, sensing and aquaculture", "Tự động hóa, cảm biến và nuôi trồng thủy sản"), year: "Not stated", url: `${SSET_URLS.projects}/design-and-prototype-development-of-a-smart-shrimp-feeding-system`, sourceTitle: T("RMIT Vietnam SSET student projects", "Dự án sinh viên SSET RMIT Việt Nam") },
];

export const SSET_LINKS: readonly SSETLink[] = [
  { id: "overview", label: T("Official SSET website", "Website SSET chính thức"), description: T("School overview, programs, research, infrastructure and projects.", "Tổng quan Khoa, chương trình, nghiên cứu, cơ sở vật chất và dự án."), url: SSET_URLS.overview },
  { id: "showcase", label: T("Student project showcase", "Showcase dự án sinh viên"), description: T("Public SSET project directory hosted on the RMIT Vietnam showcase site.", "Danh mục dự án SSET công khai trên website showcase RMIT Việt Nam."), url: SSET_URLS.showcase },
  { id: "robotics", label: T("Robotics and Mechatronics Engineering", "Kỹ thuật Robot và Cơ điện tử"), description: T("BH123, Saigon South, four-year honours degree.", "BH123, Nam Sài Gòn, chương trình danh dự bốn năm."), url: SSET_PROGRAMS[0].programUrl },
  { id: "electronic", label: T("Electronic and Computer Systems Engineering", "Kỹ thuật Điện tử và Hệ thống Máy tính"), description: T("BH073, Saigon South, four-year honours degree.", "BH073, Nam Sài Gòn, chương trình danh dự bốn năm."), url: SSET_PROGRAMS[1].programUrl },
  { id: "guides", label: T("Program guides and maps", "Program guides và maps"), description: T("Use the official index for current intake files; RMIT login is required before accessing files.", "Dùng danh mục chính thức cho tệp đúng đợt nhập học; cần đăng nhập RMIT trước khi truy cập tệp."), url: SSET_URLS.guides, requiresLogin: true },
  { id: "canvas", label: T("SSET Canvas Shell", "SSET Canvas Shell"), description: T("RMIT Student Login Required. Exact public shell URL was not confirmed; use the official IT support guidance or locate the shell in your authenticated Canvas account.", "RMIT Student Login Required. Chưa xác nhận URL shell công khai; dùng hướng dẫn IT chính thức hoặc tìm shell trong tài khoản Canvas đã đăng nhập."), url: "https://www.rmit.edu.vn/students/support/it-support", requiresLogin: true },
];

export const SSET_OVERVIEW = T(
  "SSET combines internationally accredited science, engineering and technology programs with project-based learning, modern laboratories, research clusters and industry partnerships. The public school page lists Saigon South and Hanoi locations.",
  "SSET kết hợp các chương trình khoa học, kỹ thuật và công nghệ được kiểm định quốc tế với học tập qua dự án, phòng thí nghiệm hiện đại, cụm nghiên cứu và hợp tác doanh nghiệp. Trang Khoa công khai liệt kê cơ sở Nam Sài Gòn và Hà Nội.",
);

export const SSET_RESEARCH = T(
  "Public research clusters cover Community, Health and Wellbeing; Artificial Intelligence in Health Informatics; Digital Innovation for Environmental and Societal Impact; Emerging Technologies in Education; and Semiconductor and Industry 4.0. The school page also highlights River Deltas, Empowering Educators with AI and RMIT Cyber Arena projects.",
  "Các cụm nghiên cứu công khai gồm Cộng đồng, Sức khỏe và Hạnh phúc; AI trong Tin học Y tế; Đổi mới số cho Môi trường và Tác động Xã hội; Công nghệ mới nổi trong Giáo dục; và Bán dẫn, Công nghiệp 4.0. Trang Khoa cũng nêu River Deltas, Empowering Educators with AI và RMIT Cyber Arena.",
);

export const SSET_INFRASTRUCTURE = T(
  "Publicly described facilities include Windows, Robotics, Mac, Machinery, Advanced Manufacturing, IC Design and AI, Electronic, Dual OS, Linux and Flight Simulator labs. RMIT says the labs are available at both Hanoi and Saigon South campuses.",
  "Cơ sở vật chất được công bố gồm phòng Windows, Robot, Mac, Máy móc, Xưởng Sản xuất Tiên tiến, IC Design và AI, Điện tử, Dual OS, Linux và mô phỏng bay. RMIT cho biết các phòng lab có tại cả Hà Nội và Nam Sài Gòn.",
);

export const SSET_INDUSTRY = T(
  "SSET describes Work-Integrated Learning through placements, internships, capstone and industry-partnered projects, plus industry advisory committees, guest lectures, visits, mentoring and competitions.",
  "SSET mô tả Work-Integrated Learning qua placement, thực tập, capstone và dự án với doanh nghiệp; cùng hội đồng tư vấn ngành, bài giảng khách mời, tham quan, cố vấn và cuộc thi.",
);
