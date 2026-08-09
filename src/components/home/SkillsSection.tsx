import type { SkillsData, SiteConfig } from '@/types';

interface Props { skills: SkillsData; config: SiteConfig; }

export default function SkillsSection({ skills, config }: Props) {
  const rows: typeof skills.flat[] = [];
  let idx = 0;
  for (const size of skills.rowSizes) {
    rows.push(skills.flat.slice(idx, idx + size));
    idx += size;
  }

  return (
    <section id="section-skills" style={{ maxWidth: 1160, margin: '0 auto', padding: '20px 20px 110px' }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--pink)', marginBottom: 10 }}>Tech Stack</div>
        <h2 style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 46px)', margin: 0 }}>
          <span style={{ color: 'var(--text-primary)' }}>My </span>
          <span className="shine-text">Skills</span>
        </h2>
      </div>
      <div style={{ textAlign: 'center', fontSize: 15, color: 'var(--text-secondary)', marginBottom: 56 }}>{config.skillsSubtitle}</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {row.map((skill) => (
              <div
                key={skill.name}
                className="card-hover"
                style={{ width: 108, height: 108, borderRadius: 18, background: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <div style={{ fontSize: 26, lineHeight: 1 }}>{skill.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'center', padding: '0 6px' }}>{skill.name}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
