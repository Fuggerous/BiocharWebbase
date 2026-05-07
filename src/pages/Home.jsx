import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeaturesSection from '../components/home/FeaturesSection';
import BiocharFlow from '../components/home/BiocharFlow';
import TriplePhaseFlow from '../components/home/TriplePhaseFlow';
import ThailandContext from '../components/home/ThailandContext';
import AdsorptionScience from '../components/home/AdsorptionScience';
import CarbonImpact from '../components/home/CarbonImpact';
import ScientificReferences from '../components/home/ScientificReferences';
import HeatmapSection from '../components/home/HeatmapSection';
import AIRoadmapSection from '../components/home/AIRoadmapSection';
import ResearchNewsFeed from '../components/home/ResearchNewsFeed';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <TriplePhaseFlow />
      <ResearchNewsFeed />
      <BiocharFlow />
      <ThailandContext />
      <AdsorptionScience />
      <HeatmapSection />
      <CarbonImpact />
      <AIRoadmapSection />
      <FeaturesSection />

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
              Start Estimating <span className="text-gradient-green">CO₂ Adsorption</span> Today
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join 120+ researchers using BiocharHub to accelerate carbon capture research with data-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/predictor"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl gradient-green text-white font-semibold glow-green hover:scale-105 transition-transform"
              >
                Launch CO₂ Estimator <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/database"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-green-200 hover:border-green-400 text-foreground font-semibold transition-colors"
              >
                Browse Database
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