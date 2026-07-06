'use client';

import { motion, HTMLMotionProps, MotionValue } from 'framer-motion';
import { ReactNode } from 'react';
import { listContainer, cardReveal, rowReveal, VIEWPORT } from '@/lib/animations';

interface ListProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  /** 'card' = scale+fade+rise (grids), 'row' = slide from left (vertical lists) */
  variant?: 'card' | 'row';
}

/** Wrap any grid/list — children reveal one after another on scroll */
export function AnimateList({ children, className, stagger = 0.08, variant = 'card' }: ListProps) {
  return (
    <motion.div
      variants={listContainer(stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ItemProps {
  children: ReactNode;
  className?: string;
  variant?: 'card' | 'row';
  hover?: boolean;
}

/** Single item inside AnimateList */
export function AnimateItem({ children, className, variant = 'card', hover = false }: ItemProps) {
  const reveal = variant === 'row' ? rowReveal : cardReveal;
  return (
    <motion.div
      variants={reveal}
      whileHover={hover ? { y: -4, boxShadow: '0 20px 44px rgba(0,0,0,0.38)', transition: { duration: 0.2 } } : undefined}
      whileTap={hover ? { scale: 0.98, transition: { duration: 0.1 } } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
