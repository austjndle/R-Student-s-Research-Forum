"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ExternalLink, Mail } from "lucide-react";
import type { ClubRecord } from "../data/clubs";
import type { ClubProfileImage } from "../data/profile-types";
import { useLanguage } from "@/shared/i18n/context"
import { clubDirectoryHref, clubDirectoryQuery, type ClubDirectoryContext } from "../domain/navigation";

export type ClubSidebarItem = Pick<ClubRecord, "id" | "nameEn" | "nameVi">;
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2";
const externalLink = `inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline ${focus}`;

function ClubThumbnail({ image }: { image: ClubProfileImage }) {
  const { language, t } = useLanguage();
  const [failed, setFailed] = useState(false);
  return (
    <figure className="min-w-0">
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden border border-[var(--border)] bg-[var(--surface-elevated)]">
        {!failed ? (
          <img src={image.url} alt={image.alt[language]} className="h-full w-full object-cover" loading="eager" decoding="async" onError={() => setFailed(true)} />
        ) : <span className="px-4 text-center text-xs text-[var(--secondary-text)]">{t.clubs.imageUnavailable}</span>}
      </div>
      <figcaption className="mt-2 text-[11px] text-[var(--secondary-text)]">{t.clubs.photoCredit}</figcaption>
    </figure>
  );
}

export function ClubDetail({ club, sidebarClubs = [], directoryContext }: { club: ClubRecord; sidebarClubs?: ClubSidebarItem[]; directoryContext?: ClubDirectoryContext }) {
  const { language, t } = useLanguage();
  const profile = club.profile;
  const clubName = language === "vi" ? club.nameVi : club.nameEn;
  const campus = club.campus === "saigon_south" ? t.common.saigonSouth : t.common.hanoi;
  const categoryLabels = {
    academic: t.clubs.categoryAcademic,
    active: t.clubs.categoryActive,
    creative_collectives: t.clubs.categoryCreative,
    social_special_interest: t.clubs.categorySocial,
  };
  const category = profile?.officialCategory[language] ?? categoryLabels[club.category];
  const directory = clubDirectoryHref(directoryContext ?? { campus: club.campus, category: club.category, query: "" });
  const categoryHref = clubDirectoryHref({ campus: club.campus, category: club.category, query: "" });
  const introduction = profile?.summary[language] ?? (language === "vi" ? club.descriptionVi : club.descriptionEn) ?? t.clubs.directoryOnly;
  const email = profile ? profile.contactEmail : club.contactEmail;
  const facebook = profile ? profile.facebookUrl : club.facebookUrl;
  const image = profile?.images[0] ?? (club.imageUrl ? {
    url: club.imageUrl,
    alt: { en: `${club.nameEn} — ${t.clubs.imageAlt}`, vi: `${club.nameVi} — ${t.clubs.imageAlt}` },
    sourceUrl: club.officialClubUrl ?? club.sourceUrl,
    kind: "logo" as const,
  } : undefined);
  const contextQuery = clubDirectoryQuery(directoryContext ?? { campus: club.campus, category: club.category, query: "" });

  return (
    <div className="min-w-0">
      <header className="bg-[var(--primary-navy)] text-white">
        <div className="mx-auto w-[min(100%-2rem,1200px)] px-0 py-14 sm:py-20">
          <span className="mb-5 block h-1 w-8 bg-[var(--accent)]" aria-hidden="true" />
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{campus}</p>
          <h1 className="mt-3 break-words text-4xl font-bold tracking-[-0.04em] sm:text-6xl">{clubName}</h1>
        </div>
      </header>

      <div className="editorial-shell !py-0">
        <nav aria-label={t.clubs.directoryTitle} className="border-b border-[var(--border)] py-5 text-sm text-[var(--secondary-text)]">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li><Link href={directory} className={`inline-flex min-h-10 items-center gap-1 hover:text-[var(--accent)] ${focus}`}><ArrowLeft className="h-4 w-4" aria-hidden="true" />{t.clubs.directoryTitle}</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li><Link href={categoryHref} className={`inline-flex min-h-10 items-center hover:text-[var(--accent)] ${focus}`}>{category}</Link></li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="min-w-0 break-words font-medium text-[var(--main-text)]">{clubName}</li>
          </ol>
        </nav>

        <div className="grid min-w-0 gap-8 py-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10 lg:py-10">
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start" aria-label={language === "vi" ? "Danh sách câu lạc bộ" : "Club list"}>
            <div className="border border-[var(--border)] bg-[var(--surface)]">
              <Link href={directory} className={`flex min-h-12 items-center gap-2 border-b border-[var(--border)] px-4 text-sm font-semibold text-[var(--accent)] ${focus}`}><ArrowLeft className="h-4 w-4" aria-hidden="true" />{language === "vi" ? "Quay lại danh sách" : "Back to clubs"}</Link>
              <nav className="max-h-72 overflow-y-auto lg:max-h-[calc(100vh-10rem)]" aria-label={language === "vi" ? "Các câu lạc bộ cùng nhóm" : "Clubs in this group"}>
                {sidebarClubs.map((item) => {
                  const itemName = language === "vi" ? item.nameVi : item.nameEn;
                  const active = item.id === club.id;
                  return <Link key={item.id} href={`/clubs/${item.id}?${contextQuery}`} aria-current={active ? "page" : undefined} className={`block min-h-12 border-b border-[var(--border)] px-4 py-3 text-sm ${active ? "bg-[var(--primary-navy)] text-white" : "text-[var(--main-text)] hover:bg-[var(--surface-elevated)] hover:text-[var(--accent)]"} ${focus}`}>{itemName}</Link>;
                })}
              </nav>
            </div>
          </aside>

          <div className="min-w-0 space-y-10">
            <section aria-labelledby="club-overview-title">
              <h2 id="club-overview-title" className="text-3xl font-semibold tracking-[-0.03em] text-[var(--main-text)]">{t.clubs.overview}</h2>
              <dl className="mt-6 grid gap-x-8 sm:grid-cols-2">
                <div className="border-b border-[var(--border)] py-4"><dt className="text-xs font-semibold text-[var(--secondary-text)]">{t.clubs.category}</dt><dd className="mt-1 text-base text-[var(--main-text)]">{category}</dd></div>
                <div className="border-b border-[var(--border)] py-4"><dt className="text-xs font-semibold text-[var(--secondary-text)]">{t.common.campus}</dt><dd className="mt-1 text-base text-[var(--main-text)]">RMIT {campus}</dd></div>
                <div className="border-b border-[var(--border)] py-4"><dt className="text-xs font-semibold text-[var(--secondary-text)]">{t.contacts.email}</dt><dd className="mt-1 text-base">{email ? <a href={`mailto:${email}`} className={`break-words text-[var(--accent)] hover:underline ${focus}`}>{email}</a> : <span className="text-[var(--secondary-text)]">{t.clubs.notPublished}</span>}</dd></div>
                <div className="border-b border-[var(--border)] py-4"><dt className="text-xs font-semibold text-[var(--secondary-text)]">Facebook</dt><dd className="mt-1 text-base">{facebook ? <a href={facebook} target="_blank" rel="noopener noreferrer" className={externalLink}>Facebook <ExternalLink className="h-4 w-4" aria-hidden="true" /></a> : <span className="text-[var(--secondary-text)]">{t.clubs.notPublished}</span>}</dd></div>
              </dl>
            </section>

            <section className="grid min-w-0 gap-8 sm:grid-cols-[minmax(0,1fr)_12rem]" aria-labelledby="club-about-title">
              <div className="min-w-0">
                <h2 id="club-about-title" className="text-3xl font-semibold tracking-[-0.03em] text-[var(--main-text)]">{t.clubs.about} {clubName}</h2>
                <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--secondary-text)]">{introduction}</p>
              </div>
              {image && <ClubThumbnail image={image} />}
            </section>

            <footer className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--border)] pt-5 text-xs text-[var(--secondary-text)]">
              {club.officialClubUrl && <a href={club.officialClubUrl} target="_blank" rel="noopener noreferrer" className={externalLink}>{t.clubs.officialPage}<ExternalLink className="h-4 w-4" aria-hidden="true" /></a>}
              <a href={club.campusListPdfUrl} target="_blank" rel="noopener noreferrer" className={externalLink}>{t.clubs.campusList}<ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
              <span>{t.common.lastVerified}: <time dateTime={club.lastVerifiedDate}>{club.lastVerifiedDate}</time></span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
