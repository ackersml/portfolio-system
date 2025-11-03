import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Portfolio pieces in systems development and operations architecture.",
};

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <section>
      <h1 className="text-3xl font-semibold text-white">Projects</h1>
      <p className="mt-2 text-zinc-200 max-w-2xl">
        Case studies across automation, local-first software, and on‑prem solutions.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}


