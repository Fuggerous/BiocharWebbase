// @ts-nocheck
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { Leaf, Target, Globe, Zap, BookOpen, ArrowRight, Brain, Database, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRole } from '../lib/RoleContext';
import { TOTAL_DATA_POINTS, TOTAL_EXPERIMENTS, DB_OVERALL_MAX } from '../lib/biocharKnowledgeBase';

const TEAM = [
  {
    name: 'Dr. Nuttapong Sueviriyapan',
    role: 'Team Leader & Research Supervisor',
    org: 'Petroleum and Petrochemical College (PPC)\nChulalongkorn University',
    avatar: 'NS',
    color: 'from-green-500 to-emerald-600',
    tags: ['Research Direction', 'Biochar Science', 'CO₂ Adsorption'],
  },
  {
    name: 'Affan Dulyadech',
    role: 'AI & Modeling Lead',
    org: 'Petroleum and Petrochemical College (PPC)\nChulalongkorn University',
    avatar: 'AD',
    color: 'from-blue-500 to-indigo-600',
    tags: ['Machine Learning', 'PI-DNN', 'Web Development'],
  },
];

const MILESTONES = [
  {
    date: 'Jul 2025',
    title: 'Research Initiated',
    desc: 'Systematic literature review on biochar CO₂ adsorption mechanisms and experimental datasets. Identified key features: BET surface area, pore volume, activation method, and pyrolysis conditions.',
    color: '#22c55e',
    icon: '🌱',
    tag: 'Research',
  },
  {
    date: 'Aug 2025',
    title: '+2,000 Datapoints Collected',
    desc: 'Manual extraction and curation of CO₂ adsorption isotherm data from peer-reviewed journals. Standardised format covering 8 biomass species, 6 activators, and isotherm curves at multiple pressures.',
    color: '#3b82f6',
    icon: '📊',
    tag: 'Dataset',
  },
  {
    date: 'Feb 2026',
    title: 'PI-DNN Model Developed',
    desc: 'Physics-Informed Deep Neural Network (PI-DNN) developed with Langmuir, Freundlich, Temkin, and Sips isotherm constraints. Trained on the curated dataset with pressure-weighted loss function.',
    color: '#a855f7',
    icon: '🧠',
    tag: 'ML Model',
  },
  {
    date: 'Apr 2026',
    title: 'Biochar Assistant Thailand Launched',
    desc: 'Full-stack research web platform launched. Three predictor tools (CO₂ Estimator, Property Estimator, Materials Advisor) with real database integration, interactive heatmap, and correlation analysis.',
    color: '#f59e0b',
    icon: '🚀',
    tag: 'Platform',
  },
  {
    date: 'May 2026',
    title: `${TOTAL_DATA_POINTS.toLocaleString()} Datapoints Published`,
    desc: `${TOTAL_DATA_POINTS.toLocaleString()} experimental isotherm records across ${TOTAL_EXPERIMENTS} unique experiments now live on the platform. Sklearn ML pipeline (KNN → SVR) trained and integrated. Peak CO₂ recorded: ${DB_OVERALL_MAX.toFixed(2)} mmol/g.`,
    color: '#22c55e',
    icon: '✅',
    tag: 'Live',
  },
  {
    date: 'Coming',
    title: 'Extended Dataset & PI-DNN v2',
    desc: 'Additional biochar isotherm data from extended literature sources. Improved PI-DNN with monotonicity constraints, Clausius–Clapeyron temperature consistency, and transfer learning from synthetic isotherms.',
    color: '#94a3b8',
    icon: '🔬',
    tag: 'Planned',
  },
];

export default function About() {
  const { isAdmin, logout } = useRole();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="gradient-hero pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-green-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex w-16 h-16 rounded-2xl gradient-green items-center justify-center mx-auto mb-6 glow-green">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-space font-bold text-5xl text-white mb-4">
              About <span className="text-green-400">BiocharHub</span>
            </h1>
            <p className="text-blue-100/70 text-xl leading-relaxed max-w-2xl mx-auto">
              A research platform built at Chulalongkorn University to accelerate
              biochar CO₂ adsorption science through open data, AI prediction, and accessible tools.
            </p>

            {/* Admin status badge */}
            {isAdmin && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                <span className="text-green-300 text-sm font-medium">Admin mode active</span>
                <button onClick={logout} className="flex items-center gap-1 text-green-400 hover:text-white text-xs transition-colors">
                  <LogOut className="w-3 h-3" /> Sign out
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Mission cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Target, title: 'Mission',
              desc: 'Build the most comprehensive open database of biochar CO₂ adsorption data and make accurate prediction tools accessible to every researcher — regardless of institution or computational resources.',
              color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20',
            },
            {
              icon: Brain, title: 'AI Approach',
              desc: 'Combine statistical database lookup with trained sklearn ML pipelines (KNN → SVR) and Physics-Informed Neural Networks (PI-DNN) that embed isotherm equations as physical constraints inside the loss function.',
              color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20',
            },
            {
              icon: Globe, title: 'Impact',
              desc: 'Supporting Thailand\'s carbon neutrality goal. Biochar from agricultural residues (corn straw, coffee grounds, bamboo) offers dual benefits: CO₂ sequestration and soil amendment from agri-waste.',
              color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20',
            },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className={`glass-card rounded-2xl p-6 border ${item.bg} h-full`}>
                <div className={`inline-flex w-11 h-11 rounded-xl ${item.bg} border items-center justify-center mb-4`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="font-space font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card rounded-2xl p-6 border border-green-500/20 bg-green-500/5 mb-16">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-green-500" />
            <h3 className="font-space font-semibold text-base">Database at a Glance</h3>
            <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-600 font-bold border border-green-500/20">
              Live Data
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Data Points', value: TOTAL_DATA_POINTS.toLocaleString(), color: '#22c55e' },
              { label: 'Experiments', value: TOTAL_EXPERIMENTS, color: '#3b82f6' },
              { label: 'Peak CO₂', value: `${DB_OVERALL_MAX.toFixed(2)} mmol/g`, color: '#a855f7' },
              { label: 'Biomass Species', value: '8', color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-muted/40 border border-border">
                <p className="font-space font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-16">
          <h2 className="font-space font-bold text-3xl mb-2 text-center">Core Team</h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            Petroleum and Petrochemical College · Chulalongkorn University
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {TEAM.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="glass-card rounded-2xl p-6 border border-border hover:scale-[1.02] transition-transform">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex-shrink-0
                      flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">{member.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-space font-semibold text-sm leading-tight">{member.name}</h4>
                      <p className="text-green-600 text-xs font-medium mt-0.5">{member.role}</p>
                      <p className="text-muted-foreground text-[11px] mt-0.5 whitespace-pre-line">{member.org}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted border border-border text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-16">
          <h2 className="font-space font-bold text-3xl mb-2 text-center">Project Timeline</h2>
          <p className="text-muted-foreground text-center mb-10 text-sm">From research to live platform</p>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-6 pl-2"
                >
                  {/* Dot */}
                  <div className="relative flex-shrink-0 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl
                      border-2 border-white shadow-md z-10"
                      style={{ background: `${m.color}20`, borderColor: m.color }}>
                      {m.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="glass-card rounded-2xl p-4 border border-border flex-1 mb-1">
                    <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                      <div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
                          style={{ background: `${m.color}15`, color: m.color, borderColor: `${m.color}40` }}>
                          {m.tag}
                        </span>
                        <h4 className="font-space font-semibold text-sm mt-1.5">{m.title}</h4>
                      </div>
                      <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{m.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-16">
          <h2 className="font-space font-bold text-2xl mb-6 text-center">Built With</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['React + Vite', 'Python + scikit-learn', 'PyTorch (PI-DNN)', 'XGBoost', 'Recharts',
              'Tailwind CSS', 'pandas + numpy', 'scipy optimize'].map(tech => (
              <span key={tech} className="px-4 py-2 rounded-xl bg-muted border border-border
                text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center">
          <div className="glass-card rounded-3xl p-10 border border-green-200/50
            bg-gradient-to-br from-green-50/50 to-blue-50/50 max-w-2xl mx-auto">
            <BookOpen className="w-10 h-10 text-green-500 mx-auto mb-4" />
            <h3 className="font-space font-bold text-2xl mb-3">Explore the Platform</h3>
            <p className="text-muted-foreground mb-6">
              Browse the database, run CO₂ predictions, or find optimal synthesis conditions
              — all running locally in your browser.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/predictor" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                gradient-green text-white font-semibold text-sm glow-green hover:scale-105 transition-transform">
                CO₂ Estimator <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/database" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors">
                Browse Database
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
