"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";
import { ShieldCheck, Lock, Cookie, Bot, RefreshCw } from "lucide-react";

export default function PrivacyPage() {
  const { t } = useLanguage();
  const copy = t.privacyPage;

  return (
    <div className="editorial-shell space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] text-[var(--badge-text)] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{copy.eyebrow}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--main-text)]">
          {copy.title}
        </h1>
        <p className="text-sm sm:text-base text-[var(--secondary-text)]">{copy.lastUpdated}</p>
      </div>

      <div className="space-y-6 text-sm sm:text-base text-[var(--main-text)]">
        {/* Section 1 */}
        <section className="editorial-panel space-y-3 p-6">
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-lg">
            <Lock className="w-5 h-5" />
            <h2>{copy.zeroPersonalDataTitle}</h2>
          </div>
          <p className="text-[var(--secondary-text)] leading-relaxed">{copy.zeroPersonalDataBody}</p>
        </section>

        {/* Section 2 */}
        <section className="editorial-panel space-y-3 p-6">
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-lg">
            <Cookie className="w-5 h-5" />
            <h2>{copy.cookieQuotaTitle}</h2>
          </div>
          <p className="text-[var(--secondary-text)] leading-relaxed">
            {copy.cookieQuotaIntro} <code className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] font-mono text-xs">r_forum_uid</code>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[var(--secondary-text)]">
            {copy.cookieQuotaBullets.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        {/* Section 3 */}
        <section className="editorial-panel space-y-3 p-6">
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-lg">
            <Bot className="w-5 h-5" />
            <h2>{copy.aiTitle}</h2>
          </div>
          <p className="text-[var(--secondary-text)] leading-relaxed">{copy.aiIntro}</p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[var(--secondary-text)]">
            {copy.aiBullets.map((item) => <li key={item}>{item}</li>)}
</ul>
        </section>

        {/* Section 4 */}
        <section className="editorial-panel space-y-3 p-6">
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-lg">
            <RefreshCw className="w-5 h-5" />
            <h2>{copy.securityTitle}</h2>
          </div>
          <p className="text-[var(--secondary-text)] leading-relaxed">{copy.securityBody}</p>
        </section>
      </div>
    </div>
  );
}
