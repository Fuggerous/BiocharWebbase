import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import IntroSection from '../components/home/IntroSection';
import ResearchNewsFeed from '../components/home/ResearchNewsFeed';
import KnowledgeCenterSection from '../components/home/KnowledgeCenterSection';
import DocumentsSection from '../components/home/DocumentsSection';
import BiocharSocietySection from '../components/home/BiocharSocietySection';
import TriplePhaseFlow from '../components/home/TriplePhaseFlow';
import HeatmapSection from '../components/home/HeatmapSection';
import ScientificReferences from '../components/home/ScientificReferences';
import SectionNavDots from '../components/home/SectionNavDots';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import { TOTAL_DATA_POINTS } from '../lib/biocharKnowledgeBase';
import { useLang } from '../lib/LanguageContext';

export default function Home() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SectionNavDots />

      {/* 1. Database highlight */}
      <div id="section-hero">
        <HeroSection />
        <StatsSection />
      </div>

      {/* 2. Introduce the website */}
      <div id="section-intro">
        <IntroSection />
      </div>

      {/* 3. Database Chemical Space */}
      <div id="section-chemical">
        <ResearchNewsFeed />
      </div>

      {/* 4. Knowledge Center (What is Biochar / Thailand / Process Flow / Docs) */}
      <div id="section-knowledge">
        <KnowledgeCenterSection />
      </div>

      {/* 5. Documents */}
      <div id="section-documents">
        <DocumentsSection />
      </div>

      {/* 6. Biochar Society in Thailand */}
      <div id="section-society">
        <BiocharSocietySection />
      </div>

      {/* 7. Triple-Phase Intelligence Framework */}
      <div id="section-triplephase">
        <TriplePhaseFlow />
      </div>

      {/* 8. CO₂ Adsorption Hotspots — Temperature × Activator Matrix */}
      <div id="section-heatmap">
        <HeatmapSection />
      </div>

      {/* CTA Banner */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 border border-green-200/50"
          >
            <div className="w-14 h-14 rounded-2xl gradient-green mx-auto mb-6 flex items-center justify-center glow-green">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-space font-bold text-3xl lg:text-4xl mb-4">
              {t('cta.heading')} <span className="text-gradient-green">{t('cta.headingHighlight')}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              {TOTAL_DATA_POINTS.toLocaleString()} {t('cta.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/predictor"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl gradient-green text-white font-semibold glow-green hover:scale-105 transition-transform"
              >
                {t('cta.launch')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/database"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-green-200 hover:border-green-400 text-foreground font-semibold transition-colors"
              >
                {t('cta.browse')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <ScientificReferences />
      <Footer />
    </div>
  );
}