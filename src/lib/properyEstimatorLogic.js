/**
 * Phase 1 → 2: Property Estimator Logic
 * Given: Biomass + PyroTemp + ResidenceTime + Activator
 * Returns: Estimated BET Surface Area, Pore Volume, and Elemental ranges
 */
import { DB44_RECORDS } from './database44';
import { elasticnetSaLookup, mlPipelineLookup, mlpSaLookup } from './mlPredictor';

// Approximate CHNS-O data by biomass (from literature — not in DB44 directly)
const ELEMENTAL_PROFILES = {
  'Corn straw': {
    C: { base: 62, activated: 78 }, H: { base: 3.2, activated: 1.8 },
    O: { base: 28, activated: 14 }, N: { base: 1.1, activated: 0.8 }, S: { base: 0.3, activated: 0.2 },
  },
  'Coffee ground-based': {
    C: { base: 68, activated: 82 }, H: { base: 2.8, activated: 1.5 },
    O: { base: 22, activated: 11 }, N: { base: 2.5, activated: 1.8 }, S: { base: 0.1, activated: 0.1 },
  },
  'Pine sawdust powders': {
    C: { base: 72, activated: 84 }, H: { base: 2.5, activated: 1.2 },
    O: { base: 23, activated: 13 }, N: { base: 0.4, activated: 0.3 }, S: { base: 0.05, activated: 0.04 },
  },
  'Bamboo': {
    C: { base: 70, activated: 83 }, H: { base: 2.7, activated: 1.3 },
    O: { base: 24, activated: 13 }, N: { base: 0.5, activated: 0.4 }, S: { base: 0.08, activated: 0.06 },
  },
  'Banana straw': {
    C: { base: 58, activated: 75 }, H: { base: 3.5, activated: 1.9 },
    O: { base: 32, activated: 18 }, N: { base: 1.2, activated: 0.9 }, S: { base: 0.15, activated: 0.10 },
  },
  'Pomelo peel': {
    C: { base: 55, activated: 72 }, H: { base: 3.8, activated: 2.0 },
    O: { base: 35, activated: 20 }, N: { base: 0.9, activated: 0.7 }, S: { base: 0.12, activated: 0.09 },
  },
  'Sugarcane bagasse': {
    C: { base: 60, activated: 76 }, H: { base: 3.3, activated: 1.7 },
    O: { base: 30, activated: 17 }, N: { base: 0.7, activated: 0.5 }, S: { base: 0.10, activated: 0.08 },
  },
  'Cotton straw': {
    C: { base: 63, activated: 79 }, H: { base: 3.0, activated: 1.6 },
    O: { base: 27, activated: 15 }, N: { base: 1.5, activated: 1.1 }, S: { base: 0.20, activated: 0.14 },
  },
};

export function estimateProperties({ biomass, pyroTemp, residenceTime, activator }) {
  // Filter matching records (same biomass + activator, nearest pyro temp)
  const biomasRecords = DB44_RECORDS.filter(r => r.biomass === biomass && r.activator === activator && r.blend === 'Non');

  let matched = biomasRecords;

  // If no exact activator match, fall back to same biomass
  if (matched.length === 0) {
    matched = DB44_RECORDS.filter(r => r.biomass === biomass && r.blend === 'Non');
  }

  // Sort by combined proximity: pyroTemp (primary 70%) + residenceTime (secondary 30%)
  matched = matched.sort((a, b) => {
    const tempA = Math.abs(a.pyroTemp - pyroTemp) / 100;
    const tempB = Math.abs(b.pyroTemp - pyroTemp) / 100;
    const rtA   = Math.abs((a.residenceTime || 60) - residenceTime) / 100;
    const rtB   = Math.abs((b.residenceTime || 60) - residenceTime) / 100;
    return (tempA * 0.7 + rtA * 0.3) - (tempB * 0.7 + rtB * 0.3);
  });

  // Take top 5 closest
  const closest = matched.slice(0, Math.min(5, matched.length));

  if (closest.length === 0) {
    return null;
  }

  const surfaceAreas = closest.map(r => r.surfaceArea);
  // Filter out null/undefined/zero pore volumes — these are truly missing data, not zero
  const validPoreVols = closest.map(r => r.poreVolume).filter(v => v != null && v > 0);

  const minSA = Math.min(...surfaceAreas);
  const maxSA = Math.max(...surfaceAreas);
  const meanSA = surfaceAreas.reduce((a, b) => a + b, 0) / surfaceAreas.length;

  // Only compute pore volume stats if we have valid data
  const hasPoreVolData = validPoreVols.length > 0;
  const minPV = hasPoreVolData ? Math.min(...validPoreVols) : null;
  const maxPV = hasPoreVolData ? Math.max(...validPoreVols) : null;
  const meanPV = hasPoreVolData ? validPoreVols.reduce((a, b) => a + b, 0) / validPoreVols.length : null;

  // Elemental profile
  const ep = ELEMENTAL_PROFILES[biomass] || ELEMENTAL_PROFILES['Corn straw'];
  const isActivated = activator && activator !== 'Non';
  const tempFactor = Math.min(1, (pyroTemp - 300) / 600);       // 0–1: temp effect
  const rtFactor   = Math.min(1, (residenceTime - 10) / 290);   // 0–1: longer RT → more carbonization

  const elem = {
    C: parseFloat((ep.C.base + (isActivated ? ep.C.activated - ep.C.base : 0) * 0.6 + tempFactor * 5 + rtFactor * 2).toFixed(1)),
    H: parseFloat((ep.H.base - tempFactor * 0.8 - (isActivated ? 0.5 : 0) - rtFactor * 0.3).toFixed(1)),
    O: parseFloat((ep.O.base - tempFactor * 8  - (isActivated ? 4 : 0) - rtFactor * 2).toFixed(1)),
    N: parseFloat((ep.N.base - tempFactor * 0.3 - rtFactor * 0.1).toFixed(2)),
    S: parseFloat((ep.S.base).toFixed(2)),
  };

  const dataPointsUsed = closest.length;
  const confidence = dataPointsUsed >= 4 ? 'High' : dataPointsUsed >= 2 ? 'Moderate' : 'Indicative';

  return {
    surfaceArea: { min: minSA, max: maxSA, mean: parseFloat(meanSA.toFixed(1)) },
    // null when no matched records have pore volume data
    poreVolume: hasPoreVolData ? {
      min: parseFloat((minPV * 1000).toFixed(3)),
      max: parseFloat((maxPV * 1000).toFixed(3)),
      mean: parseFloat((meanPV * 1000).toFixed(3)),
      recordsWithData: validPoreVols.length,
    } : null,
    elemental: elem,
    dataPointsUsed,
    confidence,
    matchedRecords: closest,
  };
}

const SHAP_BASELINE = {
  biomass: 'Corn straw',
  pyroTemp: 600,
  residenceTime: 60,
  activator: 'Non',
};

const MODEL_LOOKUPS = {
  knn: mlPipelineLookup,
  elasticnet: elasticnetSaLookup,
  mlp: mlpSaLookup,
};

const MODEL_NAMES = {
  knn: 'KNN Regressor',
  elasticnet: 'ElasticNet',
  mlp: 'MLP Neural Network',
};

function getSelectedModelPrediction(modelId, params) {
  const lookup = MODEL_LOOKUPS[modelId];
  if (!lookup) return null;

  const result = lookup({
    biomass: params.biomass,
    temperature: params.pyroTemp,
    activator: params.activator,
    residenceTime: params.residenceTime,
    heatingRate: 10,
  });

  if (!result) return null;
  return Number(result.sa ?? result.surfaceArea ?? result.value ?? NaN);
}

function createEvaluationKey(mask, features) {
  return features.map((feature, index) => (mask & (1 << index) ? feature.key : '-')).join('|');
}

function countBits(mask) {
  let count = 0;
  let value = mask;
  while (value > 0) {
    value &= value - 1;
    count += 1;
  }
  return count;
}

/**
 * Exact SHAP-style decomposition for the deployed BET surface-area model.
 * Uses a fixed neutral reference input and evaluates all feature subsets.
 */
export function buildPropertyShapAnalysis({ modelId, params }) {
  const lookup = MODEL_LOOKUPS[modelId];
  if (!lookup) return null;

  const prediction = getSelectedModelPrediction(modelId, params);
  if (!Number.isFinite(prediction)) return null;

  const features = [
    { key: 'biomass', label: 'Biomass Species', value: params.biomass, baseline: SHAP_BASELINE.biomass },
    { key: 'pyroTemp', label: 'Pyrolysis Temperature', value: Number(params.pyroTemp), baseline: SHAP_BASELINE.pyroTemp },
    { key: 'residenceTime', label: 'Residence Time', value: Number(params.residenceTime), baseline: SHAP_BASELINE.residenceTime },
    { key: 'activator', label: 'Activation Method', value: params.activator, baseline: SHAP_BASELINE.activator },
  ];

  const evalCache = new Map();
  const featureCount = features.length;
  const factorial = [1, 1, 2, 6, 24, 120];

  const evaluate = (mask) => {
    const key = createEvaluationKey(mask, features);
    if (evalCache.has(key)) return evalCache.get(key);

    const current = {
      biomass: SHAP_BASELINE.biomass,
      pyroTemp: SHAP_BASELINE.pyroTemp,
      residenceTime: SHAP_BASELINE.residenceTime,
      activator: SHAP_BASELINE.activator,
    };

    features.forEach((feature, index) => {
      if (mask & (1 << index)) {
        current[feature.key] = feature.value;
      }
    });

    const value = getSelectedModelPrediction(modelId, current);
    evalCache.set(key, value);
    return value;
  };

  const baseline = evaluate(0);
  if (!Number.isFinite(baseline)) return null;

  const shapValues = features.map((feature, featureIndex) => {
    let contribution = 0;

    for (let mask = 0; mask < (1 << featureCount); mask += 1) {
      if (mask & (1 << featureIndex)) continue;

      const subsetSize = countBits(mask);
      const weight = factorial[subsetSize] * factorial[featureCount - subsetSize - 1] / factorial[featureCount];
      const withoutFeature = evaluate(mask);
      const withFeature = evaluate(mask | (1 << featureIndex));

      if (!Number.isFinite(withoutFeature) || !Number.isFinite(withFeature)) {
        continue;
      }

      contribution += weight * (withFeature - withoutFeature);
    }

    return {
      key: feature.key,
      label: feature.label,
      value: +contribution.toFixed(2),
      absValue: +Math.abs(contribution).toFixed(2),
      sign: contribution >= 0 ? 'positive' : 'negative',
      actual: feature.value,
      baseline: feature.baseline,
    };
  }).sort((a, b) => b.absValue - a.absValue);

  const totalAbs = shapValues.reduce((sum, item) => sum + item.absValue, 0) || 1;
  const totalEffect = prediction - baseline;
  const dominant = shapValues[0];
  const runnerUp = shapValues[1];

  return {
    modelId,
    modelName: MODEL_NAMES[modelId] || 'Selected Model',
    baseline: +baseline.toFixed(2),
    prediction: +prediction.toFixed(2),
    delta: +totalEffect.toFixed(2),
    totalAbs: +totalAbs.toFixed(2),
    shapValues: shapValues.map(item => ({
      ...item,
      share: +((item.absValue / totalAbs) * 100).toFixed(1),
    })),
    summary: dominant
      ? `${dominant.label} is the strongest driver${runnerUp ? `, followed by ${runnerUp.label}` : ''}.`
      : 'No dominant driver identified.',
    methodNote: `Exact SHAP-style subset decomposition on the deployed ${MODEL_NAMES[modelId] || modelId} lookup surface using 16 feature combinations.`,
  };
}

/**
 * Phase 2 Reverse: Property Advisor Logic
 * Given: Target surface area (min), target pore volume (min), optional biomass
 * Returns: Ranked conditions that historically achieved those targets
 */
export function adviseConditionsForProperties({ targetSurfaceArea, targetPoreVolume, biomass }) {
  // Convert poreVolume from cm³/g to m³/kg (* 0.001) for DB comparison
  const pvThreshold = targetPoreVolume ? targetPoreVolume / 1000 : 0;

  let candidates = DB44_RECORDS.filter(r => r.blend === 'Non');
  if (biomass && biomass !== 'All') {
    candidates = candidates.filter(r => r.biomass === biomass);
  }

  // Filter by property thresholds
  const matching = candidates.filter(r =>
    r.surfaceArea >= (targetSurfaceArea || 0) &&
    r.poreVolume >= pvThreshold
  );

  if (matching.length === 0) {
    // Relax criteria - return closest
    const sorted = candidates.sort((a, b) => {
      const scoreA = a.surfaceArea / (targetSurfaceArea || 1) + a.poreVolume / (pvThreshold || 0.0001);
      const scoreB = b.surfaceArea / (targetSurfaceArea || 1) + b.poreVolume / (pvThreshold || 0.0001);
      return scoreB - scoreA;
    });
    return { results: buildConditionGroups(sorted.slice(0, 10)), relaxed: true };
  }

  return { results: buildConditionGroups(matching), relaxed: false };
}

function buildConditionGroups(records) {
  const groups = {};
  for (const r of records) {
    const key = `${r.biomass}|${r.activator}|${r.pyroTemp}`;
    if (!groups[key]) {
      groups[key] = { biomass: r.biomass, activator: r.activator, pyroTemp: r.pyroTemp, activationType: r.activationType, records: [] };
    }
    groups[key].records.push(r);
  }

  return Object.values(groups).map(g => {
    const sas = g.records.map(r => r.surfaceArea);
    const pvs = g.records.map(r => r.poreVolume);
    const co2s = g.records.map(r => r.co2Uptake);
    return {
      biomass: g.biomass,
      activator: g.activator,
      activationType: g.activationType,
      pyroTemp: g.pyroTemp,
      surfaceArea: { min: Math.min(...sas), max: Math.max(...sas), mean: parseFloat((sas.reduce((a, b) => a + b, 0) / sas.length).toFixed(0)) },
      poreVolume: { mean: parseFloat(((pvs.reduce((a, b) => a + b, 0) / pvs.length) * 1000).toFixed(3)) },
      co2Uptake: { mean: parseFloat((co2s.reduce((a, b) => a + b, 0) / co2s.length).toFixed(2)), max: parseFloat(Math.max(...co2s).toFixed(2)) },
      count: g.records.length,
    };
  }).sort((a, b) => b.surfaceArea.mean - a.surfaceArea.mean);
}