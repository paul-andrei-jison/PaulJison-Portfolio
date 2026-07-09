'use client';
import type { AboutData, SiteConfig } from '@/types';
import RichText from '@/components/ui/RichText';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import PeekCarousel from '@/components/ui/PeekCarousel';

interface Props {
  about: AboutData;
  config: SiteConfig;
}

export default function AboutSection({ about, config }: Props) {
  return (
    <section className="px-6 py-16 md:px-12 lg:px-20">
      <div className="max-w-4xl space-y-16">

        {/* Facts row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {about.facts.map((fact) => (
            <div key={fact.title} className="rounded-2xl border border-border bg-bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">{fact.title}</p>
              <p className="text-sm text-fg leading-relaxed">{fact.text}</p>
            </div>
          ))}
        </div>

        {/* Craft statement */}
        <div className="space-y-4">
          <RichText parts={about.craft.parts} className="text-2xl font-semibold leading-snug text-fg sm:text-3xl" />
          <div className="flex flex-wrap gap-2 mt-4">
            {about.techChips.map((chip) => (
              <span key={chip.name} className="flex items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 py-1 text-sm">
                <span aria-hidden="true">{chip.emoji}</span>
                {chip.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted">{about.craft.note}</p>
        </div>

        {/* Portraits carousel */}
        <div>
          <PeekCarousel itemWidth={240} itemCount={about.portraits.length} gap={12} peek={40}>
            {about.portraits.map((portrait, i) => (
              <div key={i} className="relative shrink-0 w-60 h-72 rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src={portrait.src}
                  placeholder={portrait.placeholder}
                  alt={`${config.name} portrait ${i + 1}`}
                  fill
                  className="object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </PeekCarousel>
        </div>

        {/* Mindset */}
        <div className="space-y-6">
          <RichText parts={about.mindset.parts} className="text-xl font-medium text-fg sm:text-2xl" />
          <PeekCarousel itemWidth={220} itemCount={about.mindset.images.length} gap={12} peek={40}>
            {about.mindset.images.map((img) => (
              <div key={img.label} className="relative shrink-0 w-[220px] h-64 rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src={img.src}
                  placeholder={img.placeholder}
                  alt={img.label}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 px-4 py-3">
                  <p className="text-xs font-medium text-white">{img.label}</p>
                </div>
              </div>
            ))}
          </PeekCarousel>
          <RichText parts={about.mindset.bottomParts} className="text-sm text-muted" />
        </div>

      </div>
    </section>
  );
}
