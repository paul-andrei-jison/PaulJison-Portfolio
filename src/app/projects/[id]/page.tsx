import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import projects from '@/data/projects';
import ProjectDetailPage from '@/components/project/ProjectDetailPage';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} — Paul Jison`,
    description: project.description,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();
  return <ProjectDetailPage project={project} />;
}
