// @ts-nocheck
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Cell, BarChart, LabelList } from 'recharts';
import { BIOMASS_STATS, DB_OVERALL_AVG } from '../../lib/biocharKnowledgeBase';
import { BIOMASS_COLORS } from '../../lib/database44';

const CustomCI = ({ viewBox, data }) => null;

function CIBar({ low, high, mid, label, barY, barHeight, totalWidth }) {
  return null;
}

export function ConfidenceIntervalChart({ prediction }) {
  const pred = prediction || 4.0;
  const ciData = [
    { y: '99% CI', min: pred - 1.2, max: pred + 1.2 },
    { y: '95% CI', min: pred - 0.9, max: pred + 0.9 },
    { y: '90% CI', min: pred - 0.7, max: pred + 0.7 },
  ];

  const chartData = ciData.map(d => ({
    name: d.y,
    lower: d.min,
    range: d.max - d.min,
    point: pred,
  }));

  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <h3 className="font-space font-semibold text-base mb-1">Confidence Interval Analysis</h3>
      <p className="text-xs text-muted-foreground mb-4">Uncertainty bands for the predicted CO₂ adsorption value</p>
      <div className="space-y-4">
        {ciData.map((ci, i) => {
          const totalRange = 3.5;
          const leftPct = ((ci.min - (pred - 1.5)) / totalRange) * 100;
          const widthPct = ((ci.max - ci.min) / totalRange) * 100;
          const pointPct = ((pred - (pred - 1.5)) / totalRange) * 100;
          const opacity = 0.3 + i * 0.2;
          return (
            <div key={ci.y} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">{ci.y}</span>
                <span className="text-foreground font-semibold">{ci.min.toFixed(1)} – {ci.max.toFixed(1)} mmol/g</span>
              </div>
              <div className="relative h-5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full rounded-full"
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    backgroundColor: `rgba(34,197,94,${opacity})`,
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow"
                  style={{ left: `calc(${pointPct}% - 6px)` }}
                />
              </div>
            </div>
          );
        })}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs font-semibold text-foreground">Point Estimate</span>
          <span className="text-sm font-bold text-green-500">{pred.toFixed(2)} mmol/g</span>
        </div>
      </div>
    </div>
  );
}

export function BenchmarkChart({ prediction }) {
  const pred = prediction || 4.0;
  const biomassRows = Object.entries(BIOMASS_STATS)
    .map(([name, s]) => ({
      name: name.replace(' ground-based', '').replace(' sawdust powders', ''),
      value: +s.mean.toFixed(3),
      fill: BIOMASS_COLORS[name] || '#94a3b8',
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);
  const data = [
    { name: 'Your Prediction', value: pred, fill: '#22c55e' },
    ...biomassRows,
    { name: 'DB Overall', value: +DB_OVERALL_AVG.toFixed(3), fill: '#64748b' },
  ];
  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <h3 className="font-space font-semibold text-base mb-1">Database Benchmarking</h3>
      <p className="text-xs text-muted-foreground mb-4">Your prediction vs. database averages (mmol/g)</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} unit=" mmol/g" domain={[0, Math.max(pred, 4.5) + 0.5]} />
          <Tooltip formatter={v => [`${v.toFixed(2)} mmol/g`, 'CO₂ Adsorption']} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
            <LabelList dataKey="value" position="top" formatter={v => v.toFixed(1)} style={{ fontSize: 10, fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}