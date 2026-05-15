// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../lib/LanguageContext';

const SECTIONS = [
  { id: 'section-hero',         labelKey: 'navdots.hero' },
  { id: 'section-intro',        labelKey: 'navdots.intro' },
  { id: 'section-chemical',     labelKey: 'navdots.chemical' },
  { id: 'section-knowledge',    labelKey: 'navdots.knowledge' },
  { id: 'section-society',      labelKey: 'navdots.society' },
  { id: 'section-triplephase',  labelKey: 'navdots.triple' },
  { id: 'section-heatmap',      labelKey: 'navdots.heatmap' },
];

export default function SectionNavDots() {
  const { t } = useLang();
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const observers = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 hidden lg:flex">
      {SECTIONS.map(({ id, labelKey }) => {
        const label = t(labelKey);
        const isActive = activeId === id;
        const isHovered = hoveredId === id;

        return (
          <div
            key={id}
            className="relative flex items-center justify-end gap-2"
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Tooltip label */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-7 whitespace-nowrap bg-background/95 backdrop-blur-sm border border-border text-foreground text-xs font-medium px-2.5 py-1 rounded-lg shadow-lg pointer-events-none"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Dot */}
            <button
              onClick={() => scrollTo(id)}
              aria-label={`Go to ${label}`}
              className="relative w-2 h-2 rounded-full transition-all duration-300 focus:outline-none"
            >
              {/* Outer ring for active */}
              {isActive && (
                <motion.span
                  layoutId="activeRing"
                  className="absolute inset-[-4px] rounded-full border border-green-400/50"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`block w-full h-full rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-green-400/80 scale-100'
                    : isHovered
                    ? 'bg-green-300/70 scale-90'
                    : 'bg-muted-foreground/25'
                }`}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
