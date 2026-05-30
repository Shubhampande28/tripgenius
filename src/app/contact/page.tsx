'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { Mail, MessageSquare, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SUBJECTS = [
  'General question',
  'Guide correction or update',
  'Suggest a city',
  'Partnership or press',
  'Something else',
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' });
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-dark min-h-screen">

        {/* Hero */}
        <div className="relative overflow-hidden pt-28 pb-14 border-b border-border bg-surface">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-accent/6 blur-3xl" />
          </div>
          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Get in Touch</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-primary-text">Contact Us</h1>
            <p className="mt-3 text-muted text-base">We read every message and reply within 1–2 business days.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-5 bg-surface border border-border rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-3">
                <Mail size={18} className="text-accent" />
              </div>
              <h3 className="font-semibold text-primary-text text-sm mb-1">Email us directly</h3>
              <a href="mailto:hello@tripgenius.in" className="text-sm text-accent hover:underline">
                hello@tripgenius.in
              </a>
            </div>

            <div className="p-5 bg-surface border border-border rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-3">
                <MessageSquare size={18} className="text-accent" />
              </div>
              <h3 className="font-semibold text-primary-text text-sm mb-1">Common topics</h3>
              <ul className="space-y-1.5 mt-2">
                {['Suggest a destination', 'Report a guide error', 'Press & partnerships', 'Advertising enquiries'].map(t => (
                  <li key={t} className="text-xs text-muted">· {t}</li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-muted leading-relaxed px-1">
              TripGenius is an independent travel guide. We are not affiliated with any hotel chain, airline, or booking platform.
            </p>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {state === 'done' ? (
              <div className="p-8 bg-surface border border-border rounded-2xl text-center">
                <div className="text-4xl mb-4">✅</div>
                <h2 className="font-heading text-xl font-semibold text-primary-text mb-2">Message sent!</h2>
                <p className="text-muted text-sm">Thanks for reaching out. We&apos;ll get back to you within 1–2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 bg-surface border border-border rounded-2xl space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Your Name</label>
                    <input
                      type="text" required value={form.name} onChange={e => update('name', e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 bg-elevated border border-border rounded-xl text-sm text-primary-text placeholder:text-muted/40 focus:outline-none focus:border-accent/60 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 bg-elevated border border-border rounded-xl text-sm text-primary-text placeholder:text-muted/40 focus:outline-none focus:border-accent/60 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Subject</label>
                  <select
                    value={form.subject} onChange={e => update('subject', e.target.value)}
                    className="w-full px-4 py-3 bg-elevated border border-border rounded-xl text-sm text-primary-text focus:outline-none focus:border-accent/60 transition-all"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Message</label>
                  <textarea
                    required rows={5} value={form.message} onChange={e => update('message', e.target.value)}
                    placeholder="Tell us what's on your mind…"
                    className="w-full px-4 py-3 bg-elevated border border-border rounded-xl text-sm text-primary-text placeholder:text-muted/40 focus:outline-none focus:border-accent/60 transition-all resize-none"
                  />
                </div>

                {state === 'error' && (
                  <p className="text-red-400 text-xs">Something went wrong. Please try emailing us directly at hello@tripgenius.in</p>
                )}

                <button
                  type="submit" disabled={state === 'loading'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60"
                >
                  <Send size={14} />
                  {state === 'loading' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
