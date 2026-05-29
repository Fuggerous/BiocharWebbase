// @ts-nocheck
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, MapPin, GitBranch, BookOpen, Flame, Droplets, Wind, FlaskConical } from 'lucide-react';
import BiocharFlow from './BiocharFlow';
import ThailandContext from './ThailandContext';
import GlossarySection from './GlossarySection';
import { ForumZone } from './DocumentsSection';
import { Cite } from './ScientificReferences';
import { useTranslation } from 'react-i18next';
import waterTreatmentImg from '../../assets/images/watertreatment.jpg';
import ghgImg from '../../assets/images/GHG.jpg';
import soilImg from '../../assets/images/soil.jpg';

// ─── What is Biochar — fact card metadata (static icons/colors only) ──────────
const BIOCHAR_FACT_META = [
  { icon: Flame,   color: '#f59e0b', bg: 'bg-amber-500/10 border-amber-500/20', titleKey: 'kc.fact1.title', bodyKey: 'kc.fact1.body', refs: [13,15] },
  { icon: Droplets,color: '#3b82f6', bg: 'bg-blue-500/10 border-blue-500/20',   titleKey: 'kc.fact2.title', bodyKey: 'kc.fact2.body', refs: [1,2] },
  { icon: Leaf,    color: '#22c55e', bg: 'bg-green-500/10 border-green-500/20', titleKey: 'kc.fact3.title', bodyKey: 'kc.fact3.body', refs: [1,11,8] },
  { icon: Wind,    color: '#a855f7', bg: 'bg-purple-500/10 border-purple-500/20',titleKey: 'kc.fact4.title', bodyKey: 'kc.fact4.body', refs: [1,11,15] },
];

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'what',         icon: Leaf,          labelKey: 'kc.tab.what' },
  { id: 'thailand',     icon: MapPin,        labelKey: 'kc.tab.thailand' },
  { id: 'process',      icon: GitBranch,     labelKey: 'kc.tab.process' },
  { id: 'applications', icon: FlaskConical,  labelKey: 'kc.tab.applications' },
  { id: 'glossary',     icon: BookOpen,      labelKey: 'kc.tab.glossary' },
];

// ─── Applications tab — static metadata only (text via i18n) ─────────────────
const APPLICATION_PHASES = [
  {
    id: 'liquid',
    icon: Droplets,
    color: '#3b82f6',
    bg: 'from-blue-500/10 to-blue-500/5',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    refs: [41, 42],
    img: waterTreatmentImg,
    accent: '#3b82f6',
  },
  {
    id: 'gas',
    icon: Wind,
    color: '#22c55e',
    bg: 'from-green-500/10 to-emerald-500/5',
    border: 'border-green-500/20',
    iconBg: 'bg-green-500/10 border-green-500/20',
    refs: [43, 44],
    img: ghgImg,
    accent: '#22c55e',
  },
  {
    id: 'solid',
    icon: Leaf,
    color: '#f59e0b',
    bg: 'from-amber-500/10 to-orange-500/5',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    refs: [45, 46],
    img: soilImg,
    accent: '#f59e0b',
  },
];

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function KnowledgeCenterSection() {
  const [activeTab, setActiveTab] = useState('what');
  const [autoRotate, setAutoRotate] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const autoTabs = ['what', 'thailand', 'process'];
    if (!autoRotate) return;
    const timer = window.setInterval(() => {
      setActiveTab(current => {
        const index = autoTabs.indexOf(current);
        const nextIndex = index === -1 ? 0 : (index + 1) % autoTabs.length;
        return autoTabs[nextIndex];
      });
    }, 20000);

    return () => window.clearInterval(timer);
  }, [autoRotate]);

  return (
    <section id="knowledge" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium">
              {t('kc.badge')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setAutoRotate(v => !v)}
            aria-pressed={autoRotate}
            className={`absolute right-0 top-0 sm:top-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors border ${autoRotate ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-background border-border text-muted-foreground'}`}
            style={{ transform: 'translateY(6px)' }}
          >
            {autoRotate ? t('kc.autorotate.on') : t('kc.autorotate.off')}
          </button>
          <h2 className="font-space font-bold text-3xl lg:text-4xl mb-3">
            {t('kc.heading')} <span className="text-gradient-green">{t('kc.headingHighlight')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('kc.desc')}
          </p>
        </motion.div>

        {/* Tab Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-background border border-border text-muted-foreground hover:border-green-400 hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label ?? t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Tab Content — uniform min-height so panels don't jump */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="min-h-[520px]"
          >
            {/* ── What is Biochar ── */}
            {activeTab === 'what' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {BIOCHAR_FACT_META.map((fact, i) => (
                  <motion.div
                    key={fact.titleKey}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="glass-card rounded-2xl p-6 border border-border"
                  >
                    <div className={`w-11 h-11 rounded-xl ${fact.bg} border flex items-center justify-center mb-4`}>
                      <fact.icon className="w-5 h-5" style={{ color: fact.color }} />
                    </div>
                    <h3 className="font-space font-bold text-base mb-2">{t(fact.titleKey)}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{t(fact.bodyKey)} {fact.refs && <Cite ids={fact.refs} />}</p>
                  </motion.div>
                ))}
                {/* Quick Stats Banner */}
                <div className="md:col-span-2 rounded-2xl bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 border border-green-500/20 p-5 flex flex-wrap gap-6 items-center justify-around">
                  {[
                    { label: t('kc.stat.recalcitrance'), value: '100–1000+ yrs', sub: t('kc.stat.recalcitranceSub') },
                    { label: t('kc.stat.bet'), value: '3,157 m²/g', sub: t('kc.stat.betSub') },
                    { label: t('kc.stat.uptake'), value: '14.5 mmol/g', sub: t('kc.stat.uptakeSub') },
                    { label: t('kc.stat.ghg'), value: 'Up to 54%', sub: t('kc.stat.ghgSub') },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <div className="font-space font-bold text-xl text-green-500">{s.value}</div>
                      <div className="text-xs font-semibold text-foreground">{s.label}</div>
                      <div className="text-xs text-muted-foreground">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Biochar in Thailand ── */}
            {activeTab === 'thailand' && (
              <div className="bg-background rounded-2xl border border-border overflow-hidden">
                <ThailandContext />
              </div>
            )}

            {/* ── Process Flow ── */}
            {activeTab === 'process' && (
              <div className="bg-background rounded-2xl border border-border overflow-hidden">
                <BiocharFlow />
              </div>
            )}

            {/* ── Documents ── */}
            {activeTab === 'docs' && (
              <div className="bg-background rounded-2xl border border-border p-6">
                <ForumZone />
              </div>
            )}

            {/* ── Applications ── */}
            {activeTab === 'applications' && (
              <div className="space-y-5">
                <div className="text-center mb-2">
                  <h3 className="font-space font-bold text-xl mb-1">{t('kc.app.heading')}</h3>
                  <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                    {t('kc.app.desc')}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {APPLICATION_PHASES.map((ph, i) => (
                    <motion.div
                      key={ph.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`glass-card rounded-2xl border overflow-hidden ${ph.border}`}
                    >
                      {/* Image header */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={ph.img}
                          alt={t(`kc.app.${ph.id}.imgAlt`)}
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.target.style.display = 'none';
                            e.target.parentElement.style.background = `linear-gradient(135deg, ${ph.accent}40, ${ph.accent}18)`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${ph.iconBg} border flex items-center justify-center`}>
                            <ph.icon className="w-3.5 h-3.5" style={{ color: ph.color }} />
                          </div>
                          <span className="text-white font-space font-bold text-sm">{t(`kc.app.${ph.id}.phase`)}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h4 className="font-space font-bold text-sm mb-2" style={{ color: ph.color }}>{t(`kc.app.${ph.id}.heading`)}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                          {t(`kc.app.${ph.id}.body`)} <Cite ids={ph.refs} />
                        </p>

                        {/* Stats */}
                        <div className={`rounded-xl bg-gradient-to-br ${ph.bg} border ${ph.border} divide-y divide-border/50`}>
                          {[1, 2, 3].map(n => (
                            <div key={n} className="flex items-center justify-between px-3 py-2">
                              <span className="text-[10px] text-muted-foreground">{t(`kc.app.${ph.id}.stat${n}.label`)}</span>
                              <span className="text-[11px] font-space font-bold" style={{ color: ph.color }}>{t(`kc.app.${ph.id}.stat${n}.value`)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Phase summary banner */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-500/8 via-green-500/8 to-amber-500/8 border border-green-500/20 p-5 flex flex-wrap gap-6 items-center justify-around">
                  {[
                    { key: 'liquid', color: '#3b82f6' },
                    { key: 'gas',    color: '#22c55e' },
                    { key: 'solid',  color: '#f59e0b' },
                  ].map(s => (
                    <div key={s.key} className="text-center">
                      <div className="font-space font-bold text-base" style={{ color: s.color }}>{t(`kc.app.summary.${s.key}`)}</div>
                      <div className="text-xs text-muted-foreground">{t(`kc.app.summary.${s.key}.desc`)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Glossary ── */}
            {activeTab === 'glossary' && (
              <div className="bg-background rounded-2xl border border-border p-6">
                <div className="mb-5">
                  <h3 className="font-space font-bold text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    {t('kc.glossary.heading')}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{t('kc.glossary.desc')}</p>
                </div>
                <GlossarySection />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
