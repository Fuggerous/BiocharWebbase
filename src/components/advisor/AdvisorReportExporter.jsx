// @ts-nocheck
import { useState } from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';

/**
 * AdvisorReportExporter — generates a .txt report for the Materials Advisor results.
 * Props:
 *   result      — from reverseQuery(...), has result.results array
 *   targetCO2   — number
 *   tolerance   — number
 *   biomass     — string
 *   secondaryObjective — string
 *   tertiaryObjective  — string
 */
export default function AdvisorReportExporter({ result, targetCO2, tolerance, biomass, secondaryObjective, tertiaryObjective }) {
  const [status, setStatus] = useState('idle'); // idle | generating | done

  if (!result || !result.results || result.results.length === 0) return null;

  const handleDownload = async () => {
    setStatus('generating');
    await new Promise(r => setTimeout(r, 700));

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const hr = (char = '─', n = 60) => char.repeat(n);

    const lines = [
      '╔' + '═'.repeat(58) + '╗',
      '║ BiocharInformaticsThailand — Materials Advisor Report ║',
      '║     The Global Biochar Intelligence Platform          ║',
      '╚' + '═'.repeat(58) + '╝',
      '',
      `Generated  : ${dateStr} at ${timeStr}`,
      `Platform   : BiocharInformaticsThailand Materials Advisor V.1.0`,
      `Method     : Reverse-lookup · Filter → Rank → Cluster`,
      '',
      hr(),
      '  QUERY PARAMETERS',
      hr(),
      `  Target CO₂ Uptake    : ${targetCO2} mmol/g`,
      `  Acceptable Tolerance : ±${tolerance} mmol/g`,
      `  Biomass Preference   : ${biomass === 'All' ? 'Any species' : biomass}`,
      `  Secondary Objective  : ${secondaryObjective === 'none' ? 'None' : secondaryObjective}`,
      `  Tertiary Objective   : ${tertiaryObjective === 'none' ? 'None' : tertiaryObjective}`,
      `  Result Mode          : ${result.mode === 'match' ? 'Exact match (within tolerance)' : 'Nearest match (no exact result found)'}`,
      `  Total Results Found  : ${result.results.length}`,
      '',
    ];

    result.results.forEach((r, i) => {
      lines.push(
        hr(),
        `  RECOMMENDATION #${i + 1}${i === 0 ? ' ★ BEST MATCH' : ''}`,
        hr(),
        `  Activation Method    : ${r.activator === 'None' ? 'No Activation' : r.activator}`,
        `  Activation Type      : ${r.activationType}`,
        `  Pyrolysis Temperature: ${r.pyroTemp} °C`,
        `  Mean CO₂ Uptake      : ${r.meanCO2} mmol/g`,
        `  CO₂ Range            : ${r.minCO2} – ${r.maxCO2} mmol/g`,
        `  vs Target            : ${r.meanCO2 >= targetCO2 ? '+' : ''}${(r.meanCO2 - targetCO2).toFixed(3)} mmol/g`,
        `  Avg BET Surface Area : ${r.avgSurface?.toLocaleString() ?? '—'} m²/g`,
        `  Supporting Records   : ${r.count} peer-reviewed experiments`,
        `  Biomass Species      : ${r.biomasses?.join(', ') ?? '—'}`,
        '',
      );
    });

    lines.push(
      hr(),
      '  SCIENTIFIC INTERPRETATION — TOP RESULT',
      hr(),
      `  Activator: ${result.results[0].activator}`,
      `  At ${result.results[0].pyroTemp}°C pyrolysis, ${result.results[0].activationType} activation`,
      `  produces ${result.results[0].count} peer-reviewed records matching your target.`,
      '',
      '  Activation type guide:',
      '  Chemical  → KOH, K₂CO₃ — highest surface area gain',
      '  Physical  → CO₂, steam — no chemical reagent needed',
      '  Combined  → KOH + CO₂ — dual etching mechanism',
      '  None      → raw pyrolysis char only',
      '',
      hr(),
      '  DATABASE CONTEXT',
      hr(),
      '  Database : 1,396 peer-reviewed CO₂ adsorption records',
      '  Period   : 2010–2024',
      '  Method   : Filter → rank by CO₂ proximity → cluster',
      '             by process similarity (activator + temp)',
      '',
      hr(),
      '  RECOMMENDED WORKFLOW',
      hr(),
      '  1. Use Property Estimator to confirm BET surface area',
      '     for your chosen activator + pyrolysis condition.',
      '  2. Feed the predicted BET into CO₂ Estimator to verify',
      '     the uptake estimate from a different angle.',
      '  3. Run a pilot synthesis experiment to validate.',
      '',
      hr(),
      '  DISCLAIMER',
      hr(),
      '  Recommendations are data-driven estimates based on',
      '  peer-reviewed experimental records. Laboratory',
      '  validation is required before adoption in practice.',
      '  Cite BiocharInformaticsThailand (PPC, Chulalongkorn University, 2026).',
      '',
      hr('═'),
      '  © 2026 BiocharInformaticsThailand · biocharinformaticsthailand.ai',
      hr('═'),
    );

    const biomassTag = biomass === 'All' ? 'AllBiomass' : biomass.replace(/\s+/g, '_');
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MaterialsAdvisor_${targetCO2}mmolg_${biomassTag}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setStatus('done');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={status !== 'idle'}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
        status === 'done'
          ? 'border-green-400 bg-green-50 text-green-700'
          : status === 'generating'
          ? 'border-indigo-300 bg-indigo-50 text-indigo-600 cursor-wait'
          : 'border-indigo-300 bg-white hover:bg-indigo-50 text-indigo-700 hover:border-indigo-400 hover:scale-[1.01]'
      }`}
    >
      {status === 'idle' && <><Download className="w-4 h-4" /> Export Report</>}
      {status === 'generating' && <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>}
      {status === 'done' && <><CheckCircle2 className="w-4 h-4" /> Downloaded!</>}
    </button>
  );
}
