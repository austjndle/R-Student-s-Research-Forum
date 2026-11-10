"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/shared/i18n/context"
import { OPEN_MR_HACHIWARE_EVENT } from "@/shared/events/chat";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  sources?: { id?: string; title: string; url: string; page?: number; sourceType?: string; departmentName?: string }[];
  outOfScope?: boolean;
  answerMode?: "gemini" | "cached" | "workers_ai" | "deterministic_fallback";
}

export function ChatWidget() {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const contextClubId = pathname?.match(/^\/clubs\/([a-z0-9-]+)\/?$/)?.[1];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingQuota, setRemainingQuota] = useState<number | null>(null);
  const [quotaLimit, setQuotaLimit] = useState<number>(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [visualViewportState, setVisualViewportState] = useState<{ height: number; offsetTop: number } | null>(null);

  // Fetch quota on component mount and on chat open, cached in localStorage
  useEffect(() => {
    const handleOpenRequest = () => setIsOpen(true);
    window.addEventListener(OPEN_MR_HACHIWARE_EVENT, handleOpenRequest);
    return () => window.removeEventListener(OPEN_MR_HACHIWARE_EVENT, handleOpenRequest);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    const visualViewport = window.visualViewport;
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
    const updateMobileViewport = () => {
      if (!isMobile()) {
        setVisualViewportState(null);
        return;
      }
      const height = visualViewport?.height ?? window.innerHeight;
      const offsetTop = visualViewport?.offsetTop ?? 0;
      setVisualViewportState((previous) =>
        previous?.height === height && previous.offsetTop === offsetTop ? previous : { height, offsetTop },
      );
    };
    updateMobileViewport();

    requestAnimationFrame(() => {
      (isMobile() ? headingRef.current : inputRef.current)?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = panelRef.current
        ? Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        : [];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;
      const focusInsidePanel = panelRef.current?.contains(activeElement) ?? false;
      if (!focusInsidePanel) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (activeElement === first || activeElement === headingRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    visualViewport?.addEventListener("resize", updateMobileViewport);
    visualViewport?.addEventListener("scroll", updateMobileViewport);
    window.addEventListener("resize", updateMobileViewport);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      visualViewport?.removeEventListener("resize", updateMobileViewport);
      visualViewport?.removeEventListener("scroll", updateMobileViewport);
      window.removeEventListener("resize", updateMobileViewport);
      setVisualViewportState(null);
      requestAnimationFrame(() => {
        if (previousActiveElement?.isConnected) previousActiveElement.focus();
        else launcherRef.current?.focus();
      });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    try {
      const cachedQuota = localStorage.getItem("r_forum_cached_quota");
      if (cachedQuota !== null) {
        const parsed = Number(cachedQuota);
        if (Number.isInteger(parsed) && parsed >= 0 && parsed <= quotaLimit) setRemainingQuota(parsed);
      }
    } catch {}

    const fetchQuota = async () => {
      try {
        const res = await fetch("/api/usage", { credentials: "include" });
        const data = (await res.json()) as { remaining?: number; limit?: number };
        if (!res.ok || typeof data.remaining !== "number") {
          setRemainingQuota(null);
          try {
            localStorage.removeItem("r_forum_cached_quota");
          } catch {}
          return;
        }
        setRemainingQuota(data.remaining);
        if (typeof data.limit === "number" && data.limit > 0) setQuotaLimit(data.limit);
        try {
          localStorage.setItem("r_forum_cached_quota", String(data.remaining));
        } catch {}
      } catch {
        setRemainingQuota(null);
        try {
          localStorage.removeItem("r_forum_cached_quota");
        } catch {}
      }
    };

    void fetchQuota();
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = "user-" + Date.now();
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, sender: "user", text: textToSend.trim() },
    ];
    setMessages(newMessages);
    if (!customText) setInputValue("");
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map((message) => ({
        role: message.sender === "user" ? "user" : "assistant",
        content: message.text,
      }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: textToSend.trim(), language, contextClubId, history }),
      });

      const data = (await res.json()) as {
        answer?: string;
        answerMode?: "gemini" | "cached" | "workers_ai" | "deterministic_fallback";
        remaining?: number;
        outOfScope?: boolean;
        quotaExhausted?: boolean;
        sources?: { id?: string; title: string; url: string; page?: number; sourceType?: string; departmentName?: string }[];
      };
      if (typeof data.remaining === "number") {
        setRemainingQuota(data.remaining);
        try {
          localStorage.setItem("r_forum_cached_quota", String(data.remaining));
        } catch {}
      } else if (!res.ok) {
        setRemainingQuota(null);
        try {
          localStorage.removeItem("r_forum_cached_quota");
        } catch {}
      }

      if (res.ok && data) {
        setMessages([
          ...newMessages,
          {
            id: "bot-" + Date.now(),
            sender: "bot",
            text: data.answer || t.ai.errorNoResponse,
            sources: data.sources || [],
            outOfScope: data.outOfScope,
            answerMode: data.answerMode,
          },
        ]);
      } else {
        const errorText = data?.quotaExhausted
          ? `${t.ai.quotaExhausted}. ${t.ai.quotaExhaustedSub}`
          : res.status === 429
            ? t.ai.errorRateLimited
            : res.status === 400
              ? t.ai.errorInvalidRequest
              : res.status >= 500
                ? t.ai.errorServiceUnavailable
                : t.ai.errorGeneric;
        if (data?.quotaExhausted) setRemainingQuota(0);
        setMessages([
          ...newMessages,
          {
            id: "bot-err-" + Date.now(),
            sender: "bot",
            text: errorText,
          },
        ]);
      }
    } catch {
      setRemainingQuota(null);
      try {
        localStorage.removeItem("r_forum_cached_quota");
      } catch {}
      setMessages([
        ...newMessages,
        {
          id: "bot-err-" + Date.now(),
          sender: "bot",
          text: t.ai.errorGeneric,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const sampleQuestions =
    language === "vi"
      ? [
          "Làm sao để kết bạn ở RMIT?",
          "Tuần này có sự kiện nào để gặp bạn mới không?",
          "Mình tìm bạn cùng nhóm đáng tin cho bài tập như thế nào?",
        ]
      : [
          "How can I make friends at RMIT?",
          "Are there events this week where I can meet people?",
          "How do I find reliable assignment teammates?",
        ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] right-[calc(16px+env(safe-area-inset-right))] z-50 flex h-12 min-h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[var(--accent)] text-white shadow-lg transition-colors duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:opacity-90 md:bottom-5 md:right-5"
          aria-label={t.ai.name}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          title={t.ai.name}
        >
          <MessageSquare className="h-5 w-5 shrink-0 text-white" aria-hidden="true" />
        </button>
      )}

      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="hachiware-chat-title"
          className="fixed inset-0 z-[70] flex h-screen h-[100dvh] min-h-0 w-full flex-col overflow-hidden border-0 bg-[var(--surface)] shadow-2xl md:inset-auto md:right-6 md:bottom-6 md:top-auto md:h-[620px] md:max-h-[calc(100dvh-3rem)] md:w-[440px] md:rounded-2xl md:border"
          style={visualViewportState ? {
            height: `${visualViewportState.height}px`,
            maxHeight: `${visualViewportState.height}px`,
            top: `${visualViewportState.offsetTop}px`,
            bottom: "auto",
          } : undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-elevated)] px-4 pb-3.5 pt-[calc(12px+env(safe-area-inset-top))] md:py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-[var(--border)] overflow-hidden p-0.5 shrink-0 flex items-center justify-center">
                <img src="/cat-meme.png" alt={t.ai.name} className="h-full w-full object-contain" />
              </div>
              <div>
                <h2 ref={headingRef} id="hachiware-chat-title" tabIndex={-1} className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-[var(--main-text)] focus:outline-none">
                  <span>{t.ai.name}</span>
                  <span className="hidden rounded bg-[var(--badge-bg)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] md:inline">
                    Gemini Flash
                  </span>
                </h2>
                <p className="text-[11px] text-[var(--secondary-text)]">
                  {remainingQuota !== null
                    ? t.ai.remainingQuota
                        .replace("{count}", String(remainingQuota))
                        .replace("{limit}", String(quotaLimit))
                    : t.ai.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[var(--secondary-text)] transition-colors hover:bg-[var(--hover)] hover:text-[var(--main-text)]"
                title={t.ai.clearChat}
                aria-label={t.ai.clearChat}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[var(--secondary-text)] transition-colors hover:bg-[var(--hover)] hover:text-[var(--main-text)]"
                title={t.common.close}
                aria-label={t.common.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div aria-live="polite" className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 text-sm">
            {/* Intro Welcome Card */}
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
                  <div className="flex items-center gap-2 text-[var(--accent)]">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-semibold text-xs uppercase tracking-wider">
                      {t.ai.verifiedGrounding}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--secondary-text)] leading-relaxed">
                    {t.ai.disclaimer}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-[var(--secondary-text)]">
                    {t.ai.suggestedQuestions}
                  </p>
                  <div className="space-y-1.5">
                    {sampleQuestions.map((q, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5 text-left text-xs text-[var(--main-text)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--hover)]"
                      >
                        <span className="line-clamp-1">{q}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--secondary-text)] group-hover:text-[var(--accent)] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Rendered Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`min-w-0 max-w-[90%] break-words p-4 text-xs leading-relaxed sm:text-sm ${
                    msg.sender === "user"
                      ? "bg-[var(--accent)] text-white rounded-br-xs font-medium shadow-xs"
                      : "bg-[var(--surface-elevated)] text-[var(--main-text)] border border-[var(--border)] rounded-bl-xs space-y-3 shadow-xs"
                  }`}
                >
                  <div className="space-y-2.5">
                    {msg.text.split("\n").map((rawLine, lIdx) => {
                      const trimmed = rawLine.trim();
                      if (!trimmed) return <div key={lIdx} className="h-1" />;

                      // Parse inline bold: "**text**" -> <strong>text</strong>
                      const renderInline = (str: string) => {
                        const parts = str.split(/(\*\*.*?\*\*)/g);
                        return parts.map((part, index) => {
                          if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
                            return (
                              <strong key={index} className="font-bold text-[var(--main-text)]">
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return part;
                        });
                      };

                      // Detect headings (e.g. "### Title" or "**Title**" standalone)
                      if (trimmed.startsWith("### ")) {
                        return (
                          <h4 key={lIdx} className="font-bold text-sm sm:text-base text-[var(--main-text)] tracking-tight pt-2 border-b border-[var(--border)]/60 pb-1">
                            {trimmed.slice(4)}
                          </h4>
                        );
                      }
                      if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length > 4) {
                        return (
                          <h4 key={lIdx} className="font-bold text-sm sm:text-base text-[var(--main-text)] tracking-tight pt-2 border-b border-[var(--border)]/60 pb-1">
                            {trimmed.slice(2, -2)}
                          </h4>
                        );
                      }

                      // Detect bullets ("• ", "* ", "- ")
                      if (trimmed.startsWith("• ") || trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                        const bulletContent = trimmed.slice(2).trim();
                        return (
                          <div key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[var(--main-text)] leading-relaxed pl-1 py-0.5">
                            <span className="text-[var(--accent)] font-bold text-base leading-none select-none mt-0.5">•</span>
                            <span className="flex-1">{renderInline(bulletContent)}</span>
                          </div>
                        );
                      }

                      // Standard line
                      return (
                        <p key={lIdx} className="text-xs sm:text-sm leading-relaxed text-[var(--main-text)]/90">
                          {renderInline(trimmed)}
                        </p>
                      );
                    })}
                  </div>
                  {msg.sender === "bot" && msg.answerMode && msg.answerMode !== "gemini" && msg.answerMode !== "cached" && (
                    <p className="border-t border-[var(--border)] pt-2 text-[10px] leading-4 text-[var(--secondary-text)]">
                      {msg.answerMode === "workers_ai" ? t.ai.alternativeProviderNotice : t.ai.fallbackNotice}
                    </p>
                  )}
                  {/* Sources citation attachments */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-[var(--border)] space-y-1">
                      <p className="font-semibold text-[11px] text-[var(--secondary-text)]">
                        {t.ai.officialSources}:
                      </p>
                      <ul className="space-y-1">
                        {msg.sources.map((src, i) => (
                          <li key={i}>
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-[var(--accent)] hover:underline"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[280px]">
                                {src.title}{src.page ? ` (PDF p. ${src.page})` : ""}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bot message copy action */}
                  {msg.sender === "bot" && (
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="flex min-h-11 items-center gap-1 rounded px-2 text-[10px] text-[var(--secondary-text)] transition-colors hover:text-[var(--main-text)]"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>{t.common.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{t.common.copy}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] w-max">
                <Sparkles className="w-4 h-4 text-[var(--accent)] animate-spin" />
                <span className="text-xs text-[var(--secondary-text)]">
                  {t.ai.loadingAssistant}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="min-h-0 border-t border-[var(--border)] bg-[var(--surface)] px-3 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 md:p-3">
            {remainingQuota === 0 ? (
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-amber-800 dark:text-amber-200">
                    {t.ai.quotaExhausted}
                  </p>
                  <p className="text-amber-700 dark:text-amber-300">
                    {t.ai.quotaExhaustedSub}
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t.ai.placeholder}
                  aria-label={t.ai.placeholder}
                  inputMode="text"
                  maxLength={2000}
                  disabled={isLoading}
                  className="min-h-11 min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-base text-[var(--main-text)] outline-none transition-colors focus:border-[var(--accent)] sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-[var(--accent)] p-2.5 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  aria-label={t.ai.send}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
