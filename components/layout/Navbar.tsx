"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/i18n/context";
import { requestOpenSupport } from "@/components/support/supportEvents";
import { Coffee, Globe, Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { requestOpenWhatsNew } from "@/components/changelog/changelogEvents";

export function Navbar() {
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDrawerMounted, setIsDrawerMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const pendingAfterCloseRef = useRef<(() => void) | null>(null);
  const closeFallbackRef = useRef<number | null>(null);

  const openMobileMenu = () => {
    if (closeFallbackRef.current !== null) window.clearTimeout(closeFallbackRef.current);
    closeFallbackRef.current = null;
    setIsDrawerMounted(true);
    requestAnimationFrame(() => setIsMobileMenuOpen(true));
  };

  const finishDrawerClose = () => {
    setIsDrawerMounted(false);
    const afterClose = pendingAfterCloseRef.current;
    pendingAfterCloseRef.current = null;
    afterClose?.();
  };

  const closeMobileMenu = (afterClose?: () => void) => {
    pendingAfterCloseRef.current = afterClose ?? null;
    setIsMobileMenuOpen(false);
    closeFallbackRef.current = window.setTimeout(finishDrawerClose, 240);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement as HTMLElement | null;
    const desktopBreakpoint = window.matchMedia("(min-width: 1024px)");
    document.body.style.overflow = "hidden";

    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusCloseButton = () => drawerRef.current?.querySelector<HTMLElement>("[data-mobile-close]")?.focus();
    requestAnimationFrame(focusCloseButton);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = drawerRef.current
        ? Array.from(drawerRef.current.querySelectorAll<HTMLElement>(focusableSelector))
        : [];
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      if (closeFallbackRef.current !== null) window.clearTimeout(closeFallbackRef.current);
      closeFallbackRef.current = null;
      pendingAfterCloseRef.current = null;
      setIsMobileMenuOpen(false);
      setIsDrawerMounted(false);
    };

    desktopBreakpoint.addEventListener("change", handleBreakpointChange);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktopBreakpoint.removeEventListener("change", handleBreakpointChange);
      document.removeEventListener("keydown", handleKeyDown);
      if (!window.matchMedia("(min-width: 1024px)").matches) {
        requestAnimationFrame(() => previousActiveElement?.focus());
      }
    };
  }, [isMobileMenuOpen]);
  const navLinks = [
    { href: "/", label: t.nav.home, ariaLabel: t.nav.accessibleLabels.home },
    { href: "/calendar", label: t.nav.calendar, ariaLabel: t.nav.accessibleLabels.calendar },
    { href: "/events", label: t.nav.events, ariaLabel: t.nav.accessibleLabels.events },
    { href: "/clubs", label: t.nav.clubs, ariaLabel: t.nav.accessibleLabels.clubs },
    { href: "/guides", label: t.nav.guides, ariaLabel: t.nav.accessibleLabels.guides },
    { href: "/facilities", label: t.nav.campusHours, ariaLabel: t.nav.accessibleLabels.campusHours },
    { href: "/topics", label: t.nav.topics, ariaLabel: t.nav.accessibleLabels.topics },
    { href: "/contacts", label: t.nav.contacts, ariaLabel: t.nav.accessibleLabels.contacts },
  ];
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "vi" : "en");
  };

  const toggleTheme = () => {
    setTheme((resolvedTheme ?? theme) === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)] transition-colors">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--primary-navy)] text-xl font-bold text-white transition-colors duration-200 group-hover:bg-[var(--accent)]" aria-hidden="true">
            R
            <span className="absolute bottom-1 right-1 h-1.5 w-1.5 bg-[var(--accent)] group-hover:bg-white" />
          </span>
          <span className="flex min-w-0 shrink-0 flex-col">
            <span className="text-sm font-semibold tracking-tight text-[var(--main-text)] sm:text-lg">R-Students</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--secondary-text)] sm:block">Research Forum</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0 lg:flex lg:gap-0.5 xl:gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.ariaLabel}
                aria-current={isActive ? "page" : undefined}
                className={`min-h-11 whitespace-nowrap border-b-2 px-0.5 py-2 text-[10px] leading-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 lg:px-1 lg:text-[15px] xl:px-1.5 2xl:text-base ${
                  isActive
                    ? "border-[var(--accent)] font-semibold text-[var(--accent)]"
                    : "border-transparent font-medium text-[var(--secondary-text)] hover:border-[var(--border)] hover:text-[var(--main-text)]"
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
            className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 border border-[var(--border)] bg-[var(--surface)] px-0 text-xs font-semibold text-[var(--main-text)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 sm:min-w-0 sm:px-3"
            title={t.nav.switchLanguage}
            aria-label={t.nav.switchLanguage}
          >
            <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden sm:inline">{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--main-text)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            title={t.nav.toggleTheme}
            aria-label={t.nav.toggleTheme}
          >
            <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
            <Moon className="w-4 h-4 block dark:hidden text-slate-700" />
          </button>
          <button
            type="button"
            onClick={requestOpenSupport}
            className="hidden min-h-11 min-w-11 items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--main-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 lg:flex"
            aria-label={t.support.tooltip}
            title={t.support.tooltip}
          >
            <Coffee className="h-4 w-4" aria-hidden="true" />
          </button>
          {/* Mobile drawer trigger */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => (isMobileMenuOpen ? closeMobileMenu() : openMobileMenu())}
            className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--main-text)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={isMobileMenuOpen ? t.nav.closeMenu : t.nav.mobileMenu}
            title={isMobileMenuOpen ? t.nav.closeMenu : t.nav.mobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>

        </div>
      </div>

      {isDrawerMounted && (
        <div
          className={`fixed inset-0 z-[60] lg:hidden ${isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          aria-hidden={!isMobileMenuOpen}
        >
          <button
            type="button"
            tabIndex={isMobileMenuOpen ? 0 : -1}
            aria-label={t.common.close}
            className={`absolute inset-0 cursor-default bg-slate-950/50 transition-opacity duration-200 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => closeMobileMenu()}
          />
          <aside
            ref={drawerRef}
            id="mobile-navigation-drawer"
            aria-label={t.nav.mobileMenu}
            className={`absolute inset-y-0 right-0 flex h-full w-[min(320px,85vw)] flex-col border-l border-[var(--border)] bg-[var(--surface)] text-[var(--main-text)] shadow-2xl transition-transform duration-200 ease-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            onTransitionEnd={(event) => {
              if (event.target === event.currentTarget && event.propertyName === "transform" && !isMobileMenuOpen) {
                if (closeFallbackRef.current !== null) window.clearTimeout(closeFallbackRef.current);
                closeFallbackRef.current = null;
                finishDrawerClose();
              }
            }}
          >
            <div className="flex min-h-[72px] items-center justify-between border-b border-[var(--border)] px-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{t.nav.mobileMenu}</span>
              <button
                type="button"
                tabIndex={isMobileMenuOpen ? 0 : -1}
                data-mobile-close
                onClick={() => closeMobileMenu()}
                className="flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] text-[var(--main-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label={t.nav.closeMenu}
                title={t.nav.closeMenu}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label={t.nav.mobileMenu} className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-label={link.ariaLabel}
                      tabIndex={isMobileMenuOpen ? 0 : -1}
                      onClick={() => closeMobileMenu()}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-11 items-center border-l-2 px-3 py-2 text-base font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                        isActive
                          ? "border-[var(--accent)] text-[var(--accent)]"
                          : "border-transparent text-[var(--secondary-text)] hover:border-[var(--border)] hover:text-[var(--main-text)]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
            <div className="space-y-2 border-t border-[var(--border)] px-4 py-4">
              <button type="button" tabIndex={isMobileMenuOpen ? 0 : -1} onClick={() => closeMobileMenu(requestOpenWhatsNew)} className="flex min-h-11 w-full items-center gap-2 border border-[var(--border)] px-3 py-2 text-left text-sm font-semibold text-[var(--secondary-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t.whatsNew.title}
              </button>
              <button
                type="button"
                tabIndex={isMobileMenuOpen ? 0 : -1}
                onClick={() => closeMobileMenu(requestOpenSupport)}
                className="flex min-h-11 w-full flex-nowrap items-center gap-2 whitespace-nowrap border border-[var(--border)] px-3 py-2 text-left text-sm font-semibold text-[var(--accent)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                aria-label={t.support.tooltip}
                title={t.support.tooltip}
              >
                <Coffee className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">{t.support.shortLink}</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
