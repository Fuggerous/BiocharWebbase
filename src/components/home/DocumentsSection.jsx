// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, Download, ExternalLink, Search, Star } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';

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
    url: 'https://www.nstda.or.th/nac/2025/seminar/nac-28/',
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

              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center">
                  <FileDown className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-green-600 text-xs font-semibold">{doc.category}</span>
              </div>

              <div>
                <h4 className="font-semibold text-sm leading-snug mb-1">{doc.title}</h4>
                <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">{doc.desc}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                {doc.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-muted border border-border text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-border">
                <a
                  href={doc.url}
                  target={doc.url && doc.url.startsWith('http') ? '_blank' : undefined}
                  rel={doc.url && doc.url.startsWith('http') ? 'noopener noreferrer' : undefined}
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
                  target={doc.url && doc.url.startsWith('http') ? '_blank' : undefined}
                  rel={doc.url && doc.url.startsWith('http') ? 'noopener noreferrer' : undefined}
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

export default function DocumentsSection() {
  const { t } = useLang();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium mb-4">
            {t('docs.badge')}
          </span>
          <h2 className="font-space font-bold text-3xl lg:text-4xl mb-3">
            {t('docs.heading')} <span className="text-gradient-green">{t('docs.headingHighlight')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('docs.desc')}
          </p>
        </motion.div>

        <div className="bg-muted/30 rounded-3xl border border-border p-6 lg:p-8">
          <ForumZone />
        </div>
      </div>
    </section>
  );
}

export { ForumZone };