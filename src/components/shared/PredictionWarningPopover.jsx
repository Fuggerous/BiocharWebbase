import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

export default function PredictionWarningPopover({ className }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const showDelayed = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), 450);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(false);
  };

  return (
    <div className={`relative inline-block ${className || ''}`} onMouseLeave={hide}>
      <button
        onMouseEnter={showDelayed}
        onFocus={showDelayed}
        onBlur={hide}
        className="flex items-center gap-2 text-xs text-muted-foreground"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Info className="w-4 h-4 text-indigo-500" />
        <span className="font-semibold">Info</span>
      </button>

      {open && (
        <div className="absolute z-50 w-80 p-4 rounded-2xl glass-card border border-border mt-2 right-0 text-xs shadow-lg">
          <h4 className="font-space font-semibold text-sm mb-1">Note</h4>
          <p className="text-xs text-muted-foreground">
            These predictions are data-driven statistical estimates derived from peer-reviewed experimental records. They are indicative only and require laboratory validation before use in publications or production decisions.
          </p>
        </div>
      )}
    </div>
  );
}
