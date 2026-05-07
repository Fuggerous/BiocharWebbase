import { motion } from 'framer-motion';
import { Gauge, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

// Blend feasibility factor: common single-species = 1.0, exotic multi = lower
function blendFactor(blends = []) {
  if (!blends || blends.length === 0) return 1.0;
  const avg = blends.reduce((s, b) => {
    if (!b || b === 'Pure' || b === 'Corn straw' || b === 'Coffee grounds' || b === 'Pine sawdust') return s + 1.0;
    const parts = b.split('/').length;
    return s + (parts >= 3 ? 0.7 : parts === 2 ? 0.85 : 1.0);
  }, 0) / blends.length;
  return avg;
}

export function computeFeasibility(activator, pyroTemp, blends = [], avgResidenceTime = null) {
  let score = 7; // base

  // Temperature effect
  if (pyroTemp <= 500) score += 2;
  else if (pyroTemp <= 650) score += 1;
  else if (pyroTemp >= 800) score -= 2;
  else if (pyroTemp >= 750) score -= 1;

  // Activator effect
  if (activator === 'CO2') score += 1.5;
  else if (activator === 'None') score += 1;
  else if (activator === 'K2CO3') score -= 0.5;
  else if (activator === 'KOH') score -= 1;
  else if (activator === 'KOH-CO2') score -= 1.5;
  else if (activator === 'LiCl') score -= 2;

  // Blend feedstock complexity
  const bf = blendFactor(blends);
  if (bf >= 1.0) score += 0.5;
  else if (bf < 0.75) score -= 1;
  else if (bf < 0.9) score -= 0.5;

  // Residence time effect
  if (avgResidenceTime !== null) {
    if (avgResidenceTime <= 30) score += 0.5;
    else if (avgResidenceTime <= 60) score += 0.2;
    else if (avgResidenceTime >= 150) score -= 0.8;
    else if (avgResidenceTime >= 100) score -= 0.4;
  }

  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
}

const TIERS = [
  { min: 8, label: 'High Feasibility', color: '#22c55e', icon: CheckCircle, bg: 'bg-green-500/10 border-green-500/20 text-green-700' },
  { min: 5, label: 'Moderate Feasibility', color: '#f59e0b', icon: AlertTriangle, bg: 'bg-amber-500/10 border-amber-500/20 text-amber-700' },
  { min: 0, label: 'Low Feasibility', color: '#ef4444', icon: XCircle, bg: 'bg-red-500/10 border-red-500/20 text-red-700' },
];

export default function FeasibilityGauge({ activator, pyroTemp, blends = [], avgResidenceTime = null }) {
  const score = computeFeasibility(activator, pyroTemp, blends, avgResidenceTime);
  const pct = ((score - 1) / 9) * 100;
  const tier = TIERS.find(t => score >= t.min);
  const TierIcon = tier.icon;
  const bf = blendFactor(blends);

  const R = 44, cx = 56, cy = 56;
  const arcLen = Math.PI * R;
  const fill = (pct / 100) * arcLen;

  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="w-4 h-4 text-indigo-500" />
        <h3 className="font-space font-semibold text-sm">Industrial Feasibility Score</h3>
      </div>

      <div className="flex flex-col items-center gap-2">
        <svg width="112" height="66" viewBox="0 0 112 66">
          <path
            d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
            fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round"
          />
          <motion.path
            d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
            fill="none"
            stroke={tier.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${arcLen}`}
            initial={{ strokeDashoffset: arcLen }}
            animate={{ strokeDashoffset: arcLen - fill }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fontWeight="800" fill={tier.color} fontFamily="Space Grotesk, sans-serif">
            {score.toFixed(1)}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#94a3b8">out of 10</text>
        </svg>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${tier.bg}`}>
          <TierIcon className="w-3.5 h-3.5" />
          {tier.label}
        </div>

        <div className="w-full space-y-1 mt-2 text-[11px] text-muted-foreground">
          <div className="flex justify-between">
            <span>Temperature ({pyroTemp}°C)</span>
            <span className={pyroTemp <= 600 ? 'text-green-600 font-semibold' : pyroTemp >= 800 ? 'text-red-500 font-semibold' : 'text-amber-500'}>
              {pyroTemp <= 500 ? '↑ Low energy' : pyroTemp <= 650 ? '↑ Moderate' : pyroTemp >= 800 ? '↓ High energy' : '~ Moderate-high'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Activator ({activator === 'None' ? 'None' : activator})</span>
            <span className={['CO2', 'None'].includes(activator) ? 'text-green-600 font-semibold' : ['LiCl', 'KOH-CO2'].includes(activator) ? 'text-red-500 font-semibold' : 'text-amber-500'}>
              {activator === 'CO2' ? '↑ Physical (cheap)' : activator === 'None' ? '↑ No reagent' : activator === 'LiCl' ? '↓ Exotic/costly' : activator === 'KOH-CO2' ? '↓ Combined' : '~ Chemical cost'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Feedstock blend</span>
            <span className={bf >= 1.0 ? 'text-green-600 font-semibold' : bf < 0.75 ? 'text-red-500 font-semibold' : 'text-amber-500'}>
              {bf >= 1.0 ? '↑ Single-species' : bf < 0.75 ? '↓ Complex blend' : '~ Dual blend'}
            </span>
          </div>
          {avgResidenceTime !== null && (
            <div className="flex justify-between">
              <span>Residence time (~{avgResidenceTime} min)</span>
              <span className={avgResidenceTime <= 60 ? 'text-green-600 font-semibold' : avgResidenceTime >= 150 ? 'text-red-500 font-semibold' : 'text-amber-500'}>
                {avgResidenceTime <= 30 ? '↑ Fast' : avgResidenceTime <= 60 ? '↑ Efficient' : avgResidenceTime >= 150 ? '↓ Long process' : '~ Moderate'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}