import Link from "next/link";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-900 transition-colors overflow-hidden"
    >
      <div className="aspect-video w-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
      <div className="p-4">
        <h3 className="text-zinc-100 font-semibold group-hover:text-white transition-colors">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-zinc-300 line-clamp-2">
          {project.description}
        </p>
        {project.tags && project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-[11px] tracking-wide rounded-full border border-zinc-800 px-2 py-1 text-zinc-400"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}


