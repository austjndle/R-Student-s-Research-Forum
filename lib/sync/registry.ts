import type { MonitoredSource } from "./types";

const RMIT = "https://www.rmit.edu.vn";

export const MONITORED_SOURCES: readonly MonitoredSource[] = [
  {
    id: "rmit-student-activities-events",
    canonicalUrl: `${RMIT}/students/campus-life/student-activities-and-events`,
    category: "events",
    campus: "all",
    parser: "events",
    frequencyMinutes: 30,
    priority: 100,
    enabled: true,
    notes: "Primary student activities and events landing page.",
  },
  {
    id: "rmit-student-news-events",
    canonicalUrl: `${RMIT}/students/student-news-and-events`,
    category: "student-news",
    campus: "all",
    parser: "events",
    frequencyMinutes: 120,
    priority: 90,
    enabled: true,
    notes: "Student news/event discovery page; event detail URLs remain canonical.",
  },
  {
    id: "rmit-student-events-2026",
    canonicalUrl: `${RMIT}/students/student-news-and-events/student-events-2026`,
    category: "events",
    campus: "all",
    parser: "events",
    frequencyMinutes: 30,
    priority: 100,
    enabled: true,
    notes: "Current-year event directory from the approved project source list.",
  },
  {
    id: "rmit-general-events",
    canonicalUrl: `${RMIT}/events`,
    category: "events",
    campus: "all",
    parser: "events",
    frequencyMinutes: 30,
    priority: 100,
    enabled: true,
    notes: "Official general events directory.",
  },
  {
    id: "rmit-student-clubs",
    canonicalUrl: `${RMIT}/students/campus-life/clubs`,
    category: "clubs",
    campus: "all",
    parser: "review-only",
    frequencyMinutes: 360,
    priority: 80,
    enabled: true,
    notes: "Change monitoring only; changed pages are queued for review until a source-specific parser is approved.",
  },
  {
    id: "rmit-scholarships",
    canonicalUrl: `${RMIT}/vi/hoc-tap-tai-rmit/hoc-bong`,
    category: "scholarships",
    campus: "all",
    parser: "review-only",
    frequencyMinutes: 720,
    priority: 80,
    enabled: true,
    notes: "Change monitoring only; changed pages are queued for review until a source-specific parser is approved.",
  },
  {
    id: "rmit-global-experience",
    canonicalUrl: `${RMIT}/students/work-and-study-opportunities/global-experience-programs`,
    category: "global-experience",
    campus: "all",
    parser: "review-only",
    frequencyMinutes: 720,
    priority: 70,
    enabled: true,
    notes: "Change monitoring only; changed pages are queued for review until a source-specific parser is approved.",
  },
  {
    id: "rmit-academic-calendar",
    canonicalUrl: `${RMIT}/students/my-studies/important-dates-and-academic-calendar`,
    category: "academic-calendar",
    campus: "all",
    parser: "review-only",
    frequencyMinutes: 1440,
    priority: 90,
    enabled: true,
    notes: "Change monitoring only; changed pages are queued for review until a source-specific parser is approved.",
  },
  {
    id: "rmit-myrmit-submit-requests",
    canonicalUrl: `${RMIT}/students/my-studies/myrmit/submit-requests`,
    category: "procedures",
    campus: "all",
    parser: "review-only",
    frequencyMinutes: 1440,
    priority: 60,
    enabled: true,
    notes: "Change monitoring only; changed pages are queued for review until a source-specific parser is approved.",
  },
  {
    id: "rmit-campus-facilities",
    canonicalUrl: `${RMIT}/students/campus-life/campus-facilities`,
    category: "campus-facilities",
    campus: "all",
    parser: "review-only",
    frequencyMinutes: 1440,
    priority: 70,
    enabled: true,
    notes: "Change monitoring only; changed pages are queued for review until a source-specific parser is approved.",
  },
  {
    id: "rmit-school-sset-contact",
    canonicalUrl: `${RMIT}/about-us/schools-and-centres/school-of-science-engineering-and-technology/contact`,
    category: "academic-schools",
    campus: "all",
    parser: "review-only",
    frequencyMinutes: 1440,
    priority: 85,
    enabled: true,
    notes: "Official SSET contact page; changed content is queued for review before publication.",
  },
  {
    id: "rmit-school-tbs-contact",
    canonicalUrl: `${RMIT}/about-us/schools-and-centres/the-business-school/contact-us`,
    category: "academic-schools",
    campus: "all",
    parser: "review-only",
    frequencyMinutes: 1440,
    priority: 85,
    enabled: true,
    notes: "Official Business School contact page; changed content is queued for review before publication.",
  },
  {
    id: "rmit-school-scd-contact",
    canonicalUrl: `${RMIT}/about-us/schools-and-centres/school-communication-design/contact`,
    category: "academic-schools",
    campus: "saigon_south",
    parser: "review-only",
    frequencyMinutes: 1440,
    priority: 85,
    enabled: true,
    notes: "Official SCD contact page; changed content is queued for review before publication.",
  },
  {
    id: "rmit-school-seup-contact",
    canonicalUrl: `${RMIT}/about-us/schools-and-centres/school-english-university-pathways/contact`,
    category: "academic-schools",
    campus: "all",
    parser: "review-only",
    frequencyMinutes: 1440,
    priority: 85,
    enabled: true,
    notes: "Official SEUP contact page; changed content is queued for review before publication.",
  },
];

const ALLOWED_SOURCE_HOSTS = new Set(["rmit.edu.vn", "www.rmit.edu.vn"]);

export function isApprovedMonitorUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ALLOWED_SOURCE_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

export function getMonitoredSource(id: string): MonitoredSource | undefined {
  return MONITORED_SOURCES.find((source) => source.id === id);
}
