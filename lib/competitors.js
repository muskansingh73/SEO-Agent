import { runAudit } from "./audit";
import { searchGoogle } from "./serp";
import { getAuthority } from "./authority";
import { toDomain } from "./net";

// Big directories, marketplaces and social sites. They rank, but they are not businesses like yours.
const SKIP = [
  "wikipedia.org", "youtube.com", "facebook.com", "instagram.com", "linkedin.com", "twitter.com", "x.com",
  "pinterest.com", "reddit.com", "quora.com", "amazon.in", "amazon.com", "flipkart.com", "justdial.com",
  "tripadvisor.com", "yelp.com", "zomato.com", "swiggy.com", "medium.com", "indiamart.com", "sulekha.com",
];

const COMPETITORS_SHOWN = 5;

export async function findCompetitors({ url, keyword, city, country }) {
  const cleanKeyword = String(keyword || "").trim().slice(0, 80);
  if (!cleanKeyword) throw new Error("Enter the main keyword you want to rank for.");
  const cleanCity = String(city || "").trim().slice(0, 60);
  const query = cleanCity ? `${cleanKeyword} in ${cleanCity}` : cleanKeyword;

  // Audit the user's own site first. This also checks the address is valid.
  const yourAudit = await runAudit(url);
  const yourDomain = toDomain(yourAudit.url);

  const results = await searchGoogle(query, country);

  let yourPosition = null;
  const picked = [];
  const seen = new Set();
  let hidden = 0;

  for (const r of results) {
    let host;
    try {
      host = new URL(r.link).hostname.replace(/^www\./, "");
    } catch {
      continue;
    }
    if (host === yourDomain) {
      if (yourPosition === null) yourPosition = r.position;
      continue;
    }
    if (seen.has(host)) continue;
    seen.add(host);
    if (SKIP.some((s) => host === s || host.endsWith("." + s))) {
      hidden++;
      continue;
    }
    if (picked.length < COMPETITORS_SHOWN) picked.push({ host, ...r });
  }

  if (picked.length === 0) {
    throw new Error("Google returned no business websites for that search. Try a broader keyword.");
  }

  // Audit every competitor with the same engine, and look up authority, at the same time
  const [audits, authority] = await Promise.all([
    Promise.all(picked.map((c) => runAudit(c.link).catch(() => null))),
    getAuthority([yourDomain, ...picked.map((c) => c.host)]),
  ]);

  const authorityFor = (domain) => authority.map.get(domain) || null;

  const competitors = picked.map((c, i) => {
    const a = audits[i];
    const auth = authorityFor(c.host);
    return {
      domain: c.host,
      url: c.link,
      title: c.title,
      position: c.position,
      score: a ? a.score : null,
      grade: a ? a.grade : null,
      authority: auth ? auth.score : null,
    };
  });

  // Checks you fail that most competitors pass: the clearest things to copy
  const readable = audits.filter(Boolean);
  const gaps = yourAudit.checks
    .filter((c) => c.status !== "pass")
    .map((c) => ({
      id: c.id,
      name: c.name,
      fix: c.fix,
      points: c.max - c.points,
      competitorsPassing: readable.filter((a) => a.checks.find((x) => x.id === c.id)?.status === "pass").length,
      total: readable.length,
    }))
    .filter((g) => g.total > 0 && g.competitorsPassing * 2 >= g.total)
    .sort((a, b) => b.competitorsPassing - a.competitorsPassing || b.points - a.points)
    .slice(0, 5);

  const mine = authorityFor(yourDomain);
  return {
    query,
    you: {
      domain: yourDomain,
      url: yourAudit.url,
      position: yourPosition,
      score: yourAudit.score,
      grade: yourAudit.grade,
      authority: mine ? mine.score : null,
    },
    competitors,
    gaps,
    hidden,
    note: authority.note,
  };
}