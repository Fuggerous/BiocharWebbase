import { useEffect } from 'react';

export default function MarkdownModal({ open, title, content, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative max-w-3xl w-full mx-4 bg-white rounded-2xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-6 py-3 border-b">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-sm text-slate-600">Close</button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-auto text-sm whitespace-pre-wrap text-slate-800">
          {content}
        </div>
      </div>
    </div>
  );
}
