"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import {
  SCHOLARSHIPS,
  type ScholarshipCategory,
  type ScholarshipCycle,
  type ScholarshipRecord,
} from "@/data/scholarships";
import { AcademicRecognitionSection } from "./AcademicRecognitionSection";

const CATEGORY_ORDER: ScholarshipCategory[] = [
  "future_undergraduate",
  "current_undergraduate",
  "postgraduate_vietnam",
  "postgraduate_melbourne_alumni",
  "international_undergraduate",
  "international_foundation",
];

const STATUS_ORDER = ["open", "upcoming", "closed", "not_announced", "unverified"] as const;
type ScholarshipStatus = (typeof STATUS_ORDER)[number];

type ScholarshipLabels = ReturnType<typeof useScholarshipLabels>;

function useScholarshipLabels() {
  const { t } = useLanguage();
  return t.scholarshipsPage;
}

function vietnamToday(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getCycleStatus(cycle: ScholarshipCycle | undefined, today = vietnamToday()): ScholarshipStatus {
  if (!cycle) return "not_announced";
  if (cycle.dateStatus === "conflicting" || cycle.dateStatus === "partial") return "unverified";
  if (cycle.dateStatus === "not_announced") return "not_announced";
  if (cycle.opensOn || cycle.closesOn) {
    if (!cycle.opensOn || !cycle.closesOn) return "unverified";
    if (today < cycle.opensOn) return "upcoming";
    if (today <= cycle.closesOn) return "open";
    return "closed";
  }
  if (cycle.publishedStatus === "rolling" || cycle.publishedStatus === "open") return "open";
  if (cycle.publishedStatus === "closed") return "closed";
  if (cycle.publishedStatus === "upcoming") return "upcoming";
  return "not_announced";
}

function formatScholarshipDate(value: string, language: "en" | "vi"): string {
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00+07:00`));
}

function getCurrentCycle(record: ScholarshipRecord): { cycle?: ScholarshipCycle; status: ScholarshipStatus } {
  const ranked = record.cycles
    .map((cycle) => ({ cycle, status: getCycleStatus(cycle) }))
    .sort((a, b) => (a.cycle.opensOn ?? "9999").localeCompare(b.cycle.opensOn ?? "9999"));
  const active = ranked.find(({ status }) => status === "open") ?? ranked.find(({ status }) => status === "upcoming");
  return active ?? { cycle: ranked.at(-1)?.cycle, status: ranked.at(-1)?.status ?? "not_announced" };
}


function ScholarshipCard({
  record,
  language,
  labels,
  selected,
  onCompare,
}: {
  record: ScholarshipRecord;
  language: "en" | "vi";
  labels: ScholarshipLabels;
  selected: boolean;
  onCompare: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const current = getCurrentCycle(record);
  const name = record.name[language];
  const category = labels.categories[record.category === "future_undergraduate" ? "futureUndergraduate" : record.category === "current_undergraduate" ? "currentStudents" : record.category === "postgraduate_vietnam" ? "postgraduateVietnam" : record.category === "postgraduate_melbourne_alumni" ? "postgraduateMelbourne" : record.category === "international_foundation" ? "foundationStudies" : "internationalStudents"];
  const statusLabel = labels.statuses[current.status === "not_announced" ? "notAnnounced" : current.status];
  const source = record.sources.find((item) => item.kind.includes("detail")) ?? record.sources[0];
  const cycle = current.cycle;
  const directApplication = record.application.directUrl && record.application.directUrlStatus === "verified";
  const actionLabel = current.status === "open" && directApplication
    ? labels.actions.applyNow
    : current.status === "upcoming"
      ? labels.actions.notYetOpen
      : current.status === "closed"
        ? labels.actions.closed
        : record.application.directUrlStatus === "unavailable"
          ? labels.actions.unavailableLink
          : record.application.directUrlStatus === "unverified"
            ? labels.actions.unverifiedLink
            : labels.actions.howToApply;

  return (
    <article className="editorial-card flex min-w-0 flex-col overflow-hidden transition-colors hover:border-[var(--accent)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{category}</span>
        <span className="inline-flex items-center gap-1 border border-emerald-300/60 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          {record.verificationStatus === "verified" ? labels.states.verified : record.verificationStatus === "partial" ? labels.states.partial : labels.states.manualReview}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h2 className="break-words text-xl font-semibold leading-tight text-[var(--main-text)]">{name}</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--secondary-text)]">{record.summary[language]}</p>
        </div>
        <div className="grid gap-3 border-y border-[var(--border)] py-4 text-sm sm:grid-cols-2">
          <div><dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--secondary-text)]">{labels.fields.awardValue}</dt><dd className="mt-1 font-semibold text-[var(--main-text)]">{record.award.display[language]}</dd></div>
          <div><dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--secondary-text)]">{labels.statusFilter}</dt><dd className="mt-1 font-semibold text-[var(--accent)]">{statusLabel}</dd></div>
          <div><dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--secondary-text)]">{labels.fields.deadline}</dt><dd className="mt-1 text-[var(--main-text)]">{cycle?.closesOn ? formatScholarshipDate(cycle.closesOn, language) : labels.states.noCycles}{cycle?.closingTime ? ` · ${cycle.closingTime}` : ""}</dd></div>
          <div><dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--secondary-text)]">{labels.fields.lastVerified}</dt><dd className="mt-1 text-[var(--main-text)]">{record.lastVerified}</dd></div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setIsOpen((value) => !value)} aria-expanded={isOpen} className="inline-flex min-h-11 items-center border border-[var(--accent)] bg-[var(--accent)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
            {labels.actions.details}
          </button>
          <button type="button" onClick={onCompare} aria-pressed={selected} className={`inline-flex min-h-11 items-center border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${selected ? "border-[var(--primary-navy)] bg-[var(--primary-navy)] text-white" : "border-[var(--border)] text-[var(--secondary-text)] hover:border-[var(--accent)] hover:text-[var(--main-text)]"}`}>
            {selected ? labels.actions.remove : labels.actions.compare}
          </button>
          {record.application.directUrl && record.application.directUrlStatus === "verified" && current.status === "open" && (
            <a href={record.application.directUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 border border-[var(--border)] px-4 text-sm font-semibold text-[var(--accent)] hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
              {actionLabel}<ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
          {record.application.landingUrl && !(record.application.directUrlStatus === "verified" && current.status === "open") && (
            <a href={record.application.landingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
              {actionLabel}<ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>
        {isOpen && (
          <div className="space-y-5 border-t border-[var(--border)] pt-5" id={`${record.id}-details`}>
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <DetailList label={labels.fields.targetGroup} items={[record.targetGroup[language]]} />
              <DetailList label={labels.fields.eligiblePrograms} items={record.eligiblePrograms.map((item) => item[language])} />
              <DetailList label={labels.fields.gpa} items={[record.eligibility.gpa[language]]} />
              <DetailList label={labels.fields.english} items={[record.eligibility.english[language]]} />
              <DetailList label={labels.fields.citizenship} items={[record.eligibility.citizenship[language]]} />
              <DetailList label={labels.fields.credits} items={[record.eligibility.completedCredits === null ? labels.states.notSpecified : String(record.eligibility.completedCredits)]} />
            </div>
            <DetailList label={labels.fields.otherEligibility} items={[...record.eligibility.academic, ...record.eligibility.other].map((item) => item[language])} />
            <DetailList label={labels.fields.selection} items={record.selection.map((item) => item[language])} />
            <DetailList label={labels.fields.requiredDocuments} items={record.requiredDocuments.map((item) => item[language])} />
            <DetailList label={labels.fields.applicationProcess} items={record.applicationSteps.map((item) => item[language])} />
            <DetailList label={labels.fields.cycleDates} items={record.cycles.map((item) => `${item.label[language]}: ${item.opensOn ?? "—"} → ${item.closesOn ?? "—"}${item.resultsOn ? ` · ${item.resultsOn}` : ""}${item.notes[language] ? ` — ${item.notes[language]}` : ""}`)} />
            <p className="break-words text-xs leading-5 text-[var(--secondary-text)]">{record.verificationNotes[language]}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
              {source && <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 font-semibold text-[var(--accent)] hover:underline">{labels.actions.details} / {labels.fields.officialSource}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>}
              {record.application.instructionsUrl && <a href={record.application.instructionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 font-semibold text-[var(--accent)] hover:underline">{labels.actions.howToApply}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function DetailList({ label, items }: { label: string; items: string[] }) {
  return <div><h3 className="font-semibold text-[var(--main-text)]">{label}</h3><ul className="mt-2 list-disc space-y-1 pl-5 leading-6 text-[var(--secondary-text)]">{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>;
}

export function ScholarshipDirectory() {
  const { language } = useLanguage();
  const labels = useScholarshipLabels();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ScholarshipCategory | "all">("all");
  const [status, setStatus] = useState<ScholarshipStatus | "all">("all");
  const [campus, setCampus] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const queryText = query.trim().toLocaleLowerCase();
  const filtered = useMemo(() => SCHOLARSHIPS.filter((record) => {
    const current = getCurrentCycle(record);
    const searchable = [record.name.en, record.name.vi, record.summary.en, record.summary.vi, record.searchTermsEn.join(" "), record.searchTermsVi.join(" "), record.eligiblePrograms.map((item) => item.en).join(" ")].join(" ").toLocaleLowerCase();
    return (category === "all" || record.category === category) && (status === "all" || current.status === status) && (campus === "all" || record.campuses.some((value) => value === campus)) && (!queryText || searchable.includes(queryText));
  }), [category, campus, queryText, status]);
  const comparison = SCHOLARSHIPS.filter((record) => selected.includes(record.id));
  const toggleSelected = (id: string) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : items.length < 4 ? [...items, id] : items);
  const categoryKeys: Array<[ScholarshipCategory, keyof typeof labels.categories]> = [["future_undergraduate", "futureUndergraduate"], ["current_undergraduate", "currentStudents"], ["postgraduate_vietnam", "postgraduateVietnam"], ["postgraduate_melbourne_alumni", "postgraduateMelbourne"], ["international_undergraduate", "internationalStudents"], ["international_foundation", "foundationStudies"]];

  return <div className="editorial-shell space-y-8">
    <header className="border-b border-[var(--border)] pb-8">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{labels.eyebrow}</p>
      <h1 className="mt-4 max-w-5xl text-4xl font-bold tracking-[-0.04em] text-[var(--main-text)] sm:text-6xl">{language === "vi" ? "Tìm học bổng phù hợp với bạn." : "Find the scholarship that fits."}</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--secondary-text)]">{labels.subtitle}</p>
    </header>
    <section className="space-y-4" aria-label={labels.filters}>
      <label className="flex min-h-11 items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--secondary-text)]">
        <Search className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
        <span className="sr-only">{labels.searchPlaceholder}</span>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.searchPlaceholder} className="min-w-0 flex-1 bg-transparent py-2 text-[var(--main-text)] outline-none placeholder:text-[var(--secondary-text)]" autoComplete="off" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect label={labels.categoryFilter} value={category} onChange={(value) => setCategory(value as ScholarshipCategory | "all")} options={[["all", labels.allCategories], ...categoryKeys.map(([value, key]) => [value, labels.categories[key]])] as Array<[string, string]>} />
        <FilterSelect label={labels.statusFilter} value={status} onChange={(value) => setStatus(value as ScholarshipStatus | "all")} options={[["all", labels.allStatuses], ...STATUS_ORDER.map((value) => [value, labels.statuses[value === "not_announced" ? "notAnnounced" : value]])] as Array<[string, string]>} />
        <FilterSelect label={labels.campusFilter} value={campus} onChange={setCampus} options={[["all", labels.allCampuses], ["Saigon South", language === "vi" ? "Nam Sài Gòn" : "Saigon South"], ["Hanoi", language === "vi" ? "Hà Nội" : "Hanoi"]] as Array<[string, string]>} />
        <div className="flex min-h-11 items-center justify-between border border-[var(--border)] px-3 text-sm text-[var(--secondary-text)]"><span>{labels.resultCount.replace("{count}", String(filtered.length))}</span><button type="button" onClick={() => setSelected([])} disabled={selected.length === 0} className="font-semibold text-[var(--accent)] disabled:opacity-40">{labels.actions.clearComparison}</button></div>
      </div>
    </section>
    {comparison.length > 0 && <section className="editorial-panel space-y-4 p-5" aria-labelledby="scholarship-comparison-title"><div className="flex flex-wrap items-center justify-between gap-3"><h2 id="scholarship-comparison-title" className="text-lg font-bold text-[var(--main-text)]">{labels.comparison.title}</h2><span className="text-xs text-[var(--secondary-text)]">{labels.comparison.instructions}</span></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{comparison.map((record) => <div key={record.id} className="border border-[var(--border)] p-4"><h3 className="font-semibold text-[var(--main-text)]">{record.name[language]}</h3><dl className="mt-3 space-y-2 text-xs text-[var(--secondary-text)]"><div><dt className="font-semibold">{labels.comparison.value}</dt><dd>{record.award.display[language]}</dd></div><div><dt className="font-semibold">{labels.comparison.gpa}</dt><dd>{record.eligibility.gpa[language]}</dd></div><div><dt className="font-semibold">{labels.comparison.deadline}</dt><dd>{getCurrentCycle(record).cycle?.closesOn ?? labels.states.noCycles}</dd></div></dl></div>)}</div></section>}
    <div className="grid gap-5 lg:grid-cols-2" aria-live="polite">{filtered.map((record) => <ScholarshipCard key={record.id} record={record} language={language} labels={labels} selected={selected.includes(record.id)} onCompare={() => toggleSelected(record.id)} />)}{filtered.length === 0 && <p className="border border-dashed border-[var(--border)] px-5 py-10 text-sm text-[var(--secondary-text)]">{labels.states.noMatches}</p>}</div>
    <AcademicRecognitionSection />
  </div>;
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <label className="flex min-w-0 w-full min-h-11 items-center gap-2 border border-[var(--border)] px-3 text-xs text-[var(--secondary-text)]"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label} className="min-w-0 w-full flex-1 bg-transparent text-sm text-[var(--main-text)] outline-none">{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}
