// @ts-nocheck
import { motion } from 'framer-motion';
import { Database, Brain, Beaker, TrendingUp, Award, FlaskConical } from 'lucide-react';
import { DB44_RECORDS, BIOMASS_LIST, ACTIVATOR_LIST } from '../../lib/database44';
import { DB_OVERALL_MAX, TOTAL_EXPERIMENTS } from '../../lib/biocharKnowledgeBase';
import { useTranslation } from 'react-i18next';

const maxCO2 = DB_OVERALL_MAX.toFixed(2);
const recordCount = DB44_RECORDS.length.toLocaleString();
const biomassCount = BIOMASS_LIST.length;
const activatorCount = ACTIVATOR_LIST.filter(a => a !== 'Non').length;

const stats = [
  { icon: Database,    value: recordCount,              labelKey: 'dataPoints',        color: 'text-green-500',  bg: 'bg-green-500/10 border-green-500/20' },
  { icon: Brain,       value: String(biomassCount),     labelKey: 'biomassSpecies',    color: 'text-blue-500',   bg: 'bg-blue-500/10 border-blue-500/20' },
  { icon: FlaskConical, value: String(activatorCount),   labelKey: 'activationMethods', color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
  { icon: Beaker,      value: String(TOTAL_EXPERIMENTS), labelKey: 'uniqueExperiments', color: 'text-amber-500',  bg: 'bg-amber-500/10 border-amber-500/20' },
  { icon: TrendingUp,  value: maxCO2,                   labelKey: 'maxMmolg',          color: 'text-cyan-500',   bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { icon: Award,       value: '6',                      labelKey: 'activatorTypes',    color: 'text-rose-500',   bg: 'bg-rose-500/10 border-rose-500/20' },
];

export default function StatsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-dots-pattern opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-space font-bold text-3xl lg:text-4xl text-foreground">
            {t('stats.heading')}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('stats.desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`glass-card rounded-2xl p-5 text-center border ${stat.bg} hover:scale-105 transition-transform cursor-default`}
            >
              <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center mb-3 ${stat.bg} border`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className={`font-space font-bold text-2xl ${stat.color}`}>{stat.value}</p>
              <p className="text-muted-foreground text-xs mt-1 font-medium">
                {t(`stats.${stat.labelKey}`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
