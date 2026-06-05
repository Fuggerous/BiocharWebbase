// @ts-nocheck
/**
 * BMC3D — 3D Business Model Canvas  |  Biochar Value System
 * Supports dark mode (deep forest) and light mode (clean pastel).
 * Reads isDark from the app-wide ThemeContext — no extra props needed.
 */
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../lib/ThemeContext';

/* ═══════════════════════════════════════════════════════
   THEME TOKENS
═══════════════════════════════════════════════════════ */
const DARK = {
  canvasBg:     '#030d03',
  gridLine:     'rgba(34,197,94,0.05)',
  headerText:   'rgba(74,222,128,0.55)',
  cardBg:       (dark) => `linear-gradient(145deg, ${dark}f2 0%, ${dark}cc 60%, ${dark}ea 100%)`,
  cardBorder:   (color, active) => `${color}${active ? '55' : '22'}`,
  cardShadow:   (color, active) => active
    ? `0 20px 52px rgba(0,0,0,0.80), 0 0 0 1px ${color}45, 0 6px 0 rgba(0,0,0,0.55), inset 0 1px 0 ${color}22`
    : `0 7px 24px rgba(0,0,0,0.60), 0 4px 0 rgba(0,0,0,0.40), inset 0 1px 0 ${color}12`,
  accentBar:    (color, active) => `linear-gradient(90deg,transparent,${color},transparent)`,
  accentBarOp:  (active) => active ? 1 : 0.45,
  glowBg:       (color) => `radial-gradient(ellipse at 40% 25%, ${color}1a 0%, transparent 65%)`,
  bulletText:   'rgba(220,252,231,0.72)',
  zoneText:     (color) => `${color}60`,
  labelText:    (color) => color,
  labelShadow:  (color, active) => active ? `0 0 12px ${color}75` : 'none',
  iconBg:       (color, active) => `${color}14`,
  iconBorder:   (color, active) => `${color}${active ? '45' : '24'}`,
  iconShadow:   (color, active) => active ? `0 0 18px ${color}50, 0 3px 6px rgba(0,0,0,0.5)` : '0 3px 6px rgba(0,0,0,0.4)',
  floorGlow:    'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.14) 0%, transparent 70%)',
  panelBg:      (color) => `rgba(2,8,2,0.97)`,
  panelBorder:  (color) => `${color}30`,
  panelShadow:  (color) => `-8px 0 52px rgba(0,0,0,0.75), inset 1px 0 0 ${color}18`,
  panelTitle:   (color) => color,
  panelZone:    'rgba(74,222,128,0.45)',
  panelClose:   (color) => `${color}20`,
  detailBg:     (color) => `${color}0a`,
  detailBorder: (color) => `${color}16`,
  detailText:   'rgba(220,252,231,0.85)',
  detailDot:    (color) => color,
  hintText:     (color) => `${color}88`,
  footerText:   'rgba(74,222,128,0.28)',
  particleOp:   0.55,
};

const LIGHT = {
  canvasBg:     '#f2f7f2',
  gridLine:     'rgba(34,197,94,0.10)',
  headerText:   '#166534',
  cardBg:       (dark, color) => `linear-gradient(145deg, #ffffff 0%, ${color}09 60%, #f9fdf9 100%)`,
  cardBorder:   (color, active) => `${color}${active ? '70' : '35'}`,
  cardShadow:   (color, active) => active
    ? `0 16px 42px rgba(0,0,0,0.14), 0 0 0 1.5px ${color}65, 0 5px 0 ${color}28, inset 0 1px 0 ${color}30`
    : `0 4px 16px rgba(0,0,0,0.08), 0 3px 0 ${color}1a, inset 0 1px 0 ${color}18`,
  accentBar:    (color, active) => `linear-gradient(90deg,transparent,${color},transparent)`,
  accentBarOp:  (active) => active ? 1 : 0.55,
  glowBg:       (color) => `radial-gradient(ellipse at 40% 25%, ${color}14 0%, transparent 60%)`,
  bulletText:   '#374151',
  zoneText:     (color) => `${color}90`,
  labelText:    (color) => color,
  labelShadow:  () => 'none',
  iconBg:       (color, active) => active ? `${color}20` : `${color}12`,
  iconBorder:   (color, active) => `${color}${active ? '55' : '30'}`,
  iconShadow:   (color, active) => active ? `0 0 16px ${color}45, 0 2px 5px rgba(0,0,0,0.08)` : '0 2px 5px rgba(0,0,0,0.06)',
  floorGlow:    'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 70%)',
  panelBg:      (color) => `rgba(255,255,255,0.98)`,
  panelBorder:  (color) => `${color}40`,
  panelShadow:  (color) => `-6px 0 40px rgba(0,0,0,0.12), inset 1px 0 0 ${color}20`,
  panelTitle:   (color) => color,
  panelZone:    '#166534',
  panelClose:   (color) => `${color}18`,
  detailBg:     (color) => `${color}0d`,
  detailBorder: (color) => `${color}22`,
  detailText:   '#1e293b',
  detailDot:    (color) => color,
  hintText:     (color) => `${color}a0`,
  footerText:   '#6b7280',
  particleOp:   0.40,
};

/* ═══════════════════════════════════════════════════════
   BIOCHAR SVG ICONS  (sized via w/h props)
═══════════════════════════════════════════════════════ */
const SZ = 44; // master icon pixel size

const IconPartners = ({ c, s = SZ }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
    <circle cx="10" cy="13" r="5" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.1"/>
    <circle cx="30" cy="13" r="5" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.1"/>
    <circle cx="20" cy="30" r="5" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.1"/>
    <line x1="15" y1="13" x2="25" y2="13" stroke={c} strokeWidth="1.5"/>
    <line x1="13" y1="17" x2="17.5" y2="26" stroke={c} strokeWidth="1.5"/>
    <line x1="27" y1="17" x2="22.5" y2="26" stroke={c} strokeWidth="1.5"/>
    <circle cx="20" cy="20" r="2.5" fill={c} opacity="0.45"/>
    <path d="M6 37 L6 29" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <ellipse cx="4.5" cy="31" rx="2.2" ry="3.8" stroke={c} strokeWidth="1" transform="rotate(-20 4.5 31)" fill={c} fillOpacity="0.2"/>
    <ellipse cx="7.5" cy="29.5" rx="2.2" ry="3.8" stroke={c} strokeWidth="1" transform="rotate(20 7.5 29.5)" fill={c} fillOpacity="0.2"/>
  </svg>
);

const IconActivities = ({ c, s = SZ }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
    <rect x="11" y="20" width="18" height="13" rx="2" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.07"/>
    <path d="M15 20 L15 15 Q15 13 17 13 L23 13 Q25 13 25 15 L25 20" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.05"/>
    <path d="M20 19 C17.5 15.5 18 11.5 20 9 C20 12 22 13.5 22 15.5 C23.5 14 23 11 22.5 9.5 C25 12 26 16 23 19 C23.5 17.5 23 16 22 16.5 C21.5 18 21 19 20 19Z" fill={c} opacity="0.85"/>
    <path d="M17 7 Q16 5 17 3" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
    <path d="M20 6 Q20 4 21 2" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
    <line x1="14" y1="37" x2="26" y2="37" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    <line x1="17" y1="35" x2="17" y2="33" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="20" y1="35" x2="20" y2="33" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="23" y1="35" x2="23" y2="33" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconValue = ({ c, s = SZ }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
    <path d="M20 34 C20 34 7 25 7 16 C7 9 13 5 20 7 C27 5 33 9 33 16 C33 25 20 34 20 34Z" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.12"/>
    <path d="M20 34 L20 9" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 22 L14 17" stroke={c} strokeWidth="1" opacity="0.45" strokeLinecap="round"/>
    <path d="M20 22 L26 17" stroke={c} strokeWidth="1" opacity="0.45" strokeLinecap="round"/>
    <path d="M20 27 L15 22.5" stroke={c} strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
    <path d="M5 38 L5 32 L10 32" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    <text x="2" y="31" fill={c} fontSize="5.5" fontWeight="bold" opacity="0.8" fontFamily="monospace">CO₂</text>
    <circle cx="5" cy="38" r="1.5" fill={c} opacity="0.6"/>
  </svg>
);

const IconRelationships = ({ c, s = SZ }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
    <path d="M20 33 C20 33 8 24 8 16 C8 12 11 9 15 9 C17 9 19 11 20 13 C21 11 23 9 25 9 C29 9 32 12 32 16 C32 24 20 33 20 33Z" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.15"/>
    <circle cx="13" cy="6" r="3.2" stroke={c} strokeWidth="1.4" fill={c} fillOpacity="0.08"/>
    <circle cx="27" cy="6" r="3.2" stroke={c} strokeWidth="1.4" fill={c} fillOpacity="0.08"/>
    <path d="M16 6 Q20 4 24 6" stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <path d="M18 21 L19.5 22.5 L23 19" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSegments = ({ c, s = SZ }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
    <circle cx="9"  cy="9"  r="3.8" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.08"/>
    <path d="M3 20 C3 15 15 15 15 20" stroke={c} strokeWidth="1.5" fill="none"/>
    <circle cx="31" cy="9"  r="3.8" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.08"/>
    <path d="M25 20 C25 15 37 15 37 20" stroke={c} strokeWidth="1.5" fill="none"/>
    <circle cx="20" cy="10" r="4.5" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.2"/>
    <path d="M13.5 24 C13.5 18.5 26.5 18.5 26.5 24" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.1"/>
    <rect x="15" y="30" width="10" height="7" stroke={c} strokeWidth="1.3" fill={c} fillOpacity="0.07" rx="1"/>
    <rect x="17" y="32" width="2.5" height="2.5" fill={c} opacity="0.5" rx="0.5"/>
    <rect x="20.5" y="32" width="2.5" height="2.5" fill={c} opacity="0.5" rx="0.5"/>
    <line x1="18" y1="30" x2="18" y2="27" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="22" y1="30" x2="22" y2="28" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IconResources = ({ c, s = SZ }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="10" rx="12" ry="4.5" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.1"/>
    <path d="M8 10 L8 22 C8 25.5 13.4 28 20 28 C26.6 28 32 25.5 32 22 L32 10" stroke={c} strokeWidth="1.8" fill={c} fillOpacity="0.06"/>
    <path d="M8 16 C8 19.5 13.4 22 20 22 C26.6 22 32 19.5 32 16" stroke={c} strokeWidth="1.3" fill="none" opacity="0.5"/>
    <path d="M27 30 C25 27 25 23.5 27.5 21.5 C30 23.5 30 27 27 30Z" fill={c} opacity="0.7"/>
    <line x1="27" y1="30" x2="27.5" y2="22" stroke={c} strokeWidth="1" strokeLinecap="round"/>
    <path d="M16 10 L16 7 M20 10 L20 6.5 M24 10 L24 7" stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
  </svg>
);

const IconChannels = ({ c, s = SZ }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="19" r="3.5" fill={c}/>
    <path d="M13.5 12.5 A9.5 9.5 0 0 0 13.5 25.5" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M26.5 12.5 A9.5 9.5 0 0 1 26.5 25.5" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M8 7 A17 17 0 0 0 8 31" stroke={c} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M32 7 A17 17 0 0 1 32 31" stroke={c} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.5"/>
    <line x1="20" y1="38" x2="20" y2="22.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="16" y1="35" x2="24" y2="35" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    <rect x="16" y="35" width="8" height="4" rx="1" stroke={c} strokeWidth="1" fill={c} fillOpacity="0.15"/>
  </svg>
);

const IconCosts = ({ c, s = SZ }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
    <line x1="20" y1="5" x2="20" y2="35" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="6" y1="13" x2="34" y2="13" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M4 13 C4 18 12 20 12 13" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.15"/>
    <line x1="6" y1="13" x2="12" y2="13" stroke={c} strokeWidth="1"/>
    <circle cx="8" cy="14.5" r="2" fill={c} opacity="0.6"/>
    <path d="M28 13 C28 18 36 20 36 13" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.08"/>
    <line x1="28" y1="13" x2="34" y2="13" stroke={c} strokeWidth="1"/>
    <line x1="15" y1="35" x2="25" y2="35" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="19" y="35" width="2" height="4" rx="1" fill={c} opacity="0.4"/>
    <path d="M28 22 L35 22 L35 30 L28 30 L26 26 Z" stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.08"/>
    <circle cx="31" cy="25" r="1.2" fill={c} opacity="0.5"/>
  </svg>
);

const IconRevenue = ({ c, s = SZ }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
    <rect x="4"  y="29" width="5.5" height="7"  rx="1" fill={c} opacity="0.45"/>
    <rect x="11" y="23" width="5.5" height="13" rx="1" fill={c} opacity="0.60"/>
    <rect x="18" y="17" width="5.5" height="19" rx="1" fill={c} opacity="0.78"/>
    <rect x="25" y="11" width="5.5" height="25" rx="1" fill={c}/>
    <line x1="3" y1="37" x2="37" y2="37" stroke={c} strokeWidth="1.5"/>
    <circle cx="33" cy="9" r="5.5" stroke={c} strokeWidth="1.4" fill={c} fillOpacity="0.08"/>
    <path d="M33 6 C31 6 29.5 7.2 29.5 9 C29.5 10.8 31 12 33 12 C34 12 35 11.5 35.5 10.5" stroke={c} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M34.5 6.5 C33.5 5.5 33 5 33 5 C33 5 32.5 5.5 32 6.5 C31.5 7.5 32 8.5 33 9 C34 8.5 34.8 7.5 34.5 6.5Z" fill={c} opacity="0.6"/>
  </svg>
);

const ICON_MAP = {
  partners:      IconPartners,
  activities:    IconActivities,
  value:         IconValue,
  relationships: IconRelationships,
  revenue:       IconRevenue,
  resources:     IconResources,
  channels:      IconChannels,
  segments:      IconSegments,
  costs:         IconCosts,
};

/* ═══════════════════════════════════════════════════════
   BMC DATA
═══════════════════════════════════════════════════════ */
const BMC_DATA = [
  {
    id: 'partners',    gridArea: '1 / 1 / 3 / 3',
    label: 'Key Partners',            labelTh: 'พันธมิตรหลัก',
    icon: 'partners',  color: '#f97316', dark: '#1c0800', zone: 'below',
    details:   ['Agriculture: farmers & cooperatives','Industry: biomass, energy, food','Research: NSTDA, universities, MTEC','Government & carbon market partners'],
    detailsTh: ['ภาคเกษตร: เกษตรกรและสหกรณ์','ภาคอุตสาหกรรม: ชีวมวล พลังงาน อาหาร','ภาควิจัย: NSTDA มหาวิทยาลัย MTEC','ภาครัฐและพันธมิตรตลาดคาร์บอน'],
  },
  {
    id: 'activities',  gridArea: '1 / 3 / 2 / 5',
    label: 'Key Activities',          labelTh: 'กิจกรรมหลัก',
    icon: 'activities', color: '#ef4444', dark: '#1a0404', zone: 'below',
    details:   ['Sustainable biomass supply chain','Standardised pyrolysis production','R&D and quality improvement','MRV operations & community capacity'],
    detailsTh: ['ห่วงโซ่อุปทานชีวมวลอย่างยั่งยืน','การผลิต pyrolysis ตามมาตรฐาน','งานวิจัยและพัฒนาคุณภาพ','การดำเนินงาน MRV และเสริมศักยภาพชุมชน'],
  },
  {
    id: 'value',       gridArea: '1 / 5 / 3 / 7',
    label: 'Value Propositions',      labelTh: 'คุณค่าที่ส่งมอบ',
    icon: 'value',      color: '#22c55e', dark: '#041a0a', zone: 'above',
    details:   ['Optimise yield, reduce cost, earn carbon credits','Sustainable materials & ESG compliance','Carbon sequestration + MRV verification','BCG economy, lower PM2.5, carbon neutrality'],
    detailsTh: ['เพิ่มผลผลิต ลดต้นทุน และสร้างรายได้จากคาร์บอนเครดิต','วัสดุยั่งยืนและรองรับการปฏิบัติตาม ESG','การกักเก็บคาร์บอนพร้อมการยืนยันผลด้วย MRV','เศรษฐกิจ BCG ลด PM2.5 และสนับสนุนคาร์บอนเป็นกลาง'],
  },
  {
    id: 'relationships', gridArea: '1 / 7 / 2 / 9',
    label: 'Customer Relationships',  labelTh: 'ความสัมพันธ์กับลูกค้า',
    icon: 'relationships', color: '#a855f7', dark: '#130620', zone: 'above',
    details:   ['Tech transfer & production support','Strategic Partnership, Joint Development','MRV credibility & long-term trust building'],
    detailsTh: ['การถ่ายทอดเทคโนโลยีและสนับสนุนการผลิต','ความร่วมมือเชิงกลยุทธ์และการพัฒนาร่วม','สร้างความน่าเชื่อถือของ MRV และความไว้วางใจระยะยาว'],
  },
  {
    id: 'segments',    gridArea: '1 / 9 / 3 / 11',
    label: 'Customer Segments',       labelTh: 'กลุ่มลูกค้า',
    icon: 'segments',   color: '#06b6d4', dark: '#021318', zone: 'above',
    details:   ['Farmers & crop residue producers','Industry (construction, food, energy)','Carbon Credit orgs (ESG / Net Zero)','Government & BCG development agencies'],
    detailsTh: ['เกษตรกรและผู้ผลิตเศษวัสดุทางการเกษตร','ภาคอุตสาหกรรม (ก่อสร้าง อาหาร พลังงาน)','องค์กรด้านคาร์บอนเครดิต (ESG / Net Zero)','หน่วยงานรัฐและการพัฒนา BCG'],
  },
  {
    id: 'resources',   gridArea: '2 / 3 / 3 / 5',
    label: 'Key Resources',           labelTh: 'ทรัพยากรหลัก',
    icon: 'resources',  color: '#3b82f6', dark: '#040e1e', zone: 'below',
    details:   ['Pyrolysis technology & production','MRV database & digital platform','Agricultural raw material network','Domain expertise in biochar & carbon'],
    detailsTh: ['เทคโนโลยีและสายการผลิต pyrolysis','ฐานข้อมูล MRV และแพลตฟอร์มดิจิทัล','เครือข่ายวัตถุดิบจากภาคเกษตร','ความเชี่ยวชาญด้านไบโอชาร์และคาร์บอน'],
  },
  {
    id: 'channels',    gridArea: '2 / 7 / 3 / 9',
    label: 'Channels',                labelTh: 'ช่องทาง',
    icon: 'channels',   color: '#eab308', dark: '#161000', zone: 'above',
    details:   ['Biochar Production Centres on-site','B2B purchase agreements & partnerships','Digital Platform — MRV & carbon marketplace','Community & local government network'],
    detailsTh: ['ศูนย์ผลิตไบโอชาร์ในพื้นที่','ข้อตกลงจัดซื้อและความร่วมมือแบบ B2B','แพลตฟอร์มดิจิทัล — MRV และตลาดคาร์บอน','เครือข่ายชุมชนและหน่วยงานท้องถิ่น'],
  },
  {
    id: 'costs',       gridArea: '3 / 1 / 4 / 6',
    label: 'Cost Structure',          labelTh: 'โครงสร้างต้นทุน',
    icon: 'costs',      color: '#64748b', dark: '#080c10', zone: 'below',
    details:   ['Machine & facility setup','Biomass procurement & quality','R&D and product improvement','MRV system, personnel & certification'],
    detailsTh: ['การลงทุนเครื่องจักรและสถานที่','การจัดหาชีวมวลและคุณภาพวัตถุดิบ','งานวิจัย พัฒนา และปรับปรุงผลิตภัณฑ์','ระบบ MRV บุคลากร และการรับรองมาตรฐาน'],
  },
  {
    id: 'revenue',     gridArea: '3 / 6 / 4 / 11',
    label: 'Revenue Streams',         labelTh: 'แหล่งรายได้',
    icon: 'revenue',    color: '#ec4899', dark: '#1a0410', zone: 'above',
    details:   ['Biochar product sales (raw & blended)','Carbon Credit (VCU, Premium)','Consulting, MRV design, training','Licensing, platform fees & data services'],
    detailsTh: ['รายได้จากการขายไบโอชาร์ (ดิบและผสม)','รายได้จากคาร์บอนเครดิต (VCU, Premium)','ที่ปรึกษา การออกแบบ MRV และการฝึกอบรม','ค่าลิขสิทธิ์ ค่าบริการแพลตฟอร์ม และบริการข้อมูล'],
  },
];

/* ═══════════════════════════════════════════════════════
   AMBIENT PARTICLES
═══════════════════════════════════════════════════════ */
const pr = s => { const x = Math.sin(s) * 10000; return x - Math.floor(x); };
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  left:  `${4 + pr(i * 7.3) * 92}%`,
  top:   `${4 + pr(i * 4.1) * 92}%`,
  size:  2 + pr(i * 9.7) * 3,
  delay: pr(i * 3.2) * 5,
  dur:   3 + pr(i * 6.1) * 3.5,
  color: ['#22c55e','#86efac','#06b6d4','#eab308','#f97316','#a855f7'][i % 6],
}));

/* ═══════════════════════════════════════════════════════
   BMC CARD
═══════════════════════════════════════════════════════ */
function BMCCard({ cell, isTh, onClick, isSelected, T }) {
  const [hov, setHov] = useState(false);
  const Icon  = ICON_MAP[cell.icon];
  const label = isTh ? cell.labelTh : cell.label;
  const bullets = isTh && cell.detailsTh?.length ? cell.detailsTh : cell.details;
  const active = hov || isSelected;

  const isWide = cell.id === 'costs' || cell.id === 'revenue';
  const isTall = cell.id === 'partners' || cell.id === 'value' || cell.id === 'segments';
  const maxBullets = isWide ? 4 : isTall ? 4 : 3;

  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      onClick={onClick}
      animate={{ y: active ? -10 : 0, scale: active ? 1.018 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      style={{
        gridArea:      cell.gridArea,
        background:    T.cardBg(cell.dark, cell.color),
        border:        `1.5px solid ${T.cardBorder(cell.color, active)}`,
        borderRadius:  '12px',
        cursor:        'pointer',
        position:      'relative',
        overflow:      'hidden',
        boxShadow:     T.cardShadow(cell.color, active),
        transition:    'box-shadow 0.22s ease, border-color 0.22s ease',
      }}
    >
      {/* Top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
        background: T.accentBar(cell.color, active),
        opacity: T.accentBarOp(active),
        transition: 'opacity 0.22s',
      }}/>

      {/* Hover glow */}
      {active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: T.glowBg(cell.color),
          }}
        />
      )}

      {/* Bottom depth */}
      <div style={{
        position: 'absolute', bottom: '-5px', left: '8px', right: '8px', height: '8px',
        background: cell.color, borderRadius: '0 0 10px 10px',
        opacity: active ? 0.18 : 0.08, filter: 'blur(5px)', pointerEvents: 'none',
        transition: 'opacity 0.22s',
      }}/>

      {/* Content */}
      <div style={{
        padding:        isWide ? '12px 16px' : '14px 15px',
        height:         '100%',
        display:        'flex',
        flexDirection:  isWide ? 'row' : 'column',
        gap:            isWide ? '16px' : '0',
        boxSizing:      'border-box',
      }}>

        {/* Icon + label */}
        <div style={{
          display:    'flex',
          alignItems: isWide ? 'center' : 'flex-start',
          gap:        '11px',
          marginBottom: isWide ? 0 : '11px',
          flexShrink: 0,
          minWidth:   isWide ? 180 : 'auto',
        }}>
          <div style={{
            flexShrink: 0, padding: '8px', borderRadius: '10px',
            background: T.iconBg(cell.color, active),
            border:     `1.5px solid ${T.iconBorder(cell.color, active)}`,
            boxShadow:  T.iconShadow(cell.color, active),
            transition: 'box-shadow 0.22s, border-color 0.22s, background 0.22s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon c={cell.color} s={isWide ? 38 : 44}/>
          </div>

          <div>
            <div style={{
              fontSize:   isWide ? '13px' : '12px',
              fontWeight: '800',
              color:      T.labelText(cell.color),
              lineHeight: '1.3',
              textShadow: T.labelShadow(cell.color, active),
              transition: 'text-shadow 0.22s',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '-0.01em',
            }}>
              {label}
            </div>
            <div style={{
              fontSize: '9px', marginTop: '3px',
              color:    T.zoneText(cell.color),
              fontFamily: 'system-ui, sans-serif',
            }}>
              {cell.zone === 'above'
                ? (isTh ? '🌿 ฝั่งลูกค้า' : '🌿 customer-facing')
                : (isTh ? '🌱 ฐานราก'     : '🌱 foundational')}
            </div>
          </div>
        </div>

        {/* Divider for wide cells */}
        {isWide && (
          <div style={{
            width: '1.5px', alignSelf: 'stretch', flexShrink: 0,
            background: `linear-gradient(to bottom, transparent, ${cell.color}35, transparent)`,
          }}/>
        )}

        {/* Bullets */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {bullets.slice(0, maxBullets).map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', marginBottom: '5px' }}>
              <div style={{
                width: '5px', height: '5px', borderRadius: '50%',
                flexShrink: 0, marginTop: '5px',
                background: T.detailDot(cell.color),
                boxShadow: active ? `0 0 5px ${cell.color}` : 'none',
                transition: 'box-shadow 0.22s',
              }}/>
              <span style={{
                fontSize:   '10px',
                color:      T.bulletText,
                lineHeight: '1.5',
                fontFamily: 'system-ui, sans-serif',
              }}>
                {d}
              </span>
            </div>
          ))}
        </div>

        {/* Hover hint */}
        {hov && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute', bottom: '8px', right: '12px',
              fontSize: '9px', color: T.hintText(cell.color),
              fontFamily: 'system-ui, sans-serif', pointerEvents: 'none',
            }}
          >
            {isTh ? 'คลิกเพื่อดูรายละเอียด →' : 'click to explore →'}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
export default function BMCTree() {
  const { i18n }   = useTranslation();
  const { isDark } = useTheme();
  const isTh = i18n?.language?.startsWith('th');
  const T    = isDark ? DARK : LIGHT;

  const [selected, setSelected] = useState(null);
  const boardRef = useRef(null);

  /* Mouse tilt — board stays flat (rotateX 0) so hit-test areas always match
     visuals. Only subtle rotateY follows cursor for the 3-D feel.         */
  const handleMouseMove = useCallback(e => {
    if (!boardRef.current) return;
    const r  = boardRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    boardRef.current.style.transform =
      `perspective(2400px) rotateX(0deg) rotateY(${px * 1.2}deg) scale(1)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (boardRef.current)
      boardRef.current.style.transform =
        'perspective(2400px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  const selectedDetails = isTh && selected?.detailsTh?.length
    ? selected.detailsTh : selected?.details ?? [];
  const SelectedIcon = selected ? ICON_MAP[selected.icon] : null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        background:  T.canvasBg,
        border:      isDark ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(34,197,94,0.25)',
        minHeight:   'auto',
        transition:  'background 0.35s ease, border-color 0.35s ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:
          `linear-gradient(${T.gridLine} 1px, transparent 1px),` +
          `linear-gradient(90deg, ${T.gridLine} 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        transition: 'background-image 0.35s',
      }}/>

      {/* Ambient particles */}
      {PARTICLES.map((p, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none" style={{
          left: p.left, top: p.top, width: p.size, height: p.size,
          background: p.color, opacity: 0,
          animation: `bmcPulse ${p.dur}s ${p.delay}s infinite ease-in-out`,
        }}/>
      ))}

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '8px', padding: '18px 0 8px',
      }}>
        <span style={{
          fontSize: '10.5px', fontWeight: '700', letterSpacing: '0.16em',
          textTransform: 'uppercase', color: T.headerText,
          fontFamily: 'system-ui, sans-serif',
          transition: 'color 0.35s',
        }}>
          🌱 Biochar Value System — Business Model Canvas
        </span>
      </div>

      {/* 3-D wrapper — flat by default; rotateY-only tilt follows mouse */}
      <div style={{ padding: '0 16px 20px' }}>
        <div
          ref={boardRef}
          style={{
            transform:      'perspective(2400px) rotateX(0deg) rotateY(0deg) scale(1)',
            transformStyle: 'flat',
            transition:     'transform 0.14s ease-out',
            willChange:     'transform',
          }}
        >
          {/* CSS Grid */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gridTemplateRows:    '205px 188px 132px',
            gap:                 '8px',
          }}>
            {BMC_DATA.map(cell => (
              <BMCCard
                key={cell.id}
                cell={cell}
                isTh={isTh}
                isSelected={selected?.id === cell.id}
                onClick={() => setSelected(s => s?.id === cell.id ? null : cell)}
                T={T}
              />
            ))}
          </div>

          {/* Floor glow */}
          <div style={{
            height: '18px', marginTop: '3px',
            background: T.floorGlow,
            pointerEvents: 'none',
            transition: 'background 0.35s',
          }}/>
        </div>
      </div>

      {/* ── Detail side panel ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            style={{
              position:      'absolute',
              right: 0, top: 0,
              height: '100%', width: '288px',
              background:    T.panelBg(selected.color),
              backdropFilter:'blur(24px)',
              borderLeft:    `1.5px solid ${T.panelBorder(selected.color)}`,
              boxShadow:     T.panelShadow(selected.color),
              display:       'flex',
              flexDirection: 'column',
              overflow:      'hidden',
              zIndex:        40,
              transition:    'background 0.35s, border-color 0.35s',
            }}
          >
            {/* Panel header */}
            <div style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '11px',
              padding:      '18px 16px',
              borderBottom: `1.5px solid ${T.panelBorder(selected.color)}`,
              flexShrink:   0,
            }}>
              {SelectedIcon && (
                <div style={{
                  width: '46px', height: '46px', borderRadius: '12px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: T.iconBg(selected.color, true),
                  border:     `1.5px solid ${T.iconBorder(selected.color, true)}`,
                  boxShadow:  T.iconShadow(selected.color, true),
                }}>
                  <SelectedIcon c={selected.color} s={36}/>
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '13.5px', fontWeight: '800',
                  color:    T.panelTitle(selected.color),
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontFamily: 'system-ui, sans-serif',
                  letterSpacing: '-0.01em',
                }}>
                  {isTh ? selected.labelTh : selected.label}
                </div>
                <div style={{
                  fontSize: '10px', marginTop: '3px',
                  color:    T.panelZone,
                  fontFamily: 'system-ui, sans-serif',
                  transition: 'color 0.35s',
                }}>
                  {selected.zone === 'above'
                    ? (isTh ? '🌿 ฝั่งลูกค้า' : '🌿 Customer-facing')
                    : (isTh ? '🌱 ชั้นฐานราก' : '🌱 Foundational layer')}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: T.panelClose(selected.color),
                  border: 'none', cursor: 'pointer',
                  color: selected.color,
                }}
              >
                <X size={14}/>
              </button>
            </div>

            {/* Detail items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
              {selectedDetails.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.055 }}
                  style={{
                    display:      'flex',
                    alignItems:   'flex-start',
                    gap:          '9px',
                    padding:      '9px 11px',
                    borderRadius: '9px',
                    marginBottom: '7px',
                    background:   T.detailBg(selected.color),
                    border:       `1px solid ${T.detailBorder(selected.color)}`,
                    transition:   'background 0.35s, border-color 0.35s',
                  }}
                >
                  <div style={{
                    width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                    marginTop: '4px', background: T.detailDot(selected.color),
                    boxShadow: `0 0 6px ${selected.color}`,
                  }}/>
                  <span style={{
                    fontSize: '11.5px', lineHeight: '1.55',
                    color:    T.detailText,
                    fontFamily: 'system-ui, sans-serif',
                    transition: 'color 0.35s',
                  }}>
                    {d}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding:   '10px 16px',
              borderTop: `1px solid ${T.detailBorder(selected.color)}`,
              flexShrink: 0, textAlign: 'center',
              transition: 'border-color 0.35s',
            }}>
              <span style={{
                fontSize: '9.5px', color: T.footerText,
                fontFamily: 'system-ui, sans-serif', transition: 'color 0.35s',
              }}>
                {isTh ? 'คลิกบัตรอีกครั้งเพื่อปิด' : 'click card again to close'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particle keyframes */}
      <style>{`
        @keyframes bmcPulse {
          0%,100% { opacity: 0; transform: scale(1); }
          50%      { opacity: ${T.particleOp}; transform: scale(1.8); }
        }
      `}</style>
    </div>
  );
}
