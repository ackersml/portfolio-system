import projectsData from "@/content/projects.json";

export type Project = {
  slug: string;
  title: string;
  description: string;
  pdf: string;
  thumbnail?: string | null;
  tags?: string[];
  year?: number;
};

export const projects: Project[] = projectsData as Project[];

export function getProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}


