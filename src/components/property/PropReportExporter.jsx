// @ts-nocheck
import { useState } from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';

/**
 * PropReportExporter — generates a .txt report for the Property Estimator result.
 * Props:
 *   result  — from estimateProperties(params)
 *   params  — { biomass, pyroTemp, residenceTime, activator }
 *   mlResult — from mlPipelineLookup (optional)
 */
export default function PropReportExporter({ result, params, mlResult, shapAnalysis }) {
  const [status, setStatus] = useState('idle'); // idle | generating | done

  if (!result) return null;

  const handleDownload = async () => {
    setStatus('generating');
    await new Promise(r => setTimeout(r, 600));

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const hr = (char = '─', n = 60) => char.repeat(n);

    const lines = [
      '╔' + '═'.repeat(58) + '╗',
      '║ BiocharInformaticsThailand — Property Estimation Report ║',
      '║     The Global Biochar Intelligence Platform          ║',
      '╚' + '═'.repeat(58) + '╝',
      '',
      `Generated : ${dateStr} at ${timeStr}`,
      `Platform  : BiocharInformaticsThailand Property Estimator V.1.0`,
      `Source    : 44-record peer-reviewed BET database`,
      '',
      hr(),
      '  SYNTHESIS PARAMETERS',
      hr(),
      `  Biomass Species      : ${params.biomass}`,
      `  Pyrolysis Temperature: ${params.pyroTemp} °C`,
      `  Residence Time       : ${params.residenceTime} min`,
      `  Activation Method    : ${params.activator === 'Non' ? 'None (No Activation)' : params.activator}`,
      '',
      hr(),
      '  ESTIMATION CONFIDENCE',
      hr(),
      `  Confidence Level     : ${result.confidence}`,
      `  Data Points Used     : ${result.dataPointsUsed} matching records`,
      '',
      hr(),
      '  STRUCTURAL PROPERTIES — DATABASE LOOKUP',
      hr(),
      '',
      '  BET Surface Area',
      `    Mean : ${result.surfaceArea.mean.toLocaleString()} m²/g`,
      `    Min  : ${result.surfaceArea.min.toLocaleString()} m²/g`,
      `    Max  : ${result.surfaceArea.max.toLocaleString()} m²/g`,
      '',
      '  Pore Volume',
      result.poreVolume
        ? `    Mean : ${result.poreVolume.mean} cm³/g`
        : '    Mean : N/A — no pore volume data in matched records',
      result.poreVolume
        ? `    Min  : ${result.poreVolume.min} cm³/g`
        : '    Min  : N/A',
      result.poreVolume
        ? `    Max  : ${result.poreVolume.max} cm³/g`
        : '    Max  : N/A',
      !result.poreVolume
        ? '    Note : Pore volume was not measured/reported for this synthesis condition.'
        : '',
      '',
      hr(),
      '  ELEMENTAL COMPOSITION (CHNS-O)',
      hr(),
      `  Carbon (C) : ${result.elemental.C} %`,
      `  Hydrogen (H): ${result.elemental.H} %`,
      `  Oxygen (O) : ${result.elemental.O} %`,
      `  Nitrogen (N): ${result.elemental.N} %`,
      `  Sulphur (S) : ${result.elemental.S} %`,
    ];

    if (mlResult) {
      lines.push(
        '',
        hr(),
        '  KNN ML MODEL — CROSS-VALIDATION ESTIMATES',
        hr(),
        `  BET Surface Area (ML): ${mlResult.sa?.toLocaleString() ?? '—'} m²/g`,
        `  Pore Volume (ML)     : ${mlResult.pv != null ? (mlResult.pv * 1e6).toFixed(3) : '—'} cm³/kg ×10⁶`,
        `  CO₂ Uptake (ML)      : ${mlResult.co2 ?? '—'} mmol/g`,
        `  Model R² (SA)        : ${mlResult.r2_prop ?? '—'}`,
        `  Model R² (CO₂)       : ${mlResult.r2_co2 ?? '—'}`,
      );
    }

    if (shapAnalysis) {
      lines.push(
        '',
        hr(),
        `  SHAP FEATURE IMPORTANCE — ${shapAnalysis.modelName.toUpperCase()}`,
        hr(),
        `  Baseline (reference input) : ${shapAnalysis.baseline} m²/g`,
        `  Model prediction           : ${shapAnalysis.prediction} m²/g`,
        `  Net SHAP effect (Δ)        : ${shapAnalysis.delta >= 0 ? '+' : ''}${shapAnalysis.delta} m²/g`,
        '',
        '  Feature Contributions (sorted by impact):',
        ...shapAnalysis.shapValues.map((s, i) =>
          `  ${i + 1}. ${s.label.padEnd(26)} ${s.sign === 'positive' ? '+' : ''}${s.value} m²/g  (${s.share}% of total effect)`
        ),
        '',
        `  Interpretation: ${shapAnalysis.summary}`,
        `  Method: ${shapAnalysis.methodNote}`,
      );
    }

    lines.push(
      '',
      hr(),
      '  RECOMMENDED NEXT STEP',
      hr(),
      '  Use the predicted BET Surface Area as input to the',
      '  CO₂ Adsorption Estimator for a more accurate uptake',
      '  prediction. Navigate to: /predictor',
      '',
      hr(),
      '  INTERPRETATION GUIDE',
      hr(),
      '  BET > 1000 m²/g  → likely CO₂ uptake > 4 mmol/g',
      '  BET 200–1000     → moderate adsorption potential',
      '  BET < 200 m²/g   → low adsorption, consider activation',
      '',
      '  Confidence levels:',
      '  High       = ≥ 5 closely matched records',
      '  Moderate   = 2–4 records matched',
      '  Indicative = < 2 records (sparse data region)',
      '',
      hr(),
      '  DISCLAIMER',
      hr(),
      '  These estimates are derived from ML-matching against',
      '  peer-reviewed experimental data. Laboratory validation',
      '  is required before use in publications. Cite BiocharInformaticsThailand',
      '  (Petroleum and Petrochemical College, CU, 2026).',
      '',
      hr('═'),
      '  © 2026 BiocharInformaticsThailand · biocharinformaticsthailand.ai',
      hr('═'),
    );

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PropEstimate_${params.biomass.replace(/\s+/g, '_')}_${params.pyroTemp}C_${params.activator}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setStatus('done');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={status !== 'idle'}
      className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border-2 font-space font-semibold text-sm transition-all ${
        status === 'done'
          ? 'border-green-400 bg-green-50 text-green-700'
          : status === 'generating'
          ? 'border-amber-300 bg-amber-50 text-amber-600 cursor-wait'
          : 'border-amber-300 bg-white hover:bg-amber-50 text-amber-700 hover:border-amber-400 hover:scale-[1.01]'
      }`}
    >
      {status === 'idle' && <><Download className="w-4 h-4" /> Export Property Report (.txt)</>}
      {status === 'generating' && <><Loader2 className="w-4 h-4 animate-spin" /> Generating Report...</>}
      {status === 'done' && <><CheckCircle2 className="w-4 h-4" /> Report Downloaded!</>}
    </button>
  );
}
