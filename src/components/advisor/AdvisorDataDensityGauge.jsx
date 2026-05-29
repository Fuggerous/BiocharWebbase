import { motion } from 'framer-motion';
import { Database, TrendingUp } from 'lucide-react';
import { DB44_RECORDS } from '../../lib/database44';

function DensityArc({ pct, color }) {
  const r = 48;
  const circ = Math.PI * r;
  const strokeDash = (pct / 100) * circ;

  return (
    <svg viewBox="0 0 110 66" className="w-full max-w-[140px]">
      <path d="M 7 61 A 48 48 0 0 1 103 61" fill="none" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
      <motion.path
        d="M 7 61 A 48 48 0 0 1 103 61"
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${circ}`}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - strokeDash }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />
      <text x="55" y="54" textAnchor="middle" fontSize="17" fontWeight="800" fill={color}>{pct}%</text>
    </svg>
  );
}

export default function AdvisorDataDensityGauge({ result, targetCO2, biomass }) {
  const topResult = result?.results?.[0];
  if (!topResult) return null;

  const topActivator = topResult.activator === 'None' ? 'Non' : topResult.activator;
  const topTemp      = topResult.pyroTemp;

  // Total DB records for topResult's (activator + pyroTemp) — full pool, not tolerance-filtered
  const totalGroupRecords = DB44_RECORDS.filter(
    r => r.activator === topActivator && r.pyroTemp === topTemp && r.blend === 'Non'
  ).length || 1;

  const topCount   = topResult.count ?? 1;
  const densityPct = Math.min(100, Math.round((topCount / totalGroupRecords) * 100));

  const confidence      = densityPct >= 60 ? 'High' : densityPct >= 30 ? 'Moderate' : 'Indicative';
  const color           = confidence === 'High' ? '#22c55e' : confidence === 'Moderate' ? '#3b82f6' : '#f59e0b';
  const confidenceLabel = { High: 'High Confidence', Moderate: 'Moderate Confidence', Indicative: 'Indicative Only' };

  const totalMatchedPoints = result.results.reduce((s, r) => s + (r.count ?? 0), 0) || 1;
  const diversityPct       = Math.min(100, Math.round((result.results.length / 6) * 100));
  const topSharePct        = Math.min(100, Math.round((topCount / totalMatchedPoints) * 100));

  const bars = [
    {
      label:  'Target-condition fit',
      note:   `${topCount} / ${totalGroupRecords} pts · ${topResult.activator} ${topTemp}°C`,
      pct:    densityPct,
      color:  '#22c55e',
    },
    {
      label:  'Parameter diversity',
      note:   `${result.results.length} / 6 combos found`,
      pct:    diversityPct,
      color:  '#3b82f6',
    },
    {
      label:  'Top result share',
      note:   `${topCount} / ${totalMatchedPoints} total matched pts`,
      pct:    topSharePct,
      color:  '#a855f7',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-4 h-4 text-blue-500" />
        <h3 className="font-space font-semibold text-base">Data Density &amp; Confidence</h3>
      </div>

      {/* Gauge row — compact, centred */}
      <div className="flex items-center justify-around gap-3 mb-5">
        <div className="flex flex-col items-center">
          <DensityArc pct={densityPct} color={color} />
          <span
            className="text-[11px] font-bold mt-1 px-3 py-0.5 rounded-full border"
            style={{ color, borderColor: `${color}50`, background: `${color}15` }}
          >
            {confidenceLabel[confidence]}
          </span>
        </div>

        {/* Quick stats beside gauge */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">{topCount}</span> pts within ±{result.tolerance} mmol/g
          </div>
          <div>
            <span className="font-semibold text-foreground">{result.results.length}</span> param set{result.results.length !== 1 ? 's' : ''} found
          </div>
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border w-fit ${
            result.mode === 'match'
              ? 'bg-green-500/10 border-green-500/20 text-green-600'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
          }`}>
            {result.mode === 'match' ? 'Exact match' : 'Nearest only'}
          </div>
        </div>
      </div>

      {/* Bars — full width below */}
      <div className="space-y-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Match Quality Breakdown</p>
        {bars.map(src => (
          <div key={src.label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">{src.label}</span>
              <span className="font-bold tabular-nums" style={{ color: src.color }}>{src.pct}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${src.pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: src.color }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{src.note}</p>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-muted/50 mt-4">
        <TrendingUp className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Higher target-condition fit means this activator reliably produces your target CO₂ uptake.
        </p>
      </div>
    </div>
  );
}
