import type { AchievementsData } from '@/types';

// Drop files into public/images/achievements/
// Supported: .jpg .png .webp  and  .pdf for certificates
const achievements: AchievementsData = {
  featured: {
    title: 'Featured Achievement',
    description: "Drop in a certificate, award, or milestone that means the most — with a short story of what it took to get there.",
    image: '/images/achievements/featured.pdf',
  },
  // Add more certificates — drop the PDF into public/images/achievements/ then add an entry here
  // Use image: '' for a placeholder slot (shows empty card until you add the file)
  items: [
    { id: 'cert-1', image: '', title: 'Certificate 1', placeholder: 'Drop cert-1.pdf into public/images/achievements/' },
    { id: 'cert-2', image: '', title: 'Certificate 2', placeholder: 'Drop cert-2.pdf into public/images/achievements/' },
    { id: 'cert-3', image: '', title: 'Certificate 3', placeholder: 'Drop cert-3.pdf into public/images/achievements/' },
  ],
};

export default achievements;
