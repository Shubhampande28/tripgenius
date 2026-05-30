'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { City } from '@/lib/types';
import { getCityFaqs } from '@/lib/cityFaqs';

export default function CityFAQ({ city }: { city: City }) {
  const faqs = getCityFaqs(city.slug);
  const [open, setOpen] = useState<number | null>(0);

  if (!faqs.length) return null;

  return (
    <section id="faq" className="py-16 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={14} className="text-accent" />
            <p className="text-xs font-bold uppercase tracking-widest text-accent">FAQ</p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
            Frequently Asked Questions about {city.name}
          </h2>
          <p className="mt-2 text-muted text-sm">
            Common questions from travellers planning a trip to {city.name}.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`border rounded-xl overflow-hidden transition-colors duration-200 ${
                  isOpen ? 'border-accent/30 bg-surface' : 'border-border bg-surface/50'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-primary-text text-sm leading-snug pr-2">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`flex-shrink-0 text-muted transition-transform duration-300 mt-0.5 ${isOpen ? 'rotate-180 text-accent' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 border-t border-border/50">
                        <p className="text-sm text-muted leading-relaxed pt-4">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
