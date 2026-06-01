// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HelpCircle, ChevronDown, FlaskConical, BarChart3, Layers,
  Database, Beaker, MessageCircle, ArrowRight, Sparkles,
  BrainCircuit, Leaf, BookOpen,
} from 'lucide-react';

/* ─── Q&A data ─────────────────────────────────────────────────────────────── */
const CATEGORIES_EN = [
  {
    id: 'general',
    icon: HelpCircle,
    color: 'green',
    label: 'General',
    questions: [
      {
        q: 'What is BiocharInformaticsThailand?',
        a: 'BiocharInformaticsThailand is a free, open-access AI-powered platform for biochar CO₂ adsorption research. It consolidates 1,396 peer-reviewed experimental records into one searchable database and wraps three machine-learning tools around that data — CO₂ Predictor, Property Estimator, and Materials Advisor — so researchers can get instant, evidence-based predictions without needing coding skills.',
      },
      {
        q: 'Is BiocharInformaticsThailand free to use?',
        a: 'Yes — completely free with no registration, no login, and no usage limits. All 1,396 database records and all three ML tools are publicly accessible.',
      },
      {
        q: 'Who should use this platform?',
        a: 'BiocharInformaticsThailand is designed for researchers, graduate students, environmental engineers, policy analysts, educators, and anyone working with biochar, carbon capture, or sustainable agriculture. The platform supports both expert users and those new to the field.',
      },
      {
        q: 'Where does the data come from?',
        a: 'Every record is sourced from a peer-reviewed journal article (2010–2024). Each entry includes a DOI link to its source publication so you can verify any value against the original experiment. No data is synthesised — all values are real measurements.',
      },
    ],
  },
  {
    id: 'predictor',
    icon: BarChart3,
    color: 'green',
    label: 'CO₂ Predictor',
    questions: [
      {
        q: 'How does the CO₂ Predictor work?',
        a: 'The predictor uses a k-Nearest Neighbour (kNN) algorithm. It encodes your inputs (feedstock, pyrolysis temperature, activation method, BET surface area, adsorption temperature) into a feature vector, then finds the k most similar experiments in the 1,396-record database and returns a distance-weighted average of their CO₂ uptake values as the prediction.',
      },
      {
        q: 'What does the Similarity Score mean?',
        a: 'Similarity Score (0–1) measures how closely the database can match your inputs. Above 0.85 = high confidence. 0.65–0.85 = moderate confidence. Below 0.65 = sparse region — treat the result as a rough estimate and consider running a laboratory experiment to validate.',
      },
      {
        q: 'What is the difference between CO₂ Predictor and Property Estimator?',
        a: 'CO₂ Predictor outputs one value — expected CO₂ adsorption capacity (mmol/g). Property Estimator outputs five structural properties (BET surface area, pore volume, average pore size, carbon content, yield). Best workflow: run Property Estimator first, then feed its BET output into the CO₂ Predictor for a more accurate estimate.',
      },
      {
        q: 'Can I use these predictions in a published paper?',
        a: 'Yes, with appropriate citation of the platform and acknowledgement that results are ML-derived estimates from peer-reviewed data. Key predictions should be validated with a laboratory experiment before publication.',
      },
    ],
  },
  {
    id: 'property',
    icon: FlaskConical,
    color: 'amber',
    label: 'Property Estimator',
    questions: [
      {
        q: 'What properties does the Property Estimator predict?',
        a: 'Five properties: BET Surface Area (m²/g), Pore Volume (cm³/g), Average Pore Size (nm), Carbon Content (%), and Biochar Yield (%). Each is estimated by matching your production conditions against the database using statistical lookup and ML regression models.',
      },
      {
        q: 'Why is BET Surface Area the most important predicted property?',
        a: 'BET surface area is the single strongest predictor of CO₂ uptake. Values above 1,000 m²/g (achievable with KOH activation) are reliably associated with CO₂ uptake above 4 mmol/g. Values below 200 m²/g (unactivated, low-temperature chars) rarely exceed 2 mmol/g.',
      },
      {
        q: 'How can I use the Property Estimator together with the CO₂ Predictor?',
        a: 'Run Property Estimator first with your planned production conditions → note the predicted BET surface area → enter that BET value in the CO₂ Predictor as an input. This two-step chain significantly reduces prediction uncertainty compared to running the CO₂ Predictor without a BET value.',
      },
    ],
  },
  {
    id: 'advisor',
    icon: Layers,
    color: 'violet',
    label: 'Materials Advisor',
    questions: [
      {
        q: 'What is the Materials Advisor and when should I use it?',
        a: 'The Materials Advisor inverts the prediction problem. Instead of "given these conditions, what performance do I get?", you specify a performance target and ask "what conditions should I use?". Use it when you want to discover the optimal feedstock and process route for a CO₂ capture goal.',
      },
      {
        q: 'How does the recommendation algorithm work?',
        a: 'Three stages: (1) Filter — remove records that violate your constraints. (2) Rank — sort remaining records by target metric (CO₂ uptake, BET area, or yield). (3) Cluster — group results by process similarity so recommendations represent distinct strategies rather than slight variations of the same experiment.',
      },
      {
        q: 'Can I constrain recommendations to locally available feedstocks?',
        a: 'Yes. The feedstock filter lets you limit recommendations to specific biomass types. For Thailand-based research, filtering to rice husk, sugarcane bagasse, corn straw, or palm shell returns recommendations grounded entirely in those feedstocks.',
      },
    ],
  },
  {
    id: 'science',
    icon: Beaker,
    color: 'teal',
    label: 'Science',
    questions: [
      {
        q: 'What is biochar and how is it made?',
        a: 'Biochar is a solid carbon-rich material produced by heating biomass (agricultural residues, wood, sewage sludge, etc.) at 300–900°C in an oxygen-limited environment — a process called pyrolysis. The result is a highly porous, aromatic carbon structure with a large internal surface area ideal for CO₂ adsorption.',
      },
      {
        q: 'What does mmol/g actually mean in physical terms?',
        a: '1 mmol/g ≈ 44 mg of CO₂ per gram of biochar ≈ 22 mL of CO₂ gas at standard conditions. Reference: < 1.5 mmol/g = very low; 1.5–3.0 = low–moderate; 3.0–5.0 = good; 5.0–7.0 = high; > 7.0 = exceptional (top 5% of database).',
      },
      {
        q: 'How does chemical activation improve CO₂ adsorption?',
        a: 'Raw biochar has surface areas of 100–400 m²/g. Chemical activation (KOH or K₂CO₃) etches and opens additional micropores, raising surface area to 500–3,500 m²/g. KOH creates abundant micropores (< 2 nm) — the most effective pore size for CO₂ physisorption at ambient pressure.',
      },
    ],
  },
];

const CATEGORIES_TH = [
  {
    id: 'general',
    icon: HelpCircle,
    color: 'green',
    label: 'ทั่วไป',
    questions: [
      {
        q: 'BiocharInformaticsThailand คืออะไร?',
        a: 'BiocharInformaticsThailand คือแพลตฟอร์มที่ขับเคลื่อนด้วย AI แบบเปิดและฟรีสำหรับการวิจัยการดูดซับ CO₂ ของไบโอชาร์ รวบรวมระเบียนการทดลองที่ผ่านการตรวจสอบ 1,396 รายการพร้อมเครื่องมือ ML สามชุด',
      },
      {
        q: 'BiocharInformaticsThailand ใช้งานฟรีหรือไม่?',
        a: 'ใช่ — ฟรีอย่างสมบูรณ์ ไม่ต้องลงทะเบียน ไม่ต้องเข้าสู่ระบบ และไม่มีขีดจำกัดการใช้งาน ระเบียนฐานข้อมูลทั้ง 1,396 รายการและเครื่องมือ ML ทั้งสามชุดเข้าถึงได้โดยสาธารณะ',
      },
      {
        q: 'ใครควรใช้แพลตฟอร์มนี้?',
        a: 'BiocharInformaticsThailand ออกแบบมาสำหรับนักวิจัย นักศึกษาระดับบัณฑิต วิศวกรสิ่งแวดล้อม นักวิเคราะห์นโยบาย นักการศึกษา และทุกคนที่ทำงานกับไบโอชาร์ การดักจับคาร์บอน หรือเกษตรกรรมยั่งยืน',
      },
      {
        q: 'ข้อมูลมาจากไหน?',
        a: 'ทุกระเบียนมาจากบทความวิชาการที่ผ่านการตรวจสอบ (ปี 2010–2024) แต่ละรายการมีลิงก์ DOI ไปยังสิ่งพิมพ์ต้นฉบับ ไม่มีข้อมูลสังเคราะห์ — ค่าทั้งหมดเป็นการวัดจริง',
      },
    ],
  },
  {
    id: 'predictor',
    icon: BarChart3,
    color: 'green',
    label: 'ตัวพยากรณ์ CO₂',
    questions: [
      {
        q: 'ตัวพยากรณ์ CO₂ ทำงานอย่างไร?',
        a: 'ตัวพยากรณ์ใช้อัลกอริทึม k-Nearest Neighbour (kNN) โดยเข้ารหัสอินพุตเป็นเวกเตอร์ฟีเจอร์ จากนั้นค้นหาการทดลองที่คล้ายกันที่สุด k รายการในฐานข้อมูล 1,396 ระเบียน และส่งคืนค่าเฉลี่ยถ่วงน้ำหนักของค่าการดูดซับ CO₂',
      },
      {
        q: 'คะแนนความคล้ายคลึงหมายความว่าอะไร?',
        a: 'คะแนนความคล้ายคลึง (0–1) วัดว่าฐานข้อมูลจับคู่อินพุตของคุณได้ดีแค่ไหน เกิน 0.85 = ความเชื่อมั่นสูง, 0.65–0.85 = ปานกลาง, ต่ำกว่า 0.65 = ภูมิภาคที่กระจัดกระจาย',
      },
      {
        q: 'ความแตกต่างระหว่าง CO₂ Predictor และ Property Estimator คืออะไร?',
        a: 'CO₂ Predictor ให้ผลลัพธ์หนึ่งค่า — ความจุการดูดซับ CO₂ (mmol/g) Property Estimator ให้คุณสมบัติโครงสร้างห้าประการ แนวทางที่ดีที่สุดคือรัน Property Estimator ก่อน แล้วป้อนค่า BET เข้าสู่ CO₂ Predictor',
      },
    ],
  },
  {
    id: 'property',
    icon: FlaskConical,
    color: 'amber',
    label: 'ประเมินคุณสมบัติ',
    questions: [
      {
        q: 'เครื่องมือประเมินคุณสมบัติพยากรณ์อะไรบ้าง?',
        a: 'คุณสมบัติห้าประการ: พื้นที่ผิว BET (m²/g), ปริมาตรรูพรุน (cm³/g), ขนาดรูพรุนเฉลี่ย (nm), ปริมาณคาร์บอน (%) และผลได้ไบโอชาร์ (%) แต่ละรายการประมาณจากการจับคู่เงื่อนไขการผลิตกับฐานข้อมูล',
      },
      {
        q: 'ฉันจะใช้ Property Estimator ร่วมกับ CO₂ Predictor ได้อย่างไร?',
        a: 'เรียกใช้ Property Estimator ก่อนด้วยเงื่อนไขการผลิต → จดพื้นที่ผิว BET ที่พยากรณ์ → ป้อนค่า BET นั้นเข้าสู่ CO₂ Predictor แนวทางสองขั้นตอนนี้ลดความไม่แน่นอนอย่างมาก',
      },
    ],
  },
  {
    id: 'advisor',
    icon: Layers,
    color: 'violet',
    label: 'ที่ปรึกษาวัสดุ',
    questions: [
      {
        q: 'ที่ปรึกษาวัสดุคืออะไรและควรใช้เมื่อใด?',
        a: 'ที่ปรึกษาวัสดุพลิกกลับปัญหาการพยากรณ์ แทนที่จะถามว่าด้วยเงื่อนไขเหล่านี้จะได้ประสิทธิภาพอะไร คุณระบุเป้าหมายประสิทธิภาพและถามว่าควรใช้เงื่อนไขอะไร',
      },
      {
        q: 'ฉันสามารถจำกัดคำแนะนำให้เฉพาะวัตถุดิบที่มีในท้องถิ่นได้หรือไม่?',
        a: 'ได้ ตัวกรองวัตถุดิบช่วยให้จำกัดคำแนะนำเป็นชนิดชีวมวลเฉพาะ สำหรับการวิจัยในไทย การกรองเป็นแกลบข้าว ชานอ้อย ซังข้าวโพด หรือเปลือกปาล์ม',
      },
    ],
  },
  {
    id: 'science',
    icon: Beaker,
    color: 'teal',
    label: 'วิทยาศาสตร์',
    questions: [
      {
        q: 'ไบโอชาร์คืออะไรและผลิตอย่างไร?',
        a: 'ไบโอชาร์คือวัสดุคาร์บอนแข็งที่ผลิตโดยการให้ความร้อนชีวมวลที่ 300–900°C ในสภาพแวดล้อมที่จำกัดออกซิเจน กระบวนการที่เรียกว่าไพโรไลซิส ให้โครงสร้างคาร์บอนที่มีรูพรุนสูงพร้อมพื้นที่ผิวภายในขนาดใหญ่',
      },
      {
        q: 'mmol/g หมายความว่าอะไรในแง่กายภาพ?',
        a: '1 mmol/g ≈ CO₂ 44 mg ต่อไบโอชาร์ 1 กรัม ≈ CO₂ 22 mL ที่สภาวะมาตรฐาน ค่าอ้างอิง: < 1.5 = ต่ำมาก; 1.5–3.0 = ต่ำถึงปานกลาง; 3.0–5.0 = ดี; > 7.0 = ยอดเยี่ยม (5% ด้านบนของฐานข้อมูล)',
      },
    ],
  },
];

/* ─── colour maps ───────────────────────────────────────────────────────────── */
const COLOR_MAP = {
  green:  { badge: 'bg-green-100 border-green-300 text-green-700',   dot: 'bg-green-500',  glow: 'hover:border-green-400/60',  accent: 'text-green-600',  activeBg: 'bg-green-50 border-green-200' },
  amber:  { badge: 'bg-amber-100 border-amber-300 text-amber-700',   dot: 'bg-amber-500',  glow: 'hover:border-amber-400/60',  accent: 'text-amber-600',  activeBg: 'bg-amber-50 border-amber-200' },
  violet: { badge: 'bg-violet-100 border-violet-300 text-violet-700', dot: 'bg-violet-500', glow: 'hover:border-violet-400/60', accent: 'text-violet-600', activeBg: 'bg-violet-50 border-violet-200' },
  teal:   { badge: 'bg-teal-100 border-teal-300 text-teal-700',      dot: 'bg-teal-500',   glow: 'hover:border-teal-400/60',   accent: 'text-teal-600',   activeBg: 'bg-teal-50 border-teal-200' },
};

/* ─── Accordion item ────────────────────────────────────────────────────────── */
function AccordionItem({ q, a, color, index }) {
  const [open, setOpen] = useState(false);
  const c = COLOR_MAP[color] ?? COLOR_MAP.green;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border border-border bg-card transition-all duration-200 ${open ? 'shadow-md' : 'hover:shadow-sm'} ${c.glow}`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-3 px-5 py-4 text-left"
      >
        <div className={`mt-0.5 w-5 h-5 rounded-full ${c.dot} flex-shrink-0 flex items-center justify-center`}>
          <MessageCircle className="w-2.5 h-2.5 text-white" />
        </div>
        <span className="flex-1 font-semibold text-sm text-foreground leading-snug">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed ml-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── FAQSection (home page) ────────────────────────────────────────────────── */
export default function FAQSection() {
  const { i18n } = useTranslation();
  const isThai = i18n.language === 'th';
  const CATEGORIES = isThai ? CATEGORIES_TH : CATEGORIES_EN;
  const [activeCategory, setActiveCategory] = useState('general');
  const active = CATEGORIES.find(c => c.id === activeCategory) ?? CATEGORIES[0];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-background to-emerald-50/20 dark:from-emerald-950/20 dark:via-background dark:to-background" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      <div className="absolute top-20 right-0 w-72 h-72 bg-emerald-200/15 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-300 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-green-600" />
            <span className="text-green-700 text-sm font-semibold">
              {isThai ? 'ศูนย์ช่วยเหลือ' : 'Help Centre · FAQ'}
            </span>
          </div>
          <h2 className="font-space font-black text-4xl lg:text-5xl text-foreground mb-4 leading-tight">
            {isThai ? 'ถาม & ' : 'Questions & '}
            <span className="text-gradient-green">
              {isThai ? 'ตอบ' : 'Answers'}
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {isThai
              ? 'ค้นหาคำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับแพลตฟอร์ม เครื่องมือ ML และวิทยาศาสตร์ไบโอชาร์'
              : 'Find answers to common questions about the platform, ML tools, and the science behind biochar CO₂ adsorption research.'}
          </p>
        </motion.div>

        {/* ── Category pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2.5 mb-10"
        >
          {CATEGORIES.map((cat, i) => {
            const c = COLOR_MAP[cat.color] ?? COLOR_MAP.green;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ scale: 1.04 }}
                transition={{ delay: i * 0.05 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                  isActive
                    ? `${c.badge} shadow-sm scale-105`
                    : 'bg-white/80 border-border text-muted-foreground hover:border-green-300 hover:text-foreground'
                }`}
              >
                <cat.icon className={`w-3.5 h-3.5 ${isActive ? c.accent : ''}`} />
                {cat.label}
                <span className="text-xs opacity-60 font-normal">({cat.questions.length})</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Questions ── */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Category heading */}
              <div className="flex items-center gap-2.5 mb-6">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${(COLOR_MAP[active.color] ?? COLOR_MAP.green).badge}`}>
                  <active.icon className={`w-4.5 h-4.5 ${(COLOR_MAP[active.color] ?? COLOR_MAP.green).accent}`} />
                </div>
                <h3 className="font-space font-bold text-xl text-foreground">{active.label}</h3>
                <span className="text-sm text-muted-foreground">
                  · {active.questions.length} {isThai ? 'คำถาม' : 'questions'}
                </span>
              </div>

              <div className="space-y-3">
                {active.questions.map((item, i) => (
                  <AccordionItem
                    key={i}
                    q={item.q}
                    a={item.a}
                    color={active.color}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {/* Still need help */}
          <div className="rounded-2xl bg-white border border-green-200 p-5 shadow-sm">
            <BookOpen className="w-6 h-6 text-green-600 mb-2" />
            <p className="font-space font-bold text-sm text-foreground mb-1">
              {isThai ? 'ยังต้องการความช่วยเหลือ?' : 'Still need help?'}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              {isThai ? 'ติดต่อทีมวิจัยผ่านหน้า About' : 'Reach the research team via the About page.'}
            </p>
            <Link to="/about" className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors">
              {isThai ? 'ไปที่หน้า About' : 'Visit About page'} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Full FAQ */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white shadow-sm">
            <HelpCircle className="w-6 h-6 text-green-400 mb-2" />
            <p className="font-space font-bold text-sm mb-1">
              {isThai ? 'ดู Q&A ทั้งหมด' : 'View All Q&A'}
            </p>
            <p className="text-xs text-white/60 mb-3">
              {isThai ? '29 คำถาม · 6 หมวดหมู่' : '29 questions · 6 categories'}
            </p>
            <Link to="/faq" className="inline-flex items-center gap-1 text-xs font-semibold bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1.5 rounded-lg transition-colors">
              {isThai ? 'เปิดหน้า Q&A' : 'Open Help Centre'} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Try the tools */}
          <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-5 text-white shadow-sm">
            <Leaf className="w-6 h-6 text-white/80 mb-2" />
            <p className="font-space font-bold text-sm mb-1">
              {isThai ? 'พร้อมเริ่มต้นแล้ว?' : 'Ready to get started?'}
            </p>
            <p className="text-xs text-white/70 mb-3">
              {isThai ? 'สำรวจฐานข้อมูลหรือเรียกใช้การพยากรณ์' : 'Run a prediction or explore the database.'}
            </p>
            <div className="flex gap-2">
              <Link to="/predictor" className="inline-flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-lg transition-colors">
                <BrainCircuit className="w-3 h-3" /> {isThai ? 'พยากรณ์' : 'Predict'}
              </Link>
              <Link to="/database" className="inline-flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-lg transition-colors">
                <Database className="w-3 h-3" /> {isThai ? 'ฐานข้อมูล' : 'Database'}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
