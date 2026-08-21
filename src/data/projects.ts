import type { Project } from '@/types';

const projects: Project[] = [
  {
    id: 'documind',
    num: '01',
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
      "This was the first project I deliberately finished and deployed. A lot of my earlier projects died half-built — so with DocuMind, finishing and shipping it was a personal rule I set for myself before writing a single line of code.",
      "I learned how to run AI entirely on a local machine using Ollama. No API keys, no cloud, nothing leaves the device. Understanding how a model actually receives a prompt and returns a response made AI feel far less like a black box.",
      "I built a RAG pipeline from scratch — chunking documents into small pieces of text, converting those chunks into vectors, and passing the relevant ones alongside the user's question to the model. Following that data flow end-to-end was the biggest technical takeaway from this project.",
    ],
    dateAdded: 'August 21, 2026',
  },
];

export default projects;

// import type { Project } from '@/types';

// const projects: Project[] = [
//   {
//     id: 'documind',
//     num: '01',
//     kicker: 'DocuMind',
//     title: 'Local AI Document Q&A',
//     description: "A fully local Retrieval Augmented Generation (RAG) web app. Upload PDFs and text files to a vector library, then ask questions across all documents simultaneously — answered by a local LLM with no data leaving your machine.",
//     tags: ['Python', 'Ollama', 'RAG', 'LLM', 'FastAPI'],
//     images: [
//       { src: '/images/projects/documind/1.png', placeholder: 'documind image 1' },
//       { src: '/images/projects/documind/2.png', placeholder: 'documind image 2' },
//       { src: '/images/projects/documind/3.png', placeholder: 'documind image 3' },
//     ],
//     githubUrl: 'https://github.com/paul-andrei-jison/RAG_document_analyzer_project',
//     liveUrl: 'https://rag.pauljison.com',
//     whatILearned: [
//       'Building a fully local RAG pipeline using ChromaDB as the vector store and nomic-embed-text for embeddings via Ollama',
//       'Running private, offline LLM inference — no cloud, no API keys, nothing leaves the machine',
//       'Designing a FastAPI backend that handles PDF/TXT ingestion, chunking, embedding, and retrieval in one server',
//       'Serving a single-page frontend directly from FastAPI so no separate dev server or tunnel is needed',
//       'Supporting multiple LLMs (Llama 3.2, Llama 3.1, Mistral, Phi3) switchable at runtime from a dropdown',
//     ],
//   },
// ];

// export default projects;

