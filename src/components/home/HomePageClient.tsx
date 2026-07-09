'use client';
import type { SiteConfig, AboutData, Project, SkillsData, SocialLink } from '@/types';
import Hero from '@/components/home/Hero';
import AboutSection from '@/components/home/AboutSection';
import ProjectGrid from '@/components/home/ProjectGrid';
import SkillsMarquee from '@/components/home/SkillsMarquee';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  config: SiteConfig;
  about: AboutData;
  projects: Project[];
  skills: SkillsData;
  links: SocialLink[];
}

export default function HomePageClient({ config, about, projects, skills, links }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-full border border-border bg-bg-card px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-fg"
        >
          {theme === undefined ? '...' : theme === 'dark' ? '☀ Light' : '☾ Dark'}
        </button>
      </div>

      {/* Sections */}
      <Hero config={config} />

      <div className="py-8 overflow-hidden">
        <SkillsMarquee skills={skills.flat} />
      </div>

      <ProjectGrid projects={projects} config={config} />

      <AboutSection about={about} config={config} />

      {/* Links / Footer */}
      <footer className="px-6 py-16 md:px-12 lg:px-20 border-t border-border mt-8">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">Links</p>
          <p className="text-sm text-muted mb-8">{config.linksSubtitle}</p>
          <div className="flex flex-wrap gap-4">
            {links.map((link) => (
              <a
                key={link.type}
                href={link.url}
                target={link.type !== 'email' ? '_blank' : undefined}
                rel={link.type !== 'email' ? 'noopener noreferrer' : undefined}
                className="rounded-full border border-border bg-bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-fg hover:text-fg"
              >
                {link.platform}
                <span className="ml-2 text-muted">{link.handle}</span>
              </a>
            ))}
          </div>
          <p className="mt-12 text-xs text-muted">© {new Date().getFullYear()} {config.name}</p>
        </div>
      </footer>
    </div>
  );
}
