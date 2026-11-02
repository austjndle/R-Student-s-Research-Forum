export interface EmailTemplate {
  id: string;
  category: "consultation" | "extension" | "grade_clarification" | "group_work" | "recommendation" | "attendance";
  titleEn: string;
  titleVi: string;
  situationEn: string;
  situationVi: string;
  subjectEn: string;
  subjectVi: string;
  bodyEn: string;
  bodyVi: string;
  tipsEn: string[];
  tipsVi: string[];
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "tpl-consultation",
    category: "consultation",
    titleEn: "Request a 1-on-1 Consultation / Office Hours",
    titleVi: "Xin lịch hẹn tư vấn học thuật 1-1 (1-on-1 Consultation Request)",
    situationEn: "When you are stuck on course concepts, assignment requirements, or need academic feedback during lecturer office hours.",
    situationVi: "Khi bạn gặp khó khăn với lý thuyết bài giảng, yêu cầu bài tập hoặc cần giải đáp trực tiếp trong giờ Consultation của giảng viên.",
    subjectEn: "[COURSE_CODE] Consultation Request - [Student Name] - [Student ID]",
    subjectVi: "[MÃ_MÔN] Xin lịch tư vấn - [Họ tên] - [MSSV]",
    bodyEn: `Dear [Title + Lecturer's Last Name / Dr. Name],

I hope this email finds you well.

My name is [Your Full Name] (Student ID: [sXXXXXXX]), currently enrolled in your [Course Name] ([Course Code]) class on [Class Day and Time].

I am writing to respectfully request a brief 15-minute consultation with you regarding [specific topic or concept, e.g., the methodology section of Assessment 2 / the feedback on my recent quiz].

I have reviewed the lecture slides and course reading materials, but I would appreciate your guidance on [1-2 specific questions you prepared].

I noticed your consultation hours are listed as [Times, e.g., Wednesdays from 2:00 PM to 4:00 PM]. Would you be available to meet during that time, or alternatively via Microsoft Teams at another time that suits your schedule?

Thank you very much for your time and guidance.

Kind regards,
[Your Full Name]
[Student ID: sXXXXXXX]
[Program of Study, e.g., Bachelor of Business]
RMIT University Vietnam`,
    bodyVi: `Kính gửi [Chức danh + Họ giảng viên / Thầy, Cô],

Em hy vọng Thầy/Cô vẫn khỏe.

Em là [Họ và tên] (MSSV: [sXXXXXXX]), hiện đang học lớp [Tên môn] ([Mã môn]) vào [Ngày và giờ học].

Em viết email này để xin một buổi tư vấn ngắn khoảng 15 phút về [chủ đề hoặc khái niệm cụ thể, ví dụ: phương pháp trong Bài đánh giá 2 / nhận xét cho bài kiểm tra gần đây].

Em đã xem slide bài giảng và tài liệu môn học, nhưng mong được Thầy/Cô hướng dẫn thêm về [1–2 câu hỏi cụ thể em đã chuẩn bị].

Theo thông tin em xem được, giờ tư vấn của Thầy/Cô là [Thời gian, ví dụ: thứ Tư, 14:00–16:00]. Thầy/Cô có thể gặp em vào khung giờ đó hoặc qua Microsoft Teams vào thời gian khác phù hợp không ạ?

Em cảm ơn Thầy/Cô đã dành thời gian hướng dẫn.

Trân trọng,
[Họ và tên]
[MSSV: sXXXXXXX]
[Chương trình học, ví dụ: Cử nhân Kinh doanh]
RMIT Việt Nam`,
    tipsEn: [
      "Always state 2-3 specific questions so the lecturer knows you have already attempted the work independently.",
      "Check the syllabus/Canvas for consultation hours before suggesting a random time.",
      "Send strictly from your official RMIT student email (@rmit.edu.vn)."
    ],
    tipsVi: [
      "Luôn viết email bằng tiếng Anh chuẩn mực gửi giảng viên RMIT.",
      "Nêu rõ 1-2 câu hỏi cụ thể đã tìm hiểu trước để giảng viên thấy bạn đã đọc kỹ bài giảng.",
      "Tra cứu giờ trực (Office hours) trên Canvas trước khi đề xuất thời gian hẹn.",
      "Bắt buộc gửi từ địa chỉ email sinh viên RMIT chính thức (@rmit.edu.vn)."
    ]
  },
  {
    id: "tpl-extension-informal",
    category: "extension",
    titleEn: "Requesting Short Assessment Extension (Before Due Date)",
    titleVi: "Xin gia hạn nộp bài tập ngắn ngày (Assessment Extension Request)",
    situationEn: "When temporary unexpected circumstances or health issues arise, and you need a 24-48 hour extension before the formal deadline.",
    situationVi: "Khi gặp sự cố sức khỏe hoặc tình huống đột xuất ngoài ý muốn, cần xin gia hạn thêm 24-48 giờ trước hạn chót chính thức.",
    subjectEn: "[COURSE_CODE] Extension Request - Assessment [X] - [Student Name] - [Student ID]",
    subjectVi: "[MÃ_MÔN] Xin gia hạn bài đánh giá [X] - [Họ tên] - [MSSV]",
    bodyEn: `Dear [Title + Lecturer's Last Name],

I hope you are having a productive week.

I am writing regarding [Assessment Name, e.g., Assignment 2 - Research Report] for [Course Code], which is currently due on [Current Due Date and Time].

Unfortunately, due to [briefly state unforeseen circumstance, e.g., a sudden medical issue / acute illness for which I have attached official medical documentation], I am experiencing unexpected delays in completing my submission to the standard required.

I have already completed [mention progress, e.g., the preliminary research and outline / 60% of the draft]. Would it be possible to kindly grant an extension until [Proposed New Date and Time, e.g., Friday at 5:00 PM]?

This additional time would ensure I can submit comprehensive, high-quality work without compromising academic rigor.

Thank you very much for your understanding and consideration.

Sincerely,
[Your Full Name]
[Student ID: sXXXXXXX]`,
    bodyVi: `Kính gửi [Chức danh + Họ giảng viên / Thầy, Cô],

Em hy vọng tuần làm việc của Thầy/Cô đang diễn ra thuận lợi.

Em viết về [Tên bài đánh giá, ví dụ: Bài tập 2 - Báo cáo nghiên cứu] của môn [Mã môn], hiện có hạn nộp vào [Ngày và giờ hiện tại].

Rất tiếc, do [nêu ngắn gọn tình huống phát sinh, ví dụ: vấn đề sức khỏe đột xuất / bệnh cấp tính có đính kèm giấy tờ y tế], em đang gặp chậm trễ ngoài dự kiến và khó hoàn thành bài đúng tiêu chuẩn trước hạn hiện tại.

Em đã hoàn thành [nêu phần việc đã làm, ví dụ: nghiên cứu sơ bộ và dàn ý / 60% bản nháp]. Thầy/Cô có thể xem xét gia hạn cho em đến [Ngày và giờ đề xuất, ví dụ: thứ Sáu lúc 17:00] được không ạ?

Khoảng thời gian bổ sung sẽ giúp em hoàn thiện bài có chất lượng mà vẫn đảm bảo tính học thuật.

Em cảm ơn Thầy/Cô đã thông cảm và xem xét.

Trân trọng,
[Họ và tên]
[MSSV: sXXXXXXX]`,
    tipsEn: [
      "Send AT LEAST 24-48 hours before the deadline. Do NOT email 10 minutes before submission.",
      "Always attach verifiable medical documentation or hospital certificates if applicable.",
      "Demonstrate concrete progress so the lecturer sees you have been working actively."
    ],
    tipsVi: [
      "Luôn gửi email bằng tiếng Anh trước hạn nộp ít nhất 24 - 48 tiếng. Tuyệt đối không gửi sát giờ nộp.",
      "Đính kèm giấy chứng nhận y tế (Medical Certificate) hợp lệ từ bệnh viện/phòng khám nếu có.",
      "Nêu rõ tỷ lệ phần việc đã hoàn thành để chứng minh bạn đã chủ động làm bài từ trước."
    ]
  },
  {
    id: "tpl-grade-clarification",
    category: "grade_clarification",
    titleEn: "Respectful Grade Feedback & Clarification",
    titleVi: "Hỏi lịch sự về nhận xét & Tiêu chí chấm điểm (Grade Feedback Clarification)",
    situationEn: "When your assignment score is released and you want constructive feedback to understand where you lost marks and how to improve.",
    situationVi: "Khi bài tập đã có điểm, bạn muốn trao đổi văn minh để hiểu rõ điểm trừ và cách khắc phục cho các bài đánh giá tiếp theo.",
    subjectEn: "[COURSE_CODE] Feedback Clarification on Assessment [X] - [Student Name] - [Student ID]",
    subjectVi: "[MÃ_MÔN] Xin trao đổi về nhận xét bài đánh giá [X] - [Họ tên] - [MSSV]",
    bodyEn: `Dear [Title + Lecturer's Last Name],

I hope you are well.

I am writing regarding the marks and feedback released for [Assessment Name, e.g., Assessment 1 Essay] in [Course Code].

First of all, thank you for providing the rubric assessment and written comments. I have carefully reviewed your feedback, particularly regarding [mention feedback point, e.g., critical analysis in Section 3 / literature synthesis].

I would be very grateful for the opportunity to discuss this briefly with you during consultation hours. My goal is to better understand how I can refine my academic writing and critical argument structure for the upcoming final assessment.

Please let me know if you would have 10-15 minutes available during your next office hours or via Microsoft Teams.

Thank you very much for your guidance and support.

Kind regards,
[Your Full Name]
[Student ID: sXXXXXXX]`,
    bodyVi: `Kính gửi [Chức danh + Họ giảng viên / Thầy, Cô],

Em hy vọng Thầy/Cô vẫn khỏe.

Em viết về điểm số và nhận xét của [Tên bài đánh giá, ví dụ: Bài luận 1] trong môn [Mã môn].

Trước hết, em cảm ơn Thầy/Cô đã chấm theo rubric và ghi nhận xét. Em đã đọc kỹ phản hồi, đặc biệt là phần [nêu nhận xét, ví dụ: phân tích phản biện ở Mục 3 / tổng hợp tài liệu].

Em mong có thể trao đổi ngắn với Thầy/Cô trong giờ tư vấn để hiểu rõ hơn cách cải thiện bài viết học thuật và lập luận cho bài đánh giá cuối kỳ.

Thầy/Cô có thể cho em biết liệu mình có khoảng 10–15 phút trong giờ tư vấn sắp tới hoặc qua Microsoft Teams không ạ?

Em cảm ơn Thầy/Cô đã hướng dẫn và hỗ trợ.

Trân trọng,
[Họ và tên]
[MSSV: sXXXXXXX]`,
    tipsEn: [
      "Never accuse the lecturer of unfair grading. Focus on learning, clarifying rubrics, and improving next time.",
      "Quote the specific feedback comment or rubric criterion you wish to discuss."
    ],
    tipsVi: [
      "Giữ thái độ cầu thị, tôn trọng. Mục tiêu là học hỏi cách hoàn thiện tiêu chí rubric cho bài sau, không tranh cãi đòi điểm.",
      "Trích dẫn cụ thể tiêu chí chấm trong rubric mà bạn muốn được giải thích sâu hơn."
    ]
  },
  {
    id: "tpl-group-work-issue",
    category: "group_work",
    titleEn: "Reporting Non-Responsive / Free-Rider Group Member",
    titleVi: "Báo cáo vấn đề thành viên nhóm không hợp tác (Group Work Conflict)",
    situationEn: "When a team member repeatedly fails to respond to messages, misses deadlines, or submits plagiarized content.",
    situationVi: "Khi có thành viên nhóm liên tục không phản hồi, không nộp phần việc được giao, hoặc nộp bài đạo văn làm ảnh hưởng đến cả nhóm.",
    subjectEn: "[COURSE_CODE] Group Work Update - Group [X] - [Course Code]",
    subjectVi: "[MÃ_MÔN] Cập nhật tình hình nhóm [X] - [Mã môn]",
    bodyEn: `Dear [Title + Lecturer's Last Name],

I am writing on behalf of Group [X] for [Course Name] ([Course Code]), which includes [Member Names].

We have been actively collaborating on [Assessment Name]. However, we are encountering significant communication challenges with [Member's Name], which we have been unable to resolve internally.

To provide context:
1. On [Date 1], the group agreed upon task allocations with a deadline of [Date].
2. [Member's Name] has missed scheduled group meetings on [Dates] and has not responded to multiple outreach attempts via Teams and student email (evidence log attached).
3. The group has attempted to reach out on [Date] to offer support, but received no response.

With the submission deadline approaching on [Due Date], our remaining team members are taking on the outstanding workload to ensure the project meets course guidelines.

We would appreciate your advice on how you would like us to proceed regarding the group contract and individual peer contribution assessment (SPARKPlus / peer evaluation).

Thank you for your guidance.

Sincerely,
[Your Full Name] on behalf of Group [X]
[Student ID: sXXXXXXX]`,
    bodyVi: `Kính gửi [Chức danh + Họ giảng viên / Thầy, Cô],

Em viết thay mặt Nhóm [X] của môn [Tên môn] ([Mã môn]), gồm các thành viên [Tên thành viên].

Nhóm đang phối hợp thực hiện [Tên bài đánh giá]. Tuy nhiên, nhóm đang gặp khó khăn trong việc liên lạc với [Tên thành viên] và chưa thể tự giải quyết vấn đề.

Em xin cung cấp một số thông tin:
1. Ngày [Ngày 1], nhóm đã thống nhất phân chia nhiệm vụ với hạn hoàn thành là [Ngày].
2. [Tên thành viên] đã vắng các buổi họp nhóm vào [Các ngày] và chưa phản hồi nhiều lần liên hệ qua Teams và email sinh viên (nhóm có lưu nhật ký liên hệ).
3. Nhóm đã liên hệ vào [Ngày] để hỏi thăm và hỗ trợ nhưng chưa nhận được phản hồi.

Khi hạn nộp [Ngày nộp] đang đến gần, các thành viên còn lại đang tiếp nhận phần việc chưa hoàn thành để đảm bảo bài nộp theo yêu cầu môn học.

Nhóm mong nhận được hướng dẫn của Thầy/Cô về cách xử lý tiếp theo đối với hợp đồng nhóm và đánh giá mức đóng góp cá nhân (SPARKPlus / đánh giá đồng đẳng).

Em cảm ơn Thầy/Cô đã hướng dẫn.

Trân trọng,
[Họ và tên] thay mặt Nhóm [X]
[MSSV: sXXXXXXX]`,
    tipsEn: [
      "Maintain a professional tone. State verifiable facts and dates without emotional language.",
      "Keep screenshots of Teams chats, message timestamps, and commit histories as an evidence log.",
      "Alert the lecturer at least 1-2 weeks before due date, not the night before submission."
    ],
    tipsVi: [
      "Trình bày khách quan bằng tiếng Anh chuẩn, nêu rõ mốc ngày tháng và sự việc cụ thể.",
      "Lưu bằng chứng: ảnh chụp tin nhắn nhắc nhở trên Teams, lịch họp vắng mặt, lịch sử chỉnh sửa tài liệu.",
      "Báo giảng viên sớm trước 1-2 tuần trước hạn nộp để giảng viên can thiệp xử lý điểm SPARKPlus."
    ]
  },
  {
    id: "tpl-recommendation-letter",
    category: "recommendation",
    titleEn: "Requesting Academic Recommendation Letter for Scholarship / Exchange",
    titleVi: "Xin thư giới thiệu học thuật (Recommendation Letter Request)",
    situationEn: "When you need a lecturer who taught you to write a reference letter for a scholarship, Melbourne cross-campus exchange, or master's program.",
    situationVi: "Khi cần xin giảng viên từng dạy viết thư giới thiệu cho học bổng, chương trình chuyển tiếp Melbourne hoặc du học thạc sĩ.",
    subjectEn: "Recommendation Letter Request - [Your Full Name] - [Student ID]",
    subjectVi: "Xin thư giới thiệu học thuật - [Họ tên] - [MSSV]",
    bodyEn: `Dear [Title + Lecturer's Last Name],

I hope this email finds you well.

My name is [Your Full Name] (Student ID: sXXXXXXX). I was a student in your [Course Code - Course Name] class during [Semester and Year, e.g., Semester 1 2025], in which I achieved [your grade, e.g., High Distinction (88%)]. I particularly enjoyed [mention an assignment, topic, or discussion you excelled at in their course].

I am currently preparing an application for [Name of Scholarship / RMIT Melbourne Cross-Campus Exchange / Master's Program] with a submission deadline of [Application Deadline].

Given your familiarity with my academic engagement and dedication in class, I would be deeply honored if you would consider writing a letter of recommendation supporting my application.

To assist you with this, I have attached:
- My updated Academic Transcript
- My current CV / Resume
- A draft of my Statement of Purpose and program overview

I completely understand your busy schedule, and there is no obligation if your commitments prevent this. If you are willing, I would be delighted to provide any additional details you might need.

Thank you very much for your time and continued support.

Warm regards,
[Your Full Name]
[Student ID: sXXXXXXX]`,
    bodyVi: `Kính gửi [Chức danh + Họ giảng viên / Thầy, Cô],

Em hy vọng email này đến với Thầy/Cô vào lúc thuận lợi.

Em là [Họ và tên] (MSSV: sXXXXXXX), từng học lớp [Mã môn - Tên môn] của Thầy/Cô vào [Học kỳ và năm, ví dụ: Học kỳ 1 năm 2025] và đạt [điểm, ví dụ: Xuất sắc (88%)]. Em đặc biệt yêu thích [nêu bài tập, chủ đề hoặc phần thảo luận em đã thực hiện tốt trong môn].

Hiện em đang chuẩn bị hồ sơ cho [Tên học bổng / chương trình Cross-campus tại RMIT Melbourne / chương trình Thạc sĩ], hạn nộp vào [Hạn đăng ký].

Vì Thầy/Cô đã biết quá trình học tập và mức độ tham gia của em trên lớp, em rất mong Thầy/Cô cân nhắc viết thư giới thiệu hỗ trợ hồ sơ của em.

Để Thầy/Cô tiện tham khảo, em gửi kèm:
- Bảng điểm học tập mới nhất
- CV hiện tại
- Bản nháp bài luận mục tiêu học tập và thông tin chương trình

Em hiểu Thầy/Cô có lịch làm việc bận rộn và hoàn toàn thông cảm nếu Thầy/Cô không thể nhận lời. Nếu Thầy/Cô đồng ý, em sẵn sàng cung cấp thêm thông tin cần thiết.

Em chân thành cảm ơn Thầy/Cô vì thời gian và sự hỗ trợ.

Thân mến,
[Họ và tên]
[MSSV: sXXXXXXX]`,
    tipsEn: [
      "Ask at least 3-4 weeks in advance of your application deadline.",
      "Always attach your CV, transcript, and statement of purpose so the lecturer can write detailed, personalized praise.",
      "Choose lecturers in whose courses you actively participated and earned a Distinction or High Distinction."
    ],
    tipsVi: [
      "Xin thư giới thiệu trước hạn chót hồ sơ ít nhất 3 đến 4 tuần.",
      "Luôn đính kèm CV, bảng điểm và bài luận (SOP) để giảng viên có tư liệu viết thư thuyết phục.",
      "Chọn giảng viên mà bạn từng tương tác tích cực trên lớp và đạt điểm Giỏi (DI) hoặc Xuất sắc (HD)."
    ]
  }
];
