"use client";

import { useEffect, useState } from "react";
import { formatLocalizedDate } from "@/lib/i18n/date";

type Update = { id: string; sourceId: string; recordedAt: string; changeType: "new" | "updated"; entityId?: string };

export function RecentUpdates({ language }: { language: "en" | "vi" }) {
  const [updates, setUpdates] = useState<Update[]>([]);
  useEffect(() => {
    let active = true;
    void fetch("/api/updates", { headers: { Accept: "application/json" } }).then((response) => response.ok ? response.json() as Promise<{ updates?: Update[] }> : { updates: [] }).then((payload) => { if (active && Array.isArray(payload.updates)) setUpdates(payload.updates.slice(0, 5)); }).catch(() => undefined);
    return () => { active = false; };
  }, []);
  if (updates.length === 0) return null;
  return (
    <section className="border border-[var(--border)] bg-[var(--surface-elevated)] p-4" aria-labelledby="recent-updates-heading">
      <h2 id="recent-updates-heading" className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">{language === "vi" ? "Cập nhật gần đây" : "Recent updates"}</h2>
      <ul className="mt-3 space-y-2">
        {updates.map((update) => <li key={update.id} className="text-sm text-[var(--main-text)]">{update.changeType === "new" ? (language === "vi" ? "Nội dung mới được xác minh" : "New verified information") : (language === "vi" ? "Thông tin đã được cập nhật" : "Information updated")} <span className="text-xs text-[var(--secondary-text)]">· {formatLocalizedDate(update.recordedAt, language)}</span></li>)}
      </ul>
    </section>
  );
}
