"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Swords, Link2, KeyRound } from "lucide-react";
import Logo from "./logo";

const links = [
  { href: "/dashboard", label: "Site audit", Icon: Gauge },
  { href: "/dashboard/competitors", label: "Competitors", Icon: Swords },
  { href: "/dashboard/backlinks", label: "Backlinks", Icon: Link2 },
  { href: "/dashboard/keywords", label: "Keywords", Icon: KeyRound },
];

export default function Sidebar() {
  const pathname = usePathname();

  const itemClass = (active) =>
    `flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      active ? "bg-mark text-ink" : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink p-5 text-white lg:flex">
        <Logo />
        <nav className="mt-10 flex flex-col gap-1">
          {links.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className={itemClass(pathname === href)}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
        <p className="mt-auto text-xs leading-relaxed text-white/50">
          Every page shows live results. Some tools need a free API key.
        </p>
      </aside>

      {/* Mobile top bar */}
      <div className="bg-ink px-4 pb-3 pt-4 text-white lg:hidden">
        <Logo />
        <nav className="mt-4 flex gap-2 overflow-x-auto">
          {links.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className={itemClass(pathname === href)}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}