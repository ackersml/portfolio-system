import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/70">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-zinc-100 font-semibold tracking-tight">
          Michelle Ackers
        </Link>
        <nav className="flex items-center gap-6 text-sm text-zinc-200">
          <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
          <Link href="/services" className="hover:text-white transition-colors">Services</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>
      </div>
    </header>
  );
}


