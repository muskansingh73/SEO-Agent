"use client";

import { useRef, useState } from "react";
import { Globe, Lightbulb, Check, TriangleAlert } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import AgentLoader from "@/components/AgentLoader";

const steps = [
  "Loading the page",
  "Reading title and meta tags",
  "Checking headings and images",
  "Looking for schema and a sitemap",
  "Calculating your score",
];

const SEVERITY = {
  high: { label: "High impact", border: "border-l-bad", chip: "bg-bad/10 text-bad" },
  medium: { label: "Medium impact", border: "border-l-warn", chip: "bg-warn/10 text-warn" },
  low: { label: "Low impact", border: "border-l-good", chip: "bg-good/10 text-good" },
};

function barColor(score) {
  if (score >= 80) return "bg-good";
  if (score >= 60) return "bg-warn";
  return "bg-bad";
}

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const request = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;
    setResult(null);
    setError("");
    setRunning(true);

    // The real audit starts now. The loader below only shows progress while it runs.
    request.current = fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .catch(() => ({
        ok: false,
        data: { error: "Could not reach the server. Check your connection and try again." },
      }));
  }

  async function finish() {
    const { ok, data } = await request.current;
    if (ok) setResult(data);
    else setError(data.error || "Something went wrong.");
    setRunning(false);
  }

  const totalGain = result ? result.issues.reduce((sum, i) => sum + i.gain, 0) : 0;

  return (
    <>
      <PageHeader
        demo={false}
        title="Site audit"
        description="Enter a website to see its SEO score and what to fix first."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Globe size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            className="input !pl-11"
            placeholder="yourwebsite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="Website address"
          />
        </div>
        <button className="btn" disabled={running}>
          {running ? "Auditing…" : "Audit website"}
        </button>
      </form>

      <div className="mt-8 space-y-6">
        {!running && !result && !error && (
          <div className="panel border-dashed p-10 text-center text-ink/60">
            Enter a website address above to see its score and what to fix.
          </div>
        )}

        {running && <AgentLoader steps={steps} onDone={finish} />}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-bad/30 bg-bad/5 p-5" role="alert">
            <TriangleAlert size={20} className="mt-0.5 shrink-0 text-bad" />
            <div>
              <p className="font-semibold">We could not audit that website</p>
              <p className="mt-1 text-[15px] text-ink/75">{error}</p>
              <p className="mt-1 text-sm text-ink/55">Check the address and try again.</p>
            </div>
          </div>
        )}

        {result && (
          <>
            {/* Score: the one dark block on the page */}
            <section className="overflow-hidden rounded-2xl bg-ink p-6 text-white sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="min-w-0">
                  <p className="break-all text-sm text-white/60">SEO score for {result.url}</p>
                  <p className="mt-2 font-display text-[112px] font-extrabold leading-[0.85] text-mark sm:text-[150px]">
                    {result.score}
                  </p>
                </div>
                <span className="rounded-full bg-mark px-4 py-1.5 font-display text-lg font-bold text-ink">
                  Grade {result.grade}
                </span>
              </div>

              <div className="mt-10">
                <div className="relative h-3 rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-mark" style={{ width: `${result.score}%` }} />
                  {[50, 70, 85].map((t) => (
                    <span key={t} className="absolute top-0 h-full w-0.5 bg-ink" style={{ left: `${t}%` }} />
                  ))}
                </div>
                <div className="relative mt-2 h-4 text-[11px] text-white/55">
                  {[
                    ["Poor", 0],
                    ["Fair", 50],
                    ["Good", 70],
                    ["Excellent", 85],
                  ].map(([label, left]) => (
                    <span key={label} className="absolute whitespace-nowrap" style={{ left: `${left}%` }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-6 text-white/80">
                {result.issues.length > 0 ? (
                  <>
                    Fixing the {result.issues.length} {result.issues.length === 1 ? "issue" : "issues"} below
                    could take you to{" "}
                    <strong className="text-white">{Math.min(100, result.score + totalGain)}</strong>.
                  </>
                ) : (
                  "Every check passed. Nothing to fix."
                )}
              </p>
              <p className="mt-2 text-sm text-white/50">
                The page loaded in {result.loadMs} ms and has about {result.stats.words} words and{" "}
                {result.stats.images} images.
              </p>
            </section>

            {/* Category scores */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {result.categories.map((c) => (
                <div key={c.name} className="panel p-5">
                  <p className="text-sm text-ink/60">{c.name}</p>
                  <p className="mt-1 font-display text-4xl font-bold tabular-nums">{c.score}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-line">
                    <div className={`h-full rounded-full ${barColor(c.score)}`} style={{ width: `${c.score}%` }} />
                  </div>
                </div>
              ))}
            </section>

            {/* Issues, biggest gain first */}
            {result.issues.length > 0 && (
              <section>
                <h2 className="mb-3 font-display text-2xl font-bold tracking-tight">What to fix, in order</h2>
                <div className="panel divide-y divide-line overflow-hidden">
                  {result.issues.map((issue) => {
                    const s = SEVERITY[issue.severity];
                    return (
                      <div
                        key={issue.id}
                        className={`grid gap-3 border-l-4 p-5 sm:grid-cols-[1fr_auto] sm:gap-8 ${s.border}`}
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="font-semibold">{issue.title}</h3>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.chip}`}>
                              {s.label}
                            </span>
                          </div>
                          <p className="mt-1 break-words text-sm text-ink/65">{issue.detail}</p>
                          <p className="mt-3 flex items-start gap-2 text-[15px]">
                            <Lightbulb size={17} className="mt-0.5 shrink-0" />
                            <span>
                              <span className="marker">{issue.fix}</span>
                            </span>
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <p className="font-display text-3xl font-bold tabular-nums">+{issue.gain}</p>
                          <p className="text-xs text-ink/55">points</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* What already works */}
            {result.passed.length > 0 && (
              <section>
                <h2 className="mb-3 font-display text-2xl font-bold tracking-tight">Already working</h2>
                <ul className="flex flex-wrap gap-2.5">
                  {result.passed.map((name) => (
                    <li
                      key={name}
                      className="flex items-center gap-1.5 rounded-full bg-good/10 px-3.5 py-1.5 text-sm font-medium text-good"
                    >
                      <Check size={14} strokeWidth={3} /> {name}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}