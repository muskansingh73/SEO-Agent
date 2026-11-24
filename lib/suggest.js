import { getJson, mapLimit } from "./net";

// Google's own search suggestions: the same source AnswerThePublic uses. Free, no key.
const BASE = process.env.SUGGEST_URL || "https://suggestqueries.google.com/complete/search";

const QUESTION_WORDS = ["what", "why", "how", "when", "where", "who", "which", "can", "is", "are", "does", "should"];
const PREPOSITIONS = ["for", "with", "without", "near", "to", "in", "on", "from"];
const COMPARISONS = ["vs", "versus", "or", "and", "like"];
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const COUNTRIES = ["in", "us", "gb", "ca", "au"];

const LIMITS = { popular: 20, questions: 40, prepositions: 40, comparisons: 30, alphabet: 60 };

// A rough guess from the wording only. Not data from Google.
function guessIntent(k) {
  if (/\b(near me|nearby|near)\b/.test(k)) return "Local";
  if (/\b(buy|price|cheap|cheapest|order|online|shop|discount|deal|sale|coupon|delivery)\b/.test(k)) return "Transactional";
  if (/\b(best|top|review|reviews|vs|versus|compare|alternative|alternatives)\b/.test(k)) return "Commercial";
  if (/^(what|why|how|when|where|who|which|can|is|are|does|should)\b/.test(k) || /\b(guide|tutorial|ideas|tips)\b/.test(k))
    return "Informational";
  return "General";
}

export async function getSuggestions(topic, country = "in") {
  const clean = String(topic || "").trim().toLowerCase().replace(/\s+/g, " ").slice(0, 80);
  if (!clean) throw new Error("Enter a topic first.");
  const gl = COUNTRIES.includes(country) ? country : "in";

  // Order matters: when a suggestion shows up in several groups, the first group keeps it.
  const queries = [
    { q: clean, group: "popular" },
    ...QUESTION_WORDS.map((w) => ({ q: `${w} ${clean}`, group: "questions" })),
    ...PREPOSITIONS.map((p) => ({ q: `${clean} ${p}`, group: "prepositions" })),
    ...COMPARISONS.map((c) => ({ q: `${clean} ${c}`, group: "comparisons" })),
    ...LETTERS.map((l) => ({ q: `${clean} ${l}`, group: "alphabet" })),
  ];

  let failures = 0;
  const batches = await mapLimit(queries, 6, async ({ q, group }) => {
    try {
      const url = `${BASE}?client=firefox&hl=en&gl=${gl}&q=${encodeURIComponent(q)}`;
      const { ok, data } = await getJson(url, { timeout: 6000 });
      if (!ok || !Array.isArray(data) || !Array.isArray(data[1])) {
        failures++;
        return [];
      }
      return data[1].filter((s) => typeof s === "string").map((keyword) => ({ keyword, group }));
    } catch {
      failures++;
      return [];
    }
  });

  if (failures === queries.length) {
    throw new Error("Could not reach Google's suggestions. Wait a minute and try again.");
  }

  const groups = { popular: [], questions: [], prepositions: [], comparisons: [], alphabet: [] };
  const seen = new Set([clean]);
  for (const { keyword, group } of batches.flat()) {
    const k = keyword.trim().toLowerCase();
    if (!k || seen.has(k) || groups[group].length >= LIMITS[group]) continue;
    seen.add(k);
    groups[group].push({ keyword: k, intent: guessIntent(k) });
  }

  const total = Object.values(groups).reduce((sum, list) => sum + list.length, 0);
  if (total === 0) throw new Error("Google had no suggestions for that topic. Try a more common phrase.");
  return { topic: clean, country: gl, total, groups };
}