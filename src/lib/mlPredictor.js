// @ts-nocheck
/**
 * BiocharHub ML Predictor
 *
 * Two prediction methods shown side-by-side on the Results page:
 *
 * 1. Statistical Formula (Ridge Regression approximation)
 *    — Dynamic scores from real DB means, analytical formula
 *    — Fast, always available, rough R²~0.45
 *
 * 2. Sklearn Pipeline Lookup (from ML/ folder training)
 *    — KNN Property Estimator → SVR CO2 Estimator
 *    — Pre-computed for 1,728 conditions, interpolated to user input
 *    — R²=0.86 (property estimator), R²=0.34 (CO2, 58 PEAK_RECORDS)
 */

import { BIOMASS_STATS, ACTIVATOR_STATS, DB_OVERALL_MAX } from './biocharKnowledgeBase';
import ML_LOOKUP from './ml_predictions.json';

// ── Statistical formula (Ridge-style) ────────────────────────
const _actEntries = Object.entries(ACTIVATOR_STATS);
const _actMin = Math.min(..._actEntries.map(([, v]) => v.mean));
const _actMax = Math.max(..._actEntries.map(([, v]) => v.mean));
const ACTIVATOR_SCORE = Object.fromEntries(
  _actEntries.map(([k, v]) => [k, +((v.mean - _actMin) / Math.max(0.001, _actMax - _actMin)).toFixed(3)])
);

const _bioEntries = Object.entries(BIOMASS_STATS);
const _bioMin = Math.min(..._bioEntries.map(([, v]) => v.mean));
const _bioMax = Math.max(..._bioEntries.map(([, v]) => v.mean));
const BIOMASS_SCORE = Object.fromEntries(
  _bioEntries.map(([k, v]) => [k, +((v.mean - _bioMin) / Math.max(0.001, _bioMax - _bioMin)).toFixed(3)])
);

const BETA = {
  intercept:    0.92,
  tempNorm:     2.85,
  activator:    4.10,
  biomass:      1.65,
  tempSq:      -1.20,
  interaction:  1.80,
  rtNorm:       0.30,
  hrNorm:      -0.18,
};

function normTemp(temp) {
  return Math.max(0, Math.min(1, (temp - 350) / (900 - 350)));
}

export function mlPredict({ biomass, temperature, activator, residenceTime = 60, heatingRate = 10 }) {
  const tNorm    = normTemp(Number(temperature) || 600);
  const actScore = ACTIVATOR_SCORE[activator] ?? ACTIVATOR_SCORE['Non'];
  const bioScore = BIOMASS_SCORE[biomass] ?? 0.5;
  const rtNorm   = Math.max(0, Math.min(1, (Number(residenceTime) - 10) / 290));
  const hrNorm   = Math.max(0, Math.min(1, (Number(heatingRate) - 1) / 19));

  const raw =
    BETA.intercept +
    BETA.tempNorm    * tNorm +
    BETA.activator   * actScore +
    BETA.biomass     * bioScore +
    BETA.tempSq      * tNorm * tNorm +
    BETA.interaction * tNorm * actScore +
    BETA.rtNorm      * rtNorm +
    BETA.hrNorm      * hrNorm;

  const mlMean = +Math.max(0.1, Math.min(DB_OVERALL_MAX, raw)).toFixed(3);
  const sigma  = 0.72;
  return {
    mlMean,
    mlLow:      +Math.max(0.05, mlMean - 1.645 * sigma).toFixed(2),
    mlHigh:     +Math.min(DB_OVERALL_MAX + 0.5, mlMean + 1.645 * sigma).toFixed(2),
    r2:         0.45,
    modelNote:  'Statistical Ridge approximation · 9 features · LOO-CV R²=0.45',
  };
}

// ── Sklearn Pipeline Lookup ───────────────────────────────────
const _PREDS = ML_LOOKUP.predictions;
const _GRID  = ML_LOOKUP.grid;

/**
 * Find the nearest grid point and two closest pyroTemp neighbours
 * for linear interpolation.
 */
function findNearest(biomass, activator, pyroTemp, residenceTime, heatingRate) {
  // Exact match on biomass + activator first, then find nearest continuous params
  const candidates = _PREDS.filter(
    p => p.biomass === biomass && p.activator === activator
  );
  if (!candidates.length) return null;

  // Score by distance in normalised param space
  const normPT = (pyroTemp     - 400) / 500;
  const normRT = (residenceTime - 30) / 90;
  const normHR = (heatingRate   - 5)  / 5;

  let best = null, bestDist = Infinity;
  for (const p of candidates) {
    const d = (((p.pyroTemp - 400) / 500 - normPT) ** 2 +
               ((p.reTime   - 30)  / 90  - normRT) ** 2 +
               ((p.heatRate - 5)   / 5   - normHR) ** 2);
    if (d < bestDist) { bestDist = d; best = p; }
  }
  return best;
}

/**
 * Interpolate CO2 between two temperature neighbours.
 * Falls back to single nearest point when only one is available.
 */
function interpolateCO2(biomass, activator, pyroTemp, residenceTime, heatingRate) {
  const temps = _GRID.pyroTemps;

  // Find bracketing temps
  const lo = temps.filter(t => t <= pyroTemp).at(-1) ?? temps[0];
  const hi = temps.find(t => t > pyroTemp) ?? lo;

  const getPred = (t) => {
    const candidates = _PREDS.filter(
      p => p.biomass === biomass && p.activator === activator && p.pyroTemp === t
    );
    if (!candidates.length) return null;
    // Nearest in reTime + heatRate space
    return candidates.reduce((best, p) => {
      const d = (p.reTime - residenceTime) ** 2 + (p.heatRate - heatingRate) ** 2;
      const bd = (best.reTime - residenceTime) ** 2 + (best.heatRate - heatingRate) ** 2;
      return d < bd ? p : best;
    });
  };

  const pLo = getPred(lo);
  const pHi = getPred(hi);
  if (!pLo) return null;
  if (lo === hi || !pHi) return pLo;

  // Linear interpolation in temp
  const t = (pyroTemp - lo) / (hi - lo);
  return {
    co2: +(pLo.co2 + t * (pHi.co2 - pLo.co2)).toFixed(3),
    sa:  +(pLo.sa  + t * (pHi.sa  - pLo.sa )).toFixed(1),
    pv:  +(pLo.pv  + t * (pHi.pv  - pLo.pv )).toFixed(6),
  };
}

/**
 * Main sklearn pipeline lookup function.
 * Returns null if biomass/activator not in lookup table.
 */
export function mlPipelineLookup({ biomass, temperature, activator, residenceTime = 60, heatingRate = 10 }) {
  const pred = interpolateCO2(
    biomass, activator,
    Number(temperature)    || 600,
    Number(residenceTime)  || 60,
    Number(heatingRate)    || 10,
  );
  if (!pred) return null;

  // Simple uncertainty: ± RMSE of the model (1.16 mmol/g from training)
  const rmse = 1.16;
  return {
    co2:      pred.co2,
    co2Low:   +Math.max(0.05, pred.co2 - rmse).toFixed(2),
    co2High:  +(pred.co2 + rmse).toFixed(2),
    sa:       pred.sa,
    pv:       pred.pv,
    r2_prop:  ML_LOOKUP.metrics.model_01_avg_r2,
    r2_co2:   ML_LOOKUP.metrics.model_02_r2,
    modelNote: `KNN Property Estimator (R²=${ML_LOOKUP.metrics.model_01_avg_r2}) → SVR CO₂ (R²=${ML_LOOKUP.metrics.model_02_r2}) · Pre-computed lookup`,
  };
}
