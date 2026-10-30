"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { ExternalLink, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface)] mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About & Independent notice */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white border border-[var(--border)] flex items-center justify-center overflow-hidden p-0.5 shrink-0">
                <img src="/cat-meme.png" alt="Chiikawa Cat Meme" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold text-base text-[var(--main-text)]">
                {t.common.siteName}
              </span>
            </div>
            <p className="text-sm text-[var(--secondary-text)] max-w-md leading-relaxed">
              {t.footer.aboutText}
            </p>
            <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--secondary-text)] leading-relaxed">
                {t.common.disclaimer}
              </p>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--main-text)]">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-[var(--secondary-text)]">
              <li>
                <Link href="/search" className="hover:text-[var(--accent)] transition-colors">
                  {t.nav.search}
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-[var(--accent)] transition-colors">
                  {t.nav.guides}
                </Link>
              </li>
              <li>
                <Link href="/topics" className="hover:text-[var(--accent)] transition-colors">
                  {t.nav.topics}
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-[var(--accent)] transition-colors">
                  {t.nav.contacts}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Official RMIT */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--main-text)]">
              {t.footer.officialResources}
            </h4>
            <ul className="space-y-2 text-sm text-[var(--secondary-text)]">
              <li>
                <a
                  href="https://www.rmit.edu.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
                >
                  <span>{t.footer.rmitOfficial}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.rmit.edu.vn/students"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
                >
                  <span>RMIT Students Hub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--accent)] transition-colors">
                  {t.footer.about}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        {/* Bottom bar with Creator Info, Edu Email, GitHub, LinkedIn */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--secondary-text)]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>{t.footer.copyright}</p>
            <span className="hidden sm:inline-block text-[var(--border)]">•</span>
            <p className="flex items-center gap-1.5">
              <span>Liên hệ tác giả:</span>
              <a
                href="mailto:s4189392@rmit.edu.vn"
                className="font-mono text-[var(--accent)] hover:underline font-semibold"
              >
                s4189392@rmit.edu.vn
              </a>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/austjndle"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--main-text)] transition-colors flex items-center gap-1 font-medium"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.linkedin.com/in/anh-le-dang-quynh-955063341"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--main-text)] transition-colors flex items-center gap-1 font-medium"
            >
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[var(--border)]">|</span>
            <p className="flex items-center gap-1 font-medium">
              Help students improve research skill 💔
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
