// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, MapPin, GitBranch, FileDown, Download, ExternalLink, Search, Star, Tag, ChevronRight, Zap, Flame, Droplets, Wind, BarChart3 } from 'lucide-react';
import BiocharFlow from './BiocharFlow';
import ThailandContext from './ThailandContext';
import { useLang } from '../../lib/LanguageContext';

// ─── Forum Zone Data ──────────────────────────────────────────────────────────
const FORUM_CATEGORIES = ['ทั้งหมด', 'มาตรฐาน', 'เอกสาร', 'วีดีโอ', 'สาระน่ารู้'];

const FORUM_DOCS = [
  {
    id: 1,
    category: 'เอกสาร',
    title: 'บทบาทของ Biochar Consortium',
    titleEn: 'Role of the Biochar Consortium',
    desc: 'เอกสารประกอบการสัมมนา Biochar Consortium ครั้งที่ 4 ในหัวข้อ บทบาทของ Biochar Consortium',
    tags: ['ไบโอชาร์', 'Biochar Consortium'],
    featured: false,
    url: '#',
  },
  {
    id: 2,
    category: 'เอกสาร',
    title: 'การนำไบโอชาร์ไปใช้ในการเกษตรอินทรีย์',
    titleEn: 'Applying Biochar in Organic Agriculture',
    desc: 'เอกสารประกอบการสัมมนา Biochar Consortium ครั้งที่ 4 ในหัวข้อ การนำไบโอชาร์ไปใช้ในการเกษตรอินทรีย์',
    tags: ['ไบโอชาร์', 'เกษตรอินทรีย์'],
    featured: false,
    url: '#',
  },
  {
    id: 3,
    category: 'เอกสาร',
    title: 'ไบโอชาร์ในนครพนมและจังหวัดอื่นๆ ของไทย',
    titleEn: 'Biochar in Nakhon Phanom and Other Thai Provinces',
    desc: 'เอกสารประกอบการสัมมนา Biochar Consortium ครั้งที่ 4 ในหัวข้อ Biochar in Nakhon Phanom and other provinces',
    tags: ['ไบโอชาร์', 'นครพนม'],
    featured: false,
    url: '#',
  },
  {
    id: 4,
    category: 'เอกสาร',
    title: 'ผลของการใช้ไบโอชาร์ต่อการปลูกข้าวในพื้นที่ดินเค็มของประเทศไทยและความท้าทายในอนาคต',
    titleEn: 'Biochar Effects on Rice in Salt-Affected Soils of Thailand',
    desc: 'เอกสารประกอบการสัมมนา Biochar Consortium ครั้งที่ 4 ในหัวข้อ ผลของการใช้ไบโอชาร์ต่อการปลูกข้าวในพื้นที่ดินเค็ม',
    tags: ['ไบโอชาร์', 'ดินเค็ม'],
    featured: false,
    url: '#',
  },
  {
    id: 5,
    category: 'เอกสาร',
    title: 'ผลกระทบของการใช้ไบโอชาร์ต่อการปล่อยก๊าซเรือนกระจกและผลผลิตพืชเกษตรไทย',
    titleEn: 'Biochar Impact on GHG Emissions and Thai Agricultural Yields',
    desc: 'เอกสารประกอบการสัมมนา Biochar Consortium ครั้งที่ 4 ในหัวข้อ ผลกระทบของการใช้ไบโอชาร์ต่อการปล่อยก๊าซเรือนกระจก',
    tags: ['ไบโอชาร์', 'ก๊าซเรือนกระจก'],
    featured: false,
    url: '#',
  },
  {
    id: 6,
    category: 'สาระน่ารู้',
    title: 'สรุปข้อมูลสำคัญ-ไบโอชาร์',
    titleEn: 'Biochar Key Facts — MTEC-NZE Factsheet',
    desc: 'สรุปข้อมูลสำคัญ (Factsheet) งานภายใต้ยุทธศาสตร์ MTEC-NZE Biochar ของเอ็มเทค เพื่อยกระดับไบโอชาร์',
    tags: ['ไบโอชาร์', 'MTEC', 'Factsheet'],
    featured: true,
    url: '#',
  },
  {
    id: 7,
    category: 'มาตรฐาน',
    title: 'มาตรฐานไบโอชาร์ระดับสากล (EBC / IBI)',
    titleEn: 'International Biochar Standards — EBC / IBI',
    desc: 'ภาพรวมมาตรฐานคุณภาพไบโอชาร์ตามเกณฑ์ European Biochar Certificate และ International Biochar Initiative',
    tags: ['มาตรฐาน', 'EBC', 'IBI'],
    featured: false,
    url: '#',
  },
  {
    id: 8,
    category: 'วีดีโอ',
    title: 'แนะนำไบโอชาร์',
    titleEn: 'Introduction to Biochar',
    desc: 'วิดีโอแนะนำเกี่ยวกับไบโอชาร์และประโยชน์ของมัน',
    tags: ['ไบโอชาร์', 'แนะนำ'],
    featured: false,
    url: '#',
  }
];

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
  { id: 'docs',     icon: FileDown,  labelKey: 'kc.tab.docs' },
];

// ─── Forum Zone Component ─────────────────────────────────────────────────────
function ForumZone() {
  const { t } = useLang();
  const [activeFilter, setActiveFilter] = useState('ทั้งหมด');
  const [search, setSearch] = useState('');

  const filtered = FORUM_DOCS.filter(doc => {
    const matchCat = activeFilter === 'ทั้งหมด' || doc.category === activeFilter;
    const matchSearch = !search || doc.title.toLowerCase().includes(search.toLowerCase()) || doc.titleEn.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('kc.docs.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FORUM_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === cat
                  ? 'bg-green-500 text-white'
                  : 'bg-muted border border-border text-muted-foreground hover:border-green-400 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl border p-5 flex flex-col gap-3 ${
                doc.featured
                  ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/5 border-green-400/40'
                  : 'glass-card border-border'
              }`}
            >
              {doc.featured && (
                <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 text-xs font-bold">
                  <Star className="w-3 h-3" /> เด่น
                </span>
              )}

              {/* Category */}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center">
                  <FileDown className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-green-600 text-xs font-semibold">{doc.category}</span>
              </div>

              {/* Title */}
              <div>
                <h4 className="font-semibold text-sm leading-snug mb-1">{doc.title}</h4>
                <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">{doc.desc}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {doc.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-muted border border-border text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-border">
                <a
                  href={doc.url}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    doc.featured
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-muted hover:bg-green-500/10 hover:text-green-600 border border-border'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t('kc.docs.open')}
                </a>
                <a
                  href={doc.url}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted border border-border hover:bg-green-500/10 hover:border-green-400 hover:text-green-600 transition-all"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            {t('kc.docs.empty')}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center pt-2">
        {t('kc.docs.source')}
      </p>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function KnowledgeCenterSection() {
  const [activeTab, setActiveTab] = useState('what');
  const { t } = useLang();

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
