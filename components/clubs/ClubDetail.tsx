"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Mail, MapPin, ShieldCheck } from "lucide-react";
import type { ClubRecord } from "@/data/clubs/clubs";
import { useLanguage } from "@/lib/i18n/context";

export function ClubDetail({ club }: { club: ClubRecord }) {
  const { language } = useLanguage();
  const campus = club.campus === "saigon_south" ? (language === "vi" ? "Nam Sài Gòn" : "Saigon South") : "Hanoi";
  const description = club.descriptionEn ?? (language === "vi" ? "RMIT đã xác minh tên câu lạc bộ trong danh sách chính thức. Mô tả chi tiết chưa được công bố trên nguồn công khai." : "RMIT has verified this club name in the official campus list. A detailed public description was not available.");

  return (
    <div className="editorial-shell space-y-10">
      <Link href="/clubs" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--secondary-text)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {language === "vi" ? "Quay lại danh sách câu lạc bộ" : "Back to club directory"}
      </Link>

      <header className="border-b border-[var(--border)] pb-8">
        {club.imageUrl && (
          <div className="mb-6 aspect-square w-full max-w-xs overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
            <img
              src={club.imageUrl}
              alt={club.imageAlt ?? `${club.nameEn} official club logo`}
              className="h-full w-full object-cover"
              decoding="async"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[var(--accent)]">
          <span>{campus}</span><span aria-hidden="true">/</span><span>{club.category.replaceAll("_", " ")}</span>
        </div>
        <h1 className="mt-4 max-w-4xl break-words text-4xl font-bold leading-tight tracking-[-0.04em] text-[var(--main-text)] sm:text-6xl">{club.nameEn}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--secondary-text)]">{description}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="space-y-6">
          <div className="editorial-panel space-y-3 p-6">
            <div className="flex items-center gap-2 text-[var(--accent)]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-lg font-bold text-[var(--main-text)]">{language === "vi" ? "Thông tin đã xác minh" : "Verified information"}</h2>
            </div>
            <p className="text-sm leading-6 text-[var(--secondary-text)]">
              {club.detailsStatus === "verified_detail"
                ? (language === "vi" ? "Thông tin được đối chiếu với trang club chính thức của RMIT." : "Information was checked against the official RMIT club page.")
                : (language === "vi" ? "Tên club được đối chiếu từ danh sách chính thức; chi tiết công khai còn hạn chế." : "The club name was checked against the official campus list; public details are limited.")}
            </p>
          </div>

          <div className="editorial-card space-y-4 p-6">
            <h2 className="text-lg font-bold text-[var(--main-text)]">{language === "vi" ? "Cách bắt đầu" : "How to get started"}</h2>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-[var(--secondary-text)]">
              <li>{language === "vi" ? "Mở trang chính thức hoặc Facebook của club nếu có." : "Open the official club page or Facebook page when available."}</li>
              <li>{language === "vi" ? "Hỏi về đợt tuyển thành viên, lịch tập hoặc hoạt động sắp tới." : "Ask about recruitment, training times, or upcoming activities."}</li>
              <li>{language === "vi" ? "Xác nhận campus và yêu cầu tham gia trực tiếp với club." : "Confirm the campus and joining requirements directly with the club."}</li>
            </ol>
          </div>
        </section>

        <aside className="editorial-info h-fit space-y-3 p-5">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--secondary-text)]">{language === "vi" ? "Kênh chính thức" : "Official channels"}</p>
          <div className="flex items-start gap-2 text-sm text-[var(--main-text)]"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />{campus}</div>
          {club.contactEmail && <a href={`mailto:${club.contactEmail}`} className="flex items-start gap-2 break-words text-sm text-[var(--accent)] hover:underline"><Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{club.contactEmail}</a>}
          {club.facebookUrl && <a href={club.facebookUrl} target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"><ExternalLink className="h-4 w-4" aria-hidden="true" />Facebook</a>}
          {club.instagramUrl && <a href={club.instagramUrl} target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"><ExternalLink className="h-4 w-4" aria-hidden="true" />Instagram</a>}
          {club.officialClubUrl && <a href={club.officialClubUrl} target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"><ExternalLink className="h-4 w-4" aria-hidden="true" />{language === "vi" ? "Trang RMIT" : "RMIT club page"}</a>}
          <a href={club.campusListPdfUrl} target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"><FileText className="h-4 w-4" aria-hidden="true" />{language === "vi" ? "Danh sách club PDF" : "Campus club list PDF"}</a>
          <p className="pt-2 font-mono text-[11px] text-[var(--secondary-text)]">{language === "vi" ? "Xác minh lần cuối" : "Last verified"}: {club.lastVerifiedDate}</p>
        </aside>
      </div>
    </div>
  );
}
