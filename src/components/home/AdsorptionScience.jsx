// @ts-nocheck
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Microscope, Zap, ArrowRight, Info } from 'lucide-react';
import { Cite } from './ScientificReferences';
import { DB_OVERALL_MAX } from '../../lib/biocharKnowledgeBase';
import { DB44_RECORDS } from '../../lib/database44';

const _surfaces = DB44_RECORDS.map(r => r.surfaceArea).filter(v => v != null && v > 0);
const _pores = DB44_RECORDS.map(r => r.poreVolume).filter(v => v != null && v > 0);
const MAX_SURFACE = _surfaces.length ? Math.max(..._surfaces) : 3157;
const MAX_PORE    = _pores.length    ? Math.max(..._pores)    : 1.554;

const MECHANISMS = [
  {
    title: 'High BET Surface Area',
    value: `up to ${Math.round(MAX_SURFACE).toLocaleString()} m²/g`,
    color: '#22c55e',
    description: 'Activation creates an enormous internal surface — one gram of optimized biochar has a surface area equivalent to half a football field.',
    refs: [7, 10, 12],
    visual: (
      <div className="relative h-28 flex items-end justify-center gap-1 px-3">
        {[20, 45, 70, 95, 80, 60, 100, 75, 50, 85, 65, 40].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
            className="flex-1 rounded-t-sm"
            style={{ background: `rgba(34,197,94,${0.3 + h / 200})` }}
          />
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-green-500/30" />
      </div>
    ),
  },
  {
    title: 'Micropore Volume',
    value: `up to ${MAX_PORE.toFixed(3)} cm³/g`,
    color: '#3b82f6',
    description: 'Micropores (< 2 nm diameter) are the primary sites for CO₂ adsorption. Their narrow geometry creates strong van der Waals interactions with CO₂ molecules.',
    refs: [5, 7],
    visual: (
      <div className="relative h-28 flex items-center justify-center">
        <div className="grid grid-cols-6 gap-1 w-full px-3">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.025, duration: 0.3 }}
              className="aspect-square rounded-sm border"
              style={{
                background: i % 4 === 0 ? 'rgba(59,130,246,0.5)' : 'rgba(59,130,246,0.08)',
                borderColor: 'rgba(59,130,246,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'CO₂ Molecular Affinity',
    value: `up to ${DB_OVERALL_MAX.toFixed(2)} mmol/g`,
    color: '#a855f7',
    description: 'Surface functional groups (–OH, –COOH, –NH₂) interact chemically with CO₂ molecules, while the narrow micropore geometry optimizes kinetic molecular sieving.',
    refs: [7, 12],
    visual: (
      <div className="relative h-28 flex items-center justify-center gap-3 px-4">
        {[
          { label: 'CO₂', color: '#a855f7', size: 'w-9 h-9' },
          { label: 'N₂', color: '#64748b', size: 'w-7 h-7' },
          { label: 'CO₂', color: '#a855f7', size: 'w-9 h-9' },
          { label: 'CH₄', color: '#64748b', size: 'w-6 h-6' },
          { label: 'CO₂', color: '#a855f7', size: 'w-9 h-9' },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
            className={`${m.size} rounded-full flex items-center justify-center text-[9px] font-bold border-2 flex-shrink-0`}
            style={{ borderColor: m.color, color: m.color, background: `${m.color}15` }}
          >
            {m.label}
          </motion.div>
        ))}
      </div>
    ),
  },
];

const SEM_FACT = {
  image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
  caption: 'Scanning Electron Microscopy (SEM) of activated biochar reveals a highly interconnected micropore network responsible for exceptional CO₂ uptake.',
};

export default function AdsorptionScience() {
  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute left-0 top-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Microscope className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Materials Science</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-4xl text-white mb-3">
            The Science Behind<br />
            <span className="text-gradient-green">the Surface</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Three interrelated structural properties determine a biochar's CO₂ adsorption capacity.<Cite ids={[7, 10]} /> Our AI model quantifies all three simultaneously.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left: SEM image panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="glass-dark rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="relative h-64 lg:h-80">
                <img
                  src={SEM_FACT.image}
                  alt="SEM of biochar pores"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-[11px] leading-relaxed">{SEM_FACT.caption}</p>
                  </div>
                </div>
              </div>

              {/* Performance ladder */}
              <div className="p-5 space-y-3">
                <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Database Performance Range</p>
                {[
                  { label: 'BET Surface Area', hi: MAX_SURFACE,    unit: 'm²/g',   fmt: v => `${Math.round(v).toLocaleString()}`, color: '#22c55e' },
                  { label: 'Pore Volume',       hi: MAX_PORE,       unit: 'cm³/g',  fmt: v => v.toFixed(3),                        color: '#3b82f6' },
                  { label: 'CO₂ Uptake',        hi: DB_OVERALL_MAX, unit: 'mmol/g', fmt: v => v.toFixed(2),                        color: '#a855f7' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-bold" style={{ color: item.color }}>{item.fmt(item.hi)} {item.unit}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${item.color}50, ${item.color})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Mechanism cards */}
          <div className="lg:col-span-3 space-y-5">
            {MECHANISMS.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass-dark rounded-2xl border border-white/10 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Visual */}
                  <div className="sm:w-48 flex-shrink-0 bg-white/5 border-b sm:border-b-0 sm:border-r border-white/10">
                    {m.visual}
                  </div>
                  {/* Content */}
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-space font-bold text-white text-sm">{m.title}</h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0"
                        style={{ color: m.color, borderColor: `${m.color}40`, background: `${m.color}15` }}>
                        {m.value}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{m.description}{m.refs && <Cite ids={m.refs} />}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/predictor"
                className="flex items-center justify-between w-full gradient-green text-white px-6 py-4 rounded-2xl font-semibold glow-green hover:scale-[1.02] transition-transform group"
              >
                <div>
                  <p className="font-space font-bold text-base">Predict Your Biochar's CO₂ Capacity</p>
                  <p className="text-green-100/70 text-xs mt-0.5">Input your parameters → AI model returns mmol/g + confidence interval</p>
                </div>
                <ArrowRight className="w-6 h-6 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}