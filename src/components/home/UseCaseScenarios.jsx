// @ts-nocheck
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Layers, BarChart3, FlaskConical, ArrowRight, Tag, Sparkles } from 'lucide-react';

export default function UseCaseScenarios() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const SCENARIOS = [
    {
      icon:     FlaskConical,
      color:    '#8b5cf6',
      border:   'border-purple-500/30',
      bg:       'from-purple-950/60 to-purple-900/10',
      glow:     'rgba(139,92,246,0.2)',
      tool:     t('usecase.s1.tool'),
      toolPath: '/advisor',
      q:        t('usecase.s1.q'),
      title:    t('usecase.s1.title'),
      desc:     t('usecase.s1.desc'),
      tags:     [t('usecase.s1.tag1'), t('usecase.s1.tag2')],
      prefill:  { targetCO2: 6.5, biomass: 'All', autoRun: true },
    },
    {
      icon:     BarChart3,
      color:    '#22c55e',
      border:   'border-green-500/30',
      bg:       'from-green-950/60 to-green-900/10',
      glow:     'rgba(34,197,94,0.2)',
      tool:     t('usecase.s2.tool'),
      toolPath: '/predictor',
      q:        t('usecase.s2.q'),
      title:    t('usecase.s2.title'),
      desc:     t('usecase.s2.desc'),
      tags:     [t('usecase.s2.tag1'), t('usecase.s2.tag2')],
      prefill:  {
        biomass: 'Sugarcane bagasse',
        activator: 'KOH',
        temperature: 800,
        residenceTime: 60,
        heatingRate: 10,
      },
    },
    {
      icon:     Layers,
      color:    '#f59e0b',
      border:   'border-amber-500/30',
      bg:       'from-amber-950/60 to-amber-900/10',
      glow:     'rgba(245,158,11,0.2)',
      tool:     t('usecase.s3.tool'),
      toolPath: '/database',
      q:        t('usecase.s3.q'),
      title:    t('usecase.s3.title'),
      desc:     t('usecase.s3.desc'),
      tags:     [t('usecase.s3.tag1'), t('usecase.s3.tag2')],
      prefill:  { scrollTo: 'heatmap', highlightActivators: ['KOH', 'K2CO3'] },
    },
  ];

  const handleClick = (scenario) => {
    navigate(scenario.toolPath, { state: { prefill: scenario.prefill } });
  };

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden border-t border-white/5">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      {/* Ambient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-300 text-sm font-semibold">{t('usecase.badge')}</span>
          </div>
          <h2 className="font-space font-black text-3xl lg:text-4xl text-white mb-3">
            {t('usecase.heading')}
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            {t('usecase.desc')}
          </p>
        </motion.div>

        {/* Scenario cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SCENARIOS.map((s, i) => (
            <motion.button
              key={s.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClick(s)}
              className={`group relative flex flex-col text-left rounded-3xl border overflow-hidden transition-all duration-300 bg-gradient-to-br ${s.bg} ${s.border}`}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 60px ${s.glow}`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* Accent line */}
              <div className="absolute top-0 inset-x-0 h-0.5"
                style={{ background: `linear-gradient(90deg, transparent, ${s.color}cc, transparent)` }} />

              <div className="p-6 flex flex-col h-full">
                {/* Tool badge */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border"
                    style={{ color: s.color, borderColor: s.color + '40', background: s.color + '12' }}>
                    {s.tool}
                  </span>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
                    style={{ background: s.color + '12', borderColor: s.color + '30' }}>
                    <s.icon className="w-[18px] h-[18px]" style={{ color: s.color }} />
                  </div>
                </div>

                {/* Question (the "trigger") */}
                <p className="text-slate-400 text-xs italic mb-3 leading-relaxed">
                  "{s.q}"
                </p>

                {/* Title */}
                <h3 className="font-space font-bold text-white text-lg leading-tight mb-3">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-xs leading-relaxed mb-5 flex-1">
                  {s.desc}
                </p>

                {/* Pre-fill tags */}
                <div className="mb-5">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" /> {t('usecase.prefilled')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map(tag => (
                      <span key={tag}
                        className="text-[9px] font-semibold px-2 py-0.5 rounded-md border"
                        style={{ color: s.color, borderColor: s.color + '40', background: s.color + '0d' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/8">
                  <span className="text-[10px] font-bold" style={{ color: s.color }}>
                    {t('usecase.cta')}
                  </span>
                  <div className="flex items-center justify-center w-7 h-7 rounded-full border group-hover:translate-x-1 transition-transform"
                    style={{ borderColor: s.color + '50', background: s.color + '15' }}>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: s.color }} />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-600 text-xs mt-8"
        >
          <Lightbulb className="w-3 h-3 inline mr-1.5 text-slate-500" />
          {t('usecase.desc')}
        </motion.p>
      </div>
    </section>
  );
}
