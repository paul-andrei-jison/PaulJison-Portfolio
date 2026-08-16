import type { Project } from '@/types';

const projects: Project[] = [
  {
    id: 'documind',
    num: '01',
    kicker: 'AI · Web App',
    title: 'DocuMind',
    description: "A fully local Retrieval Augmented Generation (RAG) web app. Upload PDFs and text files to a vector library, then ask questions across all documents simultaneously — answered by a local LLM with no data leaving your machine.",
    tags: ['Python', 'Ollama', 'RAG', 'LLM', 'FastAPI'],
    images: [
      { src: '/images/projects/documind/1.png', placeholder: 'documind image 1' },
      { src: '/images/projects/documind/2.png', placeholder: 'documind image 2' },
      { src: '/images/projects/documind/3.png', placeholder: 'documind image 3' },
    ],
  },
];

export default projects;
