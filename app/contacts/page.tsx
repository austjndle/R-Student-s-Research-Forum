"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { DEPARTMENT_CONTACTS, type DepartmentContact } from "@/data/contacts/departments";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Clock,
  Search,
  Copy,
  Check,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ContactsPage() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredDepartments = DEPARTMENT_CONTACTS.filter((dept) => {
    const matchesSearch =
      dept.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      dept.nameVi.toLowerCase().includes(search.toLowerCase()) ||
      dept.descriptionEn.toLowerCase().includes(search.toLowerCase()) ||
      dept.descriptionVi.toLowerCase().includes(search.toLowerCase()) ||
      (dept.email && dept.email.toLowerCase().includes(search.toLowerCase()));

    const matchesCampus =
      selectedCampus === "all" || dept.campus === "all" || dept.campus === selectedCampus;

    return matchesSearch && matchesCampus;
  });

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Filters */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--main-text)]">
            {t.contacts.title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--secondary-text)] max-w-2xl">
            {t.contacts.subtitle}
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--secondary-text)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.contacts.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--main-text)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--main-text)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="all">{t.common.allCampuses}</option>
            <option value="saigon_south">{t.common.saigonSouth}</option>
            <option value="hanoi">{t.common.hanoi}</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDepartments.map((dept) => {
          const isExpanded = expandedId === dept.id;

          return (
            <div
              key={dept.id}
              className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-sm hover:border-[var(--accent)] transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent)]">
                      {dept.category}
                    </span>
                    <h2 className="text-xl font-bold text-[var(--main-text)]">
                      {language === "vi" ? dept.nameVi : dept.nameEn}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>

                <p className="text-sm text-[var(--secondary-text)] leading-relaxed">
                  {language === "vi" ? dept.descriptionVi : dept.descriptionEn}
                </p>

                {/* Primary Contacts */}
                <div className="space-y-2 text-xs">
                  {dept.email && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                        <span className="font-mono text-[var(--main-text)] truncate">
                          {dept.email}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyEmail(dept.email!)}
                        className="px-2 py-1 rounded bg-[var(--surface)] border border-[var(--border)] text-[11px] font-medium hover:text-[var(--accent)] transition-colors shrink-0 flex items-center gap-1"
                      >
                        {copiedEmail === dept.email ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>{t.common.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{t.common.copy}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {dept.phone && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
                      <Phone className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                      <span className="font-mono text-[var(--main-text)]">
                        {dept.phone}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-2 text-[var(--secondary-text)] px-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--accent)]" />
                    <span>{language === "vi" ? dept.locationVi : dept.locationEn}</span>
                  </div>

                  <div className="flex items-start gap-2 text-[var(--secondary-text)] px-1">
                    <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--accent)]" />
                    <span>{language === "vi" ? dept.serviceHoursVi : dept.serviceHoursEn}</span>
                  </div>
                </div>

                {/* Expandable Responsibilities & Enquiries */}
                {isExpanded && (
                  <div className="space-y-3 pt-3 border-t border-[var(--border)] text-xs">
                    <div className="space-y-1">
                      <h4 className="font-bold text-[var(--main-text)]">
                        {t.contacts.responsibilities}:
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-[var(--secondary-text)]">
                        {(language === "vi" ? dept.responsibilitiesVi : dept.responsibilitiesEn).map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-[var(--main-text)]">
                        {t.contacts.typicalEnquiries}:
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-[var(--secondary-text)]">
                        {(language === "vi" ? dept.typicalEnquiriesVi : dept.typicalEnquiriesEn).map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleExpand(dept.id)}
                  className="font-medium text-[var(--secondary-text)] hover:text-[var(--main-text)] flex items-center gap-1 transition-colors"
                >
                  <span>{isExpanded ? "Collapse" : t.contacts.responsibilities}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                <a
                  href={dept.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                >
                  <span>{t.contacts.visitWebsite}</span>
                  <Globe className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
