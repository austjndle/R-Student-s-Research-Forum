export type PublicVerificationStatus =
  | "verified"
  | "partially_verified"
  | "unverified"
  | "source_unavailable"
  | "conflicting"
  | "review_required";

export function normalizeVerificationStatus(value: string | undefined): PublicVerificationStatus {
  switch (value) {
    case "verified":
      return "verified";
    case "partial":
    case "partially_verified":
      return "partially_verified";
    case "unavailable":
    case "source_unavailable":
      return "source_unavailable";
    case "conflicting":
      return "conflicting";
    case "needs_review":
    case "manual_review":
    case "manual_review_required":
    case "review_required":
      return "review_required";
    case "unverified":
    case "not_published":
    default:
      return "unverified";
  }
}

export function getVerificationLabel(value: string | undefined, language: "en" | "vi"): string {
  const status = normalizeVerificationStatus(value);
  const labels = {
    en: {
      verified: "Verified",
      partially_verified: "Partially verified",
      unverified: "Unverified",
      source_unavailable: "Source unavailable",
      conflicting: "Conflicting information",
      review_required: "Review required",
    },
    vi: {
      verified: "Đã xác minh",
      partially_verified: "Xác minh một phần",
      unverified: "Chưa xác minh",
      source_unavailable: "Nguồn không khả dụng",
      conflicting: "Thông tin mâu thuẫn",
      review_required: "Cần xem xét",
    },
  } as const;
  return labels[language][status];
}

export function isPubliclyVerified(value: string | undefined): boolean {
  return normalizeVerificationStatus(value) === "verified";
}
