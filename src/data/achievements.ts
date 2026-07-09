import type { AchievementsData } from '@/types';

const achievements: AchievementsData = {
  featured: {
    title: 'Featured Achievement',
    description: "Drop in a certificate, award, or milestone that means the most — with a short story of what it took to get there.",
    image: '/images/achievements/featured.jpg',
  },
  items: [
    { id: 'ach-1', image: '/images/achievements/ach-1.jpg', placeholder: 'Drop certificate / award' },
    { id: 'ach-2', image: '/images/achievements/ach-2.jpg', placeholder: 'Drop certificate / award' },
  ],
};

export default achievements;
