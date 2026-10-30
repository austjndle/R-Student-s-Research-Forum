"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { RMIT_CAMPUS_HOURS, type BuildingInfo } from "@/data/facilities/campusHours";
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

export default function CampusHoursPage() {
  const { language, t } = useLanguage();
  const [activeCampus, setActiveCampus] = useState<"saigon_south" | "hanoi">("saigon_south");
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] text-[var(--badge-text)] text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>Official RMIT Vietnam Building Access Schedule</span>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)]">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)] self-start sm:self-auto">
          <button
            onClick={() => setActiveCampus("saigon_south")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeCampus === "saigon_south"
                ? "bg-[var(--accent)] text-white shadow-xs"
                : "text-[var(--secondary-text)] hover:text-[var(--main-text)]"
            }`}
          >
            Nam Sài Gòn (Saigon South)
          </button>
          <button
            onClick={() => setActiveCampus("hanoi")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeCampus === "hanoi"
                ? "bg-[var(--accent)] text-white shadow-xs"
                : "text-[var(--secondary-text)] hover:text-[var(--main-text)]"
            }`}
          >
            Hà Nội (Handi Resco Tower)
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
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--main-text)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {/* FEATURE BANNER: RMIT SPACE LIVE ROOM FINDER (FOR ALL CAMPUSES & ALL BUILDINGS) */}
      <div className="p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-gradient-to-r from-red-600/10 via-[var(--surface-elevated)] to-[var(--surface-elevated)] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
            <span className="text-base select-none">🔍</span>
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
              ? "Được phát triển bởi sinh viên s3998345@rmit.edu.vn (RMIT Vietnam Student Project)." 
              : "Created by student s3998345@rmit.edu.vn (RMIT Vietnam Student Project)."}
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
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="text-[var(--secondary-text)] font-semibold">
          {language === "vi" ? "Chuyển nhanh tới tòa nhà:" : "Jump to building:"}
        </span>
        {buildings.map((b) => (
          <a
            key={b.id}
            href={`#${b.id}`}
            className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-[var(--main-text)] transition-colors"
          >
            {language === "vi" ? b.nameVi.split("(")[0] : b.nameEn.split("(")[0]}
          </a>
        ))}
      </div>

      {/* Building list */}
      <div className="space-y-8">
        {filteredBuildings.map((building) => (
          <div
            key={building.id}
            id={building.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-xs overflow-hidden scroll-mt-24 space-y-4"
          >
            {/* Building Header & Action Links */}
            <div className="p-5 sm:p-6 border-b border-[var(--border)] bg-[var(--surface-elevated)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent)]">
                  <Building2 className="w-3 h-3" />
                  <span>{building.campus === "saigon_south" ? "Saigon South Campus" : "Hanoi Campus"}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[var(--main-text)]">
                  {language === "vi" ? building.nameVi : building.nameEn}
                </h2>
                <p className="text-xs text-[var(--secondary-text)] leading-relaxed max-w-2xl">
                  {language === "vi" ? building.overviewVi : building.overviewEn}
                </p>
              </div>

              {/* Direct Maps & PDF floor plan buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {building.floorPlanPdfUrl && (
                  <a
                    href={building.floorPlanPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)] hover:bg-[var(--hover)] text-xs font-semibold text-[var(--main-text)] inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>🗺️ {language === "vi" ? "Sơ đồ mặt bằng (PDF)" : "Floor Plan (PDF)"}</span>
                    <ExternalLink className="w-3 h-3 text-[var(--accent)]" />
                  </a>
                )}
                {building.googleMapsUrl && (
                  <a
                    href={building.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)] hover:bg-[var(--hover)] text-xs font-semibold text-[var(--main-text)] inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <MapPin className="w-3 h-3 text-[var(--accent)]" />
                    <span>Google Maps</span>
                  </a>
                )}
              </div>
            </div>
            {/* Floors Table */}
            {/* Floors Table with responsive horizontal scroll and generous column proportions */}
            <div className="p-5 sm:p-6 pt-0 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[760px] md:min-w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--secondary-text)]">
                    <th className="py-3.5 pr-4 font-semibold w-[22%] min-w-[170px]">{language === "vi" ? "Tầng / Khu vực" : "Floor / Facility"}</th>
                    <th className="py-3.5 px-4 font-semibold w-[42%] min-w-[320px]">{language === "vi" ? "Cơ sở vật chất & Ghi chú phòng ban" : "Key Facilities & Operational Notes"}</th>
                    <th className="py-3.5 px-3 font-semibold w-[12%] min-w-[105px] whitespace-nowrap">{language === "vi" ? "Thứ 2 - Thứ 6" : "Mon - Fri"}</th>
                    <th className="py-3.5 px-3 font-semibold w-[12%] min-w-[105px] whitespace-nowrap">{language === "vi" ? "Thứ 7" : "Saturday"}</th>
                    <th className="py-3.5 pl-3 font-semibold w-[12%] min-w-[105px] whitespace-nowrap">{language === "vi" ? "Chủ nhật" : "Sunday"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {building.floors.map((floor, fIdx) => (
                    <tr key={fIdx} className="hover:bg-[var(--surface-elevated)] transition-colors">
                      <td className="py-3.5 pr-4 font-bold text-[var(--main-text)] whitespace-nowrap align-top">
                        {floor.floor}
                      </td>
                      <td className="py-4 px-4 text-xs sm:text-sm text-[var(--secondary-text)] leading-relaxed align-top">
                        <div className="font-normal text-[var(--main-text)]/90">{language === "vi" ? floor.facilitiesVi : floor.facilitiesEn}</div>
                        {(floor.notesVi || floor.notesEn) && (
                          <div className="mt-2.5 p-3 sm:p-3.5 rounded-xl bg-[var(--surface)] dark:bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--main-text)] leading-relaxed shadow-xs flex items-start gap-2.5 w-full">
                            <span className="text-base select-none mt-[-2px] shrink-0">📌</span>
                            <span className="flex-1 font-medium text-[var(--main-text)] leading-normal">{language === "vi" ? floor.notesVi : floor.notesEn}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap align-top">
                        {floor.weekdayHours}
                      </td>
                      <td className="py-4 px-3 font-mono text-[var(--main-text)] whitespace-nowrap align-top">
                        {floor.saturdayHours}
                      </td>
                      <td className="py-4 pl-3 font-mono text-[var(--main-text)] whitespace-nowrap align-top">
                        {floor.sundayHours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
