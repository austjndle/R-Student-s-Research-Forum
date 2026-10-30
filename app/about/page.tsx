"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { ShieldCheck, Heart, Sparkles, BookOpen, Search, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] text-[var(--badge-text)] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Independent Student Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--main-text)]">
          About R-Students&apos; Research Forum
        </h1>
        <p className="text-lg text-[var(--secondary-text)] leading-relaxed">
          {t.common.tagline}
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base text-[var(--main-text)] leading-relaxed">
        <section className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] space-y-3">
          <h2 className="text-xl font-bold text-[var(--main-text)]">Our Mission</h2>
          <p className="text-[var(--secondary-text)] leading-relaxed">
            Navigating university administrative rules, enrolment deadlines, academic policies, and support services at RMIT University Vietnam can often be complex and fragmented.
          </p>
          <p className="text-[var(--secondary-text)] leading-relaxed">
            R-Students&apos; Research Forum is an independent, bilingual digital portal created to empower students to research independently. By providing instant smart search over verified records and concise guidance, students can find answers in seconds without waiting in the wrong queue.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--accent)] font-semibold text-sm">
              <Search className="w-4 h-4" />
              <span>Search First, AI Second</span>
            </div>
            <p className="text-xs text-[var(--secondary-text)] leading-relaxed">
              Standard searches query curated, verified RMIT documents directly in your browser without consuming AI quotas or external API calls.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--accent)] font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Registration Required</span>
            </div>
            <p className="text-xs text-[var(--secondary-text)] leading-relaxed">
              No logins, no RMIT SSO, no email collection. Anonymous visitors receive full access to search, guides, and 10 free daily AI interactions.
            </p>
          </div>
        </section>

        <section className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-3">
          <h2 className="text-lg font-bold text-[var(--main-text)]">Important Legal Disclaimer</h2>
          <p className="text-xs text-[var(--secondary-text)] leading-relaxed">
            {t.common.independentNotice}
          </p>
          <p className="text-xs text-[var(--secondary-text)] leading-relaxed">
            This project is not affiliated with, sponsored by, or endorsed by RMIT University or RMIT University Vietnam. All trademarks, service marks, and trade names are the property of their respective owners.
          </p>
        </section>
      </div>
    </div>
  );
}
