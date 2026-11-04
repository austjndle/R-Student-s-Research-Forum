"use client";

import { useState } from "react";

type IssueType = "incorrect" | "outdated" | "broken_link" | "wrong_campus" | "opening_hours" | "missing_application_link" | "other";

export function ReportIssue({ recordId, pageUrl }: { recordId?: string; pageUrl: string }) {
  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState<IssueType>("incorrect");
  const [explanation, setExplanation] = useState("");
  const [message, setMessage] = useState("");

  async function submit() {
    const response = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recordId, pageUrl, issueType, explanation }) });
    setMessage(response.ok ? "Thanks — your report was submitted." : "The report service is unavailable right now.");
    if (response.ok) setExplanation("");
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="text-xs font-semibold text-[var(--secondary-text)] underline hover:text-[var(--accent)]">
        Report an issue
      </button>
      {open && (
        <div className="max-w-md space-y-2 border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
          <label className="block text-xs font-semibold text-[var(--main-text)]" htmlFor={`issue-type-${recordId ?? "page"}`}>Issue type</label>
          <select id={`issue-type-${recordId ?? "page"}`} value={issueType} onChange={(event) => setIssueType(event.target.value as IssueType)} className="min-h-10 w-full rounded border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--main-text)]">
            <option value="incorrect">Incorrect information</option><option value="outdated">Outdated information</option><option value="broken_link">Broken official link</option><option value="wrong_campus">Wrong campus</option><option value="opening_hours">Opening hours</option><option value="missing_application_link">Missing application link</option><option value="other">Other</option>
          </select>
          <label className="block text-xs font-semibold text-[var(--main-text)]" htmlFor={`issue-explanation-${recordId ?? "page"}`}>Details (optional)</label>
          <textarea id={`issue-explanation-${recordId ?? "page"}`} value={explanation} onChange={(event) => setExplanation(event.target.value.slice(0, 1000))} rows={3} className="w-full rounded border border-[var(--border)] bg-[var(--surface)] p-2 text-xs text-[var(--main-text)]" />
          <button type="button" onClick={() => void submit()} className="min-h-10 rounded bg-[var(--accent)] px-3 text-xs font-semibold text-white">Submit report</button>
          {message && <p role="status" className="text-xs text-[var(--secondary-text)]">{message}</p>}
        </div>
      )}
    </div>
  );
}
