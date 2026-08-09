'use client';

import { useState } from 'react';
import type { SocialLink } from '@/types';

interface Props { links: SocialLink[]; }

const EMAIL = 'paul.andrei.jison@gmail.com';

const LINK_ICONS: Record<string, string> = {
  github: `<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>`,
  linkedin: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>`,
  x: `<path d="M4 4l16 16M20 4L4 20"/>`,
  email: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`,
};

const LINK_COLORS: Record<string, string> = {
  github: 'var(--purple)',
  linkedin: 'var(--blue)',
  x: 'var(--text-primary)',
  email: 'var(--pink)',
};

function EmailCard({ link }: { link: SocialLink }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const color = LINK_COLORS.email;
  const iconPath = LINK_ICONS.email;

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="card-hover"
        style={{
          background: 'var(--card-bg)',
          border: open ? `1px solid ${color}` : '1px solid var(--card-border)',
          borderRadius: 22,
          padding: '40px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 6,
          cursor: 'pointer',
          width: '100%',
          transition: 'border-color 0.2s',
        }}
      >
        <div style={{ width: 64, height: 64, borderRadius: 16, border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 14 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" dangerouslySetInnerHTML={{ __html: iconPath }} />
        </div>
        <div style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 22, color }}>{link.platform}</div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{link.handle}</div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color }}>
          {open ? 'Close ↑' : 'Show email →'}
        </div>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--card-bg)',
            border: `1px solid ${color}`,
            borderRadius: 16,
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            zIndex: 20,
            minWidth: 280,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          }}
        >
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>My email address</div>
          <div
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 700,
              fontSize: 15,
              color: 'var(--text-primary)',
              background: 'var(--input-bg, rgba(255,255,255,0.04))',
              border: '1px solid var(--card-border)',
              borderRadius: 10,
              padding: '10px 16px',
              letterSpacing: '0.01em',
              userSelect: 'all',
            }}
          >
            {EMAIL}
          </div>
          <button
            onClick={copy}
            style={{
              background: copied ? '#22c55e' : color,
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '9px 22px',
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
              transition: 'background 0.2s',
              width: '100%',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy email'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function OtherSection({ links }: Props) {
  return (
    <section id="section-other" style={{ maxWidth: 1160, margin: '0 auto', padding: '20px 32px 160px' }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 46px)', margin: 0 }}>
          <span style={{ color: 'var(--text-primary)' }}>More to </span>
          <span className="shine-text">Explore</span>
        </h2>
      </div>
      <div style={{ textAlign: 'center', fontSize: 15, color: 'var(--text-secondary)', marginBottom: 56 }}>
        Check out these additional resources and connect with me.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 24 }}>
        {links.map((link) => {
          if (link.type === 'email') {
            return <EmailCard key={link.type} link={link} />;
          }

          const color = LINK_COLORS[link.type] ?? 'var(--purple)';
          const iconPath = LINK_ICONS[link.type] ?? '';
          return (
            <a
              key={link.type}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 22, padding: '40px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6, textDecoration: 'none' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 16, border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 14 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" dangerouslySetInnerHTML={{ __html: iconPath }} />
              </div>
              <div style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 22, color }}>{link.platform}</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{link.handle}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color, cursor: 'pointer' }}>
                Visit →
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
