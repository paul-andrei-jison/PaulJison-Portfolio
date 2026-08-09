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
let loading = false;
let pendingAsks: Array<{ question: string; bio: string }> = [];

function post(msg: OutMessage) {
  self.postMessage(msg);
}

async function loadModel() {
  if (generator || loading) return;
  loading = true;
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
    const queued = pendingAsks.splice(0);
    for (const item of queued) {
      await runInference(item.question, item.bio);
    }
  } catch (e) {
    post({ type: 'error', message: String(e) });
    const queued = pendingAsks.splice(0);
    for (const _ of queued) {
      post({ type: 'error', message: 'Model failed to load' });
    }
  } finally {
    loading = false;
  }
}

async function runInference(question: string, bio: string) {
  if (!generator) {
    post({ type: 'error', message: 'Model not loaded' });
    return;
  }
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
      pendingAsks.push({ question: msg.question, bio: msg.bio });
      if (!loading) {
        loadModel();
      }
    } else {
      await runInference(msg.question, msg.bio);
    }
  }
};
