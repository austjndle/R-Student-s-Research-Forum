export interface AiPromptTemplate {
  id: string;
  category: "email_writing" | "course_study" | "assignment_prep" | "consult_prep";
  titleEn: string;
  titleVi: string;
  purposeEn: string;
  purposeVi: string;
  promptTextEn: string;
  promptTextVi: string;
  variables: { name: string; descriptionEn: string; descriptionVi: string }[];
}

export const STUDENT_AI_PROMPTS: AiPromptTemplate[] = [
  {
    id: "prompt-draft-consult-mail",
    category: "email_writing",
    titleEn: "Draft a Consultation Request Email to Lecturer",
    titleVi: "Tạo Email xin lịch hẹn Consult với Giảng viên",
    purposeEn: "Feed this prompt to ChatGPT or the R Research Assistant with your specific course issue to get a polished, respectful email.",
    purposeVi: "Dán prompt này vào AI kèm thông tin môn học và câu hỏi của bạn để tạo email chuẩn mực, lễ phép gửi giảng viên.",
    promptTextEn: `You are an academic communication expert at RMIT University Vietnam.
Please write a polite, concise, and professional email to my lecturer requesting a 15-minute consultation.

My details:
- Student Name: [YOUR_NAME]
- Student ID: [YOUR_STUDENT_ID]
- Course Code & Name: [COURSE_CODE_AND_NAME]
- Specific Problem/Questions I need help with: [EXPLAIN_YOUR_ISSUE_HERE]
- What I have already tried: [BRIEFLY_MENTION_WHAT_YOU_READ_OR_TRIED]
- Lecturer Consultation Hours on Canvas: [E.G._WEDNESDAYS_2PM_TO_4PM]

Requirements:
- Subject line formatted as: [Course Code] Consultation Request - [My Name] - [Student ID]
- Formal and respectful tone.
- Clear statement of context and specific questions so the lecturer knows I prepared in advance.
- Offer to meet in person during office hours or via Microsoft Teams.`,
    promptTextVi: `Bạn là chuyên gia cố vấn giao tiếp học thuật tại Đại học RMIT Việt Nam.
Hãy giúp tôi viết một email trang trọng, lịch sự và ngắn gọn gửi giảng viên để xin lịch hẹn trao đổi học vụ (Consultation) 15 phút.

Thông tin của tôi:
- Họ và tên sinh viên: [HỌ_VÀ_TÊN_CỦA_BẠN]
- Mã số sinh viên: [MÃ_SỐ_sXXXXXXX]
- Mã môn & Tên môn học: [MÃ_MÔN_VÀ_TÊN_MÔN]
- Vấn đề/Câu hỏi cụ thể tôi cần hỏi: [MÔ_TẢ_VẤN_ĐỀ_BẠN_ĐANG_GẶP]
- Những gì tôi đã chủ động tự đọc/làm thử trước: [BẠN_ĐÃ_ĐỌC_SLIDE_HOẶC_LÀM_ĐƯỢC_GÌ]
- Khung giờ trực Office Hours của giảng viên trên Canvas: [VÍ_DỤ_THỨ_TƯ_14H_ĐẾN_16H]

Yêu cầu:
- Tiêu đề email chuẩn format: [Mã môn] Đăng ký lịch hẹn tư vấn - [Họ tên] - [sXXXXXXX]
- Giọng văn lễ phép, tôn trọng, cầu thị.
- Trình bày rõ ràng vấn đề để giảng viên thấy tôi đã chủ động nghiên cứu trước.
- Đề xuất gặp trực tiếp tại văn phòng hoặc qua Microsoft Teams.`,
    variables: [
      { name: "COURSE_CODE_AND_NAME", descriptionEn: "e.g. COSC2635 Web Development Technologies", descriptionVi: "ví dụ: COSC2635 Công nghệ Phát triển Web" },
      { name: "EXPLAIN_YOUR_ISSUE_HERE", descriptionEn: "Specific concepts, assessment rubric criteria, or thesis arguments you need help with", descriptionVi: "Khái niệm lý thuyết hoặc tiêu chí chấm bài bạn đang vướng mắc" },
    ]
  },
  {
    id: "prompt-prepare-consult-questions",
    category: "consult_prep",
    titleEn: "Brainstorm 3 High-Value Consultation Questions",
    titleVi: "Lên danh sách 3 câu hỏi chất lượng cao trước buổi Consult",
    purposeEn: "Help you convert vague assignment confusion into sharp, impressive academic questions before meeting your lecturer.",
    purposeVi: "Biến những băn khoăn mơ hồ về đề bài thành 3 câu hỏi sắc bén, thể hiện tư duy phản biện trước khi gặp giảng viên.",
    promptTextEn: `I am an RMIT Vietnam student preparing for an upcoming 15-minute consultation with my lecturer for the course [COURSE_NAME].
Here is the assessment prompt or topic I am working on:
"""
[PASTE_YOUR_ASSESSMENT_PROMPT_OR_TOPIC_HERE]
"""

Here is what I currently understand and have drafted so far:
"""
[PASTE_YOUR_CURRENT_IDEAS_OR_OUTLINE_HERE]
"""

Please formulate 3 specific, intellectually engaging questions I can ask my lecturer during the consultation. The questions should:
1. Demonstrate that I have thoroughly read the rubrics and attempted the work independently.
2. Seek clarification on strategic methodology or theoretical application rather than basic factual questions already answered in the brief.
3. Help me unlock actionable next steps for a High Distinction (HD) grade.`,
    promptTextVi: `Tôi là sinh viên RMIT Việt Nam đang chuẩn bị cho buổi hẹn tư vấn học thuật 15 phút với giảng viên môn [TÊN_MÔN_HỌC].
Đây là đề bài hoặc chủ đề bài tập tôi đang thực hiện:
"""
[DÁN_ĐỀ_BÀI_HOẶC_CHỦ_ĐỀ_TẠI_ĐÂY]
"""

Đây là những gì tôi đã hiểu và phác thảo được đến hiện tại:
"""
[DÁN_DÀN_Ý_HOẶC_Ý_TƯỞNG_CỦA_BẠN_TẠI_ĐÂY]
"""

Hãy giúp tôi xây dựng 3 câu hỏi thảo luận sâu sắc, thông minh để hỏi giảng viên trong buổi gặp. Các câu hỏi cần:
1. Chứng minh được tôi đã đọc kỹ rubric và chủ động suy nghĩ trước.
2. Tập trung vào cách áp dụng phương pháp lý thuyết hoặc góc nhìn phản biện, thay vì hỏi những câu cơ bản đã có sẵn trong đề.
3. Định hướng giúp tôi đạt điểm Giỏi / Xuất sắc (Distinction / High Distinction).`,
    variables: [
      { name: "COURSE_NAME", descriptionEn: "Course title", descriptionVi: "Tên môn học" },
      { name: "ASSESSMENT_PROMPT", descriptionEn: "Assignment description", descriptionVi: "Đề bài tập" },
    ]
  },
  {
    id: "prompt-breakdown-assignment-rubric",
    category: "assignment_prep",
    titleEn: "Deconstruct Assignment Rubric & Create Step-by-Step Plan",
    titleVi: "Phân tích Rubric bài tập & Lập kế hoạch từng bước đạt điểm HD",
    purposeEn: "Break down complex assignment instructions and marking rubrics into a clear checklist with milestones.",
    purposeVi: "Bẻ nhỏ bảng tiêu chí chấm điểm (Rubric) phức tạp thành danh sách công việc rõ ràng theo từng mốc thời gian.",
    promptTextEn: `Act as a senior academic tutor at RMIT University.
I need to deconstruct my course assessment to achieve a High Distinction (HD).

Here is the assessment brief and marking rubric:
"""
[PASTE_RUBRIC_AND_BRIEF_HERE]
"""

Please provide:
1. Key Hurdle Requirements: Any mandatory rules (minimum word count, mandatory citation styles, passing thresholds).
2. Distinction vs High Distinction Differences: What specific analytical depth elevates this paper to an HD?
3. Actionable Milestone Schedule: Break the timeline down into 4 clear phases (Research, Drafting, Peer Review, Final Polish) before the deadline of [DUE_DATE].
4. Potential Pitfalls: 3 common mistakes students make on this type of assignment at RMIT.`,
    promptTextVi: `Hãy đóng vai trò là một trợ giảng học thuật kỳ cựu tại Đại học RMIT.
Tôi cần phân tích đề bài và bảng rubric chấm điểm để hướng tới mục tiêu đạt điểm High Distinction (HD).

Đây là đề bài và bảng tiêu chí rubric của môn học:
"""
[DÁN_RUBRIC_VÀ_ĐỀ_BÀI_TẠI_ĐÂY]
"""

Hãy phân tích và cung cấp cho tôi:
1. Điều kiện tiên quyết (Hurdles): Các quy định bắt buộc phải đạt (số từ tối thiểu, chuẩn trích dẫn, điều kiện qua môn).
2. Sự khác biệt giữa điểm Giỏi (DI) và Xuất sắc (HD): Tiêu chí nào giúp bài viết bứt phá lên mức điểm cao nhất?
3. Lộ trình thực hiện 4 giai đoạn: Chia nhỏ tiến độ thành 4 mốc (Nghiên cứu tài liệu, Viết bản thảo, Rà soát phản biện, Chỉnh sửa hoàn thiện) trước hạn nộp ngày [HẠN_NỘP].
4. Các bẫy thường gặp (Pitfalls): 3 lỗi phổ biến sinh viên RMIT hay mắc phải với dạng bài này.`,
    variables: [
      { name: "PASTE_RUBRIC_AND_BRIEF_HERE", descriptionEn: "Full rubric text from Canvas", descriptionVi: "Nội dung bảng rubric copy từ Canvas" },
      { name: "DUE_DATE", descriptionEn: "Submission deadline", descriptionVi: "Hạn chót nộp bài" },
    ]
  },
  {
    id: "prompt-draft-extension-request",
    category: "email_writing",
    titleEn: "Draft Polite Assessment Extension Request",
    titleVi: "Viết Email xin gia hạn nộp bài tập (Assessment Extension)",
    purposeEn: "Generate a compassionate, professional extension email highlighting your current progress and verifiable reasons.",
    purposeVi: "Tạo email xin gia hạn nộp bài tập lễ phép, kèm báo cáo tiến độ và lý do bất khả kháng thuyết phục.",
    promptTextEn: `Write a respectful, concise email to my RMIT lecturer requesting a [NUMBER_OF_DAYS]-day extension on my assignment.

My details:
- Name: [YOUR_NAME]
- Student ID: [YOUR_STUDENT_ID]
- Course: [COURSE_CODE_AND_NAME]
- Assignment Title: [ASSIGNMENT_TITLE]
- Current Deadline: [CURRENT_DEADLINE]
- Reason for delay: [MEDICAL_OR_UNFORESEEN_EMERGENCY]
- Proof attached: [MEDICAL_CERTIFICATE_OR_HOSPITAL_RECORD]
- Current Progress: [I_HAVE_COMPLETED_OUTLINE_AND_X%_OF_DRAFT]
- Proposed New Deadline: [REQUESTED_NEW_DEADLINE]

Requirements:
- Empathetic, professional tone.
- Clearly states why the extension is needed and demonstrates that substantial work has already begun.
- Reassures the lecturer that the extra time will ensure quality academic submission.`,
    promptTextVi: `Hãy viết một email lịch sự, ngắn gọn gửi giảng viên RMIT xin gia hạn nộp bài tập thêm [SỐ_NGÀY] ngày.

Thông tin của tôi:
- Họ tên: [HỌ_VÀ_TÊN_CỦA_BẠN]
- Mã số sinh viên: [sXXXXXXX]
- Môn học: [MÃ_MÔN_VÀ_TÊN_MÔN]
- Tên bài tập: [TÊN_BÀI_TẬP_ASSIGNMENT]
- Hạn nộp hiện tại: [HẠN_NỘP_HIỆN_TẠI]
- Lý do xin gia hạn: [LÝ_DO_SỨC_KHỎE_HOẶC_SỰ_CỐ_BẤT_KHẢ_KHÁNG]
- Giấy tờ đính kèm: [GIẤY_KHÁM_BỆNH_HOẶC_MINH_CHỨNG]
- Tiến độ bài làm hiện tại: [TÔI_ĐÃ_LÀM_XONG_DÀN_Ý_VÀ_X%_BÀI_VIẾT]
- Thời hạn nộp mới đề xuất: [THỜI_HẠN_MỚI_MONG_MUỐN]

Yêu cầu:
- Giọng văn chân thành, lịch sự và khiêm tốn.
- Nêu rõ lý do và chứng minh tôi đã tích cực làm bài từ trước chứ không phải trì hoãn nước đến chân mới nhảy.
- Khẳng định khoảng thời gian gia hạn sẽ giúp tôi hoàn thiện bài làm tốt nhất theo chuẩn RMIT.`,
    variables: [
      { name: "ASSIGNMENT_TITLE", descriptionEn: "e.g. Assessment 2 - Strategic Marketing Plan", descriptionVi: "ví dụ: Assessment 2 - Báo cáo Kế hoạch Marketing" },
      { name: "REASON", descriptionEn: "Unforeseen medical condition or emergency", descriptionVi: "Lý do sức khỏe hoặc tình huống đột xuất" },
    ]
  }
];
