import type { Project } from '@/types';

const projects: Project[] = [
  {
    id: 'preppilot',
    num: '01',
    kicker: 'Website',
    title: 'Prep Pilot',
    description: "Desktop application using computer vision to scan and solve Rubik's Cube in real-time.",
    tags: ['C++', 'OpenCV', 'Clustering', 'Algorithms'],
    images: [
      { src: '/images/projects/cube-solver/img-1.jpg', placeholder: 'Drop Cube Solver screenshot' },
      { src: '/images/projects/cube-solver/img-2.jpg', placeholder: 'Drop Cube Solver screenshot' },
      { src: '/images/projects/cube-solver/img-3.jpg', placeholder: 'Drop Cube Solver screenshot' },
    ],
  },
  {
    id: 'arduinoecommercewebsite',
    num: '02',
    kicker: 'Website',
    title: 'Arduino Ecommerce Website',
    description: "Desktop application using computer vision to scan and solve Rubik's Cube in real-time.",
    tags: ['C++', 'OpenCV', 'Clustering', 'Algorithms'],
    images: [
      { src: '/images/projects/cube-solver/img-1.jpg', placeholder: 'Drop Cube Solver screenshot' },
      { src: '/images/projects/cube-solver/img-2.jpg', placeholder: 'Drop Cube Solver screenshot' },
      { src: '/images/projects/cube-solver/img-3.jpg', placeholder: 'Drop Cube Solver screenshot' },
    ],
  },
];

export default projects;
