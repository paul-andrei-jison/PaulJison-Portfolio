'use client';
import type { Skill } from '@/types';

interface Props {
  skills: Skill[];
}

export default function SkillsMarquee({ skills }: Props) {
  const doubled = [...skills, ...skills];
  return (
    <div className="overflow-hidden">
      <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
        {doubled.map((skill, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-bg-card px-4 py-2 text-sm font-medium text-fg"
          >
            <span aria-hidden="true">{skill.emoji}</span>
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}
