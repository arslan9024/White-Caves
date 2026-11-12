import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PageTransitionProps } from './App.config';
export function PageTransition({ children }: PageTransitionProps): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    return <>{children}</>;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
