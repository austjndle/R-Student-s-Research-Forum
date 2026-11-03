export type KnowledgeIndexSourceKind = "official_page" | "official_pdf" | "curated_static_dataset";

export interface KnowledgeIndexSource {
  id: string;
  title: string;
  url: string;
  kind: KnowledgeIndexSourceKind;
  lastVerifiedDate: string;
  notes: string;
}

/**
 * Static index boundary for the server-side RAG corpus.
 * Update this manifest when verified records or source documents change;
 * do not fetch RMIT pages during a user request.
 */
export const KNOWLEDGE_INDEX_VERSION = "2026-11-03-hybrid-rag-1";
export const KNOWLEDGE_INDEX_LAST_BUILT = "2026-11-03";

export const KNOWLEDGE_INDEX_SOURCES: readonly KnowledgeIndexSource[] = [
  {
    id: "rmit-campus-facilities",
    title: "RMIT Vietnam campus facilities",
    url: "https://www.rmit.edu.vn/students/campus-life/campus-facilities",
    kind: "official_page",
    lastVerifiedDate: "2026-11-03",
    notes: "Current public facility names, food/drink listings, and operational caveats.",
  },
  {
    id: "rmit-campus-maps",
    title: "RMIT Vietnam campus maps",
    url: "https://www.rmit.edu.vn/students/campus-life/campus-facilities/campus-maps",
    kind: "official_page",
    lastVerifiedDate: "2026-11-03",
    notes: "Canonical public map and floor-plan links for Vietnam campuses.",
  },
  {
    id: "beanland-building-map",
    title: "Beanland Building floor plan",
    url: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/students/maps/beanland-building-map.pdf",
    kind: "official_pdf",
    lastVerifiedDate: "2026-11-03",
    notes: "Level 2 page 2 and Level 3 page 3 support the Beanland facility records.",
  },
  {
    id: "academic-building-2-floor-plan",
    title: "Academic Building 2 floor plan",
    url: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/students/maps/academic-building-2-floor-plan.pdf",
    kind: "official_pdf",
    lastVerifiedDate: "2026-11-03",
    notes: "Building code 802; room-level records remain limited where labels are ambiguous.",
  },
  {
    id: "building-8-floor-plan",
    title: "Building 8 floor plan",
    url: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/students/maps/building-8-floor-plan.pdf",
    kind: "official_pdf",
    lastVerifiedDate: "2026-11-03",
    notes: "Building code 808; lab, Maker Space, SCD Studio, and storage labels are indexed as needs_review where current operation or exact room labels are not confirmed.",
  },
  {
    id: "building-10-floor-plan",
    title: "Recreation and Events Complex / Building 10 floor plan",
    url: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/students/maps/recreation-and-events-complex-building-10.pdf",
    kind: "official_pdf",
    lastVerifiedDate: "2026-11-03",
    notes: "Building code 810; used with current Active Hub and campus-facilities pages.",
  },
  {
    id: "hanoi-building-floor-plan",
    title: "Hanoi campus floor plan",
    url: "https://www.rmit.edu.vn/content/dam/rmit/vn/en/assets-for-production/documents/pdfs/students/maps/hanoi-building-floor-plan.pdf",
    kind: "official_pdf",
    lastVerifiedDate: "2026-11-03",
    notes: "Building code 851; Student Access Lab is indexed from page 2 as needs_review.",
  },
  {
    id: "rmit-academic-calendar-2027",
    title: "RMIT Vietnam academic calendar 2027",
    url: "https://www.rmit.edu.vn/assets/vn/en/assets-for-production/documents/pdfs/academic-calendar/academic-calendar-2027.pdf",
    kind: "official_pdf",
    lastVerifiedDate: "2026-11-03",
    notes: "Approved Higher Education/Vietnam Campus calendar with structured critical dates.",
  },
  {
    id: "rmit-student-clubs",
    title: "RMIT Vietnam student clubs",
    url: "https://www.rmit.edu.vn/students/campus-life/clubs",
    kind: "official_page",
    lastVerifiedDate: "2026-11-03",
    notes: "Public club directory and campus PDF source registry.",
  },
  {
    id: "rmit-myrmit-submit-requests",
    title: "RMIT myRMIT Submit Requests",
    url: "https://www.rmit.edu.vn/students/my-studies/myrmit/submit-requests",
    kind: "official_page",
    lastVerifiedDate: "2026-11-03",
    notes: "Public procedure overview; the source itself says its form list was accurate as of 10 April 2024 and may change.",
  },
  {
    id: "curated-contacts",
    title: "R-Students verified contact directory",
    url: "https://www.rmit.edu.vn/students/support/student-connect",
    kind: "curated_static_dataset",
    lastVerifiedDate: "2026-11-03",
    notes: "Static contact records retain source URLs and verification dates; no private student records are indexed.",
  },
];
