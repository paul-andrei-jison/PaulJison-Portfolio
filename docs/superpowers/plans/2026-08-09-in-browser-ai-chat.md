# In-Browser AI Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up a real AI chat in the portfolio hero section that runs entirely in the visitor's browser with zero server cost.

**Architecture:** `@huggingface/transformers` loads `Xenova/flan-t5-small` (~80MB) inside a Web Worker on page mount. The worker posts progress events during download and queues any questions asked before the model is ready. A `useAIChat` hook bridges the worker to React state, and `HeroSection` is updated to use the hook.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, `@huggingface/transformers` v3, Web Workers (webpack 5 bundled)

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/data/bio.ts` | Plain-text bio string — the AI's only knowledge source |
| Create | `src/workers/ai-worker.ts` | Web Worker: model download, caching, inference |
| Create | `src/hooks/useAIChat.ts` | React hook: worker lifecycle, message state, model status |
| Modify | `src/components/home/HeroSection.tsx` | Wire up `useAIChat`, replace stub, show progress pill |
| Modify | `next.config.ts` | Add webpack fallbacks so Transformers.js resolves in browser |

---

## Task 1: Install `@huggingface/transformers`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
npm install @huggingface/transformers
```

Expected output includes: `added 1 package` (or similar). No peer dependency errors.

- [ ] **Step 2: Verify TypeScript can find the types**

```bash
npx tsc --noEmit
```

Expected: exits 0 (or only pre-existing errors — nothing mentioning `@huggingface/transformers`).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @huggingface/transformers"
```

---

## Task 2: Configure webpack fallbacks in `next.config.ts`

Transformers.js references Node.js built-ins (`fs`, `path`, `crypto`) that don't exist in the browser. Webpack must be told to stub them out.

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Open `next.config.ts` and replace it with:**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
};

export default nextConfig;
```

- [ ] **Step 2: Verify the dev server still starts**

```bash
npm run dev
```

Expected: server starts on `http://localhost:3000` without errors.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "chore: add webpack browser fallbacks for transformers.js"
```

---

## Task 3: Create `src/data/bio.ts`

This is the AI's only knowledge source. Flan-T5-small's 512-token context window means the bio must stay under ~250 words. Fill in the real project descriptions where marked.

**Files:**
- Create: `src/data/bio.ts`

- [ ] **Step 1: Create the file (fill in real details where marked):**

```ts
const bio = `
Paul Jison is a full-stack software developer based in Davao City, Philippines (GMT+8).

Education: Currently attending senior high school. Expected graduation: May 2028.

Skills and stack: Next.js, React, TypeScript, Node.js, JavaScript, HTML, CSS, Tailwind CSS. Also experienced with C++, OpenCV, and computer vision projects.

Projects:
- Prep Pilot: [Replace with real description of what Prep Pilot actually does].
- Arduino Ecommerce Website: [Replace with real description of what this project does].

Competitions: Participated in HKIMO (Hong Kong International Mathematical Olympiad) and multiple online hackathons as an active competitor and open-source contributor.

Extracurriculars: Active member of the Boy Scouts. Three-year varsity athlete in soccer and table tennis.

Interests: Building scalable apps, websites, and automations. Passionate about understanding the trade-offs behind technology choices to pick the right solution for what a business actually needs. Personal growth through sports keeps him sharp and balanced.

Contact: Email paul.andrei.jison@gmail.com to hire or collaborate.

Goal: To build production-quality software and contribute meaningfully to open-source projects while still in school.
`.trim();

export default bio;
```

> **Before the next task:** Replace the two placeholder project descriptions with real ones. The AI will answer questions about your projects based only on this text.

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/data/bio.ts
git commit -m "feat: add bio data for AI chat context"
```

---

## Task 4: Create `src/workers/ai-worker.ts`

The worker owns the full model lifecycle: download, cache, and inference. It uses `self.onmessage` / `self.postMessage` — the standard Web Worker API.

**Files:**
- Create: `src/workers/ai-worker.ts`

- [ ] **Step 1: Create the file:**

```ts
/// <reference lib="webworker" />

import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

type InMessage =
  | { type: 'init' }
  | { type: 'ask'; question: string; bio: string };

type OutMessage =
  | { type: 'progress'; pct: number }
  | { type: 'ready' }
  | { type: 'answer'; text: string }
  | { type: 'error'; message: string };

type Generator = Awaited<ReturnType<typeof pipeline>>;

let generator: Generator | null = null;
let pendingAsk: { question: string; bio: string } | null = null;

function post(msg: OutMessage) {
  self.postMessage(msg);
}

async function loadModel() {
  try {
    generator = await pipeline('text2text-generation', 'Xenova/flan-t5-small', {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      progress_callback: (progress: any) => {
        if (progress.status === 'progress' && progress.progress != null) {
          post({ type: 'progress', pct: Math.round(progress.progress) });
        }
      },
    });
    post({ type: 'ready' });
    if (pendingAsk) {
      await runInference(pendingAsk.question, pendingAsk.bio);
      pendingAsk = null;
    }
  } catch (e) {
    post({ type: 'error', message: String(e) });
  }
}

async function runInference(question: string, bio: string) {
  if (!generator) return;
  try {
    const prompt =
      `Answer the following question about Paul Jison using only the bio below.\n` +
      `If the answer is not in the bio, say "I don't have that information about Paul."\n\n` +
      `Bio:\n${bio}\n\n` +
      `Question: ${question}\nAnswer:`;

    const output = await (generator as (input: string, opts: object) => Promise<unknown>)(
      prompt,
      { max_new_tokens: 150 },
    );

    const text =
      Array.isArray(output) && output[0] && typeof (output[0] as { generated_text?: string }).generated_text === 'string'
        ? (output[0] as { generated_text: string }).generated_text.trim()
        : "I don't have that information about Paul.";

    post({ type: 'answer', text: text || "I don't have that information about Paul." });
  } catch (e) {
    post({ type: 'error', message: String(e) });
  }
}

self.onmessage = async (e: MessageEvent<InMessage>) => {
  const msg = e.data;
  if (msg.type === 'init') {
    await loadModel();
  } else if (msg.type === 'ask') {
    if (!generator) {
      pendingAsk = { question: msg.question, bio: msg.bio };
    } else {
      await runInference(msg.question, msg.bio);
    }
  }
};
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/workers/ai-worker.ts
git commit -m "feat: add AI web worker with flan-t5-small inference"
```

---

## Task 5: Create `src/hooks/useAIChat.ts`

The hook creates the worker on mount, sends `init` immediately (triggering the download), and manages all message/status state.

**Files:**
- Create: `src/hooks/useAIChat.ts`

- [ ] **Step 1: Create the file:**

```ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import bio from '@/data/bio';

export type ModelStatus = 'idle' | 'downloading' | 'ready' | 'thinking' | 'error';

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

export interface UseAIChatResult {
  messages: ChatMessage[];
  ask: (question: string) => void;
  modelStatus: ModelStatus;
  downloadPct: number;
}

let _id = 0;
const uid = () => ++_id;

export function useAIChat(): UseAIChatResult {
  const workerRef = useRef<Worker | null>(null);
  const modelStatusRef = useRef<ModelStatus>('idle');
  const downloadPctRef = useRef(0);
  const pendingIdRef = useRef<number | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle');
  const [downloadPct, setDownloadPct] = useState(0);

  const setStatus = (s: ModelStatus) => {
    modelStatusRef.current = s;
    setModelStatus(s);
  };

  useEffect(() => {
    let worker: Worker;
    try {
      worker = new Worker(new URL('../workers/ai-worker.ts', import.meta.url));
    } catch {
      setStatus('error');
      return;
    }

    workerRef.current = worker;
    setStatus('downloading');
    worker.postMessage({ type: 'init' });

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data as { type: string; pct?: number; text?: string };

      if (msg.type === 'progress' && msg.pct != null) {
        downloadPctRef.current = msg.pct;
        setDownloadPct(msg.pct);
        if (pendingIdRef.current !== null) {
          const id = pendingIdRef.current;
          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, text: `Preparing model… ${msg.pct}%` } : m)),
          );
        }
      } else if (msg.type === 'ready') {
        setStatus('ready');
        setDownloadPct(100);
        if (pendingIdRef.current !== null) {
          const id = pendingIdRef.current;
          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, text: 'Thinking…' } : m)),
          );
        }
      } else if (msg.type === 'answer') {
        setStatus('ready');
        const id = pendingIdRef.current;
        pendingIdRef.current = null;
        const text = msg.text || "I don't have that information about Paul.";
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, text } : m)),
        );
      } else if (msg.type === 'error') {
        setStatus('error');
        const id = pendingIdRef.current;
        pendingIdRef.current = null;
        if (id !== null) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === id ? { ...m, text: 'AI unavailable in this browser.' } : m,
            ),
          );
        }
      }
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ask = useCallback((question: string) => {
    const isDownloading = modelStatusRef.current === 'downloading';
    const initialText = isDownloading
      ? `Preparing model… ${downloadPctRef.current}%`
      : 'Thinking…';

    const userId = uid();
    const assistantId = uid();
    pendingIdRef.current = assistantId;

    setMessages((prev) => [
      ...prev,
      { id: userId, role: 'user', text: question },
      { id: assistantId, role: 'assistant', text: initialText },
    ]);

    if (!isDownloading) {
      setStatus('thinking');
    }

    workerRef.current?.postMessage({ type: 'ask', question, bio });
  }, []);

  return { messages, ask, modelStatus, downloadPct };
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useAIChat.ts
git commit -m "feat: add useAIChat hook for worker lifecycle and message state"
```

---

## Task 6: Update `src/components/home/HeroSection.tsx`

Replace the stub message system with `useAIChat`. Add a download progress pill that appears while the model is initialising.

**Files:**
- Modify: `src/components/home/HeroSection.tsx`

- [ ] **Step 1: Replace the full file contents with:**

```tsx
'use client';
import { useRef, useEffect } from 'react';
import type { SiteConfig } from '@/types';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useAIChat } from '@/hooks/useAIChat';

interface Props { config: SiteConfig; }

const QUICK_ACTIONS = [
  { label: 'What do you build?' },
  { label: "What's your stack?" },
  { label: 'How to hire you?' },
  { label: 'See projects ↓' },
];

export default function HeroSection({ config }: Props) {
  const { messages, ask, modelStatus, downloadPct } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToAbout = () => {
    document.getElementById('section-about')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('chat') as HTMLInputElement;
    if (!input.value.trim()) return;
    ask(input.value.trim());
    input.value = '';
  };

  return (
    <section
      id="section-home"
      className="flex min-h-screen flex-col items-center justify-center gap-6"
      style={{ padding: '140px 24px 60px' }}
    >
      {/* Radial glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }}
        />
        <div
          className="absolute right-1/4 bottom-1/3 h-80 w-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)' }}
        />
      </div>

      {/* Profile photo */}
      <div className="relative z-10 flex-none" style={{ animation: 'fadeUp 0.7s ease both' }}>
        <div
          className="h-[120px] w-[120px] rounded-full p-1"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
        >
          <div className="h-full w-full overflow-hidden rounded-full" style={{ background: 'var(--card-bg)' }}>
            <ImageWithFallback
              src={config.profilePhoto}
              alt={config.name}
              width={116}
              height={116}
              placeholder="Drop your photo"
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1
        className="relative z-10 m-0 text-center font-bold"
        style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: 'clamp(28px, 4.4vw, 40px)',
          color: 'var(--text-primary)',
          animation: 'fadeUp 0.7s 0.1s ease both',
          animationFillMode: 'both',
        }}
      >
        Hi, I&apos;m <span className="shine-text">{config.name}</span>
      </h1>

      {/* Chat area */}
      <div
        className="relative z-10 flex w-full max-w-[760px] flex-col gap-4"
        style={{ animation: 'fadeUp 0.7s 0.2s ease both', animationFillMode: 'both' }}
      >
        {/* Download progress pill */}
        {modelStatus === 'downloading' && (
          <div className="flex justify-center">
            <span
              className="rounded-full px-3 py-1 text-[12px] font-medium"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-muted)',
              }}
            >
              Preparing AI… {downloadPct}%
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="flex flex-col gap-3">
          {/* Static greeting */}
          <div className="flex" style={{ justifyContent: 'flex-start' }}>
            <div
              className="max-w-[82%] rounded-2xl text-[14.5px] leading-[1.7]"
              style={{
                background: 'var(--card-bg)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--card-border)',
                padding: '16px 20px',
              }}
            >
              Hi! I&apos;m Paul 👋 I build full-stack apps, mobile experiences, and everything in between. What would you like to know?
            </div>
          </div>

          {/* Dynamic AI messages */}
          {messages.map((msg) => (
            <div key={msg.id} className="flex" style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div
                className="max-w-[82%] rounded-2xl text-[14.5px] leading-[1.7]"
                style={
                  msg.role === 'user'
                    ? { background: '#8b5cf6', color: '#fff', border: 'none', padding: '16px 20px' }
                    : { background: 'var(--card-bg)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)', padding: '16px 20px' }
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap justify-center gap-2.5">
          {QUICK_ACTIONS.map((qa) => (
            <button
              key={qa.label}
              onClick={() => {
                if (qa.label === 'See projects ↓') {
                  document.getElementById('section-projects')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  ask(qa.label);
                }
              }}
              className="cursor-pointer rounded-full border px-[18px] py-[9px] text-[13px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-purple"
              style={{
                background: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-secondary)',
              }}
            >
              {qa.label}
            </button>
          ))}
        </div>

        {/* Chat input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2.5 rounded-full pl-5 pr-1.5 py-1.5"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
        >
          <input
            name="chat"
            placeholder="Ask anything about Paul..."
            className="flex-1 border-none bg-transparent text-[14px] outline-none"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-manrope)' }}
          />
          <button
            type="submit"
            className="flex h-[38px] w-[38px] flex-none cursor-pointer items-center justify-center rounded-full border-none transition-all duration-300 hover:scale-110 hover:brightness-110"
            style={{ background: 'linear-gradient(120deg, #8b5cf6, #ec4899)', color: '#fff' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </div>

      {/* Scroll cue */}
      <button
        onClick={scrollToAbout}
        className="relative z-10 mt-3.5 flex cursor-pointer flex-col items-center gap-1.5 border-none bg-transparent text-[12.5px]"
        style={{ color: 'var(--text-muted)' }}
      >
        Scroll to explore
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4v16M6 14l6 6 6-6" />
        </svg>
      </button>
    </section>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: exits 0.

- [ ] **Step 3: Start dev server and open the page**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected:
- Page loads, `"Preparing AI… X%"` pill appears and increments
- Pill disappears once model reaches 100%
- Quick action "What's your stack?" → user bubble, then `"Thinking…"`, then an AI answer
- Typing "What is the weather today?" → AI responds with something like `"I don't have that information about Paul."`
- Asking while pill is visible → bubble shows `"Preparing model… X%"` live, then updates to the answer
- Reload → model loads from cache, pill disappears almost immediately

- [ ] **Step 4: Commit**

```bash
git add src/components/home/HeroSection.tsx
git commit -m "feat: wire up in-browser AI chat with eager model download"
```

---

## Task 7: Final build verification

- [ ] **Step 1: Run a full production build**

```bash
npm run build
```

Expected: completes successfully. Warnings about `fs`/`path` fallbacks in the build output are expected and harmless.

- [ ] **Step 2: Commit any remaining changes**

```bash
git add -A
git commit -m "feat: complete in-browser AI chat — flan-t5-small, zero hosting cost"
```

---

## Manual Test Checklist

| Test | Expected result |
|---|---|
| Page load | `"Preparing AI… X%"` pill visible, percentage increases |
| Model ready | Pill disappears |
| Ask "What's your stack?" | AI answers with tech from the bio |
| Ask "Where are you located?" | AI answers "Davao City, Philippines" |
| Ask "What is the weather?" | AI says it doesn't have that information |
| Ask question while pill visible | Bubble shows `"Preparing model… X%"` live, then updates to answer |
| Reload page | Model loads from cache, pill disappears almost instantly |
| Open in Firefox / Safari | Works — WebAssembly only, no WebGPU required |
