'use client';
import type { SiteConfig, AboutData, Project, SkillsData, SocialLink, AchievementsData } from '@/types';
import NavPill from '@/components/home/NavPill';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import SkillsSection from '@/components/home/SkillsSection';
import AchievementsSection from '@/components/home/AchievementsSection';
import OtherSection from '@/components/home/OtherSection';

interface Props {
  config: SiteConfig;
  about: AboutData;
  projects: Project[];
  skills: SkillsData;
  links: SocialLink[];
  achievements: AchievementsData;
}

export default function HomePageClient({ config, about, projects, skills, links, achievements }: Props) {
  return (
    <>
      <NavPill />
      <HeroSection config={config} />
      <AboutSection about={about} config={config} />
      <ProjectsSection projects={projects} config={config} />
      <SkillsSection skills={skills} config={config} />
      <AchievementsSection achievements={achievements} />
      <OtherSection links={links} />
    </>
  );
}
