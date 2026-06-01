// @ts-nocheck
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Target, Globe, Brain, Database, LogOut, ExternalLink, X, Users } from 'lucide-react';
import { useState } from 'react';
import { useRole } from '../lib/RoleContext';
import { TOTAL_DATA_POINTS, TOTAL_EXPERIMENTS, DB_OVERALL_MAX } from '../lib/biocharKnowledgeBase';
import { useTranslation } from 'react-i18next';

// ─── Network partners — add entries here to populate the slider ──────────────
// Each partner: { name, initials, color, tagline, desc, url (optional), logo (optional filename in src/assets/images/) }
const PARTNERS = [
  {
    name: 'OPS-MHESI',
    initials: 'OPS-MHESI',
    color: 'from-blue-500 to-cyan-600',
    tagline: 'Office of the Permanent Secretary of the Ministry of Higher Education, Science, Research and Innovation, Thailand',
    desc: 'This platform has been financially supported by the grant from Research Network Sandbox 2 [R2568A103], Naresuan University and the Office of the Permanent Secretary (OPS) of the Ministry of Higher Education, Science, Research, and Innovation (MHESI)',
    url: 'https://www.ops.go.th',
    logo: '01-OPS MHESI.png',
  },
  {
    name: 'Naresuan University',
    initials: 'NU',
    color: 'from-green-500 to-emerald-600',
    tagline: 'Naresuan University, Thailand',
    desc: 'This platform has been financially supported by the grant from Research Network Sandbox 2 [R2568A103], Naresuan University and the Office of the Permanent Secretary (OPS) of the Ministry of Higher Education, Science, Research, and Innovation (MHESI)',
    url: 'https://www.nu.ac.th/',
    logo: '02-NULOGO-Download.png',
  },
  {
    name: '2nd Research Network Sandbox',
    initials: '',
    color: 'from-green-500 to-emerald-600',
    tagline: 'by OPS MHESI X NU',
    desc: 'A group of researchers across Universities in Thailand.',
    url: 'https://bit.ly/4d74oaA?r=qr',
    logo: '03-LINE_ALBUM_logo_250217_2.jpg',
  },
  {
    name: 'Petroleum and Petrochemical College',
    initials: 'PPC',
    color: 'from-green-500 to-emerald-600',
    tagline: 'Chulalongkorn University · Bangkok, Thailand',
    desc: 'The Petroleum and Petrochemical College (PPC) at Chulalongkorn University is the host institution for this research. PPC specialises in petroleum, petrochemical, and materials engineering — providing laboratory facilities, academic supervision, and research infrastructure for the BiocharInformaticsThailand project.',
    url: 'https://www.ppc.chula.ac.th',
    logo: 'ppc.png',
  },
];

// Pre-bundle ALL images in assets/images/ so Vite includes them — supports any extension
const logoModules = import.meta.glob('../assets/images/*', { eager: true });
const getLogoUrl = (filename) => {
  const mod = logoModules[`../assets/images/${filename}`];
  return mod?.default ?? null;
};

// Partner avatar — shows logo image if available, falls back to initials
function PartnerAvatar({ partner, size = 'card' }) {
  const [imgError, setImgError] = useState(false);
  const logoUrl = partner.logo ? getLogoUrl(partner.logo) : null;
  const showLogo = logoUrl && !imgError;

  const sizeClasses = size === 'modal'
    ? 'w-16 h-16 rounded-2xl text-xl mb-0'
    : 'w-14 h-14 rounded-2xl text-lg mb-4 group-hover:scale-105 transition-transform';

  if (showLogo) {
    return (
      <div className={`${sizeClasses} bg-white border border-border flex items-center justify-center shadow-md overflow-hidden flex-shrink-0`}>
        <img
          src={logoUrl}
          alt={partner.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-1.5"
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses} bg-gradient-to-br ${partner.color} flex items-center justify-center text-white font-bold shadow-md flex-shrink-0`}>
      {partner.initials}
    </div>
  );
}

const COPY = {
  en: {
    heroTitle1: 'About',
    heroTitle2: 'BiocharInformaticsThailand',
    heroDesc: 'An AI-driven biochar informatics platform for adsorbent design — built at Chulalongkorn University. From biochar data to explainable design decisions, supporting carbon capture research and next-stage development of multifunctional adsorbent materials.',
    adminActive: 'Admin mode active',
    signOut: 'Sign out',
    missionHeading: 'Mission',
    missionDesc: 'Build an open, comprehensive database of biochar properties and adsorption performance, and make ML prediction tools accessible to every researcher. The platform is not limited to CO₂ adsorption — future modules will expand into broader environmental and multifunctional material applications.',
    aiHeading: 'AI Approach',
    aiDesc: 'Combine statistical database lookup with trained sklearn ML pipelines (KNN → SVR) and Physics-Informed Neural Networks (PI-DNN) that embed isotherm equations as physical constraints inside the loss function — enabling explainable, data-grounded design decisions.',
    impactHeading: 'Broader Impact',
    impactDesc: 'Support Thailand\'s carbon neutrality goal while advancing the science of multifunctional adsorbent materials. Biochar from agricultural residues offers dual benefits — CO₂ sequestration and soil amendment — with future scope spanning water treatment, heavy metal removal, and other environmental applications.',
    statsHeading: 'Database at a Glance',
    liveData: 'Live Data',
    points: 'Data Points',
    experiments: 'Experiments',
    peak: 'Peak CO₂',
    species: 'Biomass Species',
    teamHeading: 'Core Team',
    teamSubtitle: 'Petroleum and Petrochemical College · Chulalongkorn University',
    timelineHeading: 'Project Timeline',
    timelineSubtitle: 'From research to live platform',
    techHeading: 'Built With',
    networkHeading: 'Network',
    networkSubtitle: 'Research collaborators, institutional partners, and supporting organisations.',
    networkEmpty: 'Partners coming soon',
    networkEmptyDesc: 'We\'re building our network. Partner logos and details will appear here.',
    networkVisit: 'Visit Website',
    tagResearch: 'Research',
    tagDataset: 'Dataset',
    tagML: 'ML Model',
    tagPlatform: 'Platform',
    tagLive: 'Live',
    tagPlanned: 'Planned',
    comingDate: 'Coming',
    m1Title: 'Research Initiated',
    m1Desc: 'Systematic literature review on biochar CO₂ adsorption mechanisms and experimental datasets. Identified key features: BET surface area, pore volume, activation method, and pyrolysis conditions.',
    m2Title: '+2,000 Datapoints Collected',
    m2Desc: 'Manual extraction and curation of CO₂ adsorption isotherm data from peer-reviewed journals. Standardized format covering 8 biomass species, 6 activators, and isotherm curves at multiple pressures.',
    m3Title: 'PI-DNN Model Developed',
    m3Desc: 'Physics-Informed Deep Neural Network (PI-DNN) developed with Langmuir, Freundlich, Temkin, and Sips isotherm constraints. Trained on the curated dataset with pressure-weighted loss function.',
    m4Title: 'BiocharInformaticsThailand Launched',
    m4Desc: 'Full-stack research web platform launched. Three predictor tools (CO₂ Estimator, Property Estimator, Materials Advisor) with real database integration, interactive heatmap, and correlation analysis.',
    m5Title: '{count} Datapoints Published',
    m5Desc: '{points} experimental isotherm records across {experiments} unique experiments now live on the platform. Sklearn ML pipeline (KNN → SVR) trained and integrated. Peak CO₂ recorded: {max} mmol/g.',
    m6Title: 'Extended Dataset & PI-DNN V.1.0',
    m6Desc: 'Additional biochar isotherm data from extended literature sources. Improved PI-DNN with monotonicity constraints, Clausius–Clapeyron temperature consistency, and transfer learning from synthetic isotherms.',
    teamOrg: 'Petroleum and Petrochemical College (PPC)\nChulalongkorn University',
    team1Role: 'Team Leader & Research Supervisor',
    team1Tag1: 'Research Direction',
    team1Tag2: 'Biochar Science',
    team1Tag3: 'CO₂ Adsorption',
    team2Role: 'AI & Modeling Lead',
    team2Tag1: 'Machine Learning',
    team2Tag2: 'PI-DNN',
    team2Tag3: 'Web Development',
  },
  th: {
    heroTitle1: 'เกี่ยวกับ',
    heroTitle2: 'BiocharInformaticsThailand',
    heroDesc: 'แพลตฟอร์มสารสนเทศไบโอชาร์เชิง AI สำหรับการออกแบบตัวดูดซับ — พัฒนาที่จุฬาลงกรณ์มหาวิทยาลัย จากข้อมูลไบโอชาร์สู่การตัดสินใจออกแบบที่อธิบายได้ รองรับงานวิจัยด้านการดักจับคาร์บอนและการพัฒนาวัสดุตัวดูดซับอเนกประสงค์ขั้นต่อไป',
    adminActive: 'โหมดผู้ดูแลระบบกำลังใช้งาน',
    signOut: 'ออกจากระบบ',
    missionHeading: 'พันธกิจ',
    missionDesc: 'สร้างฐานข้อมูลเปิดที่ครอบคลุมเกี่ยวกับคุณสมบัติของไบโอชาร์และประสิทธิภาพการดูดซับ และทำให้เครื่องมือพยากรณ์ด้วย ML เข้าถึงได้สำหรับนักวิจัยทุกคน แพลตฟอร์มนี้ไม่ได้จำกัดเฉพาะการดูดซับ CO₂ — โมดูลในอนาคตจะขยายไปสู่การประยุกต์ด้านสิ่งแวดล้อมและวัสดุอเนกประสงค์ในวงกว้าง',
    aiHeading: 'แนวทาง AI',
    aiDesc: 'ผสานการค้นหาข้อมูลเชิงสถิติจากฐานข้อมูลเข้ากับ pipeline ของ sklearn ML ที่ผ่านการฝึก (KNN → SVR) และ Physics-Informed Neural Networks (PI-DNN) ที่ฝังสมการไอโซเธิร์มเป็นข้อจำกัดทางกายภาพใน loss function — เปิดใช้การตัดสินใจออกแบบที่อธิบายได้และมีฐานข้อมูลรองรับ',
    impactHeading: 'ผลกระทบในวงกว้าง',
    impactDesc: 'สนับสนุนเป้าหมายความเป็นกลางทางคาร์บอนของประเทศไทย ขณะเดียวกันก็ส่งเสริมวิทยาศาสตร์ด้านวัสดุตัวดูดซับอเนกประสงค์ ไบโอชาร์จากเศษวัสดุเกษตรให้ประโยชน์สองด้าน — การกักเก็บ CO₂ และการปรับปรุงดิน — โดยมีขอบเขตในอนาคตครอบคลุมการบำบัดน้ำ การกำจัดโลหะหนัก และการประยุกต์ด้านสิ่งแวดล้อมอื่น ๆ',
    statsHeading: 'ภาพรวมฐานข้อมูล',
    liveData: 'ข้อมูลสด',
    points: 'จุดข้อมูล',
    experiments: 'การทดลอง',
    peak: 'CO₂ สูงสุด',
    species: 'ชนิดชีวมวล',
    teamHeading: 'ทีมหลัก',
    teamSubtitle: 'วิทยาลัยปิโตรเลียมและปิโตรเคมี · จุฬาลงกรณ์มหาวิทยาลัย',
    timelineHeading: 'ลำดับพัฒนาการโครงการ',
    timelineSubtitle: 'จากงานวิจัยสู่แพลตฟอร์มใช้งานจริง',
    techHeading: 'เทคโนโลยีที่ใช้',
    networkHeading: 'เครือข่าย',
    networkSubtitle: 'นักวิจัยที่ร่วมมือ หน่วยงานพันธมิตร และองค์กรสนับสนุน',
    networkEmpty: 'พันธมิตรเร็ว ๆ นี้',
    networkEmptyDesc: 'เรากำลังสร้างเครือข่าย โลโก้และรายละเอียดพันธมิตรจะปรากฏที่นี่',
    networkVisit: 'เยี่ยมชมเว็บไซต์',
    tagResearch: 'งานวิจัย',
    tagDataset: 'ชุดข้อมูล',
    tagML: 'โมเดล ML',
    tagPlatform: 'แพลตฟอร์ม',
    tagLive: 'ใช้งานจริง',
    tagPlanned: 'แผนถัดไป',
    comingDate: 'เร็ว ๆ นี้',
    m1Title: 'เริ่มต้นงานวิจัย',
    m1Desc: 'ทบทวนวรรณกรรมอย่างเป็นระบบเกี่ยวกับกลไกการดูดซับ CO₂ ของไบโอชาร์และชุดข้อมูลทดลอง โดยระบุคุณลักษณะสำคัญ เช่น BET surface area, pore volume, วิธีการ activation และเงื่อนไข pyrolysis',
    m2Title: 'เก็บรวบรวมข้อมูลกว่า 2,000 จุด',
    m2Desc: 'สกัดและจัดทำข้อมูลไอโซเธิร์มการดูดซับ CO₂ ด้วยมือจากวารสารที่ผ่านการตรวจสอบ จัดรูปแบบมาตรฐานครอบคลุมชีวมวล 8 ชนิด, activator 6 แบบ และเส้นโค้งไอโซเธิร์มที่หลายความดัน',
    m3Title: 'พัฒนาโมเดล PI-DNN',
    m3Desc: 'พัฒนา Physics-Informed Deep Neural Network (PI-DNN) พร้อมข้อจำกัด Langmuir, Freundlich, Temkin และ Sips โดยฝึกกับชุดข้อมูลที่คัดสรรและใช้ loss แบบถ่วงน้ำหนักด้วยความดัน',
    m4Title: 'เปิดตัว BiocharInformaticsThailand',
    m4Desc: 'เปิดตัวแพลตฟอร์มวิจัยแบบ full-stack มีเครื่องมือทำนาย 3 ตัว (CO₂ Estimator, Property Estimator, Materials Advisor) พร้อมเชื่อมฐานข้อมูลจริง heatmap แบบโต้ตอบ และการวิเคราะห์ความสัมพันธ์',
    m5Title: 'เผยแพร่ข้อมูล {count} จุด',
    m5Desc: 'ตอนนี้มีบันทึกไอโซเธิร์มการทดลอง {points} รายการจาก {experiments} การทดลองบนแพลตฟอร์มแล้ว Pipeline ของ sklearn (KNN → SVR) ถูกฝึกและเชื่อมใช้งานจริง ค่า CO₂ สูงสุดที่บันทึกได้คือ {max} mmol/g',
    m6Title: 'ขยายชุดข้อมูล & PI-DNN V.1.0',
    m6Desc: 'เพิ่มข้อมูลไอโซเธิร์มไบโอชาร์จากแหล่งวรรณกรรมเพิ่มเติม พร้อมปรับปรุง PI-DNN ด้วย monotonicity constraints, ความสอดคล้องของอุณหภูมิตาม Clausius–Clapeyron และ transfer learning จาก synthetic isotherms',
    teamOrg: 'วิทยาลัยปิโตรเลียมและปิโตรเคมี (PPC)\nจุฬาลงกรณ์มหาวิทยาลัย',
    team1Role: 'หัวหน้าทีมและที่ปรึกษางานวิจัย',
    team1Tag1: 'ทิศทางงานวิจัย',
    team1Tag2: 'วิทยาศาสตร์ไบโอชาร์',
    team1Tag3: 'การดูดซับ CO₂',
    team2Role: 'ผู้นำด้าน AI และการสร้างโมเดล',
    team2Tag1: 'แมชชีนเลิร์นนิง',
    team2Tag2: 'PI-DNN',
    team2Tag3: 'พัฒนาเว็บ',
  },
};

export default function About() {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const { isAdmin, logout } = useRole();
  const { i18n } = useTranslation();
  const lang = i18n?.language && i18n.language.startsWith('th') ? 'th' : 'en';
  const copy = COPY[lang] ?? COPY.en;

  const team = [
    {
      name: 'Dr. Nutthapong Sueviriyapan',
      role: copy.team1Role,
      org: copy.teamOrg,
      avatar: 'NS',
      color: 'from-green-500 to-emerald-600',
      tags: [copy.team1Tag1, copy.team1Tag2, copy.team1Tag3],
    },
    {
      name: 'Affan Dulyadech',
      role: copy.team2Role,
      org: copy.teamOrg,
      avatar: 'AD',
      color: 'from-blue-500 to-indigo-600',
      tags: [copy.team2Tag1, copy.team2Tag2, copy.team2Tag3],
    },
  ];

  const missionCards = [
    { icon: Target, title: copy.missionHeading, desc: copy.missionDesc, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
    { icon: Brain, title: copy.aiHeading, desc: copy.aiDesc, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    { icon: Globe, title: copy.impactHeading, desc: copy.impactDesc, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  const milestones = [
    { date: 'Jul 2025', title: copy.m1Title, desc: copy.m1Desc, color: '#22c55e', icon: '🌱', tag: copy.tagResearch },
    { date: 'Aug 2025', title: copy.m2Title, desc: copy.m2Desc, color: '#3b82f6', icon: '📊', tag: copy.tagDataset },
    { date: 'Feb 2026', title: copy.m3Title, desc: copy.m3Desc, color: '#a855f7', icon: '🧠', tag: copy.tagML },
    { date: 'Apr 2026', title: copy.m4Title, desc: copy.m4Desc, color: '#f59e0b', icon: '🚀', tag: copy.tagPlatform },
    {
      date: 'May 2026',
      title: copy.m5Title.replace('{count}', TOTAL_DATA_POINTS.toLocaleString()),
      desc: copy.m5Desc
        .replace('{points}', TOTAL_DATA_POINTS.toLocaleString())
        .replace('{experiments}', TOTAL_EXPERIMENTS)
        .replace('{max}', DB_OVERALL_MAX.toFixed(2)),
      color: '#22c55e',
      icon: '✅',
      tag: copy.tagLive,
    },
    { date: copy.comingDate, title: copy.m6Title, desc: copy.m6Desc, color: '#94a3b8', icon: '🔬', tag: copy.tagPlanned },
  ];

  const techStack = ['React + Vite', 'Python + scikit-learn', 'PyTorch (PI-DNN)', 'XGBoost', 'Recharts', 'Tailwind CSS', 'pandas + numpy', 'scipy optimize'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-[#0f1f38] dark:via-[#091422] dark:to-[#0c1930] pt-24 pb-16 relative overflow-hidden border-b border-green-100 dark:border-emerald-900/30">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'linear-gradient(rgba(34,197,94,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.08) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex w-16 h-16 rounded-2xl gradient-green items-center justify-center mx-auto mb-6 glow-green">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-space font-bold text-5xl text-foreground mb-4">
              {copy.heroTitle1} <span className="text-green-600">{copy.heroTitle2}</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
              {copy.heroDesc}
            </p>

            {isAdmin && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-300">
                <span className="text-green-700 text-sm font-medium">{copy.adminActive}</span>
                <button onClick={logout} className="flex items-center gap-1 text-green-600 hover:text-green-800 text-xs transition-colors">
                  <LogOut className="w-3 h-3" /> {copy.signOut}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {missionCards.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className={`glass-card rounded-2xl p-6 border ${item.bg} h-full`}>
                <div className={`inline-flex w-11 h-11 rounded-xl ${item.bg} border items-center justify-center mb-4`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="font-space font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-16">
          <h2 className="font-space font-bold text-3xl mb-2 text-center">{copy.teamHeading}</h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">{copy.teamSubtitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="glass-card rounded-2xl p-6 border border-border hover:scale-[1.02] transition-transform">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex-shrink-0 flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">{member.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-space font-semibold text-sm leading-tight">{member.name}</h4>
                      <p className="text-green-600 text-xs font-medium mt-0.5">{member.role}</p>
                      <p className="text-muted-foreground text-[11px] mt-0.5 whitespace-pre-line">{member.org}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted border border-border text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Network Section ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-16">
          <div className="flex items-center gap-3 justify-center mb-2">
            <Users className="w-5 h-5 text-green-500" />
            <h2 className="font-space font-bold text-3xl">{copy.networkHeading}</h2>
          </div>
          <p className="text-muted-foreground text-center text-sm mb-8 max-w-xl mx-auto">{copy.networkSubtitle}</p>

          {PARTNERS.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-8 rounded-2xl border border-dashed border-border bg-muted/20 max-w-md mx-auto text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <p className="font-space font-semibold text-base mb-1">{copy.networkEmpty}</p>
              <p className="text-xs text-muted-foreground">{copy.networkEmptyDesc}</p>
            </div>
          ) : (
            <div className="relative">
              <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {PARTNERS.map((partner, i) => (
                  <motion.button
                    key={partner.name}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedPartner(partner)}
                    className="flex-shrink-0 snap-start w-52 glass-card rounded-2xl p-5 border border-border hover:border-green-400/40 hover:shadow-lg transition-all text-left group"
                  >
                    <PartnerAvatar partner={partner} size="card" />
                    <p className="font-space font-semibold text-sm leading-tight mb-1">{partner.name}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{partner.tagline}</p>
                  </motion.button>
                ))}
                <div className="flex-shrink-0 snap-start w-52 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center p-5 gap-2 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-border flex items-center justify-center text-xl">+</div>
                  <p className="text-xs font-medium text-center">More partners<br/>coming soon</p>
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-3 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none rounded-r-2xl" />
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-16">
          <h2 className="font-space font-bold text-3xl mb-2 text-center">{copy.timelineHeading}</h2>
          <p className="text-muted-foreground text-center mb-10 text-sm">{copy.timelineSubtitle}</p>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-6 pl-2"
                >
                  <div className="relative flex-shrink-0 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl border-2 border-white shadow-md z-10"
                      style={{ background: `${m.color}20`, borderColor: m.color }}>
                      {m.icon}
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-4 border border-border flex-1 mb-1">
                    <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                      <div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
                          style={{ background: `${m.color}15`, color: m.color, borderColor: `${m.color}40` }}>
                          {m.tag}
                        </span>
                        <h4 className="font-space font-semibold text-sm mt-1.5">{m.title}</h4>
                      </div>
                      <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{m.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-16">
          <h2 className="font-space font-bold text-2xl mb-6 text-center">{copy.techHeading}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map(tech => (
              <span key={tech} className="px-4 py-2 rounded-xl bg-muted border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Partner detail modal */}
        <AnimatePresence>
          {selectedPartner && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPartner(null)}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <motion.div
                className="relative glass-modal rounded-3xl p-8 border border-border max-w-md w-full z-10 shadow-2xl"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                onClick={e => e.stopPropagation()}
              >
                <button onClick={() => setSelectedPartner(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="flex items-center gap-4 mb-5">
                  <PartnerAvatar partner={selectedPartner} size="modal" />
                  <div>
                    <h3 className="font-space font-bold text-lg leading-tight text-white">{selectedPartner.name}</h3>
                    <p className="text-xs text-white/60 mt-0.5">{selectedPartner.tagline}</p>
                  </div>
                </div>
                <p className="text-sm text-white/75 leading-relaxed mb-6">{selectedPartner.desc}</p>
                {selectedPartner.url && (
                  <a href={selectedPartner.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-green text-white text-sm font-semibold glow-green hover:scale-105 transition-transform">
                    <ExternalLink className="w-4 h-4" /> {copy.networkVisit}
                  </a>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
