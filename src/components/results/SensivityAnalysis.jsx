import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from 'recharts';
import { queryExpertGuidance } from '../../lib/biocharKnowledgeBase';

const TEMP_RANGE = [350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900];

export default function SensitivityAnalysis({ params }) {
  // Sweep temperature while holding biomass & activator constant
  const tempSweepData = useMemo(() =>
    TEMP_RANGE.map(temp => {
      const r = queryExpertGuidance({ ...params, temperature: temp });
      return { temp: `${temp}°C`, mean: +r.mean.toFixed(3), min: +r.min.toFixed(2), max: +r.max.toFixed(2) };
    }), [params.biomass, params.activator]);

  // Compare activators at current temperature
  const activatorOptions = ['Non', 'KOH', 'K2CO3', 'KOH-CO2', 'CO2', 'LiCl'];
  const activatorLabels = { Non: 'None', KOH: 'KOH', K2CO3: 'K₂CO₃', 'KOH-CO2': 'KOH+CO₂', CO2: 'CO₂', LiCl: 'LiCl' };
  const activatorData = useMemo(() =>
    activatorOptions.map(act => {
      const r = queryExpertGuidance({ ...params, activator: act });
      return { activator: activatorLabels[act], mean: +r.mean.toFixed(3), min: +r.min.toFixed(2), max: +r.max.toFixed(2), isCurrent: act === params.activator };
    }), [params.biomass, params.temperature]);

  const currentTemp = `${params.temperature}°C`;

  return (
    <div className="glass-card rounded-2xl p-5 border border-border space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Activity className="w-4 h-4 text-purple-500" />
        </div>
        <div>
          <h3 className="font-space font-semibold text-base">Sensitivity Analysis</h3>
          <p className="text-xs text-muted-foreground">How does the estimate change when you vary one parameter?</p>
        </div>
      </div>

      {/* Temperature sweep */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          CO₂ Uptake vs. Pyrolysis Temperature <span className="normal-case font-normal">(activator & biomass fixed)</span>
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={tempSweepData} margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="temp" tick={{ fontSize: 9 }} interval={1} />
            <YAxis tick={{ fontSize: 10 }} unit=" mmol/g" domain={[0, 8]} />
            <Tooltip formatter={v => [`${Number(v).toFixed(2)} mmol/g`]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <ReferenceLine x={currentTemp} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Your Temp', position: 'top', fontSize: 9, fill: '#22c55e' }} />
            <Line type="monotone" dataKey="max" stroke="#94a3b8" strokeWidth={1} dot={false} name="Max" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="mean" stroke="#22c55e" strokeWidth={2.5} dot={false} name="Mean" />
            <Line type="monotone" dataKey="min" stroke="#94a3b8" strokeWidth={1} dot={false} name="Min" strokeDasharray="3 3" />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Activator comparison */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          CO₂ Uptake vs. Activator <span className="normal-case font-normal">(temperature & biomass fixed at {params.temperature}°C)</span>
        </p>
        <div className="space-y-2.5">
          {activatorData.map(d => {
            const pct = Math.min(100, (d.mean / 8) * 100);
            return (
              <div key={d.activator} className={`space-y-1 p-2.5 rounded-xl border transition-all ${d.isCurrent ? 'bg-green-500/5 border-green-500/25' : 'border-transparent'}`}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-medium ${d.isCurrent ? 'text-green-600 font-bold' : 'text-foreground'}`}>{d.activator}</span>
                    {d.isCurrent && <span className="px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[9px] font-bold">Current</span>}
                  </div>
                  <span className="font-bold text-foreground">{d.mean.toFixed(2)} mmol/g</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: d.isCurrent ? '#22c55e' : '#94a3b8' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}