"use client";

import * as React from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LanguageProvider, useLanguage } from "@/lib/i18n/context";

function LocalizedDocumentTools() {
  const pathname = usePathname();
  const { language, t } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    const updateDocumentText = () => {
      const heading = document.querySelector("#main-content h1")?.textContent?.trim();
      const title = heading ? `${heading} | ${t.common.siteName}` : t.common.siteName;
      const description = `${t.common.tagline} ${t.common.disclaimer}`;
      if (document.title !== title) document.title = title;
      const descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta?.getAttribute("content") !== description) descriptionMeta?.setAttribute("content", description);
    };
    const mainObserver = new MutationObserver(updateDocumentText);
    const headObserver = new MutationObserver(updateDocumentText);
    updateDocumentText();
    const main = document.getElementById("main-content");
    if (main) mainObserver.observe(main, { childList: true, subtree: true, characterData: true });
    headObserver.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => {
      mainObserver.disconnect();
      headObserver.disconnect();
    };
  }, [language, pathname, t.common.disclaimer, t.common.siteName, t.common.tagline]);

  return (
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--primary-navy)] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white">
      {t.common.skipToContent}
    </a>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <LocalizedDocumentTools />
        {children}
      </LanguageProvider>
    </NextThemesProvider>
  );
}
