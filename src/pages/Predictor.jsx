import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PredictorForm from '../components/predictor/PredictorForm';
import { motion } from 'framer-motion';
import { Zap, Shield, BarChart3, Brain } from 'lucide-react';

const features = [
  { icon: Brain, label: '3-Method Prediction', desc: 'Statistical lookup + Ridge approximation + Sklearn ML pipeline (KNN → SVR)' },
  { icon: Shield, label: 'Data-Backed', desc: '1,395 peer-reviewed experimental records · 8 biomass species · 6 activators' },
  { icon: BarChart3, label: 'Prediction Intervals', desc: 'Real statistical confidence intervals from matched DB records' },
];

export default function Predictor() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-950 pt-24 pb-12 relative overflow-hidden border-b border-green-100 dark:border-emerald-900/30">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'linear-gradient(rgba(34,197,94,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-300 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 text-sm font-medium">BioPredict AI v1.7 · Statistical + ML Model · Database-Driven</span>
            </div>
            <h1 className="font-space font-bold text-4xl lg:text-5xl text-foreground mb-3">
              CO₂ Adsorption<br />
              <span className="text-green-600">Estimator</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Configure your biochar synthesis parameters and get a statistically-derived CO₂ adsorption estimate based on {features[0] ? '' : ''}peer-reviewed experimental data.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {features.map(f => (
                <div key={f.label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div className="w-7 h-7 rounded-lg bg-green-100 border border-green-300 flex items-center justify-center">
                    <f.icon className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-xs">{f.label}</p>
                    <p className="text-muted-foreground text-[10px]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <PredictorForm />
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}