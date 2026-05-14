// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Database, TrendingUp } from 'lucide-react';
import { PEAK_RECORDS, TOTAL_DATA_POINTS, TOTAL_EXPERIMENTS } from '../../lib/biocharKnowledgeBase';

const ACTIVATOR_LABELS = {
  Non: 'None', CO2: 'CO₂', LiCl: 'LiCl',
  K2CO3: 'K₂CO₃', 'KOH-CO2': 'KOH+CO₂', KOH: 'KOH',
};

export default function HeroSection() {
  const topRecords = useMemo(() => {
    const sorted = [...PEAK_RECORDS].sort((a, b) => b.co2Uptake - a.co2Uptake);
    return sorted.slice(0, 12);
  }, []);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % topRecords.length), 3000);
    return () => clearInterval(t);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">BioPredict AI v1.7 · Triple-Phase Hub · ML Predictor</span>
            </div>

            <h1 className="font-space font-bold text-white leading-tight">
              <span className="text-4xl lg:text-5xl block">The Global</span>
              <span className="text-4xl lg:text-5xl block text-green-400">Biochar</span>
              <span className="text-4xl lg:text-5xl block">Intelligence Platform</span>
            </h1>

            <p className="mt-4 text-blue-100/70 text-base leading-relaxed max-w-lg">
              Data-driven insights from {TOTAL_DATA_POINTS.toLocaleString()} experimental records. Predict biochar performance instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 mb-8">
              <Link
                to="/database"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg gradient-green text-white font-semibold text-sm glow-green hover:scale-105 transition-all"
              >
                <Database className="w-4 h-4" />
                Explore Data
              </Link>
              <Link
                to="/predictor"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg gradient-blue text-white font-semibold text-sm glow-blue hover:scale-105 transition-all"
              >
                <Zap className="w-4 h-4" />
                CO₂ Estimator
              </Link>
            </div>

            {/* 3 Stat Badges */}
            <div className="grid grid-cols-3 gap-3 max-w-sm">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                <p className="text-green-400 text-lg font-bold font-space">{TOTAL_DATA_POINTS.toLocaleString()}</p>
                <p className="text-xs text-green-400/70 mt-0.5">Records</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
                <p className="text-blue-300 text-lg font-bold font-space">{TOTAL_EXPERIMENTS.toLocaleString()}</p>
                <p className="text-xs text-blue-300/70 mt-0.5">Experiments</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
                <p className="text-purple-300 text-lg font-bold font-space">{avgCO2}</p>
                <p className="text-xs text-purple-300/70 mt-0.5">Avg CO₂</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - floating card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:block"
          >
            <div className="glass-dark rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-sm font-medium">Top Performers · Live</span>
                <span className="flex items-center gap-1.5 text-green-400 text-xs">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  DB-Driven · {PEAK_RECORDS.length} records
                </span>
              </div>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                {[
                  { label: 'Feedstock', value: rec.biomass, color: 'text-green-300' },
                  { label: 'Pyrolysis Temp', value: `${rec.pyroTemp}°C`, color: 'text-blue-300' },
                  { label: 'Activator', value: ACTIVATOR_LABELS[rec.activator] ?? rec.activator, color: 'text-amber-300' },
                  { label: 'BET Surface Area', value: rec.surfaceArea ? `${rec.surfaceArea.toLocaleString(undefined, { maximumFractionDigits: 0 })} m²/g` : '—', color: 'text-purple-300' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <span className="text-white/50 text-sm">{item.label}</span>
                    <span className={`${item.color} text-sm font-semibold`}>{item.value}</span>
                  </div>
                ))}
                <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                  <p className="text-green-400/70 text-xs mb-1">Peak CO₂ Adsorption (recorded)</p>
                  <p className="text-green-300 text-3xl font-bold font-space">{rec.co2Uptake.toFixed(2)}</p>
                  <p className="text-green-400/60 text-xs mt-1">mmol/g · at {rec.adsorpTemp}°C adsorption</p>
                </div>
              </motion.div>
              <p className="text-[10px] text-slate-600 mt-3 text-center">
                Cycling top-{topRecords.length} records · {idx + 1}/{topRecords.length}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}