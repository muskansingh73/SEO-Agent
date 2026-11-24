"use client";

import { useState } from "react";
import { Search, Copy, Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import AgentLoader from "@/components/AgentLoader";
import ErrorPanel from "@/components/ErrorPanel";
import { useJob } from "@/lib/useJob";

const steps = [
  "Asking Google what people type",
  "Collecting questions and comparisons",
  "Adding ideas from A to Z",
  "Sorting the results",
];

const COUNTRIES = [
  ["in", "India"],
  ["us", "United States"],
  ["gb", "United Kingdom"],
  ["ca", "Canada"],
  ["au", "Australia"],
];

const GROUPS = [
  { id: "popular", title: "Popular searches", note: "What Google suggests first for your topic." },
  { id: "questions", title: "Questions people ask", note: "Good ideas for blog posts and FAQ sections." },
  { id: "prepositions", title: "Searches with more detail", note: "For, with, near, in and similar." },
  { id: "comparisons", title: "Comparisons", note: "People choosing between options." },
  { id: "alphabet", title: "More ideas, A to Z", note: "Extra searches that start with each letter." },
];

const INTENT_STYLE = {
  Informational: "bg-link/10 text-link",
  Commercial: "bg-warn/10 text-warn",
  Transactional: "bg-good/10 text-good",
  Local: "bg-mark/40 text-ink",
  General: "bg-paper text-ink/65",
};

export default function KeywordsPage() {
  const [topic, setTopic] = useState("");
  const [country, setCountry] = useState("in");
  const [copied, setCopied] = useState("");
  const job = useJob("/api/keywords");

  function handleSubmit(e) {
    e.preventDefault();
    if (!topic.trim()) return;
    job.start({ topic, country });
  }

  async function copyGroup(id, list) {
    try {
      await navigator.clipboard.writeText(list.map((k) => k.keyword).join("\n"));
      setCopied(id);
      setTimeout(() => setCopied(""), 1800);
    } catch {}
  }

  const { running, result, error } = job;

  return (
    <>
      <PageHeader
        demo={false}
        title="Keywords"
        description="See what people really type into Google about your topic."
      />

      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_190px_auto]">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            className="input !pl-11"
            placeholder="Your topic, for example coffee beans"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-label="Topic"
          />
        </div>
        <select className="input" value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Country">
          {COUNTRIES.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <button className="btn" disabled={running}>
          {running ? "Searching…" : "Find keywords"}
        </button>
      </form>

      <div className="mt-8 space-y-6">
        {!running && !result && !error && (
          <div className="panel border-dashed p-10 text-center text-ink/60">
            Enter a topic to see what people search for.
          </div>
        )}

        {running && <AgentLoader steps={steps} onDone={job.finish} />}
        {error && <ErrorPanel title="We could not get keywords" message={error} />}

        {result && (
          <>
            <div>
              <p className="text-lg">
                Found <strong>{result.total}</strong> searches people type into Google about “{result.topic}”.
              </p>
              <p className="mt-1 text-sm text-ink/60">
                These are Google's own suggestions, shown most popular first. Search volume and difficulty need a
                paid data source, so they are not shown here. The intent label is a guess from the wording.
              </p>
            </div>

            {GROUPS.map((g) => {
              const list = result.groups[g.id];
              if (!list || list.length === 0) return null;
              return (
                <section key={g.id} className="panel overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight">
                        {g.title} <span className="text-base text-ink/45">{list.length}</span>
                      </h2>
                      <p className="text-sm text-ink/60">{g.note}</p>
                    </div>
                    <button
                      onClick={() => copyGroup(g.id, list)}
                      className="btn btn-line !px-3.5 !py-2"
                      type="button"
                    >
                      {copied === g.id ? <Check size={15} /> : <Copy size={15} />}
                      {copied === g.id ? "Copied" : "Copy list"}
                    </button>
                  </div>
                  <ul className="grid sm:grid-cols-2">
                    {list.map((k) => (
                      <li
                        key={k.keyword}
                        className="flex items-center justify-between gap-3 border-t border-line px-5 py-2.5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                      >
                        <span className="min-w-0 break-words">{k.keyword}</span>
                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${INTENT_STYLE[k.intent]}`}>
                          {k.intent}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}