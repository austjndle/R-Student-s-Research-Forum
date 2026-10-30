"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/i18n/context";
import {
  Search,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  BookOpen,
  FolderTree,
  PhoneCall,
  Info,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/search", label: t.nav.search },
    { href: "/guides", label: t.nav.guides },
    { href: "/facilities", label: language === "vi" ? "Giờ mở cửa tòa nhà" : "Campus Hours" },
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
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-white border border-[var(--border)] shadow-xs flex items-center justify-center overflow-hidden p-0.5 group-hover:scale-105 transition-transform shrink-0">
            <img src="/cat-meme.png" alt="Chiikawa Cat Meme" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base sm:text-lg tracking-tight text-[var(--main-text)]">
              R-Students
            </span>
            <span className="text-[10px] sm:text-xs text-[var(--secondary-text)] -mt-1 hidden sm:inline-block">
              Research Forum
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--surface-elevated)] text-[var(--accent)]"
                    : "text-[var(--secondary-text)] hover:text-[var(--main-text)] hover:bg-[var(--hover)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons: Language & Theme Switchers */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--hover)] text-[var(--main-text)] transition-colors"
            title="Switch Language"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--hover)] text-[var(--main-text)] transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
            <Moon className="w-4 h-4 block dark:hidden text-slate-700" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--secondary-text)] hover:text-[var(--main-text)] hover:bg-[var(--hover)]"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--surface)] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-[var(--surface-elevated)] text-[var(--accent)]"
                    : "text-[var(--secondary-text)] hover:text-[var(--main-text)] hover:bg-[var(--hover)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
