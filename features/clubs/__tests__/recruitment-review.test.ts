import { describe, expect, it } from "vitest";
import { getVerifiedClubs } from "@/features/clubs/public"
import { validateRecruitmentReviewCandidate } from "@/features/clubs/public"

describe("manual club recruitment review", () => {
  const club = getVerifiedClubs().find((item) => item.facebookUrl || item.profile?.facebookUrl);

  it("requires a post URL bound to the named club channel", () => {
    expect(club).toBeDefined();
    const channel = club!.profile?.facebookUrl ?? club!.facebookUrl!;
    const result = validateRecruitmentReviewCandidate({
      titleEn: "Recruitment opening",
      titleVi: "Mở đơn tuyển thành viên",
      publishedAt: "2026-11-01T00:00:00+07:00",
      category: "opening",
      status: "recruiting",
      applicationDeadline: "2026-12-01T23:59:00+07:00",
      originalPostUrl: channel,
      sourceChannelUrl: channel,
    }, club!, "2026-11-07T00:00:00+07:00");
    expect(result.valid).toBe(true);
    expect(result.candidate?.clubId).toBe(club!.id);
    expect(result.candidate?.campus).toBe(club!.campus);
  });

  it("rejects an expired record marked open", () => {
    expect(club).toBeDefined();
    const channel = club!.profile?.facebookUrl ?? club!.facebookUrl!;
    const result = validateRecruitmentReviewCandidate({
      titleEn: "Old recruitment",
      titleVi: "Đợt tuyển cũ",
      publishedAt: "2026-01-01T00:00:00+07:00",
      category: "opening",
      status: "recruiting",
      applicationDeadline: "2026-01-15T23:59:00+07:00",
      originalPostUrl: channel,
      sourceChannelUrl: channel,
    }, club!, "2026-11-07T00:00:00+07:00");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("An open recruitment record requires a future application deadline.");
  });
});
