"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/shared/i18n/context"
import { ACADEMIC_RECOGNITION } from "../data/academicRecognition";

export function AcademicRecognitionSection() {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const value = (item: { en: string; vi: string }) => item[language];

  return <section className="space-y-5 border-t border-[var(--border)] pt-8" aria-labelledby="academic-recognition-title">
    <div className="max-w-3xl"><p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{isVi ? "Ghi nhận học thuật" : "Academic recognition"}</p><h2 id="academic-recognition-title" className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[var(--main-text)]">{isVi ? "Danh hiệu, không phải học bổng" : "Recognition, not scholarships"}</h2><p className="mt-3 text-sm leading-7 text-[var(--secondary-text)]">{isVi ? "Các bản ghi dưới đây là danh hiệu hoặc giải thưởng học thuật/hoạt động được công bố riêng. Dean's List không tự động mang lại giảm học phí hay hỗ trợ tài chính." : "These records are separately published academic or student-recognition distinctions. A Dean's List entry does not automatically provide a tuition discount or financial support."}</p></div>
    <div className="grid gap-5 lg:grid-cols-2">{ACADEMIC_RECOGNITION.map((record) => {
      const unavailable = record.verificationStatus === "unavailable";
      return <article key={record.id} className={`editorial-card flex flex-col gap-4 p-5 ${unavailable ? "border-amber-300/70 dark:border-amber-800/70" : ""}`}>
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">{value(record.institution)}</p><h3 className="mt-2 text-xl font-bold leading-tight text-[var(--main-text)]">{value(record.name)}</h3></div><span className={`inline-flex items-center gap-1 border px-2 py-1 text-[10px] font-semibold ${unavailable ? "border-amber-300/70 bg-amber-50/70 text-amber-800 dark:border-amber-800/70 dark:bg-amber-950/30 dark:text-amber-300" : "border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400"}`}><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />{unavailable ? (isVi ? "Chưa xác nhận" : "Not publicly confirmed") : (isVi ? "Đã xác minh" : "Verified")}</span></div>
        <p className="text-sm leading-6 text-[var(--secondary-text)]">{value(record.description)}</p>
        <dl className="grid gap-3 border-y border-[var(--border)] py-4 text-sm sm:grid-cols-2"><div><dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--secondary-text)]">{isVi ? "Khoa" : "School"}</dt><dd className="mt-1 text-[var(--main-text)]">{value(record.school)}</dd></div><div><dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--secondary-text)]">{isVi ? "Năm học" : "Academic year"}</dt><dd className="mt-1 text-[var(--main-text)]">{value(record.academicYear)}</dd></div><div><dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--secondary-text)]">{isVi ? "GPA" : "GPA"}</dt><dd className="mt-1 text-[var(--main-text)]">{value(record.gpa)}</dd></div><div><dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--secondary-text)]">{isVi ? "Tài chính" : "Financial support"}</dt><dd className="mt-1 text-[var(--main-text)]">{value(record.financialSupport)}</dd></div></dl>
        <div className="space-y-2 text-sm leading-6 text-[var(--secondary-text)]"><p><strong className="text-[var(--main-text)]">{isVi ? "Điều kiện:" : "Eligibility:"}</strong> {value(record.eligibility)}</p><p><strong className="text-[var(--main-text)]">{isVi ? "Xét chọn / đề cử:" : "Selection / nomination:"}</strong> {value(record.selection)} {value(record.nomination)}</p><p><strong className="text-[var(--main-text)]">{isVi ? "Lợi ích:" : "Recognition provided:"}</strong> {value(record.benefits)}</p><p><strong className="text-[var(--main-text)]">{isVi ? "Liên hệ:" : "Enquiries:"}</strong> {value(record.enquiry)}</p></div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-3"><span className="text-xs text-[var(--secondary-text)]">{isVi ? "Xác minh lần cuối" : "Last verified"}: {record.lastVerified}</span><a href={record.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline">{isVi ? "Nguồn chính thức" : "Official source"}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a></div>
      </article>;
    })}</div>
  </section>;
}
