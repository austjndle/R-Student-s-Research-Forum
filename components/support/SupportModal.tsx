"use client";

import { useEffect, useRef, useState } from "react";
import { Coffee, ExternalLink, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { OPEN_SUPPORT_EVENT } from "@/components/support/supportEvents";

function readPublicSupportUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

const supportMethods = [
  {
    key: "vietqr",
    label: "VietQR",
    kind: "qr" as const,
    url: readPublicSupportUrl(process.env.NEXT_PUBLIC_SUPPORT_VIETQR_URL || "/support-vietqr.jpg"),
  },
  { key: "kofi", label: "Ko-fi", kind: "link" as const, url: readPublicSupportUrl(process.env.NEXT_PUBLIC_SUPPORT_KOFI_URL) },
  { key: "paypal", label: "PayPal", kind: "link" as const, url: readPublicSupportUrl(process.env.NEXT_PUBLIC_SUPPORT_PAYPAL_URL) },
].filter((method): method is { key: string; label: string; kind: "qr" | "link"; url: string } => Boolean(method.url));

export function SupportModal() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_SUPPORT_EVENT, open);
    return () => window.removeEventListener(OPEN_SUPPORT_EVENT, open);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("[data-support-close]")?.focus());

    const close = () => setIsOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current
        ? Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        : [];
      if (!focusable.length) return;
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

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      requestAnimationFrame(() => previousActive?.focus());
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button type="button" className="absolute inset-0 bg-slate-950/55" aria-label={t.common.close} onClick={() => setIsOpen(false)} />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="support-modal-title" className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--main-text)] shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)]">
              <Coffee className="h-5 w-5" aria-hidden="true" />
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em]">{t.support.label}</p>
            </div>
            <h2 id="support-modal-title" className="mt-3 text-2xl font-bold tracking-[-0.03em]">{t.support.title}</h2>
          </div>
          <button type="button" data-support-close onClick={() => setIsOpen(false)} className="flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] text-[var(--main-text)] hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" aria-label={t.common.close} title={t.common.close}>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-6 text-[var(--secondary-text)]">{t.support.description}</p>
        <div className="mt-6 space-y-2">
          {supportMethods.map((method) =>
            method.kind === "qr" ? (
              <div key={method.key} className="border border-[var(--border)] p-3">
                <div className="flex items-center justify-between gap-3 text-sm font-semibold text-[var(--accent)]">
                  <span>{t.support.vietqr}</span>
                  <a href={method.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 px-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" aria-label={t.support.vietqr}>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
                <img src={method.url} alt={t.support.vietqr} className="mx-auto mt-3 max-h-72 w-auto max-w-full object-contain" />
              </div>
            ) : (
              <a key={method.key} href={method.url} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-between gap-3 border border-[var(--border)] px-4 text-sm font-semibold text-[var(--accent)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                <span>{method.label}</span>
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            ),
          )}
          {supportMethods.length === 0 && <p className="text-sm text-[var(--secondary-text)]">{t.support.notConfigured}</p>}
        </div>
        <p className="mt-5 text-xs leading-5 text-[var(--secondary-text)]">{t.support.voluntary}</p>
      </div>
    </div>
  );
}
