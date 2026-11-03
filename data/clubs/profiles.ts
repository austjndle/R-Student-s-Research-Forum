import type { ClubProfile } from "./profile-types";
import { SGS_ACTIVE_PROFILES } from "./profiles-sgs-active";
import { SGS_COMMUNITY_PROFILES } from "./profiles-sgs-community";
import { HANOI_PROFILES } from "./profiles-hanoi";

const kendoSource = "https://www.rmit.edu.vn/students/campus-life/clubs/saigon-south-campus-clubs/active-clubs/shinsei-kendo-club";

export const CLUB_PROFILES: Record<string, ClubProfile> = {
  ...SGS_ACTIVE_PROFILES,
  ...SGS_COMMUNITY_PROFILES,
  ...HANOI_PROFILES,
  "sgs-shinsei-kendo": {
    officialName: "Shinsei Kendo Club",
    sourceUrl: kendoSource,
    verifiedAt: "2026-11-02",
    officialCategory: { en: "Sports", vi: "Thể thao" },
    summary: {
      en: "An inclusive community for people who love Kendo, continuing RMIT's Kendo tradition.",
      vi: "Cộng đồng cởi mở dành cho những người yêu Kendo, tiếp nối truyền thống Kendo tại RMIT.",
    },
    about: [{
      en: "Shinsei continues the legacy of the former RMIT Kendo Club. The club brings people together through a shared interest in Kendo, with an emphasis on inclusion and a goal of earning recognition and achievements within the Kendo community.",
      vi: "Shinsei tiếp nối truyền thống của CLB Kendo trước đây tại RMIT. CLB kết nối những người cùng yêu thích Kendo, xây dựng cộng đồng hòa nhập và hướng tới sự ghi nhận cùng thành tích trong cộng đồng Kendo.",
    }],
    activities: [],
    contactEmail: "shinseikendoclub@rmit.edu.vn",
    facebookUrl: "https://www.facebook.com/rmitshinsei",
    instagramUrl: null,
    otherLinks: [],
    images: [{
      url: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/images/vn-student-life-clubs-activities/saigon-south-campus-clubs/shinsei-kendo/group-of-people-posing-with-shinsei-kendo-club-logo.jpg",
      alt: {
        en: "Members and guests gathered with the Shinsei Kendo Club banner",
        vi: "Thành viên và khách mời chụp ảnh cùng biểu ngữ Shinsei Kendo Club",
      },
      sourceUrl: kendoSource,
      kind: "photo",
    }],
  },
};
