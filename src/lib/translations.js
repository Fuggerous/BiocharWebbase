// Central translation strings — add new keys here, consume with t(key) from useLang()
// To add more Thai text, edit the 'th' block below.

export const translations = {

  en: {
    // ── Navbar ──────────────────────────────────────────────────────────────
    'nav.home':              'Home',
    'nav.database':          'Database',
    'nav.propertyEstimator': 'Property Estimator',
    'nav.co2Estimator':      'CO₂ Estimator',
    'nav.advisor':           'Materials Advisor',
    'nav.about':             'About',
    'nav.shareData':         'Share Data',
    'nav.ctaButton':         'Property Estimator',

    // ── IntroSection ─────────────────────────────────────────────────────────
    'intro.badge':             '🌱 About This Platform',
    'intro.heading':           'Your Open-Access Hub for',
    'intro.headingHighlight':  'Biochar Research',
    'intro.desc':              'Biochar Assistant Thailand is a data-driven platform that brings together peer-reviewed experimental data, ML-powered prediction tools, and curated knowledge resources — all focused on biochar\'s role in carbon sequestration and sustainable agriculture across Thailand.',
    'intro.db.title':          'Scientific Database',
    'intro.db.desc':           'Browse 1,263 peer-reviewed biochar records with interactive filters, charts, and correlation analysis.',
    'intro.db.cta':            'Open Database',
    'intro.pred.title':        'CO₂ Predictor',
    'intro.pred.desc':         'Input your pyrolysis conditions and get data-backed CO₂ adsorption estimates from matched experimental records.',
    'intro.pred.cta':          'Try Predictor',
    'intro.know.title':        'Knowledge Center',
    'intro.know.desc':         'Learn about biochar science, Thailand context, the production process, and download research documents.',
    'intro.know.cta':          'Explore Knowledge',

    // ── Knowledge Center ─────────────────────────────────────────────────────
    'kc.badge':               '📚 แหล่งความรู้',
    'kc.heading':             'Knowledge',
    'kc.headingHighlight':    'Center',
    'kc.desc':                'Everything you need to understand biochar — from the science to Thailand\'s context and the production process.',
    'kc.tab.what':            'What is Biochar',
    'kc.tab.thailand':        'Biochar in Thailand',
    'kc.tab.process':         'Process Flow',
    'kc.tab.docs':            'Documents',
    'kc.fact1.title':         'What is Biochar?',
    'kc.fact1.body':          'Biochar is a carbon-rich solid produced by heating biomass (agricultural waste, wood, etc.) under limited oxygen — a process called pyrolysis. Unlike regular charcoal, biochar is intentionally applied to soil or used as an adsorbent.',
    'kc.fact2.title':         'Why CO₂ Adsorption?',
    'kc.fact2.body':          'Activated biochar develops a highly porous structure with surface areas up to 3,157 m²/g — comparable to half a football field per gram. This makes it exceptionally effective at capturing CO₂ molecules from flue gases and the atmosphere.',
    'kc.fact3.title':         'Soil & Agriculture',
    'kc.fact3.body':          'When incorporated into soil, biochar improves water retention, reduces nutrient leaching, increases microbial activity, and can reduce N₂O emissions by up to 54%. Thai biochar research shows strong benefits for rice cultivation on salt-affected soils.',
    'kc.fact4.title':         'Carbon Sequestration',
    'kc.fact4.body':          'Biochar is highly recalcitrant — its carbon resists decomposition for hundreds to thousands of years. Applying 1 tonne of biochar to soil can sequester approximately 2.5–3 tonnes of CO₂-equivalent, making it a viable negative-emission technology.',
    'kc.docs.search':         'Search documents...',
    'kc.docs.empty':          'No documents found matching your search.',
    'kc.docs.open':           'Open File',
    'kc.docs.source':         'Documents from Biochar Consortium Thailand · MTEC-NZE Biochar Programme',

    // ── Documents Section ───────────────────────────────────────────────────
    'docs.badge':             '📄 Research Documents',
    'docs.heading':           'Documents',
    'docs.headingHighlight':  'Library',
    'docs.desc':              'Browse curated documents, standards, and field materials from the Thai biochar community.',

    // ── Biochar Society ───────────────────────────────────────────────────────
    'soc.badge':              '🇹🇭 Biochar Network',
    'soc.heading':            'Biochar Society',
    'soc.headingHighlight':   'in Thailand',
    'soc.desc':               'Key organisations driving biochar research, policy, and adoption across Thailand. Click any card to visit their official website.',

    // ── CTA Banner ────────────────────────────────────────────────────────────
    'cta.heading':            'Start Predicting',
    'cta.headingHighlight':   'CO₂ Adsorption Now',
    'cta.desc':               'peer-reviewed experimental records. Statistical lookup + trained ML pipeline. Free, open, and runs entirely in your browser.',
    'cta.launch':             'Launch CO₂ Estimator',
    'cta.browse':             'Browse Database',
  },

  th: {
    // ── Navbar ──────────────────────────────────────────────────────────────
    'nav.home':              'หน้าหลัก',
    'nav.database':          'ฐานข้อมูล',
    'nav.propertyEstimator': 'ประเมินคุณสมบัติ',
    'nav.co2Estimator':      'ประเมิน CO₂',
    'nav.advisor':           'ที่ปรึกษาวัสดุ',
    'nav.about':             'เกี่ยวกับ',
    'nav.shareData':         'แชร์ข้อมูล',
    'nav.ctaButton':         'ประเมินคุณสมบัติ',

    // ── IntroSection ─────────────────────────────────────────────────────────
    'intro.badge':             '🌱 เกี่ยวกับแพลตฟอร์ม',
    'intro.heading':           'ศูนย์กลางข้อมูลแบบเปิดสำหรับ',
    'intro.headingHighlight':  'งานวิจัยไบโอชาร์',
    'intro.desc':              'Biochar Assistant Thailand คือแพลตฟอร์มที่ขับเคลื่อนด้วยข้อมูล รวบรวมข้อมูลจากงานวิจัยที่ผ่านการตรวจสอบ เครื่องมือพยากรณ์ด้วย ML และแหล่งความรู้ที่คัดสรร — มุ่งเน้นบทบาทของไบโอชาร์ต่อการกักเก็บคาร์บอนและเกษตรกรรมยั่งยืนในประเทศไทย',
    'intro.db.title':          'ฐานข้อมูลวิทยาศาสตร์',
    'intro.db.desc':           'เรียกดูข้อมูลไบโอชาร์กว่า 1,263 รายการจากงานวิจัยที่ผ่านการตรวจสอบ พร้อมฟิลเตอร์ กราฟ และการวิเคราะห์ความสัมพันธ์',
    'intro.db.cta':            'เปิดฐานข้อมูล',
    'intro.pred.title':        'ตัวพยากรณ์ CO₂',
    'intro.pred.desc':         'ป้อนเงื่อนไขการไพโรไลซิส รับค่าประมาณการดูดซับ CO₂ พร้อมช่วงความเชื่อมั่นจากข้อมูลงานวิจัยจริง',
    'intro.pred.cta':          'ทดลองพยากรณ์',
    'intro.know.title':        'ศูนย์ความรู้',
    'intro.know.desc':         'เรียนรู้วิทยาศาสตร์ไบโอชาร์ บริบทในประเทศไทย กระบวนการผลิต และดาวน์โหลดเอกสารงานวิจัย',
    'intro.know.cta':          'สำรวจความรู้',

    // ── Knowledge Center ─────────────────────────────────────────────────────
    'kc.badge':               '📚 แหล่งความรู้',
    'kc.heading':             'ศูนย์',
    'kc.headingHighlight':    'ความรู้',
    'kc.desc':                'ทุกสิ่งที่คุณต้องการเพื่อทำความเข้าใจไบโอชาร์ — ตั้งแต่หลักวิทยาศาสตร์ บริบทในไทย และกระบวนการผลิต',
    'kc.tab.what':            'ไบโอชาร์คืออะไร',
    'kc.tab.thailand':        'ไบโอชาร์ในไทย',
    'kc.tab.process':         'กระบวนการผลิต',
    'kc.tab.docs':            'เอกสาร',
    'kc.fact1.title':         'ไบโอชาร์คืออะไร?',
    'kc.fact1.body':          'ไบโอชาร์คือของแข็งที่มีคาร์บอนสูง ผลิตจากการให้ความร้อนกับมวลชีวภาพ (เศษวัสดุเกษตร ไม้ ฯลฯ) ในสภาวะออกซิเจนต่ำ เรียกว่ากระบวนการไพโรไลซิส ต่างจากถ่านทั่วไปตรงที่ไบโอชาร์ถูกนำไปใช้ปรับปรุงดินหรือเป็นตัวดูดซับโดยเจตนา',
    'kc.fact2.title':         'ทำไมถึงดูดซับ CO₂?',
    'kc.fact2.body':          'ไบโอชาร์ที่ผ่านการกระตุ้นจะมีโครงสร้างรูพรุนสูง มีพื้นที่ผิวสูงถึง 3,157 m²/g — เปรียบได้กับครึ่งสนามฟุตบอลต่อกรัม ทำให้สามารถดักจับโมเลกุล CO₂ จากก๊าซไอเสียและชั้นบรรยากาศได้อย่างมีประสิทธิภาพ',
    'kc.fact3.title':         'ดินและเกษตรกรรม',
    'kc.fact3.body':          'เมื่อเติมลงในดิน ไบโอชาร์ช่วยเพิ่มการกักเก็บน้ำ ลดการชะล้างสารอาหาร เพิ่มกิจกรรมของจุลินทรีย์ และลดการปล่อย N₂O ได้สูงถึง 54% งานวิจัยในไทยพบประโยชน์ชัดเจนต่อการปลูกข้าวในพื้นที่ดินเค็ม',
    'kc.fact4.title':         'การกักเก็บคาร์บอน',
    'kc.fact4.body':          'ไบโอชาร์มีความทนทานสูง — คาร์บอนในโครงสร้างทนต่อการสลายตัวได้หลายร้อยถึงหลายพันปี การใส่ไบโอชาร์ 1 ตันลงดินสามารถกักเก็บ CO₂ ได้ราว 2.5–3 ตัน CO₂-equivalent ทำให้เป็นเทคโนโลยีดักจับคาร์บอนเชิงลบที่มีศักยภาพ',
    'kc.docs.search':         'ค้นหาเอกสาร...',
    'kc.docs.empty':          'ไม่พบเอกสารที่ตรงกับการค้นหา',
    'kc.docs.open':           'เปิดไฟล์',
    'kc.docs.source':         'เอกสารจาก Biochar Consortium Thailand · โครงการ MTEC-NZE Biochar',

    // ── Documents Section ───────────────────────────────────────────────────
    'docs.badge':             '📄 เอกสารวิจัย',
    'docs.heading':           'คลัง',
    'docs.headingHighlight':  'เอกสาร',
    'docs.desc':              'รวมเอกสาร มาตรฐาน และสื่อภาคสนามที่คัดสรรจากชุมชนไบโอชาร์ในประเทศไทย',

    // ── Biochar Society ───────────────────────────────────────────────────────
    'soc.badge':              '🇹🇭 เครือข่ายไบโอชาร์',
    'soc.heading':            'สมาคมไบโอชาร์',
    'soc.headingHighlight':   'ในประเทศไทย',
    'soc.desc':               'องค์กรหลักที่ขับเคลื่อนการวิจัย นโยบาย และการใช้ไบโอชาร์ทั่วประเทศไทย คลิกการ์ดใดก็ได้เพื่อเยี่ยมชมเว็บไซต์ทางการ',

    // ── CTA Banner ────────────────────────────────────────────────────────────
    'cta.heading':            'เริ่มพยากรณ์',
    'cta.headingHighlight':   'การดูดซับ CO₂ ได้เลย',
    'cta.desc':               'ข้อมูลจากงานวิจัยที่ผ่านการตรวจสอบ รองรับการค้นหาทางสถิติและ ML pipeline ใช้งานได้ฟรี เปิดเผย และทำงานทั้งหมดในเบราว์เซอร์ของคุณ',
    'cta.launch':             'เปิดตัวพยากรณ์ CO₂',
    'cta.browse':             'เรียกดูฐานข้อมูล',
  },
};
