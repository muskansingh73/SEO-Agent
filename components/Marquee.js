const items = [
  "Missing meta description",
  "12 images without alt text",
  "No sitemap.xml found",
  "Three H1 headings on one page",
  "Spam link from cheap-links-4u.xyz",
  "No structured data",
  "Title is too long",
  "Competitor has 4x your backlinks",
  "Page is not indexable",
  "No canonical tag",
];

export default function Marquee() {
  // The list is rendered twice so the loop never shows a gap.
  const loop = [...items, ...items];

  return (
    <div className="marquee overflow-hidden bg-ink py-4 text-white" aria-label="Examples of issues the agent finds">
      <div className="marquee-track flex w-max items-center gap-8 pr-8">
        {loop.map((text, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap font-display text-lg font-semibold">
            {text}
            <span className="size-2.5 rotate-45 bg-mark" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}