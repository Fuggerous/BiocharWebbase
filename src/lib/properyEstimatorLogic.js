/**
 * Phase 1 → 2: Property Estimator Logic
 * Given: Biomass + PyroTemp + ResidenceTime + Activator
 * Returns: Estimated BET Surface Area, Pore Volume, and Elemental ranges
 */
import { DB44_RECORDS } from './database44';

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
};

export function estimateProperties({ biomass, pyroTemp, residenceTime, activator }) {
  // Filter matching records (same biomass + activator, nearest pyro temp)
  const biomasRecords = DB44_RECORDS.filter(r => r.biomass === biomass && r.activator === activator && r.blend === 'Base');

  let matched = biomasRecords;

  // If no exact activator match, fall back to same biomass
  if (matched.length === 0) {
    matched = DB44_RECORDS.filter(r => r.biomass === biomass && r.blend === 'Base');
  }

  // Sort by proximity to requested pyroTemp
  matched = matched.sort((a, b) => Math.abs(a.pyroTemp - pyroTemp) - Math.abs(b.pyroTemp - pyroTemp));

  // Take top 5 closest
  const closest = matched.slice(0, Math.min(5, matched.length));

  if (closest.length === 0) {
    return null;
  }

  const surfaceAreas = closest.map(r => r.surfaceArea);
  const poreVols = closest.map(r => r.poreVolume);

  const minSA = Math.min(...surfaceAreas);
  const maxSA = Math.max(...surfaceAreas);
  const meanSA = surfaceAreas.reduce((a, b) => a + b, 0) / surfaceAreas.length;

  const minPV = Math.min(...poreVols);
  const maxPV = Math.max(...poreVols);
  const meanPV = poreVols.reduce((a, b) => a + b, 0) / poreVols.length;

  // Elemental profile
  const ep = ELEMENTAL_PROFILES[biomass] || ELEMENTAL_PROFILES['Corn straw'];
  const isActivated = activator && activator !== 'Non';
  const tempFactor = Math.min(1, (pyroTemp - 300) / 600); // 0–1 scale

  const elem = {
    C: parseFloat((ep.C.base + (isActivated ? ep.C.activated - ep.C.base : 0) * 0.6 + tempFactor * 5).toFixed(1)),
    H: parseFloat((ep.H.base - tempFactor * 0.8 - (isActivated ? 0.5 : 0)).toFixed(1)),
    O: parseFloat((ep.O.base - tempFactor * 8 - (isActivated ? 4 : 0)).toFixed(1)),
    N: parseFloat((ep.N.base - tempFactor * 0.3).toFixed(2)),
    S: parseFloat((ep.S.base).toFixed(2)),
  };

  const dataPointsUsed = closest.length;
  const confidence = dataPointsUsed >= 4 ? 'High' : dataPointsUsed >= 2 ? 'Moderate' : 'Indicative';

  return {
    surfaceArea: { min: minSA, max: maxSA, mean: parseFloat(meanSA.toFixed(1)) },
    poreVolume: {
      min: parseFloat((minPV * 1000).toFixed(3)),
      max: parseFloat((maxPV * 1000).toFixed(3)),
      mean: parseFloat((meanPV * 1000).toFixed(3)),
    },
    elemental: elem,
    dataPointsUsed,
    confidence,
    matchedRecords: closest,
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

  let candidates = DB44_RECORDS.filter(r => r.blend === 'Base');
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