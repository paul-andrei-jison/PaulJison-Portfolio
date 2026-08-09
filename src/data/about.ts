import type { AboutData } from '@/types';

const about: AboutData = {
  facts: [
    { title: 'Community', text: 'Active member of the Boy Scouts and a three-year varsity athlete in soccer and table tennis.' },
    { title: 'Education', text: 'Currently attending senior high school. Expected graduation: May 2028' },
    { title: 'Competitions', text: 'Participated in HKIMO and online hackathons.' },
  ],
  craft: {
    parts: [
      { text: 'Building scalable ' },
      { text: 'apps, websites, and automations.', bold: true },
      { text: ' I care about the tradeoffs behind the tech, so I can help pick the right solution for what a business actually needs.' },
    ],
    note: 'Active hackathon competitor & open-source contributor. Feel free to invite me to collaborate.',
  },
  techChips: [
    { name: 'Next.js', emoji: '▲' },
    { name: 'React', emoji: '⚛️' },
    { name: 'TypeScript', emoji: '🔷' },
  ],
  mindset: {
    parts: [
      { text: 'Growth on and off the keyboard.', bold: true },
      { text: ' My ' },
      { text: 'hobbies', bold: true },
      { text: ' keep me ' },
      { text: 'sharp, balanced,', bold: true },
      { text: ' and ready for the next hard problem.' },
    ],
    bottomParts: [
      { text: 'Mastering body and mind', bold: true },
      { text: ' is my path to ' },
      { text: 'excellence.', bold: true },
    ],
    images: [
      { src: '/images/mindset/photo-1.jpg', label: 'Soccer', placeholder: 'Soccer' },
      { src: '/images/mindset/photo-4.jpg', label: 'Soccer 2', placeholder: 'Soccer' },
      { src: '/images/mindset/photo-2.jpg', label: 'Pingpong', placeholder: 'Pingpong' },
      { src: '/images/mindset/photo-3.jpg', label: 'Deer', placeholder: 'Travel' },
    ],
  },
  portraits: [
    { src: '/images/profile/portrait-1.jpg', placeholder: 'Portrait 1' },
    { src: '/images/profile/portrait-2.jpg', placeholder: 'Portrait 2' },
    { src: '/images/profile/portrait-3.jpg', placeholder: 'Portrait 3' },
  ],
};

export default about;
