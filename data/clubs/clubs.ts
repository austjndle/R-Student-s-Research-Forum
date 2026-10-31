import officialPageMetadata from "./official-pages.json";
export type ClubCampus = "saigon_south" | "hanoi";
export type ClubCategory = "academic" | "active" | "creative_collectives" | "social_special_interest";
export type ClubDetailsStatus = "verified_detail" | "directory_only";
export interface ClubRecord {
  id: string;
  nameEn: string;
  nameVi: string;
  campus: ClubCampus;
  category: ClubCategory;
  descriptionEn?: string;
  descriptionVi?: string;
  contactEmail?: string;
  officialClubUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  sourceUrl: string;
  campusListPdfUrl: string;
  lastVerifiedDate: string;
  detailsStatus: ClubDetailsStatus;
}

const VERIFIED_ON = "2026-10-31";
const SGS_DIRECTORY = "https://www.rmit.edu.vn/students/campus-life/clubs";
const HANOI_DIRECTORY = "https://www.rmit.edu.vn/students/campus-life/clubs";
const SGS_PDF = "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/documents/pdfs/students/student-clubs/saigon-south-club-list.pdf";
const HANOI_PDF = "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/documents/pdfs/students/student-clubs/hn-club-list.pdf";

interface ClubSeed {
  id: string;
  name: string;
  campus: ClubCampus;
  category: ClubCategory;
  sourceUrl: string;
  pdfUrl: string;
  descriptionEn?: string;
  contactEmail?: string;
  officialClubUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
}

const OFFICIAL_PAGE_BY_URL = new Map(officialPageMetadata.map((page) => [page.url, page]));

function makeClub(seed: ClubSeed): ClubRecord {
  const metadata = seed.officialClubUrl ? OFFICIAL_PAGE_BY_URL.get(seed.officialClubUrl) : undefined;
  const publicEmails = metadata?.emails.filter((email) => email.endsWith("@rmit.edu.vn") && !email.includes("webrmit") && !email.includes("david.holinger")) ?? [];
  const publicSocial = metadata?.social.filter((url) => {
    const normalizedUrl = url.toLowerCase();
    return !normalizedUrl.includes("rmituniversityvietnam") && !normalizedUrl.includes("rmitvn");
  }) ?? [];

  return {
    id: seed.id,
    nameEn: seed.name,
    nameVi: seed.name,
    campus: seed.campus,
    category: seed.category,
    descriptionEn: seed.descriptionEn ?? (metadata?.description || undefined),
    contactEmail: seed.contactEmail ?? publicEmails[0],
    officialClubUrl: seed.officialClubUrl,
    facebookUrl: publicSocial.find((url) => url.toLowerCase().includes("facebook.com"))?.replace(/\/$/, ""),
    instagramUrl: publicSocial.find((url) => url.toLowerCase().includes("instagram.com"))?.replace(/\/$/, ""),
    imageUrl: seed.imageUrl ?? (metadata?.imageUrl || undefined),
    imageAlt: seed.imageAlt ?? (metadata?.imageAlt || `${seed.name} official club logo`),
    sourceUrl: seed.sourceUrl,
    campusListPdfUrl: seed.pdfUrl,
    lastVerifiedDate: VERIFIED_ON,
    detailsStatus: metadata?.status === 200 || seed.descriptionEn ? "verified_detail" : "directory_only",
  };
}


const SGS_ACADEMIC = `${SGS_DIRECTORY}/saigon-south-campus-clubs/academic-clubs`;
const SGS_ACTIVE = `${SGS_DIRECTORY}/saigon-south-campus-clubs/active-clubs`;
const SGS_CREATIVE = `${SGS_DIRECTORY}/saigon-south-campus-clubs/creative-collectives-clubs`;
const SGS_SOCIAL = `${SGS_DIRECTORY}/saigon-south-campus-clubs/social-and-special-interest-clubs`;
const HANOI_ACADEMIC = `${HANOI_DIRECTORY}/hanoi-city-campus-clubs/academic-clubs`;
const HANOI_ACTIVE = `${HANOI_DIRECTORY}/hanoi-city-campus-clubs/active-clubs`;
const HANOI_CREATIVE = `${HANOI_DIRECTORY}/hanoi-city-campus-clubs/creative-collective-clubs`;
const HANOI_SOCIAL = `${HANOI_DIRECTORY}/hanoi-city-campus-clubs/social-and-special-interest-clubs`;

export const VERIFIED_CLUBS: ClubRecord[] = [
  makeClub({ id: "sgs-analytics", name: "Analytics Club", campus: "saigon_south", category: "academic", sourceUrl: SGS_ACADEMIC, pdfUrl: SGS_PDF, contactEmail: "analyticsclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACADEMIC}/analytics-club`, descriptionEn: "Supports students exploring business analytics, personal development and belonging through a student community." }),
  makeClub({ id: "sgs-business", name: "Business Club", campus: "saigon_south", category: "academic", sourceUrl: SGS_ACADEMIC, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACADEMIC}/business-club`, descriptionEn: "Hosts workshops including business etiquette, time management, franchising and branding." }),
  makeClub({ id: "sgs-economics", name: "Economics Club", campus: "saigon_south", category: "academic", sourceUrl: SGS_ACADEMIC, pdfUrl: SGS_PDF, contactEmail: "economicsclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACADEMIC}/economics-club`, descriptionEn: "Makes economics more accessible and engaging for the RMIT community." }),
  makeClub({ id: "sgs-fintech", name: "FinTech Club", campus: "saigon_south", category: "academic", sourceUrl: SGS_ACADEMIC, pdfUrl: SGS_PDF, contactEmail: "fintechclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACADEMIC}/fintech-club`, descriptionEn: "Student-led FinTech community for students interested in startups, finance and innovative technology." }),
  makeClub({ id: "sgs-finance", name: "Finance Club", campus: "saigon_south", category: "academic", sourceUrl: SGS_ACADEMIC, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACADEMIC}/finance-club`, descriptionEn: "Creates a space for Economics and Finance students to connect and discuss their discipline." }),
  makeClub({ id: "sgs-golden-flames", name: "Golden Flames Competition Club", campus: "saigon_south", category: "academic", sourceUrl: SGS_ACADEMIC, pdfUrl: SGS_PDF, contactEmail: "gfcompetitionclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACADEMIC}/golden-flames-competition-club`, descriptionEn: "Connects RMIT students with peers and resources for university-level competitions." }),
  makeClub({ id: "sgs-debate", name: "Debate Club", campus: "saigon_south", category: "academic", sourceUrl: SGS_ACADEMIC, pdfUrl: SGS_PDF, contactEmail: "debateclub.sgs@rmit.edu.vn" }),
  makeClub({ id: "sgs-rise", name: "Innovation and Social Entrepreneurship", campus: "saigon_south", category: "academic", sourceUrl: SGS_ACADEMIC, pdfUrl: SGS_PDF, contactEmail: "riseclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACADEMIC}/innovation-social-entrepreneurship`, descriptionEn: "A community for young leaders interested in entrepreneurship and social innovation." }),
  makeClub({ id: "sgs-logistics", name: "Logistics Club", campus: "saigon_south", category: "academic", sourceUrl: SGS_ACADEMIC, pdfUrl: SGS_PDF, contactEmail: "logisticsclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACADEMIC}/logistics-club`, descriptionEn: "Connects students interested in Logistics and Supply Chain." }),
  makeClub({ id: "sgs-neo-culture-tech", name: "Neo Culture Tech Club", campus: "saigon_south", category: "academic", sourceUrl: SGS_ACADEMIC, pdfUrl: SGS_PDF, contactEmail: "neoculturetechclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACADEMIC}/neoculture-tech-club`, descriptionEn: "A community fueled by passion for technology and innovation." }),
  makeClub({ id: "sgs-tourism-hospitality", name: "Tourism and Hospitality Club", campus: "saigon_south", category: "academic", sourceUrl: SGS_ACADEMIC, pdfUrl: SGS_PDF, contactEmail: "tnhclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACADEMIC}/tourism-and-hospitality-club`, descriptionEn: "Supports students developing leadership through experiential communication and hospitality activities." }),

  makeClub({ id: "sgs-aikido", name: "Aikido Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, contactEmail: "aikidoclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACTIVE}/aikido-club`, descriptionEn: "Inclusive community focused on physical health, mindfulness and personal development." }),
  makeClub({ id: "sgs-badminton", name: "Badminton Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACTIVE}/badminton-club`, descriptionEn: "Opportunities to develop badminton skills, meet friends and improve fitness." }),
  makeClub({ id: "sgs-basketball-female", name: "Basketball Club (Female)", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACTIVE}/basketball-club-female`, descriptionEn: "A playground for students who share an interest in basketball." }),
  makeClub({ id: "sgs-basketball-male", name: "Basketball Club (Male)", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, contactEmail: "rmitvnbasketball", officialClubUrl: `${SGS_ACTIVE}/basketball-club-male`, descriptionEn: "A healthy playground for students to develop fitness and basketball skills." }),
  makeClub({ id: "sgs-billiards", name: "Billiards Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, contactEmail: "billiardsclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACTIVE}/billiards-club`, descriptionEn: "Builds a community around billiards and supports members aiming for higher levels of participation." }),
  makeClub({ id: "sgs-brazilian-jiujitsu", name: "Brazilian Jiu-Jitsu Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, contactEmail: "jiujitsuclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACTIVE}/brazilian-jiu-jitsu-club`, descriptionEn: "A safe and friendly environment to learn Brazilian Jiu-Jitsu; everyone is welcome." }),
  makeClub({ id: "sgs-cheerleading", name: "Cheerleading Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACTIVE}/cheerleading-club`, descriptionEn: "Represents RMIT Vietnam through competitions and events while promoting school spirit and unity." }),
  makeClub({ id: "sgs-flag-football", name: "Flag Football Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACTIVE}/flag-football-club`, descriptionEn: "Combines the competitiveness and fun of American football without the roughness of tackles." }),
  makeClub({ id: "sgs-football", name: "Football Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACTIVE}/football-club`, descriptionEn: "A community for students who share Vietnam's passion for football." }),
  makeClub({ id: "sgs-judo", name: "Judo Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, contactEmail: "judoclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACTIVE}/judo-club`, descriptionEn: "Builds courage, respect, motivation and social connections through Judo." }),
  makeClub({ id: "sgs-mma", name: "MMA Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACTIVE}/mma-club`, descriptionEn: "A mixed martial arts community covering techniques from multiple fighting styles." }),
  makeClub({ id: "sgs-pickleball", name: "Pickleball Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, contactEmail: "pickleballclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACTIVE}/pickleball-club`, descriptionEn: "Introduces and promotes pickleball within the RMIT community." }),
  makeClub({ id: "sgs-shinsei-kendo", name: "Shinsei Kendo Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, contactEmail: "shinseikendoclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACTIVE}/shinsei-kendo-club`, descriptionEn: "Welcoming community for students who share a love of Kendo." }),
  makeClub({ id: "sgs-strength", name: "Strength Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, contactEmail: "strengthclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_ACTIVE}/strength-club`, descriptionEn: "Community for strength improvement, injury prevention and physical performance." }),
  makeClub({ id: "sgs-taekwondo", name: "Taekwondo Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACTIVE}/taekwondo-club`, descriptionEn: "A place for Taekwondoists of all abilities to train and build community." }),
  makeClub({ id: "sgs-tennis", name: "Tennis Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACTIVE}/tennis-club`, descriptionEn: "Provides opportunities for tennis players to play and improve their skills." }),
  makeClub({ id: "sgs-ultimate-frisbee", name: "Ultimate Frisbee Club", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACTIVE}/ultimate-frisbee-club`, descriptionEn: "Mixed-gender sport focused on teamwork and participation." }),
  makeClub({ id: "sgs-volleyball-female", name: "Volleyball Club (Female)", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACTIVE}/volleyball-club-female`, descriptionEn: "Provides female students and staff social and physical benefits through volleyball." }),
  makeClub({ id: "sgs-volleyball-male", name: "Volleyball Club (Male)", campus: "saigon_south", category: "active", sourceUrl: SGS_ACTIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_ACTIVE}/volleyball-club-male`, descriptionEn: "A community for people interested in volleyball to share and enjoy the sport." }),

  makeClub({ id: "sgs-dance", name: "Dance Club", campus: "saigon_south", category: "creative_collectives", sourceUrl: SGS_CREATIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_CREATIVE}/dance-club`, descriptionEn: "Professional Hip-hop and Modern Dance training for students." }),
  makeClub({ id: "sgs-fashion", name: "Fashion Club", campus: "saigon_south", category: "creative_collectives", sourceUrl: SGS_CREATIVE, pdfUrl: SGS_PDF, contactEmail: "fashionclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_CREATIVE}/fashion-club`, descriptionEn: "A community for fashion enthusiasts with a focus on connection and sustainability." }),
  makeClub({ id: "sgs-marcom", name: "Marketing and Communications Club", campus: "saigon_south", category: "creative_collectives", sourceUrl: SGS_CREATIVE, pdfUrl: SGS_PDF, contactEmail: "marcommclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_CREATIVE}/marketing-and-communications-club`, descriptionEn: "Creates marketing and communications projects and events for members to practise skills." }),
  makeClub({ id: "sgs-mass-media", name: "Mass Media Club", campus: "saigon_south", category: "creative_collectives", sourceUrl: SGS_CREATIVE, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_CREATIVE}/mass-media-club`, descriptionEn: "For students interested in photography, critical thinking, writing and public speaking." }),
  makeClub({ id: "sgs-music", name: "Music Club - Saigon South", campus: "saigon_south", category: "creative_collectives", sourceUrl: SGS_CREATIVE, pdfUrl: SGS_PDF, contactEmail: "rmitsgsmusicclub", officialClubUrl: `${SGS_CREATIVE}/music-club`, descriptionEn: "Opportunities for music lovers to share, improve and experiment with music." }),

  makeClub({ id: "sgs-boardgames", name: "Boardgames Club", campus: "saigon_south", category: "social_special_interest", sourceUrl: SGS_SOCIAL, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_SOCIAL}/boardgames-club`, descriptionEn: "Builds critical thinking through board games, workshops and competitions." }),
  makeClub({ id: "sgs-enactus", name: "Enactus RMIT Vietnam", campus: "saigon_south", category: "social_special_interest", sourceUrl: SGS_SOCIAL, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_SOCIAL}/enactus-rmit-vietnam`, descriptionEn: "A non-profit community applying business knowledge to make a difference." }),
  makeClub({ id: "sgs-green-generation", name: "Green Generation Club", campus: "saigon_south", category: "social_special_interest", sourceUrl: SGS_SOCIAL, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_SOCIAL}/green-generation-club`, descriptionEn: "Nurtures a love of nature, adventure and environmental awareness." }),
  makeClub({ id: "sgs-international", name: "International Club", campus: "saigon_south", category: "social_special_interest", sourceUrl: SGS_SOCIAL, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_SOCIAL}/international-club`, descriptionEn: "Helps international students adapt, understand and get involved in their new environment." }),
  makeClub({ id: "sgs-japanese-culture", name: "Japanese Culture Club", campus: "saigon_south", category: "social_special_interest", sourceUrl: SGS_SOCIAL, pdfUrl: SGS_PDF, officialClubUrl: `${SGS_SOCIAL}/japanese-culture-club`, descriptionEn: "Promotes Japanese culture across RMIT University." }),
  makeClub({ id: "sgs-mind", name: "Mind Club", campus: "saigon_south", category: "social_special_interest", sourceUrl: SGS_SOCIAL, pdfUrl: SGS_PDF, contactEmail: "mindclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_SOCIAL}/mind-club`, descriptionEn: "Creates community for positive socialisation, self-understanding and psychology in daily life." }),
  makeClub({ id: "sgs-postgraduate", name: "Postgraduate Club", campus: "saigon_south", category: "social_special_interest", sourceUrl: SGS_SOCIAL, pdfUrl: SGS_PDF, contactEmail: "postgraduateclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_SOCIAL}/postgraduate-club`, descriptionEn: "Inclusive community for postgraduate students to socialise and share experiences." }),
  makeClub({ id: "sgs-pride", name: "Pride Club", campus: "saigon_south", category: "social_special_interest", sourceUrl: SGS_SOCIAL, pdfUrl: SGS_PDF, contactEmail: "prideclub.sgs@rmit.edu.vn", officialClubUrl: `${SGS_SOCIAL}/pride-club`, descriptionEn: "LGBTQIA+ and allies collective dedicated to inclusion on campus." }),

  makeClub({ id: "hn-business-finance", name: "Business and Finance Club", campus: "hanoi", category: "academic", sourceUrl: HANOI_ACADEMIC, pdfUrl: HANOI_PDF, contactEmail: "businessclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_ACADEMIC}/business-finance-club`, descriptionEn: "Promotes a professional business environment and shares business knowledge with RMIT students." }),
  makeClub({ id: "hn-innovation-entrepreneurship", name: "Innovation and Entrepreneurship Club", campus: "hanoi", category: "academic", sourceUrl: HANOI_ACADEMIC, pdfUrl: HANOI_PDF, contactEmail: "ieclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_ACADEMIC}/innovation-and-entrepreneurship-club`, descriptionEn: "Empowers students to become innovative and entrepreneurial leaders through real-life experiences." }),
  makeClub({ id: "hn-basketball", name: "Basketball Club", campus: "hanoi", category: "active", sourceUrl: HANOI_ACTIVE, pdfUrl: HANOI_PDF, contactEmail: "basketballclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_ACTIVE}/basketball-club`, descriptionEn: "A healthy playground for students to develop fitness and basketball skills." }),
  makeClub({ id: "hn-football", name: "Football Club", campus: "hanoi", category: "active", sourceUrl: HANOI_ACTIVE, pdfUrl: HANOI_PDF, contactEmail: "footballclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_ACTIVE}/football-club`, descriptionEn: "A community for students who share Vietnam's passion for football." }),
  makeClub({ id: "hn-cineverse", name: "Cineverse Club", campus: "hanoi", category: "creative_collectives", sourceUrl: HANOI_CREATIVE, pdfUrl: HANOI_PDF, contactEmail: "cineverseclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_CREATIVE}/current-media-club`, imageUrl: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/hanoi-campus-clubs/hanoi-club-logos-2021/logos/sports-and-arts-clubs/cineverse-logo.jpg", imageAlt: "Cineverse Club official logo", descriptionEn: "Nurtures creativity and connects individuals who share a love for film." }),
  makeClub({ id: "hn-current-media", name: "Current Media Club", campus: "hanoi", category: "creative_collectives", sourceUrl: HANOI_CREATIVE, pdfUrl: HANOI_PDF, contactEmail: "currentmedia.hn@rmit.edu.vn", officialClubUrl: `${HANOI_CREATIVE}/current-media-club`, descriptionEn: "Creates positive impact through print, exhibitions, workshops and other art forms." }),
  makeClub({ id: "hn-dance", name: "Dance Club", campus: "hanoi", category: "creative_collectives", sourceUrl: HANOI_CREATIVE, pdfUrl: HANOI_PDF, contactEmail: "danceclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_CREATIVE}/dance-club`, descriptionEn: "Provides opportunities for students interested in dance to shine on stage." }),
  makeClub({ id: "hn-music", name: "Music Club", campus: "hanoi", category: "creative_collectives", sourceUrl: HANOI_CREATIVE, pdfUrl: HANOI_PDF, contactEmail: "musicclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_CREATIVE}/music-club`, descriptionEn: "Organises workshops, music events and training classes." }),
  makeClub({ id: "hn-musical-theatre", name: "Musical Theatre Club", campus: "hanoi", category: "creative_collectives", sourceUrl: HANOI_CREATIVE, pdfUrl: HANOI_PDF, contactEmail: "mtclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_CREATIVE}/musical-theatre-club`, descriptionEn: "Inclusive community for students passionate about musical theatre." }),
  makeClub({ id: "hn-photography", name: "Photography Club", campus: "hanoi", category: "creative_collectives", sourceUrl: HANOI_CREATIVE, pdfUrl: HANOI_PDF, contactEmail: "photographyclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_CREATIVE}/photography-club`, descriptionEn: "Connects people who share a love of movies, photography and digital media." }),
  makeClub({ id: "hn-charity-environment", name: "Charity and Environment Club", campus: "hanoi", category: "social_special_interest", sourceUrl: HANOI_SOCIAL, pdfUrl: HANOI_PDF, contactEmail: "ceclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_SOCIAL}/charity-and-environment-club`, descriptionEn: "Connects volunteers to form an energetic, creative and responsible group." }),
  makeClub({ id: "hn-event", name: "Event Club", campus: "hanoi", category: "social_special_interest", sourceUrl: HANOI_SOCIAL, pdfUrl: HANOI_PDF, contactEmail: "eventclub.rmithn@rmit.edu.vn", officialClubUrl: `${HANOI_SOCIAL}/event-club`, descriptionEn: "Gives students experience in event planning through a community that hosts events." }),
  makeClub({ id: "hn-japanese-culture", name: "Japanese Culture Club - Hanoi", campus: "hanoi", category: "social_special_interest", sourceUrl: HANOI_SOCIAL, pdfUrl: HANOI_PDF, contactEmail: "jcclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_SOCIAL}/japanese-culture-club`, descriptionEn: "Shares Japanese culture with the RMIT student community through engaging events." }),
  makeClub({ id: "hn-psyche", name: "Psyche Club", campus: "hanoi", category: "social_special_interest", sourceUrl: HANOI_SOCIAL, pdfUrl: HANOI_PDF, contactEmail: "psycheclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_SOCIAL}/psyche-club`, descriptionEn: "Aims to make Psychology more accessible to everyone." }),
  makeClub({ id: "hn-mc", name: "RMIT MC Club", campus: "hanoi", category: "social_special_interest", sourceUrl: HANOI_SOCIAL, pdfUrl: HANOI_PDF, officialClubUrl: `${HANOI_SOCIAL}/rmit-mc-club`, descriptionEn: "Community for students passionate about voice training, hosting and public speaking." }),
  makeClub({ id: "hn-rqac", name: "RMIT Queer & Alliance Club", campus: "hanoi", category: "social_special_interest", sourceUrl: HANOI_SOCIAL, pdfUrl: HANOI_PDF, contactEmail: "rqaclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_SOCIAL}/rmit-queer-alliance-club`, descriptionEn: "Safe, welcoming and informative community for LGBTQIA+ members and allies." }),
  makeClub({ id: "hn-sife", name: "SIFE Club", campus: "hanoi", category: "social_special_interest", sourceUrl: HANOI_SOCIAL, pdfUrl: HANOI_PDF, contactEmail: "sifeclub.hn@rmit.edu.vn", officialClubUrl: `${HANOI_SOCIAL}/sife-club`, descriptionEn: "Develops realistic business projects that positively impact vulnerable communities." }),
];

export function getVerifiedClubs(): ClubRecord[] {
  return VERIFIED_CLUBS;
}

export function getClubCountsByCampus(): Record<ClubCampus, number> {
  return {
    saigon_south: VERIFIED_CLUBS.filter((club) => club.campus === "saigon_south").length,
    hanoi: VERIFIED_CLUBS.filter((club) => club.campus === "hanoi").length,
  };
}
