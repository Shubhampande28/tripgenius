import { Variants } from 'framer-motion';

export const EASE   = [0.22, 1, 0.36, 1] as const;
export const SPRING = { type: 'spring', stiffness: 260, damping: 28 } as const;

export const VIEWPORT = { once: true, margin: '-60px' } as const;

/** Card reveal — scale + fade + rise */
export const cardReveal: Variants = {
  hidden:  { opacity: 0, y: 36, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: EASE },
  },
};

/** Stagger container — triggers children one after another */
export const listContainer = (stagger = 0.08): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
});

/** Row reveal — slides in from left, faster */
export const rowReveal: Variants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
};

/** Header fade up */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// Legacy aliases
export const stagger = listContainer;
export const slideLeft = rowReveal;
export const popIn = cardReveal;
