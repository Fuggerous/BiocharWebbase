// @ts-nocheck
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ─── Bilingual glossary data ──────────────────────────────────────────────────
const TERMS = [
  // ── General ─────────────────────────────────────────────────────────────────
  {
    abbr: 'Biochar', cat: 'General', color: '#22c55e',
    bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-600',
    full: { en: 'Biochar', th: 'ไบโอชาร์' },
    def: {
      en: 'Carbon-rich solid produced by heating biomass (crop residues, wood, etc.) at high temperature under very limited oxygen. Unlike regular charcoal, it is intentionally applied to soil or used as an adsorbent material.',
      th: 'ของแข็งที่มีคาร์บอนสูง ผลิตจากการให้ความร้อนกับชีวมวล (เศษพืช ไม้ ฯลฯ) ที่อุณหภูมิสูงในสภาวะออกซิเจนต่ำมาก ต่างจากถ่านธรรมดาตรงที่นำไปใช้ปรับปรุงดินหรือเป็นตัวดูดซับโดยตั้งใจ',
    },
  },
  {
    abbr: 'Biomass', cat: 'General', color: '#22c55e',
    bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-600',
    full: { en: 'Biomass / Feedstock', th: 'ชีวมวล / วัตถุดิบตั้งต้น' },
    def: {
      en: 'The raw organic material used to produce biochar — e.g., sugarcane bagasse, rice husk, corn straw, pine sawdust. The feedstock type strongly influences biochar\'s final properties.',
      th: 'วัสดุอินทรีย์ดิบที่ใช้ผลิตไบโอชาร์ เช่น ชานอ้อย แกลบ ซังข้าวโพด ขี้เลื่อยสน ชนิดของวัตถุดิบมีผลอย่างมากต่อคุณสมบัติของไบโอชาร์ที่ได้',
    },
  },
  {
    abbr: 'Pyrolysis', cat: 'General', color: '#22c55e',
    bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-600',
    full: { en: 'Pyrolysis', th: 'กระบวนการไพโรไลซิส' },
    def: {
      en: 'The thermochemical process of heating organic material (300–900°C) in the absence of oxygen. This converts biomass into biochar (solid), bio-oil (liquid), and syngas (gas).',
      th: 'กระบวนการสลายตัวทางเคมีด้วยความร้อน (300–900°C) ในสภาวะปราศจากออกซิเจน แปลงชีวมวลเป็นไบโอชาร์ (ของแข็ง) น้ำมันชีวภาพ (ของเหลว) และก๊าซสังเคราะห์ (ก๊าซ)',
    },
  },
  {
    abbr: 'Adsorption', cat: 'General', color: '#22c55e',
    bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-600',
    full: { en: 'Adsorption', th: 'การดูดซับบนผิว' },
    def: {
      en: 'The process by which gas or liquid molecules (e.g., CO₂) attach to and accumulate on the surface of a solid material. Different from absorption, which involves uptake into the bulk of the solid.',
      th: 'กระบวนการที่โมเลกุลก๊าซหรือของเหลว (เช่น CO₂) เกาะติดและสะสมบนพื้นผิวของวัสดุแข็ง ต่างจากการดูดซึม (Absorption) ซึ่งโมเลกุลเข้าไปในเนื้อวัสดุ',
    },
  },
  {
    abbr: 'Sequestration', cat: 'General', color: '#22c55e',
    bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-600',
    full: { en: 'Carbon Sequestration', th: 'การกักเก็บคาร์บอน' },
    def: {
      en: 'Long-term removal of CO₂ from the atmosphere and storage in a stable form. Biochar sequesters carbon by locking it in a recalcitrant structure that resists decomposition for hundreds of years.',
      th: 'การดึง CO₂ ออกจากชั้นบรรยากาศและกักเก็บในรูปแบบที่เสถียรระยะยาว ไบโอชาร์กักเก็บคาร์บอนโดยล็อกไว้ในโครงสร้างที่ทนทานต่อการสลายตัวนับร้อยปี',
    },
  },
  {
    abbr: 'Recalcitrance', cat: 'General', color: '#22c55e',
    bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-600',
    full: { en: 'Recalcitrance', th: 'ความทนทานต่อการสลายตัว' },
    def: {
      en: 'The resistance of biochar\'s carbon structure to biological or chemical breakdown. Highly recalcitrant biochar can persist in soil for 100–1,000+ years, making it a reliable long-term carbon sink.',
      th: 'ความสามารถของโครงสร้างคาร์บอนในไบโอชาร์ในการต้านทานการสลายตัวทางชีวภาพหรือทางเคมี ไบโอชาร์ที่มีความทนทานสูงสามารถคงอยู่ในดินได้นาน 100–1,000+ ปี',
    },
  },

  // ── Characterization ─────────────────────────────────────────────────────────
  {
    abbr: 'BET', cat: 'Characterization', color: '#3b82f6',
    bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-600',
    full: { en: 'Brunauer–Emmett–Teller (Surface Area)', th: 'บรูนาวเออร์–เอมเมตต์–เทลเลอร์ (พื้นที่ผิวจำเพาะ)' },
    def: {
      en: 'A standard laboratory technique that measures the total specific surface area of a porous material (in m²/g) by analyzing the adsorption of nitrogen gas at low temperature. Higher BET → more sites for CO₂ capture.',
      th: 'เทคนิคมาตรฐานในห้องปฏิบัติการที่วัดพื้นที่ผิวจำเพาะรวมของวัสดุรูพรุน (m²/g) โดยวิเคราะห์การดูดซับก๊าซไนโตรเจนที่อุณหภูมิต่ำ BET สูงขึ้น → มีจุดดักจับ CO₂ มากขึ้น',
    },
  },
  {
    abbr: 'Pore Volume', cat: 'Characterization', color: '#3b82f6',
    bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-600',
    full: { en: 'Total Pore Volume', th: 'ปริมาตรรูพรุนรวม' },
    def: {
      en: 'The cumulative volume of all pores inside a biochar particle (cm³/g or m³/kg). A higher pore volume means more space to store adsorbed molecules like CO₂.',
      th: 'ปริมาตรสะสมของรูพรุนทั้งหมดภายในอนุภาคไบโอชาร์ (cm³/g หรือ m³/kg) ปริมาตรรูพรุนสูงหมายถึงมีพื้นที่เก็บโมเลกุล CO₂ ที่ถูกดูดซับได้มากกว่า',
    },
  },
  {
    abbr: 'Micropore', cat: 'Characterization', color: '#3b82f6',
    bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-600',
    full: { en: 'Micropore (< 2 nm)', th: 'รูพรุนขนาดเล็ก (< 2 นาโนเมตร)' },
    def: {
      en: 'Pores smaller than 2 nanometres in diameter. CO₂ molecules (kinetic diameter ≈ 0.33 nm) are selectively trapped here, making micropore volume the single most important factor for CO₂ adsorption capacity.',
      th: 'รูพรุนที่มีเส้นผ่านศูนย์กลางน้อยกว่า 2 นาโนเมตร โมเลกุล CO₂ (เส้นผ่านศูนย์กลางจลนศาสตร์ ≈ 0.33 nm) ถูกดักจับได้อย่างเลือกสรรที่นี่ ทำให้ปริมาตรรูพรุนขนาดเล็กเป็นปัจจัยสำคัญที่สุดต่อความสามารถดูดซับ CO₂',
    },
  },
  {
    abbr: 'Mesopore', cat: 'Characterization', color: '#3b82f6',
    bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-600',
    full: { en: 'Mesopore (2–50 nm)', th: 'รูพรุนขนาดกลาง (2–50 นาโนเมตร)' },
    def: {
      en: 'Pores between 2 and 50 nm. They act as transport highways that allow molecules to reach deeper micropores. Important for large-molecule adsorption and catalyst support applications.',
      th: 'รูพรุนระหว่าง 2 ถึง 50 นาโนเมตร ทำหน้าที่เป็นเส้นทางลำเลียงให้โมเลกุลเข้าถึงรูพรุนขนาดเล็กที่ลึกกว่า สำคัญสำหรับการดูดซับโมเลกุลขนาดใหญ่และรองรับตัวเร่งปฏิกิริยา',
    },
  },
  {
    abbr: 'FTIR', cat: 'Characterization', color: '#3b82f6',
    bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-600',
    full: { en: 'Fourier-Transform Infrared Spectroscopy', th: 'ฟูเรียร์ทรานสฟอร์มอินฟราเรดสเปกโทรสโกปี' },
    def: {
      en: 'An analytical technique that identifies chemical functional groups (–OH, C=O, C–H, etc.) on the biochar surface by measuring how it absorbs infrared light. Functional groups affect reactivity and adsorption selectivity.',
      th: 'เทคนิคเชิงวิเคราะห์ที่ระบุหมู่ฟังก์ชันทางเคมี (–OH, C=O, C–H ฯลฯ) บนพื้นผิวไบโอชาร์ โดยวัดการดูดซับแสงอินฟราเรด หมู่ฟังก์ชันส่งผลต่อปฏิกิริยาเคมีและความเลือกสรรในการดูดซับ',
    },
  },
  {
    abbr: 'XRD', cat: 'Characterization', color: '#3b82f6',
    bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-600',
    full: { en: 'X-ray Diffraction', th: 'การเลี้ยวเบนรังสีเอกซ์' },
    def: {
      en: 'A technique that analyses the crystalline structure of biochar. Most biochars are amorphous (disordered), but higher pyrolysis temperatures develop more graphitic (ordered) carbon — visible as sharper XRD peaks.',
      th: 'เทคนิควิเคราะห์โครงสร้างผลึกของไบโอชาร์ ไบโอชาร์ส่วนใหญ่มีโครงสร้างแบบอสัณฐาน แต่อุณหภูมิไพโรไลซิสสูงกว่าจะพัฒนาคาร์บอนแบบกราไฟต์ (มีระเบียบ) ซึ่งเห็นได้จากยอดพีคที่คมขึ้นใน XRD',
    },
  },

  // ── Activation ───────────────────────────────────────────────────────────────
  {
    abbr: 'Activation', cat: 'Activation', color: '#a855f7',
    bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-600',
    full: { en: 'Activation', th: 'การกระตุ้น' },
    def: {
      en: 'A post-pyrolysis treatment (chemical or physical) that dramatically increases biochar\'s surface area and pore volume by etching new channels into the carbon matrix. Can increase surface area from ~50 m²/g to 3,000+ m²/g.',
      th: 'การบำบัดหลังการไพโรไลซิส (ทางเคมีหรือทางกายภาพ) ที่เพิ่มพื้นที่ผิวและปริมาตรรูพรุนของไบโอชาร์อย่างมาก โดยการกัดกร่องช่องใหม่ในเมทริกซ์คาร์บอน สามารถเพิ่มพื้นที่ผิวจาก ~50 m²/g ไปถึง 3,000+ m²/g',
    },
  },
  {
    abbr: 'KOH', cat: 'Activation', color: '#a855f7',
    bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-600',
    full: { en: 'Potassium Hydroxide', th: 'โพแทสเซียมไฮดรอกไซด์' },
    def: {
      en: 'The most widely used chemical activator. KOH reacts with carbon at 600–900°C through a series of redox reactions that etch micropores throughout the biochar matrix. Produces the highest surface areas (up to 3,157 m²/g in this database).',
      th: 'ตัวกระตุ้นทางเคมีที่ใช้กันแพร่หลายที่สุด KOH ทำปฏิกิริยากับคาร์บอนที่ 600–900°C ผ่านปฏิกิริยารีดอกซ์หลายขั้นตอนที่กัดรูพรุนขนาดเล็กทั่วเมทริกซ์ไบโอชาร์ ให้พื้นที่ผิวสูงสุด (ถึง 3,157 m²/g ในฐานข้อมูลนี้)',
    },
  },
  {
    abbr: 'K₂CO₃', cat: 'Activation', color: '#a855f7',
    bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-600',
    full: { en: 'Potassium Carbonate', th: 'โพแทสเซียมคาร์บอเนต' },
    def: {
      en: 'A milder chemical activator compared to KOH. It produces well-developed microporous structures at lower temperatures and is considered more environmentally benign. Often preferred for food-related or pharmaceutical applications.',
      th: 'ตัวกระตุ้นทางเคมีที่ไม่รุนแรงกว่า KOH ให้โครงสร้างรูพรุนขนาดเล็กที่พัฒนาดีที่อุณหภูมิต่ำกว่า และถือว่าเป็นมิตรต่อสิ่งแวดล้อมมากกว่า มักนิยมใช้สำหรับการประยุกต์ด้านอาหารหรือเภสัชกรรม',
    },
  },
  {
    abbr: 'KOH-CO₂', cat: 'Activation', color: '#a855f7',
    bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-600',
    full: { en: 'Combined Chemical + Physical Activation', th: 'การกระตุ้นแบบผสม (เคมี + กายภาพ)' },
    def: {
      en: 'A two-step activation process: first impregnate biochar with KOH (chemical), then activate with CO₂ gas at high temperature (physical). The combination often yields better pore development than either method alone.',
      th: 'กระบวนการกระตุ้นสองขั้นตอน: แช่ไบโอชาร์ด้วย KOH (ทางเคมี) แล้วกระตุ้นด้วยก๊าซ CO₂ ที่อุณหภูมิสูง (ทางกายภาพ) การรวมกันมักให้การพัฒนารูพรุนที่ดีกว่าการใช้วิธีเดียว',
    },
  },
  {
    abbr: 'CO₂ Act.', cat: 'Activation', color: '#a855f7',
    bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-600',
    full: { en: 'Physical Activation with CO₂', th: 'การกระตุ้นทางกายภาพด้วย CO₂' },
    def: {
      en: 'A gas-phase activation method where CO₂ reacts with carbon atoms at 800–1,000°C (C + CO₂ → 2CO), selectively etching pores. Produces fewer chemical residues than chemical activation and is easier to scale up.',
      th: 'วิธีการกระตุ้นในเฟสก๊าซที่ CO₂ ทำปฏิกิริยากับอะตอมคาร์บอนที่ 800–1,000°C (C + CO₂ → 2CO) กัดรูพรุนแบบเลือกสรร มีสารตกค้างทางเคมีน้อยกว่า และขยายขนาดได้ง่ายกว่าการกระตุ้นทางเคมี',
    },
  },
  {
    abbr: 'LiCl', cat: 'Activation', color: '#a855f7',
    bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-600',
    full: { en: 'Lithium Chloride', th: 'ลิเทียมคลอไรด์' },
    def: {
      en: 'A salt-based activating agent used in specific activation protocols to introduce mesopores or tune the pore size distribution. Less common than KOH/K₂CO₃ but valuable for tailored applications.',
      th: 'ตัวกระตุ้นประเภทเกลือที่ใช้ในโปรโตคอลการกระตุ้นเฉพาะเพื่อสร้างรูพรุนขนาดกลางหรือปรับการกระจายขนาดรูพรุน ไม่ค่อยพบบ่อยเท่า KOH/K₂CO₃ แต่มีคุณค่าสำหรับการประยุกต์เฉพาะทาง',
    },
  },
  {
    abbr: 'Imp. Ratio', cat: 'Activation', color: '#a855f7',
    bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-600',
    full: { en: 'Activator-to-Biochar Mass Ratio', th: 'อัตราส่วนตัวกระตุ้นต่อไบโอชาร์ (โดยมวล)' },
    def: {
      en: 'The mass ratio of chemical activator to biochar before activation (e.g., 1:1 or 2:1 KOH:biochar). Higher ratios generally yield more pores but can damage the carbon framework if too high.',
      th: 'อัตราส่วนมวลของตัวกระตุ้นต่อไบโอชาร์ก่อนกระตุ้น (เช่น KOH:ไบโอชาร์ = 1:1 หรือ 2:1) อัตราส่วนสูงมักให้รูพรุนมากขึ้น แต่หากสูงเกินไปอาจทำลายโครงสร้างคาร์บอน',
    },
  },

  // ── Process ──────────────────────────────────────────────────────────────────
  {
    abbr: 'Pyro. Temp.', cat: 'Process', color: '#f59e0b',
    bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-600',
    full: { en: 'Pyrolysis Temperature', th: 'อุณหภูมิไพโรไลซิส' },
    def: {
      en: 'The peak furnace temperature during biochar production (°C). In this database: 400–900°C. Higher temperatures increase aromaticity and surface area but reduce biochar yield. The optimal temperature depends on the target application.',
      th: 'อุณหภูมิสูงสุดของเตาเผาระหว่างการผลิตไบโอชาร์ (°C) ในฐานข้อมูลนี้: 400–900°C อุณหภูมิสูงขึ้นจะเพิ่มความเป็นอะโรเมติกและพื้นที่ผิว แต่ลดผลได้ของไบโอชาร์ อุณหภูมิที่เหมาะสมขึ้นอยู่กับการใช้งานที่ต้องการ',
    },
  },
  {
    abbr: 'Res. Time', cat: 'Process', color: '#f59e0b',
    bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-600',
    full: { en: 'Residence Time', th: 'เวลาพักที่อุณหภูมิสูงสุด' },
    def: {
      en: 'The duration (in minutes) that the material is held at the peak pyrolysis or activation temperature. Longer residence times allow more complete reactions. In this database: 10–300 minutes.',
      th: 'ระยะเวลา (นาที) ที่วัสดุถูกเก็บไว้ที่อุณหภูมิไพโรไลซิสหรืออุณหภูมิกระตุ้นสูงสุด เวลาพักนานกว่าช่วยให้ปฏิกิริยาสมบูรณ์มากขึ้น ในฐานข้อมูลนี้: 10–300 นาที',
    },
  },
  {
    abbr: 'Heat. Rate', cat: 'Process', color: '#f59e0b',
    bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-600',
    full: { en: 'Heating Rate', th: 'อัตราการเพิ่มอุณหภูมิ' },
    def: {
      en: 'The speed at which the furnace temperature is raised (°C/min). Slow heating rates (<5°C/min) favour higher biochar yield; fast heating rates promote more volatile release and can develop different pore structures.',
      th: 'ความเร็วในการเพิ่มอุณหภูมิของเตาเผา (°C/นาที) อัตราต่ำ (<5°C/นาที) ให้ผลได้ไบโอชาร์สูงกว่า ส่วนอัตราสูงส่งเสริมการระเหยของสารและสามารถพัฒนาโครงสร้างรูพรุนที่แตกต่างออกไป',
    },
  },
  {
    abbr: 'Ads. Temp.', cat: 'Process', color: '#f59e0b',
    bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-600',
    full: { en: 'Adsorption (Isotherm) Temperature', th: 'อุณหภูมิการวัดการดูดซับ (ไอโซเทิร์ม)' },
    def: {
      en: 'The temperature at which CO₂ uptake is measured experimentally. Lower temperatures (0–25°C) generally produce higher CO₂ uptake. The isotherm curve shows uptake at increasing pressures at a fixed temperature.',
      th: 'อุณหภูมิที่ทำการวัดการดูดซับ CO₂ ในการทดลอง อุณหภูมิต่ำกว่า (0–25°C) มักให้ค่าการดูดซับ CO₂ สูงกว่า เส้นกราฟไอโซเทิร์มแสดงค่าการดูดซับที่ความดันเพิ่มขึ้นที่อุณหภูมิคงที่',
    },
  },

  // ── Units ────────────────────────────────────────────────────────────────────
  {
    abbr: 'mmol/g', cat: 'Units', color: '#06b6d4',
    bg: 'bg-cyan-500/10 border-cyan-500/20', text: 'text-cyan-600',
    full: { en: 'Millimoles per Gram', th: 'มิลลิโมลต่อกรัม' },
    def: {
      en: 'The standard unit for CO₂ adsorption capacity. Tells you how many millimoles of CO₂ are captured per gram of biochar. 1 mmol/g = 44 mg CO₂/g. Higher = better adsorbent.',
      th: 'หน่วยมาตรฐานสำหรับความสามารถในการดูดซับ CO₂ บอกจำนวน CO₂ เป็นมิลลิโมลที่ดักจับได้ต่อกรัมของไบโอชาร์ 1 mmol/g = 44 mg CO₂/g ค่ายิ่งสูง ยิ่งเป็นตัวดูดซับที่ดี',
    },
  },
  {
    abbr: 'm²/g', cat: 'Units', color: '#06b6d4',
    bg: 'bg-cyan-500/10 border-cyan-500/20', text: 'text-cyan-600',
    full: { en: 'Square Metres per Gram', th: 'ตารางเมตรต่อกรัม' },
    def: {
      en: 'The unit for BET specific surface area. A tennis court is ~260 m² — 1 g of top-performing biochar can have more than 12 tennis courts of surface area packed inside.',
      th: 'หน่วยสำหรับพื้นที่ผิวจำเพาะ BET สนามเทนนิส ≈ 260 m² — ไบโอชาร์ที่มีสมรรถนะสูง 1 กรัม สามารถมีพื้นที่เทียบเท่าสนามเทนนิสมากกว่า 12 สนามอยู่ภายใน',
    },
  },
  {
    abbr: 'cm³/g', cat: 'Units', color: '#06b6d4',
    bg: 'bg-cyan-500/10 border-cyan-500/20', text: 'text-cyan-600',
    full: { en: 'Cubic Centimetres per Gram', th: 'ลูกบาศก์เซนติเมตรต่อกรัม' },
    def: {
      en: 'Unit for pore volume. Describes the total internal pore space per gram of biochar. Typical activated biochar values: 0.1–1.2 cm³/g.',
      th: 'หน่วยสำหรับปริมาตรรูพรุน อธิบายพื้นที่รูพรุนภายในรวมต่อกรัมของไบโอชาร์ ค่าทั่วไปของไบโอชาร์ที่กระตุ้นแล้ว: 0.1–1.2 cm³/g',
    },
  },
  {
    abbr: '°C/min', cat: 'Units', color: '#06b6d4',
    bg: 'bg-cyan-500/10 border-cyan-500/20', text: 'text-cyan-600',
    full: { en: 'Degrees Celsius per Minute', th: 'องศาเซลเซียสต่อนาที' },
    def: {
      en: 'The unit for heating rate — how fast the furnace temperature rises. For example, 5°C/min means it takes 100 minutes to go from room temperature to 500°C. Slow = more biochar; fast = more gas/oil.',
      th: 'หน่วยสำหรับอัตราการเพิ่มอุณหภูมิ เช่น 5°C/นาที หมายความว่าต้องใช้เวลา 100 นาทีจากอุณหภูมิห้องไปถึง 500°C ช้า = ไบโอชาร์มากกว่า เร็ว = ก๊าซ/น้ำมันมากกว่า',
    },
  },
  {
    abbr: 'wt%', cat: 'Units', color: '#06b6d4',
    bg: 'bg-cyan-500/10 border-cyan-500/20', text: 'text-cyan-600',
    full: { en: 'Weight Percent', th: 'เปอร์เซ็นต์โดยมวล' },
    def: {
      en: 'Percentage by mass — used for biochar yield (grams of biochar per 100 g of raw biomass) or elemental composition (e.g., 75 wt% carbon).',
      th: 'เปอร์เซ็นต์ตามมวล — ใช้สำหรับผลได้ไบโอชาร์ (กรัมของไบโอชาร์ต่อชีวมวลดิบ 100 กรัม) หรือองค์ประกอบธาตุ (เช่น คาร์บอน 75 wt%)',
    },
  },
];

const CAT_STYLE = {
  General:         'bg-green-500/10 text-green-700 border-green-500/20',
  Characterization:'bg-blue-500/10 text-blue-700 border-blue-500/20',
  Activation:      'bg-purple-500/10 text-purple-700 border-purple-500/20',
  Process:         'bg-amber-500/10 text-amber-700 border-amber-500/20',
  Units:           'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
};

const CATEGORIES = {
  en: ['All', 'General', 'Characterization', 'Activation', 'Process', 'Units'],
  th: ['ทั้งหมด', 'ทั่วไป', 'การวิเคราะห์', 'การกระตุ้น', 'กระบวนการ', 'หน่วยวัด'],
};
const CAT_KEYS = ['All', 'General', 'Characterization', 'Activation', 'Process', 'Units'];

export default function GlossarySection() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('th') ? 'th' : 'en';

  const [search, setSearch]     = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [expanded, setExpanded]   = useState(null);

  const catLabels = CATEGORIES[lang];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return TERMS.filter(term => {
      const catMatch = activeCat === 'All' || term.cat === activeCat;
      const textMatch = !q ||
        term.abbr.toLowerCase().includes(q) ||
        term.full[lang].toLowerCase().includes(q) ||
        term.def[lang].toLowerCase().includes(q) ||
        term.full.en.toLowerCase().includes(q) ||
        term.def.en.toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [search, activeCat, lang]);

  return (
    <div className="space-y-5">
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'th' ? 'ค้นหาคำ ตัวย่อ หรือคำอธิบาย…' : 'Search terms, abbreviations, or descriptions…'}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 placeholder:text-muted-foreground/60"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 sm:flex-nowrap">
          {CAT_KEYS.map((key, idx) => (
            <button key={key} onClick={() => setActiveCat(key)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border whitespace-nowrap transition-all ${
                activeCat === key
                  ? key === 'All'
                    ? 'bg-green-500 text-white border-green-500 shadow-sm shadow-green-500/25'
                    : CAT_STYLE[key] + ' ring-1 ring-current'
                  : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
              }`}>
              {catLabels[idx]}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        {lang === 'th'
          ? <><span className="font-semibold text-foreground">{filtered.length}</span> จากทั้งหมด {TERMS.length} คำ{search && <> ที่ตรงกับ "<span className="font-semibold text-foreground">{search}</span>"</>}</>
          : <>Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {TERMS.length} terms{search && <> matching "<span className="font-semibold text-foreground">{search}</span>"</>}</>
        }
      </p>

      {/* Term cards */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center py-12 text-muted-foreground text-sm">
            {lang === 'th' ? 'ไม่พบคำที่ตรงกับการค้นหา ลองคำอื่น' : 'No terms match your search. Try a different keyword.'}
          </motion.div>
        ) : (
          <div className="overflow-y-auto pr-2" style={{ maxHeight: '34rem' }}>
            <motion.div key="grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((term, i) => {
              const isOpen = expanded === term.abbr;
              return (
                <motion.button
                  key={term.abbr}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setExpanded(isOpen ? null : term.abbr)}
                  className={`text-left glass-card rounded-2xl p-4 border transition-all hover:shadow-md ${
                    isOpen ? `${term.bg} ring-1` : 'border-border hover:border-border/80'
                  }`}
                  style={isOpen ? { '--tw-ring-color': term.color + '60' } : {}}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-space font-bold text-lg leading-tight" style={{ color: term.color }}>
                        {term.abbr}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                        {term.full[lang]}
                      </div>
                    </div>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold border ${CAT_STYLE[term.cat]}`}>
                      {catLabels[CAT_KEYS.indexOf(term.cat)]}
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.p key="full"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-foreground/80 leading-relaxed overflow-hidden">
                        {term.def[lang]}
                      </motion.p>
                    ) : (
                      <motion.p key="preview"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {term.def[lang]}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <p className={`mt-2 text-[10px] font-medium transition-colors ${isOpen ? term.text : 'text-muted-foreground/50'}`}>
                    {isOpen
                      ? (lang === 'th' ? 'คลิกเพื่อย่อ ↑' : 'Click to collapse ↑')
                      : (lang === 'th' ? 'คลิกเพื่ออ่านเพิ่มเติม ↓' : 'Click to read more ↓')
                    }
                  </p>
                </motion.button>
              );
            })}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <p className="text-center text-[10px] text-muted-foreground pt-2 border-t border-border/50">
        {lang === 'th'
          ? (<><span>ศัพท์อ้างอิงจาก IUPAC, ASTM D7544 และวรรณกรรมไบโอชาร์ที่ผ่านการตรวจสอบ · ฐานข้อมูล Database · </span><a href="#references" className="text-green-500 hover:underline">รายการอ้างอิงทางวิทยาศาสตร์</a></>)
          : (<><span>Terms sourced from IUPAC nomenclature, ASTM D7544, and peer-reviewed biochar literature · Database records · </span><a href="#references" className="text-green-500 hover:underline">Scientific References</a></>)
        }
      </p>
    </div>
  );
}
