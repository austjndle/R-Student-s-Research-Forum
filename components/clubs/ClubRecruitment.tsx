"use client";

import { ExternalLink } from "lucide-react";
import type { ClubRecruitment as RecruitmentData } from "@/data/clubs/recruitment";
import { useLanguage } from "@/lib/i18n/context";

export function ClubRecruitment({ recruitment }: { recruitment: RecruitmentData }) {
  const { language, t } = useLanguage();
  const statusLabels = {
    recruiting: t.clubs.recruiting,
    closed: t.clubs.closed,
    upcoming: t.clubs.upcoming,
    not_announced: t.clubs.notAnnounced,
    unverified: t.clubs.unverified,
  };
  const requirements = { yes: t.clubs.yes, no: t.clubs.no, not_confirmed: t.clubs.notConfirmed };
  const steps = language === "vi" ? recruitment.applicationProcessVi : recruitment.applicationProcessEn;
  const linkClass = "inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

  return (
    <section id="club-join" className="scroll-mt-24" aria-labelledby="club-join-title">
      <div className="editorial-card p-4 sm:p-6">
        <div className="flex min-h-11 items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 id="club-join-title" className="text-xl font-semibold text-[var(--main-text)]">{t.clubs.howToJoin}</h2>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">{t.clubs.recruitmentStatus}: {statusLabels[recruitment.recruitmentStatus]}</p>
          </div>
        </div>
        <div className="mt-5 space-y-6 border-t border-[var(--border)] pt-5 text-sm leading-6 text-[var(--secondary-text)]">
          <div className="grid gap-5 sm:grid-cols-2">
            <div><h3 className="font-semibold text-[var(--main-text)]">{t.clubs.generalMember}</h3><p className="mt-2">{language === "vi" ? recruitment.generalMembershipVi : recruitment.generalMembershipEn}</p></div>
            <div><h3 className="font-semibold text-[var(--main-text)]">{t.clubs.committeeCoreTeam}</h3><p className="mt-2">{language === "vi" ? recruitment.committeeRecruitmentVi : recruitment.committeeRecruitmentEn}</p></div>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--main-text)]">{t.clubs.applicationProcess}</h3>
            <ol className="mt-2 list-decimal space-y-2 pl-5">{steps.map((step) => <li key={step}>{step}</li>)}</ol>
          </div>
          <dl className="grid gap-4 border-y border-[var(--border)] py-4 sm:grid-cols-3">
            <div><dt className="font-semibold text-[var(--main-text)]">{t.clubs.interviewRequired}</dt><dd>{requirements[recruitment.interviewRequired]}</dd></div>
            <div><dt className="font-semibold text-[var(--main-text)]">{t.clubs.cvPortfolio}</dt><dd>{requirements[recruitment.cvPortfolioRequired]}</dd></div>
            <div><dt className="font-semibold text-[var(--main-text)]">{t.clubs.tryout}</dt><dd>{requirements[recruitment.tryoutRequired]}</dd></div>
            <div className="sm:col-span-2"><dt className="font-semibold text-[var(--main-text)]">{t.clubs.eligibility}</dt><dd>{language === "vi" ? recruitment.eligibilityVi : recruitment.eligibilityEn}</dd></div>
            <div><dt className="font-semibold text-[var(--main-text)]">{t.clubs.deadline}</dt><dd>{recruitment.applicationDeadline ?? t.clubs.noDeadline}</dd></div>
          </dl>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {recruitment.applicationUrl && <a className={linkClass} href={recruitment.applicationUrl} target="_blank" rel="noopener noreferrer">{t.clubs.applicationLink}<ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" /></a>}
            {recruitment.recruitmentAnnouncementUrl && <a className={linkClass} href={recruitment.recruitmentAnnouncementUrl} target="_blank" rel="noopener noreferrer">{t.clubs.recruitmentAnnouncement}<ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" /></a>}
            {!recruitment.applicationUrl && !recruitment.recruitmentAnnouncementUrl && <p>{t.clubs.noCurrentAnnouncement}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <a href={recruitment.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>{t.clubs.source}<ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
            <span>{t.common.lastVerified}: <time dateTime={recruitment.lastVerifiedDate}>{recruitment.lastVerifiedDate}</time></span>
          </div>
        </div>
      </div>
    </section>
  );
}
