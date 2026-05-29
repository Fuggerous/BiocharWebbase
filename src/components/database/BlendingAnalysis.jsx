/**
 * BiocharInformaticsThailand V.1.0 – Co-Pyrolysis / Hybrid Biochar Composite Analysis
 * Blending Performance Comparison + Multi-Dimensional Blend Correlation
 */
import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList,
  ReferenceLine, ScatterChart, Scatter, ZAxis, Legend, ResponsiveContainer,
} from 'recharts';
import { BLEND_COLORS, parsePPRatio, isComposite } from '../../lib/database44';
import { Beaker, TrendingUp, Layers, Info, ToggleLeft, ToggleRight } from 'lucide-react';

// ── Blending Performance Bar Chart ─────────────────────────────────────────
function BlendPerformanceChart({ records }) {
  const [baselineToggle, setBaselineToggle] = useState(false);

  const baseMean = useMemo(() => {
    const base = records.filter(r => r.blend === 'Non' && r.co2Uptake != null);
    return base.length ? base.reduce((s, r) => s + r.co2Uptake, 0) / base.length : 0;
  }, [records]);

  const chartData = useMemo(() => {
    const groups = {};
    records.forEach(r => {
      if (r.co2Uptake == null) return;
      if (!groups[r.blend]) groups[r.blend] = [];
      groups[r.blend].push(r.co2Uptake);
    });
    return Object.entries(groups).map(([blend, vals]) => {
      const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
      const pctVsBase = (((mean - baseMean) / baseMean) * 100).toFixed(1);
      return {
        blend,
        mean: +mean.toFixed(3),
        pctVsBase: Number(pctVsBase),
        count: vals.length,
        isComposite: isComposite(blend),
      };
    }).sort((a, b) => b.mean - a.mean);
  }, [baseMean]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="glass-card rounded-xl p-3 border border-border text-xs shadow-lg space-y-1">
        <p className="font-space font-bold text-sm">{d.blend === 'Non' ? 'Base Biochar' : `Hybrid: ${d.blend}`}</p>
        <p>Mean CO₂: <span className="font-bold text-green-600">{d.mean} mmol/g</span></p>
        {d.blend !== 'Base' && (
          <p>vs Base: <span className={`font-bold ${d.pctVsBase >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {d.pctVsBase >= 0 ? '+' : ''}{d.pctVsBase}%
          </span></p>
        )}
        <p className="text-muted-foreground">n = {d.count} records</p>
        {d.isComposite && d.pctVsBase > 0 && (
          <p className="text-cyan-500 font-semibold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Synergistic Effect</p>
        )}
      </div>
    );
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
        <div>
          <h3 className="font-space font-semibold text-base flex items-center gap-2">
            <Beaker className="w-4 h-4 text-cyan-500" /> Hybrid Biochar Composite Performance
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Mean CO₂ Uptake (mmol/g) by Molding/Blend type — Co-Pyrolysis Analysis
          </p>
        </div>
        <button
          onClick={() => setBaselineToggle(t => !t)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            baselineToggle
              ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20'
              : 'bg-muted text-muted-foreground border-border'
          }`}
        >
          {baselineToggle ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          Baseline Comparison
        </button>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="blend" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} 
          label={{ value: 'CO₂ Adsorption (mmol/g)', angle: -90, position:'Left', offset: 10, fontSize: 10, fontWeight: 600 }}/>
          <Tooltip content={<CustomTooltip />} />
          {baselineToggle && (
            <ReferenceLine y={baseMean} stroke="#94a3b8" strokeDasharray="5 3" strokeWidth={2}
              label={{ value: `Base: ${baseMean.toFixed(2)} mmol/g`, position: 'insideTopRight', fontSize: 10, fill: '#94a3b8' }} />
          )}
          <Bar dataKey="mean" name="Mean CO₂ Uptake" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={BLEND_COLORS[entry.blend] || '#64748b'}
                opacity={baselineToggle && entry.blend === 'Base' ? 0.5 : 1}
              />
            ))}
            <LabelList
              content={({ x, y, width, value, index }) => {
                const d = chartData[index];
                if (!baselineToggle || d.blend === 'Non') return null;
                const pct = d.pctVsBase;
                return (
                  <text x={x + width / 2} y={y - 4} textAnchor="middle" fontSize={9} fontWeight={700}
                    fill={pct >= 0 ? '#22c55e' : '#ef4444'}>
                    {pct >= 0 ? '+' : ''}{pct}%
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Synergy summary row */}
      <div className="mt-3 flex flex-wrap gap-2">
        {chartData.filter(d => d.isComposite).map(d => (
          <div key={d.blend}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border ${
              d.pctVsBase > 0
                ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20'
                : 'bg-red-500/10 text-red-600 border-red-500/20'
            }`}>
            <span className="w-2 h-2 rounded-full" style={{ background: BLEND_COLORS[d.blend] }} />
            {d.blend}: {d.pctVsBase >= 0 ? '+' : ''}{d.pctVsBase}% vs Base
            {d.pctVsBase > 0 && <TrendingUp className="w-3 h-3" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PP Ratio vs CO2 Scatter ─────────────────────────────────────────────────
function BlendRatioCorrelation({ records }) {
  const ratioData = useMemo(() => {
    return records
      .filter(r => parsePPRatio(r.blend) !== null && r.co2Uptake != null)
      .map(r => ({ ppRatio: parsePPRatio(r.blend), co2: r.co2Uptake, blend: r.blend, biomass: r.biomass }));
  }, [records]);

  const baselineMean = useMemo(() => {
    const base = records.filter(r => r.blend === 'Non' && r.activator === 'Non' && r.co2Uptake != null);
    return base.length ? base.reduce((s, r) => s + r.co2Uptake, 0) / base.length : null;
  }, [records]);

  const avgByRatio = useMemo(() => {
    const g = {};
    ratioData.forEach(r => {
      if (!g[r.ppRatio]) g[r.ppRatio] = [];
      g[r.ppRatio].push(r.co2);
    });
    return Object.entries(g).map(([pp, vals]) => ({
      ppRatio: Number(pp),
      mean: +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(3),
    })).sort((a, b) => a.ppRatio - b.ppRatio);
  }, [ratioData, records]);

  const synergistic = baselineMean && avgByRatio.some(d => d.mean > baselineMean);

  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
        <div>
          <h3 className="font-space font-semibold text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-500" /> Blend Ratio vs CO₂ Adsorption
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Blend ratio (%) in composite vs mean CO₂ Uptake — Multi-dimensional correlation
          </p>
        </div>
        {synergistic && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-600">
            <TrendingUp className="w-3.5 h-3.5" /> Synergistic Effect Detected
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="ppRatio" type="number" name="PP%" unit="%" tick={{ fontSize: 11 }}
            label={{ value: 'Blend Ratio (%)', position: 'insideBottom', offset: -10, fontSize: 11 }}
            domain={[0, 30]} />
          <YAxis dataKey="co2" type="number" name="CO₂ Uptake" tick={{ fontSize: 11 }}
            label={{ value: 'CO₂ Uptake (mmol/g)', angle: -90, position: 'Left', fontSize: 11 }} />
          <ZAxis range={[40, 80]} />
          <Tooltip formatter={(v, n) => [typeof v === 'number' ? v.toFixed(3) : v, n]}
            content={({ active, payload }) => active && payload?.length ? (
              <div className="glass-card rounded-xl p-3 border border-border text-xs shadow-lg">
                <p className="font-bold">{payload[0]?.payload?.blend}</p>
                <p>PP%: {payload[0]?.payload?.ppRatio}%</p>
                <p>CO₂: <span className="font-bold text-purple-600">{payload[0]?.payload?.co2?.toFixed(3)} mmol/g</span></p>
                <p className="text-muted-foreground">{payload[0]?.payload?.biomass?.split(' ')[0]}</p>
              </div>
            ) : null}
          />
          {baselineMean && (
            <ReferenceLine y={baselineMean} stroke="#94a3b8" strokeDasharray="4 3"
              label={{ value: `Base avg: ${baselineMean.toFixed(2)}`, position: 'insideTopLeft', fontSize: 9, fill: '#94a3b8' }} />
          )}
          {/* Raw scatter points */}
          <Scatter name="Individual records" data={ratioData.map(r => ({ ...r, co2: r.co2 }))}
            fill="#8b5cf6" fillOpacity={0.5} />
          {/* Mean trend dots */}
          <Scatter name="Mean per ratio" data={avgByRatio.map(d => ({ ppRatio: d.ppRatio, co2: d.mean }))}
            fill="#06b6d4" fillOpacity={1} shape="diamond" />
          <Legend wrapperStyle={{ position: 'absolute', middle: 10, bottom: 10, fontSize: 11 }} />
        </ScatterChart>
      </ResponsiveContainer>

      <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded-xl p-3 border border-border">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-purple-400" />
        <span>
          Scatter shows individual isotherm records (purple). Cyan diamonds = mean CO₂ per PP% ratio.
          {baselineMean && ` Dashed line = unactivated Base biochar mean (${baselineMean.toFixed(2)} mmol/g).`}
          {synergistic ? ' Composites with higher mean than Base indicate a synergistic co-pyrolysis effect.' : ''}
        </span>
      </div>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
export default function BlendingAnalysis({ records = [] }) {
  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Beaker className="w-4 h-4 text-cyan-500" />
        </div>
        <div>
          <h2 className="font-space font-bold text-base">Co-Pyrolysis · Hybrid Biochar Composites</h2>
          <p className="text-xs text-muted-foreground">
            Blending & Co-Carbonization Analysis — PKBC, TKBC composite ratio impacts on CO₂ capture
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-600 whitespace-nowrap">
          Live · Filtered
        </div>
      </div>
      <BlendPerformanceChart records={records} />
      <BlendRatioCorrelation records={records} />
    </div>
  );
}