"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { KNOWLEDGE_CATEGORIES } from "@/data/knowledge/schema";
import { KNOWLEDGE_DOCUMENTS } from "@/data/knowledge/documents";
import {
  Compass,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  CreditCard,
  Award,
  Globe,
  Calendar,
  Library,
  Laptop,
  Users,
  HeartPulse,
  Building2,
  Briefcase,
  ChevronRight,
  FileText,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Compass,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  CreditCard,
  Award,
  Globe,
  Calendar,
  Library,
  Laptop,
  Users,
  HeartPulse,
  Building2,
  Briefcase,
};

export default function TopicsPage() {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--main-text)]">
          {t.homeSections.popularTopics}
        </h1>
        <p className="text-sm sm:text-base text-[var(--secondary-text)] max-w-2xl leading-relaxed">
          {t.homeSections.popularTopicsDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {KNOWLEDGE_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.iconName] || BookOpen;
          const docsCount = KNOWLEDGE_DOCUMENTS.filter(
            (d) => d.categoryId === cat.id
          ).length;

          return (
            <Link
              key={cat.id}
              href={`/topics/${cat.id}`}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden"
            >
              {cat.imageUrl && (
                <div className="h-44 w-full overflow-hidden bg-[var(--surface-elevated)] relative">
                  <img
                    src={cat.imageUrl}
                    alt={cat.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[var(--badge-bg)] text-[var(--accent)] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--surface-elevated)] text-[var(--secondary-text)]">
                      <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>{docsCount} {docsCount === 1 ? "record" : "records"}</span>
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-[var(--main-text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {language === "vi" ? cat.nameVi : cat.nameEn}
                  </h2>

                  <p className="text-xs sm:text-sm text-[var(--secondary-text)] leading-relaxed line-clamp-2">
                    {language === "vi" ? cat.descriptionVi : cat.descriptionEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
                  <span>{t.common.viewAll}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
