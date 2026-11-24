"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import AgentLoader from "@/components/AgentLoader";
import ErrorPanel from "@/components/ErrorPanel";
import { useJob } from "@/lib/useJob";

const steps = [
  "Checking your website",
  "Searching Google for your keyword",
  "Picking the businesses that rank",
  "Auditing each competitor's website",
  "Comparing the results",
];

const COUNTRIES = [
  ["in", "India"],
  ["us", "United States"],
  ["gb", "United Kingdom"],
  ["ca", "Canada"],
  ["au", "Australia"],
];

function Authority({ value }) {
  if (value === null || value === undefined) return <span className="text-ink/40">Not available</span>;
  return (
    <div className="flex items-center gap-3">
      <span className="w-9 font-semibold">{value.toFixed(1)}</span>
      <div className="h-1.5 w-24 rounded-full bg-line">
        <div className="h-full rounded-full bg-ink" style={{ width: `${Math.min(100, (value / 10) * 100)}%` }} />
      </div>
    </div>
  );
}

function Score({ score, grade }) {
  if (score === null) return <span className="text-ink/40">Could not read site</span>;
  return (
    <span className="flex items-center gap-2.5">
      <span className="font-display text-2xl font-bold tabular-nums">{score}</span>
      <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-medium text-ink/65">Grade {grade}</span>
    </span>
  );
}

export default function CompetitorsPage() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("in");
  const job = useJob("/api/competitors");

  function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim() || !keyword.trim()) return;
    job.start({ url, keyword, city, country });
  }

  const { running, result, error } = job;

  return (
    <>
      <PageHeader
        demo={false}
        title="Competitors"
        description="See who really ranks on Google for your keyword, and how their websites compare to yours."
      />

      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        <input className="input" placeholder="yourwebsite.com" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Your website" />
        <input className="input" placeholder="Main keyword, for example coffee beans" value={keyword} onChange={(e) => setKeyword(e.target.value)} aria-label="Main keyword" />
        <input className="input" placeholder="City (optional), for example Mumbai" value={city} onChange={(e) => setCity(e.target.value)} aria-label="City" />
        <div className="flex gap-3">
          <select className="input" value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Country">
            {COUNTRIES.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          <button className="btn" disabled={running}>
            {running ? "Searching…" : "Find competitors"}
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-6">
        {!running && !result && !error && (
          <div className="panel border-dashed p-10 text-center text-ink/60">
            Enter your website and the keyword you want to rank for.
          </div>
        )}

        {running && <AgentLoader steps={steps} onDone={job.finish} />}
        {error && <ErrorPanel title="We could not find competitors" message={error} />}

        {result && (
          <>
            <p className="text-lg">
              {result.you.position ? (
                <>
                  Your website is <strong>#{result.you.position}</strong> on Google for “{result.query}”.
                </>
              ) : (
                <>
                  Your website is <strong>not in the top 10</strong> on Google for “{result.query}”.
                </>
              )}
            </p>

            {result.note && (
              <p className="rounded-xl border border-warn/30 bg-warn/5 p-4 text-[15px]">{result.note}</p>
            )}

            <div className="panel overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-paper">
                  <tr>
                    <th className="th">Google rank</th>
                    <th className="th">Website</th>
                    <th className="th">SEO score</th>
                    <th className="th">Authority, 0 to 10</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-mark/30">
                    <td className="td font-semibold">{result.you.position ? `#${result.you.position}` : "Not in top 10"}</td>
                    <td className="td">
                      <span className="font-semibold">{result.you.domain}</span>
                      <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-xs font-medium text-white">You</span>
                    </td>
                    <td className="td"><Score score={result.you.score} grade={result.you.grade} /></td>
                    <td className="td"><Authority value={result.you.authority} /></td>
                  </tr>
                  {result.competitors.map((c) => (
                    <tr key={c.domain}>
                      <td className="td font-semibold text-ink/60">#{c.position}</td>
                      <td className="td">
                        <span className="font-semibold">{c.domain}</span>
                        <br />
                        <span className="line-clamp-1 max-w-xs text-ink/55">{c.title}</span>
                      </td>
                      <td className="td"><Score score={c.score} grade={c.grade} /></td>
                      <td className="td"><Authority value={c.authority} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-ink/55">
              SEO score comes from the same 16 checks as the Site audit, run on each competitor's home page.
              {result.hidden > 0 &&
                ` We hid ${result.hidden} big ${result.hidden === 1 ? "directory or social site" : "directories or social sites"} so you only see businesses like yours.`}
            </p>

            <section>
              <h2 className="mb-3 font-display text-2xl font-bold tracking-tight">What they do that you don't</h2>
              {result.gaps.length === 0 ? (
                <div className="panel p-5 text-ink/70">
                  You pass every check that most of these competitors pass.
                </div>
              ) : (
                <div className="panel divide-y divide-line">
                  {result.gaps.map((g) => (
                    <div key={g.id} className="flex flex-wrap items-start justify-between gap-4 p-5">
                      <div className="min-w-0">
                        <h3 className="font-semibold">{g.name}</h3>
                        <p className="mt-1 text-sm text-ink/65">
                          {g.competitorsPassing} of {g.total} competitors pass this check. You don't.
                        </p>
                        <p className="mt-2 text-[15px]">
                          <span className="marker">{g.fix}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-3xl font-bold tabular-nums">+{g.points}</p>
                        <p className="text-xs text-ink/55">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}