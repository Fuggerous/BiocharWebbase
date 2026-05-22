// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Database, Leaf, ArrowRight, FlaskConical, BarChart3, Layers, Sparkles } from 'lucide-react';
import { PEAK_RECORDS, TOTAL_DATA_POINTS, TOTAL_EXPERIMENTS } from '../../lib/biocharKnowledgeBase';
import { useTranslation } from 'react-i18next';

const ACTIVATOR_LABELS = {
  Non: 'activation.none', CO2: 'CO₂', LiCl: 'LiCl',
  K2CO3: 'K₂CO₃', 'KOH-CO2': 'KOH+CO₂', KOH: 'KOH',
};

const TOOL_PILLS = [
  { icon: FlaskConical, label: 'Property Estimator', color: 'bg-amber-100 border-amber-300 text-amber-700', dot: 'bg-amber-500' },
  { icon: BarChart3,   label: 'CO₂ Predictor',      color: 'bg-green-100 border-green-300 text-green-700',  dot: 'bg-green-500' },
  { icon: Layers,      label: 'Material Advisor',    color: 'bg-violet-100 border-violet-300 text-violet-700', dot: 'bg-violet-500' },
];

export default function HeroSection() {
  const { t } = useTranslation();

  const topRecords = useMemo(() => {
    const sorted = [...PEAK_RECORDS].sort((a, b) => b.co2Uptake - a.co2Uptake);
    return sorted.slice(0, 12);
  }, []);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % topRecords.length), 3000);
    return () => clearInterval(timer);
  }, [topRecords.length]);

  const rec = topRecords[idx] ?? topRecords[0];

  const avgCO2 = useMemo(() => {
    const valid = topRecords.filter(r => Number.isFinite(r.co2Uptake));
    const sum = valid.reduce((a, b) => a + b.co2Uptake, 0);
    return (sum / valid.length).toFixed(2);
  }, [topRecords]);

  return (
    <section className="relative gradient-hero py-20 lg:py-28 flex items-center overflow-hidden">
      {/* Background animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-3xl" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* ── Left column ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-green-300 dark:border-green-800/60 shadow-sm shadow-green-100 dark:shadow-green-900/20 mb-7"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="text-green-700 text-sm font-semibold">{t('hero.badge')}</span>
            </motion.div>

            {/* Heading */}
            <h1 className="font-space font-black text-foreground leading-tight mb-5">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-4xl lg:text-6xl block"
              >
                {t('hero.heading1')}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 }}
                className="text-4xl lg:text-6xl block"
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #059669 50%, #0d9488 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t('hero.heading2')}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.29 }}
                className="text-4xl lg:text-6xl block"
              >
                {t('hero.heading3')}
              </motion.span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-lg mb-8"
            >
              {t('hero.desc').replace('{count}', TOTAL_DATA_POINTS.toLocaleString())}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <Link
                to="/database"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-space font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-200"
                style={{ background: 'linear-gradient(135deg, #16a34a, #059669)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}
              >
                <Database className="w-4 h-4" />
                {t('hero.exploreData')}
                <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/predictor"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-space font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-200"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 4px 20px rgba(59,130,246,0.3)' }}
              >
                <Zap className="w-4 h-4" />
                {t('hero.co2Estimator')}
                <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Stat badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-3 max-w-sm"
            >
              {[
                { val: TOTAL_DATA_POINTS.toLocaleString(), label: t('hero.records'),     bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700', sub: 'text-green-600' },
                { val: TOTAL_EXPERIMENTS.toLocaleString(), label: t('hero.experiments'), bg: 'bg-sky-50',    border: 'border-sky-200',   text: 'text-sky-700',   sub: 'text-sky-600' },
                { val: avgCO2,                             label: t('hero.avgCO2'),      bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', sub: 'text-violet-600' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className={`p-3 rounded-xl ${s.bg} border ${s.border} text-center shadow-sm`}
                >
                  <p className={`${s.text} text-lg font-black font-space`}>{s.val}</p>
                  <p className={`text-xs ${s.sub} mt-0.5`}>{s.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Tool pill strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {TOOL_PILLS.map(pill => (
                <span key={pill.label}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${pill.color}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${pill.dot}`} />
                  <pill.icon className="w-3 h-3" />
                  {pill.label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right column — floating card ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:block"
          >
            {/* Decorative ring behind card */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-green-100/60 via-teal-100/40 to-sky-100/60 blur-xl" />

              <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-green-200 shadow-2xl shadow-green-100/60 dark:glass-dark dark:border-white/10">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 border border-green-300 flex items-center justify-center dark:bg-green-500/10 dark:border-green-500/20">
                      <Leaf className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-slate-700 text-sm font-bold dark:text-white/60">{t('hero.topPerformers')}</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium dark:text-green-400">
                    <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
                    {t('hero.dbDriven')} · {PEAK_RECORDS.length} {t('hero.records')}
                  </span>
                </div>

                {/* Rotating record details */}
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-2.5"
                >
                  {[
                    { label: t('hero.feedstock'),     value: rec.biomass,            color: 'text-green-700 dark:text-green-400',  bg: 'bg-green-50  border-green-100 dark:bg-green-500/10 dark:border-green-500/20' },
                    { label: t('hero.pyrolysisTemp'),  value: `${rec.pyroTemp}°C`,    color: 'text-sky-700 dark:text-blue-300',    bg: 'bg-sky-50    border-sky-100 dark:bg-blue-500/10 dark:border-blue-500/20' },
                    { label: t('hero.activator'),      value: t(ACTIVATOR_LABELS[rec.activator] ?? rec.activator), color: 'text-amber-700 dark:text-amber-300',  bg: 'bg-amber-50  border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20' },
                    { label: t('hero.betSurfaceArea'), value: rec.surfaceArea ? `${rec.surfaceArea.toLocaleString(undefined, { maximumFractionDigits: 0 })} m²/g` : '—', color: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-50 border-violet-100 dark:bg-violet-500/10 dark:border-violet-500/20' },
                  ].map(item => (
                    <div key={item.label} className={`flex items-center justify-between p-3 rounded-xl border ${item.bg}`}>
                      <span className="text-slate-500 text-sm dark:text-white/40">{item.label}</span>
                      <span className={`${item.color} text-sm font-bold`}>{item.value}</span>
                    </div>
                  ))}

                  {/* Peak adsorption highlight */}
                  <div className="mt-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                    <p className="text-green-400/70 text-xs mb-1">{t('hero.peakAdsorption')}</p>
                    <p className="font-black font-space text-5xl"
                      style={{
                        background: 'linear-gradient(135deg, #16a34a, #059669)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>
                      {rec.co2Uptake.toFixed(2)}
                    </p>
                    <p className="text-green-400/60 text-xs mt-1">
                      {t('hero.peakAdsorptionMeta', { temp: rec.adsorpTemp })}
                    </p>
                  </div>
                </motion.div>

                {/* Progress strip */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden dark:bg-slate-700/70">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                      animate={{ width: `${((idx + 1) / topRecords.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 shrink-0 dark:text-slate-500">
                    {idx + 1} / {topRecords.length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
