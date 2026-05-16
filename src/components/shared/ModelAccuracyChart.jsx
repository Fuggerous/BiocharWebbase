// @ts-nocheck
import { motion } from 'framer-motion';
import { FlaskConical, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList, ReferenceLine,
} from 'recharts';

/**
 * ModelAccuracyChart — shows full training comparison (all models).
 * Deployed models are color-highlighted; others are grey.
 *
 * Props:
 *   data         : { name, r2, deployed, fill }[]   (from SA_COMPARISON / CO2_COMPARISON)
 *   title        : string
 *   subtitle     : string
 *   note         : string  (optional bottom note, e.g. pore volume exclusion)
 *   xLabel       : string  e.g. "R²"
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card rounded-xl p-3 border border-border shadow-lg text-xs">
      <p className="font-space font-bold text-sm mb-1">{d.name}</p>
      <p><span className="text-muted-foreground">R²: </span><span className="font-bold text-foreground">{(d.r2 * 100).toFixed(1)}%</span></p>
      {d.deployed
        ? <p className="text-green-600 font-semibold mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Deployed on platform</p>
        : <p className="text-muted-foreground mt-1">Trained · not yet deployed</p>
      }
    </div>
  );
}

export default function ModelAccuracyChart({ data = [], title, subtitle, note, xLabel = 'R² Score' }) {
  if (!data.length) return null;

  const sorted = [...data].sort((a, b) => b.r2 - a.r2);
  const chartHeight = Math.max(180, sorted.length * 46);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="glass-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-border/50 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-space font-semibold text-base flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-indigo-500" />
            {title}
          </h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3 text-[10px] flex-wrap">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <span className="w-3 h-3 rounded-sm bg-purple-500 inline-block" /> Deployed on platform
          </span>
          <span className="flex items-center gap-1 font-semibold text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" /> Trained · not deployed
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> In Development
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pt-5 pb-2">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            layout="vertical"
            data={sorted}
            margin={{ top: 0, right: 56, left: 12, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 1]}
              tick={{ fontSize: 10 }}
              tickFormatter={v => `${(v * 100).toFixed(0)}%`}
              label={{ value: xLabel, position: 'insideBottom', offset: -12, fontSize: 11, fill: '#6b7280' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fontWeight: 600 }}
              width={88}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <ReferenceLine
              x={0.7}
              stroke="#22c55e"
              strokeDasharray="5 3"
              label={{ value: 'Good (70%)', position: 'top', fontSize: 9, fill: '#22c55e', fontWeight: 600 }}
            />
            <Bar dataKey="r2" name="R²" radius={[0, 5, 5, 0]} barSize={24} maxBarSize={28}>
              {sorted.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={entry.deployed ? entry.fill : '#94a3b8'}
                  opacity={entry.deployed ? 1 : 0.65}
                />
              ))}
              <LabelList
                dataKey="r2"
                position="right"
                formatter={v => `${(v * 100).toFixed(1)}%`}
                style={{ fontSize: 10, fontWeight: 700, fill: '#374151' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Note */}
      {note && (
        <div className="mx-5 mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-[10px] text-amber-700">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          {note}
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-5 pb-5">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
          <div className="text-[10px] text-slate-600 leading-relaxed space-y-1">
            <p>
              <strong>All ML models are under active development.</strong> R² values are from cross-validated test splits.
              Training set is limited (~58–300 samples) — generalisation outside the training distribution is not guaranteed.
            </p>
            <p>
              <strong className="text-slate-700">Grey bars</strong> = trained in Python, prediction grid not yet exported.
              <strong className="text-slate-700"> Always cross-reference with DB Statistical Lookup</strong> before making production decisions.
            </p>
            <p>
              <strong className="text-slate-700">Ridge*</strong> = deployed model evaluated with LOO-CV on PEAK_RECORDS (58 samples, 17-feature one-hot input).
              Other grey Ridge bar in comparison uses Strategy-B test-set evaluation — different feature set and evaluation protocol, not directly comparable.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
