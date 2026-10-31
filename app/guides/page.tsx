"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { ALL_RESEARCH_GUIDES } from "@/data/guides/guides";
import { ChevronRight, Clock, ShieldCheck, Mail, Sparkles } from "lucide-react";

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

      {/* Featured Banner: Email Templates */}
      <div className="editorial-card flex flex-col gap-4 bg-[var(--surface-elevated)] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>{language === "vi" ? "Văn mẫu mới cập nhật" : "New Email Blueprints"}</span>
          </div>
          <h2 className="text-lg font-bold text-[var(--main-text)]">
            {language === "vi" ? "Bộ văn mẫu email gửi giảng viên (Consultation, Gia hạn, Điểm số, Nhóm)" : "Lecturer Email Blueprints (Consultation, Extension, Grade Clarification, Group Work)"}
          </h2>
          <p className="text-xs text-[var(--secondary-text)]">
            {language === "vi" ? "Các mẫu email chuẩn mực song ngữ kèm khung điền sẵn, giúp bạn tự tin liên hệ và trao đổi với giảng viên." : "Pre-filled academic email templates with professional etiquette to contact lecturers with confidence."}
          </p>
        </div>
        <Link
          href="/guides/van-mau-email-cho-giang-vien"
          className="min-h-11 shrink-0 bg-[var(--accent)] px-4 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <span>{language === "vi" ? "Xem toàn bộ văn mẫu" : "View Templates"}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
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
              <div className="h-40 w-full overflow-hidden bg-[var(--surface-elevated)] relative">
                <img
                  src={guide.imageUrl}
                  alt={guide.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[var(--secondary-text)]">
                  <span className="flex items-center gap-1 font-semibold text-[var(--accent)] text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{guide.readTimeMinutes} {t.guides.readTime}</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--main-text)] group-hover:text-[var(--accent)] transition-colors leading-snug line-clamp-2">
                  {language === "vi" ? guide.titleVi : guide.titleEn}
                </h3>

                <p className="text-xs text-[var(--secondary-text)] leading-relaxed line-clamp-3">
                  {language === "vi" ? guide.descriptionVi : guide.descriptionEn}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--secondary-text)]">
                <span>{guide.steps.length} {t.guides.steps}</span>
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
