// @ts-nocheck
/**
 * DocumentsSection — Research Catalog layout
 * Completely original design: vertical list + left sidebar + pagination
 * NOT a card grid.
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Video, BookOpen, Shield, Lightbulb, Youtube,
  Download, ExternalLink, Search, Star, ChevronRight,
  ChevronLeft, X, Filter,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ── Data ──────────────────────────────────────────────────────────────────────
const DOCS = [
  {
    id: 1, uploadDate: '22/05/2026', category: 'สาระน่ารู้', catKey: 'docs.cat.info', type:'website',
    title: 'กุญแจสำคัญสู่ Net Zero Emission ด้วยเทคโนโลยีไบโอชาร์ ผนึกกำลังภาครัฐ ภาควิชาการ ภาคการเกษตรและภาคอุตสาหกรรม',
    titleEn: 'Driving Progress Towards Net Zero Emissions: A Collaborative Effort Leveraging Biochar Technology, Involving Government, Academia, Agriculture, and Industry Sectors',
    desc: 'งานนำเสนอศักยภาพของเทคโนโลยีไบโอชาร์ในการลดก๊าซเรือนกระจก และส่งเสริมการพัฒนาที่ยั่งยืน โดยผู้เชี่ยวชาญจากหลากหลายภาคส่วน',
    descEn: 'The event aims to showcase the potential of biochar technology in reducing greenhouse gas emissions and promoting sustainable development.',
    tags: ['GHG', 'Biochar Consortium'], featured: false,
    url: 'https://www.nstda.or.th/nac/2025/seminar/nac-28/',
  },
  {
    id: 2, uploadDate: '22/05/2026', category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'บทบาทและแนวทางการใช้ประโยชน์ไบโอชาร์ของภาครัฐเพื่อการจัดการก๊าซเรือนกระจกสำหรับภาคเกษตร',
    titleEn: 'The Role of Biochar in Government Strategies for Greenhouse Gas Management in the Agricultural Sector',
    desc: 'บทบาท แนวทางและการสนับสนุน/ส่งเสริมของภาครัฐต่อการใช้ประโยชน์ไบโอชาร์เพื่อการจัดการก๊าซเรือนกระจกสำหรับภาคเกษตร โดย ดร.ธีรวุฒิ ชุตินันทกุล',
    descEn: 'The role, approaches, and government support for utilizing biochar in greenhouse gas management for the agricultural sector, presented by Dr. Theerawut Chutinantakul.',
    tags: ['GHG', 'Biochar Consortium', 'Net Zero'], featured: false, url: 'https://www.nstda.or.th/nac/2025/wp-content/uploads/2025/04/0900-%E0%B8%98%E0%B8%B5%E0%B8%A3%E0%B8%A7%E0%B8%B8%E0%B8%92%E0%B8%B4-%E0%B8%8A%E0%B8%B8%E0%B8%95%E0%B8%B4%E0%B8%99%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%81%E0%B8%B8%E0%B8%A5.pdf',
  },
  {
    id: 3, uploadDate: '22/05/2026', category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'มาตรฐานที่เกี่ยวข้องกับไบโอชาร์กรอบการพัฒนามาตรฐานด้านการประเมินการกักเก็บคาร์บอนของไบโอชาร์',
    titleEn: 'Biochar Standards and Carbon Sequestration Assessment Frameworks: An Overview of Relevant Standards in Biochar Development',
    desc: 'มาตรฐานที่เกี่ยวข้องกับไบโอชาร์กรอบการพัฒนามาตรฐานด้านการประเมินการกักเก็บคาร์บอนของไบโอชาร์ โดย คุณประกายธรรม สุขสถิตย์',
    descEn: 'Biochar Standards and Carbon Sequestration Assessment Frameworks: An Overview of Relevant Standards in Biochar Development by Prakaitham Suksatit.',
    tags: ['Biochar Consortium', 'Net Zero', 'Biochar Standards'], featured: false, url: 'https://www.nstda.or.th/nac/2025/wp-content/uploads/2025/04/0930-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1-%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%AA%E0%B8%96%E0%B8%B4%E0%B8%95%E0%B8%A2%E0%B9%8C.pdf',
  },
  {
    id: 4, uploadDate: '22/05/2026', category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'มาตรฐานคุณภาพไบโอชาร์ที่ใช้ในต่างประเทศและแนวทางในการพัฒนามาตรฐานในประเทศไทย',
    titleEn: 'Biochar Standards and Carbon Sequestration Assessment Frameworks: An Overview of Relevant Standards in Biochar Development by Prakaitham Suksatit',
    desc: 'มาตรฐานคุณภาพไบโอชาร์ที่ใช้ในต่างประเทศและแนวทางในการพัฒนามาตรฐานในประเทศไทย โดย ดร.เปรมฤดี กาญจนปิยะ',
    descEn: 'An overview of biochar standards and carbon sequestration assessment frameworks used internationally and the approach for developing standards in Thailand by Dr. Promchit Kanchanapinyo.',
    tags: ['Biochar Consortium', 'Net Zero', 'Biochar Standards'], featured: false, url: 'https://www.nstda.or.th/nac/2025/wp-content/uploads/2025/04/0930-%E0%B9%80%E0%B8%9B%E0%B8%A3%E0%B8%A1%E0%B8%A4%E0%B8%94%E0%B8%B5-%E0%B8%81%E0%B8%B2%E0%B8%8D%E0%B8%88%E0%B8%99%E0%B8%9B%E0%B8%B4%E0%B8%A2%E0%B8%B0.pdf',
  },
  {
    id: 5, uploadDate: '22/05/2026', category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'การออกแบบ พัฒนาและสร้างเตาไพโรไลซิสสำหรับผลิตไบโอชาร์ที่ได้ตามมาตรฐานสากล',
    titleEn: 'Design, Development, and Construction of a Pyrolysis Stove for Producing Biochar that Meets International Standards',
    desc: 'การออกแบบ พัฒนาและสร้างเตาไพโรไลซิสสำหรับผลิตไบโอชาร์ที่ได้ตามมาตรฐานสากล โดย คุณชุมพล เมฆอารี',
    descEn: 'Design, development, and construction of a pyrolysis stove for producing biochar that meets international standards by Chumphon Mekaree.',
    tags: ['Pyrolysis', 'Biochar Standards'], featured: false, url: 'https://www.nstda.or.th/nac/2025/wp-content/uploads/2025/04/1000-%E0%B8%8A%E0%B8%B8%E0%B8%A1%E0%B8%9E%E0%B8%A5-%E0%B9%80%E0%B8%A1%E0%B8%86%E0%B8%AD%E0%B8%B2%E0%B8%A3%E0%B8%B5.pdf ',
  },
  {
    id: 6, uploadDate: '22/05/2026', category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'ไบโอชาร์กักเก็บสารคีเลตจุลธาตุอาหารพืชเพื่อ พัฒนาเป็นสารปรับสภาพดินประสิทธิภาพสูง',
    titleEn: 'Biochar incorporated with plant micronutrient chelates as efficient soil conditioner',
    desc: 'ไบโอชาร์กักเก็บสารคีเลตจุลธาตุอาหารพืชเพื่อ พัฒนาเป็นสารปรับสภาพดินประสิทธิภาพสูง โดย ดร.คมสันต์ สุทธิสินทอง',
    descEn: 'Biochar incorporated with plant micronutrient chelates as efficient soil conditioner by Dr. Komsan Suttisinthong.',
    tags: ['soil conditioner', 'Factsheet'], featured: false, url: 'https://www.nstda.or.th/nac/2025/wp-content/uploads/2025/04/1030-%E0%B8%84%E0%B8%A1%E0%B8%AA%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B9%8C-%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%97%E0%B8%AD%E0%B8%87.pdf',
  },
  {
    id: 7, uploadDate: '22/05/2026', category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'การพัฒนาสารปรับปรุงบำรุงดินที่ผสมไบโอชาร์',
    titleEn: 'The development of soil conditioners mixed with biochar',
    desc: 'การพัฒนาสารปรับปรุงบำรุงดินที่ผสมไบโอชาร์ โดย ดร.สิทธิศักดิ์ ประสานพันธ์',
    descEn: 'The development of soil conditioners mixed with biochar by Dr. Sithisak Prasarnpan.',
    tags: ['Agriculture', 'Soil conditioner'], featured: false, url: 'https://www.nstda.or.th/nac/2025/wp-content/uploads/2025/04/1030-%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B8%A8%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B4%E0%B9%8C-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%AA%E0%B8%B2%E0%B8%99%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B9%8C.pdf',
  },
  {
    id: 8, uploadDate: '22/05/2026', category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'การต่อยอดธุรกิจการใช้ประโยชน์ไบโอชาร์ในการปลูกพืชเศรษฐกิจ/ปลูกอ้อย',
    titleEn: 'Business expansion in utilizing biochar for planting economic crops/sugarcane cultivation',
    desc: 'การต่อยอดธุรกิจการใช้ประโยชน์ไบโอชาร์ในการปลูกพืชเศรษฐกิจ/ปลูกอ้อย โดย คุณอภิชาติ นุชประยูร',
    descEn: 'Business expansion in utilizing biochar for planting economic crops/sugarcane cultivation by Apichat Nuchprayoon.',
    tags: ['Business', 'Agriculture'], featured: false, url: 'https://www.nstda.or.th/nac/2025/wp-content/uploads/2025/04/1100-%E0%B8%AD%E0%B8%A0%E0%B8%B4%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4-%E0%B8%99%E0%B8%B8%E0%B8%8A%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B8%B9%E0%B8%A3.pdf ',
  },
  {
    id: 9, uploadDate: '22/05/2026', category: 'เอกสาร', catKey: 'docs.cat.document', type: 'pdf',
    title: 'ไบโอชาร์สำหรับคอนกรีตดูดซับคาร์บอนไดออกไซด์',
    titleEn: 'Biochar for Carbon Removal Concrete',
    desc: 'โอกาสและทิศทางการประยุกต์ใช้ไบโอชาร์ในกลุ่มผลิตภัณฑ์ซีเมนต์ คอนกรีตและวัสดุก่อสร้าง โดย ดร.ศักดิ์ประยุทธ สินธุภิญโญ',
    descEn: 'Opportunities and Directions for Applying Biochar in Cement, Concrete, and Construction Materials by Dr. Sakdiporn Sinttham.',
    tags: ['Business', 'Construction'], featured: false, url: 'https://www.nstda.or.th/nac/2025/wp-content/uploads/2025/04/1130-%E0%B8%A8%E0%B8%B1%E0%B8%81%E0%B8%94%E0%B8%B4%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B8%B8%E0%B8%97%E0%B8%98-%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B8%A0%E0%B8%B4%E0%B8%8D%E0%B9%82%E0%B8%8D.pdf',
  },
  {
    id: 10, uploadDate: '22/05/2026', category: 'วีดีโอ', catKey: 'docs.cat.video', type: 'youtube',
    title: 'การสัมมนาหัวข้อ “กุญแจสำคัญสู่ Net Zero Emission ด้วยเทคโนโลยีไบโอชาร์ ผนึกกำลังภาครัฐ ภาควิชาการ ภาคการเกษตรและภาคอุตสาหกรรม”',
    titleEn: 'Development of Biochar Products for Household Use',
    desc: 'การพัฒนาผลิตภัณฑ์ไบโอชาร์สำหรับใช้ในครัวเรือน โดย คุณณัฐวุฒิ ศรีสุวรรณ',
    descEn: 'Development of Biochar Products for Household Use by Natthawut Srisuwan.',
    tags: ['Household', 'Biochar Products'], featured: false, url: 'https://www.youtube.com/watch?v=kOpLo2PCTMY',
  },
  {
    id: 11, uploadDate: '22/05/2026', category: 'สาระน่ารู้', catKey: 'docs.cat.info', type: 'website',
    title: 'ฐานข้อมูลไบโอชาร์ไทย',
    titleEn: 'Thai Biochar Database',
    desc: 'ศูนย์กลางการแบ่งปันข้อมูลเกี่ยวกับไบโอชาร์ในประเทศไทย',
    descEn: 'Hub for sharing information about Biochar in Thailand.',
    tags: ['Database', 'Biochar'], featured: true, url: 'https://thaibiochar.net/#home',

    
  }

];

const PER_PAGE = 4;

// ── Type + Category config ─────────────────────────────────────────────────────
const TYPE_CFG = {
  pdf:      { icon: FileText,  color: '#a855f7', label: 'PDF'      },
  video:    { icon: Video,     color: '#f59e0b', label: 'Video'    },
  youtube:  { icon: Youtube,   color: '#ef4444', label: 'YouTube'  },
  article:  { icon: Lightbulb, color: '#06b6d4', label: 'Article'  },
  website:  { icon: ExternalLink, color: '#14b8a6', label: 'Website' },
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
  const uploadDateLabel = doc.uploadDate
    ? (() => {
        const [dayStr, monthStr, yearStr] = doc.uploadDate.split('/');
        const day = Number(dayStr);
        const month = Number(monthStr);
        const year = Number(yearStr);

        if (!day || !month || !year) return null;

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[month - 1];
        if (!monthName) return null;

        return `${String(day).padStart(2, '0')}/${monthName}/${year}`;
      })()
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.04, duration: 0.15 }}
      className={`group flex items-stretch gap-4 p-4 rounded-xl border transition-all duration-150
        hover:shadow-sm hover:border-green-400/30 cursor-default
        ${doc.featured ? 'bg-gradient-to-r from-green-500/5 via-background to-background border-green-400/25' : 'bg-card border-border'}`}
    >
      {/* Left: type icon */}
      <div className="flex-shrink-0 self-start mt-0.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${typeCfg.color}20`, border: `1.5px solid ${typeCfg.color}45` }}>
          <TypeIcon className="w-4 h-4" style={{ color: typeCfg.color }} />
        </div>
      </div>

      {/* Center: content */}
      <div className="flex-1 min-w-0 self-start">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: `${catCfg.color}22`, color: catCfg.color, border: `1.5px solid ${catCfg.color}50` }}>
            {catLabel}
          </span>
          {doc.featured && (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-400/10 border border-amber-400/25 px-1.5 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5" /> {t('docs.featured')}
            </span>
          )}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto flex-shrink-0"
            style={{ background: `${typeCfg.color}15`, color: typeCfg.color, border: `1px solid ${typeCfg.color}35` }}>
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
      <div className="flex-shrink-0 self-stretch flex flex-col items-end justify-between gap-2 min-w-[92px]">
        <div className="flex items-center gap-1.5 mt-0.5">
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
        {uploadDateLabel && (
          <p className="mt-auto text-[10px] font-medium text-muted-foreground text-right whitespace-nowrap">
            Uploaded: {uploadDateLabel}
          </p>
        )}
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
    const docs = DOCS.filter(doc => {
      const matchCat    = activeCat === 'ทั้งหมด' || doc.category === activeCat;
      const matchSearch = !q || doc.title.toLowerCase().includes(q) || doc.titleEn.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
    // Keep the latest id first so new items always appear at the top.
    return docs.sort((a, b) => Number(b.id) - Number(a.id));
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
