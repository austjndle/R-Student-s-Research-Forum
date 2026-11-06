export type StudentServiceLocalized = { en: string; vi: string };
export type StudentServiceCampus = "saigon_south" | "hanoi" | "da_nang";

export interface LostAndFoundLocation {
  campus: StudentServiceCampus;
  campusLabel: StudentServiceLocalized;
  location: StudentServiceLocalized;
  hours: StudentServiceLocalized;
  phone: string;
}

export interface LostAndFoundService {
  name: StudentServiceLocalized;
  overview: StudentServiceLocalized;
  locations: readonly LostAndFoundLocation[];
  lostProcedure: readonly StudentServiceLocalized[];
  foundProcedure: readonly StudentServiceLocalized[];
  resultTimeline: StudentServiceLocalized;
  collectionRule: StudentServiceLocalized;
  securityEmail: string;
  securityHotline: string;
  lostStudentIdGuidance: StudentServiceLocalized;
  sourceUrls: readonly string[];
  lastVerified: string;
}

const T = (en: string, vi: string): StudentServiceLocalized => ({ en, vi });

export const LOST_AND_FOUND_SERVICE: LostAndFoundService = {
  name: T("Lost and Found services", "Dịch vụ Đồ thất lạc"),
  overview: T("RMIT Vietnam students can use Lost and Found services to report lost belongings or return items they found on campus.", "Sinh viên RMIT Việt Nam có thể dùng Dịch vụ Đồ thất lạc để báo mất đồ hoặc trả lại đồ nhặt được trong trường."),
  locations: [
    { campus: "saigon_south", campusLabel: T("Saigon South", "Nam Sài Gòn"), location: T("Security Enquiries Counter — near the IT Service Desk, Level 1, Building 1", "Quầy Security Enquiries — gần IT Service Desk, Tầng 1, Tòa nhà 1"), hours: T("9:00 am–5:00 pm", "09:00–17:00"), phone: "+84 28 3776 1368" },
    { campus: "hanoi", campusLabel: T("Hanoi", "Hà Nội"), location: T("Room 1.1.005", "Phòng 1.1.005"), hours: T("9:00 am–5:00 pm", "09:00–17:00"), phone: "+84 942 347 108" },
    { campus: "da_nang", campusLabel: T("Da Nang", "Đà Nẵng"), location: T("Campus reception", "Quầy lễ tân cơ sở"), hours: T("9:00 am–5:00 pm", "09:00–17:00"), phone: "+84 236 358 2037" },
  ],
  lostProcedure: [
    T("Visit the campus security enquiries counter and fill in the paper Lost ticket.", "Đến quầy Security Enquiries của cơ sở và điền phiếu Lost bằng giấy."),
    T("You should receive a confirmation email from Security RUVN within one hour.", "Bạn sẽ nhận email xác nhận từ Security RUVN trong vòng một giờ."),
    T("The Lost and Found officers provide a result by call or email within three working days.", "Nhân viên Lost and Found sẽ trả kết quả qua điện thoại hoặc email trong vòng ba ngày làm việc."),
  ],
  foundProcedure: [
    T("Bring the found item to the relevant campus counter.", "Mang đồ nhặt được đến quầy tương ứng của cơ sở."),
    T("Fill in the paper Found ticket and wait for the acknowledgement email from Security RUVN.", "Điền phiếu Found bằng giấy và chờ email xác nhận từ Security RUVN."),
    T("Officers may contact you by email if more information is required.", "Nhân viên có thể liên hệ qua email nếu cần thêm thông tin."),
  ],
  resultTimeline: T("A result is provided within three working days after a lost-item report; this is a service timeline, not a recovery guarantee.", "Dịch vụ trả kết quả trong vòng ba ngày làm việc sau khi báo mất; đây là thời gian xử lý, không phải cam kết tìm lại được đồ."),
  collectionRule: T("If an item is found, sign off on the Found ticket and collect it at the campus security enquiries counter within 60 days from notification. Uncollected items are disposed of after 60 days.", "Nếu tìm thấy đồ, ký xác nhận trên phiếu Found và nhận tại quầy Security Enquiries trong vòng 60 ngày từ ngày được thông báo. Đồ không nhận sau 60 ngày sẽ bị xử lý theo quy định của nguồn."),
  securityEmail: "security.ruvn@rmit.edu.vn",
  securityHotline: "1800 2233",
  lostStudentIdGuidance: T("For a lost student ID card, use the official RMIT Student Cards page and Student Connect replacement route. Do not treat an ID-card replacement as only a general Lost and Found report.", "Nếu mất thẻ sinh viên, dùng trang RMIT Student Cards và kênh thay thẻ của Student Connect. Không chỉ xử lý việc mất thẻ như một yêu cầu Lost and Found thông thường."),
  sourceUrls: [
    "https://www.rmit.edu.vn/students/support/lost-and-found-services",
    "https://www.rmit.edu.vn/students/campus-life/campus-facilities/campus-security",
    "https://www.rmit.edu.vn/students/support/admin-support/rmit-student-cards",
    "https://www.rmit.edu.vn/students/support/student-connect",
  ],
  lastVerified: "2026-11-05",
};
