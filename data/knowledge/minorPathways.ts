export interface MinorPathway {
  majorId: string;
  majorNameEn: string;
  majorNameVi: string;
  school: "Business (TBS)" | "Science, Engineering & Tech (SSET)" | "Communication & Design (SCD)";
  recommendedMinors: {
    minorNameEn: string;
    minorNameVi: string;
    personalityFit: string;
    careerTrajectory: string;
    creditPoints: number; // usually 48 CP (4 courses)
    rationaleEn: string;
    rationaleVi: string;
  }[];
}

export const RMIT_MINOR_PATHWAYS: MinorPathway[] = [
  // 1. Business Majors (TBS)
  {
    majorId: "major-economics-finance",
    majorNameEn: "Economics & Finance",
    majorNameVi: "Kinh tế & Tài chính",
    school: "Business (TBS)",
    recommendedMinors: [
      {
        minorNameEn: "FinTech & Financial Innovation",
        minorNameVi: "Công nghệ Tài chính (FinTech)",
        personalityFit: "Thích số liệu, phân tích thuật toán, đam mê công nghệ blockchain và ngân hàng số.",
        careerTrajectory: "Chuyên viên phân tích định lượng (Quantitative Analyst), Chuyên viên phát triển sản phẩm FinTech, Ngân hàng số.",
        creditPoints: 48,
        rationaleEn: "Combines macroeconomic and valuation fundamentals with blockchain, automated algorithmic trading, and digital payment infrastructure.",
        rationaleVi: "Kết hợp nền tảng kinh tế lượng và định giá tài sản với công nghệ thanh toán số, giao dịch thuật toán và blockchain."
      },
      {
        minorNameEn: "Business Analytics & Big Data",
        minorNameVi: "Phân tích Dữ liệu Kinh doanh (Business Analytics)",
        personalityFit: "Tư duy logic, thích giải mã hành vi thị trường qua các bộ dữ liệu lớn.",
        careerTrajectory: "Data Analyst mảng tài chính, Chuyên viên quản trị rủi ro tín dụng (Risk Analytics).",
        creditPoints: 48,
        rationaleEn: "Master SQL, Python for business, and PowerBI dashboards to extract predictive market insights.",
        rationaleVi: "Thành thạo công cụ phân tích dữ liệu thị trường (SQL, Python, PowerBI) để đưa ra dự báo đầu tư chính xác."
      },
      {
        minorNameEn: "Cybersecurity & Risk Management",
        minorNameVi: "An ninh mạng & Quản trị rủi ro",
        personalityFit: "Cẩn trọng, nguyên tắc, thích xây dựng hệ thống phòng ngừa rủi ro tài chính.",
        careerTrajectory: "Chuyên viên tuân thủ bảo mật tài chính (Financial Compliance & SecOps), Kiểm toán công nghệ.",
        creditPoints: 48,
        rationaleEn: "Critical for future investment banks and financial institutions navigating strict cybersecurity compliance regulations.",
        rationaleVi: "Bổ trợ đắc lực cho các định chế tài chính, quỹ đầu tư trước các rủi ro tấn công mạng và quy định an toàn bảo mật."
      }
    ]
  },
  {
    majorId: "major-digital-marketing",
    majorNameEn: "Digital Marketing",
    majorNameVi: "Marketing Kỹ thuật số",
    school: "Business (TBS)",
    recommendedMinors: [
      {
        minorNameEn: "User Experience Design (UX/UI)",
        minorNameVi: "Thiết kế Trải nghiệm Người dùng (UX/UI)",
        personalityFit: "Thấu cảm cao, yêu thích sáng tạo thị giác và tối ưu hóa trải nghiệm khách hàng.",
        careerTrajectory: "Product Marketing Manager (PMM), Growth UX Designer, Chuyên viên tối ưu tỷ lệ chuyển đổi (CRO).",
        creditPoints: 48,
        rationaleEn: "Bridges creative campaign marketing with conversion rate optimization and intuitive digital product journeys.",
        rationaleVi: "Kết nối giữa truyền thông thương hiệu với hành trình trải nghiệm ứng dụng, giúp tăng trưởng tỷ lệ chuyển đổi trên website/app."
      },
      {
        minorNameEn: "Business Analytics & Consumer Insights",
        minorNameVi: "Phân tích Dữ liệu Khách hàng (Marketing Analytics)",
        personalityFit: "Thích làm việc với các chỉ số đo lường (CAC, LTV, ROAS) và tối ưu hóa ngân sách quảng cáo.",
        careerTrajectory: "Performance Marketing Lead, Data-driven Growth Hacker, Quản lý CRM & Loyalty Program.",
        creditPoints: 48,
        rationaleEn: "Supercharges marketing strategy with attribution modeling, A/B testing methodology, and customer lifetime value computation.",
        rationaleVi: "Làm chủ mô hình phân bổ chi phí quảng cáo, thử nghiệm A/B testing và đo lường giá trị vòng đời khách hàng."
      },
      {
        minorNameEn: "Entrepreneurship & Innovation",
        minorNameVi: "Khởi nghiệp & Đổi mới sáng tạo (Entrepreneurship)",
        personalityFit: "Năng động, dám chấp nhận thử thách, khao khát tự xây dựng thương hiệu hoặc startup riêng.",
        careerTrajectory: "Nhà sáng lập Startup (Founder), Giám đốc phát triển kinh doanh (Business Development Director).",
        creditPoints: 48,
        rationaleEn: "Essential for launching D2C brands, managing venture funding pitches, and rapid product-market fit iteration.",
        rationaleVi: "Cung cấp khung kỹ năng gọi vốn đầu tư, nghiên cứu thị trường ngách và tự đưa sản phẩm ra thị trường."
      }
    ]
  },
  {
    majorId: "major-logistics-supply-chain",
    majorNameEn: "Logistics & Supply Chain Management",
    majorNameVi: "Quản trị Logistics & Chuỗi Cung ứng",
    school: "Business (TBS)",
    recommendedMinors: [
      {
        minorNameEn: "Sustainable Business Practice & ESG",
        minorNameVi: "Kinh doanh Bền vững & Chuẩn ESG",
        personalityFit: "Quan tâm đến môi trường, trách nhiệm xã hội và chuỗi cung ứng xanh.",
        careerTrajectory: "Chuyên viên tư vấn ESG, Giám đốc chuỗi cung ứng xanh (Sustainable Supply Chain Manager).",
        creditPoints: 48,
        rationaleEn: "Huge market demand as multinational corporations are mandated to achieve carbon neutrality and ethical procurement.",
        rationaleVi: "Đón đầu làn sóng doanh nghiệp đa quốc gia bắt buộc phải chuyển đổi chuỗi cung ứng xanh và chứng chỉ phát thải ròng."
      },
      {
        minorNameEn: "Cloud Computing & Logistics Tech",
        minorNameVi: "Công nghệ Vận hành & Điện toán đám mây",
        personalityFit: "Thích tự động hóa quy trình kho vận và công nghệ theo dõi đơn hàng thời gian thực (IoT/RFID).",
        careerTrajectory: "Smart Warehouse Architect, Giám đốc chuyển đổi số chuỗi cung ứng (Digital Logistics Consultant).",
        creditPoints: 48,
        rationaleEn: "Equips students with modern warehouse automation, ERP integration, and real-time cargo telematics architecture.",
        rationaleVi: "Thành thạo công nghệ kho thông minh tự động hóa, tích hợp hệ thống ERP và định vị giám sát hàng hải/hàng không."
      }
    ]
  },

  // 2. Science, Engineering & Tech (SSET)
  {
    majorId: "major-information-technology",
    majorNameEn: "Information Technology & Software Engineering",
    majorNameVi: "Công nghệ Thông tin & Kỹ thuật Phần mềm",
    school: "Science, Engineering & Tech (SSET)",
    recommendedMinors: [
      {
        minorNameEn: "Management & Tech Entrepreneurship",
        minorNameVi: "Quản trị Dự án & Khởi nghiệp Công nghệ",
        personalityFit: "Giao tiếp tốt, thích dẫn dắt đội ngũ kỹ thuật, có tư duy chiến lược kinh doanh.",
        careerTrajectory: "Technical Product Manager (TPM), Scrum Master, Giám đốc Công nghệ (CTO).",
        creditPoints: 48,
        rationaleEn: "Transforms a strong software coder into a visionary tech lead capable of managing product lifecycles and budgets.",
        rationaleVi: "Bổ trợ năng lực quản trị dự án phần mềm theo chuẩn Agile/Scrum, đàm phán với khách hàng và định hướng sản phẩm công nghệ."
      },
      {
        minorNameEn: "Artificial Intelligence & Applied Machine Learning",
        minorNameVi: "Trí tuệ Nhân tạo & Học máy Ứng dụng",
        personalityFit: "Đam mê nghiên cứu toán học ứng dụng, thuật toán deep learning và mô hình ngôn ngữ lớn (LLM).",
        careerTrajectory: "AI Engineer, Machine Learning Specialist, Data Scientist.",
        creditPoints: 48,
        rationaleEn: "Deep-dives into neural network architectures, computer vision, and generative AI deployment pipelines.",
        rationaleVi: "Đi sâu vào kiến trúc mạng nơ-ron, thị giác máy tính và triển khai các mô hình AI tạo sinh vào thực tế doanh nghiệp."
      },
      {
        minorNameEn: "Game Design & Interactive Digital Media",
        minorNameVi: "Thiết kế Game & Đồ họa Tương tác",
        personalityFit: "Yêu thích thế giới game, đồ họa 3D, mô phỏng thế giới ảo và trải nghiệm tương tác.",
        careerTrajectory: "Game Developer, Interactive 3D Simulation Engineer, Kỹ sư đồ họa thời gian thực.",
        creditPoints: 48,
        rationaleEn: "Cross-school collaboration with School of Communication & Design for 3D physics engines and shader pipelines.",
        rationaleVi: "Học liên trường cùng Khoa Thiết kế để làm chủ công cụ dựng hình 3D, engine đồ họa và trải nghiệm chơi game nhập vai."
      }
    ]
  },

  // 3. School of Communication & Design (SCD)
  {
    majorId: "major-professional-communication",
    majorNameEn: "Professional Communication",
    majorNameVi: "Truyền thông Chuyên nghiệp",
    school: "Communication & Design (SCD)",
    recommendedMinors: [
      {
        minorNameEn: "Digital Media Production & Video Storytelling",
        minorNameVi: "Sản xuất Truyền thông Số & Kể chuyện Đa phương tiện",
        personalityFit: "Sáng tạo nội dung, thích quay dựng video, podcast và kể chuyện bằng hình ảnh thị giác.",
        careerTrajectory: "Creative Director, Multimedia Producer, Video Journalist, Quản lý sáng tạo nội dung số.",
        creditPoints: 48,
        rationaleEn: "Provides hands-on production studio mastery (lighting, sound design, multi-platform narrative distribution).",
        rationaleVi: "Trang bị kỹ năng làm chủ trường quay, dựng âm thanh, ánh sáng và phân phối nội dung video ngắn/dài trên đa nền tảng."
      },
      {
        minorNameEn: "Global Business & Public Relations",
        minorNameVi: "Kinh doanh Quốc tế & Quan hệ Công chúng (PR)",
        personalityFit: "Khéo léo, giỏi ngoại giao, đam mê giải quyết khủng hoảng truyền thông doanh nghiệp.",
        careerTrajectory: "Corporate Communications Lead, Giám đốc quan hệ báo chí & quan hệ chính phủ (Gov Affairs).",
        creditPoints: 48,
        rationaleEn: "Teaches strategic corporate reputation management, stakeholder diplomacy, and brand defense under pressure.",
        rationaleVi: "Đào tạo kỹ năng quản trị danh tiếng thương hiệu doanh nghiệp, ngoại giao cổ đông và xử lý khủng hoảng truyền thông."
      }
    ]
  }
];
