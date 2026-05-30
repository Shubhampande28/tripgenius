import { Variants } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade up — use with whileInView */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Staggered container */
export const stagger = (delay = 0.07): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren: delay } },
});

/** Card hover — slight lift + scale */
export const cardHover = {
  rest:  { y: 0,  scale: 1,    boxShadow: '0 0 0 0 rgba(0,0,0,0)' },
  hover: { y: -4, scale: 1.01, boxShadow: '0 20px 40px rgba(0,0,0,0.35)', transition: { duration: 0.25, ease: EASE } },
  tap:   { y: 0,  scale: 0.98, transition: { duration: 0.12 } },
};

/** Slide in from left */
export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.5, ease: EASE } },
};

/** Pop in (scale from 0.9) */
export const popIn: Variants = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1,   transition: { duration: 0.4, ease: EASE } },
};

export const VIEWPORT = { once: true, margin: '-60px' } as const;
