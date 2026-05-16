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
    authors: '44Database (BiocharHub)',
    year: '2025',
    title: 'Experimental CO₂ Adsorption Isotherm Records — 44Database.xlsx.',
    journal: 'BiocharHub Internal Dataset',
    detail: '1,263 records across 8 biomass species, 6 activators, 92 unique isotherm experiments.',
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
          Database-derived statistics (marked [12]) are calculated directly from the BiocharHub 44Database.xlsx experimental records.
          All other figures cite published peer-reviewed sources. Last reviewed: April 2026.
        </motion.p>
      </div>
    </section>
  );
}