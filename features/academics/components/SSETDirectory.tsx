"use client";

import Link from "next/link";
import { ExternalLink, GraduationCap, LockKeyhole, MapPin, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/shared/i18n/context"
import { ACADEMIC_RECOGNITION } from "@/features/scholarships/public";
import { SSET_INDUSTRY, SSET_INFRASTRUCTURE, SSET_LAST_VERIFIED, SSET_LINKS, SSET_OVERVIEW, SSET_PROGRAMS, SSET_PROJECTS, SSET_RESEARCH, SSET_URLS } from "../data/sset";

function text(value: { en: string; vi: string }, language: "en" | "vi") {
  return value[language];
}

function ExternalLinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--accent)] transition-colors hover:border-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">{children}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>;
}

export function SSETDirectory() {
  const { language } = useLanguage();
  const isVi = language === "vi";
  const s = (value: { en: string; vi: string }) => text(value, language);
  const ssetRecognition = ACADEMIC_RECOGNITION.find((record) => record.id === "rmit-vietnam-sset-deans-list-status");

  return <div className="editorial-shell space-y-10">
    <header className="border-b border-[var(--border)] pb-8">
      <Link href="/topics" className="text-xs font-semibold text-[var(--secondary-text)] hover:text-[var(--accent)]">← {isVi ? "Quay lại Chủ đề" : "Back to Explore Topics"}</Link>
      <p className="mt-7 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">RMIT VIETNAM / SSET</p>
      <h1 className="mt-4 max-w-5xl text-4xl font-bold tracking-[-0.04em] text-[var(--main-text)] sm:text-6xl">{isVi ? "Khoa Khoa học, Kỹ thuật & Công nghệ" : "School of Science, Engineering & Technology"}</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--secondary-text)]">{s(SSET_OVERVIEW)}</p>
      <p className="mt-3 text-xs text-[var(--secondary-text)]">{isVi ? "Xác minh lần cuối" : "Last verified"}: {SSET_LAST_VERIFIED}</p>
    </header>

    <section className="space-y-4" aria-labelledby="sset-links-title">
      <div><p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{isVi ? "Liên kết chính thức" : "Official links"}</p><h2 id="sset-links-title" className="mt-2 text-2xl font-bold text-[var(--main-text)]">{isVi ? "Đi đúng nguồn SSET" : "Start with the official SSET sources"}</h2></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SSET_LINKS.map((link) => <article key={link.id} className="editorial-card flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3"><h3 className="font-semibold leading-6 text-[var(--main-text)]">{s(link.label)}</h3>{link.requiresLogin && <LockKeyhole className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-label={isVi ? "Yêu cầu đăng nhập RMIT" : "RMIT login required"} />}</div>
          <p className="flex-1 text-sm leading-6 text-[var(--secondary-text)]">{s(link.description)}</p>
          <ExternalLinkButton href={link.url}>{link.id === "canvas" ? (isVi ? "Mở hướng dẫn IT" : "Open IT guidance") : (isVi ? "Mở nguồn" : "Open source")}</ExternalLinkButton>
        </article>)}
      </div>
    </section>

    <section className="space-y-4" aria-labelledby="sset-programs-title">
      <div><p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">01 / {isVi ? "Chương trình đại học" : "Undergraduate programs"}</p><h2 id="sset-programs-title" className="mt-2 text-2xl font-bold text-[var(--main-text)]">{isVi ? "Chọn chương trình theo mã và cơ sở" : "Choose a program by code and campus"}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--secondary-text)]">{isVi ? "Thông tin cấu trúc là bản tóm tắt từ trang chương trình hiện hành. Luôn đối chiếu guide/map của đúng đợt nhập học trước khi đăng ký môn." : "Structure details summarise current program pages. Check the guide/map for your applicable intake before enrolling."}</p></div>
      <div className="grid gap-5 lg:grid-cols-2">
        {SSET_PROGRAMS.map((program) => <article key={program.id} className="editorial-card flex flex-col gap-5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><span className="font-mono text-xs font-semibold tracking-[0.12em] text-[var(--accent)]">{program.code}</span><h3 className="mt-2 text-xl font-bold leading-tight text-[var(--main-text)]">{s(program.title)}</h3></div><span className="inline-flex items-center gap-1 border border-emerald-300/60 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />{isVi ? "Đã xác minh" : "Verified"}</span></div>
          <p className="text-sm leading-6 text-[var(--secondary-text)]">{s(program.summary)}</p>
          <dl className="grid gap-3 border-y border-[var(--border)] py-4 text-sm sm:grid-cols-2"><div><dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--secondary-text)]">{isVi ? "Cơ sở" : "Campus"}</dt><dd className="mt-1 font-semibold text-[var(--main-text)]">{program.campuses.join(isVi ? ", " : ", ")}</dd></div><div><dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--secondary-text)]">{isVi ? "Thời lượng" : "Duration"}</dt><dd className="mt-1 font-semibold text-[var(--main-text)]">{s(program.duration)}</dd></div></dl>
          <div><h4 className="font-semibold text-[var(--main-text)]">{isVi ? "Cấu trúc và chuyên sâu" : "Structure and specialisations"}</h4><p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{s(program.structure)}</p><ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--secondary-text)]">{program.specialisations.map((item) => <li key={item.en}>{s(item)}</li>)}</ul></div>
          <div><h4 className="font-semibold text-[var(--main-text)]">{isVi ? "Kết quả học tập và nghề nghiệp" : "Learning outcomes and careers"}</h4><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--secondary-text)]">{program.learningOutcomes.map((item) => <li key={item.en}>{s(item)}</li>)}{program.careers.slice(0, 4).map((item) => <li key={item.en}>{s(item)}</li>)}</ul><p className="mt-3 text-sm leading-6 text-[var(--secondary-text)]"><strong className="text-[var(--main-text)]">{isVi ? "Trải nghiệm ngành:" : "Industry experience:"}</strong> {s(program.industryExperience)}</p></div>
          <div className="flex flex-wrap gap-2"><ExternalLinkButton href={program.programUrl}>{isVi ? "Trang chương trình" : "Program page"}</ExternalLinkButton>{program.guideUrls.map((guide) => <ExternalLinkButton key={guide.url} href={guide.url}>{s(guide.label)} · {s(guide.campus)}</ExternalLinkButton>)}</div>
          <p className="text-xs leading-5 text-[var(--secondary-text)]">{s(program.accessNote)}</p>
        </article>)}
      </div>
    </section>

    <section className="space-y-4" aria-labelledby="sset-projects-title">
      <div><p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">02 / {isVi ? "Dự án sinh viên" : "Student projects"}</p><h2 id="sset-projects-title" className="mt-2 text-2xl font-bold text-[var(--main-text)]">{isVi ? "Dự án capstone và showcase công khai" : "Public capstone and showcase projects"}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--secondary-text)]">{isVi ? "SSET mô tả capstone WIL kéo dài sáu tháng; các bản ghi dưới đây chỉ tóm tắt nội dung đã công khai, không sao chép báo cáo hay phương tiện có bản quyền." : "SSET describes six-month WIL capstones; these records summarise public descriptions only and do not copy reports or copyrighted media."}</p></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{SSET_PROJECTS.map((project) => <article key={project.id} className="editorial-card flex flex-col gap-3 p-5"><div className="flex items-center justify-between gap-2"><span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">{project.year}</span><span className="text-xs text-[var(--secondary-text)]">{s(project.discipline)}</span></div><h3 className="text-lg font-bold leading-snug text-[var(--main-text)]">{s(project.title)}</h3><p className="text-sm leading-6 text-[var(--secondary-text)]">{s(project.summary)}</p><p className="mt-auto text-xs leading-5 text-[var(--secondary-text)]"><strong className="text-[var(--main-text)]">{isVi ? "Trọng tâm:" : "Focus:"}</strong> {s(project.focus)}</p><ExternalLinkButton href={project.url}>{isVi ? "Xem dự án" : "View project"}</ExternalLinkButton></article>)}</div>
      <div className="editorial-panel flex flex-wrap items-center justify-between gap-3 p-4"><p className="text-sm text-[var(--secondary-text)]">{isVi ? "Xem thêm các dự án theo năm trên showcase chính thức." : "Browse more projects by year on the official showcase."}</p><ExternalLinkButton href={SSET_URLS.showcase}>{isVi ? "Mở showcase" : "Open showcase"}</ExternalLinkButton></div>
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <article className="editorial-card space-y-3 p-5"><div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" /><h2 className="text-2xl font-bold text-[var(--main-text)]">{isVi ? "Nghiên cứu & phòng lab" : "Research and laboratories"}</h2></div><p className="text-sm leading-6 text-[var(--secondary-text)]">{s(SSET_RESEARCH)}</p><p className="text-sm leading-6 text-[var(--secondary-text)]">{s(SSET_INFRASTRUCTURE)}</p><div className="flex flex-wrap gap-2"><ExternalLinkButton href={SSET_URLS.research}>{isVi ? "Nghiên cứu SSET" : "SSET research"}</ExternalLinkButton><ExternalLinkButton href={SSET_URLS.infrastructure}>{isVi ? "Cơ sở vật chất" : "Infrastructure"}</ExternalLinkButton></div></article>
      <article className="editorial-card space-y-3 p-5"><div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" /><h2 className="text-2xl font-bold text-[var(--main-text)]">{isVi ? "Hợp tác ngành & địa điểm" : "Industry and locations"}</h2></div><p className="text-sm leading-6 text-[var(--secondary-text)]">{s(SSET_INDUSTRY)}</p><p className="text-sm leading-6 text-[var(--secondary-text)]">{isVi ? "Nam Sài Gòn: 702 Nguyễn Văn Linh, Tòa nhà Học thuật 2, Tầng 4. Hà Nội: Tòa nhà Handi Resco, 521 Kim Mã, Tầng 5, Tháp A." : "Saigon South: 702 Nguyen Van Linh Boulevard, Academic Building 2, Level 4. Hanoi: Handi Resco Building, 521 Kim Ma Street, Level 5, Tower A."}</p><div className="flex flex-wrap gap-2"><ExternalLinkButton href={SSET_URLS.industry}>{isVi ? "Hợp tác doanh nghiệp" : "Industry collaboration"}</ExternalLinkButton><ExternalLinkButton href={SSET_URLS.contact}>{isVi ? "Liên hệ SSET" : "Contact SSET"}</ExternalLinkButton></div></article>
    </section>

    <section className="editorial-panel space-y-4 p-5" aria-labelledby="sset-recognition-title"><div><p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">03 / {isVi ? "Ghi nhận học thuật" : "Academic recognition"}</p><h2 id="sset-recognition-title" className="mt-2 text-2xl font-bold text-[var(--main-text)]">{isVi ? "Dean's List cần được phân biệt theo quốc gia" : "Dean's List depends on the country and school"}</h2></div><p className="text-sm leading-6 text-[var(--secondary-text)]">{isVi ? "RMIT Australia có trang Dean's List với tiêu chí cụ thể. Tiêu chí đó không được áp dụng mặc định cho SSET Việt Nam." : "RMIT Australia publishes a Dean's List with specific criteria. Those criteria are not automatically applicable to SSET Vietnam."}</p>{ssetRecognition && <div className="border border-amber-300/70 bg-amber-50/60 p-4 dark:border-amber-800/70 dark:bg-amber-950/20"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-[var(--main-text)]">{s(ssetRecognition.name)}</h3><span className="font-mono text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-300">{isVi ? "Chưa xác nhận" : "Not publicly confirmed"}</span></div><p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{s(ssetRecognition.eligibility)}</p><p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">{s(ssetRecognition.enquiry)}</p><ExternalLinkButton href={ssetRecognition.sourceUrl}>{isVi ? "Mở trang liên hệ" : "Open contact page"}</ExternalLinkButton></div>}</section>

    <section className="editorial-card space-y-3 p-5"><h2 className="text-2xl font-bold text-[var(--main-text)]">{isVi ? "Khu vực Canvas" : "Canvas Shell"}</h2><p className="text-sm leading-6 text-[var(--secondary-text)]"><strong className="text-[var(--main-text)]">{isVi ? "Cần đăng nhập tài khoản RMIT." : "RMIT Student Login Required."}</strong> {isVi ? "Chưa xác nhận URL khu vực SSET công khai. Đăng nhập Canvas bằng tài khoản RMIT, tìm khu vực SSET trong danh sách khóa học hoặc hỏi giảng viên/phòng Khoa. Không gửi mật khẩu, cookie hoặc mã phiên cho bất kỳ ai." : "The exact public SSET shell URL was not confirmed. Sign in to Canvas with your RMIT account, look for the SSET shell in Courses, or ask a lecturer/School office. Never share your password, cookies or session tokens."}</p><ExternalLinkButton href="https://www.rmit.edu.vn/students/support/it-support">{isVi ? "Hướng dẫn IT chính thức" : "Official IT guidance"}</ExternalLinkButton></section>
  </div>;
}
