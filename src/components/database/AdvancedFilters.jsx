// @ts-nocheck
import { useState } from 'react';
import { X, Filter, ChevronDown, ChevronUp, Search, ChevronRight } from 'lucide-react';
import {
  BIOMASS_SPECIES_MAP, ACTIVATOR_LIST, ACTIVATION_TYPE_LIST,
  ADSORPTION_TEMP_LIST, BLEND_LIST, BIOMASS_COLORS, DEFAULT_FILTERS,
} from '../../lib/database44';

// ── Data Type Chip Strip ──────────────────────────────────────────────────────
function DataTypeChips({ value, onChange }) {
  const options = [
    { key: 'all',      label: 'All' },
    { key: 'isotherm', label: 'Isotherm' },
    { key: 'bet',      label: 'BET Only' },
  ];
  return (
    <div className="border-b border-border pb-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Data Type</p>
      <div className="flex gap-1.5 flex-wrap">
        {options.map(o => (
          <button key={o.key} onClick={() => onChange(o.key)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${
              value === o.key
                ? 'bg-green-500 text-white border-green-500 shadow-sm'
                : 'bg-muted text-muted-foreground border-border hover:border-green-400 hover:text-foreground'
            }`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Two-Layer Biomass Filter ──────────────────────────────────────────────────
function BiomassLayerFilter({ selected, onChange }) {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState({});   // species → boolean

  const toggleExpand = (species) =>
    setExpanded(prev => ({ ...prev, [species]: !prev[species] }));

  const toggleSpecies = (species) => {
    const parts = BIOMASS_SPECIES_MAP[species];
    const allSelected = parts.every(p => selected.includes(p));
    if (allSelected) {
      onChange(selected.filter(p => !parts.includes(p)));
    } else {
      const combined = [...new Set([...selected, ...parts])];
      onChange(combined);
    }
  };

  const togglePart = (part) => {
    onChange(selected.includes(part) ? selected.filter(p => p !== part) : [...selected, part]);
  };

  const totalSelected = selected.length;

  return (
    <div className="border-b border-border pb-3">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 hover:text-foreground transition-colors">
        <span>
          Biomass Feedstock
          {totalSelected > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-600 normal-case font-bold">{totalSelected}</span>
          )}
        </span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {open && (
        <div className="space-y-0.5">
          {Object.entries(BIOMASS_SPECIES_MAP).map(([species, parts]) => {
            const selectedCount = parts.filter(p => selected.includes(p)).length;
            const allPicked = selectedCount === parts.length;
            const somePicked = selectedCount > 0 && selectedCount < parts.length;
            const isExpanded = expanded[species] ?? false;

            return (
              <div key={species}>
                {/* Species row */}
                <div className="flex items-center gap-1.5">
                  {/* Species checkbox */}
                  <button onClick={() => toggleSpecies(species)}
                    className={`w-3.5 h-3.5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                      allPicked ? 'border-green-500 bg-green-500' : somePicked ? 'border-green-400 bg-green-200' : 'border-border bg-transparent'
                    }`}>
                    {allPicked && <X className="w-2 h-2 text-white" />}
                    {somePicked && <div className="w-1.5 h-0.5 bg-green-600 rounded" />}
                  </button>

                  {/* Species label (click to toggle) */}
                  <button onClick={() => toggleSpecies(species)}
                    className={`flex-1 text-left text-xs px-1 py-1 rounded transition-colors ${
                      selectedCount > 0 ? 'text-green-700 font-semibold' : 'text-muted-foreground hover:text-foreground'
                    }`}>
                    {species}
                    {parts.length > 1 && (
                      <span className="ml-1 text-[9px] text-muted-foreground/60 font-normal">({parts.length})</span>
                    )}
                    {selectedCount > 0 && selectedCount < parts.length && (
                      <span className="ml-1 px-1 py-0.5 rounded-full bg-green-500/15 text-green-600 text-[9px] font-bold">{selectedCount}</span>
                    )}
                  </button>

                  {/* Expand arrow — only if species has multiple parts */}
                  {parts.length > 1 && (
                    <button onClick={() => toggleExpand(species)}
                      className="p-0.5 rounded hover:bg-muted transition-colors flex-shrink-0">
                      {isExpanded
                        ? <ChevronUp className="w-3 h-3 text-muted-foreground" />
                        : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                    </button>
                  )}
                </div>

                {/* Parts rows — shown when expanded */}
                {isExpanded && parts.length > 1 && (
                  <div className="ml-5 mt-0.5 space-y-0.5">
                    {parts.map(part => {
                      const active = selected.includes(part);
                      const color = BIOMASS_COLORS?.[part];
                      return (
                        <button key={part} onClick={() => togglePart(part)}
                          className={`flex items-center gap-2 w-full px-2 py-1 rounded-md text-[11px] text-left transition-all ${
                            active ? 'bg-green-500/10 text-green-700 font-semibold' : 'hover:bg-muted text-muted-foreground'
                          }`}>
                          <div className={`w-3 h-3 rounded flex-shrink-0 border flex items-center justify-center transition-all ${
                            active ? 'border-green-500 bg-green-500' : 'border-border'
                          }`}>
                            {active && <X className="w-1.5 h-1.5 text-white" />}
                          </div>
                          {color && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />}
                          <span className="truncate">
                            {/* Show just the part name (strip species prefix) */}
                            {part.toLowerCase().replace(species.toLowerCase(), '').trim() || part}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Generic Multi-Select ──────────────────────────────────────────────────────
function MultiSelectGroup({ label, options, selected, onChange, colorMap }) {
  const [open, setOpen] = useState(true);
  const toggle = (val) => onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  return (
    <div className="border-b border-border pb-3">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 hover:text-foreground transition-colors">
        <span>{label} {selected.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-600 normal-case font-bold">{selected.length}</span>
        )}</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="space-y-1">
          {options.map(opt => {
            const active = selected.includes(opt);
            const color = colorMap?.[opt];
            return (
              <button key={opt} onClick={() => toggle(opt)}
                className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs text-left transition-all ${
                  active ? 'bg-green-500/10 text-green-700 font-semibold' : 'hover:bg-muted text-muted-foreground'
                }`}>
                <div className={`w-3.5 h-3.5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  active ? 'border-green-500 bg-green-500' : 'border-border'
                }`}>
                  {active && <X className="w-2 h-2 text-white" />}
                </div>
                {color && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />}
                <span className="truncate">{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Range Filter ──────────────────────────────────────────────────────────────
function RangeFilter({ label, min, max, value, onChange, unit = '' }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border pb-3">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 hover:text-foreground transition-colors">
        <span>{label} {(value[0] !== min || value[1] !== max) && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-600 normal-case font-bold">✓</span>
        )}</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="space-y-2 px-1">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{value[0].toLocaleString()}{unit}</span>
            <span>{value[1].toLocaleString()}{unit}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-5">Min</span>
              <input type="range" min={min} max={max} value={value[0]}
                onChange={e => onChange([Math.min(Number(e.target.value), value[1]), value[1]])}
                className="flex-1 h-1.5 accent-green-500 cursor-pointer" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-5">Max</span>
              <input type="range" min={min} max={max} value={value[1]}
                onChange={e => onChange([value[0], Math.max(Number(e.target.value), value[0])])}
                className="flex-1 h-1.5 accent-green-500 cursor-pointer" />
            </div>
          </div>
          <div className="flex gap-1.5">
            <input type="number" min={min} max={value[1]} value={value[0]}
              onChange={e => onChange([Math.min(Number(e.target.value), value[1]), value[1]])}
              className="w-full px-2 py-1 rounded-md bg-muted border border-border text-[10px] focus:outline-none focus:ring-1 focus:ring-green-500/40" />
            <span className="text-muted-foreground text-xs self-center">–</span>
            <input type="number" min={value[0]} max={max} value={value[1]}
              onChange={e => onChange([value[0], Math.max(Number(e.target.value), value[0])])}
              className="w-full px-2 py-1 rounded-md bg-muted border border-border text-[10px] focus:outline-none focus:ring-1 focus:ring-green-500/40" />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Filters Panel ────────────────────────────────────────────────────────
export default function AdvancedFilters({ filters, onChange, resultCount, totalCount }) {
  const setFilter = (key, val) => onChange({ ...filters, [key]: val });

  const activeCount = [
    filters.biomass.length > 0,
    filters.activator.length > 0,
    filters.activationType.length > 0,
    filters.blend.length > 0,
    filters.adsorpTemp.length > 0,
    filters.surfaceAreaRange[0] !== 0 || filters.surfaceAreaRange[1] !== 3200,
    filters.poreVolRange[0] !== 0 || filters.poreVolRange[1] !== 1600,
    filters.co2Range[0] !== 0 || filters.co2Range[1] !== 8,
    filters.pyroTempRange[0] !== 300 || filters.pyroTempRange[1] !== 900,
    filters.search !== '',
    filters.dataType !== 'all',
  ].filter(Boolean).length;

  const clearAll = () => onChange(DEFAULT_FILTERS);

  return (
    <div className="glass-card rounded-2xl p-4 border border-border sticky top-20 space-y-3 max-h-[calc(100vh-6rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-green-500" />
          <span className="font-space font-semibold text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-600 text-[10px] font-bold">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-[10px] text-muted-foreground hover:text-red-500 flex items-center gap-1 transition-colors">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative border-b border-border pb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input type="text" placeholder="Search biomass, activator…" value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-2 focus:ring-green-500/30" />
      </div>

      {/* Data type chip */}
      <DataTypeChips value={filters.dataType} onChange={v => setFilter('dataType', v)} />

      {/* Two-layer biomass */}
      <BiomassLayerFilter selected={filters.biomass} onChange={v => setFilter('biomass', v)} />

      <MultiSelectGroup label="Activator" options={ACTIVATOR_LIST} selected={filters.activator}
        onChange={v => setFilter('activator', v)} />
      <MultiSelectGroup label="Activation Type" options={ACTIVATION_TYPE_LIST} selected={filters.activationType}
        onChange={v => setFilter('activationType', v)} />
      <MultiSelectGroup label="Blend / Composite" options={BLEND_LIST} selected={filters.blend}
        onChange={v => setFilter('blend', v)} />
      <MultiSelectGroup label="Adsorption Temp (°C)" options={ADSORPTION_TEMP_LIST.map(String)} selected={filters.adsorpTemp}
        onChange={v => setFilter('adsorpTemp', v)} />

      <RangeFilter label="BET Surface Area" min={0} max={3200} value={filters.surfaceAreaRange}
        onChange={v => setFilter('surfaceAreaRange', v)} unit=" m²/g" />
      <RangeFilter label="Pore Volume (×10⁻³)" min={0} max={1600} value={filters.poreVolRange}
        onChange={v => setFilter('poreVolRange', v)} unit="" />
      <RangeFilter label="CO₂ Uptake" min={0} max={8} value={filters.co2Range}
        onChange={v => setFilter('co2Range', v)} unit=" mmol/g" />
      <RangeFilter label="Pyrolysis Temp" min={300} max={900} value={filters.pyroTempRange}
        onChange={v => setFilter('pyroTempRange', v)} unit="°C" />

      {/* Result count */}
      <div className="pt-1 text-center">
        <p className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">{resultCount}</span> of {totalCount} records
        </p>
      </div>
    </div>
  );
}
