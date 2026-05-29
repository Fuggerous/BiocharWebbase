import { AlertTriangle, FlaskConical, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * PredictionDisclaimer — prominent banner for all 3 predictor pages.
 * Covers both DB Statistical Lookup and ML model predictions.
 *
 * Props:
 *   accentColor — 'green' | 'amber' | 'violet'  (matches page theme)
 */
const ACCENTS = {
  green:  { bg: 'bg-green-50',  border: 'border-green-300',  icon: 'text-green-600',  heading: 'text-green-800',  body: 'text-green-700',  badge: 'bg-green-100 border-green-300 text-green-700' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-300',  icon: 'text-amber-600',  heading: 'text-amber-800',  body: 'text-amber-700',  badge: 'bg-amber-100 border-amber-300 text-amber-700' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-300', icon: 'text-violet-600', heading: 'text-violet-800', body: 'text-violet-700', badge: 'bg-violet-100 border-violet-300 text-violet-700' },
};

export default function PredictionDisclaimer({ accentColor = 'green' }) {
  const c = ACCENTS[accentColor] ?? ACCENTS.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border-2 ${c.bg} ${c.border} p-4 flex gap-3 items-start`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <AlertTriangle className={`w-5 h-5 ${c.icon}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-space font-bold text-sm mb-1.5 ${c.heading}`}>
          Research Estimates — Not Validated Measurements
        </p>

        <p className={`text-xs leading-relaxed mb-2.5 ${c.body}`}>
          All outputs on this page are <strong>computational estimates</strong> only. Two methods are used, and both have limitations:
        </p>

        <div className="flex flex-wrap gap-2 mb-2.5">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${c.badge}`}>
            <FlaskConical className="w-3 h-3" />
            DB Statistical Lookup — matched from {' '}
            <span className="font-bold">peer-reviewed records only</span>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${c.badge}`}>
            <Brain className="w-3 h-3" />
            ML Model — trained on limited data (~58–1,395 samples)
          </div>
        </div>

        <p className={`text-[11px] leading-relaxed ${c.body}`}>
          Results may differ from actual experimental values due to variability in feedstock quality, equipment, and conditions.
          {' '}<strong>Laboratory validation is required</strong> before use in publications, engineering decisions, or commercial applications.
          Cite BiocharInformaticsThailand (Petroleum and Petrochemical College, CU, 2026).
        </p>
      </div>
    </motion.div>
  );
}
