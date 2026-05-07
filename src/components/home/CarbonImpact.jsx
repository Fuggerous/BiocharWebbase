// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, TrendingDown, Layers, Wind } from 'lucide-react';
import { Cite } from './ScientificReferences';
import { DB_OVERALL_MAX } from '../../lib/biocharKnowledgeBase';

function CountUp({ end, duration = 2, decimals = 0, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); return; }
      setVal(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {decimals > 0 ? val.toFixed(decimals) : Math.floor(val)}{suffix}
    </span>
  );
}

const METRICS = [
  {
    icon: TrendingDown,
    color: '#22c55e',
    bg: 'from-green-500/15 to-green-600/5',
    border: 'border-green-500/25',
    headline: '2.5 t CO₂eq',
    subline: 'sequestered per tonne of biochar',
    body: '1 tonne of high-quality biochar locks away up to 2.5 tonnes of CO₂ equivalent — permanently. Unlike other carbon offsets, biochar carbon is stable for centuries.',
    refs: [2, 3, 4],
    countEnd: 2.5,
    countDecimals: 1,
    countSuffix: 't CO₂eq/t',
  },
  {
    icon: Globe,
    color: '#3b82f6',
    bg: 'from-blue-500/15 to-blue-600/5',
    border: 'border-blue-500/25',
    headline: '2.0 Gt/yr',
    subline: 'maximum technical potential',
    body: 'At scale, global biochar deployment could sequester up to 2 gigatonnes of CO₂ per year — representing ~6% of current global emissions.',
    refs: [2, 3],
    countEnd: 2,
    countDecimals: 1,
    countSuffix: ' Gt/yr',
  },
  {
    icon: Layers,
    color: '#a855f7',
    bg: 'from-purple-500/15 to-purple-600/5',
    border: 'border-purple-500/25',
    headline: '1,000 years',
    subline: 'carbon stability in soil',
    body: 'Biochar carbon is recalcitrant to microbial decomposition. Mean residence time in soil exceeds 1,000 years, making it the most durable carbon negative technology available today.',
    refs: [1, 11],
    countEnd: 1000,
    countDecimals: 0,
    countSuffix: ' yr',
  },
  {
    icon: Wind,
    color: '#06b6d4',
    bg: 'from-cyan-500/15 to-cyan-600/5',
    border: 'border-cyan-500/25',
    headline: `${DB_OVERALL_MAX.toFixed(2)} mmol/g`,
    subline: 'maximum CO₂ capture from 44Database',
    body: `KOH-activated biochar achieves up to ${DB_OVERALL_MAX.toFixed(2)} mmol/g in our dataset — among the highest reported for biowaste-derived carbons without metal loading.`,
    refs: [6, 12],
    countEnd: DB_OVERALL_MAX,
    countDecimals: 2,
    countSuffix: ' mmol/g',
  },
];

export default function CarbonImpact() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-dots-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Climate Impact Metrics</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-4xl text-foreground mb-3">
            Carbon Sequestration<br />
            <span className="text-gradient-blue">at Scale</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Biochar is the only carbon removal strategy that simultaneously improves soil health, reduces agricultural waste, and permanently sequesters atmospheric CO₂.<Cite ids={[2, 3]} />
          </p>
        </motion.div>

        {/* Big highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl mb-10"
          style={{
            background: 'linear-gradient(135deg, #0a2d1f 0%, #051a12 50%, #0a1a3e 100%)',
            border: '1px solid rgba(34,197,94,0.2)',
          }}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
          <div className="relative px-8 py-12 text-center">
            <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-widest">Key Fact</p>
            <p className="font-space font-bold text-5xl lg:text-6xl text-white mb-3">
              1 Tonne Biochar =
            </p>
            <p className="font-space font-bold text-5xl lg:text-6xl mb-4" style={{ color: '#22c55e' }}>
              <CountUp end={2.5} decimals={1} /> t CO₂eq Removed
            </p>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Permanently locked in the soil carbon pool — not as a temporary offset, but as geological-timescale sequestration.<Cite ids={[3, 4]} />
            </p>
          </div>
        </motion.div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.headline}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-2xl p-6 border ${m.border} bg-gradient-to-br ${m.bg} hover:scale-[1.03] transition-transform`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border"
                style={{ background: `${m.color}15`, borderColor: `${m.color}30` }}>
                <m.icon className="w-5 h-5" style={{ color: m.color }} />
              </div>

              <p className="font-space font-bold text-2xl text-foreground mb-0.5">
                <CountUp end={m.countEnd} decimals={m.countDecimals} suffix={m.countSuffix} />
              </p>
              <p className="text-xs font-semibold mb-3" style={{ color: m.color }}>{m.subline}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.body}{m.refs && <Cite ids={m.refs} />}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}