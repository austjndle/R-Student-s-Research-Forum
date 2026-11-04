"use client";

import { useState } from "react";

type Review = { id: string; reason: string; status?: string; sourceId: string; entityId?: string };
type Feedback = { id: string; issueType: string; pageUrl: string; explanation?: string; status: string };
type Health = { states?: Array<{ sourceId: string; lastStatus?: string; lastCheckedAt?: string; errorCount: number }>; reviews?: Review[]; feedback?: Feedback[]; runs?: Array<{ finishedAt: string; changedSources: number; failedSources: number; reviewItems: number }> };

export default function SyncAdminPage() {
  const [token, setToken] = useState("");
  const [health, setHealth] = useState<Health | null>(null);
  const [message, setMessage] = useState("");

  async function loadHealth() {
    setMessage("");
    const response = await fetch("/api/admin/sync", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!response.ok) { setMessage("Access denied or sync service unavailable."); return; }
    setHealth(await response.json() as Health);
  }

  async function action(body: Record<string, string>) {
    const response = await fetch("/api/admin/sync", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setMessage(response.ok ? "Action completed." : "Action failed.");
    if (response.ok) await loadHealth();
  }

  return (
    <main className="editorial-shell space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Private operations</p>
        <h1 className="text-3xl font-extrabold text-[var(--main-text)]">RMIT Sync Review</h1>
        <p className="max-w-2xl text-sm text-[var(--secondary-text)]">Server-side authorization is required. This page does not grant access by itself.</p>
      </header>
      <section className="editorial-card space-y-4 p-5" aria-labelledby="sync-auth-heading">
        <h2 id="sync-auth-heading" className="text-sm font-bold text-[var(--main-text)]">Admin access</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="sync-token">Admin token</label>
          <input id="sync-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Bearer token" className="min-h-11 min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
          <button type="button" onClick={() => void loadHealth()} className="min-h-11 rounded bg-[var(--accent)] px-4 text-sm font-semibold text-white">Load status</button>
        </div>
        {message && <p role="status" className="text-sm text-[var(--secondary-text)]">{message}</p>}
      </section>
      {health && (
        <>
          <section className="grid gap-4 sm:grid-cols-3" aria-label="Sync summary">
            <div className="editorial-card p-4"><p className="text-xs text-[var(--secondary-text)]">Sources</p><p className="text-2xl font-bold text-[var(--main-text)]">{health.states?.length ?? 0}</p></div>
            <div className="editorial-card p-4"><p className="text-xs text-[var(--secondary-text)]">Pending reviews</p><p className="text-2xl font-bold text-[var(--main-text)]">{health.reviews?.filter((review) => (review.status ?? "pending") === "pending").length ?? 0}</p></div>
            <div className="editorial-card p-4"><p className="text-xs text-[var(--secondary-text)]">Feedback</p><p className="text-2xl font-bold text-[var(--main-text)]">{health.feedback?.filter((item) => item.status === "new").length ?? 0}</p></div>
          </section>
          <section className="editorial-card space-y-4 p-5" aria-labelledby="review-heading">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="review-heading" className="text-lg font-bold text-[var(--main-text)]">Changes awaiting review</h2><button type="button" onClick={() => void action({ action: "run" })} className="min-h-11 rounded border border-[var(--border)] px-4 text-sm font-semibold text-[var(--main-text)]">Recheck sources</button></div>
            <ul className="space-y-3">
              {(health.reviews ?? []).filter((review) => (review.status ?? "pending") === "pending").map((review) => <li key={review.id} className="border-t border-[var(--border)] pt-3"><p className="text-sm text-[var(--main-text)]">{review.reason}</p><p className="mt-1 text-xs text-[var(--secondary-text)]">{review.sourceId}</p><div className="mt-2 flex gap-2"><button type="button" onClick={() => void action({ action: "review", id: review.id, status: "approved" })} className="min-h-10 rounded bg-emerald-600 px-3 text-xs font-semibold text-white">Approve</button><button type="button" onClick={() => void action({ action: "review", id: review.id, status: "rejected" })} className="min-h-10 rounded border border-[var(--border)] px-3 text-xs font-semibold text-[var(--main-text)]">Reject</button></div></li>)}
              {(health.reviews ?? []).filter((review) => (review.status ?? "pending") === "pending").length === 0 && <li className="text-sm text-[var(--secondary-text)]">No pending changes.</li>}
            </ul>
          </section>
          <section className="editorial-card space-y-3 p-5" aria-labelledby="feedback-heading">
            <h2 id="feedback-heading" className="text-lg font-bold text-[var(--main-text)]">User reports</h2>
            {(health.feedback ?? []).filter((item) => item.status === "new").map((item) => <div key={item.id} className="border-t border-[var(--border)] pt-3"><p className="text-sm text-[var(--main-text)]">{item.issueType}: {item.explanation ?? "No explanation"}</p><a className="text-xs text-[var(--accent)] underline" href={item.pageUrl}>{item.pageUrl}</a><div className="mt-2 flex gap-2"><button type="button" onClick={() => void action({ action: "feedback", id: item.id, status: "investigating" })} className="min-h-10 rounded border border-[var(--border)] px-3 text-xs font-semibold text-[var(--main-text)]">Investigate</button><button type="button" onClick={() => void action({ action: "feedback", id: item.id, status: "resolved" })} className="min-h-10 rounded bg-emerald-600 px-3 text-xs font-semibold text-white">Resolve</button></div></div>)}
            {(health.feedback ?? []).filter((item) => item.status === "new").length === 0 && <p className="text-sm text-[var(--secondary-text)]">No new reports.</p>}
          </section>
        </>
      )}
    </main>
  );
}
