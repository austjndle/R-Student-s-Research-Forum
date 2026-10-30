"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { ALL_RESEARCH_GUIDES } from "@/data/guides/guides";
import { KNOWLEDGE_DOCUMENTS } from "@/data/knowledge/documents";
import { EMAIL_TEMPLATES } from "@/data/templates/emailTemplates";
import { STUDENT_AI_PROMPTS } from "@/data/templates/aiPrompts";
import {
  Clock,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Copy,
  Check,
  Mail,
  Lightbulb,
  Sparkles,
} from "lucide-react";

export default function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { language, t } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  let guide = ALL_RESEARCH_GUIDES.find((g) => g.slug === slug);

  // If not found in standalone guides, check KNOWLEDGE_DOCUMENTS and format as a comprehensive guide
  if (!guide) {
    const doc = KNOWLEDGE_DOCUMENTS.find((d) => d.slug === slug);
    if (doc) {
      guide = {
        id: doc.id,
        slug: doc.slug,
        titleEn: doc.titleEn,
        titleVi: doc.titleVi,
        descriptionEn: doc.summaryEn,
        descriptionVi: doc.summaryVi,
        readTimeMinutes: 4,
        imageUrl: doc.imageUrl,
        steps: doc.keyDetailsVi.map((_, idx) => {
          const isCalendar = doc.categoryId === "academic-calendar" || doc.id.includes("calendar");
          const isTutorial = doc.slug.startsWith("how-to") || doc.slug.startsWith("huong-dan");
          
          const detailVi = doc.keyDetailsVi[idx] || "";
          const detailEn = doc.keyDetailsEn[idx] || detailVi;

          let titleVi = isCalendar ? `Mốc thời gian ${idx + 1}` : isTutorial ? `Bước ${idx + 1}` : `Nội dung ${idx + 1}`;
          let titleEn = isCalendar ? `Key Milestone ${idx + 1}` : isTutorial ? `Step ${idx + 1}` : `Key Information ${idx + 1}`;
          let contentVi = detailVi;
          let contentEn = detailEn;

          if (detailVi.includes(":")) {
            const [headVi, ...restVi] = detailVi.split(":");
            titleVi = headVi.trim();
            contentVi = restVi.join(":").trim();
          }

          if (detailEn.includes(":")) {
            const [headEn, ...restEn] = detailEn.split(":");
            titleEn = headEn.trim();
            contentEn = restEn.join(":").trim();
          }

          return {
            number: idx + 1,
            titleEn,
            titleVi,
            contentEn,
            contentVi,
          };
        }),
        officialReferences: [
          {
            title: doc.sourceTitle || (language === "vi" ? doc.titleVi : doc.titleEn),
            url: doc.officialSourceUrl,
          },
        ],
        relatedGuideSlugs: ["how-to-write-an-effective-university-enquiry", "how-to-contact-student-connect"],
      };
    }
  }

  if (!guide) {
    notFound();
  }

  const relatedGuides = ALL_RESEARCH_GUIDES.filter((g) =>
    guide.relatedGuideSlugs.includes(g.slug)
  );

  const isEmailTemplateGuide = slug === "van-mau-email-cho-giang-vien";

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--secondary-text)] hover:text-[var(--accent)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "vi" ? "Quay lại Danh sách Hướng dẫn" : "Back to Research Guides"}</span>
        </Link>
      </div>

      {/* Guide Header */}
      <header className="space-y-4">
        {guide.imageUrl && (
          <div className="h-60 sm:h-72 w-full rounded-2xl overflow-hidden bg-[var(--surface-elevated)] relative mb-6">
            <img
              src={guide.imageUrl}
              alt={guide.titleEn}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)]">
          <Clock className="w-4 h-4" />
          <span>{guide.readTimeMinutes} {t.guides.readTime}</span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Official Procedure</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--main-text)] leading-tight">
          {language === "vi" ? guide.titleVi : guide.titleEn}
        </h1>

        <p className="text-sm sm:text-base text-[var(--secondary-text)] leading-relaxed">
          {language === "vi" ? guide.descriptionVi : guide.descriptionEn}
        </p>

        {/* Quick Jump Section Bar */}
        <div className="pt-3 border-t border-[var(--border)]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--secondary-text)] mb-2">
            {language === "vi" ? "Mục lục nhanh (Bấm để nhảy tới nội dung cần xem):" : "Quick Section Navigation (Click to Jump):"}
          </p>
          <div className="flex flex-wrap gap-2">
            {isEmailTemplateGuide && (
              <>
                <a
                  href="#email-templates"
                  className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-xs font-semibold text-[var(--main-text)] transition-colors inline-flex items-center gap-1 shadow-2xs"
                >
                  <span>✉️ {language === "vi" ? "Văn mẫu Email Giảng viên" : "Email Templates"}</span>
                </a>
                <a
                  href="#ai-prompts"
                  className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-xs font-semibold text-[var(--main-text)] transition-colors inline-flex items-center gap-1 shadow-2xs"
                >
                  <span>✨ {language === "vi" ? "Mẫu AI Prompts học vụ" : "AI Prompts"}</span>
                </a>
              </>
            )}
            <a
              href="#guide-steps"
              className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-xs font-semibold text-[var(--main-text)] transition-colors inline-flex items-center gap-1 shadow-2xs"
            >
              <span>📋 {
                guide.slug.includes("calendar") 
                  ? (language === "vi" ? "Các mốc thời gian quan trọng" : "Key Milestones")
                  : guide.slug.startsWith("how-to") || guide.slug.startsWith("huong-dan")
                    ? (language === "vi" ? "Các bước thực hiện" : "Action Steps")
                    : (language === "vi" ? "Nội dung" : "Key Information")
              }</span>
            </a>
            {guide.officialReferences.length > 0 && (
              <a
                href="#official-references"
                className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-xs font-semibold text-[var(--main-text)] transition-colors inline-flex items-center gap-1 shadow-2xs"
              >
                <span>🔗 {t.guides.officialReferences}</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* SPECIAL INTERACTIVE SECTION: EMAIL TEMPLATES */}
      {isEmailTemplateGuide && (
        <>
        <section id="email-templates" className="space-y-6 pt-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-xl font-bold text-[var(--main-text)]">
              {language === "vi" ? "Bộ văn mẫu sẵn dùng (Nhấn Sao chép để dùng ngay)" : "Ready-to-Use Email Templates (Click Copy to Use)"}
            </h2>
          </div>

          <div className="space-y-6">
            {EMAIL_TEMPLATES.map((tpl) => {
              const subject = language === "vi" ? tpl.subjectVi : tpl.subjectEn;
              const body = language === "vi" ? tpl.bodyVi : tpl.bodyEn;
              const tips = language === "vi" ? tpl.tipsVi : tpl.tipsEn;

              return (
                <div
                  key={tpl.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs overflow-hidden"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent)]">
                          {tpl.category}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-[var(--main-text)]">
                          {language === "vi" ? tpl.titleVi : tpl.titleEn}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleCopy(`Subject: ${subject}\n\n${body}`, tpl.id)}
                        className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface-elevated)] hover:bg-[var(--hover)] text-xs font-semibold text-[var(--main-text)] flex items-center gap-1.5 transition-all self-start sm:self-auto shrink-0"
                      >
                        {copiedId === tpl.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{t.common.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
                            <span>{language === "vi" ? "Sao chép toàn bộ email" : "Copy Full Email"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-[var(--secondary-text)]">
                      {language === "vi" ? tpl.situationVi : tpl.situationEn}
                    </p>

                    {/* Subject line preview */}
                    <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-semibold text-[var(--secondary-text)] shrink-0">Subject:</span>
                        <span className="font-mono text-[var(--main-text)] truncate">{subject}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(subject, `sub-${tpl.id}`)}
                        className="text-[11px] text-[var(--accent)] hover:underline shrink-0"
                      >
                        {copiedId === `sub-${tpl.id}` ? "Copied" : "Copy Subject"}
                      </button>
                    </div>

                    {/* Body preview */}
                    <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] font-sans text-xs sm:text-sm text-[var(--main-text)] whitespace-pre-wrap leading-relaxed">
                      {body}
                    </div>

                    {/* Pro Tips */}
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                        <span>{language === "vi" ? "Lưu ý quan trọng khi gửi:" : "Key Etiquette Tips:"}</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-amber-900/80 dark:text-amber-200/80">
                        {tips.map((tip, tIdx) => (
                          <li key={tIdx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI PROMPTS SECTION */}
        <section id="ai-prompts" className="space-y-6 pt-4 border-t border-[var(--border)] scroll-mt-24">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent)]" />
              <h2 className="text-xl font-bold text-[var(--main-text)]">
                {language === "vi" ? "Mẫu AI Prompt hỗ trợ sinh viên trao đổi học vụ & Viết mail" : "AI Prompt Templates for Academic Email & Consult Prep"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--secondary-text)]">
              {language === "vi" 
                ? "Sao chép các mẫu prompt này vào ChatGPT hoặc Trợ lý AI ở góc màn hình để nhận câu trả lời cá nhân hóa theo đúng đề bài của bạn." 
                : "Copy these prompt blueprints into ChatGPT or the R Research Assistant to generate tailored emails and discussion questions."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {STUDENT_AI_PROMPTS.map((p) => {
              const title = language === "vi" ? p.titleVi : p.titleEn;
              const purpose = language === "vi" ? p.purposeVi : p.purposeEn;
              const promptText = language === "vi" ? p.promptTextVi : p.promptTextEn;

              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-[var(--accent)] transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent)]">
                        {p.category}
                      </span>

                      <button
                        onClick={() => handleCopy(promptText, p.id)}
                        className="px-2.5 py-1 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface-elevated)] hover:bg-[var(--hover)] text-xs font-semibold text-[var(--main-text)] flex items-center gap-1 transition-all shrink-0"
                      >
                        {copiedId === p.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>{t.common.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[var(--accent)]" />
                            <span>{language === "vi" ? "Sao chép Prompt" : "Copy Prompt"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h3 className="font-bold text-base text-[var(--main-text)] leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-[var(--secondary-text)] leading-relaxed">
                      {purpose}
                    </p>

                    <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] font-mono text-[11px] leading-relaxed text-[var(--main-text)]/90 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {promptText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        </>
      )}

      {/* Steps or Content Section */}
      <section id="guide-steps" className="space-y-6 scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--main-text)] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
          <span>
            {guide.slug.includes("calendar") || guide.id.includes("calendar")
              ? (language === "vi" ? "Các mốc thời gian quan trọng" : "Key Semester Milestones")
              : guide.slug.startsWith("how-to") || guide.slug.startsWith("huong-dan")
                ? (language === "vi" ? "Các bước thực hiện" : "Action Steps")
                : (language === "vi" ? "Nội dung" : "Key Information")}
          </span>
        </h2>

        <div className="space-y-4">
          {guide.steps.map((step) => (
            <div
              key={step.number}
              className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] space-y-3 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {step.number}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-[var(--main-text)]">
                  {language === "vi" ? step.titleVi : step.titleEn}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[var(--secondary-text)] pl-10 leading-relaxed">
                {language === "vi" ? step.contentVi : step.contentEn}
              </p>
              {step.actionLink && (
                <div className="pl-10 pt-1">
                  <a
                    href={step.actionLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--accent)] hover:opacity-90 text-white text-xs font-semibold shadow-2xs transition-all w-max"
                  >
                    <span>{language === "vi" ? step.actionLink.labelVi : step.actionLink.labelEn}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Official References */}
      {guide.officialReferences.length > 0 && (
        <section id="official-references" className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-3 scroll-mt-24">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--main-text)]">
            {t.guides.officialReferences}
          </h3>
          <ul className="space-y-2">
            {guide.officialReferences.map((ref, idx) => (
              <li key={idx}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[var(--accent)] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span>{ref.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-[var(--border)]">
          <h3 className="text-lg font-bold text-[var(--main-text)]">
            {t.guides.relatedGuides}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedGuides.map((rel) => (
              <Link
                key={rel.id}
                href={`/guides/${rel.slug}`}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] transition-all flex items-center justify-between group"
              >
                <span className="text-xs sm:text-sm font-semibold text-[var(--main-text)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                  {language === "vi" ? rel.titleVi : rel.titleEn}
                </span>
                <ChevronRight className="w-4 h-4 text-[var(--secondary-text)] group-hover:text-[var(--accent)] shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
