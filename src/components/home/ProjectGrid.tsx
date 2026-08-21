'use client';
import Link from 'next/link';
import type { Project, SiteConfig } from '@/types';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import PeekCarousel from '@/components/ui/PeekCarousel';

interface Props {
  projects: Project[];
  config: SiteConfig;
}

export default function ProjectGrid({ projects, config }: Props) {
  return (
    <section className="px-6 py-16 md:px-12 lg:px-20">
      <div className="max-w-4xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">Projects</p>
        <p className="text-muted text-sm max-w-lg">{config.projectsSubtitle}</p>
      </div>
      <div className="mt-10 max-w-4xl grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project, projectIndex) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="rounded-2xl border border-border bg-bg-card overflow-hidden block no-underline" style={{ textDecoration: 'none' }}>
            {/* Image carousel */}
            <PeekCarousel itemWidth={400} itemCount={project.images.length} gap={8} peek={32} className="h-56">
              {project.images.map((img, imgIndex) => (
                <div key={imgIndex} className="relative shrink-0 w-[400px] h-56 overflow-hidden">
                  <ImageWithFallback
                    src={img.src}
                    placeholder={img.placeholder}
                    alt={`${project.title} screenshot ${imgIndex + 1}`}
                    fill
                    className="object-cover"
                    loading={projectIndex < 2 && imgIndex === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </PeekCarousel>
            {/* Card body */}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted uppercase tracking-widest">{project.kicker}</span>
                <span className="text-xs text-muted">{project.num}</span>
              </div>
              <h3 className="text-lg font-semibold text-fg">{project.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-border px-3 py-1 text-xs font-medium text-fg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
