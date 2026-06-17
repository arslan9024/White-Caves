import React, { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CommandItem {
  id: string;
  icon: string;
  label: string;
  meta: string;
}

interface DashboardCommandPaletteProps {
  isOpen: boolean;
  prefersReducedMotion: boolean;
  query: string;
  items: CommandItem[];
  onClose: () => void;
  onQueryChange: (query: string) => void;
  onRunTopResult: () => void;
  onSelectItem: (itemId: string) => void;
}

const DashboardCommandPalette: FC<DashboardCommandPaletteProps> = ({
  isOpen,
  prefersReducedMotion,
  query,
  items,
  onClose,
  onQueryChange,
  onRunTopResult,
  onSelectItem,
}) => {
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
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: 'easeOut' }}
            onClick={event => event.stopPropagation()}
          >
            <div className="dashboard-command-palette__header">
              <strong>Command palette</strong>
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
                if (event.key === 'Enter') {
                  event.preventDefault();
                  onRunTopResult();
                }
              }}
              placeholder="Search tabs or AI CRM modules"
              aria-label="Search command palette"
            />
            <div className="dashboard-command-palette__results">
              {items.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className="dashboard-command-palette__item"
                  onClick={() => onSelectItem(item.id)}
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
