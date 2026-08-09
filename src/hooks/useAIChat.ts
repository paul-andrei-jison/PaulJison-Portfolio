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
  retry: () => void;
  modelStatus: ModelStatus;
  downloadPct: number;
  hasPendingMessage: boolean;
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

  const setStatus = useCallback((s: ModelStatus) => {
    modelStatusRef.current = s;
    setModelStatus(s);
  }, []);

  const handleWorkerMessage = useCallback((e: MessageEvent) => {
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
      if (pendingIdRef.current !== null) {
        setStatus('thinking');
      } else {
        setStatus('ready');
      }
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
  }, [setStatus]);

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

    worker.onmessage = handleWorkerMessage;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ask = useCallback((question: string) => {
    if (modelStatusRef.current === 'thinking') return;
    if (modelStatusRef.current === 'error') return;
    if (modelStatusRef.current === 'idle') return;
    if (pendingIdRef.current !== null) return;

    const isDownloading = modelStatusRef.current === 'downloading';
    const initialText = isDownloading
      ? downloadPctRef.current > 0
        ? `Preparing model… ${downloadPctRef.current}%`
        : 'Preparing model…'
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
  }, [setStatus]);

  const retry = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    pendingIdRef.current = null;
    downloadPctRef.current = 0;
    setMessages([]);
    setDownloadPct(0);
    setStatus('downloading');

    let worker: Worker;
    try {
      worker = new Worker(new URL('../workers/ai-worker.ts', import.meta.url));
    } catch {
      setStatus('error');
      return;
    }
    workerRef.current = worker;
    worker.postMessage({ type: 'init' });
    worker.onmessage = handleWorkerMessage;
  }, [setStatus, handleWorkerMessage]);

  return { messages, ask, retry, modelStatus, downloadPct, hasPendingMessage: pendingIdRef.current !== null };
}
