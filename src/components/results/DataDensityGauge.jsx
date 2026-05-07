import { motion } from 'framer-motion';
import { Database, TrendingUp } from 'lucide-react';
import { TOTAL_DATA_POINTS } from '../../lib/biocharKnowledgeBase';

function DensityArc({ pct, color }) {
  const r = 52;
  const circ = Math.PI * r; // half circumference (180°)
  const strokeDash = (pct / 100) * circ;

  return (
    <svg viewBox="0 0 120 70" className="w-full max-w-[180px]">
      {/* Background arc */}
      <path
        d="M 10 65 A 52 52 0 0 1 110 65"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Filled arc */}
      <motion.path
        d="M 10 65 A 52 52 0 0 1 110 65"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${circ}`}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - strokeDash }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />
      {/* Center label */}
      <text x="60" y="58" textAnchor="middle" fontSize="18" fontWeight="800" fill={color}>{pct}%</text>
    </svg>
  );
}

export default function DataDensityGauge({ result }) {
  const { dataPointsUsed, confidence, biomassStats, temperatureBracket, activatorStats } = result;

  const densityPct = Math.min(100, Math.round((dataPointsUsed / 80) * 100));
  const color = confidence === 'High' ? '#22c55e' : confidence === 'Moderate' ? '#3b82f6' : '#f59e0b';
  const confidenceLabel = { High: 'High Confidence', Moderate: 'Moderate Confidence', Indicative: 'Indicative Only' };

  const contributingSources = [
    { label: 'Biomass records', count: biomassStats.count, total: TOTAL_DATA_POINTS, color: '#22c55e' },
    { label: 'Temperature bracket', count: temperatureBracket?.count ?? 0, total: TOTAL_DATA_POINTS, color: '#f59e0b' },
    { label: 'Activator records', count: activatorStats?.count ?? 0, total: TOTAL_DATA_POINTS, color: '#a855f7' },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-4 h-4 text-blue-500" />
        <h3 className="font-space font-semibold text-base">Data Density & Confidence</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Gauge */}
        <div className="flex flex-col items-center flex-shrink-0">
          <DensityArc pct={densityPct} color={color} />
          <span className="text-xs font-bold mt-1 px-3 py-1 rounded-full border" style={{ color, borderColor: `${color}50`, background: `${color}15` }}>
            {confidenceLabel[confidence]}
          </span>
          <p className="text-[10px] text-muted-foreground mt-1">{dataPointsUsed} matching points used</p>
        </div>

        {/* Contributing Sources */}
        <div className="flex-1 space-y-3 w-full">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contributing Data Sources</p>
          {contributingSources.map(src => {
            const pct = Math.min(100, Math.round((src.count / src.total) * 100));
            return (
              <div key={src.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{src.label}</span>
                  <span className="font-bold" style={{ color: src.color }}>{src.count.toLocaleString()} records</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: src.color }}
                  />
                </div>
              </div>
            );
          })}

          <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-muted/50 mt-2">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <p className="text-[10px] text-muted-foreground">
              Higher data density = narrower confidence interval and more reliable estimate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}