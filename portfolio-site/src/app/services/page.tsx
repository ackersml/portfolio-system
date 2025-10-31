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
        Pragmatic systems engineering to fit constraints and scale.
      </p>
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


