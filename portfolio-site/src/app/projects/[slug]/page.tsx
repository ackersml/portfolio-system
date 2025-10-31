import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import PDFViewer from "@/components/PDFViewer";

type Params = { slug: string };

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.description,
  };
}

export default function ProjectDetail({ params }: { params: Params }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return notFound();
  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">{project.title}</h1>
        <p className="mt-2 text-zinc-400 max-w-2xl">{project.description}</p>
      </header>

      <div className="flex items-center gap-3">
        <a
          href={project.pdf}
          download
          className="inline-flex items-center justify-center rounded-md bg-white text-black font-medium px-4 py-2 hover:bg-zinc-200 transition-colors"
        >
          Download PDF
        </a>
        <a
          href={project.pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-zinc-800 px-4 py-2 text-zinc-200 hover:bg-zinc-900 transition-colors"
        >
          Open in new tab
        </a>
      </div>

      <PDFViewer src={project.pdf} title={project.title} />
    </article>
  );
}


