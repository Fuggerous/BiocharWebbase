// @ts-nocheck
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Info } from 'lucide-react';
import { computeHeatmapMatrix, TOTAL_DATA_POINTS } from '../../lib/biocharKnowledgeBase';
import { useLang } from '../../lib/LanguageContext';

const ACTIVATOR_LABELS = {
  Non: 'None', CO2: 'CO₂', LiCl: 'LiCl',
  K2CO3: 'K₂CO₃', 'KOH-CO2': 'KOH+CO₂', KOH: 'KOH',
};

function heatColor(t) {
  // t ∈ [0,1]: blue → green → amber → red
  if (t < 0.25) {
    const s = t / 0.25;
    return `rgb(${Math.round(59 + s * 10)},${Math.round(130 - s * 30)},${Math.round(246 - s * 100)})`;
  } else if (t < 0.5) {
    const s = (t - 0.25) / 0.25;
    return `rgb(${Math.round(69 + s * 100)},${Math.round(100 + s * 97)},${Math.round(146 - s * 120)})`;
  } else if (t < 0.75) {
    const s = (t - 0.5) / 0.25;
    return `rgb(${Math.round(169 + s * 74)},${Math.round(197 - s * 97)},${Math.round(26 - s * 10)})`;
  } else {
    const s = (t - 0.75) / 0.25;
    return `rgb(${Math.round(243 - s * 10)},${Math.round(100 - s * 50)},${Math.round(16 - s * 10)})`;
  }
}

export default function HeatmapSection() {
  const { t } = useLang();
  const [hovered, setHovered] = useState(null);

  const { matrix, activators, temps, globalMin, globalMax } = useMemo(() => {
    const { matrix, activators, temps } = computeHeatmapMatrix();
    const allVals = activators.flatMap(a => temps.map(t => matrix[a]?.[t]).filter(v => v != null));
    return {
      matrix,
      activators,
      temps,
      globalMin: allVals.length ? Math.min(...allVals) : 0,
      globalMax: allVals.length ? Math.max(...allVals) : 1,
    };
  }, []);

  const norm = v => (v - globalMin) / Math.max(0.01, globalMax - globalMin);

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">{t('heatmap.badge')}</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-4xl text-white mb-3">
            {t('heatmap.heading1')}<br />
            <span className="text-gradient-green">{t('heatmap.heading2')}</span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            {t('heatmap.desc').replace('{count}', TOTAL_DATA_POINTS.toLocaleString())}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-dark rounded-3xl border border-white/10 p-6 md:p-8"
        >
          {/* Hover info */}
          <div className="h-12 mb-4 flex items-center justify-center">
            {hovered ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-5 py-2 rounded-xl border text-sm font-semibold"
                style={{
                  background: `${heatColor(norm(hovered.value))}22`,
                  borderColor: `${heatColor(norm(hovered.value))}55`,
                  color: 'white',
                }}
              >
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: heatColor(norm(hovered.value)) }} />
                <span>
                  <span className="text-slate-300 font-normal">{ACTIVATOR_LABELS[hovered.activator] ?? hovered.activator} · {hovered.temp}°C</span>
                  {'  →  '}
                  <span className="font-bold" style={{ color: heatColor(norm(hovered.value)) }}>{hovered.value.toFixed(2)} mmol/g</span>
                  {norm(hovered.value) >= 0.85 && <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs">🔥 {t('heatmap.peakZone')}</span>}
                  {norm(hovered.value) >= 0.55 && norm(hovered.value) < 0.85 && <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs">{t('heatmap.highPerformance')}</span>}
                  {norm(hovered.value) < 0.25 && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs">{t('heatmap.lowActivity')}</span>}
                </span>
              </motion.div>
            ) : (
              <p className="text-slate-500 text-sm flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> {t('heatmap.hoverHint')}
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <div style={{ minWidth: `${120 + temps.length * 80}px` }}>
              {/* Column headers */}
              <div className="grid mb-2" style={{ gridTemplateColumns: `120px repeat(${temps.length}, 1fr)`, gap: '6px' }}>
                <div />
                {temps.map(t => (
                  <div key={t} className="text-center text-xs font-bold text-slate-300 py-1">{t}°C</div>
                ))}
              </div>

              {/* Rows */}
              <div className="space-y-1.5">
                {activators.map(act => (
                  <div key={act} className="grid items-center" style={{ gridTemplateColumns: `120px repeat(${temps.length}, 1fr)`, gap: '6px' }}>
                    <div className="text-xs font-semibold text-slate-300 text-right pr-3 py-1">
                      {ACTIVATOR_LABELS[act] ?? act}
                    </div>
                    {temps.map(t => {
                      const val = matrix[act]?.[t];
                      if (val == null) {
                        return (
                          <div key={t} className="rounded-xl flex items-center justify-center text-slate-700 text-xs" style={{ height: 52, background: 'rgba(255,255,255,0.03)' }}>
                            —
                          </div>
                        );
                      }
                      const bg = heatColor(norm(val));
                      const isHov = hovered?.activator === act && hovered?.temp === t;
                      const textLight = norm(val) > 0.55;
                      return (
                        <motion.div
                          key={t}
                          className={`relative rounded-xl cursor-pointer flex items-center justify-center font-space font-bold text-sm select-none ${textLight ? 'text-white' : 'text-slate-800'}`}
                          style={{
                            background: bg,
                            height: 52,
                            boxShadow: isHov ? `0 0 18px ${bg}88, 0 0 6px ${bg}` : 'none',
                            transform: isHov ? 'scale(1.08)' : 'scale(1)',
                            zIndex: isHov ? 10 : 1,
                            transition: 'transform 0.15s, box-shadow 0.15s',
                          }}
                          onMouseEnter={() => setHovered({ activator: act, temp: t, value: val })}
                          onMouseLeave={() => setHovered(null)}
                          whileHover={{ scale: 1.08 }}
                        >
                          {val.toFixed(1)}
                          {norm(val) >= 0.9 && <span className="absolute -top-1.5 -right-1.5 text-[10px]">🔥</span>}
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[10px] text-slate-500 shrink-0">{t('heatmap.low')} ({globalMin.toFixed(1)})</span>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{
                    background: 'linear-gradient(to right, rgb(59,130,246), rgb(34,197,94), rgb(245,158,11), rgb(239,68,68))'
                  }} />
                  <span className="text-[10px] text-slate-500 shrink-0">{t('heatmap.peak')} ({globalMax.toFixed(1)}) mmol/g</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-600 mt-4 text-center">
            {t('heatmap.footer')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
