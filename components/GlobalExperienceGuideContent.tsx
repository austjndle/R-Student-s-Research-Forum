"use client";

import { useLanguage } from "@/lib/i18n/context";
import { ExternalLink, ShieldCheck } from "lucide-react";
import {
  GLOBAL_EXPERIENCE_LAST_VERIFIED,
  GLOBAL_EXPERIENCE_PROGRAMS,
  GLOBAL_EXPERIENCE_SCHOLARSHIPS,
  GLOBAL_EXPERIENCE_STUDY_PLAN,
  GLOBAL_EXPERIENCE_URLS,
  formatGlobalExperienceDate,
  getApplicationCycleStatus,
  getDeadlineStatus,
  type GlobalApplicationStatus,
  type GlobalExperienceProgram,
} from "@/data/guides/globalExperience";

const applicationStatusLabel: Record<"en" | "vi", Record<GlobalApplicationStatus, string>> = {
  en: {
    open: "Applications open",
    upcoming: "Applications not yet open",
    closed: "Applications closed",
    not_announced: "Not announced",
  },
  vi: {
    open: "Đang nhận hồ sơ",
    upcoming: "Chưa mở hồ sơ",
    closed: "Đã đóng hồ sơ",
    not_announced: "Chưa công bố",
  },
};


function StatusBadge({ status, label }: { status: GlobalApplicationStatus; label: string }) {
  const color = status === "open"
    ? "border-emerald-700/40 text-emerald-800 dark:border-emerald-300/40 dark:text-emerald-200"
    : status === "upcoming"
      ? "border-[var(--accent)]/50 text-[var(--accent)]"
      : "border-[var(--border)] text-[var(--secondary-text)]";
  return <span className={`inline-flex min-h-8 items-center border px-2.5 text-[11px] font-semibold ${color}`}>{label}</span>;
}


export function GlobalExperienceGuideContent() {
  const { language } = useLanguage();
  const copy = language === "vi"
    ? {
        navLabel: "Mục lục Trải nghiệm Toàn cầu",
        programs: "Chọn chương trình",
        comparison: "So sánh",
        scholarships: "Học bổng",
        studyPlan: "Study Plan",
        stories: "Chia sẻ sinh viên",
        office: "Liên hệ",
        overview: "Bốn lộ trình chính",
        overviewText: "Chọn loại hình theo thời lượng, nơi học và cách công nhận tín chỉ. Hạn, chỉ tiêu, môn học và yêu cầu của trường tiếp nhận có thể khác theo đợt.",
        destination: "Điểm đến",
        duration: "Thời lượng",
        fees: "Học phí và chi phí",
        compareTitle: "So sánh các lộ trình",
        compareIntro: "Bảng này là tóm tắt ban đầu; yêu cầu cụ thể của trường đối tác nằm trong hồ sơ Mobi hoặc StudyLink.",
        program: "Chương trình",
        eligibility: "Điều kiện cơ bản",
        portal: "Cổng nộp hồ sơ",
        portalNote: "Cổng có thể yêu cầu đăng nhập. Link truy cập được không đồng nghĩa đợt tuyển đang mở.",
        transferTitle: "Cross-campus tạm thời khác với chuyển trường vĩnh viễn",
        transferText: "Cross-campus cho phép học 1–2 học kỳ tại RMIT Melbourne trong khi vẫn đăng ký toàn thời gian và đóng học phí RMIT Việt Nam. Chuyển tiếp vĩnh viễn là lộ trình riêng để hoàn tất bằng tại Melbourne.",
        permanentTransfer: "Xem lộ trình chuyển tiếp vĩnh viễn",
        scholarshipTitle: "Học bổng và hỗ trợ tài chính",
        scholarshipIntro: "Các khoản Erasmus+ và SEED phụ thuộc trường đối tác, năm học và phân bổ của RMIT. Hạn dưới đây là hạn Partner Exchange tiên quyết được trang học bổng nêu, không phải hạn nộp đơn học bổng riêng.",
        amount: "Mức hỗ trợ được công bố",
        who: "Ai có thể được xem xét",
        process: "Cách nộp",
        partnerCutoff: "Hạn Partner Exchange tiên quyết",
        deadlinePassed: "Đã qua hạn Partner Exchange cần đáp ứng",
        partnerDeadlineNotPassed: "Hạn Partner Exchange chưa qua",
        studyPlanTitle: "Study Plan và công nhận tín chỉ",
        studyPlanIntro: "Study Plan là thỏa thuận RMIT Việt Nam duyệt các môn dự kiến được công nhận. Duyệt trước không đảm bảo trường tiếp nhận còn mở môn hoặc chấp nhận đăng ký cuối cùng.",
        processing: "Thời gian xử lý hồ sơ đầy đủ",
        forms: "Biểu mẫu chính thức",
        submitPlan: "Nộp qua Student Connect Online Portal",
        storiesTitle: "Chia sẻ từ sinh viên",
        storiesText: "Đọc các trải nghiệm Cross-campus và trao đổi của sinh viên RMIT. Đây là câu chuyện cá nhân, không phải cam kết về kết quả hay điều kiện của chương trình.",
        storiesLink: "Đọc Exchange Student Stories",
        contactTitle: "Global Experience Office",
        hours: "Thứ Hai–Thứ Sáu, 9:00–12:00 và 13:00–17:00",
        offices: "Văn phòng: 1.3.08, Nam Sài Gòn · 1.1.006, Hà Nội",
        consultation: "Đặt lịch tư vấn (nên đặt trước)",
        verified: "Đối chiếu nguồn lần cuối",
        officialPage: "Thông tin RMIT",
        applicationDetails: "Hướng dẫn đăng ký",
        viewPortal: "Mở cổng chính thức",
        deadlineTimezone: "Hạn đóng theo giờ Melbourne (23:59).",
        closingTime: "23:59",
        melbourneTime: "giờ Melbourne",
        seasonalTiming: "Khung thời gian chỉ mang tính tham khảo; luôn kiểm tra danh sách Mobi hiện tại.",
        partnerLists: "Danh sách đối tác theo ngành (PDF tháng 3/2025, tài liệu tham khảo đã có ngày).",
        fullPartnerList: "Mở danh sách đối tác Mobi hiện tại",
        undergraduateList: "Danh sách bậc Cử nhân",
        postgraduateList: "Danh sách bậc Sau đại học",
      }
    : {
        navLabel: "Global Experience contents",
        programs: "Choose a program",
        comparison: "Compare options",
        scholarships: "Scholarships",
        studyPlan: "Study Plan",
        stories: "Student stories",
        office: "Contact",
        overview: "Four pathways",
        overviewText: "Choose by duration, study location and credit process. Dates, places, courses and host requirements differ by intake.",
        destination: "Where you study",
        duration: "Duration",
        fees: "Tuition and costs",
        compareTitle: "Compare the pathways",
        compareIntro: "Use this as a first comparison; host-specific rules and course availability are in Mobi or StudyLink.",
        program: "Program",
        eligibility: "Basic eligibility",
        portal: "Application portal",
        portalNote: "Portals may require sign-in. An accessible portal does not mean an intake is currently open.",
        transferTitle: "Temporary Cross-campus study is not a permanent transfer",
        transferText: "Cross-campus lets you study 1–2 semesters at RMIT Melbourne while staying enrolled full-time and paying RMIT Vietnam tuition. Permanent transfer is a separate pathway to complete your degree in Melbourne.",
        permanentTransfer: "View permanent transfer pathway",
        scholarshipTitle: "Scholarships and grants",
        scholarshipIntro: "Erasmus+ and SEED funding depends on partner, academic year and RMIT allocation. Dates below are the prerequisite Partner Exchange deadlines cited on RMIT’s scholarship page, not separate scholarship application deadlines.",
        amount: "Published funding",
        who: "Who may be considered",
        partnerCutoff: "Prerequisite Partner Exchange deadline",
        deadlinePassed: "Partner Exchange cutoff passed",
        partnerDeadlineNotPassed: "Partner Exchange cutoff has not passed",
        studyPlanTitle: "Study Plan and credit transfer",
        studyPlanIntro: "A Study Plan is RMIT Vietnam’s approval of proposed courses for credit. Approval does not guarantee host-course availability or final host enrolment.",
        processing: "Processing after complete documents",
        forms: "Official forms",
        submitPlan: "Submit through Student Connect Online Portal",
        storiesTitle: "Student experiences",
        storiesText: "Read RMIT student stories about Cross-campus and exchange. These are personal experiences, not guarantees of outcomes or eligibility.",
        storiesLink: "Read Exchange Student Stories",
        contactTitle: "Global Experience Office",
        hours: "Monday–Friday, 9:00 am–12:00 pm and 1:00–5:00 pm",
        offices: "Offices: 1.3.08, Saigon South · 1.1.006, Hanoi",
        consultation: "Book a consultation (advance booking preferred)",
        verified: "Sources last checked",
        officialPage: "RMIT information",
        applicationDetails: "Application instructions",
        viewPortal: "Open official portal",
        closingTime: "11:59 pm",
        melbourneTime: "Melbourne time",
        seasonalTiming: "This timing is indicative only; check the live Mobi listings.",
        partnerLists: "Partner lists by study area (March 2025 PDFs; dated references).",
        fullPartnerList: "Open the current Mobi partner list",
        undergraduateList: "Undergraduate list",
        postgraduateList: "Postgraduate list",
      };
  const languageKey = language as "en" | "vi";
  const programBadgeLabels: Record<GlobalExperienceProgram["id"], string> = language === "vi"
    ? {
        "partner-exchange": "Partner Exchange",
        "cross-campus-melbourne": "Cross-campus Melbourne",
        "interlocation-asia": "Interlocation châu Á",
        "global-short-programs": "Chương trình ngắn hạn",
      }
    : {
        "partner-exchange": "Partner Exchange",
        "cross-campus-melbourne": "Cross-campus Melbourne",
        "interlocation-asia": "Interlocation in Asia",
        "global-short-programs": "Global Short Programs",
      };
  const now = new Date();
  const statusText = (status: GlobalApplicationStatus) => applicationStatusLabel[languageKey][status];
  const getProgramStatus = (program: GlobalExperienceProgram) => {
    const statuses = program.cycles.map((cycle) => ({ cycle, status: getApplicationCycleStatus(cycle, now) }));
    const selected = statuses.find(({ status }) => status === "open") ?? statuses.find(({ status }) => status === "upcoming");
    if (selected) {
      const date = selected.status === "upcoming" && selected.cycle.opensOn
        ? formatGlobalExperienceDate(selected.cycle.opensOn, languageKey)
        : undefined;
      return {
        status: selected.status,
        label: statusText(selected.status),
        detail: `${selected.cycle.label[languageKey]}${date ? ` · ${languageKey === "vi" ? "mở ngày" : "opens"} ${date}` : ""}`,
      };
    }
    if (program.cycles.length > 0) {
      return {
        status: "closed" as const,
        label: statusText("closed"),
        detail: language === "vi" ? "Các đợt 2027 đã công bố đều đã qua hạn." : "All published 2027 rounds have passed.",
      };
    }
    return {
      status: "not_announced" as const,
      label: language === "vi" ? "Tùy chương trình" : "Program-specific",
      detail: language === "vi" ? "Xem cổng Mobi để kiểm tra đợt hiện hành." : "Check Mobi for current program listings.",
    };
  };

  return (
    <div id="guide-steps" className="space-y-12 scroll-mt-24">
      <nav aria-label={copy.navLabel} className="border-y border-[var(--border)] py-3">
        <div className="flex flex-wrap gap-2">
          {[
            ["#global-programs", copy.programs],
            ["#global-comparison", copy.comparison],
            ["#global-scholarships", copy.scholarships],
            ["#global-study-plan", copy.studyPlan],
            ["#global-stories", copy.stories],
            ["#global-contact", copy.office],
          ].map(([href, label]) => (
            <a key={href} href={href} className="inline-flex min-h-11 items-center border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-xs font-semibold text-[var(--main-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="global-programs" className="scroll-mt-24 space-y-5" aria-labelledby="global-programs-heading">
        <div className="max-w-3xl space-y-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">01 / {copy.programs}</p>
          <h2 id="global-programs-heading" className="text-2xl font-bold text-[var(--main-text)] sm:text-3xl">{copy.overview}</h2>
          <p className="text-sm leading-6 text-[var(--secondary-text)]">{copy.overviewText}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {GLOBAL_EXPERIENCE_PROGRAMS.map((program) => {
            const status = getProgramStatus(program);
            return (
              <article key={program.id} id={`program-${program.id}`} className="editorial-card min-w-0 space-y-4 p-5 sm:p-6 scroll-mt-24">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{programBadgeLabels[program.id]}</p>
                    <h3 className="text-lg font-bold text-[var(--main-text)]">{program.title[languageKey]}</h3>
                  </div>
                  <StatusBadge status={status.status} label={status.label} />
                </div>
                <p className="text-sm leading-6 text-[var(--secondary-text)]">{program.summary[languageKey]}</p>
                <dl className="grid gap-3 border-y border-[var(--border)] py-3 sm:grid-cols-2">
                  <div>
                    <dt className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--secondary-text)]">{copy.destination}</dt>
                    <dd className="mt-1 text-sm text-[var(--main-text)]">{program.destination[languageKey]}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--secondary-text)]">{copy.duration}</dt>
                    <dd className="mt-1 text-sm text-[var(--main-text)]">{program.duration[languageKey]}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--secondary-text)]">{copy.fees}</dt>
                    <dd className="mt-1 text-sm leading-5 text-[var(--main-text)]">{program.tuitionAndCosts[languageKey]}</dd>
                  </div>
                </dl>
                <p className="text-xs leading-5 text-[var(--secondary-text)]">{status.detail}</p>
                <div className="flex flex-wrap gap-2">
                  <a href={program.applicationPortalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 bg-[var(--accent)] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                    {program.applicationPortalLabel[languageKey]} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a href={program.informationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 border border-[var(--border)] px-3.5 text-xs font-semibold text-[var(--main-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                    {copy.officialPage} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  {program.instructionsUrl && program.instructionsUrl !== program.informationUrl && (
                    <a href={program.instructionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 border border-[var(--border)] px-3.5 text-xs font-semibold text-[var(--main-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                      {copy.applicationDetails} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <details className="border-t border-[var(--border)] pt-3">
                  <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                    {language === "vi" ? "Điều kiện, hồ sơ và các bước" : "Eligibility, documents and steps"}
                  </summary>
                  <div className="space-y-5 pt-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--main-text)]">{copy.eligibility}</h4>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--secondary-text)]">
                        {program.eligibility.map((item) => <li key={item.en}>{item[languageKey]}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--main-text)]">{language === "vi" ? "Các bước nộp hồ sơ" : "Application steps"}</h4>
                      <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-[var(--secondary-text)]">
                        {program.applicationSteps.map((step) => <li key={step.en}>{step[languageKey]}</li>)}
                      </ol>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--main-text)]">{language === "vi" ? "Hồ sơ cần chuẩn bị" : "Prepare these documents"}</h4>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--secondary-text)]">
                        {program.requiredDocuments.map((item) => <li key={item.en}>{item[languageKey]}</li>)}
                      </ul>
                    </div>
                    {program.cycles.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wide text-[var(--main-text)]">{language === "vi" ? "Lịch các đợt đã công bố" : "Published intake dates"}</h4>
                        <div className="mt-2 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                          {program.cycles.map((cycle) => {
                            const cycleStatus = getApplicationCycleStatus(cycle);
                            return (
                              <div key={cycle.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-[var(--main-text)]">{cycle.label[languageKey]}</p>
                                  <p className="mt-1 text-xs text-[var(--secondary-text)]">
                                    {cycle.opensOn && <span>{language === "vi" ? "Mở" : "Opens"} {formatGlobalExperienceDate(cycle.opensOn, languageKey)}</span>}
                                    {cycle.opensOn && cycle.closesOn && <span> · </span>}
                                    {cycle.closesOn && <span>{language === "vi" ? "Đóng" : "Closes"} {formatGlobalExperienceDate(cycle.closesOn, languageKey)} ({copy.closingTime} {copy.melbourneTime})</span>}
                                  </p>
                                </div>
                                <StatusBadge status={cycleStatus} label={statusText(cycleStatus)} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {program.notes && <p className="border-l-2 border-[var(--primary-navy)] bg-[var(--surface-elevated)] p-3 text-xs leading-5 text-[var(--secondary-text)]">{program.notes[languageKey]}</p>}
                    {program.id === "partner-exchange" && (
                      <div className="space-y-2 border-t border-[var(--border)] pt-4">
                        <p className="text-xs font-semibold text-[var(--main-text)]">{copy.partnerLists}</p>
                        <a href={GLOBAL_EXPERIENCE_URLS.partnerList} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                          {copy.fullPartnerList} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                        <div className="flex flex-wrap gap-x-4">
                          <a href={GLOBAL_EXPERIENCE_URLS.partnerUndergraduateList} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-xs text-[var(--secondary-text)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                            {copy.undergraduateList} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                          <a href={GLOBAL_EXPERIENCE_URLS.partnerPostgraduateList} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-xs text-[var(--secondary-text)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                            {copy.postgraduateList} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </details>
              </article>
            );
          })}
        </div>
        <p className="inline-flex items-start gap-2 border-l-4 border-[var(--primary-navy)] bg-[var(--surface-elevated)] p-4 text-sm leading-6 text-[var(--secondary-text)]">
          <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
          <span>{copy.portalNote}</span>
        </p>
      </section>

      <section id="global-comparison" className="scroll-mt-24 space-y-4" aria-labelledby="global-comparison-heading">
        <div className="max-w-3xl space-y-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">02 / {copy.comparison}</p>
          <h2 id="global-comparison-heading" className="text-2xl font-bold text-[var(--main-text)] sm:text-3xl">{copy.compareTitle}</h2>
          <p className="text-sm leading-6 text-[var(--secondary-text)]">{copy.compareIntro}</p>
        </div>
        <p className="text-xs text-[var(--secondary-text)] sm:hidden">
          {language === "vi" ? "Vuốt ngang để xem đầy đủ bảng so sánh." : "Swipe horizontally to view the full comparison."}
        </p>
        <div className="overflow-x-auto border border-[var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" role="region" aria-label={copy.compareTitle} tabIndex={0}>
          <table className="min-w-[760px] w-full border-collapse text-left text-xs">
            <thead className="bg-[var(--surface-elevated)] text-[var(--main-text)]">
              <tr>
                {[copy.program, copy.destination, copy.duration, copy.eligibility, copy.fees].map((heading) => <th key={heading} scope="col" className="border-b border-[var(--border)] p-3 font-semibold">{heading}</th>)}
              </tr>
            </thead>
            <tbody>
              {GLOBAL_EXPERIENCE_PROGRAMS.map((program) => (
                <tr key={program.id} className="align-top text-[var(--secondary-text)]">
                  <th scope="row" className="border-b border-[var(--border)] p-3 font-semibold text-[var(--main-text)]">{program.title[languageKey]}</th>
                  <td className="border-b border-[var(--border)] p-3 leading-5">{program.destination[languageKey]}</td>
                  <td className="border-b border-[var(--border)] p-3 leading-5">{program.duration[languageKey]}</td>
                  <td className="border-b border-[var(--border)] p-3 leading-5">{program.comparisonEligibility[languageKey]}</td>
                  <td className="border-b border-[var(--border)] p-3 leading-5">{program.tuitionAndCosts[languageKey]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="border-l-4 border-[var(--accent)] bg-[var(--surface-elevated)] p-5" aria-labelledby="permanent-transfer-distinction">
        <h2 id="permanent-transfer-distinction" className="text-base font-bold text-[var(--main-text)]">{copy.transferTitle}</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--secondary-text)]">{copy.transferText}</p>
        <a href={GLOBAL_EXPERIENCE_URLS.permanentTransfer} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
          {copy.permanentTransfer} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </aside>

      <section id="global-scholarships" className="scroll-mt-24 space-y-5" aria-labelledby="global-scholarships-heading">
        <div className="max-w-3xl space-y-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">03 / {copy.scholarships}</p>
          <h2 id="global-scholarships-heading" className="text-2xl font-bold text-[var(--main-text)] sm:text-3xl">{copy.scholarshipTitle}</h2>
          <p className="text-sm leading-6 text-[var(--secondary-text)]">{copy.scholarshipIntro}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {GLOBAL_EXPERIENCE_SCHOLARSHIPS.map((scholarship) => {
            const deadlineStatus = scholarship.partnerDeadline ? getDeadlineStatus(scholarship.partnerDeadline) : null;
            const partnerDeadlineLabel = deadlineStatus === "closed"
              ? copy.deadlinePassed
              : copy.partnerDeadlineNotPassed;
            return (
              <article key={scholarship.id} className="editorial-card space-y-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-[var(--main-text)]">{scholarship.title[languageKey]}</h3>
                    <p className="mt-1 text-xs text-[var(--secondary-text)]">{scholarship.intake[languageKey]}</p>
                  </div>
                  {deadlineStatus && <StatusBadge status={deadlineStatus} label={partnerDeadlineLabel} />}
                </div>
                <div className="space-y-2 text-sm leading-5 text-[var(--secondary-text)]">
                  <p><strong className="text-[var(--main-text)]">{copy.amount}: </strong>{scholarship.amount[languageKey]}</p>
                  <p><strong className="text-[var(--main-text)]">{copy.who}: </strong>{scholarship.eligibility[languageKey]}</p>
                  <p><strong className="text-[var(--main-text)]">{copy.process}: </strong>{scholarship.application[languageKey]}</p>
                  {scholarship.partnerDeadline && <p><strong className="text-[var(--main-text)]">{copy.partnerCutoff}: </strong>{formatGlobalExperienceDate(scholarship.partnerDeadline, languageKey)} — {partnerDeadlineLabel}</p>}
                </div>
                <a href={scholarship.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                  {copy.officialPage} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section id="global-study-plan" className="scroll-mt-24 space-y-5" aria-labelledby="global-study-plan-heading">
        <div className="max-w-3xl space-y-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">04 / {copy.studyPlan}</p>
          <h2 id="global-study-plan-heading" className="text-2xl font-bold text-[var(--main-text)] sm:text-3xl">{copy.studyPlanTitle}</h2>
          <p className="text-sm leading-6 text-[var(--secondary-text)]">{GLOBAL_EXPERIENCE_STUDY_PLAN.overview[languageKey]}</p>
        </div>
        <ol className="space-y-3">
          {GLOBAL_EXPERIENCE_STUDY_PLAN.steps.map((step, index) => (
            <li key={step.en} className="editorial-card flex gap-3 p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[var(--primary-navy)] text-xs font-bold text-white">{index + 1}</span>
              <p className="text-sm leading-6 text-[var(--secondary-text)]">{step[languageKey]}</p>
            </li>
          ))}
        </ol>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="editorial-info space-y-2 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--main-text)]">{language === "vi" ? "Khối lượng học theo lộ trình" : "Program study loads"}</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-5 text-[var(--secondary-text)]">
              {GLOBAL_EXPERIENCE_STUDY_PLAN.programLoads.map((item) => <li key={item.en}>{item[languageKey]}</li>)}
            </ul>
          </div>
          <div className="editorial-info space-y-2 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--main-text)]">{copy.processing}</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-5 text-[var(--secondary-text)]">
              {GLOBAL_EXPERIENCE_STUDY_PLAN.processingTimes.map((item) => <li key={item.en}>{item[languageKey]}</li>)}
            </ul>
          </div>
        </div>
        <div className="editorial-card space-y-3 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--main-text)]">{copy.forms}</h3>
          <div className="flex flex-wrap gap-2">
            {[
              [GLOBAL_EXPERIENCE_URLS.crossCampusStudyPlanForm, language === "vi" ? "Biểu mẫu Cross-campus/Interlocation (.xlsx)" : "Cross-campus/Interlocation Study Plan (.xlsx)"],
              [GLOBAL_EXPERIENCE_URLS.crossCampusStudyPlanExample, language === "vi" ? "Ví dụ Study Plan Cross-campus (.xlsx)" : "Cross-campus Study Plan example (.xlsx)"],
              [GLOBAL_EXPERIENCE_URLS.partnerStudyPlanForm, language === "vi" ? "Biểu mẫu Partner Exchange/Short Program (.xlsx)" : "Partner Exchange/Short Program form (.xlsx)"],
              [GLOBAL_EXPERIENCE_URLS.partnerStudyPlanExample, language === "vi" ? "Ví dụ Partner Study Plan (.xlsx)" : "Partner Study Plan example (.xlsx)"],
            ].map(([url, label]) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 border border-[var(--border)] px-3 text-xs font-semibold text-[var(--main-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                {label} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
          <a href={GLOBAL_EXPERIENCE_URLS.studyPlanSubmission} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
            {copy.submitPlan} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a href={GLOBAL_EXPERIENCE_URLS.studyPlan} target="_blank" rel="noopener noreferrer" className="ml-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
            {copy.officialPage} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section id="global-stories" className="editorial-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between scroll-mt-24" aria-labelledby="global-stories-heading">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">05 / {copy.stories}</p>
          <h2 id="global-stories-heading" className="mt-2 text-xl font-bold text-[var(--main-text)]">{copy.storiesTitle}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--secondary-text)]">{copy.storiesText}</p>
        </div>
        <a href={GLOBAL_EXPERIENCE_URLS.studentStories} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 bg-[var(--accent)] px-4 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
          {copy.storiesLink} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </section>

      <section id="global-contact" className="editorial-info grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-start scroll-mt-24" aria-labelledby="global-contact-heading">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">06 / {copy.office}</p>
          <h2 id="global-contact-heading" className="mt-2 text-xl font-bold text-[var(--main-text)]">{copy.contactTitle}</h2>
          <p className="mt-2 text-sm text-[var(--secondary-text)]">{copy.hours}</p>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">{copy.offices}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a href="mailto:mobility@rmit.edu.vn" className="min-h-11 inline-flex items-center text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">mobility@rmit.edu.vn</a>
            <a href="tel:+842837761494" className="min-h-11 inline-flex items-center text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">(84) 28 3776 1494</a>
          </div>
        </div>
        <a href={GLOBAL_EXPERIENCE_URLS.consultation} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 border border-[var(--border)] px-3.5 text-xs font-semibold text-[var(--main-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
          {copy.consultation} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </section>

      <footer className="border-t border-[var(--border)] pt-4 text-xs text-[var(--secondary-text)]">
        <span>{copy.verified}: {GLOBAL_EXPERIENCE_LAST_VERIFIED}.</span>
        <span className="ml-2">{copy.deadlineTimezone}</span>
        <span className="ml-2">{copy.seasonalTiming}</span>
      </footer>
    </div>
  );
}
