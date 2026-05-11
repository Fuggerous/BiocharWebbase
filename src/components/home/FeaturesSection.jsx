// @ts-nocheck
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Database, Zap, Brain, BarChart3, ArrowRight } from 'lucide-react';
import { TOTAL_DATA_POINTS } from '../../lib/biocharKnowledgeBase';

const features = [
  {
    icon: Database,
    title: 'Scientific Database',
    desc: `Browse ${TOTAL_DATA_POINTS.toLocaleString()} curated experimental records with advanced filtering by feedstock, temperature, activation method, and structural properties. Export filtered subsets as CSV.`,
    link: '/database',
    cta: 'Explore Database',
    color: 'green',
    gradient: 'from-green-500/10 to-emerald-500/5',
    border: 'border-green-500/20',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-500',
  },
  {
    icon: Zap,
    title: 'Property Estimator',
    desc: 'Input pyrolysis conditions and get estimated BET surface area, pore volume, and CHNS-O elemental composition — matched from real database records with ML comparison.',
    link: '/property-estimator',
    cta: 'Estimate Properties',
    color: 'amber',
    gradient: 'from-amber-500/10 to-orange-500/5',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
  {
    icon: BarChart3,
    title: 'CO₂ Estimator',
    desc: '3-method prediction: statistical DB lookup + Ridge approximation + trained sklearn ML pipeline (KNN → SVR). Results shown side-by-side with agreement indicator.',
    link: '/predictor',
    cta: 'Get CO₂ Estimate',
    color: 'blue',
    gradient: 'from-blue-500/10 to-sky-500/5',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    icon: Brain,
    title: 'Materials Advisor',
    desc: 'Reverse design: input your target CO₂ uptake and get the optimal activator and pyrolysis conditions ranked by feasibility score and ML validation.',
    link: '/advisor',
    cta: 'Find Optimal Conditions',
    color: 'purple',
    gradient: 'from-purple-500/10 to-violet-500/5',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-space font-bold text-3xl lg:text-4xl">
            Four Tools. <span className="text-gradient-blue">One Platform.</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
            From raw synthesis conditions to optimised production parameters —
            BiocharHub covers the full biochar CO₂ adsorption workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card rounded-2xl p-7 bg-gradient-to-br ${f.gradient} border ${f.border} group hover:scale-[1.02] transition-all`}
            >
              <div className={`inline-flex w-12 h-12 rounded-xl ${f.iconBg} border ${f.border} items-center justify-center mb-5`}>
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>
              <h3 className="font-space font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-5">{f.desc}</p>
              <Link
                to={f.link}
                className={`inline-flex items-center gap-2 text-sm font-semibold ${f.iconColor} group-hover:gap-3 transition-all`}
              >
                {f.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
