"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { KNOWLEDGE_CATEGORIES } from "@/data/knowledge/schema";
import { KNOWLEDGE_DOCUMENTS } from "@/data/knowledge/documents";
import {
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Building2,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function TopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { language, t } = useLanguage();

  const category = KNOWLEDGE_CATEGORIES.find((c) => c.id === slug);

  if (!category) {
    notFound();
  }

  const documents = KNOWLEDGE_DOCUMENTS.filter((d) => d.categoryId === category.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/topics"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--secondary-text)] hover:text-[var(--accent)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "vi" ? "Quay lại Danh sách Chủ đề" : "Back to Explore Topics"}</span>
        </Link>
      </div>

      {/* Category Header */}
      <header className="space-y-3 pb-6 border-b border-[var(--border)]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--main-text)]">
          {language === "vi" ? category.nameVi : category.nameEn}
        </h1>
        <p className="text-base text-[var(--secondary-text)] max-w-2xl leading-relaxed">
          {language === "vi" ? category.descriptionVi : category.descriptionEn}
        </p>
      </header>

      {/* Documents List */}
      <div className="space-y-6">
        {documents.map((doc) => (
          <article
            key={doc.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs hover:border-[var(--accent)] hover:shadow-md transition-all overflow-hidden flex flex-col md:flex-row group"
          >
            {/* Card Image Thumbnail */}
            {doc.imageUrl && (
              <div className="md:w-56 lg:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden bg-[var(--surface-elevated)]">
                <img
                  src={doc.imageUrl}
                  alt={doc.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            )}

            {/* Card Content */}
            <div className="p-5 sm:p-6 flex-1 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.common.verified} ({doc.lastVerifiedDate})</span>
                  </span>
                  <span className="text-[11px] text-[var(--secondary-text)] uppercase font-mono px-2 py-0.5 rounded bg-[var(--surface-elevated)]">
                    {doc.campus}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[var(--main-text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {language === "vi" ? doc.titleVi : doc.titleEn}
                </h2>

                <p className="text-xs sm:text-sm text-[var(--secondary-text)] leading-relaxed">
                  {language === "vi" ? doc.summaryVi : doc.summaryEn}
                </p>
              </div>

            {/* Key Details */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                {t.search.keyDetails}
              </h4>
              <ul className="space-y-1.5 text-xs text-[var(--main-text)] list-disc pl-5">
                {(language === "vi" ? doc.keyDetailsVi : doc.keyDetailsEn).map(
                  (detail, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {detail}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Footer with official source */}
            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
              <span className="text-[var(--secondary-text)]">
                {t.search.officialSources}:
              </span>
              <a
                href={doc.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[var(--accent)] hover:underline"
              >
                <span>{doc.sourceTitle}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            </div>
          </article>
        ))}

        {documents.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] space-y-2">
            <BookOpen className="w-10 h-10 text-[var(--secondary-text)] mx-auto opacity-50" />
            <p className="text-sm text-[var(--secondary-text)]">
              No specific documents cataloged under this topic yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
