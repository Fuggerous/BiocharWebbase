import { useState } from 'react';
import { Download, CheckCircle2, Loader2 } from 'lucide-react';
import { TOTAL_DATA_POINTS } from '../../lib/biocharKnowledgeBase';

export default function ReportExporter({ result, params }) {
  const [status, setStatus] = useState('idle'); // idle | generating | done

  const generateReport = () => {
    setStatus('generating');

    // Build text report content
    const lines = [
      '═══════════════════════════════════════════════════════',
      '   BiocharHub · BioPredict AI v1.6 – Estimation Report ',
      '═══════════════════════════════════════════════════════',
      `Generated: ${new Date().toLocaleString()}`,
      `Total Database Records: ${TOTAL_DATA_POINTS.toLocaleString()} peer-reviewed experimental data points`,
      '',
      '── INPUT PARAMETERS ────────────────────────────────────',
      `  Biomass / Feedstock : ${params.biomass}`,
      `  Pyrolysis Temperature: ${params.temperature}°C`,
      `  Residence Time       : ${params.residenceTime} min`,
      `  Heating Rate         : ${params.heatingRate}°C/min`,
      `  Activator            : ${params.activator === 'Non' ? 'None' : params.activator}`,
      '',
      '── ESTIMATION RESULTS ──────────────────────────────────',
      `  Predicted Min CO₂ Uptake : ${result.min} mmol/g`,
      `  Predicted Mean CO₂ Uptake: ${result.mean.toFixed(2)} mmol/g  ← Recommended Target`,
      `  Predicted Max CO₂ Uptake : ${result.max} mmol/g`,
      `  Confidence Level         : ${result.confidence}`,
      `  Matching Data Points Used: ${result.dataPointsUsed}`,
      '',
      '── BIOMASS DATABASE STATISTICS ─────────────────────────',
      `  Biomass : ${params.biomass}`,
      `  DB Records : ${result.biomassStats.count}`,
      `  DB Min CO₂ : ${result.biomassStats.min} mmol/g`,
      `  DB Max CO₂ : ${result.biomassStats.max} mmol/g`,
      `  DB Mean CO₂: ${result.biomassStats.mean} mmol/g`,
      `  Avg Surface Area: ${result.biomassStats.avgSurface} m²/g`,
      '',
      '── ACTIVATOR STATISTICS ────────────────────────────────',
      `  Activator: ${result.activatorStats?.label ?? 'N/A'}`,
      `  DB Mean  : ${result.activatorStats?.mean?.toFixed(2) ?? 'N/A'} mmol/g`,
      `  DB Count : ${result.activatorStats?.count ?? 'N/A'} records`,
      '',
      '── EXPERT INSIGHTS ─────────────────────────────────────',
      ...result.recommendations.map(r => `  [${r.type.toUpperCase()}] ${r.text}`),
      '',
      '── DISCLAIMER ──────────────────────────────────────────',
      '  Results are statistical estimates derived from aggregated',
      '  peer-reviewed research data. Raw individual records are',
      '  never exposed. Individual experimental outcomes may vary.',
      '  This report is for research planning purposes only.',
      '',
      '  BiocharHub · biocharhub.ai · BioPredict AI v1.6',
      '═══════════════════════════════════════════════════════',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BioPredict_Report_${params.biomass.replace(/\s+/g, '_')}_${params.temperature}C.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    }, 600);
  };

  return (
    <button
      onClick={generateReport}
      disabled={status !== 'idle'}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-green text-white font-semibold text-sm glow-green hover:scale-105 transition-transform disabled:opacity-80 disabled:scale-100"
    >
      {status === 'generating' && <Loader2 className="w-4 h-4 animate-spin" />}
      {status === 'done' && <CheckCircle2 className="w-4 h-4" />}
      {status === 'idle' && <Download className="w-4 h-4" />}
      {status === 'idle' ? 'Export Report' : status === 'generating' ? 'Generating...' : 'Downloaded!'}
    </button>
  );
}