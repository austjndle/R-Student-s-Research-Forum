import { describe, expect, it } from "vitest";
import { translations } from "@/shared/i18n/translations"

function collectShape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => collectShape(item, `${path}[${index}]`));
  if (!value || typeof value !== "object") return [path];
  return Object.entries(value).flatMap(([key, child]) => collectShape(child, path ? `${path}.${key}` : key));
}

describe("translation key coverage", () => {
  it("keeps English and Vietnamese dictionaries structurally aligned", () => {
    expect(collectShape(translations.en)).toEqual(collectShape(translations.vi));
  });

  it("does not leave newly exposed translation values empty", () => {
    for (const path of collectShape(translations.en)) {
      const segments = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
      let value: unknown = translations.en;
      for (const segment of segments) value = (value as Record<string, unknown>)[segment];
      expect(typeof value === "string" ? value.trim().length : 1, path).toBeGreaterThan(0);
    }
  });
});
