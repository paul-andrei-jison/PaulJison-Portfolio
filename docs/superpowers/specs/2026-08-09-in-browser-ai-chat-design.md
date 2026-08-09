# In-Browser AI Chat — Design Spec

**Date:** 2026-08-09  
**Status:** Approved  

---

## Overview

Add a working AI chat to the portfolio hero section. The model runs entirely in the visitor's browser — no server, no API key, no hosting cost. The model is downloaded once from HuggingFace's CDN and cached in the browser's IndexedDB. Subsequent visits load from cache in ~0.5s.

---

## Goals

- Answer visitor questions about Paul Jison using only his bio as the knowledge source.
- Zero ongoing cost — no backend, no API calls.
- Works in all browsers including Safari and mobile (WebAssembly, not WebGPU).
- Model is ready before the visitor asks their first question (eager download on mount).

---

## Non-Goals

- The AI does not answer questions unrelated to Paul.
- No fine-tuning or training — the model is used off-the-shelf with bio-as-context prompting.
- No server-side inference.

---

## Technology

| Choice | Rationale |
|---|---|
| `@huggingface/transformers` (Transformers.js) | WebAssembly-based, works in all browsers, no WebGPU required |
| `Xenova/flan-t5-small` | ~80MB, fine-tuned for Q&A tasks, fast inference, no hallucinations outside provided context |
| Web Worker | Runs inference off the main thread so UI animations never freeze |

---

## Files

| File | Role |
|---|---|
| `src/data/bio.ts` | Single source of truth for the AI's knowledge — a ~250-word plain-text bio of Paul |
| `src/workers/ai-worker.ts` | Web Worker: owns model lifecycle (download, cache, inference) |
| `src/hooks/useAIChat.ts` | React hook: creates worker, manages message state and model status |
| `src/components/home/HeroSection.tsx` | Updated to wire up `useAIChat`, replace stub responses, show progress |

---

## Architecture

```
HeroSection (React)
  └─ useAIChat (hook)
       ├─ creates Web Worker on mount, immediately sends { type: 'init' }
       ├─ sends { type: 'ask', question, bio } on user submit
       └─ receives messages from worker:
            { type: 'progress', pct: number }   → updates download progress in UI
            { type: 'ready' }                   → model loaded, chat input enabled
            { type: 'answer', text: string }    → AI response
            { type: 'error' }                   → "AI unavailable in this browser."

ai-worker.ts (Web Worker)
  ├─ imports @huggingface/transformers
  ├─ starts loading Xenova/flan-t5-small immediately on { type: 'init' } message
  │    └─ posts progress updates during download
  ├─ caches model in browser IndexedDB (automatic via Transformers.js)
  ├─ posts { type: 'ready' } when model is loaded and inference is available
  └─ queues any 'ask' messages that arrive before model is ready, processes them immediately after
```

---

## Data Flow

1. Visitor opens portfolio → `useAIChat` creates the worker and sends `{ type: 'init' }`.
2. Worker immediately begins downloading `Xenova/flan-t5-small`, posting `progress` events.
3. A subtle download indicator appears in the hero (e.g. small pill: "Preparing AI… 47%").
4. Worker posts `{ type: 'ready' }` — indicator disappears, chat input is fully enabled.
5. Visitor sends a message → worker receives `ask`, runs inference, posts `answer`.
6. If visitor sends a message while still downloading, it is queued and answered the moment the model is ready.
7. Subsequent visits: model loads from IndexedDB cache in ~0.5s, `ready` fires almost immediately.

---

## Prompt Template

```
Answer the following question about Paul Jison using only the bio below.
If the answer is not in the bio, say "I don't have that information about Paul."

Bio:
[bio text from src/data/bio.ts]

Question: [user question]
Answer:
```

The bio is injected into every prompt. Flan-T5-small's 512-token context window means the bio must stay under ~250 words.

---

## Bio File (`src/data/bio.ts`)

A plain-text export covering:
- Full name, location (Davao City, Philippines), timezone (GMT+8)
- Education (senior high school, expected graduation May 2028)
- Technical skills and stack (Next.js, React, TypeScript, etc.)
- Projects (pulled from existing `src/data/projects.ts` summaries)
- Extracurriculars (Boy Scouts, soccer, table tennis)
- Competitions (HKIMO, hackathons)
- Contact (email: paul.andrei.jison@gmail.com)
- Goals and interests

Paul writes this file himself — it is the only content the AI knows.

---

## Loading States (in chat bubble)

| State | UI shown |
|---|---|
| Downloading model (on mount) | Small pill in hero: `"Preparing AI… 47%"` — does not block the chat |
| User asks while downloading | Response bubble shows `"Preparing model… 47%"` until ready, then answer appears |
| Generating answer | Response bubble shows `"Thinking…"` |
| Error / unsupported | Response bubble shows `"AI unavailable in this browser."` |
| Answer ready | AI-generated text in response bubble |

---

## Error Handling

- If `Worker` is not supported: `useAIChat` catches the constructor error and sets status to `'error'`. The chat shows the unavailable message.
- If the model download fails (network error): worker posts `{ type: 'error' }`. Same fallback message shown.
- If inference produces an empty string: show `"I don't have that information about Paul."` as a safe fallback.

---

## Dependencies to Add

```
@huggingface/transformers
```

One new npm dependency. No backend changes. No environment variables.

---

## Out of Scope for This Spec

- Conversation memory (each question is answered independently with bio context)
- Streaming token-by-token output
- Model switching or upgrade path
