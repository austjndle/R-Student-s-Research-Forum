"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { RMIT_CAMPUS_HOURS, getLocalizedFloorLabel, getLocalizedScheduleLabel } from "@/data/facilities/campusHours";
import {
  Clock,
  Building2,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Search,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
const QUICK_BUILDING_LABELS: Record<string, { en: string; vi: string }> = {
  "sgs-b1": { en: "B1", vi: "B1" },
  "sgs-b2": { en: "B2", vi: "B2" },
  "sgs-b8": { en: "B8", vi: "B8" },
  "sgs-b9": { en: "B9", vi: "B9" },
  "sgs-active-hub": { en: "Active Hub", vi: "Active Hub" },
  "sgs-b10": { en: "B10", vi: "B10" },
  "hn-main": { en: "Hanoi", vi: "Hà Nội" },
};
function getQuickBuildingLabel(buildingId: string, language: "en" | "vi"): string {
  return QUICK_BUILDING_LABELS[buildingId]?.[language] ?? buildingId;
}


export default function CampusHoursPage() {
  const { language } = useLanguage();
  const [activeCampus, setActiveCampus] = useState<"saigon_south" | "hanoi">("saigon_south");
  const [activeBuildingId, setActiveBuildingId] = useState<string | null>("sgs-b1");
  const [searchFilter, setSearchFilter] = useState("");

  const buildings = RMIT_CAMPUS_HOURS.filter((b) => b.campus === activeCampus);

  const filteredBuildings = buildings.filter((b) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      b.nameEn.toLowerCase().includes(term) ||
      b.nameVi.toLowerCase().includes(term) ||
      b.floors.some(
        (f) =>
          f.floor.toLowerCase().includes(term) ||
          f.facilitiesEn.toLowerCase().includes(term) ||
          f.facilitiesVi.toLowerCase().includes(term)
      )
    );
  });

  return (
    <div className="editorial-shell space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] text-[var(--badge-text)] text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>{language === "vi" ? "Lịch giờ mở cửa tòa nhà RMIT Việt Nam" : "Official RMIT Vietnam Building Access Schedule"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--main-text)]">
          {language === "vi"
            ? "Giờ mở cửa & Vào tòa nhà các cơ sở (Saigon South & Hanoi)"
            : "RMIT Vietnam Building & Floor Access Hours (SGS & Hanoi)"}
        </h1>
        <p className="text-sm sm:text-base text-[var(--secondary-text)] max-w-3xl leading-relaxed">
          {language === "vi"
            ? "Thông tin chi tiết thời gian mở và đóng cửa từng tầng, từng tòa nhà, thư viện, phòng gym Active Hub và các phòng máy chuyên dụng tại 2 cơ sở Nam Sài Gòn và Hà Nội."
            : "Detailed official opening and access hours for every building, floor, library, gym, and studio across Saigon South and Hanoi campuses."}
        </p>
      </div>

      {/* Campus Selector & Search */}
      <div className="editorial-panel flex flex-col gap-4 p-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div className="flex items-center gap-1 border border-[var(--border)] bg-[var(--surface)] p-1">
          <button
            onClick={() => {
              setActiveCampus("saigon_south");
              setActiveBuildingId("sgs-b1");
            }}
            className={`min-h-11 px-4 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              activeCampus === "saigon_south"
                ? "bg-[var(--accent)] text-white shadow-xs"
                : "text-[var(--secondary-text)] hover:text-[var(--main-text)]"
            }`}
          >
            {language === "vi" ? "Nam Sài Gòn" : "Saigon South"}
          </button>
          <button
            onClick={() => {
              setActiveCampus("hanoi");
              setActiveBuildingId("hn-main");
            }}
            className={`min-h-11 px-4 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              activeCampus === "hanoi"
                ? "bg-[var(--accent)] text-white shadow-xs"
                : "text-[var(--secondary-text)] hover:text-[var(--main-text)]"
            }`}
          >
            {language === "vi" ? "Hà Nội" : "Hanoi"}
          </button>
        </div>

        {/* Filter Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[var(--secondary-text)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={
              language === "vi"
                ? "Tìm tầng, thư viện, gym, phòng máy..."
                : "Filter floor, library, gym, labs..."
            }
            className="editorial-control w-full px-9 py-1.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* FEATURE BANNER: RMIT SPACE LIVE ROOM FINDER (FOR ALL CAMPUSES & ALL BUILDINGS) */}
      <div className="editorial-card flex flex-col gap-5 bg-[var(--surface-elevated)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>{language === "vi" ? "Công cụ tra cứu phòng học trống theo thời gian thực" : "Live Empty Classroom & Study Space Finder"}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[var(--main-text)]">
            {language === "vi" 
              ? "Tìm phòng tự học & thời khóa biểu trống tất cả các tòa nhà (RMIT Space)" 
              : "Find Empty Classrooms & Real-Time Schedules Across All Buildings (RMIT Space)"}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--secondary-text)] leading-relaxed">
            {language === "vi" 
              ? "Công cụ trực quan hỗ trợ sinh viên kiểm tra ngay phòng học nào đang trống tại tất cả các tòa nhà của cơ sở Nam Sài Gòn và Hà Nội để tự học hoặc họp nhóm không sợ trùng lịch lớp." 
              : "Interactive room schedule viewer to instantly find available empty classrooms across all buildings at Saigon South and Hanoi campuses."}
          </p>
          <p className="text-[11px] text-[var(--secondary-text)]/90 italic pt-0.5">
            {language === "vi" 
              ? "Công cụ do sinh viên giới thiệu; hãy xác nhận tình trạng phòng với RMIT trước khi sử dụng."
              : "Student-introduced tool; confirm room availability with RMIT before use."}
          </p>
        </div>

        <a
          href="https://www.rmitspace.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-xl bg-[var(--accent)] hover:opacity-95 active:scale-95 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 self-start md:self-auto"
        >
          <span>{language === "vi" ? "Mở RMIT Space tìm phòng" : "Open RMIT Space Finder"}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Quick Jump Anchor bar */}
      <div className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-center gap-2 pt-1 text-center text-xs">
        <span className="text-[var(--secondary-text)] font-semibold">
          {language === "vi" ? "Chuyển nhanh tới tòa nhà:" : "Jump to building:"}
        </span>
        {buildings.map((b) => (
          <a
            key={b.id}
            href={`#${b.id}`}
            onClick={() => setActiveBuildingId(b.id)}
            aria-current={activeBuildingId === b.id ? "location" : undefined}
            className={`inline-flex min-h-11 max-w-full items-center justify-center whitespace-normal break-words border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              activeBuildingId === b.id
                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--main-text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
          >
            {getQuickBuildingLabel(b.id, language)}
          </a>
        ))}
      </div>

      {/* Building list */}
      <div className="space-y-8">
        {filteredBuildings.map((building) => (
          <div
            key={building.id}
            id={building.id}
            className="editorial-card scroll-mt-24 space-y-4"
          >
            {/* Building Header & Action Links */}
            <div className="flex min-w-0 flex-col justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:flex-row sm:items-center sm:p-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent)]">
                  <Building2 className="w-3 h-3" />
                  <span>{language === "vi" ? (building.campus === "saigon_south" ? "Cơ sở Nam Sài Gòn" : "Cơ sở Hà Nội") : (building.campus === "saigon_south" ? "Saigon South Campus" : "Hanoi Campus")}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[var(--main-text)]">
                  {language === "vi" ? building.nameVi : building.nameEn}
                </h2>
                <p className="text-xs text-[var(--secondary-text)] leading-relaxed max-w-2xl">
                  {language === "vi" ? building.overviewVi : building.overviewEn}
                </p>
              </div>

              {/* Direct Maps & PDF floor plan buttons */}
              <div className="flex max-w-full min-w-0 shrink-0 flex-wrap items-center gap-2">
                {building.floorPlanPdfUrl && (
                  <a
                    href={building.floorPlanPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--main-text)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3 text-[var(--accent)]" aria-hidden="true" />{language === "vi" ? "Sơ đồ mặt bằng (PDF)" : "Floor Plan (PDF)"}</span>
                    <ExternalLink className="w-3 h-3 text-[var(--accent)]" />
                  </a>
                )}
                {building.accessSchedule && (
                  <a
                    href={building.accessSchedule.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={language === "vi" ? building.accessSchedule.publishedVi : building.accessSchedule.publishedEn}
                    className="inline-flex min-h-11 items-center gap-1.5 border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--main-text)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3 w-3 text-[var(--accent)]" aria-hidden="true" />{language === "vi" ? "Lịch vào tòa nhà (PDF)" : "Access schedule (PDF)"}</span>
                    <ExternalLink className="w-3 h-3 text-[var(--accent)]" />
                  </a>
                )}
                {building.googleMapsUrl && (
                  <a
                    href={building.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--main-text)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <MapPin className="w-3 h-3 text-[var(--accent)]" />
                    <span>Google Maps</span>
                  </a>
                )}
              </div>
            </div>
            {/* Floors Table */}
            {/* Floors Table with responsive horizontal scroll and generous column proportions */}
            <div
              className="editorial-scroll p-5 pt-0 sm:p-6 sm:pt-0"
              role="region"
              dir="ltr"
              aria-label={language === "vi" ? "Bảng giờ mở cửa, vuốt ngang để xem đầy đủ" : "Opening-hours table, scroll horizontally to view all columns"}
              tabIndex={0}
            >
              <div className="mb-3 flex items-center justify-between gap-3 text-[11px] text-[var(--secondary-text)] sm:hidden">
                <span>{language === "vi" ? "Vuốt ngang để xem đầy đủ bảng" : "Swipe horizontally to view the full table"}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
              </div>
              {building.accessSchedule && (
                <p className="mb-3 text-[11px] leading-relaxed text-[var(--secondary-text)]">
                  {language === "vi" ? building.accessSchedule.publishedVi : building.accessSchedule.publishedEn}
                </p>
              )}
              <table className="w-full table-fixed text-left text-xs sm:text-sm border-collapse min-w-[900px] xl:min-w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--secondary-text)]">
                    <th className="w-[22%] min-w-[170px] xl:min-w-0 bg-[var(--surface)] py-3.5 pr-4 font-semibold">{language === "vi" ? "Tầng / Khu vực" : "Floor / Facility"}</th>
                    <th className="py-3.5 px-4 font-semibold w-[42%] min-w-[320px] xl:min-w-0">{language === "vi" ? "Cơ sở vật chất" : "Key Facilities"}</th>
                    <th className="py-3.5 px-3 font-semibold w-[12%] min-w-[105px] xl:min-w-0 whitespace-nowrap">{language === "vi" ? "Thứ 2 - Thứ 6" : "Mon - Fri"}</th>
                    <th className="py-3.5 px-3 font-semibold w-[12%] min-w-[105px] xl:min-w-0 whitespace-nowrap">{language === "vi" ? "Thứ 7" : "Saturday"}</th>
                    <th className="py-3.5 pl-3 font-semibold w-[12%] min-w-[105px] xl:min-w-0 whitespace-nowrap">{language === "vi" ? "Chủ nhật" : "Sunday"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {building.floors.map((floor, fIdx) => (
                    <tr key={fIdx} className="hover:bg-[var(--surface-elevated)] transition-colors">
                      <td className="w-[22%] min-w-[170px] xl:min-w-0 max-w-[240px] break-words whitespace-normal bg-[var(--surface)] py-3.5 pr-4 align-top font-bold text-[var(--main-text)]">
                        {getLocalizedFloorLabel(floor, language)}
                      </td>
                      <td className="py-4 px-4 text-xs sm:text-sm text-[var(--secondary-text)] leading-relaxed align-top">
                        <div className="font-normal text-[var(--main-text)]/90">{language === "vi" ? floor.facilitiesVi : floor.facilitiesEn}</div>
                      </td>
                      <td className="py-4 px-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400 whitespace-normal break-words align-top">
                        {getLocalizedScheduleLabel(floor, "weekdayHours", language)}
                      </td>
                      <td className="py-4 px-3 font-mono text-[var(--main-text)] whitespace-normal break-words align-top">
                        {getLocalizedScheduleLabel(floor, "saturdayHours", language)}
                      </td>
                      <td className="py-4 pl-3 font-mono text-[var(--main-text)] whitespace-normal break-words align-top">
                        {getLocalizedScheduleLabel(floor, "sundayHours", language)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {building.floors.some((floor) => language === "vi" ? floor.notesVi : floor.notesEn) && (
                <div className="mt-4 space-y-2" aria-label={language === "vi" ? "Ghi chú vận hành" : "Operational notes"}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--secondary-text)]">
                    {language === "vi" ? "Ghi chú vận hành" : "Operational notes"}
                  </p>
                  {building.floors.map((floor, fIdx) => {
                    const note = language === "vi" ? floor.notesVi : floor.notesEn;
                    if (!note) return null;
                    return (
                      <div key={`note-${fIdx}`} className="editorial-info flex w-full items-start gap-2.5 p-3 text-xs leading-relaxed sm:p-3.5">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--main-text)]">{getLocalizedFloorLabel(floor, language)}</p>
                          <p className="mt-1 text-[var(--main-text)]">{note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
