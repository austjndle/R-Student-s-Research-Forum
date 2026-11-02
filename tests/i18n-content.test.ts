import { describe, expect, it } from "vitest";
import { translations } from "../lib/i18n/translations";
import { RMIT_CAMPUS_HOURS, getLocalizedFloorLabel, getLocalizedScheduleLabel } from "../data/facilities/campusHours";
import { buildGlobalExperienceContext, formatGlobalExperienceFallback, isGlobalExperienceQuery } from "../lib/ai/gemini";
import { EMAIL_TEMPLATES } from "../data/templates/emailTemplates";
import { GLOBAL_EXPERIENCE_OFFICIAL_REFERENCES, GLOBAL_EXPERIENCE_PROGRAMS, getApplicationCycleStatus } from "../data/guides/globalExperience";
import { getPublishedCalendarEntries } from "../data/events/calendar";
describe("English/Vietnamese interface copy", () => {
  it("provides localized shared navigation, loading, support, and page-copy labels", () => {
    expect(translations.en.common.skipToContent).toBe("Skip to main content");
    expect(translations.vi.common.skipToContent).toBe("Bỏ qua để đến nội dung chính");
    expect(translations.en.search.loading).toBe("Loading search...");
    expect(translations.vi.search.loading).toBe("Đang tải kết quả tìm kiếm...");
    expect(translations.en.support.tooltip).toBe("Support this project");
    expect(translations.vi.support.tooltip).toBe("Ủng hộ dự án này");
    expect(translations.en.aboutPage.title).toBe("About R-Students' Research Forum");
    expect(translations.vi.privacyPage.title).toBe("Chính sách quyền riêng tư");
  });
  it("uses compact support labels without changing modal copy", () => {
    expect(translations.en.support.shortLink).toBe("Support");
    expect(translations.vi.support.shortLink).toBe("Ủng hộ");
    expect(translations.en.support.title).toBe("Support R-Students ☕");
    expect(translations.vi.support.title).toBe("Ủng hộ R-Students ☕");
    expect(translations.en.support.description).toBe("Enjoying R-Students' Research Hub? You can buy me a coffee to help maintain and improve this independent student project. Every contribution is completely voluntary.");
    expect(translations.vi.support.description).toBe("Nếu R-Students' Research Hub hữu ích với bạn, bạn có thể ủng hộ mình một ly cà phê để giúp duy trì và phát triển dự án. Mọi đóng góp đều hoàn toàn tự nguyện.");
  });
  it("uses the requested footer slogan in both locales", () => {
    expect(translations.en.footer.creatorSlogan).toBe("💔 Built by students, powered by stress.");
    expect(translations.vi.footer.creatorSlogan).toBe("💔 Built by students, powered by stress.");
  });
  it("uses one-word English navbar labels and concise Vietnamese labels", () => {
    expect([
      translations.en.nav.home,
      translations.en.nav.calendar,
      translations.en.nav.events,
      translations.en.nav.clubs,
      translations.en.nav.guides,
      translations.en.nav.campusHours,
      translations.en.nav.topics,
      translations.en.nav.contacts,
    ]).toEqual(["Home", "Calendar", "Events", "Clubs", "Guides", "Hours", "Topics", "Contacts"]);
    expect([
      translations.vi.nav.home,
      translations.vi.nav.calendar,
      translations.vi.nav.events,
      translations.vi.nav.clubs,
      translations.vi.nav.guides,
      translations.vi.nav.campusHours,
      translations.vi.nav.topics,
      translations.vi.nav.contacts,
    ]).toEqual(["Trang chủ", "Lịch", "Sự kiện", "CLB", "Hướng dẫn", "Giờ mở cửa", "Chủ đề", "Danh bạ"]);
    expect(translations.en.nav.accessibleLabels.events).toBe("Campus Events");
    expect(translations.vi.nav.accessibleLabels.clubs).toBe("Câu lạc bộ sinh viên");
  });

  it("renders Campus Hours status and floor labels in the selected language", () => {
    const building = RMIT_CAMPUS_HOURS.find((item) => item.id === "sgs-b1");
    expect(building).toBeDefined();
    const firstFloor = building!.floors[0];
    expect(getLocalizedScheduleLabel(firstFloor, "sundayHours", "en")).toBe("Closed (except for university events)");
    expect(getLocalizedScheduleLabel(firstFloor, "sundayHours", "vi")).toBe("Đóng cửa (Ngoại trừ sự kiện của trường)");
    expect(getLocalizedFloorLabel(firstFloor, "en")).toBe("Level 1 (Main foyer)");
    expect(getLocalizedFloorLabel(firstFloor, "vi")).toBe("Tầng 1 (Sảnh chính)");
    expect(getLocalizedScheduleLabel(building!.floors[2], "saturdayHours", "en")).toBe("08:00 - 17:00");
  });
  it("keeps translated event descriptions free of English-only wording", () => {
    const events = getPublishedCalendarEntries();
    for (const id of ["rmit-sustainability-week-2026-saigon-south", "rmit-sustainability-week-2026-hanoi", "rmit-deloitte-hr-roundtable-2026", "rmit-experience-day-2026-hanoi", "rmit-experience-day-2026-saigon-south"]) {
      const event = events.find((entry) => entry.id === id);
      expect(event?.descriptionVi).toBeDefined();
      expect(event?.descriptionVi).not.toMatch(/\b(workshops?|cultural debt)\b/i);
    }
  });
});

describe("Translated email template content", () => {
  it("keeps Vietnamese email templates in Vietnamese", () => {
    for (const template of EMAIL_TEMPLATES) {
      expect(template.subjectVi).not.toMatch(/\b(Request|Feedback|Clarification|Group Work)\b/i);
      expect(template.bodyVi).toMatch(/Kính gửi/);
      expect(template.bodyVi).not.toMatch(/\bDear\b|\bI hope\b|\bI am writing\b|\bKind regards\b|\bSincerely\b/i);
    }
  });
});
describe("Global Experience source localization", () => {
  it("provides Vietnamese labels for Global Experience source links", () => {
    expect(GLOBAL_EXPERIENCE_OFFICIAL_REFERENCES.every((reference) => Boolean(reference.titleVi))).toBe(true);
    expect(GLOBAL_EXPERIENCE_OFFICIAL_REFERENCES.find((reference) => reference.url.includes("partner-exchange-list"))?.titleVi)
      .toBe("Danh sách Partner Exchange hiện tại trên Mobi");
  });
});

describe("Global Experience retrieval grounding", () => {
  it("recognizes natural English and Vietnamese exchange queries", () => {
    expect(isGlobalExperienceQuery("How can I study abroad from RMIT?" )).toBe(true);
    expect(isGlobalExperienceQuery("Mình muốn trao đổi ở Singapore" )).toBe(true);
  });

  it("selects only the named pathway and attaches its official portal", () => {
    const context = buildGlobalExperienceContext("How do I apply for Cross-campus at RMIT Melbourne?", "en");
    expect(context.matchedProgramIds).toEqual(["cross-campus-melbourne"]);
    expect(context.sources.some((source) => source.url.includes("studylink.com"))).toBe(true);
    expect(context.contextText).toContain("temporary study");
    expect(context.contextText).not.toContain("Partner Exchange Worldwide");
  });

  it("answers Vietnamese Study Plan questions with the selected language and verified context", () => {
    const context = buildGlobalExperienceContext("Làm sao chuẩn bị Study Plan cho Partner Exchange?", "vi");
    const answer = formatGlobalExperienceFallback("Làm sao chuẩn bị Study Plan cho Partner Exchange?", "vi", context);
    expect(context.hasStudyPlanIntent).toBe(true);
    expect(answer).toContain("Student Connect");
    expect(answer).toContain("15 ngày làm việc");
    expect(answer).not.toMatch(/How to|Applications open|Published intakes/i);
  });
  it("calculates intake boundaries in Melbourne local time", () => {
    const cycle = GLOBAL_EXPERIENCE_PROGRAMS.find((program) => program.id === "partner-exchange")!.cycles.find((item) => item.id === "partner-s2-2027")!;
    expect(getApplicationCycleStatus(cycle, new Date("2026-08-02T13:59:59Z"))).toBe("upcoming");
    expect(getApplicationCycleStatus(cycle, new Date("2026-08-02T14:00:00Z"))).toBe("open");
    expect(getApplicationCycleStatus(cycle, new Date("2026-09-30T13:59:59Z"))).toBe("open");
    expect(getApplicationCycleStatus(cycle, new Date("2026-09-30T14:00:00Z"))).toBe("closed");
  });
});
