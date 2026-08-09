import config from '@/data/config';
import about from '@/data/about';
import projects from '@/data/projects';
import skills from '@/data/skills';
import links from '@/data/links';
import achievements from '@/data/achievements';
import HomePageClient from '@/components/home/HomePageClient';

export default function Home() {
  return (
    <HomePageClient
      config={config}
      about={about}
      projects={projects}
      skills={skills}
      links={links}
      achievements={achievements}
    />
  );
}
