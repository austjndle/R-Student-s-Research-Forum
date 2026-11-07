"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";

type IssueType = "incorrect" | "outdated" | "broken_link" | "wrong_campus" | "opening_hours" | "missing_application_link" | "other";

export function ReportIssue({ recordId, pageUrl }: { recordId?: string; pageUrl: string }) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState<IssueType>("incorrect");
  const [explanation, setExplanation] = useState("");
  const [message, setMessage] = useState("");
  const copy = language === "vi"
    ? { trigger: "Báo lỗi thông tin", issueType: "Loại lỗi", details: "Chi tiết (không bắt buộc)", submit: "Gửi báo lỗi", thanks: "Cảm ơn — báo lỗi đã được gửi.", unavailable: "Dịch vụ báo lỗi hiện không khả dụng.", options: { incorrect: "Thông tin không chính xác", outdated: "Thông tin đã cũ", broken_link: "Liên kết chính thức bị lỗi", wrong_campus: "Sai cơ sở", opening_hours: "Giờ mở cửa", missing_application_link: "Thiếu liên kết đăng ký", other: "Khác" } }
    : { trigger: "Report an issue", issueType: "Issue type", details: "Details (optional)", submit: "Submit report", thanks: "Thanks — your report was submitted.", unavailable: "The report service is unavailable right now.", options: { incorrect: "Incorrect information", outdated: "Outdated information", broken_link: "Broken official link", wrong_campus: "Wrong campus", opening_hours: "Opening hours", missing_application_link: "Missing application link", other: "Other" } };

  async function submit() {
    const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recordId, pageUrl, issueType, explanation }) });
    setMessage(response.ok ? copy.thanks : copy.unavailable);
    if (response.ok) setExplanation("");
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="text-xs font-semibold text-[var(--secondary-text)] underline hover:text-[var(--accent)]">{copy.trigger}</button>
      {open && (
        <div className="max-w-md space-y-2 border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
          <label className="block text-xs font-semibold text-[var(--main-text)]" htmlFor={`issue-type-${recordId ?? "page"}`}>{copy.issueType}</label>
          <select id={`issue-type-${recordId ?? "page"}`} value={issueType} onChange={(event) => setIssueType(event.target.value as IssueType)} className="min-h-10 w-full rounded border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--main-text)]">
            {(Object.keys(copy.options) as IssueType[]).map((option) => <option key={option} value={option}>{copy.options[option]}</option>)}
          </select>
          <label className="block text-xs font-semibold text-[var(--main-text)]" htmlFor={`issue-explanation-${recordId ?? "page"}`}>{copy.details}</label>
          <textarea id={`issue-explanation-${recordId ?? "page"}`} value={explanation} onChange={(event) => setExplanation(event.target.value.slice(0, 1000))} rows={3} className="w-full rounded border border-[var(--border)] bg-[var(--surface)] p-2 text-xs text-[var(--main-text)]" />
          <button type="button" onClick={() => void submit()} className="min-h-10 rounded bg-[var(--accent)] px-3 text-xs font-semibold text-white">{copy.submit}</button>
          {message && <p role="status" className="text-xs text-[var(--secondary-text)]">{message}</p>}
        </div>
      )}
    </div>
  );
}
