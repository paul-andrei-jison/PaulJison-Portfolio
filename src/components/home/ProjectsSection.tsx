'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Project, SiteConfig } from '@/types';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

interface Props { projects: Project[]; config: SiteConfig; }

function ProjectCard({ project }: { project: Project }) {
  const [frameIdx, setFrameIdx] = useState(0);
  const advance = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFrameIdx((i) => (i + 1) % project.images.length);
  };

  return (
    <Link
      href={`/projects/${project.id}`}
      style={{ display: 'block', textDecoration: 'none', transition: 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)', cursor: 'pointer' }}
      className="group/card hover:-translate-y-1.5"
    >
      {/* Above card: num + kicker */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 5 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{project.num}</div>
        <div style={{ flexShrink: 0, width: 18, height: 1, background: 'var(--text-muted)', opacity: 0.4 }} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{project.kicker}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 19, color: 'var(--text-primary)', marginBottom: 10 }}>{project.title}</div>

      {/* Card */}
      <div style={{ borderRadius: 16, background: 'var(--card-bg)', padding: 16, border: '1px solid var(--card-border)' }}>
        <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-secondary)', margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description}</p>
        {/* Image slider */}
        <div
          onClick={advance}
          style={{ position: 'relative', width: '100%', aspectRatio: '16/8', borderRadius: 10, overflow: 'hidden', boxShadow: '0 10px 24px -10px rgba(0,0,0,0.4)', background: '#111', cursor: 'pointer' }}
        >
          {project.images.map((img, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, zIndex: i === frameIdx ? 3 : 1, opacity: i === frameIdx ? 1 : 0, transition: 'opacity 0.5s ease' }}>
              <ImageWithFallback
                src={img.src}
                alt={`${project.title} screenshot ${i + 1}`}
                fill
                placeholder={img.placeholder}
                className="object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Tags + button row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {project.tags.slice(0, 3).map((tag) => (
              <div key={tag} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', background: 'var(--input-bg)', border: '1px solid var(--card-border)', padding: '3px 10px', borderRadius: 999 }}>{tag}</div>
            ))}
          </div>
          <div style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#fff', background: '#7c3aed', padding: '7px 16px', borderRadius: 8, letterSpacing: '0.01em', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}>
            Open Project →
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsSection({ projects, config }: Props) {
  return (
    <section id="section-projects" style={{ maxWidth: 1160, margin: '0 auto', padding: '20px 32px 110px' }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 46px)', margin: 0 }}>
          <span style={{ color: 'var(--text-primary)' }}>Featured </span>
          <span className="shine-text">Projects</span>
        </h2>
      </div>
      <div style={{ textAlign: 'center', fontSize: 15, color: 'var(--text-secondary)', marginBottom: 48 }}>{config.projectsSubtitle}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: '28px 24px' }}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
