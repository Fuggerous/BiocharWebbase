// @ts-nocheck
/**
 * DatabaseInsights — replaces the fake ResearchNewsFeed.
 * Shows real computed findings from the 44Database.
 */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, FlaskConical, Database, ArrowRight, Zap } from 'lucide-react';
import {
  BIOMASS_STATS, ACTIVATOR_STATS, TEMPERATURE_STATS,
  DB_OVERALL_AVG, DB_OVERALL_MAX, TOTAL_DATA_POINTS, TOTAL_EXPERIMENTS,
} from '../../lib/biocharKnowledgeBase';
import { useLang } from '../../lib/LanguageContext';

// Compute real insights from database at module load
const topBiomass = Object.entries(BIOMASS_STATS)
  .sort((a, b) => b[1].mean - a[1].mean)[0];

const topActivator = Object.entries(ACTIVATOR_STATS)
  .filter(([k]) => k !== 'Non')
  .sort((a, b) => b[1].mean - a[1].mean)[0];

const topTemp = Object.entries(TEMPERATURE_STATS)
  .sort((a, b) => b[1].mean - a[1].mean)[0];

const INSIGHTS = [
  {
    icon: TrendingUp,
    color: '#22c55e',
    labelKey: 'research.topBiomass',
    value: topBiomass[0].replace(' ground-based','').replace(' powders',''),
    detail: `Mean CO₂ uptake ${topBiomass[1].mean.toFixed(2)} mmol/g across ${topBiomass[1].count} records`,
    sub: `Best recorded: ${topBiomass[1].max.toFixed(2)} mmol/g`,
  },
  {
    icon: FlaskConical,
    color: '#3b82f6',
    labelKey: 'research.mostActivator',
    value: topActivator[0],
    detail: `${topActivator[1].label} — DB mean ${topActivator[1].mean.toFixed(2)} mmol/g`,
    sub: `Across ${topActivator[1].count} experimental records`,
  },
  {
    icon: Flame,
    color: '#f59e0b',
    labelKey: 'research.optimalBracket',
    value: `${topTemp[0]}°C`,
    detail: `Highest average CO₂ uptake: ${topTemp[1].mean.toFixed(2)} mmol/g`,
    sub: `${topTemp[1].count} records in this temperature range`,
  },
  {
    icon: Database,
    color: '#a855f7',
    labelKey: 'research.databaseCoverage',
    value: `${TOTAL_EXPERIMENTS} Experiments`,
    detail: `${TOTAL_DATA_POINTS.toLocaleString()} data points · 8 biomass species · 6 activators`,
    sub: `Peak CO₂ recorded: ${DB_OVERALL_MAX.toFixed(2)} mmol/g`,
  },
];

export default function ResearchNewsFeed() {
  const { t } = useLang();

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">{t('research.badge')}</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-4xl text-white mb-3">
            {t('research.heading1')} <span className="text-gradient-green">{t('research.heading2')}</span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            {t('research.desc').replace('{count}', TOTAL_DATA_POINTS.toLocaleString())}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {INSIGHTS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">{t(item.labelKey)}</p>
                <p className="font-space font-bold text-xl text-white mb-2" style={{ color: item.color }}>
                  {item.value}
                </p>
                <p className="text-xs text-slate-300 mb-1">{item.detail}</p>
                <p className="text-[10px] text-slate-500">{item.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick fact bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-dark rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5"
        >
          <div className="flex flex-wrap justify-center sm:justify-start gap-8">
            {[
              { label: t('research.dbMean'), value: `${DB_OVERALL_AVG.toFixed(2)} mmol/g` },
              { label: t('research.peakRecorded'), value: `${DB_OVERALL_MAX.toFixed(2)} mmol/g` },
              { label: t('research.totalExperiments'), value: TOTAL_EXPERIMENTS },
              { label: t('research.dataPoints'), value: TOTAL_DATA_POINTS.toLocaleString() },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-space font-bold text-lg text-green-400">{s.value}</p>
                <p className="text-[10px] text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
          <Link
            to="/database"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-green text-white text-sm font-semibold glow-green hover:scale-105 transition-transform whitespace-nowrap flex-shrink-0"
          >
            {t('research.explore')} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
