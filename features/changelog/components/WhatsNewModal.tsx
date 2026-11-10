"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { CHANGELOG_RELEASES, getPublishedReleases, type ChangelogEntry } from "../data/releases";
import { acknowledgeRelease, canPersistReleaseAcknowledgements, getSafeChangelogHref, hasAcknowledgedRelease } from "../application/acknowledgements";
import { useLanguage } from "@/shared/i18n/context";
import { OPEN_WHATS_NEW_EVENT } from "@/shared/events/whats-new";

interface WhatsNewModalProps {
  /** Uses the same publication and acknowledgement rules as the default release data. */
  entries?: readonly ChangelogEntry[];
}

interface ReleaseView {
  releases: ChangelogEntry[];
  automatic: boolean;
}

const HIGHLIGHT_LIMIT = 5;

function isVisible(element: HTMLElement): boolean {
  if (!element.getClientRects().length) return false;
  const visibility = window.getComputedStyle(element).visibility;
  return visibility !== "hidden" && visibility !== "collapse";
}

function hasBlockingOverlay(dialog: HTMLDialogElement): boolean {
  // The drawer remains mounted throughout its closing transition and focus restoration.
  const drawer = document.getElementById("mobile-navigation-drawer");
  if (drawer && isVisible(drawer)) return true;
  return Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"], dialog[open]')).some(
    (element) => element !== dialog && isVisible(element),
  );
}

function isEditing(): boolean {
  const active = document.activeElement;
  return active instanceof HTMLElement && (
    active.isContentEditable || active.matches('input, textarea, select, [role="textbox"], [role="combobox"]')
  );
}

function isOutsideDialog(dialog: HTMLDialogElement, x: number, y: number): boolean {
  const bounds = dialog.getBoundingClientRect();
  return x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom;
}

export function WhatsNewModal({ entries = CHANGELOG_RELEASES }: WhatsNewModalProps) {
  const { language, t } = useLanguage();
  const headingId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const activeVersionRef = useRef<string | null>(null);
  const backdropPointerDownRef = useRef(false);
  const [view, setView] = useState<ReleaseView | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const finishClose = useCallback(() => {
    const version = activeVersionRef.current;
    activeVersionRef.current = null;
    if (version) acknowledgeRelease(version);
    setView(null);
  }, []);

  const close = () => {
    dialogRef.current?.close();
    finishClose();
  };

  const openHistory = useCallback(() => {
    setShowHistory(true);
    if (contentRef.current) contentRef.current.scrollTop = 0;
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const prepareView = (automatic: boolean) => {
      if (dialogRef.current?.open) {
        if (!automatic) openHistory();
        return;
      }
      const releases = getPublishedReleases(entries);
      const latest = releases[0];
      if (automatic && (!latest || hasAcknowledgedRelease(latest.version) || !canPersistReleaseAcknowledgements())) return;
      setShowHistory(!automatic);
      setView({ releases, automatic });
    };
    const onOpenRequest = () => prepareView(false);
    window.addEventListener(OPEN_WHATS_NEW_EVENT, onOpenRequest);
    prepareView(true);
    return () => window.removeEventListener(OPEN_WHATS_NEW_EVENT, onOpenRequest);
  }, [entries, openHistory]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!view || !dialog) return;

    let pending = true;
    let timer: number | null = null;
    let previousFocus: HTMLElement | null = null;
    let previousOverflow: string | null = null;
    let previousOverflowPriority = "";
    const eligibleAt = performance.now() + (view.automatic ? 900 : 0);

    const stopWaiting = () => {
      pending = false;
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
      observer.disconnect();
      document.removeEventListener("focusin", scheduleOpen);
      document.removeEventListener("focusout", scheduleOpen);
      document.removeEventListener("visibilitychange", scheduleOpen);
      document.removeEventListener("transitionend", scheduleOpen);
      window.removeEventListener("resize", scheduleOpen);
      window.removeEventListener("storage", scheduleOpen);
    };

    const tryOpen = () => {
      timer = null;
      if (!pending || !dialog.isConnected || document.hidden || hasBlockingOverlay(dialog)) return;
      if (view.automatic && isEditing()) return;
      const latest = view.releases[0];
      if (view.automatic && latest && (hasAcknowledgedRelease(latest.version) || !canPersistReleaseAcknowledgements())) {
        stopWaiting();
        setView(null);
        return;
      }
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      previousOverflow = document.body.style.getPropertyValue("overflow");
      previousOverflowPriority = document.body.style.getPropertyPriority("overflow");
      document.body.style.setProperty("overflow", "hidden");
      activeVersionRef.current = latest?.version ?? null;
      if (latest) acknowledgeRelease(latest.version);
      stopWaiting();
      headingRef.current?.focus({ preventScroll: true });
    };

    function scheduleOpen() {
      if (!pending || timer !== null) return;
      // A task boundary lets the other overlay finish React cleanup and release its scroll lock.
      timer = window.setTimeout(tryOpen, Math.max(0, eligibleAt - performance.now()));
    }

    const observer = new MutationObserver(scheduleOpen);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden", "open", "aria-hidden"],
    });
    document.addEventListener("focusin", scheduleOpen);
    document.addEventListener("focusout", scheduleOpen);
    document.addEventListener("visibilitychange", scheduleOpen);
    document.addEventListener("transitionend", scheduleOpen);
    window.addEventListener("resize", scheduleOpen);
    window.addEventListener("storage", scheduleOpen);
    scheduleOpen();

    return () => {
      stopWaiting();
      if (dialog.open) dialog.close();
      if (previousOverflow !== null) {
        if (document.body.style.getPropertyValue("overflow") === "hidden") {
          if (previousOverflow) document.body.style.setProperty("overflow", previousOverflow, previousOverflowPriority);
          else document.body.style.removeProperty("overflow");
        }
        const restoreTarget = previousFocus;
        requestAnimationFrame(() => {
          if (!dialog.open && !hasBlockingOverlay(dialog) && restoreTarget?.isConnected && isVisible(restoreTarget)) {
            restoreTarget.focus({ preventScroll: true });
          }
        });
      }
    };
  }, [view]);

  const releases = view?.releases ?? [];
  const visibleReleases = showHistory ? releases : releases.slice(0, 1);
  const canViewAll = !showHistory && (releases.length > 1 || (releases[0]?.changes.length ?? 0) > HIGHLIGHT_LIMIT);
  const dateFormatter = new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      aria-modal="true"
      className="fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] p-0 text-[var(--main-text)] shadow-2xl backdrop:bg-slate-950/55 open:flex open:flex-col"
      style={{
        maxHeight: "calc(100dvh - max(1rem, env(safe-area-inset-top)) - max(1rem, env(safe-area-inset-bottom)))",
        maxWidth: "min(42rem, calc(100vw - max(1rem, env(safe-area-inset-left)) - max(1rem, env(safe-area-inset-right))))",
        top: "max(1rem, env(safe-area-inset-top))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={() => {
        if (!dialogRef.current?.open) finishClose();
      }}
      onPointerDown={(event) => {
        backdropPointerDownRef.current = event.target === event.currentTarget && isOutsideDialog(event.currentTarget, event.clientX, event.clientY);
      }}
      onClick={(event) => {
        if (backdropPointerDownRef.current && event.target === event.currentTarget && isOutsideDialog(event.currentTarget, event.clientX, event.clientY)) close();
        backdropPointerDownRef.current = false;
      }}
    >
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-5 sm:px-7">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]"><Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />{t.whatsNew.heading}</p>
          <h2 ref={headingRef} id={headingId} tabIndex={-1} className="mt-2 text-2xl font-bold tracking-[-0.03em] outline-none">
            {showHistory ? t.whatsNew.history : t.whatsNew.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label={t.common.close}
          title={t.common.close}
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center border border-[var(--border)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] motion-reduce:transition-none"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <div ref={contentRef} className="min-h-0 overflow-y-auto overscroll-contain px-5 py-6 [overflow-wrap:anywhere] sm:px-7">
        {visibleReleases.length === 0 ? (
          <p className="text-sm leading-6 text-[var(--secondary-text)]">{t.whatsNew.empty}</p>
        ) : (
          <div className="space-y-8">
            {visibleReleases.map((release, releaseIndex) => (
              <section key={release.version} aria-labelledby={`${headingId}-release-${releaseIndex}`} className={releaseIndex > 0 ? "border-t border-[var(--border)] pt-7" : undefined}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-[var(--secondary-text)]">
                  <span>{t.whatsNew.release} {release.version}</span>
                  <time dateTime={release.releaseDate}>{dateFormatter.format(new Date(release.releaseDate))}</time>
                  {releaseIndex === 0 && <span className="border border-[var(--badge-border)] bg-[var(--badge-bg)] px-2 py-1 font-semibold text-[var(--badge-text)]">{showHistory ? t.whatsNew.latest : t.whatsNew.newLabel}</span>}
                </div>
                <h3 id={`${headingId}-release-${releaseIndex}`} className="mt-4 text-xl font-semibold tracking-tight">{release.title[language]}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{release.introduction[language]}</p>
                <ul className="mt-5 space-y-4">
                  {(showHistory ? release.changes : release.changes.slice(0, HIGHLIGHT_LIMIT)).map((change) => {
                    const href = getSafeChangelogHref(change.href);
                    return (
                      <li key={change.id} className="border-l-2 border-[var(--border)] pl-4">
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--secondary-text)]">{t.whatsNew[change.category]}</span>
                        <h4 className="mt-1 text-sm font-semibold leading-6">
                          {href ? (
                            <Link href={href} prefetch={false} onClick={close} className="inline-flex min-h-11 items-center gap-2 text-[var(--accent)] underline decoration-[var(--border)] underline-offset-4 hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                              <span>{change.title[language]}</span>
                              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                            </Link>
                          ) : change.title[language]}
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-[var(--secondary-text)]">{change.description[language]}</p>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <footer className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-[var(--border)] bg-[var(--surface)] px-5 py-4 sm:px-7">
        {canViewAll && (
          <button type="button" onClick={openHistory} className="mr-auto inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
            {t.whatsNew.viewAll}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <button type="button" onClick={close} className="min-h-11 border border-[var(--border)] bg-[var(--primary-navy)] px-6 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]">
          {t.whatsNew.gotIt}
        </button>
      </footer>
    </dialog>
  );
}
