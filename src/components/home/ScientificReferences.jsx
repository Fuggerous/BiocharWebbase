import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const REFS = [
  {
    id: 1,
    authors: 'Lehmann, J., Gaunt, J., & Rondon, M.',
    year: '2006',
    title: 'Bio-char sequestration in terrestrial ecosystems – a review.',
    journal: 'Mitigation and Adaptation Strategies for Global Change',
    detail: '11, 403–427.',
    doi: 'https://doi.org/10.1007/s11027-005-9006-5',
  },
  {
    id: 2,
    authors: 'Woolf, D., Amonette, J. E., Street-Perrott, F. A., Lehmann, J., & Joseph, S.',
    year: '2010',
    title: 'Sustainable biochar to mitigate global climate change.',
    journal: 'Nature Communications',
    detail: '1, 56.',
    doi: 'https://doi.org/10.1038/ncomms1053',
  },
  {
    id: 3,
    authors: 'IPCC',
    year: '2022',
    title: 'Mitigation of Climate Change. Contribution of Working Group III to the Sixth Assessment Report (AR6).',
    journal: 'Intergovernmental Panel on Climate Change',
    detail: 'Cambridge University Press.',
    doi: 'https://www.ipcc.ch/report/ar6/wg3/',
  },
  {
    id: 4,
    authors: 'European Biochar Certificate (EBC)',
    year: '2023',
    title: 'Guidelines for a Sustainable Production of Biochar.',
    journal: 'EBC',
    detail: 'Version 10.1. Arbaz, Switzerland.',
    doi: 'https://www.european-biochar.org/en/ebc-guidelines',
  },
  {
    id: 5,
    authors: 'Huggins, T. M., Haeger, A., Biffinger, J. C., & Ren, Z. J.',
    year: '2016',
    title: 'Granular biochar compared with activated carbon for wastewater treatment and resource recovery.',
    journal: 'Water Research',
    detail: '94, 225–232.',
    doi: 'https://doi.org/10.1016/j.watres.2016.02.059',
  },
  {
    id: 6,
    authors: 'Shen, W., Zhang, S., He, Y., Fang, J., & Tang, Y.',
    year: '2011',
    title: 'Hierarchical pore structure of activated carbon derived from corn stalks.',
    journal: 'Journal of Materials Science',
    detail: '46, 464–469.',
    doi: 'https://doi.org/10.1016/j.electacta.2016.07.069',
  },
  {
    id: 7,
    authors: 'Alabadi, A., Razzaque, S., Yang, Y., Chen, S., & Tan, B.',
    year: '2015',
    title: 'Highly porous activated carbon materials from carbonized biomass with high CO₂ capturing capacity.',
    journal: 'Chemical Engineering Journal',
    detail: '281, 606–612.',
    doi: 'https://doi.org/10.1016/j.cej.2015.06.032',
  },
  {
    id: 8,
    authors: 'Office of Agricultural Economics, Thailand (OAE)',
    year: '2023',
    title: 'Agricultural Statistics of Thailand 2023.',
    journal: 'Ministry of Agriculture and Cooperatives',
    detail: 'Bangkok, Thailand.',
    doi: 'https://www.oae.go.th',
  },
  {
    id: 9,
    authors: 'Min-jeong, K., Seung, C., Hyunwook, K., et al.',
    year: '2020',
    title: 'Simple synthesis of spent coffee ground-based microporous carbons using K2CO3 as an activation agent and their application to CO2 capture.',
    journal: 'Chemical Engineering Journal',
    detail: '397 (2020) 125404.',
    doi: 'https://doi.org/10.1016/j.cej.2020.125404',
  },
  {
    id: 10,
    authors: 'Tan, X.-f., Liu, S.-b., Liu, Y.-g., Gu, Y.-l., et al.',
    year: '2017',
    title: 'Biochar as potential sustainable precursors for activated carbon production: Multiple applications in environmental protection and energy storage.',
    journal: 'Bioresource Technology',
    detail: '227, 359–372.',
    doi: 'https://doi.org/10.1016/j.biortech.2016.12.083',
  },
  {
    id: 11,
    authors: 'Spokas, K. A.',
    year: '2010',
    title: 'Review of the stability of biochar in soils: predictability of O:C molar ratios.',
    journal: 'Carbon Management',
    detail: '1(2), 289–303.',
    doi: 'https://doi.org/10.4155/cmt.10.32',
  },
  {
    id: 12,
    authors: 'Database (BiocharInformaticsThailand)',
    year: '2025',
    title: 'Experimental CO₂ Adsorption Isotherm Records — Database.xlsx.',
    journal: 'BiocharInformaticsThailand Internal Dataset',
    detail: '1,395 records across 8 biomass species, 6 activators, 92 unique isotherm experiments.',
    doi: null,
  },
  {
    id: 13,
    authors: 'IUPAC (International Union of Pure and Applied Chemistry)',
    year: '1997',
    title: 'Compendium of Chemical Terminology (Gold Book).',
    journal: 'IUPAC',
    detail: 'Terminology and nomenclature standards for chemistry.',
    doi: 'https://goldbook.iupac.org/',
  },
  {
    id: 14,
    authors: 'ASTM International',
    year: '2016',
    title: 'ASTM D7544 — Standard Specification for Biochar.',
    journal: 'ASTM International',
    detail: 'Standard specification and definitions for biochar materials.',
    doi: 'https://www.astm.org/standards/d7544.htm',
  },
  {
    id: 15,
    authors: 'Lehmann, J., & Joseph, S. (eds.)',
    year: '2015',
    title: 'Biochar for Environmental Management: Science, Technology and Implementation.',
    journal: 'Routledge / Earthscan',
    detail: 'Comprehensive reference on biochar science and applications.',
    doi: null,
  },
  {
    id: 16,
    authors: 'National Science and Technology Development Agency (NSTDA) / MTEC',
    year: '2022',
    title: 'Biochar from Agricultural Residues for Carbon Capture and Soil Amendment in Thailand — Research Program Overview.',
    journal: 'National Metal and Materials Technology Center (MTEC), Thailand',
    detail: 'Program covering rice husk, sugarcane bagasse, and corn straw activation for CO₂ capture applications in industrial and agricultural sectors.',
    doi: 'https://www.mtec.or.th',
  },
  {
    id: 17,
    authors: 'Pollution Control Department, Thailand (PCD)',
    year: '2023',
    title: "Thailand's PM2.5 National Action Plan: Reducing Open Agricultural Burning.",
    journal: 'Ministry of Natural Resources and Environment, Thailand',
    detail: 'Policy framework mandating reduction of open burning of rice straw, corn stover, and sugarcane leaves; promotes biomass valorisation including pyrolysis to biochar as a compliant alternative.',
    doi: 'https://www.pcd.go.th',
  },
  {
    id: 18,
    authors: 'Food and Agriculture Organization of the United Nations (FAO)',
    year: '2023',
    title: 'FAOSTAT — Crops and Livestock Products: Cassava Production Data for Thailand.',
    journal: 'FAO Statistics Division',
    detail: 'Thailand ranks as the world\'s #1 cassava exporter, producing ~30 Mt/yr; rhizome residues represent a significant underutilised biochar feedstock in the Northeast (Isaan) region.',
    doi: 'https://www.fao.org/faostat/',
  },
  {
    id: 19,
    authors: 'Biochar Consortium Thailand',
    year: '2024',
    title: 'Proceedings of the 4th Thailand Biochar Seminar: Agricultural Waste-Derived Activated Carbon for Climate Mitigation.',
    journal: 'Kasetsart University, Bangkok',
    detail: 'Compilation of research on biochar production from Thai agricultural residues; covers activation conditions, characterisation benchmarks (BET, pore volume), and field trials for soil carbon sequestration.',
    doi: null,
  },
  {
    id: 20,
    authors: 'DENG, L., XIA, W., et al.',
    year: '2025',
    title: 'Research on biochar prepared by trace KOH catalyzed CO2 activation vs KOH activation as advanced candidate for carbon capture',
    journal: 'Journal of Fuel Chemistry and Technology',
    detail: '1330-1341',
    doi: 'https://doi.org/10.1016/S1872-5813(25)60568-8',
  },
  {
    id: 21,
    authors: 'Dong, Q., et al.',
    year: '2025',
    title: 'CO2 capture and microwave absorption by pine sawdust biochars obtained via molten salt pyrolysis',
    journal: 'Biomass and Bioenergy',
    detail: '201 (2025) 108053',
    doi: 'https://doi.org/10.1016/j.biombioe.2025.108053',
  },
  {
    id: 22,
    authors: 'Zhang, P., et al.',
    year: '2025',
    title: 'Straw-derived porous biochars by ball milling for CO2 capture: Adsorption performance and enhanced mechanisms',
    journal: 'Industrial Crops and Products',
    detail: '229 (2025) 121000',
    doi: 'https://doi.org/10.1016/j.indcrop.2025.121000',
  },
  {
    id: 23,
    authors: 'He, G., Yuan, X., et al.',
    year: '2025',
    title: 'N, S-codoped porous biochar derived from bagasse-based polycondensate for high-performance CO2 capture and supercapacitor',
    journal: 'Separation and Purification Technology',
    detail: '354 (2025) 128826',
    doi: 'https://doi.org/10.1016/j.seppur.2024.128826',
  },
  {
    id: 24,
    authors: 'Xu, Q., et al.',
    year: '2025',
    title: 'Comparative study of PEI- and TEPA-functionalized biochar for enhanced CO2 adsorption: Multi-factorial effects, amine structure and pore characteristics optimization',
    journal: 'Journal of Environmental Chemical Engineering',
    detail: '13 (2025) 118756',
    doi: 'https://doi.org/10.1016/j.jece.2025.118756',
  },
  {
    id: 25,
    authors: 'Ashfaq Ahmed, Muhammad S. Abu Bakar, Rahayu S. Sukri, Murid Hussain, Abid Farooq, Surendar Moogi, Young-Kwon Park',
    year: '2020',
    title: 'Sawdust pyrolysis from the furniture industry in an auger pyrolysis reactor system for biochar and bio-oil production',
    journal: 'Energy Conversion and Management',
    detail: '226 (2020) 113502',
    doi: 'https://doi.org/10.1016/j.enconman.2020.113502',
  },
  {
    id: 26,
    authors: 'Neelanjan Bhattacharjee, Asit Baran Biswas',
    year: '2019',
    title: 'Pyrolysis of orange bagasse: Comparative study and parametric influence on the product yield and their characterization',
    journal: 'Journal of Environmental Chemical Engineering',
    detail: '7 (2019) 102903',
    doi: 'https://doi.org/10.1016/j.jece.2019.102903',
  },
  {
    id: 27,
    authors: 'Sajib Aninda Dhar, Tamjid Us Sakib, Lutfun Naher Hilary',
    year: '2022',
    title: 'Effects of pyrolysis temperature on production and physicochemical characterization of biochar derived from coconut fiber biomass through slow pyrolysis process',
    journal: 'Biomass Conversion and Biorefinery',
    detail: '12 (2022) 2055–2067',
    doi: 'https://doi.org/10.1007/s13399-020-01116-y',
  },
  {
    id: 28,
    authors: 'Frederik Ronsse, Sven Van Hecke, Dane Dickinson, Wolter Prins',
    year: '2013',
    title: 'Production and characterization of slow pyrolysis biochar: influence of feedstock type and pyrolysis conditions',
    journal: 'GCB Bioenergy',
    detail: '5 (2013) 104–115',
    doi: 'https://doi.org/10.1111/gcbb.12018',
  },
  {
    id: 29,
    authors: 'Assia Maaoui, Aida Ben Hassen Trabelsi, Asma Ben Abdallah, Raouia Chagtmi, Gartzen Lopez, Maria Cortazar, Martin Olazar',
    year: '2023',
    title: 'Assessment of pine wood biomass wastes valorization by pyrolysis with focus on fast pyrolysis biochar production',
    journal: 'Journal of the Energy Institute',
    detail: '108 (2023) 101242',
    doi: 'https://doi.org/10.1016/j.joei.2023.101242',
  },
  {
    id: 30,
    authors: 'Ajchareeya Manmeen, Prawit Kongjan, Arkom Palamanit, Rattana Jariyaboon',
    year: '2023',
    title: 'The biochar, and pyrolysis liquid characteristics, of three indigenous durian peel; Monthong, Puangmanee, and Bacho',
    journal: 'Biomass and Bioenergy',
    detail: '174 (2023) 106816',
    doi: 'https://doi.org/10.1016/j.biombioe.2023.106816',
  },
  {
    id: 31,
    authors: 'Swapan Suman, Shalini Gautam',
    year: '2017',
    title: 'Pyrolysis of coconut husk biomass: Analysis of its biochar properties',
    journal: 'Energy Sources, Part A: Recovery, Utilization, and Environmental Effects',
    detail: '39 (2017) 761-767',
    doi: 'https://doi.org/10.1080/15567036.2016.1263252',
  },
  {
    id: 32,
    authors: 'Zewei Liu, Fengxia Zhang, Huili Liu, Fei Ba, Sijia Yan, Jianhang Hu',
    year: '2018',
    title: 'Pyrolysis/gasification of pine sawdust biomass briquettes under carbon dioxide atmosphere: Study on carbon dioxide reduction (utilization) and biochar briquettes physicochemical properties',
    journal: 'Bioresource Technology',
    detail: '249 (2018) 983-991',
    doi: 'https://doi.org/10.1016/j.biortech.2017.11.012',
  },
  {
    id: 33,
    authors: 'Dengyu Chen, Dong Liu, Hongru Zhang, Yong Chen, Qian Li',
    year: '2015',
    title: 'Bamboo pyrolysis using TG–FTIR and a lab-scale reactor: Analysis of pyrolysis behavior, product properties, and carbon and energy yields',
    journal: 'Fuel',
    detail: '148 (2015) 79-86',
    doi: 'http://dx.doi.org/10.1016/j.fuel.2015.01.092',
  },
  {
    id: 34,
    authors: 'Jingxin Liu, Simian Huang, Kai Chen, Teng Wang, Meng Mei, Jinping Li',
    year: '2020',
    title: 'Preparation of biochar from food waste digestate: Pyrolysis behavior and product properties',
    journal: 'Bioresource Technology',
    detail: '302 (2020) 122841',
    doi: 'https://doi.org/10.1016/j.biortech.2020.122841',
  },
  {
    id: 35,
    authors: 'Kwang Ho Kim, Jae-Young Kim, Tae-Su Cho, Joon Weon Choi',
    year: '2012',
    title: 'Influence of pyrolysis temperature on physicochemical properties of biochar obtained from the fast pyrolysis of pitch pine (Pinus rigida)',
    journal: 'Bioresource Technology',
    detail: '118 (2012) 158-162',
    doi: 'http://dx.doi.org/10.1016/j.biortech.2012.04.094',
  },
  {
    id: 36,
    authors: 'Yongwoon Lee, Jinje Park, Changkook Ryu, Ki Seop Gang, Won Yang, Young-Kwon Park, Jinho Jung, Seunghun Hyun',
    year: '2013',
    title: 'Comparison of biochar properties from biomass residues produced by slow pyrolysis at 500°C',
    journal: 'Bioresource Technology',
    detail: '148 (2013) 196-201',
    doi: 'http://dx.doi.org/10.1016/j.biortech.2013.08.135',
  },
  {
    id: 37,
    authors: 'Tanmya Rout, Debalaxmi Pradhan, R.K. Singh, Namrata Kumari',
    year: '2016',
    title: 'Exhaustive study of products obtained from coconut shell pyrolysis',
    journal: 'Journal of Environmental Chemical Engineering',
    detail: '4 (2016) 3696-3705',
    doi: 'http://dx.doi.org/10.1016/j.jece.2016.02.024',
  },
  {
    id: 38, 
    authors: 'Waled Suliman, James B. Harsh, Nehal I. Abu-Lail, Ann-Marie Fortuna, Ian Dallmeyer, Manuel Garcia-Perez',
    year: '2016',
    title: 'Influence of feedstock source and pyrolysis temperature on biochar bulk and surface properties',
    journal: 'Biomass and Bioenergy',
    detail: '84 (2016) 37-48',
    doi: 'http://dx.doi.org/10.1016/j.biombioe.2015.11.010',
  },
  {
    id: 39,
    authors: 'Yining Sun, Bin Gao, Ying Yao, June Fang, Ming Zhang, Yanmei Zhou, Hao Chen, Liuyan Yang',
    year: '2014',
    title: 'Effects of feedstock type, production method, and pyrolysis temperature on biochar and hydrochar properties',
    journal: 'Chemical Engineering Journal',
    detail: '240 (2014) 574-578',
    doi: 'http://dx.doi.org/10.1016/j.cej.2013.10.081',
  },
  {
    id: 40,
    authors: 'Yimeng Zhang, Zhongqing Ma, Qisheng Zhang, Jiayao Wang, Qianqiang Ma, Youyou Yang, Xiping Luo, Weigang Zhang',
    year: '2017',
    title: 'Comparison of the Physicochemical Characteristics of Bio-char Pyrolyzed from Moso Bamboo and Rice Husk with Different Pyrolysis Temperatures',
    journal: 'Bioresource',
    detail: '12 (2017) 4652-4669',
    doi: 'https://doi.org/10.15376/biores.12.3.4652-4669',
  },
  // ── Applications tab refs [41–46] ──────────────────────────────────────────
  {
    id: 41,
    authors: 'Inyang, M.I., Gao, B., Yao, Y., Xue, Y., Zimmerman, A., Mosa, A., Pullammanappallil, P., Ok, Y.S., Cao, X.',
    year: '2016',
    title: 'A review of biochar as a low-cost adsorbent for aqueous heavy metal removal',
    journal: 'Critical Reviews in Environmental Science and Technology',
    detail: '46(4), 406–433',
    doi: 'https://doi.org/10.1080/10643389.2015.1096880',
  },
  {
    id: 42,
    authors: 'Ahmed, M.B., Zhou, J.L., Ngo, H.H., Guo, W., Chen, M.',
    year: '2016',
    title: 'Progress in the preparation and application of modified biochar for improved contaminant removal from water and wastewater',
    journal: 'Bioresource Technology',
    detail: '214, 836–851',
    doi: 'https://doi.org/10.1016/j.biortech.2016.05.057',
  },
  {
    id: 43,
    authors: 'Creamer, A.E., Gao, B.',
    year: '2016',
    title: 'Carbon-based adsorbents for postcombustion CO₂ capture: a critical review',
    journal: 'Environmental Science & Technology',
    detail: '50(14), 7276–7289',
    doi: 'https://doi.org/10.1021/acs.est.6b00627',
  },
  {
    id: 44,
    authors: 'Shen, Y.',
    year: '2015',
    title: 'Chars as carbonaceous adsorbents/catalysts for tar elimination during biomass pyrolysis or gasification',
    journal: 'Renewable and Sustainable Energy Reviews',
    detail: '43, 281–295',
    doi: 'https://doi.org/10.1016/j.rser.2014.11.061',
  },
  {
    id: 45,
    authors: 'Wang, B., Gao, B., Fang, J.',
    year: '2017',
    title: 'Recent advances in engineered biochar productions and applications',
    journal: 'Critical Reviews in Environmental Science and Technology',
    detail: '47(22), 2158–2207',
    doi: 'https://doi.org/10.1080/10643389.2017.1418191',
  },
  {
    id: 46,
    authors: 'Ding, Z., Hu, X., Wan, Y., Wang, S., Gao, B.',
    year: '2016',
    title: 'Removal of lead, copper, cadmium, zinc, and nickel from aqueous solutions by alkali-modified biochar: batch and column tests',
    journal: 'Journal of Industrial and Engineering Chemistry',
    detail: '33, 239–245',
    doi: 'https://doi.org/10.1016/j.jiec.2015.10.007',
  },
];

/** Inline superscript citation: <Cite ids={[1,3]} /> */
export function Cite({ ids }) {
  return (
    <sup className="inline-flex gap-0.5 ml-0.5">
      {ids.map((id, i) => (
        <span key={id}>
          <a
            href="#references"
            className="text-green-500 hover:text-green-400 font-bold text-[9px] transition-colors"
            title={`Ref [${id}]`}
          >
            [{id}]
          </a>
          {i < ids.length - 1 && <span className="text-green-500 text-[9px]">,</span>}
        </span>
      ))}
    </sup>
  );
}

export default function ScientificReferences() {
  return (
    <section id="references" className="py-16 bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h2 className="font-space font-bold text-xl text-white">Scientific References</h2>
            <p className="text-slate-500 text-xs mt-0.5">All factual claims on this page are supported by peer-reviewed literature or primary data sources.</p>
          </div>
        </motion.div>

        <ScrollArea className="h-[22rem] pr-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {REFS.map((ref, i) => (
              <motion.div
                key={ref.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex gap-3 p-4 rounded-xl bg-white/4 border border-white/8 hover:border-green-500/20 transition-colors group"
              >
                <span className="font-space font-bold text-green-500 text-xs w-6 flex-shrink-0 mt-0.5">[{ref.id}]</span>
                <div className="min-w-0">
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <span className="text-slate-400">{ref.authors} ({ref.year}). </span>
                    <span className="font-medium text-white">{ref.title} </span>
                    <span className="text-slate-400 italic">{ref.journal}, </span>
                    <span className="text-slate-500">{ref.detail}</span>
                  </p>
                  {ref.doi && (
                    <a
                      href={ref.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-green-500/70 hover:text-green-400 transition-colors"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      {ref.doi.replace('https://', '')}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center text-slate-600 text-xs"
        >
          Database-derived statistics (marked [12]) are calculated directly from the BiocharInformaticsThailand Database.xlsx experimental records.
          All other figures cite published peer-reviewed sources. Last reviewed: April 2026.
        </motion.p>
      </div>
    </section>
  );
}