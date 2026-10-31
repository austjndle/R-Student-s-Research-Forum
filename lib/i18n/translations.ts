export type Language = "en" | "vi";

export interface Translations {
  common: {
    siteName: string;
    tagline: string;
    disclaimer: string;
    independentNotice: string;
    verified: string;
    needsReview: string;
    unavailable: string;
    lastVerified: string;
    officialSource: string;
    campus: string;
    saigonSouth: string;
    hanoi: string;
    allCampuses: string;
    viewAll: string;
    readMore: string;
    copied: string;
    copy: string;
    close: string;
    back: string;
    error: string;
    loading: string;
  };
  nav: {
    home: string;
    guides: string;
    topics: string;
    contacts: string;
    about: string;
    search: string;
    calendar: string;
    events: string;
    clubs: string;
    language: string;
    theme: string;
  };
  hero: {
    heading: string;
    subheading: string;
    searchPlaceholder: string;
    popularSearches: string;
    exploreGuides: string;
    browseTopics: string;
    chips: {
      scholarships: string;
      enrolment: string;
      academicCalendar: string;
      studentConnect: string;
      library: string;
      exchange: string;
    };
  };
  search: {
    title: string;
    bestAnswer: string;
    keyDetails: string;
    officialSources: string;
    relevantDepartment: string;
    relatedQuestions: string;
    askAi: string;
    askAiSubtitle: string;
    noResults: string;
    noResultsSub: string;
    searchHint: string;
    categoryFilter: string;
    campusFilter: string;
    allCategories: string;
    clearSearch: string;
    resultsFound: string;
    recentSearches: string;
    clearHistory: string;
  };
  homeSections: {
    popularTopics: string;
    popularTopicsDesc: string;
    guidesTitle: string;
    guidesDesc: string;
    faqTitle: string;
    faqDesc: string;
    contactsTitle: string;
    contactsDesc: string;
    aiTitle: string;
    aiDesc: string;
  };
  ai: {
    name: string;
    subtitle: string;
    disclaimer: string;
    remainingQuota: string;
    quotaExhausted: string;
    quotaExhaustedSub: string;
    placeholder: string;
    send: string;
    clearChat: string;
    outOfScopeNotice: string;
    shortAnswer: string;
    importantDetails: string;
    officialSources: string;
    relevantContact: string;
    suggestedQuestions: string;
    errorGeneric: string;
  };
  contacts: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allDepartments: string;
    email: string;
    phone: string;
    form: string;
    serviceHours: string;
    responsibilities: string;
    typicalEnquiries: string;
    copyEmail: string;
    visitWebsite: string;
  };
  guides: {
    title: string;
    subtitle: string;
    readTime: string;
    steps: string;
    officialReferences: string;
    relatedGuides: string;
  };
  footer: {
    aboutText: string;
    quickLinks: string;
    officialResources: string;
    legal: string;
    rmitOfficial: string;
    copyright: string;
    privacy: string;
    about: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      siteName: "R-Students' Research Forum",
      tagline: "Find answers. Research smarter.",
      disclaimer: "Independent student-created research platform. Not an official RMIT University service.",
      independentNotice: "This platform is an independent student initiative created to help peers quickly locate accurate official university information. All official administrative procedures must be conducted directly via official RMIT channels.",
      verified: "Verified",
      needsReview: "Needs Review",
      unavailable: "Unavailable",
      lastVerified: "Last verified",
      officialSource: "Official Source",
      campus: "Campus",
      saigonSouth: "Saigon South",
      hanoi: "Hanoi",
      allCampuses: "All Campuses",
      viewAll: "View All",
      readMore: "Read More",
      copied: "Copied to clipboard!",
      copy: "Copy",
      close: "Close",
      back: "Back",
      error: "An error occurred",
      loading: "Loading...",
    },
    nav: {
      home: "Home",
      guides: "Research Guides",
      topics: "Explore Topics",
      contacts: "Contact Directory",
      about: "About",
      search: "Search",
      calendar: "Calendar",
      events: "Campus Events",
      clubs: "Student Clubs",
      language: "Language",
      theme: "Theme",
    },
    hero: {
      heading: "Research smarter, not harder.",
      subheading: "Find reliable RMIT information, explore student resources, and get concise verified answers — all in one place.",
      searchPlaceholder: "Search anything about RMIT (policies, enrolment, major change, fees...)",
      popularSearches: "Trending searches:",
      exploreGuides: "Explore Research Guides",
      browseTopics: "Browse All Topics",
      chips: {
        scholarships: "Scholarships",
        enrolment: "Course Enrolment",
        academicCalendar: "Academic Calendar",
        studentConnect: "Student Connect",
        library: "Library Services",
        exchange: "Exchange Programs",
      },
    },
    search: {
      title: "Smart Search",
      bestAnswer: "Best Answer",
      keyDetails: "Key Details & Steps",
      officialSources: "Official Sources",
      relevantDepartment: "Relevant Department to Contact",
      relatedQuestions: "Related Questions",
      askAi: "Ask R Research Assistant",
      askAiSubtitle: "Need deeper answers or personalised guidance? Ask the AI assistant with your 10 daily free queries.",
      noResults: "No exact matches found",
      noResultsSub: "Try using different keywords, checking spelling, or asking our AI assistant.",
      searchHint: "Search works in English or Vietnamese. Type keywords or ask natural questions.",
      categoryFilter: "Category",
      campusFilter: "Campus",
      allCategories: "All Categories",
      clearSearch: "Clear",
      resultsFound: "results found",
      recentSearches: "Recent searches",
      clearHistory: "Clear history",
    },
    homeSections: {
      popularTopics: "Popular Research Topics",
      popularTopicsDesc: "Browse structured guides and verified policies across key university areas.",
      guidesTitle: "Practical Research Guides",
      guidesDesc: "Step-by-step tutorials to navigate university administration with confidence.",
      faqTitle: "Frequently Asked Questions",
      faqDesc: "Quick answers to the most common queries from RMIT Vietnam students.",
      contactsTitle: "Contact the Right Department",
      contactsDesc: "Reach the exact office responsible for your enquiry without waiting in the wrong queue.",
      aiTitle: "AI Research Assistant",
      aiDesc: "Powered by Google Gemini Flash. 10 free questions daily for every student without login.",
    },
    ai: {
      name: "Ask Mr Hachiware",
      subtitle: "Grounded AI answers backed by verified RMIT sources",
      disclaimer: "AI responses are grounded on official RMIT knowledge records. Verify with official departments for critical academic decisions.",
      remainingQuota: "{count} / {limit} AI questions remaining today",
      quotaExhausted: "You've reached today's AI question limit",
      quotaExhaustedSub: "Your daily quota of 10 questions resets at midnight (Vietnam time). You can continue using Smart Search and all guides for free.",
      placeholder: "Ask an RMIT question (e.g. How do I change my major?)...",
      send: "Send",
      clearChat: "Clear conversation",
      outOfScopeNotice: "I'm designed specifically to assist with RMIT University Vietnam questions. Try asking about courses, scholarships, enrolment, policies, or student services.",
      shortAnswer: "Short Answer",
      importantDetails: "Important Details",
      officialSources: "Verified Sources",
      relevantContact: "Recommended Department",
      suggestedQuestions: "Suggested questions:",
      errorGeneric: "Unable to process AI request. Smart Search remains fully available.",
    },
    contacts: {
      title: "University Contact Directory",
      subtitle: "Official, verified contact channels for RMIT University Vietnam departments.",
      searchPlaceholder: "Search departments or enquiries (e.g., Student Connect, IT, fees)...",
      allDepartments: "All Departments",
      email: "Official Email",
      phone: "Phone",
      form: "Enquiry Form / Portal",
      serviceHours: "Service Hours",
      responsibilities: "Responsibilities",
      typicalEnquiries: "Common Enquiries",
      copyEmail: "Copy Email",
      visitWebsite: "Visit Website",
    },
    guides: {
      title: "Research Guides",
      subtitle: "Practical, student-tested guides on navigating RMIT academic life and administration.",
      readTime: "min read",
      steps: "Step-by-Step Instructions",
      officialReferences: "Official References",
      relatedGuides: "Related Guides",
    },
    footer: {
      aboutText: "An independent, bilingual research and information discovery platform created by students for students at RMIT University Vietnam.",
      quickLinks: "Quick Navigation",
      officialResources: "Official RMIT Links",
      legal: "Disclaimer & Privacy",
      rmitOfficial: "Official RMIT Vietnam Website",
      copyright: "© 2026 R-Students' Research Forum. Independent student initiative.",
      privacy: "Privacy Policy",
      about: "About Us",
    },
  },
  vi: {
    common: {
      siteName: "R-Students' Research Forum",
      tagline: "Tìm câu trả lời. Nghiên cứu thông minh hơn.",
      disclaimer: "Nền tảng tra cứu độc lập do sinh viên xây dựng. Không phải dịch vụ chính thức của Đại học RMIT.",
      independentNotice: "Đây là dự án độc lập do sinh viên khởi xướng nhằm hỗ trợ sinh viên nhanh chóng tiếp cận thông tin chính thức của nhà trường. Mọi thủ tục hành chính phải được thực hiện qua các kênh chính thức của RMIT.",
      verified: "Đã xác minh",
      needsReview: "Cần cập nhật",
      unavailable: "Chưa có sẵn",
      lastVerified: "Xác minh lần cuối",
      officialSource: "Nguồn chính thức",
      campus: "Cơ sở",
      saigonSouth: "Nam Sài Gòn",
      hanoi: "Hà Nội",
      allCampuses: "Tất cả cơ sở",
      viewAll: "Xem tất cả",
      readMore: "Đọc tiếp",
      copied: "Đã sao chép vào bộ nhớ tạm!",
      copy: "Sao chép",
      close: "Đóng",
      back: "Quay lại",
      error: "Đã xảy ra lỗi",
      loading: "Đang tải...",
    },
    nav: {
      home: "Trang chủ",
      guides: "Hướng dẫn",
      topics: "Chủ đề",
      contacts: "Danh bạ",
      about: "Giới thiệu",
      search: "Tìm kiếm",
      calendar: "Lịch",
      events: "Sự kiện",
      clubs: "CLB sinh viên",
      language: "Ngôn ngữ",
      theme: "Giao diện",
    },
    hero: {
      heading: "Nghiên cứu thông minh, giải đáp nhanh chóng.",
      subheading: "Tra cứu thông tin chính thức của RMIT, khám phá cẩm nang sinh viên và nhận câu trả lời ngắn gọn, chính xác — tất cả tại một nơi.",
      searchPlaceholder: "Tìm kiếm mọi thông tin về RMIT (học bổng, đổi ngành, đăng ký môn, học phí...)",
      popularSearches: "Từ khóa phổ biến:",
      exploreGuides: "Xem hướng dẫn tra cứu",
      browseTopics: "Khám phá tất cả chủ đề",
      chips: {
        scholarships: "Học bổng",
        enrolment: "Đăng ký môn học",
        academicCalendar: "Lịch học kỳ",
        studentConnect: "Student Connect",
        library: "Thư viện",
        exchange: "Chương trình trao đổi",
      },
    },
    search: {
      title: "Tìm kiếm thông minh",
      bestAnswer: "Câu trả lời tốt nhất",
      keyDetails: "Chi tiết & Các bước quan trọng",
      officialSources: "Nguồn chính thức từ RMIT",
      relevantDepartment: "Phòng ban phụ trách",
      relatedQuestions: "Câu hỏi liên quan",
      askAi: "Hỏi Trợ lý AI (R Research Assistant)",
      askAiSubtitle: "Cần câu trả lời chuyên sâu hoặc giải đáp cụ thể? Hỏi trợ lý AI với 10 lượt hỏi miễn phí mỗi ngày.",
      noResults: "Không tìm thấy kết quả phù hợp",
      noResultsSub: "Hãy thử từ khóa khác, kiểm tra chính tả hoặc đặt câu hỏi với Trợ lý AI.",
      searchHint: "Hỗ trợ tìm kiếm cả tiếng Việt và tiếng Anh. Gõ từ khóa hoặc câu hỏi tự nhiên.",
      categoryFilter: "Danh mục",
      campusFilter: "Cơ sở",
      allCategories: "Tất cả danh mục",
      clearSearch: "Xóa",
      resultsFound: "kết quả tìm thấy",
      recentSearches: "Lịch sử tìm kiếm gần đây",
      clearHistory: "Xóa lịch sử",
    },
    homeSections: {
      popularTopics: "Chủ đề tra cứu phổ biến",
      popularTopicsDesc: "Khám phá các quy chế, hướng dẫn được phân loại rõ ràng theo từng lĩnh vực.",
      guidesTitle: "Cẩm nang hướng dẫn thực tế",
      guidesDesc: "Từng bước xử lý các thủ tục học vụ và hành chính đại học một cách hiệu quả.",
      faqTitle: "Câu hỏi thường gặp",
      faqDesc: "Giải đáp nhanh những băn khoăn phổ biến nhất của sinh viên RMIT Việt Nam.",
      contactsTitle: "Liên hệ đúng phòng ban",
      contactsDesc: "Tìm chính xác bộ phận phụ trách vấn đề của bạn để nhận hỗ trợ nhanh nhất.",
      aiTitle: "Trợ lý Nghiên cứu AI",
      aiDesc: "Ứng dụng mô hình Google Gemini Flash. Mỗi sinh viên được 10 câu hỏi miễn phí mỗi ngày, không cần đăng nhập.",
    },
    ai: {
      name: "Ask Mr Hachiware",
      subtitle: "Giải đáp thông minh dựa trên nguồn thông tin chính thức của RMIT",
      disclaimer: "Phản hồi AI dựa trên dữ liệu chính thức của RMIT. Vui lòng xác nhận với phòng ban phụ trách đối với các quyết định học vụ quan trọng.",
      remainingQuota: "Còn {count} / {limit} câu hỏi AI hôm nay",
      quotaExhausted: "Bạn đã hết lượt hỏi AI trong ngày",
      quotaExhaustedSub: "Hạn ngạch 10 câu hỏi mỗi ngày sẽ được đặt lại vào nửa đêm (giờ Việt Nam). Bạn vẫn có thể dùng công cụ Tìm kiếm thông minh và đọc toàn bộ hướng dẫn hoàn toàn miễn phí.",
      placeholder: "Đặt câu hỏi về RMIT (ví dụ: Thủ tục đổi ngành như thế nào?)...",
      send: "Gửi",
      clearChat: "Xóa cuộc trò chuyện",
      outOfScopeNotice: "Tôi được thiết kế chuyên biệt để giải đáp các câu hỏi liên quan đến Đại học RMIT Việt Nam. Hãy hỏi tôi về môn học, học bổng, đăng ký khóa học, học vụ hoặc dịch vụ sinh viên nhé!",
      shortAnswer: "Câu trả lời ngắn gọn",
      importantDetails: "Chi tiết quan trọng",
      officialSources: "Nguồn chính thức đã xác minh",
      relevantContact: "Phòng ban khuyến nghị liên hệ",
      suggestedQuestions: "Câu hỏi gợi ý:",
      errorGeneric: "Không thể xử lý yêu cầu AI lúc này. Tính năng Tìm kiếm thông minh vẫn hoạt động bình thường.",
    },
    contacts: {
      title: "Danh bạ liên hệ phòng ban",
      subtitle: "Kênh liên lạc chính thức đã được xác minh của các phòng ban tại RMIT Việt Nam.",
      searchPlaceholder: "Tìm phòng ban hoặc vấn đề cần hỏi (ví dụ: Student Connect, IT, học phí)...",
      allDepartments: "Tất cả phòng ban",
      email: "Email chính thức",
      phone: "Số điện thoại",
      form: "Biểu mẫu / Cổng hỗ trợ",
      serviceHours: "Giờ làm việc",
      responsibilities: "Nhiệm vụ chính",
      typicalEnquiries: "Các thắc mắc thường gặp",
      copyEmail: "Sao chép Email",
      visitWebsite: "Xem trang web",
    },
    guides: {
      title: "Cẩm nang hướng dẫn",
      subtitle: "Hướng dẫn thực tế, dễ hiểu giúp sinh viên tự chủ trong học tập và giải quyết thủ tục tại trường.",
      readTime: "phút đọc",
      steps: "Các bước thực hiện",
      officialReferences: "Tài liệu tham khảo chính thức",
      relatedGuides: "Hướng dẫn liên quan",
    },
    footer: {
      aboutText: "Nền tảng tra cứu và khám phá thông tin song ngữ độc lập do sinh viên RMIT phát triển nhằm hỗ trợ cộng đồng sinh viên.",
      quickLinks: "Điều hướng nhanh",
      officialResources: "Liên kết chính thức RMIT",
      legal: "Tuyên bố miễn trừ & Quyền riêng tư",
      rmitOfficial: "Trang web chính thức RMIT Việt Nam",
      copyright: "© 2026 R-Students' Research Forum. Dự án độc lập của sinh viên.",
      privacy: "Chính sách bảo mật",
      about: "Về chúng tôi",
    },
  },
};
