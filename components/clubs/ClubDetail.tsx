"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ExternalLink, Mail, MessageSquare } from "lucide-react";
import type { ClubRecord } from "@/data/clubs/clubs";
import type { ClubProfileImage } from "@/data/clubs/profile-types";
import { useLanguage } from "@/lib/i18n/context";
import { clubDirectoryHref, type ClubDirectoryContext } from "@/lib/clubs/navigation";
import { requestOpenMrHachiware } from "@/components/chat/chatEvents";
import { ClubRecruitment } from "./ClubRecruitment";

type RelatedClub = Pick<ClubRecord, "id" | "nameEn" | "nameVi" | "campus" | "category" | "descriptionEn" | "descriptionVi">;
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2";
const externalLink = `inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline ${focus}`;

function ClubImage({ image, eager = false }: { image: ClubProfileImage; eager?: boolean }) {
  const { language, t } = useLanguage();
  const [failed, setFailed] = useState(false);
  return (
    <figure className="min-w-0">
      <div className="flex aspect-[4/3] w-full items-center justify-center border border-[var(--border)] bg-[var(--surface-elevated)]">
        {failed ? <p role="status" className="p-6 text-center text-sm text-[var(--secondary-text)]">{t.clubs.imageUnavailable}</p> : (
          <img src={image.url} alt={image.alt[language]} width={800} height={600} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)} className={`h-full w-full object-contain ${image.kind === "logo" ? "p-6" : ""}`} />
        )}
      </div>
      <figcaption className="mt-2 text-xs text-[var(--secondary-text)]">
        <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-6 items-center gap-1 hover:text-[var(--accent)] hover:underline ${focus}`}>
          {t.clubs.photoCredit}<ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}

export function ClubDetail({ club, relatedClubs = [], directoryContext }: { club: ClubRecord; relatedClubs?: RelatedClub[]; directoryContext?: ClubDirectoryContext }) {
  const { language, t } = useLanguage();
  const profile = club.profile;
  const clubName = language === "vi" ? club.nameVi : club.nameEn;
  const categoryLabels = {
    academic: t.clubs.categoryAcademic,
    active: t.clubs.categoryActive,
    creative_collectives: t.clubs.categoryCreative,
    social_special_interest: t.clubs.categorySocial,
  };
  const category = profile?.officialCategory[language] ?? categoryLabels[club.category];
  const campus = club.campus === "saigon_south" ? t.common.saigonSouth : t.common.hanoi;
  const directory = clubDirectoryHref(directoryContext ?? { campus: club.campus, category: club.category, query: "" });
  const categoryHref = clubDirectoryHref({ campus: club.campus, category: club.category, query: "" });
  const introduction = profile?.summary[language] ?? (language === "vi" ? club.descriptionVi : club.descriptionEn) ?? t.clubs.directoryOnly;
  const primaryImage: ClubProfileImage | undefined = profile?.images[0] ?? (club.imageUrl ? {
    url: club.imageUrl,
    alt: { en: `${club.nameEn} — ${t.clubs.imageAlt}`, vi: `${club.nameVi} — ${t.clubs.imageAlt}` },
    sourceUrl: club.officialClubUrl ?? club.sourceUrl,
    kind: "logo",
  } : undefined);
  const additionalImages = profile?.images.slice(1) ?? [];
  const sourceLinks = [
    club.officialClubUrl ? { label: t.clubs.officialPage, url: club.officialClubUrl } : null,
    { label: t.clubs.campusList, url: club.campusListPdfUrl },
  ].filter((source): source is { label: string; url: string } => Boolean(source));

  return (
    <div className="editorial-shell space-y-7 sm:space-y-9">
      <nav aria-label={t.clubs.directoryTitle} className="text-sm text-[var(--secondary-text)]">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li><Link href={directory} className={`inline-flex min-h-8 items-center gap-1 hover:text-[var(--accent)] ${focus}`}><ArrowLeft className="h-4 w-4" aria-hidden="true" />{t.clubs.directoryTitle}</Link></li>
          <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link href={categoryHref} className={`inline-flex min-h-8 items-center hover:text-[var(--accent)] ${focus}`}>{categoryLabels[club.category]}</Link></li>
          <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
          <li aria-current="page" className="min-w-0 break-words font-medium text-[var(--main-text)]">{clubName}</li>
        </ol>
      </nav>

      <header className={`grid min-w-0 items-center gap-6 border-b border-[var(--border)] pb-7 ${primaryImage ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10" : ""}`}>
        <div className="min-w-0 space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--accent)]">{campus} / {category}</p>
          <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-[var(--main-text)] sm:text-4xl">{clubName}</h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--secondary-text)]">{introduction}</p>
          <a href="#club-join" className={`inline-flex min-h-11 items-center justify-center border border-[var(--accent)] bg-[var(--accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] ${focus}`}>{t.clubs.howToJoin}</a>
        </div>
        {primaryImage && <ClubImage key={primaryImage.url} image={primaryImage} eager />}
      </header>

      <nav aria-label={t.clubs.onThisPage} className="flex flex-wrap gap-x-5 gap-y-1 border-b border-[var(--border)] pb-3 text-sm font-medium text-[var(--secondary-text)]">
        {[
          ["#club-overview", t.clubs.overview],
          ["#club-about", t.clubs.about],
          ...(profile?.activities.length ? [["#club-activities", t.clubs.activities]] : []),
          ...(additionalImages.length ? [["#club-gallery", t.clubs.gallery]] : []),
          ["#club-join", t.clubs.howToJoin],
          ["#club-sources", t.clubs.source],
        ].map(([href, label]) => <a key={href} href={href} className={`inline-flex min-h-11 items-center hover:text-[var(--accent)] ${focus}`}>{label}</a>)}
      </nav>

      <section id="club-overview" aria-labelledby="club-overview-title" className="scroll-mt-24 space-y-4">
        <h2 id="club-overview-title" className="text-xl font-semibold text-[var(--main-text)]">{t.clubs.overview}</h2>
        <dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0 border-b border-[var(--border)] py-3"><dt className="text-xs font-semibold text-[var(--secondary-text)]">{t.clubs.category}</dt><dd className="mt-2 text-sm text-[var(--main-text)]">{category}</dd></div>
          <div className="min-w-0 border-b border-[var(--border)] py-3"><dt className="text-xs font-semibold text-[var(--secondary-text)]">{t.common.campus}</dt><dd className="mt-2 text-sm text-[var(--main-text)]">RMIT {campus}</dd></div>
          <div className="min-w-0 border-b border-[var(--border)] py-3"><dt className="text-xs font-semibold text-[var(--secondary-text)]">{t.contacts.email}</dt><dd className="mt-1 text-sm text-[var(--secondary-text)]">{club.contactEmail ? <a href={`mailto:${club.contactEmail}`} className={`inline-flex min-h-11 max-w-full items-center gap-2 text-[var(--accent)] hover:underline ${focus}`}><Mail className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="min-w-0 [overflow-wrap:anywhere]">{club.contactEmail}</span></a> : t.clubs.notPublished}</dd></div>
          <div className="min-w-0 border-b border-[var(--border)] py-3"><dt className="text-xs font-semibold text-[var(--secondary-text)]">{t.clubs.officialChannels}</dt><dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--secondary-text)]">
            {club.facebookUrl && <a href={club.facebookUrl} target="_blank" rel="noopener noreferrer" className={externalLink}>Facebook<ExternalLink className="h-4 w-4" aria-hidden="true" /></a>}
            {club.instagramUrl && <a href={club.instagramUrl} target="_blank" rel="noopener noreferrer" className={externalLink}>Instagram<ExternalLink className="h-4 w-4" aria-hidden="true" /></a>}
            {profile?.otherLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={`${externalLink} [overflow-wrap:anywhere]`}>{link.label}<ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" /></a>)}
            {!club.facebookUrl && !club.instagramUrl && !profile?.otherLinks.length && t.clubs.notPublished}
          </dd></div>
        </dl>
      </section>

      <div className={`grid min-w-0 gap-7 ${profile?.activities.length ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:gap-10" : "max-w-3xl"}`}>
        <section id="club-about" className="min-w-0 scroll-mt-24 space-y-4" aria-labelledby="club-about-title">
          <h2 id="club-about-title" className="text-xl font-semibold text-[var(--main-text)]">{t.clubs.about}</h2>
          {(profile?.about.length ? profile.about.map((paragraph) => paragraph[language]) : [t.clubs.directoryOnly]).map((paragraph, index) => <p key={index} className="text-base leading-7 text-[var(--secondary-text)] [overflow-wrap:anywhere]">{paragraph}</p>)}
          {profile?.sourceNotes && <p className="border-l-2 border-[var(--accent)] pl-4 text-sm leading-6 text-[var(--secondary-text)]">{profile.sourceNotes[language]}</p>}
        </section>
        {profile?.activities.length ? <section id="club-activities" className="min-w-0 scroll-mt-24 space-y-4" aria-labelledby="club-activities-title"><h2 id="club-activities-title" className="text-xl font-semibold text-[var(--main-text)]">{t.clubs.activities}</h2><ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-[var(--secondary-text)]">{profile.activities.map((activity, index) => <li key={index}>{activity[language]}</li>)}</ul></section> : null}
      </div>

      {additionalImages.length > 0 && <section id="club-gallery" className="scroll-mt-24 space-y-4" aria-labelledby="club-gallery-title"><h2 id="club-gallery-title" className="text-xl font-semibold text-[var(--main-text)]">{t.clubs.gallery}</h2><div className="grid gap-5 sm:grid-cols-2">{additionalImages.map((image) => <ClubImage key={image.url} image={image} />)}</div></section>}
      <ClubRecruitment recruitment={club.recruitment} />

      <section id="club-sources" className="scroll-mt-24 space-y-3 border-y border-[var(--border)] py-5" aria-labelledby="club-sources-title">
        <h2 id="club-sources-title" className="text-xl font-semibold text-[var(--main-text)]">{t.guides.officialReferences}</h2>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {sourceLinks.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className={externalLink}>{source.label}<ExternalLink className="h-4 w-4" aria-hidden="true" /></a></li>)}
          <li><button type="button" onClick={requestOpenMrHachiware} className={externalLink}><MessageSquare className="h-4 w-4" aria-hidden="true" />{t.clubs.askAboutClub}</button></li>
        </ul>
        <p className="text-xs leading-5 text-[var(--secondary-text)]">{t.common.lastVerified}: <time dateTime={club.lastVerifiedDate}>{club.lastVerifiedDate}</time>. {t.clubs.snapshotNotice}</p>
      </section>

      {relatedClubs.length > 0 && <section className="space-y-4" aria-labelledby="club-related-title"><div><h2 id="club-related-title" className="text-xl font-semibold text-[var(--main-text)]">{t.clubs.related}</h2><p className="mt-2 text-sm text-[var(--secondary-text)]">{t.clubs.relatedReason}</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{relatedClubs.map((related) => <Link key={related.id} href={`/clubs/${related.id}`} className={`editorial-card flex min-w-0 flex-col gap-3 p-4 transition-colors hover:border-[var(--accent)] ${focus}`}><h3 className="text-base font-semibold text-[var(--main-text)]">{language === "vi" ? related.nameVi : related.nameEn}</h3><p className="text-sm leading-6 text-[var(--secondary-text)]">{(language === "vi" ? related.descriptionVi : related.descriptionEn) ?? t.clubs.descriptionUnavailable}</p><span className="mt-auto inline-flex min-h-8 items-center gap-1 text-sm font-semibold text-[var(--accent)]">{t.clubs.viewClub}<ChevronRight className="h-4 w-4" aria-hidden="true" /></span></Link>)}</div></section>}
    </div>
  );
}
