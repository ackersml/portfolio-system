import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Local-first software, on‑prem solutions, and build‑to‑fit services.",
};

const services = [
  {
    title: "Local‑first software",
    description:
      "Designs that work offline-first with fast sync and resilient data models.",
  },
  {
    title: "On‑prem solutions",
    description:
      "Secure deployments with clear runbooks, observability, and minimal blast radius.",
  },
  {
    title: "Build‑to‑fit automation",
    description:
      "Process discovery to scripted workflows: reduce toil, increase reliability.",
  },
];

export default function ServicesPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Services</h1>
      <p className="mt-2 text-zinc-400 max-w-2xl">
        Pragmatic systems design to fit constraints and scale.
      </p>
      <div className="mt-6 space-y-3">
        <details open className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <summary className="cursor-pointer font-medium text-white">In plain language</summary>
          <ul className="mt-2 list-disc pl-5 text-zinc-300">
            <li>Short, low‑risk milestones with visible progress.</li>
            <li>Simple first version you can use, then iterate.</li>
            <li>Runs on your machines; your data stays in your control.</li>
          </ul>
        </details>
        <details className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <summary className="cursor-pointer font-medium text-white">For engineers</summary>
          <ul className="mt-2 list-disc pl-5 text-zinc-300">
            <li>Discovery → target state diagrams, domain models, sequence/ERD.</li>
            <li>MVP with typed APIs, background jobs, and observability.</li>
            <li>Hardening: zero‑downtime deploys, backups, telemetry, runbooks.</li>
          </ul>
        </details>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-zinc-400">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


