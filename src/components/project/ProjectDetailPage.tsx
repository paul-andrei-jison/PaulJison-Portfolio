'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/types';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function ProjectDetailPage({ project }: { project: Project }) {
  const [activeImg, setActiveImg] = useState(0);
  const total = project.images.length;

  const prev = () => setActiveImg((i) => (i - 1 + total) % total);
  const next = () => setActiveImg((i) => (i + 1) % total);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--page-bg)', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 100px' }}>

        {/* Back */}
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 14, fontWeight: 600, color: 'var(--text-muted)',
            textDecoration: 'none', marginBottom: 40,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Portfolio
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{project.num}</span>
            <span style={{ width: 20, height: 1, background: 'var(--text-muted)', opacity: 0.4, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{project.kicker}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: 'clamp(32px, 6vw, 52px)', margin: '0 0 20px', lineHeight: 1.1 }}>
            {project.title}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', background: 'var(--input-bg)', border: '1px solid var(--card-border)', padding: '5px 14px', borderRadius: 999 }}
              >
                {tag}
              </span>
            ))}
          </div>
          {project.dateAdded && (
            <div style={{ marginTop: 12, fontSize: 16, color: 'var(--text-muted)' }}>
              Added {project.dateAdded}
            </div>
          )}
        </div>

        {/* Image gallery */}
        <div style={{ marginBottom: 48 }}>
          {/* Main image */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', borderRadius: 16, overflow: 'hidden', background: '#111', boxShadow: '0 20px 60px -16px rgba(0,0,0,0.5)' }}>
            {project.images.map((img, i) => (
              <div
                key={i}
                style={{ position: 'absolute', inset: 0, opacity: i === activeImg ? 1 : 0, transition: 'opacity 0.4s ease', zIndex: i === activeImg ? 2 : 1 }}
              >
                <ImageWithFallback src={img.src} alt={`${project.title} screenshot ${i + 1}`} fill placeholder={img.placeholder} className="object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            ))}

            {/* Arrows — only show when multiple images */}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous image"
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button
                  onClick={next}
                  aria-label="Next image"
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </>
            )}

            {/* Dot indicators */}
            {total > 1 && (
              <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: 6 }}>
                {project.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Go to image ${i + 1}`}
                    style={{ width: i === activeImg ? 20 : 6, height: 6, borderRadius: 3, border: 'none', background: i === activeImg ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0, transition: 'width 0.3s ease, background 0.3s ease' }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {total > 1 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 12, overflowX: 'auto' }}>
              {project.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                  style={{ flexShrink: 0, width: 80, height: 52, borderRadius: 8, overflow: 'hidden', border: `2px solid ${i === activeImg ? 'var(--text-primary)' : 'transparent'}`, background: '#111', padding: 0, cursor: 'pointer', transition: 'border-color 0.2s', position: 'relative' }}
                >
                  <ImageWithFallback src={img.src} alt={`Thumbnail ${i + 1}`} fill placeholder={img.placeholder} className="object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Links */}
        {(project.githubUrl || project.liveUrl) && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'border-color 0.2s, transform 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                View on GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'border-color 0.2s, transform 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                Live Demo
              </a>
            )}
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--card-border)', marginBottom: 48 }} />

        {/* Description */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 22, margin: '0 0 14px' }}>About this project</h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>{project.description}</p>
        </section>

        <div style={{ borderTop: '1px solid var(--card-border)', marginBottom: 48 }} />

        {/* What I Learned */}
        {project.whatILearned && project.whatILearned.length > 0 && (
          <>
            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 22, margin: '0 0 18px' }}>What I Learned</h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {project.whatILearned.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M2 5L4.5 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            <div style={{ borderTop: '1px solid var(--card-border)', marginBottom: 48 }} />
          </>
        )}

        {/* How to Use */}
        {project.howToUse && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 22, margin: '0 0 14px' }}>How to Use</h2>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '20px 24px' }}>
              {project.howToUse.split('\n').map((line, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)', margin: i === 0 ? 0 : '8px 0 0', fontFamily: 'var(--font-space-grotesk)' }}>{line}</p>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
