'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AchievementsData } from '@/types';

interface CarouselItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  isFeatured?: boolean;
}

function getOffset(index: number, active: number, total: number): number {
  let offset = index - active;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

function isPdf(path: string) { return path.toLowerCase().endsWith('.pdf'); }

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const CARD_TRANSITION = { type: 'tween' as const, duration: 0.45, ease: EASE };

/** Clips any scrollbar by making the iframe slightly larger than its clipping container */
function NoScrollPreview({ src, title, interactive = false }: { src: string; title: string; interactive?: boolean }) {
  if (!src) return null;

  const iframeStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 'calc(100% + 20px)',
    height: 'calc(100% + 20px)',
    border: 'none',
    display: 'block',
    pointerEvents: interactive ? 'auto' : 'none',
  };

  if (isPdf(src)) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <iframe
          src={`${src}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&view=FitH`}
          style={iframeStyle}
          tabIndex={interactive ? 0 : -1}
          title={title}
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={title} style={{ width: '100%', height: '100%', objectFit: interactive ? 'contain' : 'cover', display: 'block' }} />
  );
}

/** Side card — actual certificate preview, no modal on click */
function SideCard({ item }: { item: CarouselItem }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      borderRadius: 16, overflow: 'hidden', position: 'relative',
      border: '1px solid var(--card-border)',
      background: '#0a0a0a',
    }}>
      <NoScrollPreview src={item.image} title={item.title} />
      {/* Block iframe so carousel click zones still work */}
      <div style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}

/** Center card — renders the actual certificate */
function CenterCard({ item }: { item: CarouselItem }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      borderRadius: 16, overflow: 'hidden', position: 'relative',
      border: '1px solid rgba(124,58,237,0.55)',
      boxShadow: '0 0 48px rgba(124,58,237,0.18), 0 12px 40px rgba(0,0,0,0.35)',
      background: '#0a0a0a',
    }}>
      <NoScrollPreview src={item.image} title={item.title} />

      {/* Blocks iframe so carousel click zones still work */}
      <div style={{ position: 'absolute', inset: 0 }} />

      {item.isFeatured && (
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 3, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', background: '#7c3aed', padding: '3px 9px', borderRadius: 999 }}>
          Featured
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 3, fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'none' }}>
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1h5M1 1v5M15 1h-5M15 1v5M1 15h5M1 15v-5M15 15h-5M15 15v-5" /></svg>
        Click to expand
      </div>
    </div>
  );
}

function CertModal({ item, onClose }: { item: CarouselItem; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 6 }}
        transition={{ type: 'tween', duration: 0.22, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', width: 'min(92vw, 1040px)', height: 'min(86vh, 740px)', borderRadius: 18, overflow: 'hidden', background: '#0a0a0a', border: '1px solid rgba(124,58,237,0.4)', boxShadow: '0 0 80px rgba(124,58,237,0.15), 0 32px 80px rgba(0,0,0,0.6)' }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: 'absolute', top: 14, right: 14, zIndex: 10, width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(124,58,237,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 1l12 12M13 1L1 13" /></svg>
        </button>
        <NoScrollPreview src={item.image} title={item.title} interactive />
      </motion.div>
    </motion.div>
  );
}

export default function AchievementsSection({ achievements }: { achievements: AchievementsData }) {
  const items: CarouselItem[] = [
    { id: 'featured', title: achievements.featured.title, description: achievements.featured.description, image: achievements.featured.image, isFeatured: true },
    ...achievements.items.map((item) => ({ id: item.id, title: item.title ?? item.placeholder, image: item.image })),
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [modalItem, setModalItem] = useState<CarouselItem | null>(null);
  const resetKeyRef = useRef(0);
  const total = items.length;

  const manualPrev = () => { setActiveIdx((i) => (i - 1 + total) % total); resetKeyRef.current += 1; };
  const manualNext = () => { setActiveIdx((i) => (i + 1) % total); resetKeyRef.current += 1; };

  useEffect(() => {
    if (!isAutoPlay || modalItem) return;
    const key = resetKeyRef.current;
    const t = setInterval(() => {
      if (resetKeyRef.current !== key) return;
      setActiveIdx((i) => (i + 1) % total);
    }, 2000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlay, total, modalItem]);

  const CARD_W = 300;
  const CARD_H = 210;
  const STEP = 220;

  return (
    <section id="section-achievements" style={{ maxWidth: 1160, margin: '0 auto', padding: '20px 32px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 46px)', margin: 0 }}>
          <span style={{ color: 'var(--text-primary)' }}>Certificates &amp; </span>
          <span className="shine-text">Awards</span>
        </h2>
      </div>
      <div style={{ textAlign: 'center', fontSize: 15, color: 'var(--text-secondary)', marginBottom: 52 }}>
        {total} certifications earned
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ position: 'relative', height: CARD_H + 60, overflow: 'hidden' }}>
          {/* Edge fade */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', background: 'linear-gradient(to right, var(--page-bg) 0%, transparent 18%, transparent 82%, var(--page-bg) 100%)' }} />

          {/* Click zones */}
          <div onClick={manualPrev} role="button" aria-label="Previous" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && manualPrev()} style={{ position: 'absolute', left: 0, top: 0, width: 'calc(50% - 155px)', height: '100%', zIndex: 15, cursor: 'w-resize' }} />
          <div onClick={manualNext} role="button" aria-label="Next" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && manualNext()} style={{ position: 'absolute', right: 0, top: 0, width: 'calc(50% - 155px)', height: '100%', zIndex: 15, cursor: 'e-resize' }} />

          {items.map((item, index) => {
            const offset = getOffset(index, activeIdx, total);
            if (Math.abs(offset) > 3) return null;
            const absOffset = Math.abs(offset);
            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            return (
              <motion.div
                key={item.id}
                animate={{
                  scale: isVisible ? 1 - absOffset * 0.18 : 0.64,
                  opacity: isVisible ? 1 - absOffset * 0.4 : 0,
                  x: offset * STEP,
                  zIndex: isVisible ? 10 - absOffset : 0,
                }}
                transition={CARD_TRANSITION}
                onClick={isCenter ? () => setModalItem(item) : undefined}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 20,
                  width: CARD_W,
                  height: CARD_H,
                  marginLeft: -CARD_W / 2,
                  cursor: isCenter ? 'pointer' : 'default',
                  willChange: 'transform, opacity',
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
              >
                {isCenter ? <CenterCard item={item} /> : <SideCard item={item} />}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 20 }}>
          <button onClick={manualPrev} aria-label="Previous certificate" style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'border-color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7c3aed')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--card-border)')}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <div style={{ display: 'flex', gap: 5, alignItems: 'center', maxWidth: 240, overflow: 'hidden' }}>
            {items.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setActiveIdx(i)}
                aria-label={`Go to certificate ${i + 1}`}
                animate={{ width: i === activeIdx ? 22 : 6, background: i === activeIdx ? '#7c3aed' : 'var(--card-border)' }}
                transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                style={{ height: 6, borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}
              />
            ))}
          </div>

          <button onClick={manualNext} aria-label="Next certificate" style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'border-color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7c3aed')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--card-border)')}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <button
            onClick={() => setIsAutoPlay((v) => !v)}
            aria-label={isAutoPlay ? 'Pause' : 'Play'}
            title={isAutoPlay ? 'Pause' : 'Play'}
            style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--text-muted)', opacity: isAutoPlay ? 0.5 : 0.3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'opacity 0.2s', padding: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = isAutoPlay ? '0.5' : '0.3')}
          >
            {isAutoPlay
              ? <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="1" y="1" width="3.5" height="10" rx="1" /><rect x="7.5" y="1" width="3.5" height="10" rx="1" /></svg>
              : <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1.5l9 4.5-9 4.5V1.5z" /></svg>
            }
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
          {activeIdx + 1} / {total}
        </div>
      </div>

      <AnimatePresence>
        {modalItem && <CertModal item={modalItem} onClose={() => setModalItem(null)} />}
      </AnimatePresence>
    </section>
  );
}
