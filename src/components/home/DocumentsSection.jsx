// @ts-nocheck
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Video, BookOpen, Shield, Lightbulb,
  Download, ExternalLink, Search, Star, ChevronRight, X
} from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';

// ── Data ──────────────────────────────────────────────────────────────────────
const DOCS = [
  {
    id: 1, category: 'เอกสาร', type: 'pdf',
    title: 'บทบาทของ Biochar Consortium',
    titleEn: 'Role of the Biochar Consortium',
    desc: 'เอกสารประกอบการสัมมนา Biochar Consortium ครั้งที่ 4 ในหัวข้อบทบาทของ Biochar Consortium',
    tags: ['Biochar Consortium'], featured: false,
    url: 'https://www.nstda.or.th/nac/2025/seminar/nac-28/',
  },
  {
    id: 2, category: 'เอกสาร', type: 'pdf',
    title: 'การนำไบโอชาร์ไปใช้ในการเกษตรอินทรีย์',
    titleEn: 'Applying Biochar in Organic Agriculture',
    desc: 'เอกสารประกอบการสัมมนา Biochar Consortium ครั้งที่ 4 ในหัวข้อการนำไบโอชาร์ไปใช้ในการเกษตรอินทรีย์',
    tags: ['เกษตรอินทรีย์'], featured: false, url: '#',
  },
  {
    id: 3, category: 'เอกสาร', type: 'pdf',
    title: 'ไบโอชาร์ในนครพนมและจังหวัดอื่นๆ ของไทย',
    titleEn: 'Biochar in Nakhon Phanom and Other Thai Provinces',
    desc: 'เอกสารประกอบการสัมมนา Biochar Consortium ครั้งที่ 4 ในหัวข้อ Biochar in Nakhon Phanom and other provinces',
    tags: ['นครพนม'], featured: false, url: '#',
  },
  {
    id: 4, category: 'เอกสาร', type: 'pdf',
    title: 'ผลของการใช้ไบโอชาร์ต่อการปลูกข้าวในพื้นที่ดินเค็ม',
    titleEn: 'Biochar Effects on Rice in Salt-Affected Soils',
    desc: 'ผลของการใช้ไบโอชาร์ต่อการปลูกข้าวในพื้นที่ดินเค็มของประเทศไทยและความท้าทายในอนาคต',
    tags: ['ดินเค็ม', 'ข้าว'], featured: false, url: '#',
  },
  {
    id: 5, category: 'เอกสาร', type: 'pdf',
    title: 'ผลกระทบของไบโอชาร์ต่อการปล่อยก๊าซเรือนกระจก',
    titleEn: 'Biochar Impact on GHG Emissions and Thai Crop Yields',
    desc: 'ผลกระทบของการใช้ไบโอชาร์ต่อการปล่อยก๊าซเรือนกระจกและผลผลิตพืชเกษตรไทย',
    tags: ['GHG', 'เกษตร'], featured: false, url: '#',
  },
  {
    id: 6, category: 'สาระน่ารู้', type: 'article',
    title: 'สรุปข้อมูลสำคัญ — ไบโอชาร์',
    titleEn: 'Biochar Key Facts Factsheet (MTEC-NZE)',
    desc: 'สรุปข้อมูลสำคัญ (Factsheet) ภายใต้ยุทธศาสตร์ MTEC-NZE Biochar เพื่อยกระดับไบโอชาร์ไทย',
    tags: ['MTEC', 'Factsheet'], featured: true, url: '#',
  },
  {
    id: 7, category: 'มาตรฐาน', type: 'standard',
    title: 'มาตรฐานไบโอชาร์ระดับสากล (EBC / IBI)',
    titleEn: 'International Biochar Standards — EBC / IBI',
    desc: 'ภาพรวมมาตรฐานคุณภาพไบโอชาร์ตามเกณฑ์ European Biochar Certificate และ International Biochar Initiative',
    tags: ['EBC', 'IBI', 'มาตรฐาน'], featured: false, url: '#',
  },
  {
    id: 8, category: 'วีดีโอ', type: 'video',
    title: 'แนะนำไบโอชาร์',
    titleEn: 'Introduction to Biochar — Video Guide',
    desc: 'วิดีโอแนะนำเกี่ยวกับไบโอชาร์ ประโยชน์และการนำไปใช้ในภาคเกษตรกรรมและสิ่งแวดล้อม',
    tags: ['วิดีโอ', 'แนะนำ'], featured: false, url: '#',
  },
];

// ── Category config ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'ทั้งหมด',   color: '#22c55e', bg: 'bg-green-500/10',  border: 'border-green-500/25'  },
  { key: 'มาตรฐาน',  color: '#3b82f6', bg: 'bg-blue-500/10',   border: 'border-blue-500/25'   },
  { key: 'เอกสาร',   color: '#a855f7', bg: 'bg-purple-500/10', border: 'border-purple-500/25' },
  { key: 'วีดีโอ',   color: '#f59e0b', bg: 'bg-amber-500/10',  border: 'border-amber-500/25'  },
  { key: 'สาระน่ารู้',color: '#06b6d4', bg: 'bg-cyan-500/10',   border: 'border-cyan-500/25'   },
];

// ── Type icons ────────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  pdf:      { icon: FileText,  color: '#a855f7', label: 'PDF' },
  video:    { icon: Video,     color: '#f59e0b', label: 'Video' },
  article:  { icon: Lightbulb, color: '#06b6d4', label: 'Article' },
  standard: { icon: Shield,    color: '#3b82f6', label: 'Standard' },
};

function getCatConfig(cat) {
  return CATEGORIES.find(c => c.key === cat) ?? CATEGORIES[0];
}

// ── Document Card ─────────────────────────────────────────────────────────────
function DocCard({ doc, index }) {
  const catCfg  = getCatConfig(doc.category);
  const typeCfg = TYPE_CONFIG[doc.type] ?? TYPE_CONFIG.pdf;
  const TypeIcon = typeCfg.icon;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className={`group relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5
        ${doc.featured
          ? 'border-green-400/40 bg-gradient-to-br from-green-500/8 via-background to-emerald-500/5'
          : 'border-border bg-card hover:border-green-400/30'
        }`}
    >
      {/* Category accent strip */}
      <div className="h-1 w-full" style={{ background: catCfg.color, opacity: 0.7 }} />

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Type icon */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${typeCfg.color}15`, border: `1px solid ${typeCfg.color}30` }}>
              <TypeIcon className="w-4 h-4" style={{ color: typeCfg.color }} />
            </div>
            {/* Category badge */}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${catCfg.bg} ${catCfg.border}`}
              style={{ color: catCfg.color }}>
              {doc.category}
            </span>
          </div>
          {doc.featured && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-600 text-[10px] font-bold flex-shrink-0">
              <Star className="w-2.5 h-2.5" /> เด่น
            </span>
          )}
        </div>

        {/* Title + desc */}
        <div className="flex-1">
          <h4 className="font-space font-semibold text-sm leading-snug mb-1.5 line-clamp-2
            group-hover:text-green-600 transition-colors">
            {doc.title}
          </h4>
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{doc.desc}</p>
        </div>

        {/* Tags */}
        {doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {doc.tags.map(tag => (
              <span key={tag}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted/80 text-muted-foreground border border-border/60">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/60 mt-auto">
          <a href={doc.url}
            target={doc.url?.startsWith('http') ? '_blank' : undefined}
            rel={doc.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold
              transition-all group/btn
              ${doc.featured
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-muted hover:bg-green-500 hover:text-white border border-border hover:border-green-500'
              }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            เปิดไฟล์
            <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
          <a href={doc.url}
            target={doc.url?.startsWith('http') ? '_blank' : undefined}
            rel={doc.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted border border-border
              hover:bg-green-500/10 hover:border-green-400 hover:text-green-600 transition-all"
            title="ดาวน์โหลด"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

// ── ForumZone (main export used by KnowledgeCenterSection) ───────────────────
function ForumZone() {
  const { t } = useLang();
  const [activeFilter, setActiveFilter] = useState('ทั้งหมด');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    DOCS.filter(doc => {
      const matchCat    = activeFilter === 'ทั้งหมด' || doc.category === activeFilter;
      const q           = search.toLowerCase();
      const matchSearch = !q || doc.title.toLowerCase().includes(q) || doc.titleEn.toLowerCase().includes(q);
      return matchCat && matchSearch;
    }),
    [activeFilter, search]
  );

  // Count per category
  const counts = useMemo(() => {
    const c = { ทั้งหมด: DOCS.length };
    DOCS.forEach(d => { c[d.category] = (c[d.category] ?? 0) + 1; });
    return c;
  }, []);

  return (
    <div className="space-y-5">
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาเอกสาร..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-muted border border-border text-sm
              focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(cat => {
            const active = activeFilter === cat.key;
            return (
              <button key={cat.key} onClick={() => setActiveFilter(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                  border transition-all ${active
                    ? 'text-white border-transparent'
                    : `${cat.bg} ${cat.border} text-muted-foreground hover:text-foreground`
                  }`}
                style={active ? { background: cat.color, borderColor: cat.color } : {}}
              >
                {cat.key}
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {counts[cat.key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          แสดง <span className="font-semibold text-foreground">{filtered.length}</span> รายการ
          {search && <> สำหรับ "<span className="text-green-600">{search}</span>"</>}
        </p>
        {(search || activeFilter !== 'ทั้งหมด') && (
          <button
            onClick={() => { setSearch(''); setActiveFilter('ทั้งหมด'); }}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="w-3 h-3" /> รีเซ็ต
          </button>
        )}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((doc, i) => (
            <DocCard key={doc.id} doc={doc} index={i} />
          ))}
          {filtered.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-3 text-center py-16 text-muted-foreground space-y-2">
              <BookOpen className="w-10 h-10 mx-auto opacity-30" />
              <p className="font-medium">ไม่พบเอกสาร</p>
              <p className="text-xs">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="text-[10px] text-muted-foreground text-center">
        แหล่งข้อมูล: Biochar Consortium Thailand · NSTDA · MTEC-NZE
      </p>
    </div>
  );
}

// ── Standalone page section ───────────────────────────────────────────────────
export default function DocumentsSection() {
  const { t } = useLang();
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium mb-4">
            คลังความรู้
          </span>
          <h2 className="font-space font-bold text-3xl lg:text-4xl mb-3">
            เอกสารและ<span className="text-gradient-green">แหล่งเรียนรู้</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            รวบรวมเอกสาร มาตรฐาน วิดีโอ และบทความเกี่ยวกับไบโอชาร์จากแหล่งที่เชื่อถือได้
          </p>
        </motion.div>
        <div className="bg-muted/20 rounded-3xl border border-border p-6 lg:p-8">
          <ForumZone />
        </div>
      </div>
    </section>
  );
}

export { ForumZone };
