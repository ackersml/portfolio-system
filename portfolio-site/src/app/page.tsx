import Link from "next/link";

export default function Home() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-zinc-400">Operations Architect</p>
        <h1 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          Systems development and operations architecture
        </h1>
        <p className="mt-4 text-zinc-300 leading-relaxed">
          I specialize in end-to-end automation and local-first software solutions.
          Designing reliable, fast, and maintainable systems—on‑prem or in the cloud.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-md bg-white text-black font-medium px-4 py-2 hover:bg-zinc-200 transition-colors"
          >
            View Projects
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-zinc-800 px-4 py-2 text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
