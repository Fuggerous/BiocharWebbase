import { motion } from 'framer-motion';
import { ExternalLink, BookOpen, Newspaper, Zap, Database, TrendingUp } from 'lucide-react';

const NEWS_ITEMS = [
  {
    type: 'publication',
    icon: BookOpen,
    color: '#22c55e',
    tag: 'New Publication',
    title: 'KOH-activated rice husk biochar achieves 6.8 mmol/g CO₂ uptake at 25°C',
    source: 'Journal of Hazardous Materials, 2025',
    excerpt: 'Researchers report a surface area of 2,847 m²/g using a 1:3 KOH impregnation ratio at 800°C, now indexed in 44Database.',
    date: 'Apr 2026',
  },
  {
    type: 'update',
    icon: Database,
    color: '#3b82f6',
    tag: 'Platform Update',
    title: 'BioPredict AI v1.8 — Feasibility Scores & Correlation Heatmap added',
    source: 'BiocharHub · Release Notes',
    excerpt: 'New multi-objective optimization interface, industrial feasibility scoring, and Pearson correlation matrix now live across all analysis tools.',
    date: 'May 2026',
  },
  {
    type: 'news',
    icon: TrendingUp,
    color: '#f59e0b',
    tag: 'Carbon Markets',
    title: 'Biochar carbon credits reach $280/tonne in voluntary markets',
    source: 'Carbon Pulse · Market Report',
    excerpt: 'Premium-grade biochar with verified CO₂ sequestration >2t CO₂eq/t biochar is commanding record prices amid EU carbon border adjustment.',
    date: 'Apr 2026',
  },
  {
    type: 'publication',
    icon: BookOpen,
    color: '#a855f7',
    tag: 'New Publication',
    title: 'Hybrid KOH-CO₂ activation of pine sawdust yields ultra-microporous carbon',
    source: 'Chemical Engineering Journal, 2025',
    excerpt: 'Combined activation protocol produces 3,157 m²/g BET surface area — the highest record in the 44Database for pine-derived biochar.',
    date: 'Mar 2026',
  },
  {
    type: 'news',
    icon: Newspaper,
    color: '#06b6d4',
    tag: 'Industry News',
    title: 'Thailand scales biochar production to 450,000 tonnes/yr from agricultural residues',
    source: 'BBIA Bulletin · Q1 2026',
    excerpt: 'Rice husk and corn straw conversion projects now supply biochar for both soil amendment and industrial CO₂ capture under national carbon policy.',
    date: 'Mar 2026',
  },
  {
    type: 'update',
    icon: Zap,
    color: '#ec4899',
    tag: 'Dataset Added',
    title: '38 new hybrid composite isotherm records added to 44Database',
    source: 'BiocharHub · Data Team',
    excerpt: 'New corn/coffee co-pyrolysis experiments at 600–800°C with KOH activation now available for correlation analysis and advisor queries.',
    date: 'Feb 2026',
  },
];

const TYPE_STYLES = {
  publication: 'bg-green-500/10 text-green-600 border-green-500/20',
  update:      'bg-blue-500/10 text-blue-600 border-blue-500/20',
  news:        'bg-amber-500/10 text-amber-600 border-amber-500/20',
};

export default function ResearchNewsFeed() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-dots-pattern opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Newspaper className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600 text-sm font-medium">Open Science · Live Updates</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-4xl mb-3">
            Latest Insights &amp; <span className="text-gradient-blue">Open Science Updates</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Recent publications, platform updates, and carbon market trends from the global biochar research ecosystem.
          </p>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {NEWS_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="break-inside-avoid glass-card rounded-2xl p-5 border border-border hover:shadow-lg transition-all group cursor-pointer mb-5"
              >
                {/* Tag row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${TYPE_STYLES[item.type]}`}>
                      {item.tag}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">{item.date}</span>
                </div>

                {/* Title */}
                <h3 className="font-space font-semibold text-sm leading-snug mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                {/* Source */}
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: item.color }}>
                  {item.source}
                </p>

                {/* Excerpt */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.excerpt}
                </p>

                <div className="flex items-center gap-1 mt-3 text-[10px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  Read more <ExternalLink className="w-3 h-3" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}