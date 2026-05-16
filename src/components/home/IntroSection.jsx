// @ts-nocheck
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Database, Zap, BookOpen, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CARD_META = [
  {
    icon: Database,
    color: 'text-green-500',
    bg: 'bg-green-500/10 border-green-500/20',
    titleKey: 'intro.db.title',
    descKey:  'intro.db.desc',
    ctaKey:   'intro.db.cta',
    to: '/database',
  },
  {
    icon: Zap,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
    titleKey: 'intro.pred.title',
    descKey:  'intro.pred.desc',
    ctaKey:   'intro.pred.cta',
    to: '/predictor',
  },
  {
    icon: BookOpen,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10 border-purple-500/20',
    titleKey: 'intro.know.title',
    descKey:  'intro.know.desc',
    ctaKey:   'intro.know.cta',
    to: '#knowledge',
  },
];

export default function IntroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium mb-4">
            {t('intro.badge')}
          </span>
          <h2 className="font-space font-bold text-3xl lg:text-4xl mb-4">
            {t('intro.heading')}{' '}
            <span className="text-gradient-green">{t('intro.headingHighlight')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            {t('intro.desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARD_META.map((card, i) => (
            <motion.div
              key={card.titleKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={card.to}
                className={`group block p-6 rounded-2xl border glass-card hover:scale-[1.02] transition-all duration-200 h-full`}
              >
                <div className={`w-12 h-12 rounded-xl ${card.bg} border flex items-center justify-center mb-4`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <h3 className="font-space font-bold text-lg mb-2">{t(card.titleKey)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{t(card.descKey)}</p>
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${card.color} group-hover:gap-2.5 transition-all`}>
                  {t(card.ctaKey)} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
