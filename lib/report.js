// Turns the raw audit result into the shape the dashboard page shows.

const CATEGORIES = [
  { name: "Technical SEO", ids: ["https", "indexable", "canonical", "robots", "sitemap", "viewport", "lang"] },
  { name: "On-page SEO", ids: ["title", "description", "h1", "h2"] },
  { name: "Content and links", ids: ["words", "links", "alt"] },
  { name: "Rich results", ids: ["og", "schema"] },
];

function severityFor(pointsLost) {
  if (pointsLost >= 6) return "high";
  if (pointsLost >= 3) return "medium";
  return "low";
}

export function toReport(audit) {
  const byId = Object.fromEntries(audit.checks.map((c) => [c.id, c]));

  const categories = CATEGORIES.map((cat) => {
    const list = cat.ids.map((id) => byId[id]).filter(Boolean);
    const points = list.reduce((sum, c) => sum + c.points, 0);
    const max = list.reduce((sum, c) => sum + c.max, 0);
    return { name: cat.name, score: max ? Math.round((points / max) * 100) : 0 };
  });

  // audit.issues is already sorted, biggest points lost first
  const issues = audit.issues.map((c) => ({
    id: c.id,
    severity: severityFor(c.lost),
    title: c.name,
    detail: c.message,
    fix: c.fix,
    gain: c.lost,
  }));

  const passed = audit.checks.filter((c) => c.status === "pass").map((c) => c.name);

  return {
    url: audit.url,
    score: audit.score,
    grade: audit.grade,
    loadMs: audit.loadMs,
    stats: audit.stats,
    categories,
    issues,
    passed,
  };
}