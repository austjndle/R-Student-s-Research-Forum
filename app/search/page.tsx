"use client";

import React, { useState, useEffect, useTransition, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { searchKnowledgeBase, type SearchResultItem } from "@/lib/search/engine";
import { KNOWLEDGE_CATEGORIES } from "@/data/knowledge/schema";
import {
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  HelpCircle,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Filter,
  BookOpen,
  Calendar,
  Mail,
  RefreshCw,
  Laptop,
  Trophy,
  Dumbbell,
  Sparkles,
} from "lucide-react";

function SearchContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const executeSearch = (searchTerm: string, cat: string) => {
    // If both query and category are empty, results stay empty (shows suggestion grid)
    if (!searchTerm.trim() && cat === "all") {
      setResults([]);
      return;
    }

    startTransition(() => {
      // If user selected a category without typing query, search all documents in that category
      const effectiveQuery = searchTerm.trim() || (cat !== "all" ? cat : "");
      const res = searchKnowledgeBase(effectiveQuery, {
        categoryId: cat === "all" ? undefined : cat,
        language,
        limit: 10,
      });
      setResults(res);
    });
  };

  useEffect(() => {
    executeSearch(query, selectedCategory);
  }, [query, selectedCategory, language]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="editorial-shell space-y-8">
      {/* Header and Search Controls */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-[var(--main-text)]">
          {t.search.title}
        </h1>
        <p className="text-sm text-[var(--secondary-text)]">
          {t.search.searchHint}
        </p>

        {/* Input & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[var(--secondary-text)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="editorial-control w-full px-11 py-3 text-sm focus:outline-none"
            />
          </div>
          {/* Modern Custom Category Dropdown */}
          <div className="relative shrink-0">
            <div className="relative flex items-center">
              <Filter className="w-3.5 h-3.5 text-[var(--accent)] absolute left-3.5 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="editorial-control w-full appearance-none px-9 py-3 text-xs font-medium focus:outline-none sm:w-auto sm:min-w-40"
              >
                <option value="all" className="bg-[var(--surface)] text-[var(--main-text)]">
                  {t.search.allCategories}
                </option>
                {KNOWLEDGE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[var(--surface)] text-[var(--main-text)]">
                    {language === "vi" ? cat.nameVi : cat.nameEn}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[var(--secondary-text)] absolute right-3 pointer-events-none transition-transform" />
            </div>
          </div>
        </div>
      </div>
      {/* Results Header Count */}
      {query.trim() && (
        <div className="flex items-center justify-between text-xs text-[var(--secondary-text)] border-b border-[var(--border)] pb-2">
          <span>
            {results.length} {t.search.resultsFound} for &quot;{query}&quot;
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            100% Free Smart Search (Zero AI Quota Used)
          </span>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-6">
        {results.map((res) => {
          const doc = res.document;
          const isVerified = doc.verificationStatus === "verified";
          const detailUrl = doc.slug ? `/guides/${doc.slug}` : `/topics/${doc.categoryId}`;
          const isCardExpanded = expandedCardId === doc.id;

          return (
            <article
              key={doc.id}
              className="editorial-card flex flex-col transition-colors hover:border-[var(--accent)] md:flex-row group"
            >
              {/* Clickable Thumbnail Illustration */}
              {doc.imageUrl && (
                <Link
                  href={detailUrl}
                  className="md:w-56 lg:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden bg-[var(--surface-elevated)] block cursor-pointer"
                >
                  <img
                    src={doc.imageUrl}
                    alt={doc.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>
              )}

              <div className="p-5 sm:p-6 flex-1 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent)]">
                    {doc.categoryId}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs">
                    {isVerified && (
                      <span className="inline-flex items-center gap-1 border border-emerald-300/60 bg-emerald-50 px-2.5 py-1 font-medium text-[11px] text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t.common.verified} ({doc.lastVerifiedDate})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Clickable Title & Direct Link */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <Link
                    href={detailUrl}
                    className="text-lg sm:text-xl font-bold text-[var(--main-text)] hover:text-[var(--accent)] transition-colors leading-snug cursor-pointer group-hover:text-[var(--accent)]"
                  >
                    {language === "vi" ? doc.titleVi : doc.titleEn}
                  </Link>

                  <Link
                    href={detailUrl}
                    className="min-h-11 shrink-0 bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <span>{language === "vi" ? "Xem chi tiết & Mẫu đáp án" : "View Answers & Templates"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Best Answer Box (Clickable directly into guide/topic) */}
                <Link
                  href={detailUrl}
                  className="editorial-info block cursor-pointer space-y-1.5 p-4 transition-colors hover:border-[var(--accent)]"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                    <span>{t.search.bestAnswer}</span>
                    <span className="text-[11px] font-medium text-[var(--accent)] flex items-center gap-0.5 group-hover/ans:translate-x-1 transition-transform">
                      {language === "vi" ? "Bấm vào để đọc toàn bộ bài viết" : "Click to open full guide"}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-sm text-[var(--main-text)] leading-relaxed">
                    {res.bestAnswer}
                  </p>
                </Link>

                {/* Key Details & Steps */}
                {res.keyDetails && res.keyDetails.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--secondary-text)]">
                      {t.search.keyDetails}
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--secondary-text)] list-disc pl-5">
                      {res.keyDetails.map((detail, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Inline Quick Toggle to preview detailed steps on the same page */}
                <div className="pt-1">
                  <button
                    onClick={() => setExpandedCardId(isCardExpanded ? null : doc.id)}
                    className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
                  >
                    <span>
                      {isCardExpanded
                        ? (language === "vi" ? "Thu gọn mẫu đáp án" : "Hide Quick Details")
                        : (language === "vi" ? "Xem nhanh mẫu hướng dẫn chi tiết ngay tại đây" : "Quick Preview Guidance Here")}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isCardExpanded ? "rotate-90" : ""}`} />
                  </button>

                  {isCardExpanded && (
                    <div className="editorial-info mt-3 space-y-3 p-4 text-xs text-[var(--main-text)] sm:text-sm">
                      <div className="whitespace-pre-line leading-relaxed">
                        {language === "vi" ? doc.detailedGuidanceVi : doc.detailedGuidanceEn}
                      </div>
                      <div className="pt-2 flex justify-end">
                        <Link
                          href={detailUrl}
                          className="text-xs font-bold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                        >
                          <span>{language === "vi" ? "Mở trang riêng để copy toàn bộ văn mẫu chuẩn" : "Open standalone page & copy templates"}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Relevant Department & Official Source footer */}
                <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  {res.relevantDepartment && (
                    <div className="flex items-center gap-1.5 text-[var(--secondary-text)]">
                      <Building2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <span>
                        {t.search.relevantDepartment}:{" "}
                        <strong className="text-[var(--main-text)]">
                          {language === "vi" ? res.relevantDepartment.nameVi : res.relevantDepartment.nameEn}
                        </strong>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Link
                      href={detailUrl}
                      className="inline-flex items-center gap-1 font-semibold text-[var(--accent)] hover:underline cursor-pointer"
                    >
                      <span>{language === "vi" ? "Mở toàn văn" : "Read Full"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleCopy(res.bestAnswer, doc.id)}
                      className="inline-flex items-center gap-1 text-[var(--secondary-text)] hover:text-[var(--main-text)] transition-colors"
                    >
                      {copiedId === doc.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{t.common.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t.common.copy}</span>
                        </>
                      )}
                    </button>

                    <a
                      href={doc.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-[var(--secondary-text)] hover:text-[var(--main-text)] transition-colors"
                    >
                      <span>{t.common.officialSource}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {/* Empty state */}
        {/* If query has text but no matches found */}
        {query.trim() && results.length === 0 && (
          <div className="editorial-panel space-y-4 p-12 text-center">
            <HelpCircle className="w-10 h-10 text-[var(--secondary-text)] mx-auto opacity-60" />
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-[var(--main-text)]">
                {t.search.noResults}
              </h3>
              <p className="text-xs text-[var(--secondary-text)] max-w-md mx-auto">
                {t.search.noResultsSub}
              </p>
            </div>
          </div>
        )}

        {/* SUGGESTION INFORMATION WHEN NOT SEARCHING (Clean Bento Cards) */}
        {!query.trim() && results.length === 0 && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--secondary-text)]">
                <Sparkles className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                <span>{language === "vi" ? "Gợi ý những chủ đề sinh viên RMIT hay thắc mắc nhất" : "Frequently Asked Questions & Trending Topics"}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  titleVi: "Lịch học vụ & Census Date",
                  titleEn: "Academic Calendar & Census Date",
                  descVi: "Mốc thời gian kỳ 3, hạn nộp học phí và ngày chốt rút môn không phạt phí.",
                  descEn: "Key semester dates, tuition payment due dates, and cut-off deadlines.",
                  query: "lịch học kì này",
                  Icon: Calendar,
                },
                {
                  titleVi: "Văn mẫu Email gửi Giảng viên",
                  titleEn: "Lecturer Email Blueprints",
                  descVi: "Xin hẹn consult 1-1, gia hạn deadline, hỏi điểm và báo cáo bạn nhóm free-rider.",
                  descEn: "Templates for consultations, extensions, grade feedback, and group conflicts.",
                  query: "Mail consult giảng viên",
                  Icon: Mail,
                },
                {
                  titleVi: "Thủ tục Đổi ngành học",
                  titleEn: "How to Change Major / Program",
                  descVi: "Điều kiện GPA tối thiểu, thủ tục nộp đơn Internal Program Transfer qua Student Connect.",
                  descEn: "Minimum GPA criteria, application forms, and credit transfer mapping.",
                  query: "Đổi ngành RMIT",
                  Icon: RefreshCw,
                },
                {
                  titleVi: "Hướng dẫn nộp bài Canvas LMS",
                  titleEn: "Canvas LMS & Turnitin Guide",
                  descVi: "Cách nộp bài tập an toàn, giải mã chỉ số trùng lặp Turnitin và quy tắc phạt nộp trễ.",
                  descEn: "Assignment submission steps, Turnitin similarity breakdown, and late rules.",
                  query: "Hướng dẫn nộp bài Canvas",
                  Icon: Laptop,
                },
                {
                  titleVi: "Học bổng & Dean's List",
                  titleEn: "Scholarships & Dean's List",
                  descVi: "Học bổng Hiệu trưởng 100%, học bổng Merit 25-50% và tiêu chuẩn vinh danh Dean's List.",
                  descEn: "VC scholarships, Academic merit awards, and semester Dean's List honors.",
                  query: "Học bổng Dean list",
                  Icon: Trophy,
                },
                {
                  titleVi: "Đăng ký Câu lạc bộ & Thể thao",
                  titleEn: "Student Clubs & Sports Teams",
                  descVi: "Đội tuyển RMIT Redbacks (Bóng rổ, Bóng đá) và ngày hội Club Day của Student Life.",
                  descEn: "RMIT Redbacks varsity teams, academic societies, and Club Day registrations.",
                  query: "Câu lạc bộ bóng rổ",
                  Icon: Dumbbell,
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(item.query);
                    executeSearch(item.query, selectedCategory);
                  }}
                  className="editorial-card flex cursor-pointer flex-col justify-between space-y-4 p-5 text-left transition-colors group hover:border-[var(--accent)]"
                >
                  <div className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center border border-[var(--badge-border)] bg-[var(--badge-bg)] text-[var(--accent)] transition-colors group-hover:border-[var(--accent)]">
                      <item.Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-[var(--main-text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                      {language === "vi" ? item.titleVi : item.titleEn}
                    </h3>
                    <p className="text-xs text-[var(--secondary-text)] leading-relaxed line-clamp-2">
                      {language === "vi" ? item.descVi : item.descEn}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
                    <span>{language === "vi" ? "Tra cứu ngay" : "Search topic"}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[var(--secondary-text)]">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
