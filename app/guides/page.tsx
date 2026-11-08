"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { ALL_RESEARCH_GUIDES } from "@/data/guides/guides";
import { ChevronRight, ShieldCheck } from "lucide-react";

export default function GuidesPage() {
  const { language, t } = useLanguage();

  return (
    <div className="editorial-shell space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--main-text)]">
          {t.guides.title}
        </h1>
        <p className="text-sm sm:text-base text-[var(--secondary-text)] max-w-2xl leading-relaxed">
          {t.guides.subtitle}
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_RESEARCH_GUIDES.map((guide) => (
          <Link
            key={guide.id}
            href={`/guides/${guide.slug}`}
            className="editorial-card flex flex-col justify-between transition-colors group"
          >
            {/* Guide Thumbnail */}
            {guide.imageUrl && (
              <div className="h-32 w-full overflow-hidden bg-[var(--surface-elevated)] relative">
                <img
                  src={guide.imageUrl}
                  alt={language === "vi" ? guide.titleVi : guide.imageAlt ?? guide.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            )}

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="flex items-center justify-end text-xs text-[var(--secondary-text)]">
                  <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.common.verified}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--main-text)] group-hover:text-[var(--accent)] transition-colors leading-snug line-clamp-2">
                  {language === "vi" ? guide.titleVi : guide.titleEn}
                </h3>

                <p className="text-xs text-[var(--secondary-text)] leading-relaxed line-clamp-3">
                  {language === "vi" ? guide.descriptionVi : guide.descriptionEn}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-end text-xs text-[var(--secondary-text)]">
                <span className="font-semibold text-[var(--accent)] flex items-center gap-0.5">
                  <span>{t.common.readMore}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
