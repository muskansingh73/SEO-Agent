"use client";

import { useState } from "react";
import { Gauge, Swords, Link2, KeyRound } from "lucide-react";
import { auditResult, competitors, backlinks, keywords } from "@/lib/mockData";

const GAIN = { high: 8, medium: 5, low: 2 };

const tabs = [
  {
    id: "audit",
    label: "Site audit",
    Icon: Gauge,
    text: "Get a score out of 100 and a list of fixes, with the biggest wins first.",
  },
  {
    id: "competitors",
    label: "Competitors",
    Icon: Swords,
    text: "See who ranks in your city, and exactly how far ahead of you they are.",
  },
  {
    id: "backlinks",
    label: "Backlinks",
    Icon: Link2,
    text: "Check every link pointing at a site. Spam is flagged so you can ignore it.",
  },
  {
    id: "keywords",
    label: "Keywords",
    Icon: KeyRound,
    text: "Find the phrases people search for and the ones you can realistically win.",
  },
];

function AuditPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between rounded-xl bg-ink p-5 text-white">
        <div>
          <p className="text-xs text-white/60">SEO score for yoursite.com</p>
          <p className="font-display text-8xl font-extrabold leading-[0.85] text-mark">{auditResult.score}</p>
        </div>
        <span className="rounded-full bg-mark px-3 py-1 font-display font-bold text-ink">
          Grade {auditResult.grade}
        </span>
      </div>
      <ul className="divide-y divide-line rounded-xl border border-line">
        {auditResult.issues.slice(0, 3).map((i) => (
          <li key={i.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">{i.title}</p>
              <p className="truncate text-sm text-ink/60">{i.fix}</p>
            </div>
            <span className="font-display text-2xl font-bold tabular-nums">+{GAIN[i.severity]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompetitorsPreview() {
  const rows = [...competitors, { name: "Your website", url: "yoursite.com", da: 31, you: true }].sort(
    (a, b) => b.da - a.da
  );
  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div
          key={r.url}
          className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${
            r.you ? "border-ink bg-mark/40" : "border-line"
          }`}
        >
          <span className="w-4 font-semibold text-ink/45">{i + 1}</span>
          <div className="w-32 shrink-0">
            <p className="truncate font-semibold">{r.name}</p>
            <p className="truncate text-xs text-ink/55">{r.url}</p>
          </div>
          <div className="h-2 flex-1 rounded-full bg-line">
            <div className="h-full rounded-full bg-ink" style={{ width: `${(r.da / 48) * 100}%` }} />
          </div>
          <span className="w-8 text-right font-display text-xl font-bold tabular-nums">{r.da}</span>
        </div>
      ))}
      <p className="pt-1 text-sm text-ink/60">Domain authority, out of 100</p>
    </div>
  );
}

function BacklinksPreview() {
  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-bad/30 bg-bad/5 p-3.5 text-[15px]">
        <strong>2 spam links found.</strong> Review these first.
      </p>
      <ul className="divide-y divide-line rounded-xl border border-line">
        {backlinks.slice(0, 6).map((b) => (
          <li key={b.domain} className={`flex items-center justify-between gap-3 px-4 py-3 ${b.status === "spam" ? "bg-bad/5" : ""}`}>
            <span className="truncate font-medium">{b.domain}</span>
            <span className="flex shrink-0 items-center gap-4 text-sm tabular-nums text-ink/60">
              DA {b.da}
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  b.status === "spam" ? "bg-bad/10 text-bad" : "bg-good/10 text-good"
                }`}
              >
                {b.status === "spam" ? "Spam" : "Good"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function level(d) {
  if (d < 35) return { label: "Easy", bar: "bg-good", text: "text-good" };
  if (d < 60) return { label: "Medium", bar: "bg-warn", text: "text-warn" };
  return { label: "Hard", bar: "bg-bad", text: "text-bad" };
}

function KeywordsPreview() {
  return (
    <ul className="divide-y divide-line rounded-xl border border-line">
      {keywords.slice(0, 5).map((k) => {
        const l = level(k.difficulty);
        return (
          <li key={k.keyword} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3.5 sm:grid-cols-[1fr_90px_130px]">
            <span className="font-medium">{k.keyword}</span>
            <span className="text-right text-sm tabular-nums text-ink/60 sm:text-left">
              {k.volume.toLocaleString()} / mo
            </span>
            <span className="col-span-2 flex items-center gap-2.5 sm:col-span-1">
              <span className={`w-14 text-xs font-semibold ${l.text}`}>{l.label}</span>
              <span className="h-1.5 flex-1 rounded-full bg-line">
                <span className={`block h-full rounded-full ${l.bar}`} style={{ width: `${k.difficulty}%` }} />
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const previews = {
  audit: AuditPreview,
  competitors: CompetitorsPreview,
  backlinks: BacklinksPreview,
  keywords: KeywordsPreview,
};

export default function ProductTour() {
  const [active, setActive] = useState("audit");
  const Preview = previews[active];
  const current = tabs.find((t) => t.id === active);

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr] lg:gap-12">
      <div role="tablist" aria-label="Product tour" className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {tabs.map(({ id, label, Icon }) => {
          const on = id === active;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(id)}
              className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition lg:items-start ${
                on ? "border-ink bg-mark" : "border-line bg-white hover:border-ink/40"
              }`}
            >
              <Icon size={20} className="mt-0.5 shrink-0" />
              <span>
                <span className="block font-display text-lg font-bold">{label}</span>
                {on && <span className="mt-1 hidden max-w-xs text-sm text-ink/75 lg:block">{current.text}</span>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="min-w-0">
        <p className="mb-3 text-ink/70 lg:hidden">{current.text}</p>
        <div className="overflow-hidden rounded-2xl border border-silver bg-white shadow-[0_30px_60px_-30px_rgba(29,31,35,0.45)]">
          <div className="flex items-center gap-2 border-b border-line bg-paper px-4 py-3">
            <span className="size-2.5 rounded-full bg-ink/20" />
            <span className="size-2.5 rounded-full bg-ink/20" />
            <span className="size-2.5 rounded-full bg-ink/20" />
            <span className="ml-3 text-xs text-ink/55">Dashboard / {current.label}</span>
          </div>
          <div className="p-5 sm:p-6">
            <Preview key={active} />
          </div>
        </div>
      </div>
    </div>
  );
}