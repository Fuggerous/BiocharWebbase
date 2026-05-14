// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronDown, Thermometer, Clock, TrendingUp, FlaskConical, Database, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { TOTAL_DATA_POINTS } from '../../lib/biocharKnowledgeBase';
import { BIOMASS_LIST } from '../../lib/database44';
import OutOfRangeAlert from './OutOfRangeAlert';

const biomassOptions = BIOMASS_LIST;

const agentOptions = [
  { value: 'Non',     label: 'None (No Activation)' },
  { value: 'KOH',     label: 'KOH (Chemical)' },
  { value: 'K2CO3',   label: 'K₂CO₃ (Chemical)' },
  { value: 'KOH-CO2', label: 'KOH + CO₂ (Combined)' },
  { value: 'CO2',     label: 'CO₂ (Physical)' },
  { value: 'LiCl',    label: 'LiCl (Chemical)' },
];

// Chemical blend options — biochar composites in the database
const BLEND_OPTIONS = [
  {
    value:   'Non',
    label:   'No Blend (Pure Biochar)',
    desc:    'Standard single-species biochar — baseline configuration',
    color:   '#94a3b8',
    badge:   null,
  },
  {
    value:   '0.5PKBC',
    label:   '0.5% PKBC Composite',
    desc:    '0.5 wt% palm kernel biochar composite — low loading',
    color:   '#fb923c',
    badge:   'Low ratio',
  },
  {
    value:   '0.5TKBC',
    label:   '0.5% TKBC Composite',
    desc:    '0.5 wt% teak kernel biochar composite — low loading',
    color:   '#e879f9',
    badge:   'Low ratio',
  },
  {
    value:   '20PKBC',
    label:   '20% PKBC Composite',
    desc:    '20 wt% palm kernel biochar composite — high loading',
    color:   '#f97316',
    badge:   'High ratio',
  },
  {
    value:   '20TKBC',
    label:   '20% TKBC Composite',
    desc:    '20 wt% teak kernel biochar composite — high loading',
    color:   '#8b5cf6',
    badge:   'High ratio',
  },
];

function SliderField({ label, icon: Icon, value, min, max, step, unit, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Icon className="w-4 h-4 text-muted-foreground" />
          {label}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number" value={value} min={min} max={max} step={step}
            onChange={e => onChange(Number(e.target.value))}
            className="w-20 text-right px-2 py-1 rounded-lg bg-muted border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/30"
          />
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      <div className="relative">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #22c55e ${((value-min)/(max-min))*100}%, #e2e8f0 ${((value-min)/(max-min))*100}%)` }}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>{min}{unit}</span><span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange, isObject = false }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500/30">
          {isObject
            ? options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)
            : options.map(opt => <option key={opt} value={opt}>{opt}</option>)
          }
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

export default function PredictorForm() {
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [params,  setParams]  = useState({
    biomass:       'Corn straw',
    temperature:   600,
    residenceTime: 60,
    heatingRate:   10,
    activator:     'Non',
    chemBlend:     'Non',   // chemical blend type
  });

  const set = (k, v) => setParams(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    navigate('/results', { state: { params } });
  };

  const selectedBlend = BLEND_OPTIONS.find(b => b.value === params.chemBlend) ?? BLEND_OPTIONS[0];

  return (
    <div className="glass-card rounded-3xl p-8 border border-border max-w-2xl mx-auto">
      {/* Data badge */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 mb-6">
        <Database className="w-4 h-4 text-green-600 shrink-0" />
        <p className="text-xs text-green-700">
          <span className="font-semibold">Data Source:</span> Expert guidance based on{' '}
          <span className="font-bold">{TOTAL_DATA_POINTS.toLocaleString()} peer-reviewed experimental records</span>
        </p>
      </div>

      <div className="space-y-8">

        {/* ── Step 1: Biomass ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-green-500 text-white text-xs font-bold flex items-center justify-center">1</div>
            <h3 className="font-space font-semibold text-base">Select Biomass</h3>
          </div>
          <SelectField
            label="Biomass / Feedstock Type"
            value={params.biomass}
            options={biomassOptions}
            onChange={v => set('biomass', v)}
          />
          <p className="text-xs text-muted-foreground mt-1.5">8 species with confirmed experimental records</p>
        </div>

        <div className="border-t border-border" />

        {/* ── Step 2: Pyrolysis ── */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-blue-500 text-white text-xs font-bold flex items-center justify-center">2</div>
            <h3 className="font-space font-semibold text-base">Pyrolysis Conditions</h3>
          </div>
          <div className="space-y-6">
            <SliderField label="Pyrolysis Temperature" icon={Thermometer}
              value={params.temperature} min={350} max={900} step={50} unit="°C"
              onChange={v => set('temperature', v)} />
            <SliderField label="Residence Time" icon={Clock}
              value={params.residenceTime} min={10} max={300} step={10} unit=" min"
              onChange={v => set('residenceTime', v)} />
            <SliderField label="Heating Rate" icon={TrendingUp}
              value={params.heatingRate} min={1} max={20} step={1} unit="°C/min"
              onChange={v => set('heatingRate', v)} />
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ── Step 3: Activation ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-purple-500 text-white text-xs font-bold flex items-center justify-center">3</div>
            <h3 className="font-space font-semibold text-base">Activation Method</h3>
          </div>
          <SelectField
            label="Chemical / Physical Activator"
            value={params.activator}
            options={agentOptions}
            onChange={v => set('activator', v)}
            isObject
          />
        </div>

        <div className="border-t border-border" />

        {/* ── Step 4: Chemical Blend ── */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-cyan-500 text-white text-xs font-bold flex items-center justify-center">4</div>
            <h3 className="font-space font-semibold text-base">Chemical Blend Type</h3>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold">
              New · Limited data
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-4 ml-9">
            Select a biochar composite type. Blend refers to mixing biochar with PKBC or TKBC composites — <em>not</em> biomass mixing.
          </p>

          {/* Blend cards */}
          <div className="grid grid-cols-1 gap-2">
            {BLEND_OPTIONS.map(opt => {
              const active = params.chemBlend === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('chemBlend', opt.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    active
                      ? 'border-2 shadow-sm'
                      : 'border-border bg-muted/30 hover:bg-muted/60'
                  }`}
                  style={active ? {
                    borderColor:     opt.color,
                    background:      `${opt.color}10`,
                    boxShadow:       `0 0 0 1px ${opt.color}30`,
                  } : {}}
                >
                  {/* Color dot */}
                  <span className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: opt.color, opacity: active ? 1 : 0.4 }} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {opt.label}
                      </span>
                      {opt.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full border font-bold"
                          style={{ background: `${opt.color}15`, color: opt.color, borderColor: `${opt.color}40` }}>
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{opt.desc}</p>
                  </div>

                  {active && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: opt.color }}>
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {params.chemBlend !== 'Non' && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <Layers className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700">
                <strong>Note:</strong> Blend effect estimates are based on {' '}
                <strong>limited experimental records</strong> (3–7 blend data points).
                Results are indicative. The ML Model 04 provides a delta comparison vs pure biochar.
              </p>
            </motion.div>
          )}
        </div>

        <OutOfRangeAlert params={params} />

        {/* ── CTA ── */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl gradient-green text-white font-space font-bold text-lg glow-green hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3"
        >
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Matching Research Data...</>
          ) : (
            <><Zap className="w-5 h-5" /> Generate Expert Guidance</>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          BioPredict AI v1.7 · Statistical + ML Pipeline · Based on Historical Research Data
        </p>
      </div>
    </div>
  );
}
