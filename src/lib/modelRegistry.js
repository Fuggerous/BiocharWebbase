// @ts-nocheck
/**
 * Central registry of all ML models used across the platform.
 * - SELECTABLE models: pre-computed predictions exist in browser → user can pick for result
 * - COMPARISON_ONLY models: trained in Python, R² known, but no prediction grid exported yet
 *
 * R² values for comparison charts are read directly from ML/outputs/ training charts.
 * Deployed model metrics come from ML/outputs/*_metrics.json (authoritative).
 */
import ML_LOOKUP from './ml_predictions.json';

const _m01 = ML_LOOKUP?.metrics?.model_01_avg_r2 ?? 0.859; // KNN BET avg R²
const _m02 = ML_LOOKUP?.metrics?.model_02_r2     ?? 0.343; // SVR CO₂ Strategy-B R²

// ─── Selectable ML models for CO₂ Estimator ──────────────────────────────────
// DB Statistical Lookup always shows — these are ML-only choices.
// deployed:true  → prediction logic exists in mlPredictor.js
// needsExport:true → run ML/ml_export_additional_models.py first
export const CO2_MODELS = [
  {
    id:          'ridge',
    name:        'Ridge Regression',
    shortName:   'Ridge',
    desc:        'Trained Ridge (α=0.01) on 58 PEAK_RECORDS. 17-feature one-hot input: biomass + activator + pyrolysis conditions.',
    color:       '#3b82f6',
    r2:          0.4455,
    rmse:        1.16,
    badge:       'LOO-CV R²=0.45',
    tag:         'Linear · Always Available',
    tagStyle:    'bg-blue-500/10 text-blue-700 border-blue-500/20',
    pro:         'Trained on real data · always available · no grid needed',
    con:         'Linear — cannot capture non-linear activation interactions',
    status:      'deployed',
    deployed:    true,
    needsExport: false,
  },
  {
    id:          'knn_svr',
    name:        'KNN → SVR Pipeline',
    shortName:   'KNN→SVR',
    desc:        'Two-stage: KNN estimates BET surface area, SVR predicts CO₂ from BET features. Best cross-validated CO₂ model.',
    color:       '#a855f7',
    r2:          _m02,
    rmse:        1.55,
    badge:       `CV R²=${_m02}`,
    tag:         'Pipeline · Best CO₂ R²',
    tagStyle:    'bg-purple-500/10 text-purple-700 border-purple-500/20',
    pro:         'Best test-set R² for CO₂ · also outputs BET surface area',
    con:         'Pre-computed lookup grid (1,728 pts) · conditions outside grid interpolated',
    status:      'deployed',
    deployed:    true,
    needsExport: false,
  },
  {
    id:          'stacking',
    name:        'Stacking Ensemble',
    shortName:   'Stacking',
    desc:        'Meta-learner combining SVR + KNN + RF + XGBoost as base models with SVR as the meta-learner. Strategy-B CV R²=0.25.',
    color:       '#f97316',
    r2:          0.247,
    rmse:        1.3,
    badge:       'CV R²=0.25',
    tag:         'Ensemble · Deployed',
    tagStyle:    'bg-orange-500/10 text-orange-700 border-orange-500/20',
    pro:         'Deployed · ensemble reduces variance vs single models',
    con:         'Lower R² than SVR on this dataset · largest prediction grid',
    status:      'deployed',
    deployed:    true,
    needsExport: false,
  },
];

// ─── Strategy A comparison — within-isotherm pressure-point split ─────────────
// Strategy A: train/test split at individual pressure-point level.
// Points on the SAME isotherm appear in both train and test → inflated R²
// from data leakage (adjacent points share conditions/curve shape).
// Values here are from the Strategy-A training run (02a_compare.png).
// Shown for transparency only; NOT used for deployment decisions.
export const CO2_COMPARISON_A = [
  { name: 'KNN',        r2: 0.918, deployed: false, fill: '#94a3b8' },
  { name: 'XGBoost',   r2: 0.892, deployed: false, fill: '#94a3b8' },
  { name: 'Stacking',   r2: 0.873, deployed: false, fill: '#f97316' },
  { name: 'MLP',        r2: 0.851, deployed: false, fill: '#94a3b8' },
  { name: 'SVR',        r2: 0.829, deployed: true,  fill: '#a855f7' },
  { name: 'ExtraTrees', r2: 0.796, deployed: false, fill: '#94a3b8' },
  { name: 'ElasticNet', r2: 0.713, deployed: false, fill: '#94a3b8' },
  { name: 'Ridge',      r2: 0.682, deployed: true,  fill: '#3b82f6' },
  { name: 'Lasso',      r2: 0.664, deployed: false, fill: '#94a3b8' },
];

// ─── Full comparison — all trained CO₂ models ────────────────────────────────
// Deployed models use their actual validated metric; others from 02b_compare.png test-set.
// Ridge: deployed model uses LOO-CV R²=0.4455 (different feature set from comparison);
//        shown with its actual deployed R² so the chart reflects real platform performance.
export const CO2_COMPARISON = [
  { name: 'Ridge*',     r2: 0.4455,deployed: true,  fill: '#3b82f6', note: 'LOO-CV R² on PEAK_RECORDS (different feature set — see footnote)' },
  { name: 'SVR',        r2: 0.343, deployed: true,  fill: '#a855f7', note: 'Deployed (KNN→SVR pipeline, Strategy-B test-set)' },
  { name: 'Stacking',   r2: 0.247, deployed: true,  fill: '#f97316', note: 'Deployed (Strategy-B test-set)' },
  { name: 'KNN',        r2: 0.158, deployed: false, fill: '#94a3b8' },
  { name: 'ElasticNet', r2: 0.148, deployed: false, fill: '#94a3b8' },
  { name: 'Lasso',      r2: 0.140, deployed: false, fill: '#94a3b8' },
  { name: 'XGBoost',   r2: 0.082, deployed: false, fill: '#94a3b8' },
  { name: 'ExtraTrees', r2: 0.058, deployed: false, fill: '#94a3b8' },
  { name: 'MLP',        r2: 0.049, deployed: false, fill: '#94a3b8' },
];

// ─── Selectable ML models for Property Estimator ─────────────────────────────
// DB Statistical Lookup always shows — these are ML-only choices.
export const PROP_MODELS = [
  {
    id:          'knn',
    name:        'KNN Regressor',
    shortName:   'KNN',
    desc:        'K-Nearest Neighbours trained on pyrolysis conditions → BET surface area. Best validated R² in comparison.',
    color:       '#a855f7',
    r2:          _m01,
    rmse:        null,
    badge:       `BET R²=${_m01}`,
    tag:         'Best · Deployed',
    tagStyle:    'bg-purple-500/10 text-purple-700 border-purple-500/20',
    pro:         'Highest BET R² of all tested models · data-trained on Database',
    con:         'Small training set · pore volume prediction excluded (all R²<0.01)',
    status:      'deployed',
    deployed:    true,
    needsExport: false,
  },
  {
    id:          'elasticnet',
    name:        'ElasticNet',
    shortName:   'ElasticNet',
    desc:        'Elastic Net regularisation (L1+L2). Trained on same dataset as KNN. BET R²=0.61 on test split.',
    color:       '#06b6d4',
    r2:          0.6091,
    rmse:        1.25,
    badge:       'BET R²=0.61',
    tag:         'Linear · Deployed',
    tagStyle:    'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
    pro:         'Deployed · fast inference · interpretable linear weights',
    con:         'Linear — weaker than KNN on non-linear biomass/activation interactions',
    status:      'deployed',
    deployed:    true,
    needsExport: false,
  },
  {
    id:          'mlp',
    name:        'MLP Neural Network',
    shortName:   'MLP',
    desc:        'Multi-Layer Perceptron trained on pyrolysis conditions → BET surface area. R²=0.51 on test split.',
    color:       '#22c55e',
    r2:          0.506,
    rmse:        1.41,
    badge:       'BET R²=0.51',
    tag:         'Neural Net · Deployed',
    tagStyle:    'bg-green-500/10 text-green-700 border-green-500/20',
    pro:         'Deployed · captures non-linear patterns · no lookup grid needed',
    con:         'Lower R² than KNN on this dataset · sensitive to hyperparameters',
    status:      'deployed',
    deployed:    true,
    needsExport: false,
  },
];

// ─── Full comparison — all trained BET Surface Area models ────────────────────
// Source: ML/outputs/01_compare_sa.png (test-set R²).
// KNN R² from authoritative JSON: model_01_avg_r2=0.859 (larger dataset incl. non-isotherm).
// MLP/ElasticNet deployed after running ml_export_additional_models.py.
export const SA_COMPARISON = [
  { name: 'KNN',        r2: _m01,  deployed: true, fill: '#a855f7', note: 'Best — R²=0.859 from metrics JSON' },
  { name: 'ElasticNet', r2: 0.6091,deployed: true, fill: '#06b6d4', note: 'Deployed — actual test-split R²' },
  { name: 'MLP',        r2: 0.506, deployed: true, fill: '#22c55e', note: 'Deployed — actual test-split R²' },
  { name: 'Ridge',        r2: 0.650, deployed: false, fill: '#94a3b8' },
  { name: 'XGBoost',     r2: 0.570, deployed: false, fill: '#94a3b8' },
  { name: 'SVR',          r2: 0.540, deployed: false, fill: '#94a3b8' },
  { name: 'Lasso',        r2: 0.520, deployed: false, fill: '#94a3b8' },
  { name: 'RandomForest', r2: 0.380, deployed: false, fill: '#94a3b8' },
];

// Pore Volume excluded — all models R²≈0 (insufficient data / target too sparse)
export const PV_NOTE = 'Pore Volume models omitted — all R²<0.01 in training (insufficient labelled records).';

