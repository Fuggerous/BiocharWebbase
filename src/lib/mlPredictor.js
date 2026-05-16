// @ts-nocheck
/**
 * BiocharHub ML Predictor
 *
 * Three ML prediction methods for CO₂ estimation:
 *
 * 1. Trained Ridge Regression  (model_weights.json)
 *    — 17 features: 8 biomass + 6 activator one-hot + 3 continuous
 *    — Trained on 58 PEAK_RECORDS, LOO-CV R²=0.44
 *    — Always available (no lookup required)
 *
 * 2. KNN→SVR Pipeline  (ml_predictions.json pre-computed grid)
 *    — KNN predicts BET/PV, SVR predicts CO₂ from those features
 *    — 1,728 grid points, interpolated to user input
 *    — Strategy B R²=0.34 (CO₂), R²=0.86 (BET surface area)
 *
 * 3. Hand-fitted Ridge (legacy, kept for fallback only — not shown in selector)
 *    — Uses DB-derived scores, not trained coefficients
 */

import { BIOMASS_STATS, ACTIVATOR_STATS, DB_OVERALL_MAX } from './biocharKnowledgeBase';
import ML_LOOKUP from './ml_predictions.json';
import RIDGE_WEIGHTS from './model_weights.json';

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

// ── Trained Ridge (from model_weights.json) ───────────────────
const _RW = RIDGE_WEIGHTS;
const _biomassOrder   = _RW.feature_order.biomass;
const _activatorOrder = _RW.feature_order.activator;
const _norm           = _RW.normalization;

function _ridgeEncode({ biomass, activator, pyroTemp, residenceTime, heatingRate }) {
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  return [
    ..._biomassOrder.map(b => (b === biomass ? 1 : 0)),
    ..._activatorOrder.map(a => (a === activator ? 1 : 0)),
    clamp((pyroTemp    - _norm.pyroTemp.min)     / (_norm.pyroTemp.max     - _norm.pyroTemp.min),     0, 1),
    clamp((residenceTime - _norm.residenceTime.min) / (_norm.residenceTime.max - _norm.residenceTime.min), 0, 1),
    clamp((heatingRate   - _norm.heatingRate.min)   / (_norm.heatingRate.max   - _norm.heatingRate.min),   0, 1),
  ];
}

/**
 * Trained Ridge Regression — uses actual sklearn coefficients from model_weights.json.
 * LOO-CV R² = 0.4455  RMSE = 1.16 mmol/g  (n=58 PEAK_RECORDS)
 */
export function trainedRidgePredict({ biomass, temperature, activator, residenceTime = 60, heatingRate = 10 }) {
  const vec = _ridgeEncode({
    biomass,
    activator: activator ?? 'Non',
    pyroTemp:      Number(temperature)    || 600,
    residenceTime: Number(residenceTime)  || 60,
    heatingRate:   Number(heatingRate)    || 10,
  });

  const raw = _RW.intercept + _RW.coef.reduce((s, c, i) => s + c * (vec[i] ?? 0), 0);
  const co2  = +Math.max(0.05, Math.min(raw, DB_OVERALL_MAX + 1)).toFixed(3);
  const rmse = _RW.metrics.ridge_loo_rmse;
  const r2   = _RW.metrics.ridge_loo_r2;

  return {
    co2,
    co2Low:    +Math.max(0.05, co2 - rmse).toFixed(2),
    co2High:   +(co2 + rmse).toFixed(2),
    r2,
    rmse,
    modelNote: `Trained Ridge (α=${_RW.ridge_alpha}) · 17 features (one-hot) · LOO-CV R²=${r2}`,
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

// ── Additional model lookups (from ml_export_additional_models.py) ───────────
// Vite import.meta.glob: returns {} if no files match — safe when JSONs don't exist yet.
const _EXTRA_JSONS = import.meta.glob(
  ['./ml_elasticnet_sa.json', './ml_mlp_sa.json', './ml_stacking_co2.json'],
  { eager: true, import: 'default' }
);
const _EN_SA_DATA    = _EXTRA_JSONS['./ml_elasticnet_sa.json']   ?? null;
const _MLP_SA_DATA   = _EXTRA_JSONS['./ml_mlp_sa.json']          ?? null;
const _STACK_CO2_DATA = _EXTRA_JSONS['./ml_stacking_co2.json']   ?? null;

function _saLookup(data, biomass, activator, pyroTemp, residenceTime, heatingRate) {
  if (!data?.predictions?.length) return null;
  const preds = data.predictions;
  const temps = data.grid?.pyroTemps ?? [400,500,600,700,800,900];
  const lo = temps.filter(t => t <= pyroTemp).at(-1) ?? temps[0];
  const hi = temps.find(t => t > pyroTemp) ?? lo;

  const getPred = (t) => {
    const cands = preds.filter(p =>
      p.biomass === biomass && p.activator === activator && p.pyroTemp === t);
    if (!cands.length) return null;
    return cands.reduce((best, p) => {
      const d  = (p.reTime - residenceTime) ** 2 + (p.heatRate - heatingRate) ** 2;
      const bd = (best.reTime - residenceTime) ** 2 + (best.heatRate - heatingRate) ** 2;
      return d < bd ? p : best;
    });
  };

  const pLo = getPred(lo);
  const pHi = getPred(hi);
  if (!pLo) return null;
  if (lo === hi || !pHi) return { sa: pLo.sa };
  const t = (pyroTemp - lo) / (hi - lo);
  return { sa: +(pLo.sa + t * (pHi.sa - pLo.sa)).toFixed(1) };
}

function _co2Lookup(data, biomass, activator, pyroTemp, residenceTime, heatingRate) {
  if (!data?.predictions?.length) return null;
  const preds = data.predictions;
  const temps = data.grid?.pyroTemps ?? [400,500,600,700,800,900];
  const lo = temps.filter(t => t <= pyroTemp).at(-1) ?? temps[0];
  const hi = temps.find(t => t > pyroTemp) ?? lo;

  const getPred = (t) => {
    const cands = preds.filter(p =>
      p.biomass === biomass && p.activator === activator && p.pyroTemp === t);
    if (!cands.length) return null;
    return cands.reduce((best, p) => {
      const d  = (p.reTime - residenceTime) ** 2 + (p.heatRate - heatingRate) ** 2;
      const bd = (best.reTime - residenceTime) ** 2 + (best.heatRate - heatingRate) ** 2;
      return d < bd ? p : best;
    });
  };

  const pLo = getPred(lo);
  const pHi = getPred(hi);
  if (!pLo) return null;
  if (lo === hi || !pHi) return { co2: pLo.co2, sa: pLo.sa };
  const t = (pyroTemp - lo) / (hi - lo);
  return {
    co2: +(pLo.co2 + t * (pHi.co2 - pLo.co2)).toFixed(3),
    sa:  +(pLo.sa  + t * (pHi.sa  - pLo.sa )).toFixed(1),
  };
}

/** ElasticNet BET lookup. Returns { sa } or null if JSON not exported yet. */
export function elasticnetSaLookup({ biomass, temperature, activator, residenceTime = 60, heatingRate = 10 }) {
  return _saLookup(_EN_SA_DATA, biomass, activator,
    Number(temperature) || 600, Number(residenceTime) || 60, Number(heatingRate) || 10);
}

/** MLP BET lookup. Returns { sa } or null if JSON not exported yet. */
export function mlpSaLookup({ biomass, temperature, activator, residenceTime = 60, heatingRate = 10 }) {
  return _saLookup(_MLP_SA_DATA, biomass, activator,
    Number(temperature) || 600, Number(residenceTime) || 60, Number(heatingRate) || 10);
}

/** Stacking CO₂ lookup. Returns { co2, sa } or null if JSON not exported yet. */
export function stackingCo2Lookup({ biomass, temperature, activator, residenceTime = 60, heatingRate = 10 }) {
  const rmse = _STACK_CO2_DATA?.metrics?.rmse ?? 1.2;
  const pred = _co2Lookup(_STACK_CO2_DATA, biomass, activator,
    Number(temperature) || 600, Number(residenceTime) || 60, Number(heatingRate) || 10);
  if (!pred) return null;
  return {
    ...pred,
    co2Low:  +Math.max(0.05, pred.co2 - rmse).toFixed(2),
    co2High: +(pred.co2 + rmse).toFixed(2),
    r2:      _STACK_CO2_DATA?.metrics?.r2 ?? 0.25,
    modelNote: `Stacking Ensemble (SVR+KNN+RF+XGB → SVR meta) · R²=${_STACK_CO2_DATA?.metrics?.r2 ?? 0.25}`,
  };
}

// ── Blend-aware lightweight ensemble predictor ─────────────────────────────
// Accepts a primary biomass and a secondary biomass + ratio (0-100)
// Returns arrays of predictions for multiple blend ratios (0,25,50,75,100)
export function mlBlendPredict({ biomass, secondary, ratio = 50, temperature, activator, residenceTime = 60, heatingRate = 10, ratios = [0,25,50,75,100] }) {
  const makeStat = (bio) => mlPredict({ biomass: bio, temperature, activator, residenceTime, heatingRate }).mlMean;
  const makeML = (bio) => {
    const p = mlPipelineLookup({ biomass: bio, temperature, activator, residenceTime, heatingRate });
    if (p && Number.isFinite(p.co2)) return p.co2;
    // fallback to ridge-style mlPredict mean
    return mlPredict({ biomass: bio, temperature, activator, residenceTime, heatingRate }).mlMean;
  };

  const primaryStat = makeStat(biomass);
  const secondaryStat = makeStat(secondary);
  const primaryML = makeML(biomass);
  const secondaryML = makeML(secondary);

  const out = ratios.map(r => {
    const w = Number(r) / 100;
    const stat = +(primaryStat * (1 - w) + secondaryStat * w).toFixed(3);
    const ml   = +(primaryML * (1 - w) + secondaryML * w).toFixed(3);
    return { ratio: r, statMean: stat, mlMean: ml };
  });

  return out;
}

// ── Blend lookup by categorical `blend` feature (from export JSON)
const _PREDS_BLEND = ML_LOOKUP.predictions_by_blend || null;
export function mlBlendLookup({ biomass, temperature, activator, residenceTime = 60, heatingRate = 10, blend }) {
  if (!_PREDS_BLEND || !blend) return null;

  // Filter entries matching biomass + activator + blend
  const candidates = _PREDS_BLEND.filter(p => p.biomass === biomass && p.activator === activator && p.blend === blend);
  if (!candidates.length) return null;

  // Find nearest in pyroTemp/reTime/heatRate space
  const desiredPt = Number(temperature) || 600;
  let best = null, bestDist = Infinity;
  for (const p of candidates) {
    const d = ((p.pyroTemp - desiredPt) ** 2) + ((p.reTime - residenceTime) ** 2) + ((p.heatRate - heatingRate) ** 2);
    if (d < bestDist) { bestDist = d; best = p; }
  }
  if (!best) return null;

  const co2 = best.co2;
  // Attempt to read RMSE from metrics.model_04 if present, fallback to 1.0
  let rmse = 1.0;
  try {
    if (ML_LOOKUP.metrics && ML_LOOKUP.metrics.model_04) {
      const m = ML_LOOKUP.metrics.model_04;
      if (typeof m === 'object' && m.rmse) rmse = Number(m.rmse);
      else if (m && m.get && m.get('rmse')) rmse = Number(m.get('rmse'));
    }
  } catch (e) { /* ignore */ }

  return {
    co2:      co2,
    co2Low:   +Math.max(0.05, co2 - rmse).toFixed(2),
    co2High:  +(co2 + rmse).toFixed(2),
    sa:       best.sa,
    pv:       best.pv,
    r2_blend: (ML_LOOKUP.metrics && ML_LOOKUP.metrics.model_04) ? ML_LOOKUP.metrics.model_04 : null,
    modelNote: 'Blend-aware precomputed lookup (model_04)'
  };
}
