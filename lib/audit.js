import * as cheerio from "cheerio";
import dns from "node:dns/promises";
import net from "node:net";

const UA = "Mozilla/5.0 (compatible; SEOAgentBot/1.0)";

/* ---------- Safety: block private/internal addresses (SSRF protection) ---------- */
function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }
  const v = ip.toLowerCase();
  return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80");
}

export async function normalizeAndValidateUrl(input) {
  let raw = String(input || "").trim();
  if (!raw) throw new Error("Please enter a website URL.");
  if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;

  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("That does not look like a valid URL.");
  }
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only http/https URLs are allowed.");

  // For local testing only: set ALLOW_PRIVATE=true in .env.local
  if (process.env.ALLOW_PRIVATE !== "true") {
    const addrs = await dns.lookup(url.hostname, { all: true }).catch(() => {
      throw new Error("Could not find that website. Check the URL.");
    });
    if (addrs.some((a) => isPrivateIp(a.address))) {
      throw new Error("This address is not allowed.");
    }
  }
  return url;
}

/* ---------- Fetch helper with timeout ---------- */
async function fetchWithTimeout(url, ms = 12000, method = "GET") {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    });
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- Result builders ---------- */
const pass = (id, name, max, message) => ({ id, name, status: "pass", points: max, max, message, fix: null });
const warn = (id, name, max, message, fix) => ({ id, name, status: "warn", points: Math.round(max / 2), max, message, fix });
const fail = (id, name, max, message, fix) => ({ id, name, status: "fail", points: 0, max, message, fix });

/* ---------- The audit ---------- */
export async function runAudit(inputUrl) {
  const url = await normalizeAndValidateUrl(inputUrl);

  const started = Date.now();
  let res;
  try {
    res = await fetchWithTimeout(url.href);
  } catch {
    throw new Error("Could not load the website (timed out or blocked).");
  }
  const loadMs = Date.now() - started;
  if (!res.ok) throw new Error(`The website returned an error (status ${res.status}).`);

  const finalUrl = new URL(res.url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const checks = [];

  // 1. HTTPS (8)
  checks.push(
    finalUrl.protocol === "https:"
      ? pass("https", "HTTPS", 8, "Site is served over HTTPS.")
      : fail("https", "HTTPS", 8, "Site is not using HTTPS.", "Install an SSL certificate and redirect all HTTP traffic to HTTPS.")
  );

  // 2. Title (10)
  const title = $("head title").first().text().trim();
  if (!title) checks.push(fail("title", "Title tag", 10, "No title tag found.", "Add a unique <title> of 30–60 characters with your main keyword."));
  else if (title.length < 30 || title.length > 60)
    checks.push(warn("title", "Title tag", 10, `Title is ${title.length} characters ("${title}").`, "Keep the title between 30 and 60 characters so it is not cut off in Google."));
  else checks.push(pass("title", "Title tag", 10, `Good title length (${title.length} characters).`));

  // 3. Meta description (10)
  const desc = ($('meta[name="description"]').attr("content") || "").trim();
  if (!desc) checks.push(fail("description", "Meta description", 10, "No meta description found.", "Add a meta description of 70–160 characters that makes people want to click."));
  else if (desc.length < 70 || desc.length > 160)
    checks.push(warn("description", "Meta description", 10, `Description is ${desc.length} characters.`, "Keep the meta description between 70 and 160 characters."));
  else checks.push(pass("description", "Meta description", 10, `Good description length (${desc.length} characters).`));

  // 4. H1 (8)
  const h1Count = $("h1").length;
  if (h1Count === 0) checks.push(fail("h1", "H1 heading", 8, "No H1 heading found.", "Add exactly one H1 that describes the page and includes your main keyword."));
  else if (h1Count > 1) checks.push(warn("h1", "H1 heading", 8, `${h1Count} H1 headings found.`, "Use only one H1 per page. Use H2/H3 for sub-sections."));
  else checks.push(pass("h1", "H1 heading", 8, "Exactly one H1 heading."));

  // 5. H2 (4)
  const h2Count = $("h2").length;
  checks.push(
    h2Count > 0
      ? pass("h2", "Sub-headings (H2)", 4, `${h2Count} H2 headings found.`)
      : fail("h2", "Sub-headings (H2)", 4, "No H2 headings found.", "Break your content into sections with H2 headings.")
  );

  // 6. Image alt text (8)
  const imgs = $("img");
  const imgTotal = imgs.length;
  const missingAlt = imgs.filter((_, el) => !($(el).attr("alt") || "").trim()).length;
  if (imgTotal === 0) checks.push(warn("alt", "Image alt text", 8, "No images found on the page.", "Add relevant images with descriptive alt text."));
  else if (missingAlt === 0) checks.push(pass("alt", "Image alt text", 8, `All ${imgTotal} images have alt text.`));
  else if (missingAlt / imgTotal <= 0.3)
    checks.push(warn("alt", "Image alt text", 8, `${missingAlt} of ${imgTotal} images are missing alt text.`, "Add short descriptive alt text to every image."));
  else checks.push(fail("alt", "Image alt text", 8, `${missingAlt} of ${imgTotal} images are missing alt text.`, "Add short descriptive alt text to every image."));

  // 7. Canonical (5)
  const canonical = $('link[rel="canonical"]').attr("href");
  checks.push(
    canonical
      ? pass("canonical", "Canonical tag", 5, "Canonical tag is set.")
      : fail("canonical", "Canonical tag", 5, "No canonical tag found.", 'Add <link rel="canonical" href="..."> to avoid duplicate-content issues.')
  );

  // 8. Mobile viewport (6)
  checks.push(
    $('meta[name="viewport"]').length
      ? pass("viewport", "Mobile viewport", 6, "Viewport meta tag found.")
      : fail("viewport", "Mobile viewport", 6, "No viewport meta tag.", 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> for mobile-friendliness.')
  );

  // 9. Language (3)
  checks.push(
    $("html").attr("lang")
      ? pass("lang", "Language attribute", 3, "HTML lang attribute is set.")
      : fail("lang", "Language attribute", 3, "No lang attribute on <html>.", 'Add lang="en" (or your language) to the <html> tag.')
  );

  // 10. Open Graph (5)
  const ogCount = ["og:title", "og:description", "og:image"].filter((p) => $(`meta[property="${p}"]`).length).length;
  if (ogCount === 3) checks.push(pass("og", "Open Graph tags", 5, "og:title, og:description and og:image are set."));
  else if (ogCount > 0) checks.push(warn("og", "Open Graph tags", 5, `Only ${ogCount} of 3 key Open Graph tags found.`, "Add og:title, og:description and og:image so links look good when shared."));
  else checks.push(fail("og", "Open Graph tags", 5, "No Open Graph tags found.", "Add og:title, og:description and og:image so links look good when shared."));

  // 11. Structured data (6)
  checks.push(
    $('script[type="application/ld+json"]').length
      ? pass("schema", "Structured data", 6, "JSON-LD structured data found.")
      : fail("schema", "Structured data", 6, "No structured data (schema) found.", "Add JSON-LD schema (Organization, LocalBusiness, Article, Product, etc.).")
  );

  // 12. Indexable (6)
  const robotsMeta = ($('meta[name="robots"]').attr("content") || "").toLowerCase();
  checks.push(
    robotsMeta.includes("noindex")
      ? fail("indexable", "Indexable by Google", 6, "Page has a noindex tag, so Google will not index it.", "Remove 'noindex' from the robots meta tag if you want this page to rank.")
      : pass("indexable", "Indexable by Google", 6, "No noindex tag found.")
  );

  // 13. Internal links (5)
  const host = finalUrl.hostname.replace(/^www\./, "");
  let internal = 0;
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;
    try {
      const u = new URL(href, finalUrl);
      if (u.hostname.replace(/^www\./, "") === host) internal++;
    } catch {}
  });
  if (internal >= 5) checks.push(pass("links", "Internal links", 5, `${internal} internal links found.`));
  else if (internal > 0) checks.push(warn("links", "Internal links", 5, `Only ${internal} internal links found.`, "Link to more of your own pages to help Google crawl your site."));
  else checks.push(fail("links", "Internal links", 5, "No internal links found.", "Add links to your other important pages."));

  // 14. Content length (8)
  $("script, style, noscript").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  if (words >= 300) checks.push(pass("words", "Content length", 8, `About ${words} words of content.`));
  else if (words >= 150) checks.push(warn("words", "Content length", 8, `Only about ${words} words.`, "Pages with 300+ words of useful content tend to rank better."));
  else checks.push(fail("words", "Content length", 8, `Very little content (about ${words} words).`, "Add more helpful, original content (300+ words)."));

  // 15 & 16. robots.txt and sitemap.xml (4 + 4)
  const origin = finalUrl.origin;
  const exists = async (path) => {
    try {
      const r = await fetchWithTimeout(origin + path, 6000);
      const type = r.headers.get("content-type") || "";
      return r.ok && !type.includes("text/html");
    } catch {
      return false;
    }
  };
  const [hasRobots, hasSitemap] = await Promise.all([exists("/robots.txt"), exists("/sitemap.xml")]);
  checks.push(
    hasRobots
      ? pass("robots", "robots.txt", 4, "robots.txt found.")
      : fail("robots", "robots.txt", 4, "No robots.txt found.", "Create a robots.txt file in your site root.")
  );
  checks.push(
    hasSitemap
      ? pass("sitemap", "sitemap.xml", 4, "sitemap.xml found.")
      : fail("sitemap", "sitemap.xml", 4, "No sitemap.xml found.", "Create an XML sitemap and submit it in Google Search Console.")
  );

  /* ---------- Score ---------- */
  const total = checks.reduce((s, c) => s + c.points, 0);
  const max = checks.reduce((s, c) => s + c.max, 0);
  const score = Math.round((total / max) * 100);

  // Priority list: biggest points lost first
  const issues = checks
    .filter((c) => c.status !== "pass")
    .map((c) => ({ ...c, lost: c.max - c.points }))
    .sort((a, b) => b.lost - a.lost);

  return {
    url: finalUrl.href,
    score,
    grade: score >= 85 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : "D",
    loadMs,
    stats: { title, description: desc, words, images: imgTotal, internalLinks: internal },
    checks,
    issues,
    scannedAt: new Date().toISOString(),
  };
}