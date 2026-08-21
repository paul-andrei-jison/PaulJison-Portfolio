'use client';

import * as React from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'framer-motion';
import { cn } from '@/lib/cn';

const NAV_ITEMS = [
  {
    label: 'Home',
    id: 'section-home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: 'About',
    id: 'section-about',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    label: 'Awards',
    id: 'section-achievements',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    id: 'section-projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Skills',
    id: 'section-skills',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: 'More',
    id: 'section-other',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const DEFAULT_SPRING: SpringOptions = { stiffness: 400, damping: 25, mass: 0.4 };
const ICON_SIZE = 42;
const MAGNIFICATION = 1.75;
const DISTANCE = 110;
const BORDER_RADIUS = 14;

function DockIcon({
  item,
  mouseX,
  isActive,
  springOptions,
  onHover,
  iconRef,
  onClick,
}: {
  item: typeof NAV_ITEMS[number];
  mouseX: ReturnType<typeof useMotionValue<number>>;
  isActive: boolean;
  springOptions: SpringOptions;
  onHover: (ref: React.RefObject<HTMLDivElement | null> | null) => void;
  iconRef: React.RefObject<HTMLDivElement | null>;
  onClick: () => void;
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const distanceFromMouse = useTransform(mouseX, (val) => {
    const el = wrapperRef.current;
    if (!el) return DISTANCE * 100;
    const rect = el.getBoundingClientRect();
    return Math.abs(val - (rect.left + rect.width / 2));
  });

  const gaussian = (d: number) =>
    (MAGNIFICATION - 1) * Math.exp(-(d * d) / (2 * DISTANCE * DISTANCE)) + 1;

  const widthRaw = useTransform(distanceFromMouse, (d) => ICON_SIZE * gaussian(d));
  const heightRaw = useTransform(distanceFromMouse, (d) => ICON_SIZE * gaussian(d));
  const width = useSpring(widthRaw, springOptions);
  const height = useSpring(heightRaw, springOptions);

  return (
    <motion.div
      ref={wrapperRef}
      className="relative flex flex-col items-center justify-end"
      style={{ width, height: ICON_SIZE }}
    >
      <motion.div
        ref={iconRef}
        style={{ width, height, bottom: 0 }}
        className="absolute"
      >
        <button
          onClick={onClick}
          onMouseEnter={() => onHover(iconRef)}
          onMouseLeave={() => onHover(null)}
          aria-label={item.label}
          style={{ borderRadius: BORDER_RADIUS }}
          className={cn(
            'flex h-full w-full items-center justify-center',
            'transition-colors duration-150 cursor-pointer border-none bg-transparent',
            '[&_svg]:size-[52%]',
            isActive
              ? 'text-foreground bg-foreground/[0.08]'
              : 'text-foreground/50 hover:bg-foreground/[0.06] hover:text-foreground',
          )}
        >
          {item.icon}
        </button>
      </motion.div>

      {/* Active dot */}
      <div
        className="absolute -bottom-2.5 h-1 w-1 rounded-full transition-all duration-300"
        style={{
          background: isActive ? 'var(--purple, #8b5cf6)' : 'transparent',
          transform: isActive ? 'scale(1)' : 'scale(0)',
        }}
      />
    </motion.div>
  );
}

export default function NavPill() {
  const mouseX = useMotionValue(Infinity);
  const dockRef = React.useRef<HTMLDivElement>(null);

  const iconRefs = React.useRef<React.RefObject<HTMLDivElement | null>[]>(
    NAV_ITEMS.map(() => React.createRef<HTMLDivElement>()),
  );

  const [active, setActive] = React.useState(0);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [tooltipX, setTooltipX] = React.useState(0);
  const [tooltipBottomOffset, setTooltipBottomOffset] = React.useState(0);

  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_ITEMS.forEach((item, i) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(i); },
        { threshold: 0.4 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  React.useEffect(() => {
    if (hoveredIndex === null) return;
    let raf: number;
    const update = () => {
      const iconEl = iconRefs.current[hoveredIndex]?.current;
      const dockEl = dockRef.current;
      if (iconEl && dockEl) {
        const iconRect = iconEl.getBoundingClientRect();
        const dockRect = dockEl.getBoundingClientRect();
        setTooltipX(iconRect.left - dockRect.left + iconRect.width / 2);
        setTooltipBottomOffset(dockRect.bottom - iconRect.top);
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [hoveredIndex]);

  const handleHover = React.useCallback(
    (ref: React.RefObject<HTMLDivElement | null> | null) => {
      if (ref === null) { setHoveredIndex(null); return; }
      const idx = iconRefs.current.findIndex((r) => r === ref);
      setHoveredIndex(idx >= 0 ? idx : null);
    },
    [],
  );

  const scrollTo = (id: string, index: number) => {
    setActive(index);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <motion.div
        ref={dockRef}
        className={cn(
          'relative flex items-end overflow-visible px-2 py-2',
          'border border-foreground/[0.08] bg-background/80 backdrop-blur-xl',
          'shadow-none transition-shadow duration-200',
          'hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)]',
        )}
        style={{ gap: 4, borderRadius: 20 }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {NAV_ITEMS.map((item, i) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            isActive={active === i}
            springOptions={DEFAULT_SPRING}
            onHover={handleHover}
            iconRef={iconRefs.current[i]}
            onClick={() => scrollTo(item.id, i)}
          />
        ))}

        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              key="dock-tooltip"
              className="pointer-events-none absolute flex flex-col items-center z-50"
              style={{
                left: tooltipX,
                bottom: tooltipBottomOffset + 8,
                x: '-50%',
              }}
              initial={{ opacity: 0, y: 6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.94 }}
              transition={{ duration: 0.13, ease: 'easeOut' }}
            >
              <span className="rounded-md border border-foreground/10 bg-background px-2 py-1 text-sm font-medium text-foreground shadow-sm whitespace-nowrap">
                {NAV_ITEMS[hoveredIndex].label}
              </span>
              <svg width="8" height="4" viewBox="0 0 8 4" className="-mt-px text-background" aria-hidden>
                <path d="M0 0L4 4L8 0" fill="currentColor" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}
