// @ts-nocheck
/**
 * BiocharHub – Data-Driven Knowledge Base
 * All statistics are computed dynamically from DB44_RECORDS.
 * No hardcoded values — numbers update automatically when the database grows.
 */

import { DB44_RECORDS, BIOMASS_COLORS } from './database44';

// ── Temperature bracket helper ───────────────────────────────────────────────
function getTempBracket(t) {
  const n = Number(t) || 600;
  if (n <= 450)  return 400;
  if (n <= 580)  return 500;
  if (n <= 660)  return 600;
  if (n <= 760)  return 700;
  if (n <= 900)  return 800;
  return 1000;
}

// ── PEAK_RECORDS ─────────────────────────────────────────────────────────────
// One record per (isothermId × adsorpTemp): the highest CO₂ point on each
// isotherm curve at each measurement temperature.
// Used for unbiased statistics — avoids inflating counts with low-pressure tails.
export const PEAK_RECORDS = (() => {
  const best = {};
  DB44_RECORDS.forEach(r => {
    const key = `${r.isothermId}__${r.adsorpTemp}`;
    if (!best[key] || r.co2Uptake > best[key].co2Uptake) best[key] = r;
  });
  return Object.values(best);
})();

export const TOTAL_DATA_POINTS  = DB44_RECORDS.length;
export const TOTAL_EXPERIMENTS  = new Set(DB44_RECORDS.map(r => r.isothermId)).size;

// ── BIOMASS_STATS ─────────────────────────────────────────────────────────────
export const BIOMASS_STATS = (() => {
  const peakGroups = {};
  PEAK_RECORDS.forEach(r => {
    if (!peakGroups[r.biomass]) peakGroups[r.biomass] = { vals: [], surfaces: [] };
    peakGroups[r.biomass].vals.push(r.co2Uptake);
    peakGroups[r.biomass].surfaces.push(r.surfaceArea);
  });
  const out = {};
  Object.entries(peakGroups).forEach(([bio, { vals, surfaces }]) => {
    out[bio] = {
      mean:       +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(3),
      min:        +Math.min(...vals).toFixed(3),
      max:        +Math.max(...vals).toFixed(3),
      count:      DB44_RECORDS.filter(r => r.biomass === bio).length,
      avgSurface: Math.round(surfaces.reduce((a, b) => a + b, 0) / surfaces.length),
    };
  });
  return out;
})();

// ── ACTIVATOR_STATS ───────────────────────────────────────────────────────────
const ACTIVATOR_LABELS = {
  'KOH':     'KOH (Chemical)',
  'K2CO3':   'K₂CO₃ (Chemical)',
  'KOH-CO2': 'KOH + CO₂ (Combined)',
  'CO2':     'CO₂ (Physical)',
  'LiCl':    'LiCl (Chemical)',
  'Non':     'None',
};

export const ACTIVATOR_STATS = (() => {
  const groups = {};
  PEAK_RECORDS.forEach(r => {
    if (!groups[r.activator]) groups[r.activator] = [];
    groups[r.activator].push(r.co2Uptake);
  });
  const out = {};
  Object.entries(groups).forEach(([act, vals]) => {
    out[act] = {
      mean:  +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(3),
      min:   +Math.min(...vals).toFixed(3),
      max:   +Math.max(...vals).toFixed(3),
      count: DB44_RECORDS.filter(r => r.activator === act).length,
      label: ACTIVATOR_LABELS[act] || act,
    };
  });
  return out;
})();

// ── ACTIVATION_STATS ──────────────────────────────────────────────────────────
const ACTIVATION_TYPE_LABELS = {
  'Chemical': 'Chemical Activation',
  'Physical': 'Physical (CO₂/Steam)',
  'Combined': 'Combined (Chemical + Physical)',
  'Non':      'No Activation',
};

export const ACTIVATION_STATS = (() => {
  const groups = {};
  PEAK_RECORDS.forEach(r => {
    if (!groups[r.activationType]) groups[r.activationType] = [];
    groups[r.activationType].push(r.co2Uptake);
  });
  const out = {};
  Object.entries(groups).forEach(([type, vals]) => {
    out[type] = {
      mean:  +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(3),
      min:   +Math.min(...vals).toFixed(3),
      max:   +Math.max(...vals).toFixed(3),
      count: DB44_RECORDS.filter(r => r.activationType === type).length,
      label: ACTIVATION_TYPE_LABELS[type] || type,
    };
  });
  return out;
})();

// ── TEMPERATURE_STATS ─────────────────────────────────────────────────────────
export const TEMPERATURE_STATS = (() => {
  const groups = {};
  PEAK_RECORDS.forEach(r => {
    if (!r.pyroTemp) return;
    const b = getTempBracket(r.pyroTemp);
    if (!groups[b]) groups[b] = [];
    groups[b].push(r.co2Uptake);
  });
  const out = {};
  Object.entries(groups).forEach(([temp, vals]) => {
    out[temp] = {
      mean:  +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(3),
      min:   +Math.min(...vals).toFixed(3),
      max:   +Math.max(...vals).toFixed(3),
      count: DB44_RECORDS.filter(r => r.pyroTemp && getTempBracket(r.pyroTemp) === +temp).length,
      label: `${temp}°C`,
    };
  });
  return out;
})();

// ── Global stats ──────────────────────────────────────────────────────────────
const _allCO2 = PEAK_RECORDS.map(r => r.co2Uptake);
export const DB_OVERALL_AVG = +(_allCO2.reduce((a, b) => a + b, 0) / _allCO2.length).toFixed(3);
export const DB_OVERALL_MAX = +Math.max(..._allCO2).toFixed(3);
export const DB_OVERALL_MIN = +Math.min(..._allCO2).toFixed(3);

// ── Heatmap matrix: activator × pyroTemp → mean CO₂ (from PEAK_RECORDS) ──────
export function computeHeatmapMatrix() {
  const activators = Object.keys(ACTIVATOR_STATS).sort((a, b) => {
    const order = ['Non', 'CO2', 'LiCl', 'K2CO3', 'KOH-CO2', 'KOH'];
    return order.indexOf(a) - order.indexOf(b);
  });
  const temps = [...new Set(PEAK_RECORDS.map(r => r.pyroTemp).filter(Boolean))].sort((a, b) => a - b);

  const matrix = {};
  activators.forEach(act => {
    matrix[act] = {};
    temps.forEach(t => {
      const recs = PEAK_RECORDS.filter(r => r.activator === act && r.pyroTemp === t);
      if (recs.length > 0) {
        matrix[act][t] = +(recs.reduce((s, r) => s + r.co2Uptake, 0) / recs.length).toFixed(2);
      }
    });
  });
  return { matrix, activators, temps };
}

// ── Chart data exports ────────────────────────────────────────────────────────
export const REAL_FEEDSTOCK_DISTRIBUTION = Object.entries(BIOMASS_STATS).map(([name, s]) => ({
  name: name.replace(' ground-based', '').replace(' sawdust powders', ''),
  value: s.count,
  color: BIOMASS_COLORS[name] || '#94a3b8',
}));

export const REAL_AVG_BY_BIOMASS = Object.entries(BIOMASS_STATS).map(([name, s]) => ({
  type: name.replace(' ground-based', '').replace(' sawdust powders', ''),
  avg:  s.mean,
  fill: BIOMASS_COLORS[name] || '#94a3b8',
}));

export const REAL_ACTIVATION_DISTRIBUTION = Object.entries(ACTIVATION_STATS).map(([type, s]) => ({
  name:  ACTIVATION_TYPE_LABELS[type] || type,
  value: s.count,
  color: { Chemical: '#22c55e', Combined: '#3b82f6', Physical: '#f59e0b', Non: '#94a3b8' }[type] || '#94a3b8',
}));

export const REAL_TEMP_DISTRIBUTION = Object.entries(TEMPERATURE_STATS).map(([temp, s]) => ({
  temp:   `${temp}°C`,
  count:  s.count,
  avgCO2: s.mean,
})).sort((a, b) => parseInt(a.temp) - parseInt(b.temp));

export const REAL_SCATTER_SUMMARY = PEAK_RECORDS.map(r => ({
  surface:     r.surfaceArea,
  co2:         r.co2Uptake,
  type:        r.biomass.replace(' ground-based', '').replace(' sawdust powders', ''),
  isothermId:  r.isothermId,
  activator:   r.activator,
  pyroTemp:    r.pyroTemp,
}));

// ── Normalizers ───────────────────────────────────────────────────────────────
function normalizeBiomass(input) {
  if (!input) return Object.keys(BIOMASS_STATS)[0];
  const lower = input.toLowerCase();
  if (lower.includes('corn') || lower.includes('straw')) return 'Corn straw';
  if (lower.includes('coffee') || lower.includes('ground')) return 'Coffee ground-based';
  if (lower.includes('pine') || lower.includes('sawdust')) return 'Pine sawdust powders';
  if (lower.includes('bamboo')) return 'Bamboo';
  if (lower.includes('banana')) return 'Banana straw';
  if (lower.includes('pomelo') || lower.includes('peel')) return 'Pomelo peel';
  if (lower.includes('sugarcane') || lower.includes('bagasse')) return 'Sugarcane bagasse';
  if (lower.includes('cotton')) return 'Cotton straw';
  // fallback: try direct match
  const match = Object.keys(BIOMASS_STATS).find(k => k.toLowerCase() === lower);
  return match || Object.keys(BIOMASS_STATS)[0];
}

function normalizeActivator(activator) {
  if (!activator || activator === 'None' || activator === 'Non') return 'Non';
  const lower = String(activator).toLowerCase();
  if (lower.includes('koh') && lower.includes('co2')) return 'KOH-CO2';
  if (lower.includes('koh'))   return 'KOH';
  if (lower.includes('k2co3') || lower.includes('k₂co₃')) return 'K2CO3';
  if (lower.includes('co2') || lower.includes('steam'))    return 'CO2';
  if (lower.includes('licl')) return 'LiCl';
  return 'Non';
}

// ── Expert Guidance Query ─────────────────────────────────────────────────────
export function queryExpertGuidance({ biomass, temperature, activator, residenceTime }) {
  const bioKey   = normalizeBiomass(biomass);
  const tempBkt  = getTempBracket(temperature);
  const activKey = normalizeActivator(activator);
  const rt       = Number(residenceTime) || 60;

  // Level 1a — exact match including residenceTime window (±40 min)
  const exactRT  = PEAK_RECORDS.filter(r =>
    r.biomass === bioKey && getTempBracket(r.pyroTemp) === tempBkt && r.activator === activKey &&
    Math.abs((r.residenceTime || 60) - rt) <= 40
  );
  // Level 1b — exact match without RT constraint (fallback if 1a empty)
  const exact    = exactRT.length > 0 ? exactRT :
    PEAK_RECORDS.filter(r => r.biomass === bioKey && getTempBracket(r.pyroTemp) === tempBkt && r.activator === activKey);
  const bioTemp  = exact.length > 0 ? exact : PEAK_RECORDS.filter(r => r.biomass === bioKey && getTempBracket(r.pyroTemp) === tempBkt);
  const pool     = bioTemp.length > 0 ? bioTemp : PEAK_RECORDS.filter(r => r.biomass === bioKey);
  const fallback = pool.length > 0 ? pool : PEAK_RECORDS;

  const co2s  = fallback.map(r => r.co2Uptake);
  const n     = co2s.length;
  const mean  = co2s.reduce((a, b) => a + b, 0) / n;
  const min   = Math.min(...co2s);
  const max   = Math.max(...co2s);

  // Sample std deviation (Bessel corrected)
  const variance = co2s.reduce((a, v) => a + (v - mean) ** 2, 0) / Math.max(1, n - 1);
  const std  = Math.sqrt(variance);
  const se   = std / Math.sqrt(n); // standard error of the mean

  // Prediction interval factor: σ × √(1 + 1/n)  — accounts for single future observation
  const predSigma = std * Math.sqrt(1 + 1 / n);

  // Percentiles from sorted data
  const sorted = [...co2s].sort((a, b) => a - b);
  const pct = (p) => sorted[Math.max(0, Math.min(n - 1, Math.floor(p * n)))];

  // Which fallback level was used
  const matchLevel =
    exact.length   > 0 ? 'exact'   :
    bioTemp.length > 0 ? 'bioTemp' :
    pool.length    > 0 ? 'biomass' : 'global';

  const biomassData = BIOMASS_STATS[bioKey] || Object.values(BIOMASS_STATS)[0];
  const activData   = ACTIVATOR_STATS[activKey] || ACTIVATOR_STATS['Non'];
  const tempData    = TEMPERATURE_STATS[String(tempBkt)];

  const confidence =
    exact.length   >= 3  ? 'High' :
    bioTemp.length >= 2  ? 'Moderate' :
    pool.length    >= 1  ? 'Indicative' : 'Indicative';

  const benchmarkData = Object.entries(BIOMASS_STATS).map(([name, stats]) => ({
    name:  name.replace(' ground-based', '').replace(' sawdust powders', ''),
    avg:   stats.mean,
    count: stats.count,
  }));

  const recommendations = generateRecommendations({ biomass: bioKey, temperature: Number(temperature), activKey, blendedMean: mean, activData, tempData });

  return {
    min:               +Math.max(0.01, min).toFixed(2),
    max:               +max.toFixed(2),
    mean:              +mean.toFixed(3),
    std:               +std.toFixed(3),
    se:                +se.toFixed(4),
    predSigma:         +predSigma.toFixed(3),
    n,
    matchLevel,
    // Prediction intervals (z × predSigma, clamped ≥ 0.01)
    pi95lo:  +Math.max(0.01, mean - 1.96 * predSigma).toFixed(2),
    pi95hi:  +Math.min(max * 1.5, mean + 1.96 * predSigma).toFixed(2),
    pi80lo:  +Math.max(0.01, mean - 1.28 * predSigma).toFixed(2),
    pi80hi:  +Math.min(max * 1.4, mean + 1.28 * predSigma).toFixed(2),
    // Percentiles from observed data
    p25:     +pct(0.25).toFixed(2),
    p75:     +pct(0.75).toFixed(2),
    p05:     +pct(0.05).toFixed(2),
    p95:     +pct(0.95).toFixed(2),
    dataPointsUsed:    n,
    totalDataPoints:   TOTAL_DATA_POINTS,
    biomassStats:      { ...biomassData, name: bioKey },
    activatorStats:    activData,
    temperatureBracket: tempData,
    benchmarkData,
    overallAvg:        DB_OVERALL_AVG,
    confidence,
    recommendations,
  };
}

// ── Recommendations engine ───────────────────────────────────────────────────
function generateRecommendations({ biomass, temperature, activKey, blendedMean, activData, tempData }) {
  const recs = [];
  const dbMax = BIOMASS_STATS[biomass]?.max ?? DB_OVERALL_MAX;
  const dbMean = BIOMASS_STATS[biomass]?.mean ?? DB_OVERALL_AVG;

  if (blendedMean > dbMean * 1.2) {
    recs.push({ type: 'positive', text: `Strong CO₂ uptake predicted (${blendedMean.toFixed(2)} mmol/g). This configuration is in the top tier for ${biomass} in the research database.` });
  } else if (blendedMean < dbMean * 0.6) {
    recs.push({ type: 'warning', text: `Below-average uptake predicted. Consider increasing pyrolysis temperature to 700–800°C or adding KOH/K₂CO₃ chemical activation.` });
  } else {
    recs.push({ type: 'neutral', text: `Moderate CO₂ adsorption predicted (${blendedMean.toFixed(2)} mmol/g). Performance is within the typical range for ${biomass}.` });
  }

  if (temperature > 700) {
    recs.push({ type: 'positive', text: `High pyrolysis temperature (${temperature}°C) promotes micropore formation — consistent with top performers in the database.` });
  } else if (temperature < 500) {
    recs.push({ type: 'warning', text: `Low pyrolysis temperature (${temperature}°C) limits carbonization. Database evidence suggests 600–800°C yields higher uptake.` });
  }

  if (activKey !== 'Non' && activData) {
    recs.push({ type: 'positive', text: `${activData.label} activation applied. Database mean for this activator: ${activData.mean.toFixed(2)} mmol/g across ${activData.count} data points.` });
  } else {
    const actMean = Object.values(ACTIVATOR_STATS).filter(s => ACTIVATOR_LABELS[Object.keys(ACTIVATOR_STATS).find(k => ACTIVATOR_STATS[k] === s)] !== 'None').reduce((s,a) => s + a.mean, 0);
    const nonStat = ACTIVATOR_STATS['Non'];
    recs.push({ type: 'info', text: `No activation applied. Activated biochars average ${DB_OVERALL_AVG.toFixed(2)} mmol/g overall vs ${nonStat?.mean?.toFixed(2) ?? '—'} mmol/g without activation.` });
  }

  const bioStat = BIOMASS_STATS[biomass];
  if (bioStat) {
    recs.push({ type: 'info', text: `${biomass} has ${bioStat.count} data points in the database. Best recorded: ${bioStat.max.toFixed(2)} mmol/g (avg surface area ${bioStat.avgSurface} m²/g).` });
  }

  return recs;
}
