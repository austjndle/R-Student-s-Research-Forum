import { afterEach, describe, expect, it, vi } from "vitest";
import { RMIT_OFFICIAL_ENDPOINTS, verifyOfficialEndpoints } from "@/features/content-sync/application/knowledge-sync";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("official content-sync health checks", () => {
  it("marks a 200 response missing the expected keyword as updated", async () => {
    const studentConnect = RMIT_OFFICIAL_ENDPOINTS.find((target) => target.name === "Student Connect")!;
    const expectedContent = RMIT_OFFICIAL_ENDPOINTS.map((target) => target.expectedSelectorOrKeyword).join(" ");
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      const body = url === studentConnect.url ? "<html>Scholarships tuition census assessment</html>" : expectedContent;
      return new Response(body, { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await verifyOfficialEndpoints();
    const checkedStudentConnect = result.targets.find((target) => target.name === "Student Connect");

    expect(studentConnect.expectedSelectorOrKeyword).toBe("Student Connect");
    expect(checkedStudentConnect?.status).toBe("updated");
    expect(result.healthyCount).toBe(result.checkedCount - 1);
  });
});
