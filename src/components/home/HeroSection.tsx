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
  const { messages, ask, retry, modelStatus, downloadPct, hasPendingMessage } = useAIChat();
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

  const inputDisabled = modelStatus === 'idle' || modelStatus === 'thinking' || modelStatus === 'error' || hasPendingMessage;

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
              Preparing AI… {downloadPct > 0 ? `${downloadPct}%` : ''}
            </span>
          </div>
        )}

        {/* Error retry */}
        {modelStatus === 'error' && (
          <div className="flex justify-center">
            <button
              onClick={retry}
              className="rounded-full border px-4 py-1.5 text-[12px] font-medium transition-colors hover:border-purple"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}
            >
              Retry AI connection
            </button>
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
              disabled={inputDisabled && qa.label !== 'See projects ↓'}
              onClick={() => {
                if (qa.label === 'See projects ↓') {
                  document.getElementById('section-projects')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  ask(qa.label);
                }
              }}
              className="cursor-pointer rounded-full border px-[18px] py-[9px] text-[13px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-purple disabled:opacity-50 disabled:cursor-not-allowed"
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
            aria-label="Chat with Paul's AI"
            placeholder="Ask anything about Paul..."
            className="flex-1 border-none bg-transparent text-[14px] outline-none"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-manrope)' }}
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={inputDisabled}
            className={`flex h-[38px] w-[38px] flex-none cursor-pointer items-center justify-center rounded-full border-none transition-all duration-300 ${inputDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:brightness-110'}`}
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
