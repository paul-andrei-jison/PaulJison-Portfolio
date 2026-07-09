import type { AboutData } from '@/types';

const about: AboutData = {
  facts: [
    { title: 'Community', text: 'Active member of a developer community — add details about a club, meetup, or open-source group here.' },
    { title: 'Education', text: 'Add your degree, school, or self-taught path — whatever tells your story best.' },
    { title: 'Competitions', text: 'Add a hackathon placement or competition win here to show it off.' },
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
    { name: 'Flutter', emoji: '🦋' },
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
      { src: '/images/mindset/photo-1.jpg', label: 'Snowboarding', placeholder: 'Drop a hobby photo' },
      { src: '/images/mindset/photo-2.jpg', label: 'Hiking', placeholder: 'Drop a hobby photo' },
      { src: '/images/mindset/photo-3.jpg', label: 'Kickboxing', placeholder: 'Drop a hobby photo' },
    ],
  },
  portraits: [
    { src: '/images/profile/portrait-1.jpg', placeholder: 'Drop a portrait' },
    { src: '/images/profile/portrait-2.jpg', placeholder: 'Drop a portrait' },
    { src: '/images/profile/portrait-3.jpg', placeholder: 'Drop a portrait' },
  ],
};

export default about;
