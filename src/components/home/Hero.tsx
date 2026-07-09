'use client';
import { motion, type Variants } from 'framer-motion';
import type { SiteConfig } from '@/types';

interface Props {
  config: SiteConfig;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero({ config }: Props) {
  return (
    <section className="px-6 pt-24 pb-16 md:px-12 lg:px-20">
      <motion.div initial="hidden" animate="visible" className="max-w-4xl">
        <motion.p custom={0} variants={fadeUp} className="text-sm font-medium text-muted mb-3 tracking-wide uppercase">
          {config.location}
        </motion.p>
        <motion.h1 custom={1} variants={fadeUp} className="text-4xl font-bold tracking-tight text-fg sm:text-5xl lg:text-6xl">
          {config.name}
        </motion.h1>
        <motion.p custom={2} variants={fadeUp} className="mt-4 text-xl text-muted">
          {config.title}
        </motion.p>
        <motion.div custom={3} variants={fadeUp} className="mt-8 flex gap-4 flex-wrap">
          <a
            href={config.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-fg text-bg px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
          >
            GitHub
          </a>
          <a
            href={`mailto:${config.bookingEmail}`}
            className="rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-bg-card"
          >
            Get in touch
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
