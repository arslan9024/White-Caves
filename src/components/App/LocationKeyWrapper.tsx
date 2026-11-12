import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransitionProps } from './App.config';
import { PageTransition } from './PageTransition';
export function LocationKeyWrapper({ children }: PageTransitionProps): React.JSX.Element {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>{children}</PageTransition>
    </AnimatePresence>
  );
}
