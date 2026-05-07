import { useState } from 'react';
import { Filter, ChevronDown, Search, X } from 'lucide-react';

const feedstockTypes = ['All', 'Agricultural Waste', 'Wood', 'Sludge', 'Municipal Solid Waste', 'Food Waste', 'Crop Residue'];
const activationMethods = ['All', 'Physical (Steam)', 'Chemical (NaOH)', 'Chemical (KOH)', 'Chemical (H₃PO₄)', 'CO₂ Activation', 'None'];
const tempRanges = ['All', '< 400°C', '400–600°C', '600–800°C', '800–1000°C', '> 1000°C'];

function FilterGroup({ label, options, selected, onChange }) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{label}</label>
      <div className="space-y-1.5">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              selected === opt
                ? 'bg-green-500/10 text-green-600 font-semibold border border-green-500/20'
                : 'hover:bg-muted text-foreground/70'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DatabaseFilters({ filters, onChange }) {
  return (
    <aside className="w-full">
      <div className="glass-card rounded-2xl p-5 border border-border sticky top-20">
        <div className="flex items-center gap-2 mb-5">
          <Filter className="w-4 h-4 text-green-500" />
          <h3 className="font-space font-semibold text-sm">Filters</h3>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search datasets..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"
            value={filters.search || ''}
            onChange={e => onChange({ ...filters, search: e.target.value })}
          />
        </div>

        <FilterGroup
          label="Feedstock Type"
          options={feedstockTypes}
          selected={filters.feedstock || 'All'}
          onChange={val => onChange({ ...filters, feedstock: val })}
        />
        <FilterGroup
          label="Activation Method"
          options={activationMethods}
          selected={filters.activation || 'All'}
          onChange={val => onChange({ ...filters, activation: val })}
        />
        <FilterGroup
          label="Temperature Range"
          options={tempRanges}
          selected={filters.temp || 'All'}
          onChange={val => onChange({ ...filters, temp: val })}
        />

        <button
          onClick={() => onChange({ feedstock: 'All', activation: 'All', temp: 'All', search: '' })}
          className="w-full mt-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" /> Clear Filters
        </button>
      </div>
    </aside>
  );
}