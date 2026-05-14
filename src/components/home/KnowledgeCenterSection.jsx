// @ts-nocheck
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, MapPin, GitBranch, Search, Zap, Flame, Droplets, Wind } from 'lucide-react';
import BiocharFlow from './BiocharFlow';
import ThailandContext from './ThailandContext';
import { ForumZone } from './DocumentsSection';
import { useLang } from '../../lib/LanguageContext';

// ─── Forum Zone Data ──────────────────────────────────────────────────────────
const FORUM_CATEGORIES = ['ทั้งหมด', 'มาตรฐาน', 'เอกสาร', 'วีดีโอ', 'สาระน่ารู้'];

// ─── What is Biochar — fact card metadata (static icons/colors only) ──────────
const BIOCHAR_FACT_META = [
  { icon: Flame,   color: '#f59e0b', bg: 'bg-amber-500/10 border-amber-500/20', titleKey: 'kc.fact1.title', bodyKey: 'kc.fact1.body' },
  { icon: Droplets,color: '#3b82f6', bg: 'bg-blue-500/10 border-blue-500/20',   titleKey: 'kc.fact2.title', bodyKey: 'kc.fact2.body' },
  { icon: Leaf,    color: '#22c55e', bg: 'bg-green-500/10 border-green-500/20', titleKey: 'kc.fact3.title', bodyKey: 'kc.fact3.body' },
  { icon: Wind,    color: '#a855f7', bg: 'bg-purple-500/10 border-purple-500/20',titleKey: 'kc.fact4.title', bodyKey: 'kc.fact4.body' },
];

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'what',     icon: Leaf,      labelKey: 'kc.tab.what' },
  { id: 'thailand', icon: MapPin,    labelKey: 'kc.tab.thailand' },
  { id: 'process',  icon: GitBranch, labelKey: 'kc.tab.process' },
];

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function KnowledgeCenterSection() {
  const [activeTab, setActiveTab] = useState('what');
  const { t } = useLang();

  useEffect(() => {
    const autoTabs = ['what', 'thailand', 'process'];
    const timer = window.setInterval(() => {
      setActiveTab(current => {
        const index = autoTabs.indexOf(current);
        const nextIndex = index === -1 ? 0 : (index + 1) % autoTabs.length;
        return autoTabs[nextIndex];
      });
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="knowledge" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium mb-4">
            {t('kc.badge')}
          </span>
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
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── What is Biochar ── */}
            {activeTab === 'what' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {BIOCHAR_FACT_META.map((fact, i) => (
                  <motion.div
                    key={fact.titleKey}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card rounded-2xl p-6 border border-border"
                  >
                    <div className={`w-11 h-11 rounded-xl ${fact.bg} border flex items-center justify-center mb-4`}>
                      <fact.icon className="w-5 h-5" style={{ color: fact.color }} />
                    </div>
                    <h3 className="font-space font-bold text-base mb-2">{t(fact.titleKey)}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{t(fact.bodyKey)}</p>
                  </motion.div>
                ))}
                {/* Quick Stats Banner */}
                <div className="md:col-span-2 rounded-2xl bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 border border-green-500/20 p-5 flex flex-wrap gap-6 items-center justify-around">
                  {[
                    { label: 'Recalcitrance', value: '100–1000+ yrs', sub: 'Carbon stability in soil' },
                    { label: 'Max BET Surface', value: '3,157 m²/g', sub: 'Per gram of activated biochar' },
                    { label: 'Peak CO₂ Uptake', value: '14.5 mmol/g', sub: 'Recorded in this database' },
                    { label: 'GHG Reduction', value: 'Up to 54%', sub: 'N₂O emissions from soil' },
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
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
