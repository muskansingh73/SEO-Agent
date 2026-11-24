import Link from "next/link";
import Logo from "./logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Logo />
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/#features" className="hidden hover:underline sm:block">
            What you can check
          </Link>
          <Link href="/#how" className="hidden hover:underline sm:block">
            How it works
          </Link>
          <Link href="/dashboard" className="btn !px-4 !py-2">
            Open dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}