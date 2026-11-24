// Warning signs we can see in a domain name. These are hints, not a verdict from Google.

const ABUSED_EXTENSIONS = new Set([
  "xyz", "top", "click", "loan", "work", "gq", "ml", "cf", "tk", "ga", "icu", "buzz", "rest", "cyou", "monster", "sbs", "bond",
]);
const SPAM_WORDS = ["backlink", "linkbuild", "buylinks", "cheaplinks", "links4", "casino", "viagra", "cialis", "payday", "replica", "escort"];

export function riskSignals(domain) {
  const signals = [];
  const parts = domain.split(".");
  const extension = parts[parts.length - 1];
  const name = parts.slice(0, -1).join(".");

  if (ABUSED_EXTENSIONS.has(extension)) signals.push(`.${extension} is often used by spam sites`);
  if (SPAM_WORDS.some((w) => name.includes(w))) signals.push("Name looks like link spam");
  if ((name.match(/-/g) || []).length >= 3) signals.push("Many hyphens in the name");
  if (name.replace(/[^0-9]/g, "").length >= 4) signals.push("Many digits in the name");
  if (name.length > 30) signals.push("Very long name");
  return signals;
}

export function verdictFor(authority, signals) {
  // Two warning signs, or one warning sign on a site that is unknown or has very low authority
  if (signals.length >= 2 || (signals.length >= 1 && (authority === null || authority < 1.5))) return "risky";
  if (authority === null) return "unrated";
  if (authority >= 4) return "strong";
  if (authority >= 2) return "okay";
  return "weak";
}