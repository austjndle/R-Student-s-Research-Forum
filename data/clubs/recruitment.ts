export type RecruitmentStatus = "recruiting" | "closed" | "upcoming" | "not_announced" | "unverified";
export type RequirementState = "yes" | "no" | "not_confirmed";

export interface ClubRecruitment {
  generalMembershipEn: string;
  generalMembershipVi: string;
  committeeRecruitmentEn: string;
  committeeRecruitmentVi: string;
  eligibilityEn: string;
  eligibilityVi: string;
  applicationProcessEn: string[];
  applicationProcessVi: string[];
  interviewRequired: RequirementState;
  cvPortfolioRequired: RequirementState;
  tryoutRequired: RequirementState;
  recruitmentStatus: RecruitmentStatus;
  applicationDeadline?: string;
  applicationUrl?: string;
  recruitmentAnnouncementUrl?: string;
  sourceUrl: string;
  lastVerifiedDate: string;
}

export type ClubRecruitmentOverride = Partial<Omit<ClubRecruitment, "sourceUrl" | "lastVerifiedDate">> & {
  sourceUrl?: string;
  lastVerifiedDate?: string;
};

/**
 * Current public RMIT club pages do not publish a current recruitment round for
 * these records. Keep the distinction explicit instead of inferring interviews,
 * deadlines, or committee selection from an old form or a social profile.
 */
export const CLUB_RECRUITMENT_OVERRIDES: Record<string, ClubRecruitmentOverride> = {};

export function getClubRecruitment(
  clubId: string,
  sourceUrl: string,
  lastVerifiedDate: string,
): ClubRecruitment {
  const override = CLUB_RECRUITMENT_OVERRIDES[clubId] ?? {};

  return {
    generalMembershipEn:
      override.generalMembershipEn ??
      "The current general-membership process is not confirmed in the public source. Contact the club through its verified official channel or check the next official RMIT Club Day announcement.",
    generalMembershipVi:
      override.generalMembershipVi ??
      "Quy trình tham gia thành viên thường chưa được xác minh trong nguồn công khai hiện tại. Hãy liên hệ CLB qua kênh chính thức đã xác minh hoặc theo dõi thông báo Club Day chính thức tiếp theo của RMIT.",
    committeeRecruitmentEn:
      override.committeeRecruitmentEn ?? "No current committee or core-team recruitment announcement was found.",
    committeeRecruitmentVi:
      override.committeeRecruitmentVi ?? "Chưa tìm thấy thông báo tuyển ban điều hành hoặc core team hiện tại.",
    eligibilityEn:
      override.eligibilityEn ?? "Eligibility requirements are not confirmed in the current public source.",
    eligibilityVi:
      override.eligibilityVi ?? "Điều kiện tham gia chưa được xác minh trong nguồn công khai hiện tại.",
    applicationProcessEn:
      override.applicationProcessEn ?? [
        "Check the club's official page or social channel for a current announcement.",
        "Message the club directly to confirm the next activity or membership intake.",
        "Confirm any campus, schedule, or selection requirements before applying.",
      ],
    applicationProcessVi:
      override.applicationProcessVi ?? [
        "Kiểm tra trang hoặc kênh mạng xã hội chính thức của CLB để xem thông báo hiện tại.",
        "Nhắn trực tiếp cho CLB để xác nhận hoạt động hoặc đợt nhận thành viên tiếp theo.",
        "Xác nhận campus, lịch hoạt động và yêu cầu tuyển chọn trước khi đăng ký.",
      ],
    interviewRequired: override.interviewRequired ?? "not_confirmed",
    cvPortfolioRequired: override.cvPortfolioRequired ?? "not_confirmed",
    tryoutRequired: override.tryoutRequired ?? "not_confirmed",
    recruitmentStatus: override.recruitmentStatus ?? "not_announced",
    applicationDeadline: override.applicationDeadline,
    applicationUrl: override.applicationUrl,
    recruitmentAnnouncementUrl: override.recruitmentAnnouncementUrl,
    sourceUrl: override.sourceUrl ?? sourceUrl,
    lastVerifiedDate: override.lastVerifiedDate ?? lastVerifiedDate,
  };
}
