import Link from "next/link";

export default function Home() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-zinc-300">Operations Architect</p>
        <h1 className="mt-2 text-4xl sm:text-6xl font-semibold tracking-tight text-white">
          Systems design and operations architecture
        </h1>
        <p className="mt-4 text-zinc-200 leading-relaxed text-lg">
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
        <div className="mt-10 space-y-3">
          <details open className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
            <summary className="cursor-pointer font-medium text-white">In plain language</summary>
            <ul className="mt-2 list-disc pl-5 text-zinc-200">
              <li>Turn messy processes into simple, reliable tools.</li>
              <li>Replace spreadsheets with small apps that fit how you work.</li>
              <li>Keep data local and in your control if you prefer no cloud.</li>
            </ul>
          </details>
          <details className="rounded-lg border border-zinc-700 bg-zinc-900 p-4">
            <summary className="cursor-pointer font-medium text-white">For engineers</summary>
            <ul className="mt-2 list-disc pl-5 text-zinc-200">
              <li>Local‑first patterns, sync, conflict handling, typed contracts.</li>
              <li>On‑prem orchestration, background workers, observability.</li>
              <li>Event pipelines, domain modeling, and operational runbooks.</li>
            </ul>
          </details>
        </div>
      </div>
    </section>
  );
}
