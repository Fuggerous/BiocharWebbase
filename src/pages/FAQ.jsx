// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useTranslation } from 'react-i18next';
import {
  HelpCircle, ChevronDown, FlaskConical, BarChart3, Layers,
  Database, BookOpen, Sparkles, MessageCircle, ArrowRight,
  ShieldCheck, Beaker, BrainCircuit, Leaf,
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
        q: 'What languages does the platform support?',
        a: 'English (EN) and Thai (TH). The language toggle is in the top-right corner of every page. Switching languages updates all UI text instantly while experimental data values remain in their original scientific notation.',
      },
      {
        q: 'Where does the data come from?',
        a: 'Every record is sourced from a peer-reviewed journal article (2010–2024). Each entry includes a DOI link to its source publication, so you can verify any value against the original experiment. No data is synthesised or generated — all values are real measurements.',
      },
      {
        q: 'How is the database updated?',
        a: 'New records are added as the research team reviews newly published literature. The platform version number in the footer reflects each dataset update. The current dataset (V.1.0) covers publications primarily from 2010–2024.',
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
        q: 'How accurate are the predictions?',
        a: 'When BET surface area is provided and the similarity score is above 0.80, predictions typically fall within ±0.5 mmol/g of real experimental values for well-studied feedstock–activator combinations. Accuracy drops in sparse regions of the database (unusual feedstocks, extreme temperatures). Always check the similarity score and matched records before drawing conclusions.',
      },
      {
        q: 'What does the Similarity Score mean?',
        a: 'Similarity Score (0–1) measures how closely the database can match your inputs. Above 0.85 = high confidence, close matches found. 0.65–0.85 = moderate confidence. Below 0.65 = sparse region — treat the prediction as a rough estimate and consider running a laboratory experiment.',
      },
      {
        q: 'Why does adsorption temperature matter so much?',
        a: 'CO₂ physisorption is exothermic — lowering temperature shifts the thermodynamic equilibrium toward adsorption. The database shows the 0°C–25°C gap averages 0.8 mmol/g and the 25°C–50°C gap averages 0.6 mmol/g. Always specify the temperature relevant to your actual application.',
      },
      {
        q: 'What is the difference between CO₂ Predictor and Property Estimator?',
        a: 'CO₂ Predictor outputs one value — expected CO₂ adsorption capacity (mmol/g). Property Estimator outputs five structural properties (BET surface area, pore volume, average pore size, carbon content, yield). The best workflow is to run Property Estimator first, then feed its BET output into the CO₂ Predictor for a more accurate uptake estimate.',
      },
      {
        q: 'Can I use these predictions in a published paper?',
        a: 'Yes, with appropriate citation of the platform and acknowledgement that results are ML-derived estimates from peer-reviewed data. Key predictions should be validated with a laboratory experiment before publication. Contact the research team for the correct citation format.',
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
      {
        q: 'What does biochar yield (%) mean in practice?',
        a: 'Yield is the mass of biochar produced divided by dry feedstock mass. It typically ranges 20–45%. Lower pyrolysis temperatures give higher yields but lower surface areas. This trade-off matters for economic analysis — a 40%-yield process at 500°C may be preferred over a 25%-yield process at 800°C even if the latter has better adsorption properties.',
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
        a: 'The Materials Advisor inverts the prediction problem. Instead of "given these conditions, what performance do I get?", you specify a performance target and ask "what conditions should I use?". Use it when you want to discover the optimal feedstock and process route for a CO₂ capture goal rather than evaluate a specific planned experiment.',
      },
      {
        q: 'How does the recommendation algorithm work?',
        a: 'Three stages: (1) Filter — remove records that violate your constraints (feedstock type, no chemical activation, temperature limits). (2) Rank — sort remaining records by the target metric (CO₂ uptake, BET area, or yield). (3) Cluster — group results by process similarity so recommendations represent distinct strategies rather than slight variations of the same experiment.',
      },
      {
        q: 'Why does KOH activation appear at the top of almost every ranking?',
        a: 'KOH is the most studied and best-performing activation agent in the experimental literature. It produces the highest surface areas (up to 3,500 m²/g) and CO₂ uptake values. The Advisor reflects the database as it is. If you need an alternative, apply the "No chemical activation" constraint to explore CO₂ physical activation or unactivated routes.',
      },
      {
        q: 'Can I constrain recommendations to locally available feedstocks?',
        a: 'Yes. The feedstock filter lets you limit recommendations to specific biomass types. For Thailand-based research, filtering to rice husk, sugarcane bagasse, corn straw, or palm shell returns recommendations grounded entirely in those feedstocks.',
      },
    ],
  },
  {
    id: 'database',
    icon: Database,
    color: 'blue',
    label: 'Database',
    questions: [
      {
        q: 'What information does each database record contain?',
        a: 'Each record includes: biomass/feedstock type, pyrolysis temperature (°C), activation agent, activation temperature (°C), BET surface area (m²/g), pore volume (cm³/g), average pore size (nm), adsorption temperature (°C), CO₂ uptake (mmol/g), and a DOI link to the source publication.',
      },
      {
        q: 'How do I filter records effectively?',
        a: 'Combine filters for the most focused results. Example: set Activation = KOH, Pyrolysis Temp = 700–900°C, CO₂ Uptake > 4 mmol/g, Adsorption Temp = 25°C to immediately isolate top-performing KOH-activated biochars at room temperature. Export the filtered set to CSV for offline analysis.',
      },
      {
        q: 'Can I export the database records?',
        a: 'Yes. The "Export CSV" button downloads all currently filtered records as a comma-separated file. The export retains all columns including BET, pore volume, and DOI — suitable as a supplementary dataset for academic publications.',
      },
      {
        q: 'Can I submit my own experimental data?',
        a: 'A "Share Data" feature is available for authorised contributors. Submissions go through a quality check (unit consistency, DOI verification, outlier screening) before being added to the database. Contact the research team via the About page to request contributor access.',
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
        a: 'Biochar is a solid carbon-rich material produced by heating biomass (agricultural residues, wood, sewage sludge, etc.) at 300–900°C in an oxygen-limited environment — a process called pyrolysis. The result is a highly porous, aromatic carbon structure with a large internal surface area. Unlike combustion, pyrolysis preserves most of the carbon in a stable solid form rather than releasing it as CO₂.',
      },
      {
        q: 'Why does pyrolysis temperature affect CO₂ adsorption so much?',
        a: '300–450°C: low carbonisation, high functional groups, low surface area (< 200 m²/g) — poor for CO₂ capture. 500–700°C: balanced surface area development (200–800 m²/g). 700–900°C: well-developed micropore network, surface area peaks — best for CO₂ adsorption before activation. Above 900°C: graphitisation begins, surface area may decline.',
      },
      {
        q: 'How does chemical activation improve CO₂ adsorption?',
        a: 'Raw biochar has surface areas of 100–400 m²/g. Chemical activation (typically KOH or K₂CO₃) etches and opens additional micropores, raising surface area to 500–3,500 m²/g. KOH works by K-intercalation between carbon layers and subsequent CO₂ evolution, creating abundant micropores (< 2 nm) — the most effective pore size for CO₂ physisorption at ambient pressure.',
      },
      {
        q: 'What does mmol/g actually mean in physical terms?',
        a: '1 mmol/g ≈ 44 mg of CO₂ per gram of biochar ≈ 22 mL of CO₂ gas at standard conditions. Reference values: < 1.5 mmol/g = very low (unactivated chars); 1.5–3.0 = low–moderate; 3.0–5.0 = good (well-activated); 5.0–7.0 = high (top-tier KOH chars at 0°C); > 7.0 = exceptional (top 5% of database).',
      },
      {
        q: 'What are micropores and why do they matter for CO₂ capture?',
        a: 'Micropores are pores with diameter < 2 nm. CO₂ molecules have a kinetic diameter of 3.3 Å (0.33 nm). Micropores in the range 0.4–0.8 nm provide the strongest van der Waals adsorption potential wells for CO₂ at ambient pressure. A biochar rich in micropores (micropore volume fraction > 60%) consistently outperforms one with the same total surface area but larger pores.',
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
        a: 'BiocharInformaticsThailand คือแพลตฟอร์มที่ขับเคลื่อนด้วย AI แบบเปิดและฟรีสำหรับการวิจัยการดูดซับ CO₂ ของไบโอชาร์ รวบรวมระเบียนการทดลองที่ผ่านการตรวจสอบ 1,396 รายการเข้าสู่ฐานข้อมูลที่ค้นหาได้ พร้อมเครื่องมือ ML สามชุด ได้แก่ ตัวพยากรณ์ CO₂ เครื่องมือประเมินคุณสมบัติ และที่ปรึกษาวัสดุ',
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
        q: 'แพลตฟอร์มรองรับภาษาอะไรบ้าง?',
        a: 'ภาษาอังกฤษ (EN) และภาษาไทย (TH) ปุ่มสลับภาษาอยู่ที่มุมบนขวาของทุกหน้า การสลับภาษาจะอัปเดตข้อความ UI ทั้งหมดทันที ในขณะที่ค่าข้อมูลทางวิทยาศาสตร์ยังคงอยู่ในสัญกรณ์เดิม',
      },
      {
        q: 'ข้อมูลมาจากไหน?',
        a: 'ทุกระเบียนมาจากบทความวิชาการที่ผ่านการตรวจสอบ (ปี 2010–2024) แต่ละรายการมีลิงก์ DOI ไปยังสิ่งพิมพ์ต้นฉบับเพื่อตรวจสอบค่าใดๆ กับการทดลองต้นฉบับ ไม่มีข้อมูลสังเคราะห์หรือสร้างขึ้น — ค่าทั้งหมดเป็นการวัดจริง',
      },
      {
        q: 'ฐานข้อมูลได้รับการอัปเดตอย่างไร?',
        a: 'ระเบียนใหม่ถูกเพิ่มเมื่อทีมวิจัยตรวจสอบวรรณกรรมที่ตีพิมพ์ใหม่ หมายเลขเวอร์ชันแพลตฟอร์มในท้ายเพจสะท้อนการอัปเดตชุดข้อมูลแต่ละครั้ง ชุดข้อมูลปัจจุบัน (V.1.0) ครอบคลุมสิ่งพิมพ์ตั้งแต่ปี 2010–2024 เป็นหลัก',
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
        a: 'ตัวพยากรณ์ใช้อัลกอริทึม k-Nearest Neighbour (kNN) โดยเข้ารหัสอินพุตของคุณเป็นเวกเตอร์ฟีเจอร์ จากนั้นค้นหาการทดลองที่คล้ายกันที่สุด k รายการในฐานข้อมูล 1,396 ระเบียน และส่งคืนค่าเฉลี่ยถ่วงน้ำหนักตามระยะทางของค่าการดูดซับ CO₂ เป็นการพยากรณ์',
      },
      {
        q: 'การพยากรณ์มีความแม่นยำเพียงใด?',
        a: 'เมื่อให้ค่าพื้นที่ผิว BET และคะแนนความคล้ายคลึงเกิน 0.80 การพยากรณ์โดยทั่วไปอยู่ภายใน ±0.5 mmol/g ของค่าการทดลองจริง เสมอตรวจสอบคะแนนความคล้ายคลึงและระเบียนที่ตรงกันก่อนสรุปผล',
      },
      {
        q: 'คะแนนความคล้ายคลึงหมายความว่าอะไร?',
        a: 'คะแนนความคล้ายคลึง (0–1) วัดว่าฐานข้อมูลจับคู่อินพุตของคุณได้ดีแค่ไหน เกิน 0.85 = ความเชื่อมั่นสูง, 0.65–0.85 = ปานกลาง, ต่ำกว่า 0.65 = ภูมิภาคที่กระจัดกระจาย — ถือการพยากรณ์เป็นการประมาณคร่าวๆ',
      },
      {
        q: 'เหตุใดอุณหภูมิการดูดซับจึงสำคัญ?',
        a: 'ฟิสิซอร์ปชัน CO₂ เป็นแบบคายความร้อน — การลดอุณหภูมิเลื่อนสมดุลเทอร์โมไดนามิกไปทางการดูดซับ ฐานข้อมูลแสดงช่องว่าง 0°C–25°C เฉลี่ย 0.8 mmol/g และ 25°C–50°C เฉลี่ย 0.6 mmol/g',
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
        a: 'เรียกใช้ Property Estimator ก่อนด้วยเงื่อนไขการผลิตที่วางแผนไว้ → จดพื้นที่ผิว BET ที่พยากรณ์ → ป้อนค่า BET นั้นเข้าสู่ CO₂ Predictor เป็นอินพุต แนวทางสองขั้นตอนนี้ลดความไม่แน่นอนของการพยากรณ์อย่างมาก',
      },
      {
        q: 'ผลได้ไบโอชาร์ (%) หมายความว่าอะไรในทางปฏิบัติ?',
        a: 'ผลได้คือมวลไบโอชาร์หารด้วยมวลวัตถุดิบแห้ง โดยทั่วไป 20–45% อุณหภูมิไพโรไลซิสต่ำกว่าให้ผลได้สูงกว่าแต่พื้นที่ผิวต่ำกว่า การแลกเปลี่ยนนี้สำคัญสำหรับการวิเคราะห์ทางเศรษฐกิจ',
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
        a: 'ที่ปรึกษาวัสดุพลิกกลับปัญหาการพยากรณ์ แทนที่จะถามว่า "ด้วยเงื่อนไขเหล่านี้ฉันจะได้ประสิทธิภาพอะไร?" คุณระบุเป้าหมายประสิทธิภาพและถามว่า "ฉันควรใช้เงื่อนไขอะไร?" ใช้เมื่อต้องการค้นพบเส้นทางการผลิตที่เหมาะสมที่สุด',
      },
      {
        q: 'เหตุใด KOH จึงปรากฏที่ด้านบนของการจัดอันดับเกือบทุกครั้ง?',
        a: 'KOH เป็นสารกระตุ้นที่ได้รับการศึกษามากที่สุดและมีประสิทธิภาพดีที่สุดในวรรณกรรมการทดลอง ผลิตพื้นที่ผิวสูงสุด (ถึง 3,500 m²/g) และค่าการดูดซับ CO₂ หากต้องการทางเลือก ให้ใช้ตัวกรอง "ไม่มีการกระตุ้นทางเคมี"',
      },
      {
        q: 'ฉันสามารถจำกัดคำแนะนำให้เฉพาะวัตถุดิบที่มีในท้องถิ่นได้หรือไม่?',
        a: 'ได้ ตัวกรองวัตถุดิบช่วยให้คุณจำกัดคำแนะนำให้เป็นชนิดชีวมวลเฉพาะ สำหรับการวิจัยในไทย การกรองเป็นแกลบข้าว ชานอ้อย ซังข้าวโพด หรือเปลือกปาล์มจะให้คำแนะนำที่อิงจากวัตถุดิบเหล่านั้น',
      },
    ],
  },
  {
    id: 'database',
    icon: Database,
    color: 'blue',
    label: 'ฐานข้อมูล',
    questions: [
      {
        q: 'แต่ละระเบียนฐานข้อมูลมีข้อมูลอะไรบ้าง?',
        a: 'แต่ละระเบียนมี: ชีวมวล/วัตถุดิบ อุณหภูมิไพโรไลซิส (°C) สารกระตุ้น อุณหภูมิการกระตุ้น (°C) พื้นที่ผิว BET (m²/g) ปริมาตรรูพรุน (cm³/g) ขนาดรูพรุนเฉลี่ย (nm) อุณหภูมิดูดซับ (°C) การดูดซับ CO₂ (mmol/g) และลิงก์ DOI ไปยังสิ่งพิมพ์ต้นฉบับ',
      },
      {
        q: 'ฉันสามารถส่งออกระเบียนฐานข้อมูลได้หรือไม่?',
        a: 'ได้ ปุ่ม "Export CSV" ดาวน์โหลดระเบียนที่กรองไว้ทั้งหมดเป็นไฟล์ CSV การส่งออกเก็บทุกคอลัมน์รวมถึง BET ปริมาตรรูพรุน และ DOI — เหมาะสำหรับใช้เป็นชุดข้อมูลเสริมสำหรับสิ่งพิมพ์ทางวิชาการ',
      },
      {
        q: 'ฉันสามารถส่งข้อมูลการทดลองของตนเองได้หรือไม่?',
        a: 'ฟีเจอร์ "Share Data" มีให้สำหรับผู้มีส่วนร่วมที่ได้รับอนุญาต การส่งผ่านการตรวจสอบคุณภาพก่อนเพิ่มลงในฐานข้อมูล ติดต่อทีมวิจัยผ่านหน้า About เพื่อขอสิทธิ์การเข้าถึง',
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
        a: 'ไบโอชาร์คือวัสดุคาร์บอนแข็งที่ผลิตโดยการให้ความร้อนชีวมวล (เศษซากเกษตร ไม้ ตะกอนน้ำเสีย ฯลฯ) ที่ 300–900°C ในสภาพแวดล้อมที่จำกัดออกซิเจน กระบวนการที่เรียกว่าไพโรไลซิส ผลลัพธ์คือโครงสร้างคาร์บอนอะโรมาติกที่มีรูพรุนสูงและพื้นที่ผิวภายในขนาดใหญ่',
      },
      {
        q: 'mmol/g หมายความว่าอะไรในแง่กายภาพ?',
        a: '1 mmol/g ≈ CO₂ 44 mg ต่อไบโอชาร์ 1 กรัม ≈ CO₂ 22 mL ที่สภาวะมาตรฐาน ค่าอ้างอิง: < 1.5 = ต่ำมาก; 1.5–3.0 = ต่ำถึงปานกลาง; 3.0–5.0 = ดี (กระตุ้นดี); 5.0–7.0 = สูง; > 7.0 = ยอดเยี่ยม (5% ด้านบนของฐานข้อมูล)',
      },
      {
        q: 'การกระตุ้นทางเคมีปรับปรุงการดูดซับ CO₂ อย่างไร?',
        a: 'ไบโอชาร์ดิบมีพื้นที่ผิว 100–400 m²/g การกระตุ้นทางเคมี (KOH หรือ K₂CO₃) กัดกร่อนและเปิดไมโครพอร์เพิ่มเติม ทำให้พื้นที่ผิวสูงถึง 3,500 m²/g KOH สร้างไมโครพอร์มากมาย (< 2 nm) ซึ่งเป็นขนาดรูพรุนที่มีประสิทธิภาพสูงสุดสำหรับฟิสิซอร์ปชัน CO₂ ที่ความดันบรรยากาศ',
      },
    ],
  },
];

/* ─── colour maps ───────────────────────────────────────────────────────────── */
const COLOR_MAP = {
  green:  { badge: 'bg-green-100 border-green-300 text-green-700', dot: 'bg-green-500', glow: 'hover:border-green-400/60', accent: 'text-green-600' },
  amber:  { badge: 'bg-amber-100 border-amber-300 text-amber-700',  dot: 'bg-amber-500',  glow: 'hover:border-amber-400/60',  accent: 'text-amber-600' },
  violet: { badge: 'bg-violet-100 border-violet-300 text-violet-700', dot: 'bg-violet-500', glow: 'hover:border-violet-400/60', accent: 'text-violet-600' },
  blue:   { badge: 'bg-blue-100 border-blue-300 text-blue-700',    dot: 'bg-blue-500',   glow: 'hover:border-blue-400/60',   accent: 'text-blue-600' },
  teal:   { badge: 'bg-teal-100 border-teal-300 text-teal-700',    dot: 'bg-teal-500',   glow: 'hover:border-teal-400/60',   accent: 'text-teal-600' },
};

/* ─── Accordion item ────────────────────────────────────────────────────────── */
function AccordionItem({ q, a, color, index }) {
  const [open, setOpen] = useState(false);
  const c = COLOR_MAP[color];
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

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
export default function FAQ() {
  const { i18n } = useTranslation();
  const isThai = i18n.language === 'th';
  const CATEGORIES = isThai ? CATEGORIES_TH : CATEGORIES_EN;
  const [activeCategory, setActiveCategory] = useState('general');
  const active = CATEGORIES.find(c => c.id === activeCategory) ?? CATEGORIES[0];

  const title      = isThai ? 'ถาม & ตอบ / ช่วยเหลือ' : 'Q&A / Help Centre';
  const subtitle   = isThai
    ? 'ค้นหาคำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับแพลตฟอร์ม เครื่องมือ ML และวิทยาศาสตร์ไบโอชาร์'
    : 'Find answers to common questions about the platform, ML tools, and the science behind biochar CO₂ adsorption.';
  const stillNeedHelp  = isThai ? 'ยังต้องการความช่วยเหลือ?' : 'Still need help?';
  const contactLine    = isThai ? 'ติดต่อทีมวิจัยผ่านหน้า About' : 'Reach the research team via the About page.';
  const exploreLabel   = isThai ? 'สำรวจฐานข้อมูล' : 'Explore Database';
  const tryToolsLabel  = isThai ? 'ลองใช้เครื่องมือ' : 'Try the Tools';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero header ── */}
      <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-950 pt-24 pb-14 relative overflow-hidden border-b border-green-100 dark:border-emerald-900/30">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-300 mb-5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-700 text-sm font-semibold">{isThai ? 'ศูนย์ช่วยเหลือ' : 'Knowledge Centre · Help'}</span>
            </div>
            <h1 className="font-space font-black text-4xl lg:text-5xl text-foreground mb-4 leading-tight">
              {isThai ? 'ถาม & ตอบ /' : 'Q&A /'}{' '}
              <span style={{ background: 'linear-gradient(135deg,#16a34a,#059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {isThai ? 'ศูนย์ความช่วยเหลือ' : 'Help Centre'}
              </span>
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>

            {/* quick-stat pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {CATEGORIES.map(cat => {
                const c = COLOR_MAP[cat.color];
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all hover:scale-105 ${
                      activeCategory === cat.id
                        ? `${c.badge} shadow-sm scale-105`
                        : 'bg-white/70 dark:bg-slate-800/70 border-border text-muted-foreground hover:border-green-300'
                    }`}
                  >
                    <cat.icon className="w-3 h-3" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                {isThai ? 'หมวดหมู่' : 'Categories'}
              </p>
              {CATEGORIES.map(cat => {
                const c = COLOR_MAP[cat.color];
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                      isActive
                        ? `${c.badge} border`
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <cat.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? c.accent : ''}`} />
                    {cat.label}
                    <span className="ml-auto text-xs opacity-60">{cat.questions.length}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Questions */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${COLOR_MAP[active.color].badge} border`}>
                    <active.icon className={`w-4 h-4 ${COLOR_MAP[active.color].accent}`} />
                  </div>
                  <h2 className="font-space font-bold text-xl text-foreground">{active.label}</h2>
                  <span className="text-sm text-muted-foreground ml-1">· {active.questions.length} {isThai ? 'คำถาม' : 'questions'}</span>
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

            {/* Bottom CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/40 p-5">
                <BookOpen className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-space font-bold text-sm text-foreground mb-1">{stillNeedHelp}</p>
                <p className="text-xs text-muted-foreground mb-3">{contactLine}</p>
                <Link to="/about" className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-700">
                  {isThai ? 'ไปที่หน้า About' : 'Visit About page'} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-5 text-white">
                <Leaf className="w-6 h-6 text-white/80 mb-2" />
                <p className="font-space font-bold text-sm mb-1">{isThai ? 'พร้อมเริ่มต้นแล้ว?' : 'Ready to get started?'}</p>
                <p className="text-xs text-white/70 mb-3">{isThai ? 'สำรวจฐานข้อมูลหรือเรียกใช้การพยากรณ์' : 'Explore the database or run a prediction.'}</p>
                <div className="flex gap-2">
                  <Link to="/database" className="inline-flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                    <Database className="w-3 h-3" /> {exploreLabel}
                  </Link>
                  <Link to="/predictor" className="inline-flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                    <BrainCircuit className="w-3 h-3" /> {tryToolsLabel}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
