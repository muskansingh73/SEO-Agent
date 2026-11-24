import { toDomain } from "./net";
import { getAuthority } from "./authority";
import { riskSignals, verdictFor } from "./risk";

const MAX_DOMAINS = 100;

export async function checkLinkingSites(text) {
  const tokens = String(text || "").slice(0, 20000).split(/[\s,;]+/);
  const all = [...new Set(tokens.map(toDomain).filter(Boolean))];
  if (all.length === 0) {
    throw new Error("No website addresses found. Paste one domain per line, for example example.com.");
  }
  const domains = all.slice(0, MAX_DOMAINS);

  const { map, note } = await getAuthority(domains);

  const rows = domains.map((domain) => {
    const found = map.get(domain);
    const authority = found ? found.score : null;
    const signals = riskSignals(domain);
    return { domain, authority, rank: found ? found.rank : null, signals, verdict: verdictFor(authority, signals) };
  });

  // Strongest sites first, unrated ones last
  rows.sort((a, b) => (b.authority ?? -1) - (a.authority ?? -1));

  return { rows, note, trimmed: all.length > MAX_DOMAINS, limit: MAX_DOMAINS };
}