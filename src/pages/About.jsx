import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { Leaf, Target, Globe, Users, Zap, BookOpen, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Dr. Elena Vasquez', role: 'Founder & Chief Scientist', org: 'Carbon Capture Lab', avatar: 'EV' },
  { name: 'Dr. Raj Patel', role: 'Head of AI & Modeling', org: 'MIT CSAIL', avatar: 'RP' },
  { name: 'Dr. Lena Hoffmann', role: 'Database Architecture', org: 'ETH Zürich', avatar: 'LH' },
  { name: 'Dr. Chen Wei', role: 'Pyrolysis Science Lead', org: 'Peking University', avatar: 'CW' },
];

const milestones = [
  { year: '2021', title: 'Platform Founded', desc: 'BiocharHub launched as an open science initiative with 50 seed datasets.' },
  { year: '2022', title: 'PI-DNN Model v1', desc: 'First physics-informed neural network for CO₂ adsorption prediction published.' },
  { year: '2023', title: '500+ Datasets', desc: 'Community grows to 500 curated datasets and 45 contributing researchers.' },
  { year: '2024', title: 'Global Expansion', desc: 'Platform expands to 45 countries with multilingual support and API access.' },
  { year: '2025', title: '1,500 Datasets', desc: 'Milestone reached: 1,500 datasets, 120+ contributors, v2.4 AI model.' },
  { year: '2026', title: 'IPCC Partnership', desc: 'Official partnership with IPCC for carbon capture data standardization.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
              An open-science platform uniting researchers worldwide to accelerate carbon capture innovation through shared data and AI-powered insights.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: 'Our Mission', desc: 'To democratize biochar science by creating the world\'s most comprehensive open database of CO₂ adsorption data, empowering researchers at every level.', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
            { icon: Globe, title: 'Global Impact', desc: 'Supporting IPCC carbon capture goals by aggregating experimental data from 45+ countries, enabling publication-quality analysis and reproducible research.', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
            { icon: Zap, title: 'AI Innovation', desc: 'Developing next-generation Physics-Informed Deep Neural Networks (PI-DNN) that fuse scientific principles with data-driven prediction for unprecedented accuracy.', color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
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

        {/* Team */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="font-space font-bold text-3xl mb-2 text-center">Core Team</h2>
          <p className="text-muted-foreground text-center mb-8">Scientists and engineers passionate about open carbon research</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="glass-card rounded-2xl p-5 border border-border text-center hover:scale-105 transition-transform">
                  <div className="w-14 h-14 rounded-2xl gradient-green mx-auto mb-3 flex items-center justify-center glow-green">
                    <span className="text-white font-bold text-lg">{member.avatar}</span>
                  </div>
                  <h4 className="font-space font-semibold text-sm">{member.name}</h4>
                  <p className="text-green-600 text-xs font-medium mt-0.5">{member.role}</p>
                  <p className="text-muted-foreground text-xs mt-1">{member.org}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="font-space font-bold text-3xl mb-8 text-center">Platform Milestones</h2>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={m.year} className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`glass-card inline-block rounded-2xl p-5 border border-border max-w-sm ${i % 2 === 0 ? 'ml-auto' : ''}`}>
                      <p className="text-green-500 font-space font-bold text-lg">{m.year}</p>
                      <h4 className="font-semibold text-base mt-0.5">{m.title}</h4>
                      <p className="text-muted-foreground text-sm mt-1">{m.desc}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-md z-10 shrink-0" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <div className="glass-card rounded-3xl p-10 border border-green-200/50 bg-gradient-to-br from-green-50/50 to-blue-50/50 max-w-2xl mx-auto">
            <BookOpen className="w-10 h-10 text-green-500 mx-auto mb-4" />
            <h3 className="font-space font-bold text-2xl mb-3">Join the Research Community</h3>
            <p className="text-muted-foreground mb-6">Contribute datasets, access AI predictions, and help shape the future of carbon capture science.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/share" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-green text-white font-semibold text-sm glow-green">
                Contribute Data <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/predictor" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors">
                Try AI Predictor
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}