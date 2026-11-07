"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { KNOWLEDGE_CATEGORIES } from "@/data/knowledge/schema";
import { ScholarshipDirectory } from "@/components/scholarships/ScholarshipDirectory";
import { SSETDirectory } from "@/components/sset/SSETDirectory";
import { getSchoolDirectory } from "@/data/schoolDirectories";
import { SchoolDirectory } from "@/components/schools/SchoolDirectory";
import { KNOWLEDGE_DOCUMENTS } from "@/data/knowledge/documents";
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { getVerificationLabel, isPubliclyVerified } from "@/lib/verification/status";
import { formatLocalizedDate } from "@/lib/i18n/date";

export default function TopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { language, t } = useLanguage();
  if (slug === "scholarships") {
    return <ScholarshipDirectory />;
  }
  if (slug === "sset") {
    return <SSETDirectory />;
  }
  if (slug === "tbs" || slug === "scd") {
    return <SchoolDirectory school={getSchoolDirectory(slug)} />;
  }


  const category = KNOWLEDGE_CATEGORIES.find((c) => c.id === slug);

  if (!category) {
    notFound();
  }

  const documents = KNOWLEDGE_DOCUMENTS.filter((d) => d.categoryId === category.id);

  return (
    <div className="editorial-shell space-y-8">
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
          <Link
            key={doc.id}
            href={doc.resultHref ?? `/guides/${doc.slug}`}
            className="editorial-card group flex min-w-0 flex-col transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:flex-row"
          >
            {doc.imageUrl && (
              <div className="relative h-48 shrink-0 overflow-hidden bg-[var(--surface-elevated)] md:h-auto md:w-56 lg:w-64">
                <img
                  src={doc.imageUrl}
                  alt={language === "vi" ? doc.titleVi : doc.titleEn}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-6">
              <div className="space-y-3">
                <h2 className="text-lg font-bold leading-snug text-[var(--main-text)] transition-colors group-hover:text-[var(--accent)] sm:text-xl">
                  {language === "vi" ? doc.titleVi : doc.titleEn}
                </h2>
                <p className="line-clamp-3 text-xs leading-relaxed text-[var(--secondary-text)] sm:text-sm">
                  {language === "vi" ? doc.summaryVi : doc.summaryEn}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs font-semibold text-[var(--accent)]">
                <span>{language === "vi" ? "Giới thiệu" : "About"}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </div>
          </Link>
        ))}

        {documents.length === 0 && (
          <div className="editorial-panel space-y-2 p-12 text-center">
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
