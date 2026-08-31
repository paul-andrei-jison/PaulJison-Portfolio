import type { Project } from '@/types';

const projects: Project[] = [
  {
    id: 'documind',
    num: '02',
    kicker: 'DocuMind',
    title: 'Local AI Document Q&A',
    description: "A fully local Retrieval Augmented Generation (RAG) web app. Upload PDFs and text files to a vector library, then ask questions across all documents simultaneously — answered by a local LLM with no data leaving your machine.",
    tags: ['Python', 'Ollama', 'RAG', 'LLM', 'FastAPI'],
    images: [
      { src: '/images/projects/documind/1.png', placeholder: 'documind image 1' },
      { src: '/images/projects/documind/2.png', placeholder: 'documind image 2' },
      { src: '/images/projects/documind/3.png', placeholder: 'documind image 3' },
    ],
    githubUrl: 'https://github.com/paul-andrei-jison/RAG_document_analyzer_project',
    liveUrl: 'https://rag.pauljison.com',
    whatILearned: [
      "This was my first RAG project that I finished and deployed. A lot of my earlier projects died half-built — so with DocuMind, finishing and shipping it was a personal rule I set for myself before writing a single line of code.",
      "I learned how to run AI entirely on a local machine using Ollama. No API keys, no cloud, nothing leaves the device. Understanding how a model actually receives a prompt and returns a response made AI feel far less like a black box.",
      "I built a RAG pipeline from scratch — chunking documents into small pieces of text, converting those chunks into vectors, and passing the relevant ones alongside the user's question to the model. Following that data flow end-to-end was the biggest technical takeaway from this project.",
    ],
    dateAdded: 'August 21, 2026',
  },

  {
    id: 'pixelforge',
    num: '01',
    kicker: 'PixelForge',
    title: 'Screenshot to Code AI',
    description: "Upload a screenshot of any web UI and get clean, production-ready HTML+CSS or React components in seconds. Powered by Claude AI with live streaming output — code appears character by character as it generates. New accounts get 50 free credits with no credit card required.",
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'AWS Amplify', 'Claude AI'],
    images: [
      { src: '/images/projects/pixelforge/1.png', placeholder: 'PixelForge screenshot 1' },
      { src: '/images/projects/pixelforge/2.png', placeholder: 'PixelForge screenshot 2' },
      { src: '/images/projects/pixelforge/3.png', placeholder: 'PixelForge screenshot 3' },
    ],
    githubUrl: 'https://github.com/paul-andrei-jison/Image-To-Code-Website',
    liveUrl: 'https://imagetocode.pauljison.com',
    whatILearned: [
      "This was my first serious project that I actually deployed and finished. I've started plenty of projects before — but most of them never got completed, and almost none were ever shipped. With this one, I made a conscious decision early on to see it through to the end, no matter what.",
      "The biggest area was AI. I learned how to take AI beyond just a chat tool and use it to produce something genuinely useful — converting a screenshot into real, working code. Understanding how to structure prompts, stream responses, and integrate Claude's API into a real product was a completely new skill that opened my eyes to how powerful this technology actually is when applied well.",
      "I also learned authentication — login, signup, and session management — for the first time in a real deployed context. On top of that, building the credit system taught me how to tie user accounts to resource usage in a way that actually works in production.",
    ],
    dateAdded: 'May 30, 2026',
  },
];

export default projects;
