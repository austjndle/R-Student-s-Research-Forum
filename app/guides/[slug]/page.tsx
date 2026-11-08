"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { ALL_RESEARCH_GUIDES } from "@/data/guides/guides";
import { KNOWLEDGE_DOCUMENTS } from "@/data/knowledge/documents";
import { EMAIL_TEMPLATES } from "@/data/templates/emailTemplates";
import { STUDENT_AI_PROMPTS } from "@/data/templates/aiPrompts";
import { GlobalExperienceGuideContent } from "@/components/GlobalExperienceGuideContent";
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
        relatedGuideSlugs: (doc.relatedDocIds ?? [])
          .map((relatedId) => KNOWLEDGE_DOCUMENTS.find((relatedDoc) => relatedDoc.id === relatedId)?.slug)
          .filter((relatedSlug): relatedSlug is string => Boolean(relatedSlug)),
      };
    }
  }

  if (!guide) {
    notFound();
  }
  useEffect(() => {
    document.title = `${language === "vi" ? guide.titleVi : guide.titleEn} | R-Students' Research Hub`;
  }, [guide, language]);

  const relatedGuides = [
    ...ALL_RESEARCH_GUIDES.filter((candidate) => guide.relatedGuideSlugs.includes(candidate.slug)),
    ...KNOWLEDGE_DOCUMENTS.filter((candidate) => guide.relatedGuideSlugs.includes(candidate.slug)),
  ];

  const isEmailTemplateGuide = slug === "van-mau-email-cho-giang-vien";
  const isGlobalExperienceGuide = slug === "exchange-study-abroad-rmit-melbourne";
  const emailCategoryLabels: Record<string, string> = {
    consultation: t.guides.emailCategoryConsultation,
    extension: t.guides.emailCategoryExtension,
    grade_clarification: t.guides.emailCategoryGrade,
    group_work: t.guides.emailCategoryGroupWork,
    recommendation: t.guides.emailCategoryRecommendation,
    attendance: t.guides.emailCategoryAttendance,
  };
  const promptCategoryLabels: Record<string, string> = {
    email_writing: t.guides.promptCategoryEmailWriting,
    course_study: t.guides.promptCategoryCourseStudy,
    assignment_prep: t.guides.promptCategoryAssignmentPrep,
    consult_prep: t.guides.promptCategoryConsultPrep,
  };
  const quickNavLinkClass = "inline-flex h-9 min-h-0 items-center gap-1.5 whitespace-nowrap border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-0 text-[11px] font-semibold leading-none text-[var(--main-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <div className="editorial-shell space-y-10">
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
          <div className={`editorial-card relative mb-6 w-full overflow-hidden ${isGlobalExperienceGuide ? "aspect-[2/1]" : "h-60 sm:h-72"}`}>
            <img
              src={guide.imageUrl}
              alt={language === "vi" ? guide.titleVi : guide.imageAlt ?? guide.titleEn}
              className="h-full w-full object-cover object-center"
              loading={isGlobalExperienceGuide ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)]">
          <Clock className="w-4 h-4" />
          <span>{guide.readTimeMinutes} {t.guides.readTime}</span>
          <span>•</span>
          <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{isGlobalExperienceGuide ? (language === "vi" ? "Thông tin Global Experience đã xác minh" : "Verified Global Experience information") : t.guides.verifiedProcedure}</span>
          </span>
        </div>
        {guide.lastVerifiedDate && (
          <p className="font-mono text-[11px] text-[var(--secondary-text)]">
            {t.common.lastVerified}: {guide.lastVerifiedDate}
          </p>
        )}

        <h1 className="max-w-5xl break-words text-2xl font-extrabold leading-tight text-[var(--main-text)] sm:text-4xl">
          {language === "vi" ? guide.titleVi : guide.titleEn}
        </h1>

        <p className="editorial-copy max-w-4xl text-sm leading-relaxed text-[var(--secondary-text)] sm:text-base">
          {language === "vi" ? guide.descriptionVi : guide.descriptionEn}
        </p>

        {/* Quick Jump Section Bar */}
        <div className="border-t border-[var(--border)] pt-3">
          <p className="mb-2 text-[11px] font-semibold uppercase leading-4 tracking-[0.12em] text-[var(--secondary-text)]">
            {language === "vi" ? "Mục lục nhanh (Bấm để nhảy tới nội dung cần xem):" : "Quick Section Navigation (Click to Jump):"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {isEmailTemplateGuide && (
              <>
                <a
                  href="#email-templates"
                  className={quickNavLinkClass}
                >
                  <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />{language === "vi" ? "Văn mẫu email giảng viên" : "Email Templates"}</span>
                </a>
                <a
                  href="#ai-prompts"
                  className={quickNavLinkClass}
                >
                  <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />{language === "vi" ? "Mẫu câu lệnh AI học vụ" : "AI Prompts"}</span>
                </a>
              </>
            )}
            {!isGlobalExperienceGuide && (
              <a
                href="#guide-steps"
                className={quickNavLinkClass}
              >
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />{
                  guide.slug.includes("calendar")
                    ? (language === "vi" ? "Các mốc thời gian quan trọng" : "Key Milestones")
                    : guide.slug.startsWith("how-to") || guide.slug.startsWith("huong-dan")
                      ? (language === "vi" ? "Các bước thực hiện" : "Action Steps")
                      : (language === "vi" ? "Nội dung" : "Key Information")
                }</span>
              </a>
            )}
            {guide.officialReferences.length > 0 && (
              <a
                href="#official-references"
                className={quickNavLinkClass}
              >
                <span className="inline-flex items-center gap-1.5"><ExternalLink className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />{t.guides.officialReferences}</span>
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
              {t.guides.emailTemplateSectionTitle}
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
                  className="editorial-card"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent)]">
                          {emailCategoryLabels[tpl.category] ?? tpl.category}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-[var(--main-text)]">
                          {language === "vi" ? tpl.titleVi : tpl.titleEn}
                        </h3>
                      </div>

                      <button
                        onClick={() => void handleCopy(`${t.guides.emailSubject}: ${subject}\n\n${body}`, tpl.id)}
                        className="min-h-11 shrink-0 border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-xs font-semibold text-[var(--main-text)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      >
                        {copiedId === tpl.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{t.common.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
                            <span>{t.guides.copyEmail}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-[var(--secondary-text)]">
                      {language === "vi" ? tpl.situationVi : tpl.situationEn}
                    </p>

                    {/* Subject line preview */}
                    <div className="editorial-info flex items-center justify-between gap-3 p-3 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-semibold text-[var(--secondary-text)] shrink-0">{t.guides.emailSubject}:</span>
                        <span className="min-w-0 break-words font-mono text-[var(--main-text)]">{subject}</span>
                      </div>
                      <button
                        onClick={() => void handleCopy(subject, `sub-${tpl.id}`)}
                        className="text-[11px] text-[var(--accent)] hover:underline shrink-0"
                      >
                        {copiedId === `sub-${tpl.id}` ? t.common.copied : t.guides.copySubject}
                      </button>
                    </div>

                    {/* Body preview */}
                    <div className="editorial-copy whitespace-pre-wrap p-4 font-sans text-xs leading-relaxed text-[var(--main-text)] sm:text-sm">
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
                {language === "vi" ? "Mẫu câu lệnh AI hỗ trợ sinh viên trao đổi học vụ và viết email" : "AI Prompt Templates for Academic Email & Consult Prep"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--secondary-text)]">
              {language === "vi" 
                ? "Sao chép các mẫu câu lệnh này vào ChatGPT hoặc Trợ lý AI ở góc màn hình để nhận câu trả lời cá nhân hóa theo đúng đề bài của bạn."
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
                  className="editorial-card flex flex-col justify-between space-y-4 p-5 transition-colors hover:border-[var(--accent)]"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent)]">
                        {promptCategoryLabels[p.category] ?? p.category}
                      </span>

                      <button
                        onClick={() => void handleCopy(promptText, p.id)}
                        className="min-h-11 shrink-0 border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 text-xs font-semibold text-[var(--main-text)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      >
                        {copiedId === p.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>{t.common.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[var(--accent)]" />
                            <span>{t.guides.copyPrompt}</span>
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

                    <div className="editorial-copy max-h-48 overflow-y-auto p-3.5 font-mono text-[11px] leading-relaxed text-[var(--main-text)]/90">
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
      {isGlobalExperienceGuide ? (
        <GlobalExperienceGuideContent />
      ) : (
        <section id="guide-steps" className="space-y-5 scroll-mt-24">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--main-text)]">
            <CheckCircle2 className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
            <span>
              {guide.slug.includes("calendar") || guide.id.includes("calendar")
                ? (language === "vi" ? "Các mốc thời gian quan trọng" : "Key Semester Milestones")
                : guide.slug.startsWith("how-to") || guide.slug.startsWith("huong-dan")
                  ? (language === "vi" ? "Các bước thực hiện" : "Action Steps")
                  : (language === "vi" ? "Nội dung chính" : "Key Information")}
            </span>
          </h2>

          <div className="overflow-x-auto border-y border-[var(--border)]" tabIndex={0} aria-label={language === "vi" ? "Bảng thông tin chính" : "Key information table"}>
            <table className="w-full min-w-[38rem] border-collapse text-left">
              <thead className="bg-[var(--surface-elevated)]">
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className="w-20 px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)] sm:px-5">
                    {language === "vi" ? "STT" : "No."}
                  </th>
                  <th scope="col" className="w-[34%] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--main-text)] sm:px-5">
                    {language === "vi" ? "Mục" : "Item"}
                  </th>
                  <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--main-text)] sm:px-5">
                    {language === "vi" ? "Thông tin" : "Details"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {guide.steps.map((step) => (
                  <tr key={step.number} className="align-top transition-colors hover:bg-[var(--surface-elevated)]">
                    <td className="px-4 py-4 font-mono text-xs font-semibold tracking-[0.12em] text-[var(--accent)] sm:px-5 sm:py-5">
                      {String(step.number).padStart(2, "0")}
                    </td>
                    <th scope="row" className="px-4 py-4 text-sm font-bold leading-snug text-[var(--main-text)] sm:px-5 sm:py-5 sm:text-base">
                      {language === "vi" ? step.titleVi : step.titleEn}
                    </th>
                    <td className="px-4 py-4 text-xs leading-6 text-[var(--secondary-text)] sm:px-5 sm:py-5 sm:text-sm">
                      <p>{language === "vi" ? step.contentVi : step.contentEn}</p>
                      {step.actionLink && (
                        <a
                          href={step.actionLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        >
                          <span>{language === "vi" ? step.actionLink.labelVi : step.actionLink.labelEn}</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Official References */}
      {guide.officialReferences.length > 0 && (
        <section id="official-references" className="editorial-info space-y-3 p-5 scroll-mt-24 sm:p-6">
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
                  <span>{language === "vi" ? ref.titleVi ?? ref.title : ref.title}</span>
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
                className="editorial-card flex items-center justify-between p-4 transition-colors group hover:border-[var(--accent)]"
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
