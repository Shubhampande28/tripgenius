'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function EmailWaitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 800));
    setStatus('success');
  };

  return (
    <section className="py-24 lg:py-32 bg-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(255,107,53,0.07),transparent)]" />

      {/* Decorative rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-border/30 opacity-40" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-border/30 opacity-40" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-xs font-medium text-muted mb-8">
            <Sparkles size={12} className="text-accent" />
            Early Access — Limited Spots
          </div>

          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary-text">
            Be the First to{' '}
            <span className="gradient-text-accent">Explore</span>
          </h2>
          <p className="mt-5 text-muted leading-relaxed max-w-lg mx-auto">
            Join the TripGenius newsletter — new city guides, hidden gems, and exclusive
            hotel deals delivered straight to your inbox. Free, always.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10"
        >
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-teal" />
              </div>
              <div>
                <p className="font-heading text-2xl font-semibold text-primary-text">
                  You&apos;re on the list!
                </p>
                <p className="text-muted text-sm mt-1">
                  We&apos;ll send your early access invite to{' '}
                  <span className="text-accent">{email}</span> soon.
                </p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-xl text-primary-text placeholder:text-muted/60 focus:outline-none focus:border-accent transition-colors text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap"
              >
                {status === 'loading' ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Get Early Access <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-muted/60">
            No spam, ever. Unsubscribe anytime. We respect your inbox.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex items-center justify-center gap-8 text-center"
        >
          {[
            { value: '2,400+', label: 'Early members' },
            { value: 'Free', label: 'Always' },
            { value: 'Q3 2026', label: 'Launch target' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="font-heading text-2xl font-semibold text-primary-text">{value}</div>
              <div className="text-xs text-muted mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
