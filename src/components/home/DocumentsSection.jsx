// @ts-nocheck
/**
 * DocumentsSection — Research Catalog layout
 * Completely original design: vertical list + left sidebar + pagination
 * NOT a card grid.
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Video, BookOpen, Shield, Lightbulb,
  Download, ExternalLink, Search, Star, ChevronRight,
  ChevronLeft, X, Filter,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ── Data ──────────────────────────────────────────────────────────────────────
const DOCS = [
  {
    id: 1, category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'บทบาทของ Biochar Consortium',
    titleEn: 'Role of the Biochar Consortium',
    desc: 'เอกสารประกอบการสัมมนา Biochar Consortium ครั้งที่ 4 — บทบาทและทิศทางของ Biochar Consortium Thailand',
    descEn: 'Seminar document from the 4th Biochar Consortium covering the role and strategic direction of the Thai Biochar Consortium.',
    tags: ['Biochar Consortium'], featured: false,
    url: 'https://www.nstda.or.th/nac/2025/seminar/nac-28/',
  },
  {
    id: 2, category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'การนำไบโอชาร์ไปใช้ในการเกษตรอินทรีย์',
    titleEn: 'Applying Biochar in Organic Agriculture',
    desc: 'เอกสารประกอบการสัมมนา Biochar Consortium ครั้งที่ 4 — การนำไบโอชาร์ไปใช้ในการเกษตรอินทรีย์',
    descEn: 'Seminar document from the 4th Biochar Consortium on biochar applications in organic farming practices.',
    tags: ['เกษตรอินทรีย์', 'Organic'], featured: false, url: '#',
  },
  {
    id: 3, category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'ไบโอชาร์ในนครพนมและจังหวัดอื่นๆ ของไทย',
    titleEn: 'Biochar in Nakhon Phanom and Other Thai Provinces',
    desc: 'เอกสารประกอบการสัมมนา Biochar Consortium ครั้งที่ 4 — Biochar in Nakhon Phanom and other provinces',
    descEn: 'Seminar document covering biochar use across Nakhon Phanom and other provinces in Thailand.',
    tags: ['นครพนม', 'Thailand'], featured: false, url: '#',
  },
  {
    id: 4, category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'ผลของการใช้ไบโอชาร์ต่อการปลูกข้าวในพื้นที่ดินเค็ม',
    titleEn: 'Biochar Effects on Rice in Salt-Affected Soils of Thailand',
    desc: 'ผลของการใช้ไบโอชาร์ต่อการปลูกข้าวในพื้นที่ดินเค็มของประเทศไทยและความท้าทายในอนาคต',
    descEn: 'Research on biochar effects on rice cultivation in salt-affected soils of Thailand and future challenges.',
    tags: ['ดินเค็ม', 'ข้าว', 'Rice'], featured: false, url: '#',
  },
  {
    id: 5, category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'ผลกระทบของไบโอชาร์ต่อการปล่อยก๊าซเรือนกระจก',
    titleEn: 'Biochar Impact on GHG Emissions and Thai Crop Yields',
    desc: 'ผลกระทบของการใช้ไบโอชาร์ต่อการปล่อยก๊าซเรือนกระจกและผลผลิตพืชเกษตรไทย',
    descEn: 'Study on how biochar application affects greenhouse gas emissions and agricultural yields in Thailand.',
    tags: ['GHG', 'เกษตร', 'Agriculture'], featured: false, url: '#',
  },
  {
    id: 6, category: 'สาระน่ารู้', catKey: 'docs.cat.info', type: 'article',
    title: 'สรุปข้อมูลสำคัญ — ไบโอชาร์',
    titleEn: 'Biochar Key Facts Factsheet (MTEC-NZE)',
    desc: 'สรุปข้อมูลสำคัญ (Factsheet) ภายใต้ยุทธศาสตร์ MTEC-NZE Biochar เพื่อยกระดับไบโอชาร์ไทย',
    descEn: 'Key facts factsheet from the MTEC-NZE Biochar Strategy for upgrading Thailand\'s biochar sector.',
    tags: ['MTEC', 'Factsheet'], featured: true, url: '#',
  },
  {
    id: 7, category: 'มาตรฐาน', catKey: 'docs.cat.standard', type: 'standard',
    title: 'มาตรฐานไบโอชาร์ระดับสากล (EBC / IBI)',
    titleEn: 'International Biochar Standards — EBC / IBI',
    desc: 'ภาพรวมมาตรฐานคุณภาพไบโอชาร์ตามเกณฑ์ European Biochar Certificate และ International Biochar Initiative',
    descEn: 'Overview of biochar quality standards under the European Biochar Certificate (EBC) and IBI frameworks.',
    tags: ['EBC', 'IBI', 'Standards'], featured: false, url: '#',
  },
  {
    id: 8, category: 'วีดีโอ', catKey: 'docs.cat.video', type: 'video',
    title: 'แนะนำไบโอชาร์',
    titleEn: 'Introduction to Biochar — Video Guide',
    desc: 'วิดีโอแนะนำเกี่ยวกับไบโอชาร์ ประโยชน์และการนำไปใช้ในภาคเกษตรกรรมและสิ่งแวดล้อม',
    descEn: 'Video guide introducing biochar, its benefits, and applications in agriculture and environmental management.',
    tags: ['Video', 'Intro'], featured: false, url: '#',
  },
];

const PER_PAGE = 4;

// ── Type + Category config ─────────────────────────────────────────────────────
const TYPE_CFG = {
  pdf:      { icon: FileText,  color: '#a855f7', label: 'PDF'      },
  video:    { icon: Video,     color: '#f59e0b', label: 'Video'    },
  article:  { icon: Lightbulb, color: '#06b6d4', label: 'Article'  },
  standard: { icon: Shield,    color: '#3b82f6', label: 'Standard' },
};

const CATS = [
  { thKey: 'ทั้งหมด',    tKey: 'docs.cat.all',      color: '#22c55e' },
  { thKey: 'มาตรฐาน',   tKey: 'docs.cat.standard', color: '#3b82f6' },
  { thKey: 'เอกสาร',    tKey: 'docs.cat.document', color: '#a855f7' },
  { thKey: 'วีดีโอ',    tKey: 'docs.cat.video',    color: '#f59e0b' },
  { thKey: 'สาระน่ารู้', tKey: 'docs.cat.info',     color: '#06b6d4' },
];

function getCat(thKey) {
  return CATS.find(c => c.thKey === thKey) ?? CATS[0];
}

// ── Catalog Row ───────────────────────────────────────────────────────────────
function CatalogRow({ doc, index, lang, t }) {
  const typeCfg  = TYPE_CFG[doc.type] ?? TYPE_CFG.pdf;
  const catCfg   = getCat(doc.category);
  const TypeIcon = typeCfg.icon;
  const title    = lang === 'en' ? doc.titleEn : doc.title;
  const desc     = lang === 'en' ? (doc.descEn ?? doc.desc) : doc.desc;
  const catLabel = t(doc.catKey) ?? doc.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.04, duration: 0.15 }}
      className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-150
        hover:shadow-sm hover:border-green-400/30 cursor-default
        ${doc.featured ? 'bg-gradient-to-r from-green-500/5 via-background to-background border-green-400/25' : 'bg-card border-border'}`}
    >
      {/* Left: type icon */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${typeCfg.color}12`, border: `1.5px solid ${typeCfg.color}30` }}>
          <TypeIcon className="w-4 h-4" style={{ color: typeCfg.color }} />
        </div>
      </div>

      {/* Center: content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${catCfg.color}12`, color: catCfg.color, border: `1px solid ${catCfg.color}25` }}>
            {catLabel}
          </span>
          {doc.featured && (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-400/10 border border-amber-400/25 px-1.5 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5" /> {t('docs.featured')}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto flex-shrink-0">
            {typeCfg.label}
          </span>
        </div>

        <h4 className="font-space font-semibold text-sm leading-snug mb-1
          group-hover:text-green-600 transition-colors line-clamp-1">
          {title}
        </h4>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {doc.tags.map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex-shrink-0 flex items-center gap-1.5 mt-0.5">
        <a href={doc.url}
          target={doc.url?.startsWith('http') ? '_blank' : undefined}
          rel={doc.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
            transition-all whitespace-nowrap
            ${doc.featured
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-muted border border-border hover:bg-green-500 hover:text-white hover:border-green-500'}`}
        >
          <ExternalLink className="w-3 h-3" />
          {t('kc.docs.open')}
        </a>
        <a href={doc.url}
          target={doc.url?.startsWith('http') ? '_blank' : undefined}
          rel={doc.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-muted border border-border
            hover:bg-green-500/10 hover:border-green-400 hover:text-green-600 transition-all text-muted-foreground"
          title={t('docs.download')}
        >
          <Download className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

// ── ForumZone ─────────────────────────────────────────────────────────────────
function ForumZone() {
  const { t, i18n }     = useTranslation();
  const [activeCat, setActiveCat] = useState('ทั้งหมด');
  const [search,    setSearch]    = useState('');
  const [page,      setPage]      = useState(1);
  const [sideOpen,  setSideOpen]  = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return DOCS.filter(doc => {
      const matchCat    = activeCat === 'ทั้งหมด' || doc.category === activeCat;
      const matchSearch = !q || doc.title.toLowerCase().includes(q) || doc.titleEn.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCat, search]);

  // Always clamp page to valid range when filtered list changes
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageDocs    = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const counts = useMemo(() => {
    const c = { 'ทั้งหมด': DOCS.length };
    DOCS.forEach(d => { c[d.category] = (c[d.category] ?? 0) + 1; });
    return c;
  }, []);

  // Reset to page 1 whenever filter/search changes
  const changeCat    = (key) => { setActiveCat(key); setPage(1); };
  const changeSearch = (v)   => { setSearch(v);      setPage(1); };
  const goToPage     = (p)   => setPage(Math.max(1, Math.min(totalPages, p)));

  // Sidebar panel content (shared between slide-out and inline)
  const SidebarContent = (
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
        <Filter className="w-3 h-3" /> {i18n.language === 'en' ? 'Categories' : 'หมวดหมู่'}
      </p>
      {CATS.map(cat => {
        const active = activeCat === cat.thKey;
        const count  = counts[cat.thKey] ?? 0;
        return (
          <button key={cat.thKey}
            onClick={() => { changeCat(cat.thKey); setSideOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium
              transition-all text-left gap-2
              ${active ? 'text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            style={active ? { background: cat.color } : {}}
          >
            <span className="truncate">{t(cat.tKey)}</span>
            <span className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-bold
              ${active ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
              {count}
            </span>
          </button>
        );
      })}
      <div className="pt-3 mt-2 border-t border-border space-y-2">
        {[
          { label: i18n.language === 'en' ? 'Total' : 'รวมทั้งหมด', value: DOCS.length },
          { label: i18n.language === 'en' ? 'Featured' : 'แนะนำ',    value: DOCS.filter(d => d.featured).length },
        ].map(s => (
          <div key={s.label} className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">{s.label}</span>
            <span className="font-bold text-foreground">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col gap-4 min-h-[480px]">

      {/* ── Top bar: search + filter toggle ── */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text" value={search} onChange={e => changeSearch(e.target.value)}
            placeholder={t('kc.docs.search')}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-muted border border-border text-sm
              focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
          {search && (
            <button onClick={() => changeSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter toggle button */}
        <button
          onClick={() => setSideOpen(o => !o)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border
            transition-all flex-shrink-0 ${sideOpen
              ? 'bg-green-500 text-white border-green-500'
              : 'bg-muted border-border text-muted-foreground hover:text-foreground hover:border-green-400'
            }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">{i18n.language === 'en' ? 'Filter' : 'กรอง'}</span>
          {activeCat !== 'ทั้งหมด' && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
              ${sideOpen ? 'bg-white/20 text-white' : 'bg-green-500/20 text-green-600'}`}>
              1
            </span>
          )}
        </button>
      </div>

      {/* ── Main area: slide-out filter + list ── */}
      <div className="flex gap-0 flex-1 overflow-hidden">

        {/* Slide-out filter panel */}
        <AnimatePresence initial={false}>
          {sideOpen && (
            <motion.aside
              key="filter-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 176, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="flex-shrink-0 overflow-hidden"
            >
              <div className="w-44 pr-4 border-r border-border h-full pt-1">
                {SidebarContent}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Content column */}
        <div className={`flex-1 flex flex-col gap-3 min-w-0 ${sideOpen ? 'pl-4' : ''}`}>

          {/* Result info */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              {t('docs.showing')}{' '}
              <strong className="text-foreground">{Math.min((currentPage-1)*PER_PAGE+1, filtered.length)}–{Math.min(currentPage*PER_PAGE, filtered.length)}</strong>
              {' '}{i18n.language==='en'?'of':'/'}
              {' '}<strong className="text-foreground">{filtered.length}</strong>
              {' '}{t('docs.items')}
              {search && <> · "<span className="text-green-600">{search}</span>"</>}
            </span>
            {(search || activeCat !== 'ทั้งหมด') && (
              <button onClick={() => { changeSearch(''); changeCat('ทั้งหมด'); }}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-3 h-3" /> {t('docs.reset')}
              </button>
            )}
          </div>

          {/* Document list */}
          <div className="flex flex-col gap-2 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`page-${currentPage}-${activeCat}-${search}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-2">
                {pageDocs.length > 0 ? (
                  pageDocs.map((doc, i) => (
                    <CatalogRow key={doc.id} doc={doc} index={i} lang={i18n.language} t={t} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                    <BookOpen className="w-10 h-10 opacity-25" />
                    <p className="font-medium text-sm">{t('docs.notfound')}</p>
                    <p className="text-xs">{t('docs.notfound.hint')}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                  border border-border bg-muted hover:bg-green-500/10 hover:border-green-400 hover:text-green-600
                  disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{i18n.language === 'en' ? 'Prev' : 'ก่อนหน้า'}</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => goToPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      p === currentPage
                        ? 'bg-green-500 text-white shadow-sm shadow-green-500/30'
                        : 'bg-muted border border-border text-muted-foreground hover:border-green-400 hover:text-foreground'
                    }`}>
                    {p}
                  </button>
                ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                border border-border bg-muted hover:bg-green-500/10 hover:border-green-400 hover:text-green-600
                disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {i18n.language === 'en' ? 'Next' : 'ถัดไป'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}

// ── Standalone section ─────────────────────────────────────────────────────────
export default function DocumentsSection() {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20
            text-green-600 text-sm font-medium mb-4">{t('docs.badge')}</span>
          <h2 className="font-space font-bold text-3xl lg:text-4xl mb-3">
            {t('docs.heading')} <span className="text-gradient-green">{t('docs.headingHighlight')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('docs.desc')}</p>
        </motion.div>
        <div className="glass-card rounded-3xl border border-border p-6 lg:p-8">
          <ForumZone />
        </div>
      </div>
    </section>
  );
}

export { ForumZone };
