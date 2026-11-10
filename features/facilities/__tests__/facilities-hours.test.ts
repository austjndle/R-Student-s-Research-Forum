import { describe, expect, it } from "vitest";
import { RMIT_CAMPUS_HOURS, getLocalizedScheduleLabel } from "@/features/facilities/public"
import { DEPARTMENT_CONTACTS } from "@/features/contacts/public"

function building(id: string) {
  const value = RMIT_CAMPUS_HOURS.find((item) => item.id === id);
  if (!value) throw new Error(`Missing building ${id}`);
  return value;
}

describe("verified campus hours records", () => {
  it("keeps Beanland Level 2 distinct from the Level 3 library", () => {
    const beanland = building("sgs-b1");
    const level2 = beanland.floors.find((floor) => floor.floorEn === "Level 2");
    const level3 = beanland.floors.find((floor) => floor.floorEn?.includes("Level 3"));

    expect(level2?.facilitiesEn).toMatch(/Lygon Café/);
    expect(level2?.facilitiesEn).toMatch(/Melbourne Theatre/);
    expect(level2?.facilitiesEn).toMatch(/Room 1\.2\.35/);
    expect(level2?.facilitiesEn).not.toMatch(/Beanland Library/);
    expect(level3?.facilitiesEn).toMatch(/Room 1\.3\.30/);
    expect(level3?.sourcePage).toBe(3);
  });

  it("uses current Student Connect and IT service locations", () => {
    const studentConnect = DEPARTMENT_CONTACTS.find((item) => item.id === "dept-student-connect");
    const it = DEPARTMENT_CONTACTS.find((item) => item.id === "dept-it");

    expect(studentConnect?.phone).toBe("+84 28 3776 1306");
    expect(studentConnect?.serviceHoursEn).toContain("5:30 PM");
    expect(it?.phone).toBe("+84 28 3776 1414");
    expect(it?.locationEn).toContain("Building 1 Level 1 Room 03");
    expect(it?.locationEn).toContain("Building 2 Level 1 Reception Area");
  });

  it("marks the Hanoi Active Hub room discrepancy instead of choosing a side", () => {
    const hanoi = building("hn-main");
    const activeHub = hanoi.floors.find((floor) => floor.floorEn?.includes("Active Hub"));

    expect(activeHub?.floorEn).toContain("1.5.B001");
    expect(activeHub?.notesEn).toMatch(/1\.5\.001/);
    expect(activeHub?.verificationStatus).toBe("conflicting");
  });
  it("keeps the current SGS schedule separate from the older Hanoi schedule", () => {
    expect(building("sgs-b1").accessSchedule?.status).toBe("current");
    expect(building("sgs-b1").accessSchedule?.publishedEn).toMatch(/week, building and level/i);
    expect(building("hn-main").accessSchedule?.status).toBe("older");
    expect(building("hn-main").accessSchedule?.publishedEn).toMatch(/22 June 2023/);
  });
  it("links every building directory entry to its campus access schedule", () => {
    expect(RMIT_CAMPUS_HOURS.every((building) => building.accessSchedule?.url.startsWith("https://"))).toBe(true);
  });

  it("keeps localized schedule labels readable", () => {
    const hanoi = building("hn-main");
    const activeHub = hanoi.floors.find((floor) => floor.floorEn?.includes("Active Hub"));
    expect(activeHub).toBeDefined();
    expect(getLocalizedScheduleLabel(activeHub!, "weekdayHours", "en")).toBe("07:00 - 19:00");
  });
  it("leaves unpublished opening-hour cells blank", () => {
    const hanoi = building("hn-main");
    const floor = hanoi.floors.find((item) => item.floorEn === "Level 5C");
    expect(floor).toBeDefined();
    expect(getLocalizedScheduleLabel(floor!, "weekdayHours", "en")).toBe("");
    expect(getLocalizedScheduleLabel(floor!, "weekdayHours", "vi")).toBe("");
  });
});
