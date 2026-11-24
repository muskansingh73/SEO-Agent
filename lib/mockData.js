// Fake data for the frontend. Later we replace this with real API calls.

export const auditResult = {
  url: "example.com",
  score: 72,
  grade: "B",
  categories: [
    { name: "Technical SEO", score: 80 },
    { name: "On-Page SEO", score: 65 },
    { name: "Content", score: 58 },
    { name: "Performance", score: 84 },
  ],
  issues: [
    {
      id: 1,
      severity: "high",
      title: "Missing meta description",
      detail: "3 pages have no meta description, so Google picks random text.",
      fix: "Add a 70–160 character description that makes people want to click.",
    },
    {
      id: 2,
      severity: "high",
      title: "Images without alt text",
      detail: "12 of 20 images have no alt text.",
      fix: "Add short, descriptive alt text to every image.",
    },
    {
      id: 3,
      severity: "medium",
      title: "No structured data (schema)",
      detail: "Google can't show rich results for your pages.",
      fix: "Add JSON-LD schema such as Organization, Article or Product.",
    },
    {
      id: 4,
      severity: "medium",
      title: "Multiple H1 headings",
      detail: "The home page has 3 H1 headings.",
      fix: "Use exactly one H1 per page. Use H2/H3 for sections.",
    },
    {
      id: 5,
      severity: "low",
      title: "No sitemap.xml found",
      detail: "Search engines can't easily discover all your pages.",
      fix: "Create a sitemap and submit it in Google Search Console.",
    },
  ],
};

export const competitors = [
  { name: "Brew House", url: "brewhouse.in", location: "Mumbai", da: 48, backlinks: 1240, keywords: 860 },
  { name: "Bean Bazaar", url: "beanbazaar.com", location: "Mumbai", da: 42, backlinks: 910, keywords: 640 },
  { name: "Roast & Co", url: "roastandco.in", location: "Pune", da: 39, backlinks: 720, keywords: 515 },
  { name: "Cafe Central", url: "cafecentral.in", location: "Mumbai", da: 35, backlinks: 480, keywords: 390 },
];

export const backlinks = [
  { domain: "timesofindia.com", da: 94, pa: 72, type: "dofollow", status: "good" },
  { domain: "medium.com", da: 95, pa: 70, type: "nofollow", status: "good" },
  { domain: "justdial.com", da: 76, pa: 58, type: "dofollow", status: "good" },
  { domain: "foodblog-india.com", da: 41, pa: 36, type: "dofollow", status: "good" },
  { domain: "cheap-links-4u.xyz", da: 4, pa: 2, type: "dofollow", status: "spam" },
  { domain: "seo-buy-now.top", da: 6, pa: 3, type: "dofollow", status: "spam" },
  { domain: "directory-list.info", da: 18, pa: 9, type: "nofollow", status: "good" },
];

export const keywords = [
  { keyword: "best coffee beans in mumbai", volume: 2400, difficulty: 38, intent: "Commercial" },
  { keyword: "buy coffee beans online", volume: 8100, difficulty: 62, intent: "Transactional" },
  { keyword: "how to brew pour over coffee", volume: 5400, difficulty: 29, intent: "Informational" },
  { keyword: "cafe near me", volume: 33100, difficulty: 71, intent: "Local" },
  { keyword: "single origin coffee india", volume: 1300, difficulty: 24, intent: "Commercial" },
  { keyword: "what is cold brew", volume: 12100, difficulty: 45, intent: "Informational" },
];