// @ts-nocheck
import { motion } from 'framer-motion';
import { MapPin, Leaf, TrendingUp, Zap } from 'lucide-react';
import { Cite } from './ScientificReferences';
import { BIOMASS_STATS, TOTAL_DATA_POINTS, TOTAL_EXPERIMENTS, DB_OVERALL_MAX } from '../../lib/biocharKnowledgeBase';
import { DB44_RECORDS } from '../../lib/database44';
import { useLang } from '../../lib/LanguageContext';

function betRange(biomassKey) {
  const vals = DB44_RECORDS.filter(r => r.biomass === biomassKey && r.surfaceArea > 0).map(r => r.surfaceArea);
  if (!vals.length) return null;
  return `${Math.round(Math.min(...vals)).toLocaleString()}–${Math.round(Math.max(...vals)).toLocaleString()} m²/g`;
}
const CORN_BET   = betRange('Corn straw')          ?? '598–3,157 m²/g';
const COFFEE_BET = betRange('Coffee ground-based') ?? '645–2,337 m²/g';

const FEEDSTOCKS = [
  {
    name: 'Rice Husk',
    icon: '🌾',
    region: 'Central Plains & North',
    abundance: '~10 Mt/yr',
    carbonContent: '35–40%',
    betPotential: '200–500 m²/g',
    color: '#f59e0b',
    note: 'High silica content; co-pyrolysis yields Si-doped biochar with enhanced CO₂ affinity.',
    refs: [8, 10],
    image: 'https://images.unsplash.com/photo-1536054454-cf14a6cc0854?w=400&q=80',
  },
  {
    name: 'Corn Straw',
    icon: '🌽',
    region: 'Northern Highland Regions',
    abundance: '~8 Mt/yr',
    carbonContent: '42–48%',
    betPotential: CORN_BET,
    color: '#22c55e',
    note: `Cellulose-rich; KOH activation achieves the highest CO₂ uptake in the 44Database (${DB_OVERALL_MAX.toFixed(2)} mmol/g).`,
    refs: [6, 12],
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80',
  },
  {
    name: 'Cassava Rhizome',
    icon: '🪵',
    region: 'Northeast (Isaan)',
    abundance: '~4 Mt/yr',
    carbonContent: '40–45%',
    betPotential: '150–600 m²/g',
    color: '#a855f7',
    note: 'Starchy biomass with low ash; produces high-yield biochar ideal for soil amendment and carbon storage.',
    refs: [8, 1],
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
  },
  {
    name: 'Coffee Grounds',
    icon: '☕',
    region: 'Northern Highlands (Doi Chang)',
    abundance: '~1.2 Mt/yr',
    carbonContent: '47–55%',
    betPotential: COFFEE_BET,
    color: '#06b6d4',
    note: 'Nitrogen-rich; K₂CO₃ activation yields exceptional micropore volumes for selective CO₂/N₂ separation.',
    refs: [9, 12],
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
  },
];

export default function ThailandContext() {
  const { t } = useLang();

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-dots-pattern opacity-40" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">{t('th.badge')}</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-4xl text-foreground mb-3">
            {t('th.heading1')}{' '}
            <span className="text-gradient-green">{t('th.heading2')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('th.desc')}<Cite ids={[8]} />
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEEDSTOCKS.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group glass-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
            >
              {/* Image header */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={f.image}
                  alt={f.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <h3 className="font-space font-bold text-white text-lg leading-none">{f.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-300" />
                      <span className="text-slate-300 text-xs">{f.region}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold border"
                  style={{ background: `${f.color}25`, borderColor: `${f.color}50`, color: f.color }}>
                  {f.abundance}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                {[
                  { label: t('th.stat.carbon'), value: f.carbonContent, icon: Leaf },
                  { label: t('th.stat.bet'), value: f.betPotential, icon: TrendingUp },
                  { label: t('th.stat.abundance'), value: f.abundance, icon: Zap },
                ].map(stat => (
                  <div key={stat.label} className="px-4 py-3 text-center">
                    <p className="font-space font-bold text-sm text-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Note */}
              <div className="p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold" style={{ color: f.color }}>{t('th.keyInsight')} </span>
                  {f.note}<Cite ids={f.refs} />
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 glass-card rounded-2xl p-6 border border-green-500/20 bg-green-500/5 flex flex-col md:flex-row items-center gap-5 text-center md:text-left"
        >
          <div className="w-14 h-14 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-7 h-7 text-green-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-space font-bold text-lg text-foreground mb-1">{t('th.bottomHeading')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('th.bottomDesc')
                .replace('{points}', TOTAL_DATA_POINTS.toLocaleString())
                .replace('{species}', Object.keys(BIOMASS_STATS).length)
                .replace('{experiments}', TOTAL_EXPERIMENTS)}<Cite ids={[12]} />
            </p>
          </div>
          <a href="/database" className="px-5 py-2.5 rounded-xl gradient-green text-white text-sm font-semibold glow-green hover:scale-105 transition-transform whitespace-nowrap flex-shrink-0">
            {t('th.explore')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}