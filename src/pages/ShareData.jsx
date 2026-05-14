import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, Plus, CheckCircle2, Clock, Eye, Award, TrendingUp, User, Calendar } from 'lucide-react';

const SUBMISSIONS = [
  { date: '2026-03-28', id: 'SUB-1042', type: 'Manual', status: 'Published', feedstock: 'Pine Wood' },
  { date: '2026-03-25', id: 'SUB-1041', type: 'Bulk CSV', status: 'Approved', feedstock: 'Rice Husk' },
  { date: '2026-03-20', id: 'SUB-1039', type: 'Manual', status: 'Pending Review', feedstock: 'Corn Stalk' },
  { date: '2026-03-18', id: 'SUB-1038', type: 'Bulk CSV', status: 'Published', feedstock: 'Bamboo' },
  { date: '2026-03-10', id: 'SUB-1035', type: 'Manual', status: 'Published', feedstock: 'Wheat Straw' },
];

const TOP_CONTRIBUTORS = [
  { name: 'Dr. Mei Zhang', org: 'Tsinghua University', count: 87, badge: '🏆' },
  { name: 'Prof. James Osei', org: 'MIT Carbon Lab', count: 64, badge: '🥈' },
  { name: 'Dr. Priya Nair', org: 'IIT Bombay', count: 52, badge: '🥉' },
  { name: 'Dr. Lars Müller', org: 'TU Berlin', count: 41, badge: '' },
  { name: 'Dr. Sarah Chen', org: 'Stanford GCEP', count: 38, badge: '' },
];

const LATEST_DATASETS = [
  { id: 'BC-1498', type: 'Coconut Shell', temp: 900, surface: 1820, date: '2 hours ago' },
  { id: 'BC-1497', type: 'Sugarcane Bagasse', temp: 650, surface: 740, date: '5 hours ago' },
  { id: 'BC-1496', type: 'Eucalyptus', temp: 800, surface: 1100, date: '1 day ago' },
  { id: 'BC-1495', type: 'Municipal Solid', temp: 500, surface: 390, date: '2 days ago' },
];

const statusColors = {
  'Published': 'bg-green-100 text-green-700',
  'Approved': 'bg-blue-100 text-blue-700',
  'Pending Review': 'bg-amber-100 text-amber-700',
};

export default function ShareData() {
  const [activeUpload, setActiveUpload] = useState(null);
  const [formData, setFormData] = useState({ feedstock: '', temp: '', surface: '', co2: '', activation: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-3">
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">Open Science Initiative</span>
            </div>
            <h1 className="font-space font-bold text-4xl text-white mb-3">
              Contribute Your <span className="text-green-400">Biochar Data</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Help advance global carbon research. Your experimental data will be peer-reviewed and added to the open database.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload methods */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Manual Form */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div
                  className={`glass-card rounded-2xl p-6 border-2 cursor-pointer transition-all ${activeUpload === 'manual' ? 'border-green-400 bg-green-50/50' : 'border-border hover:border-green-300'}`}
                  onClick={() => setActiveUpload(activeUpload === 'manual' ? null : 'manual')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-space font-semibold text-base">1. Manual Form</h3>
                      <p className="text-xs text-muted-foreground">Enter data point by point</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Fill in individual biochar experiment results including synthesis conditions and adsorption measurements.</p>
                  <button className="w-full py-2.5 rounded-xl gradient-green text-white text-sm font-semibold">
                    Open Form
                  </button>
                </div>
              </motion.div>

              {/* Bulk Upload */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div
                  className={`glass-card rounded-2xl p-6 border-2 cursor-pointer transition-all ${activeUpload === 'bulk' ? 'border-blue-400 bg-blue-50/50' : 'border-border hover:border-blue-300'}`}
                  onClick={() => setActiveUpload(activeUpload === 'bulk' ? null : 'bulk')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <FileSpreadsheet className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-space font-semibold text-base">2. Bulk Upload</h3>
                      <p className="text-xs text-muted-foreground">Excel / CSV file upload</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Upload a pre-formatted Excel or CSV file with multiple biochar data records at once. Template provided.</p>
                  <button className="w-full py-2.5 rounded-xl gradient-blue text-white text-sm font-semibold">
                    Upload File
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Expanded Manual Form */}
            {activeUpload === 'manual' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div className="glass-card rounded-2xl p-6 border border-green-200/60">
                  <h3 className="font-space font-semibold text-base mb-5">Manual Data Entry Form</h3>
                  {submitted && (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-green-100 border border-green-200 text-green-700 text-sm font-medium mb-4">
                      <CheckCircle2 className="w-4 h-4" /> Submitted! Your data is pending peer review.
                    </div>
                  )}
                  <form onSubmit={handleManualSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Feedstock Type', key: 'feedstock', placeholder: 'e.g., Rice Husk' },
                      { label: 'Pyrolysis Temp (°C)', key: 'temp', placeholder: 'e.g., 600' },
                      { label: 'BET Surface Area (m²/g)', key: 'surface', placeholder: 'e.g., 1240' },
                      { label: 'CO₂ Adsorption (mmol/g)', key: 'co2', placeholder: 'e.g., 3.8' },
                      { label: 'Activation Method', key: 'activation', placeholder: 'e.g., KOH' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={formData[field.key]}
                          onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <button type="submit" className="px-6 py-3 rounded-xl gradient-green text-white font-semibold text-sm glow-green hover:scale-105 transition-transform">
                        Submit Dataset
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Bulk Upload Drop zone */}
            {activeUpload === 'bulk' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div className="glass-card rounded-2xl p-6 border border-blue-200/60">
                  <h3 className="font-space font-semibold text-base mb-4">Upload Excel / CSV</h3>
                  <div className="border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer bg-blue-50/40">
                    <FileSpreadsheet className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    <p className="font-medium text-foreground">Drag & drop your file here</p>
                    <p className="text-sm text-muted-foreground mt-1">Supports .xlsx, .csv · Max 10MB</p>
                    <button className="mt-5 px-6 py-2.5 rounded-xl gradient-blue text-white text-sm font-semibold">
                      Browse Files
                    </button>
                  </div>
                  <a href="#" className="block mt-3 text-center text-sm text-blue-500 hover:underline">
                    Download CSV Template →
                  </a>
                </div>
              </motion.div>
            )}

            {/* Submission History */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="glass-card rounded-2xl p-5 border border-border">
                <h3 className="font-space font-semibold text-base mb-4">Submission History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {['Date', 'ID', 'Feedstock', 'Type', 'Status'].map(h => (
                          <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SUBMISSIONS.map((row, i) => (
                        <tr key={row.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                          <td className="py-3 px-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{row.date}</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-xs text-blue-500">{row.id}</td>
                          <td className="py-3 px-3 font-medium">{row.feedstock}</td>
                          <td className="py-3 px-3 text-xs">{row.type}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[row.status]}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right panel: Community */}
          <div className="lg:col-span-1 space-y-5">
            {/* Top Contributors */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="glass-card rounded-2xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-amber-500" />
                  <h3 className="font-space font-semibold text-base">Top Contributors</h3>
                </div>
                <div className="space-y-3">
                  {TOP_CONTRIBUTORS.map((c, i) => (
                    <div key={c.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-muted text-muted-foreground'}`}>
                          {i < 3 ? c.badge : i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold leading-none">{c.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{c.org}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-green-600">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Latest Datasets */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="glass-card rounded-2xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <h3 className="font-space font-semibold text-base">Latest Datasets</h3>
                </div>
                <div className="space-y-3">
                  {LATEST_DATASETS.map(d => (
                    <div key={d.id} className="flex items-start justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors cursor-pointer">
                      <div>
                        <p className="text-xs font-mono text-blue-500">{d.id}</p>
                        <p className="text-sm font-semibold">{d.type}</p>
                        <p className="text-xs text-muted-foreground">{d.temp}°C · {d.surface} m²/g</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{d.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}