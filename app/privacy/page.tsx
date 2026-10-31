"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";
import { ShieldCheck, Lock, Cookie, Bot, RefreshCw } from "lucide-react";

export default function PrivacyPage() {
  const { language } = useLanguage();

  return (
    <div className="editorial-shell space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] text-[var(--badge-text)] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy & Security Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--main-text)]">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-[var(--secondary-text)]">
          Last updated: October 2026. How R-Students&apos; Research Forum protects your privacy and data.
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base text-[var(--main-text)]">
        {/* Section 1 */}
        <section className="editorial-panel space-y-3 p-6">
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-lg">
            <Lock className="w-5 h-5" />
            <h2>1. Zero Personal Data Collection</h2>
          </div>
          <p className="text-[var(--secondary-text)] leading-relaxed">
            We do not require account creation, student email login, RMIT Single Sign-On (SSO), passwords, or personal identity verification. You can search, browse guides, and interact with the research assistant completely anonymously.
          </p>
        </section>

        {/* Section 2 */}
        <section className="editorial-panel space-y-3 p-6">
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-lg">
            <Cookie className="w-5 h-5" />
            <h2>2. Anonymous Visitor Cookie & Daily AI Quota</h2>
          </div>
          <p className="text-[var(--secondary-text)] leading-relaxed">
            To enforce the fair-use limit of 10 successful AI queries per day, we set a cryptographically signed, anonymous visitor identifier cookie (<code className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] font-mono text-xs">r_forum_uid</code>).
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[var(--secondary-text)]">
            <li>Contains a pseudo-random UUID signed with HMAC-SHA256.</li>
            <li>Contains zero personally identifiable information (PII).</li>
            <li>Stored with <code className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] font-mono text-xs">HttpOnly</code>, <code className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] font-mono text-xs">Secure</code>, and <code className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] font-mono text-xs">SameSite=Lax</code> flags.</li>
            <li>Reset daily at midnight in the Asia/Ho_Chi_Minh time zone.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="editorial-panel space-y-3 p-6">
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-lg">
            <Bot className="w-5 h-5" />
            <h2>3. AI Processing & Google Gemini API</h2>
          </div>
          <p className="text-[var(--secondary-text)] leading-relaxed">
            When you ask a question to the optional R Research Assistant, your query and relevant verified RMIT knowledge records are sent server-side to the Google Gemini API.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[var(--secondary-text)]">
            <li>The API key is securely held within Cloudflare Workers environment secrets and is never exposed to the client.</li>
            <li>Queries are not stored or indexed in any public external database.</li>
            <li>Chat conversations reside solely in your local browser session and can be cleared instantly via the &quot;Clear conversation&quot; button.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="editorial-panel space-y-3 p-6">
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-lg">
            <RefreshCw className="w-5 h-5" />
            <h2>4. Traffic Security & DDoS Safeguards</h2>
          </div>
          <p className="text-[var(--secondary-text)] leading-relaxed">
            The platform runs on Cloudflare Workers edge infrastructure with automated DDoS mitigation, Content Security Policy (CSP), burst rate limiting, and strict security headers to prevent unauthorized scraping and abusive bot traffic.
          </p>
        </section>
      </div>
    </div>
  );
}
