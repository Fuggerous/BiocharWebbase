// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

// ── Blend complexity factor (unchanged) ──────────────────────────────────────
const BLEND_SCORE = { 'Non': 1.0, '0.5PKBC': 0.9, '0.5TKBC': 0.9, '20PKBC': 0.8, '20TKBC': 0.8 };
function blendFactor(blends = []) {
  if (!blends || blends.length === 0) return 1.0;
  return blends.reduce((s, b) => s + (BLEND_SCORE[b] ?? 0.85), 0) / blends.length;
}

// ── Statistical feasibility model ────────────────────────────────────────────
//
// Score = w1·TempEfficiency + w2·ActivatorCost + w3·ProcessTime + w4·BlendSimplicity
//
// All components normalized to [0, 1] using actual DB ranges.
// Mapped to final score [1, 10].
//
// Weights (sum = 1.0):
//   Temperature   35%  — energy is the dominant cost in industrial pyrolysis
//   Activator     35%  — chemical cost + waste handling + safety
//   Residence time 20%  — throughput / process speed
//   Blend         10%  — feedstock preparation complexity

// Component 1 — Temperature efficiency
// Actual DB range: 400°C (min) to 900°C (max)
// Lower temp = less energy = higher feasibility
const DB_TEMP_MIN = 400;
const DB_TEMP_MAX = 900;

function tempComponent(pyroTemp) {
  const norm = Math.max(0, Math.min(1, (pyroTemp - DB_TEMP_MIN) / (DB_TEMP_MAX - DB_TEMP_MIN)));
  return 1 - norm; // invert: low temp → high score
}

// Component 2 — Activator industrial cost / accessibility
// Derived from literature cost ranking:
//   None  → zero reagent cost, highest feasibility
//   CO₂   → physical, inexpensive gas, widely available
//   K₂CO₃ → moderate cost, milder than KOH
//   KOH   → effective but corrosive, requires waste neutralization
//   KOH+CO₂ → two-step combined process, higher CAPEX
//   LiCl  → rare earth salt, expensive, limited industrial use
// Ref: Cha et al. (2016) Bioresour. Technol.; Weber & Quicker (2018) Fuel
const ACTIVATOR_FEASIBILITY = {
  'Non':     1.00,
  'CO2':     0.85,
  'K2CO3':   0.60,
  'KOH':     0.50,
  'KOH-CO2': 0.30,
  'LiCl':    0.15,
  'None':    1.00, // alias
};

function activatorComponent(activator) {
  return ACTIVATOR_FEASIBILITY[activator] ?? 0.50;
}

// Component 3 — Residence time efficiency
// Actual DB range: 10 min (min) to 300 min (max)
// Shorter = faster throughput = higher feasibility
const DB_RT_MIN  = 10;
const DB_RT_MAX  = 300;
const DB_RT_MED  = 60; // median when unknown

function rtComponent(avgResidenceTime) {
  const rt   = avgResidenceTime ?? DB_RT_MED;
  const norm = Math.max(0, Math.min(1, (rt - DB_RT_MIN) / (DB_RT_MAX - DB_RT_MIN)));
  return 1 - norm; // invert: short time → high score
}

// ── Public API ────────────────────────────────────────────────────────────────
export function computeFeasibility(activator, pyroTemp, blends = [], avgResidenceTime = null) {
  const c1 = tempComponent(pyroTemp);                   // [0,1]
  const c2 = activatorComponent(activator);             // [0,1]
  const c3 = rtComponent(avgResidenceTime);             // [0,1]
  const c4 = blendFactor(blends);                       // [0,1]

  const rawScore = 0.35 * c1 + 0.35 * c2 + 0.20 * c3 + 0.10 * c4;
  const score    = 1 + rawScore * 9;                    // [0,1] → [1,10]
  return +Math.max(1, Math.min(10, score)).toFixed(1);
}

// Returns the individual component scores for display
export function computeFeasibilityBreakdown(activator, pyroTemp, blends = [], avgResidenceTime = null) {
  const c1 = tempComponent(pyroTemp);
  const c2 = activatorComponent(activator);
  const c3 = rtComponent(avgResidenceTime);
  const c4 = blendFactor(blends);
  const total = computeFeasibility(activator, pyroTemp, blends, avgResidenceTime);
  return {
    total,
    components: [
      { label: `Temperature (${pyroTemp}°C)`, score: c1, weight: 0.35, contribution: +(0.35 * c1 * 9).toFixed(2) },
      { label: `Activator (${activator === 'Non' ? 'None' : activator})`, score: c2, weight: 0.35, contribution: +(0.35 * c2 * 9).toFixed(2) },
      { label: `Residence Time (${avgResidenceTime ?? DB_RT_MED} min)`, score: c3, weight: 0.20, contribution: +(0.20 * c3 * 9).toFixed(2) },
      { label: 'Feedstock Blend', score: c4, weight: 0.10, contribution: +(0.10 * c4 * 9).toFixed(2) },
    ],
  };
}

// ── Gauge component ───────────────────────────────────────────────────────────
const TIERS = [
  { min: 7.5, label: 'High Feasibility',      color: '#22c55e', icon: CheckCircle,  bg: 'bg-green-500/10 border-green-500/20 text-green-700' },
  { min: 4.5, label: 'Moderate Feasibility',  color: '#f59e0b', icon: AlertTriangle, bg: 'bg-amber-500/10 border-amber-500/20 text-amber-700' },
  { min: 0,   label: 'Low Feasibility',       color: '#ef4444', icon: XCircle,      bg: 'bg-red-500/10 border-red-500/20 text-red-700' },
];

export default function FeasibilityGauge({ activator, pyroTemp, blends = [], avgResidenceTime = null }) {
  const [showFormula, setShowFormula] = useState(false);
  const { total: score, components } = computeFeasibilityBreakdown(activator, pyroTemp, blends, avgResidenceTime);
  const pct  = ((score - 1) / 9) * 100;
  const tier = TIERS.find(t => score >= t.min);
  const TierIcon = tier.icon;

  const R = 44, cx = 56, cy = 56;
  const arcLen = Math.PI * R;
  const fill   = (pct / 100) * arcLen;

  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-indigo-500" />
          <h3 className="font-space font-semibold text-sm">Industrial Feasibility Score</h3>
        </div>
        <span className="text-[10px] text-muted-foreground">Weighted model</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <svg width="112" height="66" viewBox="0 0 112 66">
          <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
            fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
          <motion.path
            d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
            fill="none" stroke={tier.color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${arcLen}`}
            initial={{ strokeDashoffset: arcLen }}
            animate={{ strokeDashoffset: arcLen - fill }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fontWeight="800"
            fill={tier.color} fontFamily="Space Grotesk, sans-serif">{score}</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#94a3b8">out of 10</text>
        </svg>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${tier.bg}`}>
          <TierIcon className="w-3.5 h-3.5" />
          {tier.label}
        </div>

        {/* Component breakdown */}
        <div className="w-full mt-3 space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Score Breakdown</p>
          {components.map(c => (
            <div key={c.label} className="space-y-0.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">{c.label}</span>
                <span className="font-semibold" style={{ color: c.score >= 0.7 ? '#22c55e' : c.score >= 0.4 ? '#f59e0b' : '#ef4444' }}>
                  {(c.score * 100).toFixed(0)}% <span className="text-muted-foreground font-normal">×{c.weight}</span>
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.score * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: c.score >= 0.7 ? '#22c55e' : c.score >= 0.4 ? '#f59e0b' : '#ef4444' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-1">
          <button
            onMouseEnter={() => setShowFormula(true)}
            onMouseLeave={() => setShowFormula(false)}
            onClick={() => setShowFormula(v => !v)}
            className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted/60"
          >
            <Info className="w-3 h-3 flex-shrink-0" />
            <span>How is feasibility score calculated?</span>
          </button>

          <AnimatePresence>
            {showFormula && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 mb-2 z-50 w-[300px] p-3.5 rounded-xl bg-white border border-slate-200 shadow-xl"
                onMouseEnter={() => setShowFormula(true)}
                onMouseLeave={() => setShowFormula(false)}
              >
                <p className="text-[11px] font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-500" /> Feasibility Score Formula
                </p>
                <p className="text-[10px] text-slate-600 font-mono bg-slate-50 rounded-lg px-2.5 py-2 border border-slate-100 mb-2">
                  Score = 0.35×Temp + 0.35×Activator<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.20×ResTime + 0.10×Blend
                </p>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Each component is normalized from actual DB ranges. Higher score = more feasible synthesis condition based on historical experimental records.
                </p>
                <div className="absolute bottom-[-6px] left-4 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
