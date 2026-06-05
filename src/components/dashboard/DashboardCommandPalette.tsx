import React, { FC, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface CommandPaletteItemData {
  id: string;
  icon: string;
  label: string;
  meta: string;
}

interface DashboardCommandPaletteProps {
  isOpen: boolean;
  query: string;
  items: CommandPaletteItemData[];
  prefersReducedMotion: boolean;
  onClose: () => void;
  onQueryChange: (value: string) => void;
  onEnter: (activeIndex: number) => void;
  onSelect: (item: CommandPaletteItemData) => void;
}

const DashboardCommandPalette: FC<DashboardCommandPaletteProps> = ({
  isOpen,
  query,
  items,
  prefersReducedMotion,
  onClose,
  onQueryChange,
  onEnter,
  onSelect,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(0);
      return;
    }

    if (items.length === 0) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex(current => Math.min(current, items.length - 1));
  }, [isOpen, items]);

  useEffect(() => {
    if (!isOpen || items.length === 0) return;
    itemRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen, items.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dashboard-command-palette-backdrop"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          exit={prefersReducedMotion ? {} : { opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="dashboard-command-palette"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-command-palette-title"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: 'easeOut' }}
            onClick={event => event.stopPropagation()}
          >
            <div className="dashboard-command-palette__header">
              <strong id="dashboard-command-palette-title">Command palette</strong>
              <button type="button" onClick={onClose}>
                Esc
              </button>
            </div>
            <input
              autoFocus
              type="search"
              value={query}
              onChange={event => onQueryChange(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  setActiveIndex(current => (current >= items.length - 1 ? 0 : current + 1));
                  return;
                }

                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  setActiveIndex(current => (current <= 0 ? items.length - 1 : current - 1));
                  return;
                }

                if (event.key === 'Home') {
                  event.preventDefault();
                  setActiveIndex(0);
                  return;
                }

                if (event.key === 'End') {
                  event.preventDefault();
                  setActiveIndex(items.length - 1);
                  return;
                }

                if (event.key === 'Enter') {
                  event.preventDefault();
                  onEnter(activeIndex);
                }
              }}
              placeholder="Search tabs or AI CRM modules"
              aria-label="Search command palette"
            />
            <div className="dashboard-command-palette__results">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  ref={element => {
                    itemRefs.current[index] = element;
                  }}
                  type="button"
                  className={`dashboard-command-palette__item${index === activeIndex ? ' dashboard-command-palette__item--active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => onSelect(item)}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span className="dashboard-command-palette__copy">
                    <strong>{item.label}</strong>
                    <small>{item.meta}</small>
                  </span>
                </button>
              ))}
              {items.length === 0 && (
                <div className="dashboard-command-palette__empty">No matching tabs or modules.</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardCommandPalette;
