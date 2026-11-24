"use client";

import { useEffect, useState } from "react";
import { Search, Star } from "lucide-react";

const ROW = 104; // height of each result row in px

const results = [
  {
    id: "brew",
    site: "brewhouse.in",
    title: "Brew House — Fresh roasted coffee beans in Mumbai",
    snippet: "Small-batch coffee beans roasted in Mumbai and delivered to your door within 24 hours.",
    before: 1,
    after: 1,
  },
  {
    id: "you",
    site: "yoursite.com",
    you: true,
    before: 6,
    after: 2,
  },
  {
    id: "bazaar",
    site: "beanbazaar.com",
    title: "Bean Bazaar: Single origin & blended coffee beans online",
    snippet: "Shop single origin coffee beans from Coorg, Chikmagalur and Araku. Free shipping over ₹499.",
    before: 2,
    after: 3,
  },
  {
    id: "roast",
    site: "roastandco.in",
    title: "Roast & Co | Specialty coffee roasters",
    snippet: "Specialty coffee beans, roasted fresh every week. Subscribe and save on your next order.",
    before: 3,
    after: 4,
  },
  {
    id: "central",
    site: "cafecentral.in",
    title: "Cafe Central — coffee, brunch and beans to go",
    snippet: "Our Bandra cafe serves brunch all day. Take home our house blend coffee beans.",
    before: 4,
    after: 5,
  },
  {
    id: "grind",
    site: "dailygrind.in",
    title: "The Daily Grind — buy coffee online",
    snippet: "Order ground or whole bean coffee from small farms. New customers get 10% off.",
    before: 5,
    after: 6,
  },
];

const youBefore = {
  title: "Home - yoursite.com",
  snippet: "Welcome to our website. Menu About Contact Login Cart Search Skip to content Home Shop Blog ...",
};
const youAfter = {
  title: "Fresh coffee beans in Mumbai, roasted daily | Your Café",
  snippet: "Buy freshly roasted coffee beans in Mumbai. Single origin, blends and brewing gear delivered within 24 hours.",
};

// Bold the search words inside a snippet, like Google does.
function Highlight({ text }) {
  const parts = text.split(/(coffee beans|coffee)/gi);
  return parts.map((p, i) =>
    /^(coffee beans|coffee)$/i.test(p) ? (
      <strong key={i} className="font-semibold text-ink">
        {p}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function SerpDemo() {
  const [fixed, setFixed] = useState(false);

  // Play the climb once, shortly after the page loads.
  useEffect(() => {
    const t = setTimeout(() => setFixed(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="panel overflow-hidden shadow-[0_24px_60px_-30px_rgba(18,21,28,0.45)]">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Search size={18} className="text-ink/50" />
        <span className="truncate text-[15px]">best coffee beans in mumbai</span>
      </div>

      <div className="relative" style={{ height: ROW * results.length }}>
        {results.map((r) => {
          const pos = fixed ? r.after : r.before;
          const content = r.you ? (fixed ? youAfter : youBefore) : r;
          return (
            <div
              key={r.id}
              className={`absolute inset-x-0 top-0 flex gap-3 border-b border-line px-4 py-3 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${
                r.you ? "z-10 border-l-4 border-l-ink bg-mark/40" : "bg-white"
              }`}
              style={{ height: ROW, transform: `translateY(${(pos - 1) * ROW}px)` }}
            >
              <span className="w-4 pt-0.5 text-sm font-semibold tabular-nums text-ink/45">{pos}</span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 truncate text-xs text-serp">
                  {r.site}
                  {r.you && fixed && (
                    <span className="flex items-center gap-0.5 text-amber-600">
                      <Star size={11} fill="currentColor" /> 4.8 (212)
                    </span>
                  )}
                </p>
                <p className="truncate text-[17px] font-medium leading-snug text-link">{content.title}</p>
                <p className="line-clamp-2 text-[13px] leading-snug text-ink/65">
                  <Highlight text={content.snippet} />
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-ink px-4 py-3 text-white">
        <p className="text-sm">
          Your score:{" "}
          <span className="font-display text-xl font-bold text-mark tabular-nums">{fixed ? 86 : 54}</span>
          <span className="text-white/60"> / 100</span>
        </p>
        <div className="flex rounded-lg bg-white/10 p-1 text-sm font-medium" role="group" aria-label="Compare">
          <button
            onClick={() => setFixed(false)}
            className={`rounded-md px-3 py-1.5 transition ${!fixed ? "bg-white text-ink" : "text-white/70"}`}
          >
            Today
          </button>
          <button
            onClick={() => setFixed(true)}
            className={`rounded-md px-3 py-1.5 transition ${fixed ? "bg-mark text-ink" : "text-white/70"}`}
          >
            After fixes
          </button>
        </div>
      </div>
    </div>
  );
}