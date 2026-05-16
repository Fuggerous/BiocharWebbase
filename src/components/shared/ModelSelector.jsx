// @ts-nocheck
import { CheckCircle2, AlertTriangle, Lock, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ModelSelector — card-based radio group for choosing a prediction model.
 * Props:
 *   models   : model objects from modelRegistry.js
 *   selected : currently selected model id (string)
 *   onChange : (id: string) => void
 *
 * Models with needsExport:true are shown with a lock badge but are still selectable —
 * the results page handles the null-prediction case gracefully.
 */
export default function ModelSelector({ models, selected, onChange }) {
  return (
    <div className="space-y-2.5">
      {models.map((m, i) => {
        const isSelected   = selected === m.id;
        const needsExport  = m.needsExport === true;

        return (
          <motion.button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`w-full text-left rounded-2xl border p-4 transition-all ${
              needsExport
                ? 'border-dashed opacity-80 hover:opacity-100'
                : isSelected
                  ? 'ring-2 shadow-sm'
                  : 'border-border bg-muted/30 hover:border-border/80 hover:bg-muted/50'
            }`}
            style={isSelected && !needsExport ? {
              borderColor: m.color,
              '--tw-ring-color': m.color + '50',
              background: m.color + '08',
            } : needsExport ? {
              borderColor: m.color + '60',
              background: m.color + '05',
            } : {}}
          >
            <div className="flex items-start gap-3">
              {/* Radio / Lock indicator */}
              {needsExport ? (
                <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-dashed flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: m.color + '80' }}>
                  <Lock className="w-2 h-2" style={{ color: m.color }} />
                </div>
              ) : (
                <div className="mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                  style={isSelected
                    ? { borderColor: m.color, backgroundColor: m.color }
                    : { borderColor: '#d1d5db' }}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-space font-bold text-sm" style={{ color: isSelected || needsExport ? m.color : undefined }}>
                    {m.name}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${m.tagStyle}`}>
                    {m.tag}
                  </span>
                  {m.r2 !== null && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      R²={m.r2}
                    </span>
                  )}
                  {needsExport && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      <Lock className="w-2.5 h-2.5" /> Export Required
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{m.desc}</p>

                {/* Export instruction */}
                {needsExport && (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600 bg-slate-100 rounded-lg px-2 py-1.5 mb-2">
                    <Terminal className="w-3 h-3 flex-shrink-0" />
                    <code className="font-mono">python ML/ml_export_additional_models.py</code>
                  </div>
                )}

                {/* Pro / Con */}
                <div className="flex gap-3 flex-wrap text-[10px]">
                  <span className="flex items-center gap-1 text-green-700">
                    <CheckCircle2 className="w-3 h-3" /> {m.pro}
                  </span>
                  <span className="flex items-center gap-1 text-amber-700">
                    <AlertTriangle className="w-3 h-3" /> {m.con}
                  </span>
                </div>
              </div>

              {/* Selected checkmark */}
              {isSelected && !needsExport && (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: m.color }} />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
