// @ts-nocheck
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { Leaf, Target, Globe, BookOpen, ArrowRight, Brain, Database, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRole } from '../lib/RoleContext';
import { TOTAL_DATA_POINTS, TOTAL_EXPERIMENTS, DB_OVERALL_MAX } from '../lib/biocharKnowledgeBase';
import { useTranslation } from 'react-i18next';

const COPY = {
  en: {
    heroTitle1: 'About',
    heroTitle2: 'BiocharHub',
    heroDesc: 'A research platform built at Chulalongkorn University to accelerate biochar CO₂ adsorption science through open data, AI prediction, and accessible tools.',
    adminActive: 'Admin mode active',
    signOut: 'Sign out',
    missionHeading: 'Mission',
    missionDesc: 'Build the most comprehensive open database of biochar CO₂ adsorption data and make accurate prediction tools accessible to every researcher, regardless of institution or computational resources.',
    aiHeading: 'AI Approach',
    aiDesc: 'Combine statistical database lookup with trained sklearn ML pipelines (KNN → SVR) and Physics-Informed Neural Networks (PI-DNN) that embed isotherm equations as physical constraints inside the loss function.',
    impactHeading: 'Impact',
    impactDesc: 'Support Thailand\'s carbon neutrality goal. Biochar from agricultural residues such as corn straw, coffee grounds, and bamboo offers dual benefits: CO₂ sequestration and soil amendment from agri-waste.',
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
    ctaHeading: 'Explore the Platform',
    ctaDesc: 'Browse the database, run CO₂ predictions, or find optimal synthesis conditions — all running locally in your browser.',
    ctaPrimary: 'CO₂ Estimator',
    ctaSecondary: 'Browse Database',
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
    m4Title: 'Biochar Assistant Thailand Launched',
    m4Desc: 'Full-stack research web platform launched. Three predictor tools (CO₂ Estimator, Property Estimator, Materials Advisor) with real database integration, interactive heatmap, and correlation analysis.',
    m5Title: '{count} Datapoints Published',
    m5Desc: '{points} experimental isotherm records across {experiments} unique experiments now live on the platform. Sklearn ML pipeline (KNN → SVR) trained and integrated. Peak CO₂ recorded: {max} mmol/g.',
    m6Title: 'Extended Dataset & PI-DNN v2',
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
    heroTitle2: 'BiocharHub',
    heroDesc: 'แพลตฟอร์มวิจัยที่พัฒนาขึ้นที่จุฬาลงกรณ์มหาวิทยาลัย เพื่อเร่งงานวิทยาศาสตร์ด้านการดูดซับ CO₂ ของไบโอชาร์ ด้วยข้อมูลเปิด ระบบพยากรณ์ด้วย AI และเครื่องมือที่ใช้งานได้สะดวก',
    adminActive: 'โหมดผู้ดูแลระบบกำลังใช้งาน',
    signOut: 'ออกจากระบบ',
    missionHeading: 'พันธกิจ',
    missionDesc: 'สร้างฐานข้อมูลเปิดที่ครอบคลุมที่สุดของข้อมูลการดูดซับ CO₂ ของไบโอชาร์ และทำให้เครื่องมือพยากรณ์ที่แม่นยำเข้าถึงได้สำหรับนักวิจัยทุกคน ไม่ว่าจะอยู่สังกัดใดหรือมีทรัพยากรการประมวลผลมากน้อยเพียงใด',
    aiHeading: 'แนวทาง AI',
    aiDesc: 'ผสานการค้นหาข้อมูลเชิงสถิติจากฐานข้อมูลเข้ากับ pipeline ของ sklearn ML ที่ผ่านการฝึก (KNN → SVR) และ Physics-Informed Neural Networks (PI-DNN) ที่ฝังสมการไอโซเธิร์มเป็นข้อจำกัดทางกายภาพใน loss function',
    impactHeading: 'ผลกระทบ',
    impactDesc: 'สนับสนุนเป้าหมายความเป็นกลางทางคาร์บอนของประเทศไทย ไบโอชาร์จากเศษวัสดุเกษตร เช่น ฟางข้าว กากกาแฟ และไผ่ ให้ประโยชน์สองด้านคือการกักเก็บ CO₂ และการปรับปรุงดินจากวัสดุเหลือใช้ทางการเกษตร',
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
    ctaHeading: 'สำรวจแพลตฟอร์ม',
    ctaDesc: 'เรียกดูฐานข้อมูล พยากรณ์ค่า CO₂ หรือค้นหาเงื่อนไขการสังเคราะห์ที่เหมาะสม — ทั้งหมดทำงานภายในเบราว์เซอร์ของคุณ',
    ctaPrimary: 'ตัวพยากรณ์ CO₂',
    ctaSecondary: 'เปิดฐานข้อมูล',
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
    m4Title: 'เปิดตัว Biochar Assistant Thailand',
    m4Desc: 'เปิดตัวแพลตฟอร์มวิจัยแบบ full-stack มีเครื่องมือทำนาย 3 ตัว (CO₂ Estimator, Property Estimator, Materials Advisor) พร้อมเชื่อมฐานข้อมูลจริง heatmap แบบโต้ตอบ และการวิเคราะห์ความสัมพันธ์',
    m5Title: 'เผยแพร่ข้อมูล {count} จุด',
    m5Desc: 'ตอนนี้มีบันทึกไอโซเธิร์มการทดลอง {points} รายการจาก {experiments} การทดลองบนแพลตฟอร์มแล้ว Pipeline ของ sklearn (KNN → SVR) ถูกฝึกและเชื่อมใช้งานจริง ค่า CO₂ สูงสุดที่บันทึกได้คือ {max} mmol/g',
    m6Title: 'ขยายชุดข้อมูล & PI-DNN v2',
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
  const { isAdmin, logout } = useRole();
  const { i18n } = useTranslation();
  const copy = COPY[lang] ?? COPY.en;

  const team = [
    {
      name: 'Dr. Nuttapong Sueviriyapan',
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

      <div className="gradient-hero pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-green-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex w-16 h-16 rounded-2xl gradient-green items-center justify-center mx-auto mb-6 glow-green">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-space font-bold text-5xl text-white mb-4">
              {copy.heroTitle1} <span className="text-green-400">{copy.heroTitle2}</span>
            </h1>
            <p className="text-blue-100/70 text-xl leading-relaxed max-w-2xl mx-auto">
              {copy.heroDesc}
            </p>

            {isAdmin && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                <span className="text-green-300 text-sm font-medium">{copy.adminActive}</span>
                <button onClick={logout} className="flex items-center gap-1 text-green-400 hover:text-white text-xs transition-colors">
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

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card rounded-2xl p-6 border border-green-500/20 bg-green-500/5 mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-green-500" />
            <h3 className="font-space font-semibold text-base">{copy.statsHeading}</h3>
            <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-600 font-bold border border-green-500/20">
              {copy.liveData}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: copy.points, value: TOTAL_DATA_POINTS.toLocaleString(), color: '#22c55e' },
              { label: copy.experiments, value: TOTAL_EXPERIMENTS, color: '#3b82f6' },
              { label: copy.peak, value: `${DB_OVERALL_MAX.toFixed(2)} mmol/g`, color: '#a855f7' },
              { label: copy.species, value: '8', color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-muted/40 border border-border">
                <p className="font-space font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

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

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center">
          <div className="glass-card rounded-3xl p-10 border border-green-200/50 bg-gradient-to-br from-green-50/50 to-blue-50/50 max-w-2xl mx-auto">
            <BookOpen className="w-10 h-10 text-green-500 mx-auto mb-4" />
            <h3 className="font-space font-bold text-2xl mb-3">{copy.ctaHeading}</h3>
            <p className="text-muted-foreground mb-6">{copy.ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/predictor" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-green text-white font-semibold text-sm glow-green hover:scale-105 transition-transform">
                {copy.ctaPrimary} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/database" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors">
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
