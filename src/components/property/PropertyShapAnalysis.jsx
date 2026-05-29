// @ts-nocheck
import { motion } from 'framer-motion';
import { Brain, Sparkles, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';

function ContributionBar({ item, maxAbs }) {
  const pct = maxAbs > 0 ? Math.max(8, (item.absValue / maxAbs) * 100) : 8;
  const isPositive = item.value >= 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs gap-3">
        <span className="font-medium text-foreground">{item.label}</span>
        <span className={`font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {item.value >= 0 ? '+' : ''}{item.value.toFixed(2)} m²/g
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: isPositive ? 'linear-gradient(90deg, #34d399, #10b981)' : 'linear-gradient(90deg, #fbbf24, #f59e0b)' }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">
        {item.share}% of total absolute attribution · reference {String(item.baseline)}
      </p>
    </div>
  );
}

export default function PropertyShapAnalysis({ analysis }) {
  if (!analysis) return null;

  const maxAbs = Math.max(...analysis.shapValues.map(v => v.absValue), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="glass-card rounded-2xl border border-border overflow-hidden"
    >
      <div className="px-5 pt-5 pb-3 border-b border-border/50 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-space font-semibold text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-500" />
            SHAP Analysis
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {analysis.modelName} · exact subset decomposition of the selected BET model
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full border text-[10px] font-semibold bg-indigo-50 text-indigo-700 border-indigo-200">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Deployed lookup surface
        </span>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-muted/40 border border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Reference</p>
            <p className="text-sm font-semibold mt-1">{analysis.baseline.toFixed(2)} m²/g</p>
            <p className="text-[10px] text-muted-foreground mt-1">Corn straw · 600°C · 60 min · no activation</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/40 border border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Prediction</p>
            <p className="text-sm font-semibold mt-1 text-emerald-600">{analysis.prediction.toFixed(2)} m²/g</p>
            <p className="text-[10px] text-muted-foreground mt-1">Selected model output</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/40 border border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Net effect</p>
            <p className={`text-sm font-semibold mt-1 ${analysis.delta >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {analysis.delta >= 0 ? '+' : ''}{analysis.delta.toFixed(2)} m²/g
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Baseline to prediction</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Feature contributions</p>
          <div className="space-y-4">
            {analysis.shapValues.map(item => (
              <ContributionBar key={item.key} item={item} maxAbs={maxAbs} />
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200">
          <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-700 leading-relaxed">
            {analysis.methodNote} {analysis.summary}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
