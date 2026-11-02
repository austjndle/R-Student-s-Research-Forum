"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { ShieldCheck, Heart, Sparkles, BookOpen, Search, ArrowRight, ExternalLink } from "lucide-react";
import { EVENT_SOURCES } from "@/data/events/sources";

export default function AboutPage() {
  const { language, t } = useLanguage();
  const copy = t.aboutPage;

  return (
    <div className="editorial-shell space-y-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] text-[var(--badge-text)] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{copy.eyebrow}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--main-text)]">
          {copy.title}
        </h1>
        <p className="text-lg text-[var(--secondary-text)] leading-relaxed">
          {t.common.tagline}
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base text-[var(--main-text)] leading-relaxed">
        <section className="editorial-panel space-y-3 p-6">
          <h2 className="text-xl font-bold text-[var(--main-text)]">{copy.missionTitle}</h2>
          <p className="text-[var(--secondary-text)] leading-relaxed">{copy.missionIntro}</p>
          <p className="text-[var(--secondary-text)] leading-relaxed">{copy.missionBody}</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="editorial-card space-y-2 p-5">
            <div className="flex items-center gap-2 text-[var(--accent)] font-semibold text-sm">
              <Search className="w-4 h-4" />
              <span>{copy.searchFirstTitle}</span>
            </div>
            <p className="text-xs text-[var(--secondary-text)] leading-relaxed">{copy.searchFirstBody}</p>
          </div>

          <div className="editorial-card space-y-2 p-5">
            <div className="flex items-center gap-2 text-[var(--accent)] font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>{copy.noRegistrationTitle}</span>
            </div>
            <p className="text-xs text-[var(--secondary-text)] leading-relaxed">{copy.noRegistrationBody}</p>
          </div>
        </section>

        <section className="editorial-info space-y-3 p-6">
          <h2 className="text-lg font-bold text-[var(--main-text)]">{copy.legalTitle}</h2>
          <p className="text-xs text-[var(--secondary-text)] leading-relaxed">{t.common.independentNotice}</p>
          <p className="text-xs text-[var(--secondary-text)] leading-relaxed">{copy.legalBody}</p>
        </section>

        <section id="sources" className="border-t-4 border-[var(--primary-navy)] pt-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
            <h2 className="text-lg font-bold text-[var(--main-text)]">{copy.sourcesTitle}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{copy.sourcesIntro}</p>
          <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {EVENT_SOURCES.map((source) => (
              <div key={source.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-semibold text-[var(--main-text)]">{language === "vi" ? source.nameVi : source.nameEn}</p>
                  <p className="mt-1 text-xs text-[var(--secondary-text)]">{source.organisation} · {language === "vi" ? source.notesVi : source.notesEn}</p>
                </div>
                <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  {source.verificationStatus === "verified" ? copy.verifiedSource : copy.manualReview}
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
