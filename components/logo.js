import Link from "next/link";
import { Search } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
      <span className="grid size-8 place-items-center rounded-lg bg-mark text-ink">
        <Search size={18} strokeWidth={2.75} />
      </span>
      SEO Agent
    </Link>
  );
}