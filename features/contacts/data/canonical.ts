export type CanonicalContactCampus = "saigon_south" | "hanoi" | "all";
export type CanonicalPublicationStatus = "published" | "review" | "archived";
export type CanonicalReviewStatus = "approved" | "pending" | "rejected";

export interface LocalizedContactText {
  en: string;
  vi: string;
}

export interface CanonicalContact {
  id: string;
  entityType: "contact";
  campusScope: CanonicalContactCampus;
  name: LocalizedContactText;
  phone: string | null;
  phoneInstruction: LocalizedContactText | null;
  email: string | null;
  formUrl: string;
  websiteUrl: string;
  location: LocalizedContactText;
  serviceHours: LocalizedContactText;
  source: {
    urls: readonly [string, ...string[]];
    verifiedAt: string;
    sourceVersion: string;
  };
  publication: {
    status: CanonicalPublicationStatus;
    reviewStatus: CanonicalReviewStatus;
  };
}

const OFFICIAL_SOURCE_HOSTS: Record<string, true> = { "rmit.edu.vn": true, "www.rmit.edu.vn": true };
const VALID_CAMPUSES: Record<CanonicalContactCampus, true> = { saigon_south: true, hanoi: true, all: true };
const VALID_PUBLICATION_STATUSES: Record<CanonicalPublicationStatus, true> = { published: true, review: true, archived: true };
const VALID_REVIEW_STATUSES: Record<CanonicalReviewStatus, true> = { approved: true, pending: true, rejected: true };
function isOfficialRmitHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && Object.prototype.hasOwnProperty.call(OFFICIAL_SOURCE_HOSTS, parsed.hostname);
  } catch {
    return false;
  }
}
function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}


const STUDENT_CONNECT_CANONICAL = {
  id: "dept-student-connect",
  entityType: "contact",
  campusScope: "all",
  name: {
    en: "Student Connect",
    vi: "Trung tâm Hỗ trợ Sinh viên (Student Connect)",
  },
  phone: "+84 28 3776 1306",
  phoneInstruction: {
    en: "Press 1",
    vi: "Nhấn phím 1",
  },
  email: null,
  formUrl: "https://www.rmit.edu.vn/students/support/student-connect",
  websiteUrl: "https://www.rmit.edu.vn/students/support/student-connect",
  location: {
    en: "Saigon South: Beanland Building, Ground floor, Student common area | Hanoi: Handi Resco Building, Floor 1, Room 1.1.009",
    vi: "Nam Sài Gòn: Tòa nhà Beanland, tầng trệt, khu vực sinh viên | Hà Nội: Tòa nhà Handi Resco, tầng 1, phòng 1.1.009",
  },
  serviceHours: {
    en: "Monday–Friday, 8:30 AM–5:30 PM, excluding public and university holidays",
    vi: "Thứ Hai–Thứ Sáu, 8:30–17:30, trừ ngày lễ và ngày nghỉ của trường",
  },
  source: {
    urls: [
      "https://www.rmit.edu.vn/students/support/student-connect",
      "https://www.rmit.edu.vn/contact-us",
    ],
    verifiedAt: "2026-11-20",
    sourceVersion: "rmit-student-connect-page-2026-11-20",
  },
  publication: {
    status: "published",
    reviewStatus: "approved",
  },
} satisfies CanonicalContact;

const CANONICAL_CONTACTS: readonly CanonicalContact[] = [STUDENT_CONNECT_CANONICAL];

export function isPublishedCanonicalContact(record: CanonicalContact): boolean {
  return record.publication.status === "published" && record.publication.reviewStatus === "approved";
}

export function getPublishedCanonicalContacts(records: readonly CanonicalContact[] = CANONICAL_CONTACTS): readonly CanonicalContact[] {
  if (validateCanonicalContacts(records).length > 0) return [];
  return records.filter(isPublishedCanonicalContact);
}

export function getPublishedCanonicalContact(id: string, records: readonly CanonicalContact[] = CANONICAL_CONTACTS): CanonicalContact {
  const record = getPublishedCanonicalContacts(records).find((candidate) => candidate.id === id);
  if (!record) throw new Error(`Published canonical contact not found: ${id}`);
  return record;
}
export function getCanonicalPhoneInstruction(record: CanonicalContact): LocalizedContactText {
  if (!record.phoneInstruction) throw new Error(`Canonical contact has no published phone instruction: ${record.id}`);
  return record.phoneInstruction;
}


export function selectLastKnownGoodCanonicalContacts(
  candidates: readonly CanonicalContact[],
  lastKnownGood: readonly CanonicalContact[] = CANONICAL_CONTACTS,
): readonly CanonicalContact[] {
  const selected = new Map(getPublishedCanonicalContacts(lastKnownGood).map((record) => [record.id, record]));
  for (const candidate of getPublishedCanonicalContacts(candidates)) {
    selected.set(candidate.id, candidate);
  }
  return [...selected.values()];
}

export function validateCanonicalContacts(records: readonly CanonicalContact[] = CANONICAL_CONTACTS): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const record of records) {
    if (!record.id.trim()) errors.push("contact id is required");
    if (ids.has(record.id)) errors.push(`duplicate contact id: ${record.id}`);
    ids.add(record.id);
    if (record.entityType !== "contact") errors.push(`${record.id}: entityType must be contact`);
    if (!(record.campusScope in VALID_CAMPUSES)) errors.push(`${record.id}: invalid campus scope`);
    if (!record.name.en.trim() || !record.name.vi.trim()) errors.push(`${record.id}: bilingual name is required`);
    if (!record.location.en.trim() || !record.location.vi.trim()) errors.push(`${record.id}: bilingual location is required`);
    if (!record.serviceHours.en.trim() || !record.serviceHours.vi.trim()) errors.push(`${record.id}: bilingual service hours are required`);
    if (record.phoneInstruction && (!record.phoneInstruction.en.trim() || !record.phoneInstruction.vi.trim())) errors.push(`${record.id}: bilingual phone instruction is required`);
    if (!isOfficialRmitHttpsUrl(record.formUrl)) errors.push(`${record.id}: formUrl must be an official HTTPS RMIT URL`);
    if (!isOfficialRmitHttpsUrl(record.websiteUrl)) errors.push(`${record.id}: websiteUrl must be an official HTTPS RMIT URL`);
    if (!record.source.urls.length) errors.push(`${record.id}: at least one source URL is required`);
    if (!isIsoDate(record.source.verifiedAt)) errors.push(`${record.id}: verifiedAt must be an ISO date`);
    if (!record.source.sourceVersion.trim()) errors.push(`${record.id}: sourceVersion is required`);
    if (!(record.publication.status in VALID_PUBLICATION_STATUSES)) errors.push(`${record.id}: invalid publication status`);
    if (!(record.publication.reviewStatus in VALID_REVIEW_STATUSES)) errors.push(`${record.id}: invalid review status`);

    for (const sourceUrl of record.source.urls) {
      if (!isOfficialRmitHttpsUrl(sourceUrl)) errors.push(`${record.id}: source URL must be an official HTTPS RMIT URL`);
    }
  }

  return errors;
}
