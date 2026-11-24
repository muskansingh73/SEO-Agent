import { getJson } from "./net";

// Open PageRank: a free 0 to 10 authority score for a domain, based on its links.
const BASE = process.env.OPR_URL || "https://openpagerank.keywordseverywhere.com/api/v1.0/getPageRank";

export async function getAuthority(domains) {
  const map = new Map();
  const key = process.env.OPENPAGERANK_KEY;
  if (!key) {
    return { map, note: "Authority scores are switched off. Add OPENPAGERANK_KEY to .env.local to turn them on." };
  }

  const unique = [...new Set(domains)];
  let note = "";

  for (let i = 0; i < unique.length; i += 100) {
    const batch = unique.slice(i, i + 100);
    const query = batch.map((d) => `domains[]=${encodeURIComponent(d)}`).join("&");
    try {
      const { ok, status, data } = await getJson(`${BASE}?${query}`, {
        headers: { "API-OPR": key },
        timeout: 15000,
      });
      if (!ok || !data || !Array.isArray(data.response)) {
        if (status === 403) note = "Open PageRank refused the request. Free keys only work from the one IP address saved on your account.";
        else if (status === 401) note = "Open PageRank rejected the key. Check OPENPAGERANK_KEY in .env.local.";
        else note = "Authority scores are not available right now.";
        continue;
      }
      for (const item of data.response) {
        if (item.status_code === 200 && item.page_rank_decimal != null) {
          map.set(item.domain, { score: Number(item.page_rank_decimal), rank: item.rank ? Number(item.rank) : null });
        }
      }
    } catch {
      note = "Authority scores are not available right now.";
    }
  }
  return { map, note };
}