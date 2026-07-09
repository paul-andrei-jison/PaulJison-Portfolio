// Shared primitive
export interface TextPart {
  text: string;
  bold?: boolean;
}

// config.ts
export interface SiteConfig {
  name: string;
  title: string;
  location: string;
  coordinates: string;
  profilePhoto: string;
  githubUrl: string;
  bookingEmail: string;
  projectsSubtitle: string;
  skillsSubtitle: string;
  linksSubtitle: string;
}

// about.ts
export interface AboutFact {
  title: string;
  text: string;
}

export interface TechChip {
  name: string;
  emoji: string;
}

export interface MindsetImage {
  src: string;
  label: string;
  placeholder: string;
}

export interface Portrait {
  src: string;
  placeholder: string;
}

export interface AboutData {
  facts: AboutFact[];
  craft: {
    parts: TextPart[];
    note: string;
  };
  techChips: TechChip[];
  mindset: {
    parts: TextPart[];
    bottomParts: TextPart[];
    images: MindsetImage[];
  };
  portraits: Portrait[];
}

// projects.ts
export interface ProjectImage {
  src: string;
  placeholder: string;
}

export interface Project {
  id: string;
  num: string;
  kicker: string;
  title: string;
  description: string;
  tags: string[];
  images: [ProjectImage, ProjectImage, ProjectImage];
}

// skills.ts
export interface Skill {
  name: string;
  emoji: string;
}

export interface SkillsData {
  flat: Skill[];
  rowSizes: number[];
}

// achievements.ts
export interface AchievementItem {
  id: string;
  image: string;
  placeholder: string;
}

export interface AchievementsData {
  featured: {
    title: string;
    description: string;
    image: string;
  };
  items: AchievementItem[];
}

// links.ts
export type SocialLinkType = 'github' | 'linkedin' | 'x' | 'email';

export interface SocialLink {
  platform: string;
  handle: string;
  url: string;
  type: SocialLinkType;
}

// guestbook.ts
export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}
