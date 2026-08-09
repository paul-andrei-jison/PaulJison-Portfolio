'use client';

import type { AchievementsData, AchievementItem } from '@/types';

interface Props { achievements: AchievementsData; }

function isPdf(path: string) { return path.toLowerCase().endsWith('.pdf'); }
function isImage(path: string) { return /\.(jpg|jpeg|png|webp|gif)$/i.test(path); }

const PINK = 'var(--pink, #ec4899)';

/** Renders a PDF as a non-interactive image using an iframe with pointer-events disabled */
function PdfPreview({ src, height }: { src: string; height: number }) {
  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }}>
      <iframe
        src={`${src}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&view=FitH`}
        style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none', display: 'block' }}
        tabIndex={-1}
        aria-hidden
      />
      {/* Transparent overlay — blocks all mouse interaction so the iframe feels like a static image */}
      <div style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}

function ImagePreview({ src, alt, height }: { src: string; alt: string; height: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{ width: '100%', height, objectFit: 'cover', display: 'block' }}
    />
  );
}

function EmptySlot({ label, height }: { label: string; height: number }) {
  return (
    <div style={{ width: '100%', height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--input-bg, rgba(255,255,255,0.03))', borderRight: '1px solid var(--card-border)' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '0 12px', lineHeight: 1.5 }}>{label}</span>
    </div>
  );
}

function Preview({ src, title, height }: { src: string; title: string; height: number }) {
  if (!src) return <EmptySlot label="No file yet" height={height} />;
  if (isPdf(src)) return <PdfPreview src={src} height={height} />;
  if (isImage(src)) return <ImagePreview src={src} alt={title} height={height} />;
  return <EmptySlot label="Unsupported format" height={height} />;
}

/** ─── Featured certificate ─── large, full-width card */
function FeaturedCert({ data }: { data: AchievementsData['featured'] }) {
  const hasFile = Boolean(data.image);

  return (
    <div
      className="card-hover"
      style={{
        background: 'var(--card-bg)',
        border: `1px solid ${PINK}`,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {/* Preview — fixed height, overflow:hidden clips PDF viewer whitespace */}
      <div style={{ flex: '1 1 320px', minWidth: 260, height: 480, overflow: 'hidden', background: 'var(--input-bg, rgba(255,255,255,0.03))' }}>
        <Preview src={data.image} title={data.title} height={480} />
      </div>

      {/* Text panel */}
      <div style={{ flex: '1 1 220px', minWidth: 200, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: PINK }}>
          Featured Certificate
        </div>
        <h3 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: 'clamp(17px, 2.2vw, 24px)', margin: 0, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {data.title}
        </h3>
        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          {data.description}
        </p>
        {hasFile && (
          <a
            href={data.image}
            target="_blank"
            rel="noopener noreferrer"
            style={{ alignSelf: 'flex-start', fontSize: 13, fontWeight: 700, color: PINK, textDecoration: 'none', border: `1px solid ${PINK}`, borderRadius: 10, padding: '8px 16px', marginTop: 4 }}
          >
            View Certificate →
          </a>
        )}
      </div>
    </div>
  );
}

/** ─── Mini certificate card ─── same horizontal layout as featured, but smaller */
function CertCard({ item }: { item: AchievementItem }) {
  const hasFile = Boolean(item.image);

  return (
    <div
      className="card-hover"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 18,
        overflow: 'hidden',
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {/* Preview */}
      <div style={{ flex: '0 0 auto', width: 'clamp(120px, 40%, 180px)', overflow: 'hidden', background: 'var(--input-bg, rgba(255,255,255,0.03))' }}>
        <Preview src={item.image} title={item.title ?? item.placeholder} height={160} />
      </div>

      {/* Text */}
      <div style={{ flex: '1 1 120px', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-space-grotesk)', lineHeight: 1.3 }}>
          {item.title ?? item.placeholder}
        </span>
        {!hasFile && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.placeholder}</span>
        )}
        {hasFile && (
          <a
            href={item.image}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, fontWeight: 700, color: PINK, textDecoration: 'none', marginTop: 4 }}
          >
            View Certificate →
          </a>
        )}
      </div>
    </div>
  );
}

export default function AchievementsSection({ achievements }: Props) {
  return (
    <section id="section-achievements" style={{ maxWidth: 1160, margin: '0 auto', padding: '20px 32px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 46px)', margin: 0 }}>
          <span style={{ color: 'var(--text-primary)' }}>Certificates &amp; </span>
          <span className="shine-text">Awards</span>
        </h2>
      </div>
      <div style={{ textAlign: 'center', fontSize: 15, color: 'var(--text-secondary)', marginBottom: 52 }}>
        Drop PDF or image files into <code style={{ fontSize: 13, opacity: 0.8 }}>public/images/achievements/</code> and update <code style={{ fontSize: 13, opacity: 0.8 }}>achievements.ts</code>.
      </div>

      <FeaturedCert data={achievements.featured} />

      {achievements.items.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 16 }}>
          {achievements.items.map((item) => (
            <CertCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
