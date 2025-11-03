import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Michelle Ackers — Operations Architect specializing in end‑to‑end automation and local‑first software.",
};

export default function AboutPage() {
  return (
    <section className="max-w-3xl">
      <h1 className="text-3xl font-semibold text-white">About</h1>
      <p className="mt-4 text-zinc-200 leading-relaxed text-lg">
        I’m Michelle Ackers, an Operations Architect focused on systems development.
        I design and deliver reliable platforms with end‑to‑end automation
        and local‑first principles. My work emphasizes performance, observability,
        and maintainability across on‑prem and cloud environments.
      </p>
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-200">
        <li className="rounded-lg border border-zinc-700 bg-zinc-900 p-3">Automation & Workflows</li>
        <li className="rounded-lg border border-zinc-700 bg-zinc-900 p-3">Local‑first Architectures</li>
        <li className="rounded-lg border border-zinc-700 bg-zinc-900 p-3">On‑prem Deployments</li>
        <li className="rounded-lg border border-zinc-700 bg-zinc-900 p-3">Observability & Runbooks</li>
      </ul>
    </section>
  );
}


