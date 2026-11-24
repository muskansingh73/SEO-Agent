import { getJson } from "./net";

// Real Google results through SerpApi. The free plan has a limited number of searches
// each month, so every answer is remembered for 24 hours.
const BASE = process.env.SERPAPI_URL || "https://serpapi.com/search.json";
const DAY = 24 * 60 * 60 * 1000;
const cache = new Map();

const GOOGLE_DOMAIN = {
  in: "google.co.in",
  us: "google.com",
  gb: "google.co.uk",
  ca: "google.ca",
  au: "google.com.au",
};

export async function searchGoogle(query, country = "in") {
  const key = process.env.SERPAPI_KEY;
  if (!key) {
    throw new Error("The competitor finder needs a free SerpApi key. Add SERPAPI_KEY to .env.local and restart the server.");
  }

  const cacheKey = `${country}|${query.toLowerCase()}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < DAY) return hit.results;

  const gl = GOOGLE_DOMAIN[country] ? country : "in";
  const url =
    `${BASE}?engine=google&q=${encodeURIComponent(query)}&gl=${gl}&hl=en` +
    `&google_domain=${GOOGLE_DOMAIN[gl]}&api_key=${encodeURIComponent(key)}`;

  let res;
  try {
    res = await getJson(url, { timeout: 30000 });
  } catch {
    throw new Error("Could not reach SerpApi. Try again in a moment.");
  }
  const { ok, data } = res;
  if (!ok || !data || data.error) {
    throw new Error(data && data.error ? `SerpApi says: ${data.error}` : "Could not get Google results right now.");
  }

  const results = (data.organic_results || [])
    .filter((r) => r.link)
    .map((r) => ({ position: r.position, title: r.title || r.link, link: r.link }));
  cache.set(cacheKey, { at: Date.now(), results });
  return results;
}