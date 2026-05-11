/**
 * Materials Advisor Engine – Reverse Lookup
 * Given a desired CO2 uptake, finds the best-matching production parameters
 * from the 44Database records.
 */

import { DB44_RECORDS } from '../../lib/database44';

function distScore(record, target) {
  return Math.abs(record.co2Uptake - target);
}

// Blend feasibility scores matching actual DB blend values
const BLEND_FEASIBILITY = {
  'Non':     1.0,
  '0.5PKBC': 0.9,
  '0.5TKBC': 0.9,
  '20PKBC':  0.8,
  '20TKBC':  0.8,
};

function blendFeasibilityFactor(blend) {
  return BLEND_FEASIBILITY[blend] ?? 0.85;
}

/**
 * Multi-objective sort weight computation.
 * Returns a composite score (lower = better rank).
 */
function objectiveScore(g, targetCO2, secondaryObjective, tertiaryObjective) {
  const closeness = Math.abs(g.meanCO2 - targetCO2); // primary
  let secondary = 0;
  let tertiary = 0;

  if (secondaryObjective === 'energy') {
    // Minimize pyroTemp — normalize 400–900°C → 0–1
    secondary = (g.pyroTemp - 400) / 500;
  } else if (secondaryObjective === 'cost') {
    // Prefer physical/no activation
    const costPenalty = { KOH: 0.8, K2CO3: 0.6, 'KOH-CO2': 1.0, CO2: 0.1, LiCl: 1.2, None: 0.0, Non: 0.0 };
    secondary = (costPenalty[g.activator] ?? 0.5);
  } else if (secondaryObjective === 'residenceTime') {
    // Minimize avg residence time — normalize 10–300 min → 0–1
    secondary = (g.avgResidenceTime - 10) / 290;
  } else if (secondaryObjective === 'poreVolume') {
    // Maximize pore volume — invert so lower composite = better
    secondary = 1 - Math.min(1, g.avgPoreVolume / 0.0016); // 0.0016 m³/kg ≈ max in DB
  }

  if (tertiaryObjective === 'energy') {
    tertiary = (g.pyroTemp - 400) / 500;
  } else if (tertiaryObjective === 'cost') {
    const costPenalty = { KOH: 0.8, K2CO3: 0.6, 'KOH-CO2': 1.0, CO2: 0.1, LiCl: 1.2, None: 0.0, Non: 0.0 };
    tertiary = (costPenalty[g.activator] ?? 0.5);
  } else if (tertiaryObjective === 'residenceTime') {
    tertiary = (g.avgResidenceTime - 10) / 290;
  } else if (tertiaryObjective === 'poreVolume') {
    tertiary = 1 - Math.min(1, g.avgPoreVolume / 0.0016);
  }

  // Weighted composite: primary closeness dominates (60%), secondary (30%), tertiary (10%)
  return closeness * 0.6 + secondary * 0.3 + tertiary * 0.1;
}

export function reverseQuery({ targetCO2, biomass = 'All', tolerance = 0.5, secondaryObjective = 'none', tertiaryObjective = 'none' }) {
  const records = biomass === 'All'
    ? DB44_RECORDS
    : DB44_RECORDS.filter(r => r.biomass === biomass);

  const inBand = records.filter(r => Math.abs(r.co2Uptake - targetCO2) <= tolerance);

  const groups = {};
  inBand.forEach(r => {
    const key = `${r.activator}__${r.pyroTemp}`;
    if (!groups[key]) {
      groups[key] = {
        activator: r.activator,
        activationType: r.activationType,
        pyroTemp: r.pyroTemp,
        biomassSet: new Set(),
        blendSet: new Set(),
        co2Values: [],
        surfaceAreas: [],
        poreVolumes: [],
        residenceTimes: [],
        records: [],
      };
    }
    groups[key].biomassSet.add(r.biomass);
    groups[key].blendSet.add(r.blend || 'Pure');
    groups[key].co2Values.push(r.co2Uptake);
    groups[key].surfaceAreas.push(r.surfaceArea);
    groups[key].poreVolumes.push(r.poreVolume);
    groups[key].residenceTimes.push(r.residenceTime);
    groups[key].records.push(r);
  });

  const results = Object.values(groups).map(g => {
    const mean = g.co2Values.reduce((s, v) => s + v, 0) / g.co2Values.length;
    const min = Math.min(...g.co2Values);
    const max = Math.max(...g.co2Values);
    const avgSurface = g.surfaceAreas.reduce((s, v) => s + v, 0) / g.surfaceAreas.length;
    const avgPoreVolume = g.poreVolumes.reduce((s, v) => s + v, 0) / g.poreVolumes.length;
    const avgResidenceTime = g.residenceTimes.reduce((s, v) => s + v, 0) / g.residenceTimes.length;
    const closeness = Math.abs(mean - targetCO2);
    const blends = [...g.blendSet];
    const blendScore = blends.reduce((s, b) => s + blendFeasibilityFactor(b), 0) / blends.length;

    const entry = {
      activator: g.activator === 'Non' ? 'None' : g.activator,
      activationType: g.activationType === 'Non' ? 'None' : g.activationType,
      pyroTemp: g.pyroTemp,
      biomasses: [...g.biomassSet],
      blends,
      blendScore,
      meanCO2: +mean.toFixed(3),
      minCO2: +min.toFixed(3),
      maxCO2: +max.toFixed(3),
      avgSurface: +avgSurface.toFixed(0),
      avgPoreVolume: +avgPoreVolume.toFixed(6),
      avgResidenceTime: +avgResidenceTime.toFixed(1),
      count: g.co2Values.length,
      closeness,
    };
    entry._compositeScore = objectiveScore(entry, targetCO2, secondaryObjective, tertiaryObjective);
    return entry;
  }).sort((a, b) => a._compositeScore - b._compositeScore);

  if (results.length === 0) {
    const nearest = [...records]
      .sort((a, b) => distScore(a, targetCO2) - distScore(b, targetCO2))
      .slice(0, 5);
    return {
      mode: 'nearest',
      tolerance,
      secondaryObjective,
      tertiaryObjective,
      results: nearest.map(r => ({
        activator: r.activator === 'Non' ? 'None' : r.activator,
        activationType: r.activationType === 'Non' ? 'None' : r.activationType,
        pyroTemp: r.pyroTemp,
        biomasses: [r.biomass],
        blends: [r.blend || 'Pure'],
        blendScore: blendFeasibilityFactor(r.blend),
        meanCO2: r.co2Uptake,
        minCO2: r.co2Uptake,
        maxCO2: r.co2Uptake,
        avgSurface: r.surfaceArea,
        avgPoreVolume: r.poreVolume,
        avgResidenceTime: r.residenceTime,
        count: 1,
        closeness: Math.abs(r.co2Uptake - targetCO2),
      })),
    };
  }

  return { mode: 'match', tolerance, secondaryObjective, tertiaryObjective, results: results.slice(0, 6) };
}

// For the coverage chart
export function getCoverageMatrix() {
  const activators = ['KOH', 'K2CO3', 'KOH-CO2', 'CO2', 'LiCl', 'None'];
  const temps = [400, 550, 600, 700, 800];
  return activators.map(act => {
    const row = { activator: act };
    temps.forEach(t => {
      const recs = DB44_RECORDS.filter(r =>
        (r.activator === act || (act === 'None' && r.activator === 'Non')) &&
        r.pyroTemp === t
      );
      row[`t${t}`] = recs.length > 0
        ? +(recs.reduce((s, r) => s + r.co2Uptake, 0) / recs.length).toFixed(2)
        : null;
    });
    return row;
  });
}