"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import AgentLoader from "@/components/AgentLoader";
import ErrorPanel from "@/components/ErrorPanel";
import { useJob } from "@/lib/useJob";

const steps = [
  "Reading your list of websites",
  "Looking up each site's authority",
  "Checking for spam warning signs",
];

const EXAMPLE = "wikipedia.org\ngithub.com\nmedium.com\nbbc.com\nstackoverflow.com";

const TABS = [
  { id: "all", label: "All sites" },
  { id: "good", label: "Good" },
  { id: "review", label: "Needs review" },
];

const VERDICT = {
  strong: { label: "Strong", style: "bg-good/10 text-good" },
  okay: { label: "Okay", style: "bg-link/10 text-link" },
  weak: { label: "Weak", style: "bg-warn/10 text-warn" },
  risky: { label: "Risky", style: "bg-bad/10 text-bad" },
  unrated: { label: "Not rated", style: "bg-paper text-ink/60" },
};

export default function BacklinksPage() {
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const job = useJob("/api/backlinks");

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setFilter("all");
    job.start({ text });
  }

  async function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const content = await file.text();
    setText((prev) => (prev ? prev + "\n" : "") + content);
    e.target.value = "";
  }

  const { running, result, error } = job;
  const rows = result ? result.rows : [];
  const good = rows.filter((r) => r.verdict === "strong" || r.verdict === "okay").length;
  const review = rows.filter((r) => r.verdict === "weak" || r.verdict === "risky").length;
  const shown = rows.filter((r) => {
    if (filter === "good") return r.verdict === "strong" || r.verdict === "okay";
    if (filter === "review") return r.verdict === "weak" || r.verdict === "risky";
    return true;
  });

  return (
    <>
      <PageHeader
        demo={false}
        title="Backlinks"
        description="Check the quality of the websites that link to you, and spot the risky ones."
      />

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          className="input min-h-40 resize-y font-mono !text-sm"
          placeholder={"Paste the websites that link to you, one per line:\nexample.com\nanother-site.org"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Websites that link to you"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn" disabled={running}>
            {running ? "Checking…" : "Check linking sites"}
          </button>
          <label className="btn btn-line cursor-pointer">
            Upload a CSV file
            <input type="file" accept=".csv,.txt" className="sr-only" onChange={handleFile} />
          </label>
          <button type="button" className="text-sm font-medium underline underline-offset-4" onClick={() => setText(EXAMPLE)}>
            Try an example list
          </button>
        </div>
        <p className="text-sm text-ink/60">
          Get your list free from Google Search Console: open your website, choose Links, then Top linking sites, and
          export it. A free list of who links to <em>other</em> people's websites does not exist, so this tool works for
          sites you own or manage.
        </p>
      </form>

      <div className="mt-8 space-y-6">
        {running && <AgentLoader steps={steps} onDone={job.finish} />}
        {error && <ErrorPanel title="We could not check those sites" message={error} />}

        {result && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="panel p-5">
                <p className="text-sm text-ink/60">Sites checked</p>
                <p className="mt-1 font-display text-4xl font-bold tabular-nums">{rows.length}</p>
              </div>
              <div className="panel p-5">
                <p className="text-sm text-ink/60">Good links</p>
                <p className="mt-1 font-display text-4xl font-bold tabular-nums text-good">{good}</p>
              </div>
              <div className="panel p-5">
                <p className="text-sm text-ink/60">Need review</p>
                <p className="mt-1 font-display text-4xl font-bold tabular-nums text-bad">{review}</p>
              </div>
            </div>

            {result.note && (
              <p className="rounded-xl border border-warn/30 bg-warn/5 p-4 text-[15px]">{result.note}</p>
            )}
            {result.trimmed && (
              <p className="rounded-xl border border-line bg-white p-4 text-[15px]">
                We checked the first {result.limit} websites in your list.
              </p>
            )}

            <div className="inline-flex rounded-lg border border-line bg-white p-1" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={filter === t.id}
                  onClick={() => setFilter(t.id)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                    filter === t.id ? "bg-ink text-white" : "text-ink/65 hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="panel overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-paper">
                  <tr>
                    <th className="th">Website</th>
                    <th className="th">Authority, 0 to 10</th>
                    <th className="th">World rank</th>
                    <th className="th">Warning signs</th>
                    <th className="th">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => {
                    const v = VERDICT[r.verdict];
                    return (
                      <tr key={r.domain} className={r.verdict === "risky" ? "bg-bad/5" : ""}>
                        <td className="td font-medium">{r.domain}</td>
                        <td className="td">
                          {r.authority === null ? (
                            <span className="text-ink/40">Not available</span>
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className="w-9 font-semibold">{r.authority.toFixed(1)}</span>
                              <div className="h-1.5 w-20 rounded-full bg-line">
                                <div className="h-full rounded-full bg-ink" style={{ width: `${(r.authority / 10) * 100}%` }} />
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="td text-ink/65">{r.rank ? `#${r.rank.toLocaleString()}` : "–"}</td>
                        <td className="td">
                          {r.signals.length === 0 ? (
                            <span className="text-ink/40">None</span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {r.signals.map((s) => (
                                <span key={s} className="rounded-full bg-bad/10 px-2.5 py-0.5 text-xs font-medium text-bad">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="td">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${v.style}`}>{v.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-ink/55">
              Authority is a free score from Open PageRank, based on how many strong sites link to a site. Warning signs
              are things we can see in the domain name. They are hints, not a verdict from Google.
            </p>
          </>
        )}
      </div>
    </>
  );
}