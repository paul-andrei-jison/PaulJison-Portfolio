'use client';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Props {
  children: React.ReactNode;
  className?: string;
  itemWidth: number;
  itemCount: number;
  gap?: number;
  peek?: number;
}

export default function PeekCarousel({
  children,
  className,
  itemWidth,
  itemCount,
  gap = 16,
  peek = 40,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 });

  const totalWidth = itemCount * (itemWidth + gap) - gap;
  const leftConstraint = -(totalWidth - itemWidth - peek);

  return (
    <div ref={containerRef} className={cn('overflow-hidden', className)}>
      <motion.div
        drag="x"
        dragConstraints={{ left: leftConstraint, right: 0 }}
        dragElastic={0.05}
        style={{ x: springX, display: 'flex', gap: `${gap}px` }}
        className="cursor-grab active:cursor-grabbing"
      >
        {children}
      </motion.div>
    </div>
  );
}
