export interface FloorHours {
  floor: string;
  facilitiesEn: string;
  facilitiesVi: string;
  weekdayHours: string;
  saturdayHours: string;
  sundayHours: string;
  airConditioningHours?: string;
  notesEn?: string;
  notesVi?: string;
}

export interface BuildingInfo {
  id: string;
  nameEn: string;
  nameVi: string;
  campus: "saigon_south" | "hanoi";
  overviewEn: string;
  overviewVi: string;
  floorPlanPdfUrl?: string;
  googleMapsUrl?: string;
  floors: FloorHours[];
}

export const RMIT_CAMPUS_HOURS: BuildingInfo[] = [
  // ==========================================
  // SAIGON SOUTH CAMPUS (SGS)
  // ==========================================
  {
    id: "sgs-b1",
    nameEn: "Building 1 (Beanland Academic & Library Building)",
    nameVi: "Tòa nhà 1 (Khu Học thuật & Thư viện Beanland)",
    campus: "saigon_south",
    overviewEn: "Building 1 houses Student Connect, The Beanland Library, IT Service Desk, Food Court, lecture halls, and academic staff offices.",
    overviewVi: "Tòa nhà 1 là trung tâm học thuật chính, gồm quầy Student Connect, Thư viện Beanland, Quầy hỗ trợ IT, Khu ẩm thực Food Court và văn phòng khoa.",
    floorPlanPdfUrl: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/students/maps/beanland-building-map.pdf",
    googleMapsUrl: "https://www.google.com/maps/place/RMIT+University+Vietnam,+Saigon+South+campus/@10.729567,106.6908869,17z/data=!3m1!4b1!4m5!3m4!1s0x31752fbea5fe3db1:0xfae94aca5709003f!8m2!3d10.729567!4d106.6930756",
    floors: [
      {
        floor: "Level 1 (Tầng 1 - Sảnh chính)",
        facilitiesEn: "Main Entrance Foyer, Reception & Security Desk, Student Connect Hub (Room 1.1.001), Food Court & Cafeteria (Noodle U, Global Café), ATM, Printing Stations",
        facilitiesVi: "Sảnh đón tiếp chính, Quầy an ninh, Trung tâm Hỗ trợ Sinh viên Student Connect (Phòng 1.1.001), Khu ẩm thực Food Court (Noodle U, Global Café), Cây ATM, Trạm in sinh viên",
        weekdayHours: "07:30 - 21:00",
        saturdayHours: "07:30 - 18:00",
        sundayHours: "Đóng cửa (Ngoại trừ sự kiện trường)",
        airConditioningHours: "08:00 - 18:00",
        notesVi: "Quầy Student Connect làm việc từ 08:30 - 17:00 (Thứ 2 - Thứ 6). Lễ tân và quầy an ninh túc trực theo giờ mở cửa của tòa nhà.",
        notesEn: "Student Connect service desk operates 08:30 - 17:00 (Mon - Fri). Security desk is staffed throughout building opening hours.",
      },
      {
        floor: "Level 2 & 3 (Tầng 2 & 3 - Thư viện Beanland)",
        facilitiesEn: "The Beanland Library (Main Service Desk, Borrowing / Return Stations, High-Use Reserves, Silent Study Zone, Collaborative Pods, Group Study Rooms)",
        facilitiesVi: "Thư viện Beanland (Quầy dịch vụ chính, Máy mượn trả tự động, Sách học phần mượn gấp, Khu tự học yên tĩnh, Phòng thảo luận nhóm)",
        weekdayHours: "08:00 - 21:00",
        saturdayHours: "08:00 - 17:00",
        sundayHours: "08:00 - 17:00",
        airConditioningHours: "08:00 - 21:00",
        notesVi: "Theo RMIT Library: Đặc biệt trong kỳ thi (Tuần 10–12), mở cửa Thứ 2–Chủ nhật: 08:00–21:00.",
        notesEn: "According to RMIT Library: During exam weeks 10–12, open Monday–Sunday from 8am–9pm.",
      },
      {
        floor: "Level 3 Entrance (Lối vào chính Thư viện)",
        facilitiesEn: "Library Main Entrance (via Lifts in Building 1 / Beanland Building), Wheelchair Accessible Entrance, Library Restrooms",
        facilitiesVi: "Lối vào chính Thư viện Beanland (đi thang máy Tòa nhà 1), Lối đi hỗ trợ xe lăn, Nhà vệ sinh thư viện",
        weekdayHours: "08:00 - 21:00",
        saturdayHours: "08:00 - 17:00",
        sundayHours: "08:00 - 17:00",
        airConditioningHours: "08:00 - 21:00",
        notesVi: "Cửa vào chính của Thư viện Beanland đặt tại Tầng 3 (Level 3 Beanland Building) theo đúng chỉ dẫn của Thư viện trường.",
        notesEn: "Main library entrance is located on Level 3 of the Beanland Building with full wheelchair lift access.",
      },
      {
        floor: "Level 4 (Tầng 4)",
        facilitiesEn: "IT Service Desk Counter, Computer Labs, Collaborative Training Classrooms",
        facilitiesVi: "Quầy hỗ trợ kỹ thuật IT Service Desk, Phòng thực hành máy tính sinh viên, Phòng học tương tác",
        weekdayHours: "08:00 - 18:00",
        saturdayHours: "08:00 - 16:00",
        sundayHours: "Đóng cửa",
        airConditioningHours: "08:00 - 18:00",
        notesVi: "Bộ phận IT hỗ trợ trực tiếp cài đặt phần mềm bản quyền (Office 365, Adobe CC) và khắc phục lỗi Wi-Fi.",
        notesEn: "IT counter provides software license setup (Office 365, Adobe CC) and Wi-Fi network support.",
      },
      {
        floor: "Level 5 & 6 (Tầng 5 & 6)",
        facilitiesEn: "Faculty Academic Offices (The Business School), Meeting Rooms, Quiet Study Corners",
        facilitiesVi: "Văn phòng làm việc của giảng viên Khoa Kinh doanh, Phòng họp khoa, Góc tự học sinh viên",
        weekdayHours: "07:30 - 18:00",
        saturdayHours: "07:30 - 13:00 (Khi có lịch thi)",
        sundayHours: "Đóng cửa",
        airConditioningHours: "08:00 - 17:30",
      },
    ],
  },
  {
    id: "sgs-b2",
    nameEn: "Academic Building 2 (Innovation & Creative Studios)",
    nameVi: "Tòa nhà Học thuật 2 (Khu Đổi mới & Studio Sáng tạo)",
    campus: "saigon_south",
    overviewEn: "Dedicated to the School of Communication & Design and SSET, featuring high-spec Mac labs, engineering workshops, and lecture theatres.",
    overviewVi: "Khu phức hợp sáng tạo thuộc Khoa Truyền thông - Thiết kế và Khoa Công nghệ SSET với phòng máy Mac đồ họa cao cấp và xưởng chế tác.",
    floorPlanPdfUrl: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/students/maps/academic-building-2-floor-plan.pdf",
    googleMapsUrl: "https://www.google.com/maps/place/RMIT+Vietnam+Academic+Building+2/@10.7295037,106.6934588,17z/data=!3m1!4b1!4m6!3m5!1s0x31752fbe9bf5b539:0xee2e96d8e65fcc4d!8m2!3d10.7295037!4d106.6960337!16s%2Fg%2F11cs12f2pn?entry=ttu",
    floors: [
      {
        floor: "Ground Floor (Tầng Trệt)",
        facilitiesEn: "Main Lecture Theatres (Theatre 1 & 2), Exhibition Foyer, Student Lockers",
        facilitiesVi: "Hội trường lớn (Theatre 1 & 2), Sảnh triển lãm nghệ thuật, Khu tủ khóa cá nhân sinh viên",
        weekdayHours: "07:30 - 21:00",
        saturdayHours: "07:30 - 18:00",
        sundayHours: "Đóng cửa",
        airConditioningHours: "08:00 - 18:00",
      },
      {
        floor: "Level 1, 2 & 3 (Tầng 1, 2, 3)",
        facilitiesEn: "Design Studios, High-spec Apple Mac Labs, Digital Media Labs, 3D Laser Cutting Workshop, Classrooms",
        facilitiesVi: "Phòng máy Apple Mac chuyên dụng đồ họa, Studio truyền thông đa phương tiện, Xưởng in ấn 3D & Cắt laser, Các phòng học học phần",
        weekdayHours: "08:00 - 20:30",
        saturdayHours: "08:00 - 17:00",
        sundayHours: "Đóng cửa",
        airConditioningHours: "08:00 - 20:00",
        notesVi: "Phòng máy Apple Mac và xưởng in laser dành cho sinh viên Khoa SCD và SSET (yêu cầu quẹt thẻ sinh viên đúng ngành).",
        notesEn: "High-spec Apple Mac labs and digital laser workshops require enrolled student ID tap access.",
      },
      {
        floor: "Level 4 (Tầng 4)",
        facilitiesEn: "School of Science, Engineering & Technology (SSET) Faculty Offices, PhD Business Research Office, Postgraduate Suites",
        facilitiesVi: "Văn phòng Khoa Khoa học, Kỹ thuật & Công nghệ (SSET), Văn phòng Nghiên cứu sinh Tiến sĩ Kinh doanh (PhD Business), Phòng làm việc Sau đại học",
        weekdayHours: "08:30 - 17:30",
        saturdayHours: "Nghỉ",
        sundayHours: "Đóng cửa",
        airConditioningHours: "08:30 - 17:30",
        notesVi: "Khu vực văn phòng làm việc và học vụ của Khoa SSET và khối Nghiên cứu sinh PhD Business.",
        notesEn: "Official academic and faculty offices for SSET and PhD Business candidates.",
      },
      {
        floor: "Level 5 (Tầng 5)",
        facilitiesEn: "School of Communication & Design (SCD) Faculty Offices, Creative Academic Suites, Staff Consultation Rooms",
        facilitiesVi: "Văn phòng Khoa Truyền thông & Thiết kế (SCD), Phòng làm việc chuyên môn giảng viên sáng tạo, Phòng consult giảng viên",
        weekdayHours: "08:30 - 17:30",
        saturdayHours: "Nghỉ",
        sundayHours: "Đóng cửa",
        airConditioningHours: "08:30 - 17:30",
        notesVi: "Văn phòng làm việc và tiếp sinh viên chính thức của Khoa Truyền thông & Thiết kế (SCD).",
        notesEn: "Official faculty and academic consultation offices for the School of Communication & Design (SCD).",
      },
    ],
  },
  {
    id: "sgs-sports",
    nameEn: "RMIT Active Hub & Sports Hall (Saigon South)",
    nameVi: "Nhà thi đấu Thể thao & Phòng Gym RMIT Active Hub (Nam Sài Gòn)",
    campus: "saigon_south",
    overviewEn: "Multi-court indoor sports hall, fitness gym with weights and cardio machines, outdoor football pitch, and tennis courts.",
    overviewVi: "Nhà thi đấu thể thao đa năng trong nhà, phòng gym hiện đại với máy cardio và tạ, sân bóng đá ngoài trời và sân quần vợt.",
    googleMapsUrl: "https://www.google.com/maps/place/RMIT+University+Vietnam,+Saigon+South+campus/@10.729567,106.6908869,17z/data=!3m1!4b1!4m5!3m4!1s0x31752fbea5fe3db1:0xfae94aca5709003f!8m2!3d10.729567!4d106.6930756",
    floors: [
      {
        floor: "Indoor Sports Hall (Sân đa năng trong nhà)",
        facilitiesEn: "Basketball courts (Home of RMIT Redbacks), Badminton courts, Volleyball, Futsal, Bleachers seating",
        facilitiesVi: "Sân bóng rổ (Sân nhà đội tuyển RMIT Redbacks), Sân cầu lông, Sân bóng chuyền, Futsal, Khán đài",
        weekdayHours: "07:00 - 21:00",
        saturdayHours: "07:00 - 19:00",
        sundayHours: "08:00 - 18:00",
        airConditioningHours: "Theo lịch tập luyện & giải đấu",
        notesVi: "Sinh viên bắt buộc mang giày đế mềm không để lại vết bẩn (non-marking athletic footwear).",
        notesEn: "Strictly requires non-marking athletic footwear.",
      },
      {
        floor: "Fitness Gym / Active Hub (Phòng Gym)",
        facilitiesEn: "Free weights, Treadmills, Rowing machines, Changing rooms, Hot showers, Lockers",
        facilitiesVi: "Khu tạ tự do, Máy chạy bộ, Máy chèo thuyền, Phòng thay đồ & Tắm nóng lạnh, Tủ đồ an ninh",
        weekdayHours: "06:30 - 20:30",
        saturdayHours: "07:30 - 18:30",
        sundayHours: "08:00 - 17:00",
        airConditioningHours: "Toàn bộ thời gian mở cửa",
        notesVi: "Miễn phí 100% cho sinh viên RMIT. Bắt buộc quẹt thẻ sinh viên và mang theo khăn tập cá nhân.",
        notesEn: "100% free for active students. Must bring a workout towel and Student ID card.",
      },
    ],
  },
  {
    id: "sgs-b10",
    nameEn: "Recreation & Events Complex - Building 10 (Student Life & Club Hub)",
    nameVi: "Khu Phức hợp Thể thao & Sự kiện - Tòa nhà 10 (Trụ sở Student Life & CLB)",
    campus: "saigon_south",
    overviewEn: "Home of RMIT Student Life, official Club Hub, student lounges, Sorrento restaurant, and recreation spaces.",
    overviewVi: "Trụ sở của phòng Đời sống Sinh viên (Student Life), văn phòng CLB Club Hub, sảnh nghỉ sinh viên và nhà hàng Sorrento.",
    floorPlanPdfUrl: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/students/maps/recreation-and-events-complex-building-10.pdf",
    googleMapsUrl: "https://www.google.com/maps/place/RMIT+University+Vietnam,+Saigon+South+campus/@10.729567,106.6908869,17z/data=!3m1!4b1!4m5!3m4!1s0x31752fbea5fe3db1:0xfae94aca5709003f!8m2!3d10.729567!4d106.6930756",
    floors: [
      {
        floor: "Room 10.2.08 & 10.2.09 (Tầng 2)",
        facilitiesEn: "Student Life Office, Club Hub, Meeting tables, Equipment storage, Club Executive Workspace, Sorrento Café",
        facilitiesVi: "Văn phòng Student Life, Trụ sở Club Hub, Khu làm việc của ban chủ nhiệm CLB, Kho thiết bị, Café Sorrento",
        weekdayHours: "08:30 - 17:30",
        saturdayHours: "08:30 - 12:00 (Khi có sự kiện)",
        sundayHours: "Đóng cửa",
        airConditioningHours: "08:30 - 17:30",
        notesVi: "Đầu mối tiếp nhận hồ sơ đăng ký thành lập CLB, phê duyệt kinh phí sự kiện và hỗ trợ phong trào sinh viên.",
        notesEn: "Official hub for club logistics, event approvals, and club registrations.",
      },
    ],
  },

  // ==========================================
  // HANOI CAMPUS (Handi Resco Building, 521 Kim Ma)
  // ==========================================
  {
    id: "hn-main",
    nameEn: "Hanoi City Campus (Handi Resco Tower, 521 Kim Ma, Ba Dinh)",
    nameVi: "Cơ sở Thành phố Hà Nội (Tòa tháp Handi Resco, 521 Kim Mã, Ba Đình)",
    campus: "hanoi",
    overviewEn: "A modern vertical campus occupying multiple dedicated floors of Handi Resco Tower in central Hanoi, with comprehensive academic, gym, and library facilities.",
    overviewVi: "Khu học xá hiện đại nằm trên các tầng chuyên biệt của tháp Handi Resco tại trung tâm Hà Nội, trang bị đầy đủ thư viện, phòng gym, phòng máy và khu hỗ trợ học vụ.",
    floorPlanPdfUrl: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/students/maps/hanoi-building-floor-plan.pdf",
    googleMapsUrl: "https://www.google.com/maps?q=rmit+vietnam+hanoi+campus&um=1&ie=UTF-8&sa=X&ved=2ahUKEwiX05WpgcLqAhWOyzgGHe0_Dy4Q_AUoAnoECBcQBA",
    floors: [
      {
        floor: "Level 1 (Tầng 1)",
        facilitiesEn: "Main Reception, Student Connect Service Counter, Admissions, IT Support Desk, Security Checkpoint",
        facilitiesVi: "Lễ tân chính, Quầy dịch vụ Student Connect Hà Nội, Phòng tuyển sinh, Bàn hỗ trợ IT, Cổng kiểm soát an ninh",
        weekdayHours: "07:30 - 21:00",
        saturdayHours: "08:00 - 17:30",
        sundayHours: "Đóng cửa",
        airConditioningHours: "08:00 - 18:00",
        notesVi: "Student Connect tiếp nhận thủ tục hành chính trực tiếp từ 08:30 - 17:00 (T2 - T6).",
        notesEn: "Student Connect in-person desk operates 08:30 - 17:00 (Mon - Fri).",
      },
      {
        floor: "Level 2 (Tầng 2 - Thư viện RMIT Hà Nội)",
        facilitiesEn: "Hanoi Campus Library, High-Use Reserves, Quiet Study Carrels, Group Study Rooms, Bookable Meeting Booths, Printing Station",
        facilitiesVi: "Thư viện Cơ sở Hà Nội (Tầng 2 Handi Resco), Sách giáo trình học phần mượn gấp, Bàn tự học yên tĩnh, Phòng thảo luận nhóm đặt trước, Máy in sinh viên",
        weekdayHours: "08:00 - 21:00",
        saturdayHours: "08:00 - 17:00",
        sundayHours: "08:00 - 17:00",
        airConditioningHours: "08:00 - 21:00",
        notesVi: "Theo RMIT Library: Trong kỳ nghỉ giữa kỳ, mở Thứ 2–Thứ 6: 08:00–17:00; đóng cuối tuần và ngày lễ.",
        notesEn: "According to RMIT Library: During semester break, open Monday–Friday from 8am–5pm; closed weekends and public holidays.",
      },
      {
        floor: "Level 3 (Tầng 3)",
        facilitiesEn: "Student Wellbeing Suite, Psychological Counseling (Confidential), Equitable Learning Service (ELS), Student Lounge",
        facilitiesVi: "Khu chăm sóc sức khỏe tinh thần Wellbeing, Phòng tư vấn tâm lý bảo mật, Hỗ trợ học tập hòa nhập ELS, Sảnh nghỉ sinh viên",
        weekdayHours: "08:30 - 17:30",
        saturdayHours: "Theo lịch hẹn trước",
        sundayHours: "Đóng cửa",
        airConditioningHours: "08:30 - 17:30",
        notesVi: "Đặt lịch tư vấn tâm lý bảo mật qua email: wellbeing@rmit.edu.vn.",
        notesEn: "Confidential counseling appointments booked via wellbeing@rmit.edu.vn.",
      },
      {
        floor: "Level 4, 5 & 6 (Tầng 4, 5, 6)",
        facilitiesEn: "Classrooms, Interactive Seminars, Collaborative Tutorial Rooms, Mac Design Studio",
        facilitiesVi: "Phòng học lý thuyết, Phòng hội thảo tương tác, Phòng thực hành Mac chuyên ngành thiết kế & truyền thông",
        weekdayHours: "07:30 - 19:30",
        saturdayHours: "08:00 - 17:00",
        sundayHours: "Đóng cửa",
        airConditioningHours: "08:00 - 18:00 (kéo dài theo ca học)",
      },
      {
        floor: "Level 7 & 8 (Tầng 7 & 8)",
        facilitiesEn: "RMIT Hanoi Active Hub (Fitness Gym, Cardio & Weights, Yoga/Dance Studio), Student Life Office (Room 1.8.007), Hanoi Club Hub (Room 1.5.016)",
        facilitiesVi: "Phòng Gym RMIT Hanoi Active Hub (Tạ, Cardio, Phòng tập Yoga/Nhảy), Văn phòng Student Life (Phòng 1.8.007), Trụ sở CLB Hà Nội (Phòng 1.5.016)",
        weekdayHours: "07:00 - 20:30",
        saturdayHours: "08:00 - 18:00",
        sundayHours: "Đóng cửa",
        airConditioningHours: "Toàn bộ thời gian mở cửa",
        notesVi: "Miễn phí 100% cho sinh viên RMIT Hà Nội; bắt buộc quẹt thẻ sinh viên và mang giày thể thao.",
        notesEn: "100% free with active student card and appropriate athletic shoes.",
      },
    ],
  },
];
