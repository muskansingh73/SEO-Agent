import Link from "next/link";
import { Check, MapPin, Briefcase, Store, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Logo from "@/components/logo";
import SerpDemo from "@/components/SerpDemo";
import Marquee from "@/components/Marquee";
import ProductTour from "@/components/ProductTour";

const heroFacts = [
  "16 checks on every page",
  "Fixes ranked by the points they add",
  "Competitors, backlinks and keywords in one place",
];

const checks = [
  "HTTPS",
  "Title tag",
  "Meta description",
  "H1 heading",
  "Sub-headings",
  "Image alt text",
  "Canonical tag",
  "Mobile viewport",
  "Language tag",
  "Open Graph tags",
  "Structured data",
  "Indexable by Google",
  "Internal links",
  "Content length",
  "robots.txt",
  "sitemap.xml",
];

const audiences = [
  {
    Icon: MapPin,
    title: "Local businesses",
    text: "See who ranks above you in your city and what they have that you don't.",
  },
  {
    Icon: Briefcase,
    title: "Freelancers and agencies",
    text: "Audit a client's website, then show them exactly what to fix and what each fix is worth.",
  },
  {
    Icon: Store,
    title: "Store and blog owners",
    text: "Find the keywords you can win and the pages that need work first.",
  },
];

const steps = [
  { title: "Enter your website", text: "The agent loads your page and reads its tags, headings, images and links." },
  { title: "Get your score", text: "You get a number out of 100 and a list of what is holding it back." },
  { title: "Fix the biggest issues first", text: "Every fix shows the points it adds, so you know where to start." },
];

const faqs = [
  {
    q: "How is the score worked out?",
    a: "Each check is worth a set number of points. A pass earns all of them, a partial pass earns half, and a fail earns none. Your score is the points you earned, out of 100.",
  },
  {
    q: "Will it change my website?",
    a: "No. The agent only reads your public pages, the way a search engine does. It never edits anything.",
  },
  {
    q: "What do DA and PA mean?",
    a: "Domain Authority (DA) and Page Authority (PA) are scores from 1 to 100, created by Moz, that estimate how strong a website or a single page is in search. A link from a high-scoring site is worth more than one from a low-scoring site.",
  },
  {
    q: "How often should I audit my site?",
    a: "After every big change, and at least once a month. Rankings move, so a site you fixed can slip again.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-12 lg:grid-cols-[1fr_1.05fr] lg:pt-20">
          <div>
            <h1 className="font-display text-6xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
              Find out why Google ranks your competitors first.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
              Enter your website address. The agent scores it, lists what to fix in order of impact,
              and shows you who you are up against.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn btn-mark !px-6 !py-3.5 !text-base">
                Audit my website
              </Link>
              <Link href="#tour" className="btn btn-line !px-6 !py-3.5 !text-base">
                See inside the report
              </Link>
            </div>
            <ul className="mt-9 space-y-2.5 text-[15px]">
              {heroFacts.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <span className="grid size-5 place-items-center rounded-full bg-ink text-mark">
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative isolate">
            <div className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-xl bg-mark sm:translate-x-rounded-xl border border-mark bg-silver sm:translate-x-4 sm:translate-y-4" aria-hidden />
            <SerpDemo />
          </div>
        </section>

        <Marquee />

        {/* Statement */}
        <section className="bg-mark">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
            <h2 className="max-w-4xl font-display text-4xl font-extrabold leading-[1.03] tracking-tight sm:text-6xl">
              People click the first few results. Everything below might as well not exist.
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/80">
              The gap between position 6 and position 2 is usually a handful of fixable things: a missing
              description, a page that says nothing to Google, links from the wrong places. The agent finds
              them and puts them in order.
            </p>
          </div>
        </section>

        {/* Product tour */}
        <section id="tour" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
            See what you get
          </h2>
          <p className="mt-4 max-w-xl text-lg text-ink/70">
            Four tools, one dashboard. Pick one to see what its report looks like.
          </p>
          <div className="mt-12">
            <ProductTour />
          </div>
        </section>

        {/* The 16 checks */}
        <section id="features" className="border-y border-silver bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
            <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Sixteen checks on every page
            </h2>
            <p className="mt-4 max-w-xl text-lg text-ink/70">
              Each one is worth a set number of points. Together they make your score out of 100.
            </p>
            <ul className="mt-10 flex flex-wrap gap-3">
              {checks.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2.5 text-[15px] font-medium transition hover:border-ink hover:bg-mark"
                >
                  <Check size={16} strokeWidth={3} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who it is for */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Made for people who need to rank
          </h2>
          <div className="mt-12 grid border-t-2 border-ink md:grid-cols-3">
            {audiences.map(({ Icon, title, text }) => (
              <div key={title} className="border-b border-ink/15 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                <span className="grid size-11 place-items-center rounded-lg bg-mark">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">{title}</h3>
                <p className="mt-2 max-w-xs text-ink/70">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works: a real sequence, so numbered */}
        <section id="how" className="border-y border-ink bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
            <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">How it works</h2>
            <ol className="mt-12 grid gap-10 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <span className="grid size-12 place-items-center rounded-full bg-mark font-display text-2xl font-extrabold">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 max-w-xs text-ink/70">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:py-24 lg:grid-cols-[1fr_1.7fr]">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Questions</h2>
          <div className="divide-y divide-ink/15 border-y border-ink/15">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus className="shrink-0 transition group-open:rotate-45" />
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing call to action */}
        <section className="bg-ink text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-5 py-20">
            <h2 className="max-w-xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Ready to see your score?
            </h2>
            <Link href="/dashboard" className="btn btn-mark !px-8 !py-4 !text-base">
              Audit my website
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-10 text-sm text-ink/60">
        <Logo />
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/dashboard" className="hover:text-ink hover:underline">Site audit</Link>
          <Link href="/dashboard/competitors" className="hover:text-ink hover:underline">Competitors</Link>
          <Link href="/dashboard/backlinks" className="hover:text-ink hover:underline">Backlinks</Link>
          <Link href="/dashboard/keywords" className="hover:text-ink hover:underline">Keywords</Link>
        </nav>
        <p>© 2026 SEO Agent</p>
      </footer>
    </>
  );
}