import { useMemo, useState } from 'react';
import { DB44_RECORDS, BIOMASS_COLORS, BIOMASS_LIST } from '../../lib/database44';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ZAxis, ReferenceLine,
} from 'recharts';
import { AlertTriangle, Info } from 'lucide-react';

/**
 * Lightweight Isolation Forest–style anomaly scoring.
 * For each record, compute a multivariate z-score across key features.
 * Records with combined |z| sum above threshold are "anomalies".
 * Additionally flag structural anomalies (high BET + low CO₂, low pore vol + high CO₂).
 */
function computeAnomalyScores(records) {
  const features = ['pyroTemp', 'surfaceArea', 'poreVolume', 'co2Uptake', 'pressure'];

  // Compute mean + std for each feature
  const stats = {};
  features.forEach(f => {
    const vals = records.map(r => r[f]);
    const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
    const std = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length) || 1;
    stats[f] = { mean, std };
  });

  return records.map(r => {
    // Mahalanobis-lite: sum of squared z-scores
    const zScores = features.map(f => Math.abs((r[f] - stats[f].mean) / stats[f].std));
    const anomalyScore = zScores.reduce((s, v) => s + v * v, 0); // sum of z²

    // Structural anomaly flags
    const highSurfaceLowCO2 = r.surfaceArea > stats.surfaceArea.mean + stats.surfaceArea.std
      && r.co2Uptake < stats.co2Uptake.mean - 0.5 * stats.co2Uptake.std;

    const lowPoreHighCO2 = r.poreVolume < stats.poreVolume.mean - 0.8 * stats.poreVolume.std
      && r.co2Uptake > stats.co2Uptake.mean + stats.co2Uptake.std;

    const highTempLowSurface = r.pyroTemp > 750
      && r.surfaceArea < stats.surfaceArea.mean - 0.5 * stats.surfaceArea.std;

    const reasons = [];
    if (highSurfaceLowCO2) reasons.push('High BET Area, Low CO₂');
    if (lowPoreHighCO2) reasons.push('Low Pore Vol, High CO₂');
    if (highTempLowSurface) reasons.push('High Temp, Low BET Area');
    if (zScores[3] > 2.0) reasons.push('Extreme CO₂ outlier');

    const isAnomaly = anomalyScore > 8 || reasons.length > 0;
    const severity = anomalyScore > 14 || reasons.length >= 2 ? 'high'
      : anomalyScore > 8 || reasons.length === 1 ? 'medium' : 'none';

    return { ...r, anomalyScore: +anomalyScore.toFixed(2), isAnomaly, severity, reasons };
  });
}

const AXIS_OPTIONS = [
  { key: 'surfaceArea', label: 'BET Surface Area (m²/g)' },
  { key: 'co2Uptake',  label: 'CO₂ Uptake (mmol/g)' },
  { key: 'poreVolume', label: 'Pore Volume (m³/kg)' },
  { key: 'pyroTemp',   label: 'Pyrolysis Temp (°C)' },
  { key: 'pressure',   label: 'Pressure (atm)' },
];

const SEVERITY_STYLE = {
  high:   { dot: '#ef4444', label: '↑↑ High', badge: 'bg-red-500/10 text-red-600 border-red-400/30' },
  medium: { dot: '#f59e0b', label: '↑ Medium', badge: 'bg-amber-500/10 text-amber-600 border-amber-400/30' },
};

export default function AnomalyDetectionTab() {
  const [xAxis, setXAxis] = useState('surfaceArea');
  const [yAxis, setYAxis] = useState('co2Uptake');

  const scored = useMemo(() => computeAnomalyScores(DB44_RECORDS), []);
  const anomalies = useMemo(() => scored.filter(r => r.isAnomaly), [scored]);
  const normal = useMemo(() => scored.filter(r => !r.isAnomaly), [scored]);

  const xLabel = AXIS_OPTIONS.find(o => o.key === xAxis)?.label;
  const yLabel = AXIS_OPTIONS.find(o => o.key === yAxis)?.label;

  // Stats for reference lines
  const xMean = useMemo(() => {
    const v = DB44_RECORDS.map(r => r[xAxis]);
    return v.reduce((s, x) => s + x, 0) / v.length;
  }, [xAxis]);
  const yMean = useMemo(() => {
    const v = DB44_RECORDS.map(r => r[yAxis]);
    return v.reduce((s, y) => s + y, 0) / v.length;
  }, [yAxis]);

  const CustomDot = ({ cx, cy, payload }) => {
    if (!payload.isAnomaly) return null;
    const color = payload.severity === 'high' ? '#ef4444' : '#f59e0b';
    return (
      <g>
        <circle cx={cx} cy={cy} r={7} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={3} fill={color} />
      </g>
    );
  };

  const NormalDot = ({ cx, cy, payload }) => (
    <circle cx={cx} cy={cy} r={3} fill={BIOMASS_COLORS[payload.biomass] || '#94a3b8'} fillOpacity={0.6} />
  );

  return (
    <div className="space-y-5">
      {/* Summary banner */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/8 border border-red-400/20">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <div>
            <p className="text-xs font-bold text-red-600">{anomalies.filter(r => r.severity === 'high').length} High-severity anomalies</p>
            <p className="text-[10px] text-muted-foreground">Multivariate z² score &gt; 14 or 2+ structural flags</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/8 border border-amber-400/20">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <div>
            <p className="text-xs font-bold text-amber-600">{anomalies.filter(r => r.severity === 'medium').length} Medium-severity anomalies</p>
            <p className="text-[10px] text-muted-foreground">Structural mismatch or z² score &gt; 8</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted border border-border">
          <Info className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-bold">{normal.length} Normal records</p>
            <p className="text-[10px] text-muted-foreground">Within expected multivariate ranges</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Method: Isolation Forest–style multivariate z² scoring across 5 features (Pyro Temp, BET Area, Pore Vol, CO₂ Uptake, Pressure) + structural heuristics for unexpected feature combinations (e.g. high BET + low CO₂).
      </p>

      {/* Axis selectors */}
      <div className="flex flex-wrap gap-4">
        {[{ label: 'X-Axis', val: xAxis, set: setXAxis }, { label: 'Y-Axis', val: yAxis, set: setYAxis }].map(({ label, val, set }) => (
          <div key={label} className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
            <select value={val} onChange={e => set(e.target.value)}
              className="px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30">
              {AXIS_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Scatter plot */}
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey={xAxis} type="number" name={xLabel} tick={{ fontSize: 11 }}
            label={{ value: xLabel, position: 'insideBottom', offset: -10, fontSize: 10 }} />
          <YAxis dataKey={yAxis} type="number" name={yLabel} tick={{ fontSize: 11 }}
            label={{ value: yLabel, angle: -90, position: 'insideLeft', fontSize: 10 }} />
          <ZAxis range={[30, 30]} />
          <ReferenceLine x={xMean} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'μ', fontSize: 10, fill: '#94a3b8' }} />
          <ReferenceLine y={yMean} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'μ', fontSize: 10, fill: '#94a3b8' }} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0]?.payload;
              return (
                <div className="glass-card rounded-xl p-3 border border-border text-xs shadow-lg max-w-xs">
                  <p className="font-bold mb-1">{d.biomass} · {d.activator} · {d.pyroTemp}°C</p>
                  <p>BET: <span className="font-semibold">{d.surfaceArea?.toLocaleString()} m²/g</span></p>
                  <p>CO₂: <span className="font-semibold text-green-600">{d.co2Uptake} mmol/g</span></p>
                  <p>Pore Vol: <span className="font-semibold">{d.poreVolume?.toFixed(6)}</span></p>
                  {d.isAnomaly && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="font-bold text-amber-600">Anomaly Score: {d.anomalyScore}</p>
                      {d.reasons.map((r, i) => <p key={i} className="text-amber-600">⚠ {r}</p>)}
                    </div>
                  )}
                </div>
              );
            }}
          />
          {/* Normal points */}
          <Scatter name="Normal" data={normal.map(r => ({ ...r, [xAxis]: r[xAxis], [yAxis]: r[yAxis] }))}
            shape={<NormalDot />} legendType="circle" />
          {/* Anomalies */}
          <Scatter name="Anomaly" data={anomalies.map(r => ({ ...r, [xAxis]: r[xAxis], [yAxis]: r[yAxis] }))}
            shape={<CustomDot />} legendType="circle" />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {BIOMASS_LIST.map(b => (
          <span key={b} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: BIOMASS_COLORS[b], opacity: 0.6 }} />
            {b.split(' ')[0]}
          </span>
        ))}
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-red-500" style={{ background: 'rgba(239,68,68,0.15)' }} /> High anomaly</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-amber-500" style={{ background: 'rgba(245,158,11,0.15)' }} /> Medium anomaly</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-400 opacity-60" /> Normal · grey dashed = global mean</span>
      </div>

      {/* Anomaly detail table */}
      {anomalies.length > 0 && (
        <div>
          <h4 className="font-space font-semibold text-sm mb-2">Detected Anomalies ({anomalies.length} records)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {['#', 'Biomass', 'Activator', 'Temp', 'BET Area', 'Pore Vol', 'CO₂ Uptake', 'Score', 'Severity', 'Flags'].map(h => (
                    <th key={h} className="text-left py-2 px-2 font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {anomalies.sort((a, b) => b.anomalyScore - a.anomalyScore).map((r, i) => (
                  <tr key={r.id} className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                    <td className="py-2 px-2 font-mono text-blue-500">{String(r.id).padStart(2, '0')}</td>
                    <td className="py-2 px-2 font-medium">{r.biomass.split(' ')[0]}</td>
                    <td className="py-2 px-2">{r.activator === 'Non' ? 'None' : r.activator}</td>
                    <td className="py-2 px-2">{r.pyroTemp}°C</td>
                    <td className="py-2 px-2 font-mono">{r.surfaceArea.toLocaleString()}</td>
                    <td className="py-2 px-2 font-mono">{r.poreVolume.toFixed(6)}</td>
                    <td className="py-2 px-2">
                      <span className={`font-bold ${r.co2Uptake >= 6 ? 'text-green-600' : r.co2Uptake >= 4 ? 'text-blue-500' : 'text-amber-500'}`}>
                        {r.co2Uptake.toFixed(3)}
                      </span>
                    </td>
                    <td className="py-2 px-2 font-bold" style={{ color: r.severity === 'high' ? '#ef4444' : '#f59e0b' }}>
                      {r.anomalyScore}
                    </td>
                    <td className="py-2 px-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${SEVERITY_STYLE[r.severity]?.badge}`}>
                        {SEVERITY_STYLE[r.severity]?.label}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-muted-foreground max-w-[160px]">
                      {r.reasons.join(' · ') || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}