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
    skipToContent: string;
    record: string;
    records: string;
    collapse: string;
    copyToClipboard: string;
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
    campusHours: string;
    accessibleLabels: {
      home: string;
      calendar: string;
      events: string;
      clubs: string;
      guides: string;
      campusHours: string;
      topics: string;
      contacts: string;
    };
    language: string;
    theme: string;
    switchLanguage: string;
    toggleTheme: string;
    mobileMenu: string;
    closeMenu: string;
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
    loading: string;
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
    topicsEyebrow: string;
    guidesEyebrow: string;
    assistantEyebrow: string;
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
    verifiedGrounding: string;
    loadingAssistant: string;
    errorNoResponse: string;
    errorRateLimited: string;
    errorInvalidRequest: string;
    errorServiceUnavailable: string;
    fallbackNotice: string;
    alternativeProviderNotice: string;
  };
  support: {
    label: string;
    title: string;
    description: string;
    voluntary: string;
    vietqr: string;
    shortLink: string;
    tooltip: string;
    notConfigured: string;
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
    categoryAdministrative: string;
    categoryAcademic: string;
    categorySupport: string;
    categoryFacilities: string;
    categorySpecialized: string;
    collapse: string;
  };
  guides: {
    title: string;
    subtitle: string;
    readTime: string;
    steps: string;
    officialReferences: string;
    relatedGuides: string;
    verifiedProcedure: string;
    emailTemplateSectionTitle: string;
    emailSubject: string;
    copyEmail: string;
    copySubject: string;
    copyPrompt: string;
    emailCategoryConsultation: string;
    emailCategoryExtension: string;
    emailCategoryGrade: string;
    emailCategoryGroupWork: string;
    emailCategoryRecommendation: string;
    emailCategoryAttendance: string;
    promptCategoryEmailWriting: string;
    promptCategoryCourseStudy: string;
    promptCategoryAssignmentPrep: string;
    promptCategoryConsultPrep: string;
  };
  clubs: {
    howToJoin: string;
    membershipType: string;
    generalMember: string;
    committeeCoreTeam: string;
    applicationProcess: string;
    interviewRequired: string;
    cvPortfolio: string;
    eligibility: string;
    tryout: string;
    recruitmentStatus: string;
    deadline: string;
    applicationLink: string;
    recruitmentAnnouncement: string;
    officialChannels: string;
    notConfirmed: string;
    notAnnounced: string;
    recruiting: string;
    closed: string;
    upcoming: string;
    unverified: string;
    noDeadline: string;
    noCurrentAnnouncement: string;
    source: string;
    searchPlaceholder: string;
    noMatches: string;
    categoryAll: string;
    categoryAcademic: string;
    categoryActive: string;
    categoryCreative: string;
    categorySocial: string;
    matchingClubs: string;
    directorySource: string;
    viewClub: string;
    descriptionUnavailable: string;
    imageAlt: string;
    facebookPage: string;
    directoryEyebrow: string;
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
    creatorSlogan: string;
  };
  aboutPage: {
    eyebrow: string;
    title: string;
    missionTitle: string;
    missionIntro: string;
    missionBody: string;
    searchFirstTitle: string;
    searchFirstBody: string;
    noRegistrationTitle: string;
    noRegistrationBody: string;
    legalTitle: string;
    legalBody: string;
    sourcesTitle: string;
    sourcesIntro: string;
    verifiedSource: string;
    manualReview: string;
  };
  privacyPage: {
    eyebrow: string;
    title: string;
    lastUpdated: string;
    zeroPersonalDataTitle: string;
    zeroPersonalDataBody: string;
    cookieQuotaTitle: string;
    cookieQuotaIntro: string;
    cookieQuotaBullets: string[];
    aiTitle: string;
    aiIntro: string;
    aiBullets: string[];
    securityTitle: string;
    securityBody: string;
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
      skipToContent: "Skip to main content",
      record: "record",
      records: "records",
      collapse: "Collapse",
      copyToClipboard: "Copy to clipboard",
    },
    nav: {
      home: "Home",
      guides: "Guides",
      topics: "Topics",
      contacts: "Contacts",
      about: "About",
      search: "Search",
      calendar: "Calendar",
      events: "Events",
      clubs: "Clubs",
      campusHours: "Hours",
      accessibleLabels: {
        home: "Home",
        calendar: "Academic Calendar",
        events: "Campus Events",
        clubs: "Student Clubs",
        guides: "Research Guides",
        campusHours: "Campus Hours",
        topics: "Explore Topics",
        contacts: "Contact Directory",
      },
      language: "Language",
      theme: "Theme",
      switchLanguage: "Switch language",
      toggleTheme: "Toggle theme",
      mobileMenu: "Open navigation",
      closeMenu: "Close navigation",
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
      loading: "Loading search...",
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
      topicsEyebrow: "01 / TOPICS",
      guidesEyebrow: "02 / GUIDES",
      assistantEyebrow: "05 / AI RESEARCH ASSISTANT",
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
      verifiedGrounding: "Verified RMIT grounding",
      loadingAssistant: "Finding relevant RMIT information...",
      errorNoResponse: "No response received.",
      errorRateLimited: "Too many requests. Please wait and try again.",
      errorInvalidRequest: "The request could not be validated. Please check your message and try again.",
      errorServiceUnavailable: "The assistant service is temporarily unavailable. Please try again later.",
      fallbackNotice: "Quick fallback guidance",
      alternativeProviderNotice: "Answered by the backup AI provider",
    },
    support: {
      label: "Independent project support",
      title: "Support R-Students ☕",
      description: "Enjoying R-Students' Research Hub? You can buy me a coffee to help maintain and improve this independent student project. Every contribution is completely voluntary.",
      voluntary: "No payment information is collected by this website.",
      vietqr: "VietQR bank transfer",
      shortLink: "Support",
      tooltip: "Support this project",
      notConfigured: "Support methods are not configured yet.",
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
      categoryAdministrative: "Administrative",
      categoryAcademic: "Academic",
      categorySupport: "Support",
      categoryFacilities: "Facilities",
      categorySpecialized: "Specialized services",
      collapse: "Collapse",
    },
    guides: {
      title: "Research Guides",
      subtitle: "Practical, student-tested guides on navigating RMIT academic life and administration.",
      readTime: "min read",
      steps: "Step-by-Step Instructions",
      officialReferences: "Official References",
      relatedGuides: "Related Guides",
      verifiedProcedure: "Verified RMIT information",
      emailTemplateSectionTitle: "Ready-to-use email templates",
      emailSubject: "Subject",
      copyEmail: "Copy full email",
      copySubject: "Copy subject",
      copyPrompt: "Copy prompt",
      emailCategoryConsultation: "Consultation",
      emailCategoryExtension: "Extension",
      emailCategoryGrade: "Grade clarification",
      emailCategoryGroupWork: "Group work",
      emailCategoryRecommendation: "Recommendation",
      emailCategoryAttendance: "Attendance",
      promptCategoryEmailWriting: "Email writing",
      promptCategoryCourseStudy: "Course study",
      promptCategoryAssignmentPrep: "Assignment preparation",
      promptCategoryConsultPrep: "Consultation preparation",
    },
    clubs: {
      howToJoin: "How to Join",
      membershipType: "Membership type",
      generalMember: "General member",
      committeeCoreTeam: "Committee / core team",
      applicationProcess: "Application process",
      interviewRequired: "Interview required",
      cvPortfolio: "CV or portfolio",
      eligibility: "Eligibility",
      tryout: "Tryout or assessment",
      recruitmentStatus: "Recruitment status",
      deadline: "Application deadline",
      applicationLink: "Application link",
      recruitmentAnnouncement: "Recruitment announcement",
      officialChannels: "Official channels",
      notConfirmed: "Not confirmed",
      notAnnounced: "Not announced",
      recruiting: "Recruiting",
      closed: "Closed",
      upcoming: "Upcoming",
      unverified: "Unverified",
      noDeadline: "No current deadline published",
      noCurrentAnnouncement: "No current recruitment announcement",
      source: "Source",
      searchPlaceholder: "Search club names, interests, or activities...",
      noMatches: "No verified clubs match these filters.",
      categoryAll: "All clubs",
      categoryAcademic: "Academic",
      categoryActive: "Active clubs",
      categoryCreative: "Creative collectives",
      categorySocial: "Social & special interest",
      matchingClubs: "matching verified clubs",
      directorySource: "RMIT source",
      viewClub: "View club",
      descriptionUnavailable: "No description in this language is available from the checked public source.",
      imageAlt: "Official club image for",
      facebookPage: "Facebook page for",
      directoryEyebrow: "STUDENT LIFE / CLUB DIRECTORY",
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
      creatorSlogan: "💔 Built by students, powered by stress.",
    },
    aboutPage: {
      eyebrow: "Independent student initiative",
      title: "About R-Students' Research Forum",
      missionTitle: "Our mission",
      missionIntro: "Navigating university rules, enrolment deadlines, academic policies, and support services at RMIT Vietnam can be complex and fragmented.",
      missionBody: "R-Students' Research Forum is an independent, bilingual student portal for researching university information. Search verified records and concise guides to find relevant answers without relying on unverified advice.",
      searchFirstTitle: "Search first, AI second",
      searchFirstBody: "Search queries curated RMIT records directly and does not use an AI quota or external AI call.",
      noRegistrationTitle: "No registration required",
      noRegistrationBody: "No login, RMIT SSO, or email collection is required to browse. Anonymous visitors can use search, guides, and the daily AI allowance.",
      legalTitle: "Important legal disclaimer",
      legalBody: "This project is not affiliated with, sponsored by, or endorsed by RMIT University or RMIT University Vietnam. Trademarks, service marks, and trade names belong to their respective owners.",
      sourcesTitle: "Verified source registry",
      sourcesIntro: "Public RMIT sources are checked before entries are published. Facebook is a manual discovery channel and is never considered official based on its page name alone.",
      verifiedSource: "Verified source",
      manualReview: "Manual review",
    },
    privacyPage: {
      eyebrow: "Privacy and security architecture",
      title: "Privacy Policy",
      lastUpdated: "Last updated: October 2026. How R-Students' Research Forum handles your privacy and data.",
      zeroPersonalDataTitle: "1. Zero personal data collection",
      zeroPersonalDataBody: "We do not require account creation, student email login, RMIT Single Sign-On (SSO), passwords, or identity verification. You can search, browse guides, and use the research assistant anonymously.",
      cookieQuotaTitle: "2. Anonymous visitor cookie and daily AI quota",
      cookieQuotaIntro: "To enforce the fair-use limit of 10 successful AI questions per day, we use a signed, anonymous visitor identifier cookie:",
      cookieQuotaBullets: [
        "Contains a pseudo-random UUID signed with HMAC-SHA256.",
        "Contains no personally identifiable information (PII).",
        "Stored with HttpOnly, Secure, and SameSite=Lax flags.",
        "Daily quota resets at midnight in the Asia/Ho_Chi_Minh time zone.",
      ],
      aiTitle: "3. AI processing and Google Gemini API",
      aiIntro: "When you ask the optional Mr Hachiware assistant a question, the query and relevant verified RMIT records are sent server-side to the Google Gemini API.",
      aiBullets: [
        "The API key is held in Cloudflare Workers environment secrets and is not exposed to the browser.",
        "Queries are not stored or indexed in a public external database.",
        "Conversation history is kept in your browser session and can be cleared with the Clear conversation control.",
      ],
      securityTitle: "4. Traffic security and DDoS safeguards",
      securityBody: "The platform runs on Cloudflare Workers edge infrastructure with automated DDoS mitigation, Content Security Policy (CSP), burst rate limiting, and strict security headers to prevent unauthorized scraping and abusive bot traffic.",
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
      skipToContent: "Bỏ qua để đến nội dung chính",
      record: "tài liệu",
      records: "tài liệu",
      collapse: "Thu gọn",
      copyToClipboard: "Sao chép vào bộ nhớ tạm",
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
      clubs: "CLB",
      campusHours: "Giờ mở cửa",
      accessibleLabels: {
        home: "Trang chủ",
        calendar: "Lịch học vụ",
        events: "Sự kiện cơ sở",
        clubs: "Câu lạc bộ sinh viên",
        guides: "Hướng dẫn nghiên cứu",
        campusHours: "Giờ mở cửa",
        topics: "Khám phá chủ đề",
        contacts: "Danh bạ liên hệ",
      },
      language: "Ngôn ngữ",
      theme: "Giao diện",
      switchLanguage: "Chuyển ngôn ngữ",
      toggleTheme: "Đổi giao diện",
      mobileMenu: "Mở điều hướng",
      closeMenu: "Đóng điều hướng",
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
      loading: "Đang tải kết quả tìm kiếm...",
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
      topicsEyebrow: "01 / CHỦ ĐỀ",
      guidesEyebrow: "02 / CẨM NANG",
      assistantEyebrow: "05 / TRỢ LÝ NGHIÊN CỨU AI",
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
      verifiedGrounding: "Thông tin RMIT đã xác minh",
      loadingAssistant: "Đang tìm thông tin RMIT phù hợp...",
      errorNoResponse: "Chưa nhận được phản hồi.",
      errorRateLimited: "Có quá nhiều yêu cầu. Vui lòng đợi rồi thử lại.",
      errorInvalidRequest: "Không thể xác thực yêu cầu. Hãy kiểm tra nội dung và thử lại.",
      errorServiceUnavailable: "Dịch vụ trợ lý tạm thời không khả dụng. Vui lòng thử lại sau.",
      fallbackNotice: "Gợi ý dự phòng",
      alternativeProviderNotice: "Phản hồi từ nhà cung cấp AI dự phòng",
    },
    support: {
      label: "Ủng hộ dự án độc lập",
      title: "Ủng hộ R-Students ☕",
      description: "Nếu R-Students' Research Hub hữu ích với bạn, bạn có thể ủng hộ mình một ly cà phê để giúp duy trì và phát triển dự án. Mọi đóng góp đều hoàn toàn tự nguyện.",
      voluntary: "Website không thu thập thông tin thanh toán.",
      vietqr: "Chuyển khoản VietQR",
      shortLink: "Ủng hộ",
      tooltip: "Ủng hộ dự án này",
      notConfigured: "Các phương thức ủng hộ chưa được cấu hình.",
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
      categoryAdministrative: "Hành chính",
      categoryAcademic: "Học vụ",
      categorySupport: "Hỗ trợ",
      categoryFacilities: "Cơ sở vật chất",
      categorySpecialized: "Dịch vụ chuyên biệt",
      collapse: "Thu gọn",
    },
    guides: {
      title: "Cẩm nang hướng dẫn",
      subtitle: "Hướng dẫn thực tế, dễ hiểu giúp sinh viên tự chủ trong học tập và giải quyết thủ tục tại trường.",
      readTime: "phút đọc",
      steps: "Các bước thực hiện",
      officialReferences: "Tài liệu tham khảo chính thức",
      relatedGuides: "Hướng dẫn liên quan",
      verifiedProcedure: "Thông tin RMIT đã xác minh",
      emailTemplateSectionTitle: "Văn mẫu email sẵn dùng",
      emailSubject: "Tiêu đề",
      copyEmail: "Sao chép toàn bộ email",
      copySubject: "Sao chép tiêu đề",
      copyPrompt: "Sao chép prompt",
      emailCategoryConsultation: "Tư vấn học thuật",
      emailCategoryExtension: "Gia hạn",
      emailCategoryGrade: "Hỏi nhận xét điểm",
      emailCategoryGroupWork: "Làm việc nhóm",
      emailCategoryRecommendation: "Thư giới thiệu",
      emailCategoryAttendance: "Điểm danh",
      promptCategoryEmailWriting: "Viết email",
      promptCategoryCourseStudy: "Học môn",
      promptCategoryAssignmentPrep: "Chuẩn bị bài tập",
      promptCategoryConsultPrep: "Chuẩn bị tư vấn",
    },
    clubs: {
      howToJoin: "Hướng dẫn tham gia CLB",
      membershipType: "Hình thức tham gia",
      generalMember: "Thành viên thường",
      committeeCoreTeam: "Ban điều hành / core team",
      applicationProcess: "Quy trình đăng ký",
      interviewRequired: "Có yêu cầu phỏng vấn",
      cvPortfolio: "CV hoặc portfolio",
      eligibility: "Điều kiện tham gia",
      tryout: "Tryout hoặc đánh giá",
      recruitmentStatus: "Trạng thái tuyển thành viên",
      deadline: "Hạn đăng ký",
      applicationLink: "Link đăng ký",
      recruitmentAnnouncement: "Thông báo tuyển thành viên",
      officialChannels: "Kênh chính thức",
      notConfirmed: "Chưa xác minh",
      notAnnounced: "Chưa có thông báo",
      recruiting: "Đang tuyển",
      closed: "Đã đóng",
      upcoming: "Sắp mở",
      unverified: "Chưa xác minh",
      noDeadline: "Chưa có hạn đăng ký hiện tại",
      noCurrentAnnouncement: "Chưa có thông báo tuyển hiện tại",
      source: "Nguồn",
      searchPlaceholder: "Tìm tên CLB, sở thích hoặc hoạt động...",
      noMatches: "Không có CLB đã xác minh phù hợp với bộ lọc.",
      categoryAll: "Tất cả CLB",
      categoryAcademic: "Học thuật",
      categoryActive: "Thể thao & hoạt động",
      categoryCreative: "Sáng tạo",
      categorySocial: "Xã hội & sở thích",
      matchingClubs: "câu lạc bộ phù hợp",
      directorySource: "Nguồn RMIT",
      viewClub: "Xem câu lạc bộ",
      descriptionUnavailable: "Nguồn công khai đã xác minh chưa có mô tả bằng ngôn ngữ này.",
      imageAlt: "Hình ảnh chính thức của câu lạc bộ",
      facebookPage: "Trang Facebook của",
      directoryEyebrow: "ĐỜI SỐNG SINH VIÊN / DANH BẠ CÂU LẠC BỘ",
    },
    footer: {
      aboutText: "Nền tảng tra cứu và khám phá thông tin song ngữ độc lập do sinh viên RMIT phát triển nhằm hỗ trợ cộng đồng sinh viên.",
      quickLinks: "Điều hướng nhanh",
      officialResources: "Liên kết chính thức RMIT",
      legal: "Tuyên bố miễn trừ & Quyền riêng tư",
      rmitOfficial: "Trang web chính thức RMIT Việt Nam",
      copyright: "© 2026 R-Students' Research Forum. Dự án sinh viên độc lập.",
      privacy: "Chính sách bảo mật",
      about: "Về chúng tôi",
      creatorSlogan: "💔 Built by students, powered by stress.",
    },
    aboutPage: {
      eyebrow: "Dự án độc lập do sinh viên xây dựng",
      title: "Về R-Students' Research Forum",
      missionTitle: "Sứ mệnh",
      missionIntro: "Quy định đại học, hạn đăng ký môn, chính sách học vụ và dịch vụ hỗ trợ tại RMIT Việt Nam có thể nằm rải rác và khó tra cứu.",
      missionBody: "R-Students' Research Forum là cổng tra cứu song ngữ độc lập do sinh viên xây dựng. Tìm kiếm nguồn đã xác minh và hướng dẫn ngắn gọn để tìm thông tin phù hợp, thay vì dựa vào lời khuyên chưa được kiểm chứng.",
      searchFirstTitle: "Ưu tiên tìm kiếm, sau đó mới dùng AI",
      searchFirstBody: "Tìm kiếm truy vấn trực tiếp trong các hồ sơ RMIT đã chọn lọc, không sử dụng lượt AI hoặc gọi dịch vụ AI bên ngoài.",
      noRegistrationTitle: "Không cần đăng ký tài khoản",
      noRegistrationBody: "Không cần đăng nhập, RMIT SSO hay cung cấp email để duyệt nội dung. Người dùng ẩn danh có thể dùng tìm kiếm, hướng dẫn và hạn mức AI hằng ngày.",
      legalTitle: "Tuyên bố pháp lý quan trọng",
      legalBody: "Dự án này không liên kết, không được tài trợ và không được RMIT University hoặc RMIT University Vietnam xác nhận. Nhãn hiệu, dấu hiệu dịch vụ và tên thương mại thuộc về chủ sở hữu tương ứng.",
      sourcesTitle: "Danh bạ nguồn đã xác minh",
      sourcesIntro: "Nguồn RMIT công khai được kiểm tra trước khi dữ liệu được đăng. Facebook chỉ là kênh được xem xét thủ công và không được coi là chính thức chỉ dựa vào tên trang.",
      verifiedSource: "Nguồn đã xác minh",
      manualReview: "Cần xem xét thủ công",
    },
    privacyPage: {
      eyebrow: "Kiến trúc quyền riêng tư và bảo mật",
      title: "Chính sách quyền riêng tư",
      lastUpdated: "Cập nhật lần cuối: tháng 10/2026. Cách R-Students' Research Forum xử lý quyền riêng tư và dữ liệu của bạn.",
      zeroPersonalDataTitle: "1. Không thu thập dữ liệu cá nhân",
      zeroPersonalDataBody: "Chúng tôi không yêu cầu tạo tài khoản, đăng nhập bằng email sinh viên, RMIT Single Sign-On (SSO), mật khẩu hoặc xác minh danh tính. Bạn có thể tìm kiếm, đọc hướng dẫn và dùng trợ lý nghiên cứu ẩn danh.",
      cookieQuotaTitle: "2. Cookie định danh người dùng ẩn danh và hạn mức AI hằng ngày",
      cookieQuotaIntro: "Để thực thi giới hạn sử dụng hợp lý là 10 câu hỏi AI thành công mỗi ngày, hệ thống dùng cookie định danh ẩn danh đã ký:",
      cookieQuotaBullets: [
        "Chứa UUID giả ngẫu nhiên được ký bằng HMAC-SHA256.",
        "Không chứa thông tin nhận dạng cá nhân (PII).",
        "Được lưu với các cờ HttpOnly, Secure và SameSite=Lax.",
        "Hạn mức hằng ngày được đặt lại lúc nửa đêm theo múi giờ Asia/Ho_Chi_Minh.",
      ],
      aiTitle: "3. Xử lý AI và Google Gemini API",
      aiIntro: "Khi bạn gửi câu hỏi cho trợ lý Mr Hachiware, phần câu hỏi và hồ sơ RMIT đã xác minh có liên quan được gửi từ máy chủ đến Google Gemini API.",
      aiBullets: [
        "API key được lưu trong secrets của môi trường Cloudflare Workers và không gửi tới trình duyệt.",
        "Câu hỏi không được lưu hoặc lập chỉ mục trong cơ sở dữ liệu công khai bên ngoài.",
        "Lịch sử hội thoại được giữ trong phiên trình duyệt của bạn và có thể xóa bằng nút Xóa hội thoại.",
      ],
      securityTitle: "4. Bảo mật lưu lượng và biện pháp chống DDoS",
      securityBody: "Nền tảng chạy trên hạ tầng edge của Cloudflare Workers với biện pháp giảm thiểu DDoS tự động, Content Security Policy (CSP), giới hạn tốc độ theo đợt và các security header nghiêm ngặt nhằm ngăn việc thu thập trái phép và lưu lượng bot lạm dụng.",
    },
  },
};
