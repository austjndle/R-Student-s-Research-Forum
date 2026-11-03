import type { ClubProfile } from "./profile-types";

const ROOT = "https://www.rmit.edu.vn/students/campus-life/clubs/hanoi-city-campus-clubs";
const ACADEMIC = `${ROOT}/academic-clubs`;
const ACTIVE = `${ROOT}/active-clubs`;
const CREATIVE = `${ROOT}/creative-collective-clubs`;
const SOCIAL = `${ROOT}/social-and-special-interest-clubs`;
const PHOTOS = "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/hanoi-campus-clubs";
const RECENT_PHOTOS = "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/student-clubs/hanoi-clubs";

export const HANOI_PROFILES: Record<string, ClubProfile> = {
  "hn-business-finance": {
    officialName: "Business and Finance Club",
    sourceUrl: `${ACADEMIC}/business-finance-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Academic", vi: "Học thuật" },
    summary: {
      en: "Explore business, finance and analysis in a community connecting academic learning with professional experience.",
      vi: "Khám phá kinh doanh, tài chính và phân tích trong cộng đồng kết nối kiến thức học thuật với trải nghiệm nghề nghiệp."
    },
    about: [{
      en: "The club cultivates an inclusive academic community where students learn together, gain hands-on experience and connect with industry leaders and alumni. It aims to develop the knowledge, skills and mindset needed for the global business landscape.",
      vi: "Câu lạc bộ xây dựng cộng đồng học thuật cởi mở, nơi sinh viên cùng học hỏi, tích lũy trải nghiệm thực tế và kết nối với chuyên gia cùng cựu sinh viên. Mục tiêu là phát triển kiến thức, kỹ năng và tư duy cần thiết trong môi trường kinh doanh toàn cầu."
    }],
    activities: [
      { en: "Future Business Analyst competition and FBA Conference on business analysis in digital transformation.", vi: "Cuộc thi Future Business Analyst và hội thảo FBA về phân tích kinh doanh trong chuyển đổi số." },
      { en: "Company visits to PwC Vietnam, Vietnam Airlines and AIA Vietnam.", vi: "Tham quan doanh nghiệp PwC Việt Nam, Vietnam Airlines và AIA Việt Nam." },
      { en: "Blood Donation events with the National Institute of Hematology and Blood Transfusion and RMIT Student Life Hanoi.", vi: "Ngày hội hiến máu phối hợp với Viện Huyết học – Truyền máu Trung ương và RMIT Student Life Hà Nội." }
    ],
    contactEmail: "bfclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/rmitbfhn/",
    instagramUrl: null,
    otherLinks: [],
    images: [
      {
        url: `${RECENT_PHOTOS}/business-finance-club.jpg`,
        alt: { en: "Business and Finance Club members posing together in a classroom", vi: "Thành viên Câu lạc bộ Kinh doanh và Tài chính chụp ảnh tập thể trong phòng học" },
        sourceUrl: `${ACADEMIC}/business-finance-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/business-club/students-in-business-competition-in-hanoi.jpg`,
        alt: { en: "Business and Finance Club students at a competition in Hanoi", vi: "Sinh viên Câu lạc bộ Kinh doanh và Tài chính tham gia cuộc thi tại Hà Nội" },
        sourceUrl: `${ACADEMIC}/business-finance-club`,
        kind: "photo"
      }
    ]
  },
  "hn-innovation-entrepreneurship": {
    officialName: "Innovation and Entrepreneurship Club",
    sourceUrl: `${ACADEMIC}/innovation-and-entrepreneurship-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Academic", vi: "Học thuật" },
    summary: {
      en: "Develop an innovative, entrepreneurial mindset through practical learning and experiences with businesses.",
      vi: "Phát triển tư duy đổi mới và khởi nghiệp thông qua học tập thực hành cùng trải nghiệm tại doanh nghiệp."
    },
    about: [{
      en: "The club empowers students to become dynamic, innovative and entrepreneurial leaders. Its vision is to inspire positive change in students' communities and beyond through real-world experiences.",
      vi: "Câu lạc bộ hỗ trợ sinh viên trở thành những người dẫn dắt năng động, sáng tạo và có tinh thần khởi nghiệp. Thông qua trải nghiệm thực tế, câu lạc bộ khuyến khích sinh viên tạo ra thay đổi tích cực cho cộng đồng và xã hội."
    }],
    activities: [
      { en: "From Chaos to Crown: startup crisis communication talks, a workshop and mini-pitching sessions.", vi: "From Chaos to Crown: tọa đàm về xử lý khủng hoảng truyền thông cho doanh nghiệp khởi nghiệp, hoạt động thực hành và trình bày ý tưởng ngắn." },
      { en: "InnoLab Showcase with Karuna on sustainable products and the circular economy.", vi: "Triển lãm tương tác InnoLab cùng Karuna về sản phẩm bền vững và kinh tế tuần hoàn." },
      { en: "IEC Bootcamp – Unicorn Start-up 101, with panels and practical workshops.", vi: "Chương trình IEC Bootcamp – Unicorn Start-up 101 với các phiên thảo luận và hoạt động thực hành." },
      { en: "Company visits to Vinfast, THT Vietnam and Appota; The Wishful Light fundraising project for children with disabilities.", vi: "Tham quan Vinfast, THT Việt Nam và Appota; dự án gây quỹ The Wishful Light hỗ trợ trẻ em khuyết tật." }
    ],
    contactEmail: "ieclub.hn@rmit.edu.vn",
    facebookUrl: null,
    instagramUrl: null,
    otherLinks: [{ label: "LinkedIn", url: "https://www.linkedin.com/company/rmit-innovation-entrepreneurship-club-hanoi" }],
    images: [
      {
        url: `${PHOTOS}/innovation-and-entrepreneurship-club/entrerpreneurship-student-club-booth-rmit-hn.jpg`,
        alt: { en: "Innovation and Entrepreneurship Club members at their RMIT Hanoi booth", vi: "Thành viên Câu lạc bộ Đổi mới và Khởi nghiệp tại gian hàng ở RMIT Hà Nội" },
        sourceUrl: `${ACADEMIC}/innovation-and-entrepreneurship-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/innovation-and-entrepreneurship-club/entrerpreneurship-students-hn-at-vinfast.jpg`,
        alt: { en: "Innovation and Entrepreneurship Club visiting Vinfast", vi: "Câu lạc bộ Đổi mới và Khởi nghiệp tham quan Vinfast" },
        sourceUrl: `${ACADEMIC}/innovation-and-entrepreneurship-club`,
        kind: "photo"
      }
    ]
  },
  "hn-basketball": {
    officialName: "Basketball Club",
    sourceUrl: `${ACTIVE}/basketball-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Sports and Arts", vi: "Thể thao và Nghệ thuật" },
    summary: {
      en: "A basketball community for all skill levels to improve fitness, teamwork and skills together.",
      vi: "Cộng đồng bóng rổ dành cho mọi trình độ, cùng nâng cao thể lực, kỹ năng và tinh thần đồng đội."
    },
    about: [{
      en: "The club welcomes basketball players regardless of experience. Members learn from one another in a proactive, collaborative environment that values sporting development, teamwork and physical health.",
      vi: "Câu lạc bộ chào đón người chơi bóng rổ ở mọi mức độ kinh nghiệm. Thành viên học hỏi lẫn nhau trong môi trường chủ động và hợp tác, chú trọng phát triển kỹ năng thể thao, tinh thần đồng đội và sức khỏe."
    }],
    activities: [
      { en: "BANKING 3x3 basketball tournament, offering playing and sports-event organising experience.", vi: "Giải bóng rổ BANKING 3x3, mang lại trải nghiệm thi đấu và tổ chức sự kiện thể thao." },
      { en: "Participation in RMIT Spring Ekiden, a team relay race.", vi: "Tham gia giải chạy tiếp sức đồng đội RMIT Spring Ekiden." }
    ],
    contactEmail: "basketballclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/RmitHanoiBasketballClub/",
    instagramUrl: null,
    otherLinks: [],
    images: [
      {
        url: `${RECENT_PHOTOS}/basketball-club-hanoi.jpg`,
        alt: { en: "RMIT Hanoi Basketball Club team posing with its banner", vi: "Đội bóng rổ RMIT Hà Nội chụp ảnh cùng cờ câu lạc bộ" },
        sourceUrl: `${ACTIVE}/basketball-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/basketball-club/student-with-basketball-2.jpg`,
        alt: { en: "RMIT Hanoi Basketball Club member with a basketball", vi: "Thành viên Câu lạc bộ Bóng rổ RMIT Hà Nội cầm bóng rổ" },
        sourceUrl: `${ACTIVE}/basketball-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/basketball-club/student-with-basketball-1.jpg`,
        alt: { en: "Basketball player featured in the Hanoi club gallery", vi: "Người chơi bóng rổ trong bộ ảnh của câu lạc bộ tại Hà Nội" },
        sourceUrl: `${ACTIVE}/basketball-club`,
        kind: "photo"
      }
    ]
  },
  "hn-football": {
    officialName: "Football Club",
    sourceUrl: `${ACTIVE}/football-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Sports and Arts", vi: "Thể thao và Nghệ thuật" },
    summary: {
      en: "Share a passion for football through coached training, tournaments and campus activities.",
      vi: "Chia sẻ niềm đam mê bóng đá qua các buổi tập có huấn luyện viên, giải đấu và hoạt động trong trường."
    },
    about: [{
      en: "The club brings football to campus through weekly internal training focused on tactics, stamina and teamwork. Its published highlights also describe organising RFCup and connecting with teams from other universities.",
      vi: "Câu lạc bộ lan tỏa bóng đá trong trường qua các buổi tập nội bộ hằng tuần, tập trung vào chiến thuật, sức bền và phối hợp đồng đội. Những hoạt động được công bố còn gồm tổ chức RFCup và giao lưu với đội bóng từ các trường đại học khác."
    }],
    activities: [
      { en: "Weekly internal training with a professional coach.", vi: "Tập luyện nội bộ hằng tuần cùng huấn luyện viên chuyên nghiệp." },
      { en: "RFCup 2024, including guest teams from other universities.", vi: "Giải RFCup 2024 có các đội khách mời từ trường đại học khác." },
      { en: "Football minigames and club introductions at RMIT Hanoi Club Day.", vi: "Trò chơi bóng đá và giới thiệu câu lạc bộ tại Ngày hội Câu lạc bộ RMIT Hà Nội." }
    ],
    contactEmail: "footballclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/people/RMIT-Hanoi-Football-Club/61564330775730/",
    instagramUrl: null,
    otherLinks: [],
    images: [
      {
        url: `${PHOTOS}/hanoi-club-logos-2021/student-website-content/sports-and-arts-clubs/football-club/football-club-hanoi.jpg`,
        alt: { en: "RMIT Hanoi Football Club players and supporters on a football pitch", vi: "Cầu thủ và người cổ vũ Câu lạc bộ Bóng đá RMIT Hà Nội trên sân bóng" },
        sourceUrl: `${ACTIVE}/football-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/football-club/football-club-students-with-medals-outdoor.jpg`,
        alt: { en: "RMIT Hanoi Football Club members outdoors with medals", vi: "Thành viên Câu lạc bộ Bóng đá RMIT Hà Nội đeo huy chương ngoài trời" },
        sourceUrl: `${ACTIVE}/football-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/football-club/student-football-club-at-event.jpg`,
        alt: { en: "RMIT Hanoi Football Club at an event", vi: "Câu lạc bộ Bóng đá RMIT Hà Nội tham gia sự kiện" },
        sourceUrl: `${ACTIVE}/football-club`,
        kind: "photo"
      }
    ],
    sourceNotes: {
      en: "The official About paragraph incorrectly describes Basketball Club. This profile uses the football-specific introduction and highlights instead.",
      vi: "Đoạn giới thiệu chính trên trang chính thức nhầm sang Câu lạc bộ Bóng rổ. Hồ sơ này sử dụng phần dẫn nhập và các hoạt động được nêu riêng cho bóng đá."
    }
  },
  "hn-cineverse": {
    officialName: "Cineverse Club",
    sourceUrl: `${CREATIVE}/cineverse-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Social and Special Interest", vi: "Xã hội và Sở thích đặc biệt" },
    summary: {
      en: "Connect with fellow film lovers and explore cinema as a way to tell meaningful stories and inspire positive change.",
      vi: "Kết nối với những người yêu điện ảnh và khám phá cách kể chuyện ý nghĩa, truyền cảm hứng thay đổi tích cực qua phim ảnh."
    },
    about: [{
      en: "Cineverse nurtures a passionate film community that values creativity, exploration and meaningful storytelling. The club sees cinema as both an art form and a way to express ideas and contribute to society.",
      vi: "Cineverse nuôi dưỡng cộng đồng yêu điện ảnh, trân trọng sự sáng tạo, khám phá và những câu chuyện có ý nghĩa. Câu lạc bộ xem điện ảnh vừa là nghệ thuật, vừa là phương tiện thể hiện ý tưởng và đóng góp cho xã hội."
    }],
    activities: [
      { en: "(E)motions: exploring emotional diversity through storytelling and cinematic expression.", vi: "(E)motions: khám phá sự đa dạng cảm xúc qua kể chuyện và ngôn ngữ điện ảnh." },
      { en: "I am Beautiful, You too: talks about inner beauty, self-love and acceptance with RMIT ELA.", vi: "I am Beautiful, You too: trò chuyện về vẻ đẹp bên trong, yêu thương và chấp nhận bản thân cùng RMIT ELA." },
      { en: "Behind The Scenes: hands-on exploration of the work behind filmmaking.", vi: "Behind The Scenes: trải nghiệm thực tế để tìm hiểu công việc hậu trường làm phim." },
      { en: "KẾT: a charity trip to Thiên Hương Pagoda, a documentary and an exhibition of the journey.", vi: "KẾT: chuyến thiện nguyện tại chùa Thiên Hương, phim tài liệu và triển lãm về hành trình." }
    ],
    contactEmail: "cineverseclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/rmithanoicineverseclub",
    instagramUrl: null,
    otherLinks: [],
    images: [{
      url: `${RECENT_PHOTOS}/cineverse-club.jpg`,
      alt: { en: "Cineverse Club members posing together at their KẾT display", vi: "Thành viên Cineverse chụp ảnh tập thể tại khu trưng bày KẾT" },
      sourceUrl: `${CREATIVE}/cineverse-club`,
      kind: "photo"
    }],
    sourceNotes: {
      en: "The page now lists Cineverse's own Facebook and email. Its canonical metadata still incorrectly points to Current Media; the profile uses only Cineverse's visible content and photograph.",
      vi: "Trang hiện ghi đúng Facebook và email của Cineverse. Dữ liệu liên kết chính tắc vẫn trỏ nhầm đến Current Media; hồ sơ chỉ sử dụng nội dung hiển thị và ảnh riêng của Cineverse."
    }
  },
  "hn-current-media": {
    officialName: "Current Media Club",
    sourceUrl: `${CREATIVE}/current-media-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Social and Special Interest", vi: "Xã hội và Sở thích đặc biệt" },
    summary: {
      en: "Create publications, podcasts, exhibitions and media projects with RMIT Hanoi's student-run creative collective.",
      vi: "Sáng tạo ấn phẩm, podcast, triển lãm và dự án truyền thông cùng tập thể sáng tạo do sinh viên RMIT Hà Nội điều hành."
    },
    about: [{
      en: "Established in 2012, Current Media is RMIT Hanoi's student-run publication and media production collective. It brings together young creatives to explore Vietnam's changing media landscape and make an impact through communication and art.",
      vi: "Thành lập năm 2012, Current Media là tập thể xuất bản và sản xuất truyền thông do sinh viên RMIT Hà Nội điều hành. Câu lạc bộ tập hợp những người trẻ sáng tạo để khám phá bối cảnh truyền thông Việt Nam đang thay đổi và tạo ảnh hưởng qua nghệ thuật, truyền thông."
    }],
    activities: [
      { en: "In The Current podcasts, including YOUTH and INDIVIDUALITY seasons.", vi: "Chuỗi podcast In The Current, gồm các mùa YOUTH về tuổi trẻ và INDIVIDUALITY về bản sắc cá nhân." },
      { en: "Book Talk 01 with journalist Đào Mai Trang on writing about contemporary Vietnamese art.", vi: "Book Talk 01 cùng nhà báo Đào Mai Trang về việc viết về nghệ thuật đương đại Việt Nam." },
      { en: "HỒI exhibition introducing the Youth magazine and reflecting on the club's publications.", vi: "Triển lãm HỒI giới thiệu tạp chí Youth và nhìn lại các ấn phẩm của câu lạc bộ." }
    ],
    contactEmail: "currentmedia.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/CurrentMediaRMIT/",
    instagramUrl: null,
    otherLinks: [],
    images: [
      {
        url: `${RECENT_PHOTOS}/current-media-club.jpg`,
        alt: { en: "Current Media members posing together with gifts and creative objects", vi: "Thành viên Current Media chụp ảnh cùng quà tặng và đồ vật sáng tạo" },
        sourceUrl: `${CREATIVE}/current-media-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/current-media-club/group-photo-of-students.jpg`,
        alt: { en: "Current Media Club students in a group photograph", vi: "Ảnh tập thể sinh viên Câu lạc bộ Current Media" },
        sourceUrl: `${CREATIVE}/current-media-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/current-media-club/students-visiting-an-exhibition.jpg`,
        alt: { en: "Students visiting a Current Media exhibition", vi: "Sinh viên tham quan triển lãm của Current Media" },
        sourceUrl: `${CREATIVE}/current-media-club`,
        kind: "photo"
      }
    ],
    sourceNotes: {
      en: "The page says the club was established in 2012 but describes HỒI as celebrating two decades. The contradictory duration is not repeated here.",
      vi: "Trang ghi câu lạc bộ thành lập năm 2012 nhưng mô tả HỒI là dịp kỷ niệm hai thập kỷ. Hồ sơ không lặp lại mốc thời gian mâu thuẫn này."
    }
  },
  "hn-dance": {
    officialName: "Dance Club",
    sourceUrl: `${CREATIVE}/dance-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Sports and Arts", vi: "Thể thao và Nghệ thuật" },
    summary: {
      en: "Celebrate dance, movement and music through performances, showcases and creative collaborations.",
      vi: "Chia sẻ tình yêu vũ đạo, chuyển động và âm nhạc qua biểu diễn, chương trình nghệ thuật và hợp tác sáng tạo."
    },
    about: [{
      en: "Dance Club blends professionalism, unity and passion in an inclusive community. It welcomes people from different backgrounds to share their love of movement and music and contribute to a vibrant campus.",
      vi: "Câu lạc bộ Nhảy kết hợp tính chuyên nghiệp, tinh thần đoàn kết và đam mê trong một cộng đồng cởi mở. Thành viên từ nhiều nền tảng cùng chia sẻ tình yêu chuyển động, âm nhạc và góp phần làm phong phú đời sống trong trường."
    }],
    activities: [
      { en: "Performances at RMIT Spring Ekiden and the Graduation Ceremony.", vi: "Biểu diễn tại RMIT Spring Ekiden và lễ tốt nghiệp." },
      { en: "The Secret Soirée showcase and the Hot Girl Summer dance video project.", vi: "Chương trình biểu diễn The Secret Soirée và dự án video vũ đạo Hot Girl Summer." },
      { en: "Collaborations with BUV students on Ru Êm – A Lullaby Artshow and The Universe showcase.", vi: "Hợp tác với sinh viên BUV trong Ru Êm – A Lullaby Artshow và chương trình The Universe." }
    ],
    contactEmail: "danceclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/rmithndanceclub/",
    instagramUrl: null,
    otherLinks: [],
    images: [
      {
        url: `${PHOTOS}/hanoi-club-logos-2021/student-website-content/sports-and-arts-clubs/dance-club/dance-club-hanoi.jpg`,
        alt: { en: "Hanoi Dance Club members posing outdoors in coordinated outfits", vi: "Thành viên Câu lạc bộ Nhảy Hà Nội chụp ảnh ngoài trời trong trang phục đồng bộ" },
        sourceUrl: `${CREATIVE}/dance-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/dance-club/student-dance-club-group-photo-on-stage.jpg`,
        alt: { en: "RMIT Hanoi Dance Club posing together on stage", vi: "Câu lạc bộ Nhảy RMIT Hà Nội chụp ảnh tập thể trên sân khấu" },
        sourceUrl: `${CREATIVE}/dance-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/dance-club/student-dance-club-performing-on-stage.jpg`,
        alt: { en: "RMIT Hanoi Dance Club performing on stage", vi: "Câu lạc bộ Nhảy RMIT Hà Nội biểu diễn trên sân khấu" },
        sourceUrl: `${CREATIVE}/dance-club`,
        kind: "photo"
      }
    ]
  },
  "hn-music": {
    officialName: "Music Club",
    sourceUrl: `${CREATIVE}/music-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Sports and Arts", vi: "Thể thao và Nghệ thuật" },
    summary: {
      en: "Grow your musical and stage skills through workshops, training and student-led shows.",
      vi: "Phát triển kỹ năng âm nhạc và biểu diễn qua các buổi chia sẻ, luyện tập và chương trình do sinh viên tổ chức."
    },
    about: [{
      en: "Music Club creates space for musical passion while developing members' talents and event-management abilities. It also aims to connect student musicians with professional music networks beyond campus.",
      vi: "Câu lạc bộ Âm nhạc tạo không gian cho đam mê nghệ thuật, đồng thời phát triển tài năng và khả năng tổ chức sự kiện của thành viên. Câu lạc bộ cũng hướng tới kết nối sinh viên với mạng lưới âm nhạc chuyên nghiệp ngoài trường."
    }],
    activities: [
      { en: "Music workshops, events and training classes.", vi: "Các buổi chia sẻ, sự kiện âm nhạc và lớp luyện tập." },
      { en: "SEGNO annual showcase featuring student musical talents.", vi: "Chương trình biểu diễn thường niên SEGNO giới thiệu tài năng âm nhạc sinh viên." },
      { en: "End-of-semester mini-shows, including Kixxmax, Diệu, Kissmas and Lặng, for stage practice and confidence.", vi: "Các đêm diễn nhỏ cuối học kỳ như Kixxmax, Diệu, Kissmas và Lặng giúp rèn kỹ năng sân khấu và sự tự tin." }
    ],
    contactEmail: "musicclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/rmithnmusicclub/",
    instagramUrl: null,
    otherLinks: [],
    images: [
      {
        url: `${PHOTOS}/hanoi-club-logos-2021/student-website-content/sports-and-arts-clubs/music-club/music-club-hanoi.jpg`,
        alt: { en: "Music Club members holding their banner at a live-music venue", vi: "Thành viên Câu lạc bộ Âm nhạc cầm cờ tại địa điểm biểu diễn nhạc sống" },
        sourceUrl: `${CREATIVE}/music-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/music-club/student-music-club-group-photo.jpg`,
        alt: { en: "RMIT Hanoi Music Club group photograph", vi: "Ảnh tập thể Câu lạc bộ Âm nhạc RMIT Hà Nội" },
        sourceUrl: `${CREATIVE}/music-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/music-club/student-singing-at-rmit-event.png`,
        alt: { en: "Music Club member singing at an RMIT event", vi: "Thành viên Câu lạc bộ Âm nhạc hát tại sự kiện RMIT" },
        sourceUrl: `${CREATIVE}/music-club`,
        kind: "photo"
      }
    ]
  },
  "hn-musical-theatre": {
    officialName: "Musical Theatre Club",
    sourceUrl: `${CREATIVE}/musical-theatre-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Sports and Arts", vi: "Thể thao và Nghệ thuật" },
    summary: {
      en: "Bring singing, dance and acting together in an inclusive community for musical theatre.",
      vi: "Kết hợp ca hát, vũ đạo và diễn xuất trong cộng đồng nhạc kịch cởi mở."
    },
    about: [{
      en: "The club brings students together through concerts, music videos and collaborative projects. It aims to nurture creativity and friendships while creating memorable performances for the RMIT community.",
      vi: "Câu lạc bộ kết nối sinh viên qua các buổi hòa nhạc, video âm nhạc và dự án hợp tác. Các hoạt động nuôi dưỡng sự sáng tạo, tình bạn và mang đến những tiết mục đáng nhớ cho cộng đồng RMIT."
    }],
    activities: [
      { en: "Production of a musical music video inspired by La La Land.", vi: "Sản xuất video nhạc kịch lấy cảm hứng từ bộ phim La La Land." },
      { en: "Enchanted Dreams mini-show combining singing, dance and acting with fairy-tale storytelling.", vi: "Đêm diễn Enchanted Dreams kết hợp ca hát, vũ đạo, diễn xuất và những câu chuyện cổ tích." }
    ],
    contactEmail: "mtclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/theatrmithanoi",
    instagramUrl: null,
    otherLinks: [],
    images: [
      {
        url: `${RECENT_PHOTOS}/musical-theatre-club.jpg`,
        alt: { en: "Musical Theatre Club members posing together in a rehearsal room", vi: "Thành viên Câu lạc bộ Nhạc kịch chụp ảnh tập thể trong phòng tập" },
        sourceUrl: `${CREATIVE}/musical-theatre-club`,
        kind: "photo"
      },
      {
        url: "https://s7ap1.scene7.com/is/image/rmit/musical-and-theater-club-group-photo?wid=800",
        alt: { en: "RMIT Hanoi Musical Theatre Club group photograph", vi: "Ảnh tập thể Câu lạc bộ Nhạc kịch RMIT Hà Nội" },
        sourceUrl: `${CREATIVE}/musical-theatre-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/musical-and-theater-club/students-practicing-musical-sequence.jpg`,
        alt: { en: "Musical Theatre Club members rehearsing a musical sequence", vi: "Thành viên Câu lạc bộ Nhạc kịch luyện tập một phân đoạn biểu diễn" },
        sourceUrl: `${CREATIVE}/musical-theatre-club`,
        kind: "photo"
      }
    ]
  },
  "hn-photography": {
    officialName: "Photography Club",
    sourceUrl: `${CREATIVE}/photography-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Social & Special Interest", vi: "Xã hội và Sở thích đặc biệt" },
    summary: {
      en: "Explore visual storytelling and create powerful photographic work with a student creative community.",
      vi: "Khám phá cách kể chuyện bằng hình ảnh và sáng tạo tác phẩm nhiếp ảnh giàu sức truyền đạt cùng cộng đồng sinh viên."
    },
    about: [{
      en: "Photography Club empowers RMIT students to create powerful, professional visual works. Its exhibitions and hands-on photography activities offer space for reflection, technical learning and creative expression.",
      vi: "Câu lạc bộ Nhiếp ảnh hỗ trợ sinh viên RMIT tạo nên những tác phẩm thị giác chuyên nghiệp và giàu sức truyền đạt. Triển lãm cùng hoạt động thực hành nhiếp ảnh tạo không gian chiêm nghiệm, học kỹ thuật và thể hiện sáng tạo."
    }],
    activities: [
      { en: "Chín Muồi and Space photography exhibitions exploring growth, identity and personal perspectives.", vi: "Triển lãm ảnh Chín Muồi và Space khám phá sự trưởng thành, bản sắc và góc nhìn cá nhân." },
      { en: "A Chemical Miracle film-photography workshop with hands-on activities and a guest speaker.", vi: "Buổi thực hành nhiếp ảnh phim A Chemical Miracle với hoạt động trải nghiệm và diễn giả khách mời." },
      { en: "Hopamine fundraising booth supporting children at Viet Duc Children's Hospital, as named on the official page.", vi: "Gian hàng gây quỹ Hopamine hỗ trợ trẻ em tại bệnh viện được trang chính thức gọi là Viet Duc Children's Hospital." }
    ],
    contactEmail: "photographyclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/photographyrmithn/",
    instagramUrl: null,
    otherLinks: [{ label: "Photo gallery / Thư viện ảnh", url: "https://drive.google.com/drive/folders/1rOR3kFa7Pc3umw3xDj87b5tHQKKFAZz1?usp=sharing" }],
    images: [
      {
        url: `${RECENT_PHOTOS}/photography-club-hanoi.jpg`,
        alt: { en: "Photography Club members posing together with cameras", vi: "Thành viên Câu lạc bộ Nhiếp ảnh chụp ảnh tập thể cùng máy ảnh" },
        sourceUrl: `${CREATIVE}/photography-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/hanoi-club-logos-2021/student-website-content/social-and-special-interests-clubs/photography-club/group-of-students-from-photography-club.jpg`,
        alt: { en: "RMIT Hanoi Photography Club students together", vi: "Các sinh viên Câu lạc bộ Nhiếp ảnh RMIT Hà Nội chụp ảnh cùng nhau" },
        sourceUrl: `${CREATIVE}/photography-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/hanoi-club-logos-2021/student-website-content/social-and-special-interests-clubs/photography-club/students-visiting-photography-exhibition.jpg`,
        alt: { en: "Visitors exploring a Photography Club exhibition", vi: "Khách tham quan triển lãm của Câu lạc bộ Nhiếp ảnh" },
        sourceUrl: `${CREATIVE}/photography-club`,
        kind: "photo"
      }
    ]
  },
  "hn-charity-environment": {
    officialName: "Charity and Environment Club",
    sourceUrl: `${SOCIAL}/charity-and-environment-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Social and Special Interest", vi: "Xã hội và Sở thích đặc biệt" },
    summary: {
      en: "Turn empathy into action through volunteering, environmental awareness and community projects.",
      vi: "Biến sự đồng cảm thành hành động qua tình nguyện, nâng cao ý thức môi trường và các dự án cộng đồng."
    },
    about: [{
      en: "With the slogan “Choose to Act, Resonate through Empathy”, the club connects volunteers who want to spread kindness within and beyond RMIT. Its projects combine practical support for people in need with more sustainable ways of giving.",
      vi: "Với thông điệp “Chọn hành động, lan tỏa bằng sự đồng cảm”, câu lạc bộ kết nối những tình nguyện viên muốn lan tỏa lòng tốt trong và ngoài RMIT. Các dự án kết hợp hỗ trợ thiết thực cho người gặp khó khăn với những cách làm thiện nguyện bền vững hơn."
    }],
    activities: [
      { en: "Thiện Âm charity trip with Music Club to support a kindergarten and households in Mộc Châu, Sơn La.", vi: "Chuyến thiện nguyện Thiện Âm cùng Câu lạc bộ Âm nhạc hỗ trợ trường mầm non và các hộ dân tại Mộc Châu, Sơn La." },
      { en: "Eco Day and Flea Market on sorting waste, recycling and collecting clothes; Tia Ấm gửi em school support trip.", vi: "Eco Day và chợ đồ cũ về phân loại rác, tái chế, quyên góp quần áo; chuyến hỗ trợ trường học Tia Ấm gửi em." },
      { en: "Echoes of Hope: domestic-violence awareness activities and a kindergarten library renovation using donated and recycled materials.", vi: "Echoes of Hope: hoạt động nâng cao nhận thức về bạo lực gia đình và cải tạo thư viện mầm non bằng vật liệu quyên góp, tái chế." }
    ],
    contactEmail: "ceclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/Ceclub.rmit.hn/",
    instagramUrl: null,
    otherLinks: [],
    images: [
      {
        url: `${RECENT_PHOTOS}/charity-and-environmental-club.jpg`,
        alt: { en: "Charity and Environment Club members with handmade flowers and a rhinoceros mascot", vi: "Thành viên Câu lạc bộ Thiện nguyện và Môi trường cùng hoa thủ công và linh vật tê giác" },
        sourceUrl: `${SOCIAL}/charity-and-environment-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/charity-and-environment-club/group-of-students-posing-with-green-day-frame.jpg`,
        alt: { en: "Charity and Environment Club students posing with a Green Day frame", vi: "Sinh viên Câu lạc bộ Thiện nguyện và Môi trường chụp ảnh cùng khung Green Day" },
        sourceUrl: `${SOCIAL}/charity-and-environment-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/charity-and-environment-club/group-of-students-with-children-in-remote-area.jpg`,
        alt: { en: "Club volunteers and children during a community visit", vi: "Tình nguyện viên câu lạc bộ và các em nhỏ trong chuyến thăm cộng đồng" },
        sourceUrl: `${SOCIAL}/charity-and-environment-club`,
        kind: "photo"
      }
    ]
  },
  "hn-event": {
    officialName: "Event Club",
    sourceUrl: `${SOCIAL}/event-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Social and Special Interest", vi: "Xã hội và Sở thích đặc biệt" },
    summary: {
      en: "Gain event-planning experience while creating entertaining, connecting and charitable experiences for students.",
      vi: "Tích lũy kinh nghiệm tổ chức sự kiện qua các hoạt động giải trí, kết nối và thiện nguyện dành cho sinh viên."
    },
    about: [{
      en: "Event Club designs bold, positive entertainment that helps students connect and express themselves. Its values combine entertainment with originality, memorable moments and student empowerment.",
      vi: "Câu lạc bộ Sự kiện thiết kế hoạt động giải trí táo bạo, tích cực để sinh viên kết nối và thể hiện bản thân. Giá trị của câu lạc bộ kết hợp niềm vui với sự mới mẻ, những khoảnh khắc đáng nhớ và việc khuyến khích sinh viên phát huy khả năng."
    }],
    activities: [
      { en: "Twin Flame blind-date event and Emootopia interactive experience.", vi: "Sự kiện hẹn hò giấu mặt Twin Flame và trải nghiệm tương tác Emootopia." },
      { en: "Bearity teddy-bear workshop and The Moonia Mid-Autumn charity fundraiser.", vi: "Hoạt động làm gấu bông Bearity và sự kiện gây quỹ thiện nguyện Trung thu The Moonia." },
      { en: "EC Billiards Tournament and Quack Attract live-action social deduction games.", vi: "Giải bi-a EC và trò chơi suy luận nhập vai trực tiếp Quack Attract." }
    ],
    contactEmail: "eventclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/rmit.eventclub.hanoi/",
    instagramUrl: null,
    otherLinks: [],
    images: [
      {
        url: `${RECENT_PHOTOS}/event-club-hanoi.jpg`,
        alt: { en: "Event Club members holding their club banner in a classroom", vi: "Thành viên Câu lạc bộ Sự kiện cầm cờ câu lạc bộ trong phòng học" },
        sourceUrl: `${SOCIAL}/event-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/event-club/event-club-group-photo.jpg`,
        alt: { en: "RMIT Hanoi Event Club group photograph", vi: "Ảnh tập thể Câu lạc bộ Sự kiện RMIT Hà Nội" },
        sourceUrl: `${SOCIAL}/event-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/event-club/event-club-students-with-guest-speaker.jpg`,
        alt: { en: "Event Club students with a guest speaker", vi: "Sinh viên Câu lạc bộ Sự kiện cùng diễn giả khách mời" },
        sourceUrl: `${SOCIAL}/event-club`,
        kind: "photo"
      }
    ]
  },
  "hn-japanese-culture": {
    officialName: "Japanese Culture Club - Hanoi",
    sourceUrl: `${SOCIAL}/japanese-culture-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Social and Special Interest", vi: "Xã hội và Sở thích đặc biệt" },
    summary: {
      en: "Discover Japanese culture through creative events, traditional arts and shared experiences.",
      vi: "Khám phá văn hóa Nhật Bản qua sự kiện sáng tạo, nghệ thuật truyền thống và những trải nghiệm chung."
    },
    about: [{
      en: "Built around the values of Mind, Body and Soul, the club introduces Japanese culture to the RMIT Hanoi community. Its events aim to enrich student life and encourage cultural appreciation.",
      vi: "Dựa trên ba giá trị Trí tuệ, Thể chất và Tâm hồn, câu lạc bộ giới thiệu văn hóa Nhật Bản tới cộng đồng RMIT Hà Nội. Các sự kiện giúp làm phong phú đời sống sinh viên và nuôi dưỡng sự trân trọng văn hóa."
    }],
    activities: [
      { en: "Geisha’s Backstage with RMIT Library, exploring geisha culture.", vi: "Geisha’s Backstage cùng Thư viện RMIT, tìm hiểu văn hóa geisha." },
      { en: "JSPACE origami exhibition inspired by nature and the four seasons.", vi: "Triển lãm nghệ thuật gấp giấy JSPACE lấy cảm hứng từ thiên nhiên và bốn mùa." },
      { en: "Karate workshop and JFES annual festival with traditional games, crafts and performances.", vi: "Buổi trải nghiệm karate và lễ hội thường niên JFES với trò chơi truyền thống, thủ công và biểu diễn." }
    ],
    contactEmail: "jcclub.hn@rmit.edu.vn",
    facebookUrl: "https://m.facebook.com/jcclub.hn/",
    instagramUrl: null,
    otherLinks: [],
    images: [
      {
        url: `${RECENT_PHOTOS}/japanese-culture-club-hn.jpg`,
        alt: { en: "Japanese Culture Club members together in a classroom", vi: "Thành viên Câu lạc bộ Văn hóa Nhật Bản chụp ảnh trong phòng học" },
        sourceUrl: `${SOCIAL}/japanese-culture-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/japanese-culture-club/students-at-the-japanese-culture-club-booth.jpg`,
        alt: { en: "Students at the Japanese Culture Club booth in Hanoi", vi: "Sinh viên tại gian hàng Câu lạc bộ Văn hóa Nhật Bản ở Hà Nội" },
        sourceUrl: `${SOCIAL}/japanese-culture-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/hanoi-club-logos-2021/logos/sports-and-special-interests-clubs/social-and-special-interests-clubs-hanoi.jpg`,
        alt: { en: "Japanese Culture Club members posing in coordinated Japanese-style clothing with fans", vi: "Thành viên Câu lạc bộ Văn hóa Nhật Bản mặc trang phục kiểu Nhật đồng bộ và cầm quạt" },
        sourceUrl: `${SOCIAL}/japanese-culture-club`,
        kind: "photo"
      }
    ]
  },
  "hn-psyche": {
    officialName: "Psyche Club",
    sourceUrl: `${SOCIAL}/psyche-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Social and Special Interest", vi: "Xã hội và Sở thích đặc biệt" },
    summary: {
      en: "Make psychology more accessible through shared learning, reflection and real-life exploration.",
      vi: "Đưa tâm lý học đến gần mọi người hơn qua học hỏi, chiêm nghiệm và khám phá các tình huống đời sống."
    },
    about: [{
      en: "Psyche offers a safe, supportive space to explore the mind, the inner child and psychological knowledge in everyday life. Members share experiences, learn from one another and develop their understanding and personal potential.",
      vi: "Psyche mang đến không gian an toàn, hỗ trợ để tìm hiểu tâm trí, đứa trẻ bên trong và ứng dụng kiến thức tâm lý vào đời sống. Thành viên chia sẻ trải nghiệm, học hỏi lẫn nhau và phát triển hiểu biết cùng tiềm năng cá nhân."
    }],
    activities: [
      { en: "Booaway talk show on dealing with fears, with developmental psychologist Dr Gordon Ingram.", vi: "Tọa đàm Booaway về cách đối diện nỗi sợ cùng chuyên gia tâm lý học phát triển, Tiến sĩ Gordon Ingram." },
      { en: "Flower Harmony self-reflection activities and flower-arranging workshop.", vi: "Hoạt động chiêm nghiệm bản thân và thực hành cắm hoa Flower Harmony." },
      { en: "Me The0rem interactive activities on gender diversity, and a screening and discussion of Perfect Blue.", vi: "Hoạt động tương tác Me The0rem về đa dạng giới, cùng buổi chiếu và thảo luận phim Perfect Blue." }
    ],
    contactEmail: "psycheclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/psycheclub.hn",
    instagramUrl: null,
    otherLinks: [],
    images: [{
      url: `${RECENT_PHOTOS}/psyche-club-day.jpg`,
      alt: { en: "Psyche Club members holding their banner at a decorated Club Day booth", vi: "Thành viên Psyche cầm cờ câu lạc bộ tại gian hàng Ngày hội Câu lạc bộ" },
      sourceUrl: `${SOCIAL}/psyche-club`,
      kind: "photo"
    }]
  },
  "hn-mc": {
    officialName: "RMIT MC Club",
    sourceUrl: `${SOCIAL}/rmit-mc-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Social and Special Interest", vi: "Xã hội và Sở thích đặc biệt" },
    summary: {
      en: "Find your voice through hosting, public speaking and behind-the-scenes media work.",
      vi: "Phát huy tiếng nói của bạn qua dẫn chương trình, diễn thuyết trước công chúng và công việc truyền thông hậu trường."
    },
    about: [{
      en: "RMIT MC Club supports students interested in voice training, hosting and public speaking. Alongside performance opportunities, members develop scriptwriting, news-editing and media-production skills through workshops, mentoring and practice.",
      vi: "RMIT MC Club hỗ trợ sinh viên yêu thích luyện giọng, dẫn chương trình và diễn thuyết trước công chúng. Bên cạnh cơ hội biểu diễn, thành viên phát triển kỹ năng viết kịch bản, biên tập tin và sản xuất truyền thông qua các buổi học, hướng dẫn và thực hành."
    }],
    activities: [
      { en: "Voice, hosting and public-presence workshops, mentoring and practice sessions.", vi: "Các buổi học, hướng dẫn và thực hành về giọng nói, dẫn chương trình và phong thái trước công chúng." },
      { en: "RMCC News Report video series promoting activities with campus clubs and departments.", vi: "Chuỗi video RMCC News Report giới thiệu hoạt động cùng các câu lạc bộ và phòng ban trong trường." },
      { en: "RMCC Talkshow about a professional MC's career, listed as upcoming on the official page without a date.", vi: "RMCC Talkshow về hành trình nghề nghiệp của MC chuyên nghiệp, được trang chính thức giới thiệu là sắp diễn ra nhưng chưa ghi ngày." }
    ],
    contactEmail: "rmcclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/profile.php?id=61584998093253",
    instagramUrl: null,
    otherLinks: [],
    images: [{
      url: `${PHOTOS}/mc-club/rmit-hanoi-mc-club.png`,
      alt: { en: "RMIT MC Club members holding their club banner in a classroom", vi: "Thành viên RMIT MC Club cầm cờ câu lạc bộ trong phòng học" },
      sourceUrl: `${SOCIAL}/rmit-mc-club`,
      kind: "photo"
    }],
    sourceNotes: {
      en: "The official page displays rmcclub.hn@rmit.edu.vn but its email hyperlink incorrectly targets Queer & Alliance Club. The displayed MC Club address is used here.",
      vi: "Trang chính thức hiển thị rmcclub.hn@rmit.edu.vn nhưng liên kết email lại trỏ nhầm tới Câu lạc bộ Queer & Alliance. Hồ sơ sử dụng địa chỉ hiển thị của MC Club."
    }
  },
  "hn-rqac": {
    officialName: "RMIT Queer & Alliance Club",
    sourceUrl: `${SOCIAL}/rmit-queer-alliance-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Social and Special Interest", vi: "Xã hội và Sở thích đặc biệt" },
    summary: {
      en: "A welcoming community for LGBTQIA+ students and allies to connect, learn and explore identity.",
      vi: "Cộng đồng chào đón sinh viên LGBTQIA+ và những người đồng hành để kết nối, học hỏi và khám phá bản sắc."
    },
    about: [{
      en: "RQAC fosters a safe, welcoming and informative environment for LGBTQIA+ members and allies. Students can explore their identities, form connections and build values that contribute to RMIT and wider society.",
      vi: "RQAC xây dựng môi trường an toàn, cởi mở và giàu thông tin cho thành viên LGBTQIA+ cùng những người đồng hành. Sinh viên có thể khám phá bản sắc, tạo dựng kết nối và nuôi dưỡng các giá trị đóng góp cho RMIT cũng như xã hội."
    }],
    activities: [
      { en: "Internal sharing sessions on personal stories and LGBTQ+ history, society and law in Vietnam, including documentary viewing.", vi: "Các buổi chia sẻ nội bộ về câu chuyện cá nhân và lịch sử, xã hội, pháp luật liên quan đến LGBTQ+ tại Việt Nam, kết hợp xem phim tài liệu." },
      { en: "Palettes of Pride arts and crafts: bracelet-making, self-portraits and letter writing.", vi: "Hoạt động nghệ thuật Palettes of Pride: làm vòng tay, vẽ chân dung tự họa và viết thư." },
      { en: "Serenity interactive Pride Week exhibition with Student Council and Me The0rem science fair with Psyche Club.", vi: "Triển lãm tương tác Serenity trong Tuần lễ Tự hào cùng Hội đồng Sinh viên và hội chợ khoa học Me The0rem cùng Psyche Club." }
    ],
    contactEmail: "rqaclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/rqachanoi",
    instagramUrl: null,
    otherLinks: [],
    images: [{
      url: `${RECENT_PHOTOS}/rqac-club-students.jpg`,
      alt: { en: "RMIT Queer & Alliance Club group photograph at an induction session", vi: "Ảnh tập thể Câu lạc bộ Queer & Alliance RMIT trong buổi chào đón thành viên" },
      sourceUrl: `${SOCIAL}/rmit-queer-alliance-club`,
      kind: "photo"
    }]
  },
  "hn-sife": {
    officialName: "SIFE Club",
    sourceUrl: `${SOCIAL}/sife-club`,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Social and Special Interest", vi: "Xã hội và Sở thích đặc biệt" },
    summary: {
      en: "Apply business knowledge to real community needs through social-impact projects and student-led events.",
      vi: "Ứng dụng kiến thức kinh doanh vào nhu cầu thực tế của cộng đồng qua dự án tác động xã hội và sự kiện do sinh viên tổ chức."
    },
    about: [{
      en: "Student In Free Enterprise Club brings students together to apply business knowledge in real-life situations. Its community combines a head for business with a heart for the world, using enterprise and creativity to support positive change.",
      vi: "Student In Free Enterprise Club kết nối sinh viên để ứng dụng kiến thức kinh doanh vào tình huống thực tế. Cộng đồng kết hợp tư duy kinh doanh với tấm lòng vì xã hội, sử dụng tinh thần khởi nghiệp và sáng tạo để thúc đẩy thay đổi tích cực."
    }],
    activities: [
      { en: "Peaking Point social marketing competition, including the 2024 edition on preserving Vietnamese traditional performing arts.", vi: "Cuộc thi tiếp thị xã hội Peaking Point, trong đó mùa 2024 tập trung bảo tồn nghệ thuật biểu diễn truyền thống Việt Nam." },
      { en: "Dear Tet exhibition fair supporting social enterprises and Wishing Paws projects with animal rescue shelters.", vi: "Hội chợ triển lãm Dear Tet hỗ trợ doanh nghiệp xã hội và dự án Wishing Paws cùng các trạm cứu hộ động vật." },
      { en: "The Yarn Project for personal connection and Haunted House role-playing escape-room events.", vi: "Dự án Yarn tạo kết nối cá nhân và sự kiện Haunted House với trò chơi nhập vai giải đố thoát hiểm." }
    ],
    contactEmail: "sifeclub.hn@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/sifermithn/",
    instagramUrl: null,
    otherLinks: [],
    images: [
      {
        url: `${RECENT_PHOTOS}/sife-club.jpg`,
        alt: { en: "SIFE Hanoi members holding the club's yellow banner", vi: "Thành viên SIFE Hà Nội cầm lá cờ vàng của câu lạc bộ" },
        sourceUrl: `${SOCIAL}/sife-club`,
        kind: "photo"
      },
      {
        url: `${PHOTOS}/sife-club/students-at-the-sife-club-booth.jpg`,
        alt: { en: "SIFE Club students at their campus booth", vi: "Sinh viên SIFE tại gian hàng câu lạc bộ trong trường" },
        sourceUrl: `${SOCIAL}/sife-club`,
        kind: "photo"
      },
    ]
  }
};
