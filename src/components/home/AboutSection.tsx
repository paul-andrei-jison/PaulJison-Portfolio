'use client';
import { useState } from 'react';
import type { AboutData, SiteConfig } from '@/types';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

interface Props { about: AboutData; config: SiteConfig; }

export default function AboutSection({ about, config }: Props) {
  const [mindsetIdx, setMindsetIdx] = useState(0);
  const [portraitIdx, setPortraitIdx] = useState(0);

  const advanceMindset = () => setMindsetIdx((i) => (i + 1) % about.mindset.images.length);
  const advancePortrait = () => setPortraitIdx((i) => (i + 1) % about.portraits.length);

  return (
    <section
      id="section-about"
      style={{ maxWidth: 1160, margin: '0 auto', padding: '60px 20px 110px', display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      {/* Row 1 */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Name card */}
        <div
          className="card-hover"
          style={{ flex: '1 1 260px', minWidth: 240, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}
        >
          <div style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: 'clamp(24px, 3vw, 30px)', lineHeight: 1.15, color: 'var(--text-primary)' }}>
            PAUL<br />JISON
          </div>
          <div style={{ width: 34, height: 3, background: 'linear-gradient(120deg, #8b5cf6, #ec4899)', borderRadius: 2, margin: '6px 0' }} />
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Fullstack Developer
          </div>
        </div>

        {/* Facts card */}
        <div
          style={{ flex: '2 1 420px', minWidth: 300, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: '22px 8px 8px', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: 14 }}>
            Hover to read more
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
            {about.facts.map((fact) => (
              <div key={fact.title} className="group" style={{ flex: '1 1 160px', padding: '10px 18px 18px', borderLeft: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{fact.title}</div>
                <div style={{ maxHeight: 20, overflow: 'hidden', transition: 'max-height 0.4s ease', fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}
                  className="group-hover:!max-h-56">
                  {fact.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'stretch' }}>

        {/* Mindset card */}
        <div
          className="card-hover"
          style={{ flex: '1 1 280px', minWidth: 260, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 26, display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)' }}>Mindset</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Growth on and off the keyboard.</strong>{' '}
            My <strong style={{ color: 'var(--text-primary)' }}>hobbies</strong> keep me{' '}
            <strong style={{ color: 'var(--text-primary)' }}>sharp, balanced,</strong> and ready for the next hard problem.
          </p>
          {/* Image slider */}
          <div
            onClick={advanceMindset}
            style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer' }}
          >
            {about.mindset.images.map((img, i) => (
              <div
                key={img.label}
                style={{ position: 'absolute', inset: 0, zIndex: i === mindsetIdx ? 3 : 1, opacity: i === mindsetIdx ? 1 : 0, transition: 'opacity 0.5s ease' }}
              >
                <ImageWithFallback src={img.src} alt={img.label} fill placeholder={img.placeholder} className="object-cover" />
              </div>
            ))}
            <div style={{ position: 'absolute', left: 10, bottom: 10, background: 'rgba(10,9,18,0.75)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 12px', borderRadius: 999, pointerEvents: 'none', zIndex: 4 }}>
              {about.mindset.images[mindsetIdx]?.label}
            </div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Mastering body and mind</strong> is my path to <strong style={{ color: 'var(--text-primary)' }}>excellence.</strong>
          </p>
        </div>

        {/* Portrait + Location column */}
        <div style={{ flex: '1 1 240px', minWidth: 220, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Portrait slider */}
          <div
            onClick={advancePortrait}
            style={{ position: 'relative', flex: 1, borderRadius: 20, overflow: 'hidden', border: '1px solid var(--card-border)', minHeight: 200, cursor: 'pointer' }}
          >
            {about.portraits.map((p, i) => (
              <div key={i} style={{ position: 'absolute', inset: 0, zIndex: i === portraitIdx ? 3 : 1, opacity: i === portraitIdx ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                <ImageWithFallback src={p.src} alt={`${config.name} portrait ${i + 1}`} fill placeholder={p.placeholder} className="object-cover" />
              </div>
            ))}
          </div>
          {/* Location card */}
          <div
            className="card-hover"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 4 }}
          >
            <div style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: 19, color: 'var(--text-primary)' }}>{config.location}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>{config.coordinates}</div>
          </div>
        </div>

        {/* Craft + Note column */}
        <div style={{ flex: '1 1 280px', minWidth: 260, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Craft card */}
          <div
            className="card-hover"
            style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 26, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)' }}>Craft</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0 }}>
              Building scalable{' '}
              <strong style={{ color: 'var(--text-primary)' }}>apps, websites, and automations.</strong>{' '}
              I care about the tradeoffs behind the tech, so I can help pick the right solution for what a business actually needs.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' }}>
              {about.techChips.map((chip) => (
                <div key={chip.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', background: 'var(--input-bg)', border: '1px solid var(--card-border)', padding: '6px 11px', borderRadius: 999 }}>
                  <span>{chip.emoji}</span>{chip.name}
                </div>
              ))}
            </div>
          </div>
          {/* Note card */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{about.craft.note}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#4ade80' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 0 3px rgba(74,222,128,0.2)', animation: 'pulse-green 2s infinite', flexShrink: 0 }} />
              Open to collaboration &amp; freelance
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
