// @ts-nocheck
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useLang } from '../lib/LanguageContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DatabaseCharts from '../components/database/DatabaseCharts';
import CorrelationTabs from '../components/database/CorrelationTabs';
import AdvancedFilters from '../components/database/AdvancedFilters';
import ComparisonTool from '../components/database/ComparisonTool';
import { motion } from 'framer-motion';
import { Database as DbIcon, Download, FlaskConical, Layers } from 'lucide-react';
import { TOTAL_DATA_POINTS, DB_OVERALL_MAX, TEMPERATURE_STATS } from '../lib/biocharKnowledgeBase';
import { DB44_RECORDS, BIOMASS_COLORS, BLEND_COLORS, ADSORPTION_TEMP_LIST, BIOMASS_LIST, ACTIVATOR_LIST, DEFAULT_FILTERS, BIOMASS_SPECIES_MAP, SPECIES_COLORS } from '../lib/database44';
import BlendingAnalysis from '../components/database/BlendingAnalysis';



// Reverse lookup: biomass part → parent species (for table badges + stable colors)
const BIOMASS_TO_SPECIES = Object.entries(BIOMASS_SPECIES_MAP).reduce((acc, [species, parts]) => {
  parts.forEach(p => { acc[p] = species; });
  return acc;
}, {});
function speciesDotColor(biomass) {
  return BIOMASS_COLORS[biomass] ?? SPECIES_COLORS[BIOMASS_TO_SPECIES[biomass]] ?? '#94a3b8';
}

// Statistical outlier detection — filter null co2Uptake (non-isotherm records)
const ALL_CO2 = DB44_RECORDS.map(r => r.co2Uptake).filter(v => v != null);
const CO2_MEAN = ALL_CO2.reduce((s, v) => s + v, 0) / ALL_CO2.length;
const CO2_STD = Math.sqrt(ALL_CO2.reduce((s, v) => s + (v - CO2_MEAN) ** 2, 0) / ALL_CO2.length);
function isOutlier(val) { return val != null && Math.abs(val - CO2_MEAN) > 1.8 * CO2_STD; }

// Multivariate anomaly detection (Isolation Forest–style z² scoring)
const ANOM_FEATURES = ['pyroTemp', 'residenceTime', 'surfaceArea', 'poreVolume', 'co2Uptake', 'pressure'];
const ANOM_STATS = {};
ANOM_FEATURES.forEach(f => {
  // Filter nulls — non-isotherm records may have null co2Uptake/poreVolume/pressure
  const vals = DB44_RECORDS.map(r => r[f]).filter(v => v != null);
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  const std = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length) || 1;
  ANOM_STATS[f] = { mean, std };
});
const ANOMALY_MAP = new Map(DB44_RECORDS.map(r => {
  const zSq = ANOM_FEATURES.reduce((s, f) => s + ((r[f] - ANOM_STATS[f].mean) / ANOM_STATS[f].std) ** 2, 0);
  const highBetLowCO2 = r.surfaceArea > ANOM_STATS.surfaceArea.mean + ANOM_STATS.surfaceArea.std
    && r.co2Uptake < ANOM_STATS.co2Uptake.mean - 0.5 * ANOM_STATS.co2Uptake.std;
  const lowPoreHighCO2 = r.poreVolume < ANOM_STATS.poreVolume.mean - 0.8 * ANOM_STATS.poreVolume.std
    && r.co2Uptake > ANOM_STATS.co2Uptake.mean + ANOM_STATS.co2Uptake.std;
  const reasons = [...(highBetLowCO2 ? ['High BET/Low CO₂'] : []), ...(lowPoreHighCO2 ? ['Low Pore/High CO₂'] : [])];
  const severity = zSq > 14 || reasons.length >= 2 ? 'high' : zSq > 8 || reasons.length === 1 ? 'medium' : null;
  return [r.id, { severity, zSq: +zSq.toFixed(1), reasons }];
}));

export default function Database() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const { lang } = useLang();
  const warnedRef = useRef(false);
  useEffect(() => {
    if (lang === 'th' && !warnedRef.current) {
      warnedRef.current = true;
      window.alert('🇹🇭 Thai version is not available at this moment 🙏');
    }
  }, [lang]);

  const filtered = useMemo(() => {
    return DB44_RECORDS.filter(r => {
      // Data type filter
      if (filters.dataType === 'isotherm' && !r.isIsotherm) return false;
      if (filters.dataType === 'bet' && r.isIsotherm) return false;
      // Biomass filter (individual parts)
      if (filters.biomass.length > 0 && !filters.biomass.includes(r.biomass)) return false;
      if (filters.activator.length > 0 && !filters.activator.includes(r.activator)) return false;
      if (filters.activationType.length > 0 && !filters.activationType.includes(r.activationType)) return false;
      if (filters.blend.length > 0 && !filters.blend.includes(r.blend)) return false;
      if (filters.adsorpTemp.length > 0 && !filters.adsorpTemp.includes(String(r.adsorpTemp))) return false;
      if (r.surfaceArea != null && (r.surfaceArea < filters.surfaceAreaRange[0] || r.surfaceArea > filters.surfaceAreaRange[1])) return false;
      if (r.poreVolume != null && (r.poreVolume * 1e6 < filters.poreVolRange[0] || r.poreVolume * 1e6 > filters.poreVolRange[1])) return false;
      if (r.co2Uptake != null && (r.co2Uptake < filters.co2Range[0] || r.co2Uptake > filters.co2Range[1])) return false;
      if (r.pyroTemp < filters.pyroTempRange[0] || r.pyroTemp > filters.pyroTempRange[1]) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!r.biomass.toLowerCase().includes(q) && !r.activator.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  const handleExportCSV = useCallback(() => {
    const cols = ['id','isothermId','biomass','pyroTemp','residenceTime','heatingRate','activator','activationType','activationTemp','blend','surfaceArea','poreVolume','adsorpTemp','pressure','co2Uptake','C_cha','H_cha','O_cha','N_cha','S_cha'];
    const escape = v => (v == null ? '' : String(v).includes(',') ? `"${v}"` : String(v));
    const lines = [cols.join(','), ...filtered.map(r => cols.map(c => escape(r[c])).join(','))];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `44Database_filtered_${filtered.length}records.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const activationBadgeClass = {
    Chemical: 'bg-green-500/10 text-green-600',
    Combined:  'bg-purple-500/10 text-purple-600',
    Physical:  'bg-amber-500/10 text-amber-600',
    Non:       'bg-muted text-muted-foreground',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 pt-24 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[600px] h-24 bg-green-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <DbIcon className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-blue-400 text-sm font-medium">Scientific Database · 44Database.xlsx</span>
            </div>
            <h1 className="font-space font-bold text-4xl lg:text-5xl text-white mb-3">
              Biochar <span className="text-green-400">Dataset Explorer</span>{' '}
              <span className="text-lg font-normal text-slate-400 align-middle">v1.2</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mb-6">
              {TOTAL_DATA_POINTS.toLocaleString()} peer-reviewed experimental records across {BIOMASS_LIST.length} biomass species and {ACTIVATOR_LIST.filter(a => a !== 'Non').length} activation methods. Interactive multidimensional correlation analysis.
            </p>
            {/* Quick stats */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Biomass Species',   value: String(BIOMASS_LIST.length) },
                { label: 'Activators',         value: String(ACTIVATOR_LIST.filter(a => a !== 'Non').length) },
                { label: 'Pyrolysis Temps',    value: String(Object.keys(TEMPERATURE_STATS).length) },
                { label: 'Adsorption Temps',   value: String(ADSORPTION_TEMP_LIST.length) },
                { label: 'Max CO₂ (mmol/g)',   value: DB_OVERALL_MAX.toFixed(2) },
              ].map(s => (
                <div key={s.label} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-green-400 font-space font-bold text-lg leading-tight">{s.value}</div>
                  <div className="text-slate-400 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Advanced Sidebar Filters ── */}
          <aside className="w-full lg:w-60 flex-shrink-0">
            <AdvancedFilters filters={filters} onChange={setFilters} resultCount={filtered.length} totalCount={DB44_RECORDS.length} />
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 space-y-6 min-w-0">

            {/* Overview Charts (Feedstock Distribution + Avg CO2) */}
            <DatabaseCharts records={filtered} biomassFilter={filters.biomass} />

            {/* Co-Pyrolysis / Blending Analysis */}
            <BlendingAnalysis records={filtered} />

            {/* Correlation Analysis Tabs */}
            <CorrelationTabs records={filtered} />

            {/* Data Table */}
            <div className="glass-card rounded-2xl p-5 border border-border">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
                <div>
                  <h3 className="font-space font-semibold text-base flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-green-500" /> Dataset Records
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {filtered.length} records shown · {TOTAL_DATA_POINTS.toLocaleString()} total in 44Database
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Quick data-type tab strip */}
                  <div className="flex gap-1 p-1 bg-muted rounded-lg">
                    {[
                      { key: 'all',      label: 'All',      count: DB44_RECORDS.length },
                      { key: 'isotherm', label: 'Isotherm', count: DB44_RECORDS.filter(r => r.isIsotherm).length },
                      { key: 'bet',      label: 'BET Only', count: DB44_RECORDS.filter(r => !r.isIsotherm).length },
                    ].map(opt => (
                      <button key={opt.key}
                        onClick={() => setFilters(f => ({ ...f, dataType: opt.key }))}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                          filters.dataType === opt.key
                            ? 'bg-card shadow-sm text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}>
                        {opt.label}
                        <span className="ml-1 text-[9px] text-muted-foreground/60">{opt.count}</span>
                      </button>
                    ))}
                  </div>
                  <ComparisonTool />
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-green text-white text-xs font-semibold hover:scale-105 transition-transform"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV ({filtered.length})
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto overflow-y-auto max-h-96" style={{ maxHeight: '400px' }}>
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
                    <tr className="border-b border-border">
                      {['#', 'Biomass Species', 'Pyro Temp', 'Res. Time', 'Activator', 'Act. Type', 'Blend / Composite', 'BET Area (m²/g)', 'Pore Vol (m³/kg)', 'Ads Temp', 'Pressure', 'CO₂ (mmol/g)', 'Anomaly'].map(h => (
                        <th key={h} className="text-left py-3 px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={13} className="py-12 text-center text-muted-foreground text-sm">
                        No records match the current filters.
                      </td></tr>
                    ) : filtered.map((row, i) => (
                      <tr key={row.id} className={`border-b border-border/50 hover:bg-muted/40 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                        <td className="py-2.5 px-2 font-mono text-xs text-blue-500">{String(row.id).padStart(2,'0')}</td>
                        <td className="py-2.5 px-2 text-xs font-medium">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: speciesDotColor(row.biomass) }} />
                            <span>
                              <span className="block leading-tight">{row.biomass}</span>
                              {BIOMASS_TO_SPECIES[row.biomass] && (
                                <span className="text-[9px] font-semibold px-1 py-0 rounded mt-0.5 inline-block"
                                  style={{ background: `${speciesDotColor(row.biomass)}22`, color: speciesDotColor(row.biomass) }}>
                                  {BIOMASS_TO_SPECIES[row.biomass]}
                                </span>
                              )}
                            </span>
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-xs">{row.pyroTemp}°C</td>
                        <td className="py-2.5 px-2 text-xs text-muted-foreground">{row.residenceTime} min</td>
                        <td className="py-2.5 px-2">
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${row.activator === 'Non' ? 'bg-muted text-muted-foreground' : 'bg-blue-500/10 text-blue-600'}`}>
                            {row.activator === 'Non' ? 'None' : row.activator}
                          </span>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${activationBadgeClass[row.activationType] || 'bg-muted text-muted-foreground'}`}>
                            {row.activationType === 'Non' ? 'None' : row.activationType}
                          </span>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: `${BLEND_COLORS[row.blend] || '#94a3b8'}18`, color: BLEND_COLORS[row.blend] || '#94a3b8' }}>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: BLEND_COLORS[row.blend] || '#94a3b8' }} />
                            {row.blend}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 font-mono text-xs">{row.surfaceArea?.toLocaleString() ?? '—'}</td>
                        <td className="py-2.5 px-2 font-mono text-xs">{row.poreVolume != null ? row.poreVolume.toFixed(6) : '—'}</td>
                        <td className="py-2.5 px-2 text-xs">{row.adsorpTemp != null ? `${row.adsorpTemp}°C` : '—'}</td>
                        <td className="py-2.5 px-2 text-xs">{row.pressure != null ? `${row.pressure} atm` : '—'}</td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-1.5">
                            {row.co2Uptake != null ? (
                              <>
                                <span className={`font-bold text-sm ${row.co2Uptake >= 6 ? 'text-green-500' : row.co2Uptake >= 4 ? 'text-blue-500' : row.co2Uptake >= 2.5 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                                  {row.co2Uptake.toFixed(3)}
                                </span>
                                {isOutlier(row.co2Uptake) && (
                                  <span
                                    title="Statistically significant variance — potential breakthrough or experimental anomaly (>1.8σ from mean)"
                                    className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold border cursor-help ${row.co2Uptake > CO2_MEAN ? 'bg-green-500/10 text-green-600 border-green-400/30' : 'bg-red-500/10 text-red-500 border-red-400/30'}`}
                                  >
                                    {row.co2Uptake > CO2_MEAN ? '↑ Outlier' : '↓ Outlier'}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-[10px] text-muted-foreground/50 italic">BET only</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-2">
                          {(() => {
                            const anom = ANOMALY_MAP.get(row.id);
                            if (!anom?.severity) return <span className="text-muted-foreground/30 text-[10px]">—</span>;
                            return (
                              <span
                                title={`Multivariate anomaly (z²=${anom.zSq}). ${anom.reasons.join(', ') || 'Extreme feature combination'}`}
                                className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold border cursor-help whitespace-nowrap ${anom.severity === 'high' ? 'bg-red-500/10 text-red-600 border-red-400/30' : 'bg-amber-500/10 text-amber-600 border-amber-400/30'}`}
                              >
                                {anom.severity === 'high' ? '⚠ High' : '~ Med'}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}