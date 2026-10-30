"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n/context";
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
  sources?: { title: string; url: string; departmentName?: string }[];
  outOfScope?: boolean;
}

export function ChatWidget() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingQuota, setRemainingQuota] = useState<number | null>(null);
  const [quotaLimit, setQuotaLimit] = useState<number>(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch quota on component mount and on chat open, cached in localStorage
  useEffect(() => {
    try {
      const cachedQuota = localStorage.getItem("r_forum_cached_quota");
      if (cachedQuota !== null) {
        const parsed = parseInt(cachedQuota, 10);
        if (!isNaN(parsed)) setRemainingQuota(parsed);
      }
    } catch {}

    const fetchQuota = () => {
      fetch("/api/usage", { credentials: "include" })
        .then((res) => res.json() as Promise<{ remaining?: number; limit?: number }>)
        .then((data) => {
          if (data && typeof data.remaining === "number") {
            setRemainingQuota(data.remaining);
            if (data.limit) setQuotaLimit(data.limit);
            try {
              localStorage.setItem("r_forum_cached_quota", String(data.remaining));
            } catch {}
          }
        })
        .catch(() => {});
    };

    fetchQuota();
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: textToSend.trim(), language }),
      });

      const data = (await res.json()) as {
        answer?: string;
        remaining?: number;
        sources?: { title: string; url: string; departmentName?: string }[];
        outOfScope?: boolean;
        error?: string;
      };

      if (res.ok && data) {
        if (typeof data.remaining === "number") {
          setRemainingQuota(data.remaining);
          try {
            localStorage.setItem("r_forum_cached_quota", String(data.remaining));
          } catch {}
        }
        setMessages([
          ...newMessages,
          {
            id: "bot-" + Date.now(),
            sender: "bot",
            text: data.answer || "No response received.",
            sources: data.sources || [],
            outOfScope: data.outOfScope,
          },
        ]);
      } else {
        const errorText = data?.error || t.ai.errorGeneric;
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
          "Thủ tục đổi ngành học RMIT như thế nào?",
          "Lịch học kỳ và ngày Census Date gần nhất?",
          "Cách đăng ký xét học bổng thành tích học tập?",
        ]
      : [
          "How do I apply for internal program transfer?",
          "When is the upcoming Census Date?",
          "What are the GPA requirements for scholarships?",
        ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-[var(--accent)] hover:opacity-95 text-white shadow-lg transition-all hover:scale-105 active:scale-95 group border border-white/20"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-pulse shrink-0" />
          <span className="font-semibold text-xs hidden sm:inline-block">
            {t.ai.name}
          </span>
          {remainingQuota !== null && (
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono font-medium leading-none">
              {remainingQuota}/{quotaLimit}
            </span>
          )}
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-4 top-16 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[440px] sm:h-[620px] z-50 flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden transition-all">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-[var(--border)] overflow-hidden p-0.5 shrink-0 flex items-center justify-center">
                <img src="/cat-meme.png" alt="Cat Meme Assistant" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--main-text)] flex items-center gap-1.5">
                  <span>{t.ai.name}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent)]">
                    Gemini Flash
                  </span>
                </h3>
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
                onClick={clearChat}
                className="p-1.5 rounded-lg text-[var(--secondary-text)] hover:text-[var(--main-text)] hover:bg-[var(--hover)] transition-colors"
                title={t.ai.clearChat}
                aria-label="Clear chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[var(--secondary-text)] hover:text-[var(--main-text)] hover:bg-[var(--hover)] transition-colors"
                title={t.common.close}
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
            {/* Intro Welcome Card */}
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
                  <div className="flex items-center gap-2 text-[var(--accent)]">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-semibold text-xs uppercase tracking-wider">
                      Verified RMIT Grounding
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
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="w-full text-left p-2.5 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)] hover:bg-[var(--hover)] text-xs text-[var(--main-text)] flex items-center justify-between group transition-colors"
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
                  className={`max-w-[90%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
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
                                {src.title}
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
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="text-[10px] text-[var(--secondary-text)] hover:text-[var(--main-text)] flex items-center gap-1 transition-colors"
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
                  Searching knowledge base and formulating verified answer...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)]">
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
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t.ai.placeholder}
                  maxLength={2000}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--main-text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2.5 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                  aria-label="Send message"
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
