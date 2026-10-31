"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/i18n/context";
import {
  Sun,
  Moon,
  Globe,
  BookOpen,
  FolderTree,
  PhoneCall,
  Info,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/calendar", label: t.nav.calendar },
    { href: "/events", label: t.nav.events },
    { href: "/clubs", label: t.nav.clubs },
    { href: "/guides", label: t.nav.guides },
    { href: "/facilities", label: language === "vi" ? "Giờ mở cửa" : "Campus Hours" },
    { href: "/topics", label: t.nav.topics },
    { href: "/contacts", label: t.nav.contacts },
  ];
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "vi" : "en");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)] transition-colors">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="group flex shrink-0 items-center gap-3 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--primary-navy)] text-xl font-bold text-white transition-colors duration-200 group-hover:bg-[var(--accent)]" aria-hidden="true">
            R
            <span className="absolute bottom-1 right-1 h-1.5 w-1.5 bg-[var(--accent)] group-hover:bg-white" />
          </span>
          <span className="flex shrink-0 flex-col">
            <span className="text-base font-semibold tracking-tight text-[var(--main-text)] sm:text-lg">R-Students</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--secondary-text)]">Research Forum</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0 lg:flex lg:gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`min-h-11 whitespace-nowrap border-b-2 px-1.5 py-2 text-xs font-semibold leading-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 lg:px-2 ${
                  isActive
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--secondary-text)] hover:border-[var(--border)] hover:text-[var(--main-text)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons: Language & Theme Switchers */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex min-h-11 cursor-pointer items-center gap-1.5 border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--main-text)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            title="Switch Language"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--main-text)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
            <Moon className="w-4 h-4 block dark:hidden text-slate-700" />
          </button>

        </div>
      </div>

      {/* Mobile Navigation */}
      <nav aria-label="Mobile navigation" className="space-y-1 border-b border-[var(--border)] bg-[var(--surface)] px-4 pb-4 pt-2 lg:hidden">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block min-h-11 border-l-2 px-3 py-2 text-base font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                isActive
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-[var(--secondary-text)] hover:border-[var(--border)] hover:text-[var(--main-text)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
