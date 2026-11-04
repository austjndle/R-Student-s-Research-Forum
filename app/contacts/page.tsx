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

function AcademicSchoolCard({ department, language, t, onCopyEmail }: { department: DepartmentContact; language: "en" | "vi"; t: ReturnType<typeof useLanguage>["t"]; onCopyEmail: (email: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const specialized = department.specializedContacts ?? [];
  return (
    <article id={`contact-${department.id}`} className="editorial-card flex min-w-0 flex-col gap-5 p-6 transition-colors hover:border-[var(--accent)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">{department.abbreviation} · {language === "vi" ? "Khoa học thuật" : "Academic school"}</span>
          <h3 className="mt-2 text-xl font-bold text-[var(--main-text)]">{language === "vi" ? department.nameVi : department.nameEn}</h3>
        </div>
        <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label={t.common.verified} />
      </div>
      <p className="text-sm leading-relaxed text-[var(--secondary-text)]">{language === "vi" ? department.descriptionVi : department.descriptionEn}</p>
      <div className="space-y-2 text-xs">
        {department.email ? (
          <div className="editorial-info flex items-center justify-between gap-2 p-2.5">
            <a href={`mailto:${department.email}`} className="min-w-0 break-words font-mono text-[var(--accent)] hover:underline">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--secondary-text)]">{language === "vi" ? department.emailLabelVi ?? t.contacts.email : department.emailLabelEn ?? t.contacts.email}</span>
              {department.email}
            </a>
            <button type="button" onClick={() => onCopyEmail(department.email!)} aria-label={t.contacts.copyEmail} className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--border)] text-[var(--accent)]">
              <Copy className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <p className="editorial-info p-2.5 text-[var(--secondary-text)]">{t.contacts.noDirectContact}</p>
        )}
        {department.phone && <a href={`tel:${department.phone.replace(/[^\d+]/g, "")}`} className="inline-flex min-h-10 items-center gap-2 px-1 font-mono text-[var(--accent)] hover:underline"><Phone className="h-3.5 w-3.5" aria-hidden="true" />{department.phone}</a>}
        <div className="flex items-start gap-2 px-1 text-[var(--secondary-text)]"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" aria-hidden="true" /><span>{language === "vi" ? department.locationVi : department.locationEn}</span></div>
        <div className="flex items-start gap-2 px-1 text-[var(--secondary-text)]"><Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" aria-hidden="true" /><span>{language === "vi" ? department.serviceHoursVi : department.serviceHoursEn}</span></div>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-4 text-xs">
        <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="inline-flex min-h-11 items-center gap-1 font-semibold text-[var(--accent)]">
          {expanded ? t.contacts.collapse : t.contacts.specializedContacts}
          {expanded ? <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
        <a href={department.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 font-semibold text-[var(--accent)] hover:underline">{t.contacts.visitWebsite}<Globe className="h-3.5 w-3.5" aria-hidden="true" /></a>
        {department.formUrl && department.formUrl !== department.websiteUrl && <a href={department.formUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 font-semibold text-[var(--accent)] hover:underline">{t.contacts.form}<Globe className="h-3.5 w-3.5" aria-hidden="true" /></a>}
      </div>
      {expanded && (
        <div className="space-y-4 border-t border-[var(--border)] pt-4 text-xs">
          {department.campusContacts && <div><h4 className="font-semibold text-[var(--main-text)]">{t.common.campus}</h4><ul className="mt-2 space-y-2 text-[var(--secondary-text)]">{department.campusContacts.map((contact) => <li key={contact.campus}><strong>{contact.campus === "hanoi" ? t.common.hanoi : t.common.saigonSouth}:</strong> {language === "vi" ? contact.locationVi : contact.locationEn}{contact.email ? ` · ${contact.email}` : ""}</li>)}</ul></div>}
          <div><h4 className="font-semibold text-[var(--main-text)]">{t.contacts.specializedContacts}</h4><ul className="mt-2 space-y-3 text-[var(--secondary-text)]">{specialized.map((contact) => <li key={contact.id}><strong className="text-[var(--main-text)]">{language === "vi" ? contact.labelVi : contact.labelEn}</strong><p className="mt-1">{language === "vi" ? contact.purposeVi : contact.purposeEn}</p>{contact.email ? <a href={`mailto:${contact.email}`} className="mt-1 inline-flex text-[var(--accent)] hover:underline">{contact.email}</a> : <span className="mt-1 block italic">{t.contacts.noDirectContact}</span>}</li>)}</ul></div>
        </div>
      )}
      <p className="text-[11px] text-[var(--secondary-text)]">{t.common.lastVerified}: <time dateTime={department.lastVerifiedDate}>{department.lastVerifiedDate}</time></p>
    </article>
  );
}

export default function ContactsPage() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [contactType, setContactType] = useState<"all" | "departments" | "academic-schools">("all");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const categoryLabels = {
    administrative: t.contacts.categoryAdministrative,
    academic: t.contacts.categoryAcademic,
    support: t.contacts.categorySupport,
    facilities: t.contacts.categoryFacilities,
    specialized: t.contacts.categorySpecialized,
  };

  const normalizedSearch = search.toLowerCase();
  const filteredDepartments = DEPARTMENT_CONTACTS.filter((dept) => {
    const searchable = [
      dept.nameEn,
      dept.nameVi,
      dept.abbreviation ?? "",
      dept.descriptionEn,
      dept.descriptionVi,
      dept.email ?? "",
      ...(dept.specializedContacts ?? []).flatMap((contact) => [contact.labelEn, contact.labelVi, contact.purposeEn, contact.purposeVi]),
    ].join(" ").toLowerCase();
    const matchesSearch = searchable.includes(normalizedSearch);
    const matchesCampus = selectedCampus === "all" || dept.campus === "all" || dept.campus === selectedCampus;
    const matchesType = contactType === "all" || (contactType === "academic-schools" ? dept.isAcademicSchool : !dept.isAcademicSchool);
    return matchesSearch && matchesCampus && matchesType;
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
    <div className="editorial-shell space-y-8">
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
              className="editorial-control w-full px-10 pr-4 text-sm focus:outline-none"
            />
          </div>

          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="editorial-control px-3 text-sm focus:outline-none"
          >
            <option value="all">{t.common.allCampuses}</option>
            <option value="saigon_south">{t.common.saigonSouth}</option>
            <option value="hanoi">{t.common.hanoi}</option>
          </select>
          <select value={contactType} onChange={(e) => setContactType(e.target.value as typeof contactType)} aria-label={t.contacts.allContactTypes} className="editorial-control px-3 text-sm focus:outline-none">
            <option value="all">{t.contacts.allContactTypes}</option>
            <option value="departments">{t.contacts.allDepartments}</option>
            <option value="academic-schools">{t.contacts.academicSchools}</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDepartments.filter((dept) => !dept.isAcademicSchool).map((dept) => {
          const isExpanded = expandedId === dept.id;

          return (
            <div
              key={dept.id}
              className="editorial-card space-y-5 p-6 transition-colors hover:border-[var(--accent)]"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent)]">
                      {categoryLabels[dept.category]}
                    </span>
                    <h2 className="text-xl font-bold text-[var(--main-text)]">
                      {language === "vi" ? dept.nameVi : dept.nameEn}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.common.verified}</span>
                  </span>
                </div>

                <p className="text-sm text-[var(--secondary-text)] leading-relaxed">
                  {language === "vi" ? dept.descriptionVi : dept.descriptionEn}
                </p>

                {/* Primary Contacts */}
                <div className="space-y-2 text-xs">
                  {dept.email && (
                    <div className="editorial-info flex items-center justify-between p-2.5">
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                        <a href={`mailto:${dept.email}`} className="min-w-0 break-words font-mono text-[var(--accent)] hover:underline" aria-label={`${t.contacts.email}: ${dept.email}`}>
                          {dept.email}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(dept.email!)}
                        aria-label={t.common.copyToClipboard}
                        title={copiedEmail === dept.email ? t.common.copied : t.common.copyToClipboard}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--border)] bg-[var(--surface)] text-[var(--main-text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      >
                        {copiedEmail === dept.email ? (
                          <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                        ) : (
                          <Copy className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  )}

                  {dept.phone && (
                    <div className="editorial-info flex items-start gap-2 p-2.5">
                      <Phone className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                      <a href={`tel:${dept.phone.replace(/[^\d+]/g, "")}`} className="font-mono text-[var(--accent)] hover:underline" aria-label={`${t.contacts.phone}: ${dept.phone}`}>
                        {dept.phone}
                      </a>
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
                  <div id={`department-details-${dept.id}`} className="editorial-copy space-y-3 border-t border-[var(--border)] pt-3 text-xs">
                    <div className="space-y-1">
                      <h4 className="font-bold text-[var(--main-text)]">
                        {t.contacts.responsibilities}:
                      </h4>
                      <ul className="list-disc space-y-1 pl-4 text-[var(--secondary-text)]">
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
                      <ul className="list-disc space-y-1 pl-4 text-[var(--secondary-text)]">
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
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs">
                <button
                  onClick={() => toggleExpand(dept.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`department-details-${dept.id}`}
                  className="inline-flex min-h-11 items-center gap-1 font-medium text-[var(--secondary-text)] transition-colors hover:text-[var(--main-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <span>{isExpanded ? t.contacts.collapse : t.contacts.responsibilities}</span>
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
      {contactType !== "departments" && (
        <section aria-labelledby="academic-schools-title" className="space-y-5">
          <div className="border-b border-[var(--border)] pb-3">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Academic Schools / Khoa học thuật</p>
            <h2 id="academic-schools-title" className="mt-2 text-2xl font-bold text-[var(--main-text)]">{t.contacts.academicSchools}</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredDepartments.filter((dept) => dept.isAcademicSchool).map((department) => (
              <AcademicSchoolCard key={department.id} department={department} language={language} t={t} onCopyEmail={handleCopyEmail} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
